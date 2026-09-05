import Cart from "../models/Cart.js";
import CartItem from "../models/CartItem.js";
import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import { getRazorpayInstance } from "../configs/Razorpay.js";
import {
  isEmpty,
  isValidPaymentMethod,
  isValidMongoId,
  isValidContactNumber,
} from "../utils/validation/validate.js";
import Crypto from "crypto";
import { ENV } from "../configs/Env.js";
import { APP_CONFIG } from "../constants/appConfig.js";
import { successResponse, errorResponse } from "../utils/helpers/response.js";
import mongoose from "mongoose";
import { cloudinaryImageUploader } from "../utils/helpers/imageUploader.js";

const {
  ROLE: { ADMIN },
  ORDERSTATUS: { PENDING, PLACED, PAID, FAILED, CANCELLED, DELIVERED },
  PAYEMENTSTAUS: { COD, ONLINE },
} = APP_CONFIG;
const { SHOCARTY_ORDER, RAZORPAY_SECRET } = ENV;
const { DEFAULT_PAGE, DEFAULT_LIMIT } = APP_CONFIG;

export const placeOrder = async (req, res) => {
  console.log("Payments : placeOrder() : Exceution Start");
  const { address, pinCode, contactNumber, paymentMethod } = req.body;
  let razorpay = getRazorpayInstance();
  let session;
  let uploadedPublicIds = [];
  try {
    const userId = req.user._id;
    if (isEmpty(address) || isEmpty(pinCode) || isEmpty(paymentMethod)) {
      return errorResponse(res, {
        message: "All fields are required",
        statusCode: 400,
      });
    }
    if (!isValidContactNumber(contactNumber)) {
      return errorResponse(res, {
        message: "Invalid contact number",
        statusCode: 400,
      });
    }
    if (!isValidPaymentMethod(paymentMethod)) {
      return errorResponse(res, {
        message: "Invalid payment method",
        statusCode: 400,
      });
    }
    const cart = await Cart.findOne({ userId: userId });
    if (!cart) {
      return errorResponse(res, {
        message: "Cart is empty",
        statusCode: 404,
      });
    }
    const cartItems = await CartItem.find({ cartId: cart._id }).lean();
    if (cartItems.length === 0) {
      return errorResponse(res, {
        message: "No items in cart",
        statusCode: 404,
      });
    }
    let newCartItems = await Promise.all(
      cartItems.map(async (item) => {
        let uploadOrderImages = await cloudinaryImageUploader(
          item.thumbnail,
          SHOCARTY_ORDER,
        );
        uploadedPublicIds.push(uploadOrderImages.public_id);
        return {
          ...item,
          thumbnail: uploadOrderImages.secure_url,
        };
      }),
    );
    let totalPrice = 0;
    session = await mongoose.startSession();
    session.startTransaction();
    let [order] = await Order.create(
      [
        {
          userId,
          address,
          pinCode,
          contactNumber,
          totalPrice: 0,
          orderStatus: paymentMethod === COD ? PLACED : PENDING,
          paymentMethod,
        },
      ],
      { session },
    );
    let orderItems = newCartItems.map((item) => {
      const price = parseFloat(item.priceAtAdd);
      const quantity = parseFloat(item.quantity);
      totalPrice += price * quantity;
      return {
        orderId: order._id,
        thumbnail: item.thumbnail,
        productId: item.productId,
        priceAtPurchase: item.priceAtAdd,
        quantity: item.quantity,
      };
    });
    await OrderItem.insertMany(orderItems, { session });
    order.totalPrice = totalPrice;
    await order.save({ session });
    console.log("Payments : placeOrder() : Exceution End");
    if (paymentMethod === COD) {
      await CartItem.deleteMany({ cartId: cart._id }, { session });
      cart.totalPrice = 0;
      await cart.save({ session });
    }
    await session.commitTransaction();
    if (paymentMethod === ONLINE) {
      const options = {
        amount: totalPrice * 100,
        currency: "INR",
        receipt: `ord_${Math.random().toString(36).slice(2, 10)}`,
      };
      const razorPayOrder = await razorpay.orders.create(options);
      return successResponse(res, {
        data: { razorPayOrder },
        statusCode: 201,
        message: "Order created successfully",
      });
    }
    return successResponse(res, {
      message: "Order placed cod",
      statusCode: 201,
    });
  } catch (error) {
    console.log(`Error: ${error.message} failed to place order`);
    if (session?.inTransaction()) {
      await session.abortTransaction();
    }
    await Promise.all(
      uploadedPublicIds.map((pid) => cloudinaryImageRemover(pid)),
    );
    return errorResponse(res, {
      error: error.message,
      message: "Internal server error",
    });
  } finally {
    if (session) {
      await session.endSession();
    }
  }
};

export const verifyPayment = async (req, res) => {
  let session;
  try {
    console.log("Payments : verifyPayment() : Exceution Start");
    const userId = req.user._id;
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const orderId = req.body?.orderId;
    if (!isValidMongoId(orderId)) {
      return errorResponse(res, {
        message: "Invalid mongoid",
        statusCode: 422,
      });
    }
    if (
      isEmpty(razorpay_order_id) ||
      isEmpty(razorpay_payment_id) ||
      isEmpty(razorpay_signature)
    ) {
      return errorResponse(res, {
        message: "Missing payment details",
        statusCode: 400,
      });
    }
    const order = await Order.findOne({ _id: orderId, userId: userId });
    if (!order) {
      return errorResponse(res, {
        message: "Order not found",
        statusCode: 404,
      });
    }
    if (order.orderStatus === PAID) {
      return errorResponse(res, {
        message: "Order already paid",
        statusCode: 409,
      });
    }
    const generatedSignature = Crypto.createHmac("sha256", RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");
    if (generatedSignature !== razorpay_signature) {
      order.orderStatus = FAILED;
      await order.save();
      return errorResponse(res, {
        message: "Payment verification failed",
        statusCode: 400,
      });
    }
    session = await mongoose.startSession();
    session.startTransaction();
    order.orderStatus = PAID;
    await order.save({ session });
    const cart = await Cart.findOne({ userId: userId }).session(session);
    if (cart) {
      await CartItem.deleteMany({ cartId: cart._id }, { session });
      cart.totalPrice = 0;
      await cart.save({ session });
    }
    await session.commitTransaction();
    console.log("Payments : verifyPayment() : Exceution End");
    return successResponse(res, {
      message: "Payment completed successfully",
    });
  } catch (error) {
    if (session?.inTransaction()) {
      await session.abortTransaction();
    }
    console.log(`Error: ${error.message} failed to verify payment`);
    return errorResponse(res, {
      error: error.message,
      message: "Internal server error",
    });
  } finally {
    if (session) {
      await session.endSession();
    }
  }
};

export const markPaymentFailed = async (req, res) => {
  let userId = req.user._id;
  try {
    console.log("Payments : markPaymentFailed() : Exceution Start");
    const { orderId } = req.body;
    if (!isValidMongoId(orderId)) {
      return errorResponse(res, {
        message: "Invalid mongoid",
        statusCode: 422,
      });
    }
    const order = await Order.findOne({ _id: orderId, userId: userId });
    if (!order) {
      return errorResponse(res, {
        message: "Order not found",
        statusCode: 404,
      });
    }
    if (order.orderStatus === PAID) {
      return errorResponse(res, {
        message: "Order already paid",
        statusCode: 409,
      });
    }
    order.orderStatus = FAILED;
    await order.save();
    console.log("Payments : markPaymentFailed() : Exceution End");
    return successResponse(res, {
      message: "Order marked as failed",
    });
  } catch (error) {
    console.log(`Error: ${error.message} failed to mark payment failed`);
    return errorResponse(res, {
      error: error.message,
      message: "Internal server error",
    });
  }
};

export const deliverOrder = async (req, res) => {
  let role = req.user.role;
  try {
    console.log("Payments : deliverOrder() : Exceution Start");
    const { orderId } = req.body;
    if (!isValidMongoId(orderId)) {
      return errorResponse(res, {
        message: "Invalid mongoid",
        statusCode: 422,
      });
    }
    let query = { orderStatus: { $ne: DELIVERED } };
    if (role === ADMIN) {
      query._id = orderId;
    } else {
      query._id = null;
    }
    const order = await Order.findOne(query);
    if (!order) {
      return errorResponse(res, {
        message: "Order not found or already delivered",
        statusCode: 400,
      });
    }
    order.orderStatus = DELIVERED;
    await order.save();
    console.log("Payments : deliverOrder() : Exceution End");
    return successResponse(res, { message: "Order delivered successfully" });
  } catch (error) {
    console.log(`Error: ${error.message} failed to deliver order`);
    return errorResponse(res, {
      error: error.message,
      message: "Internal server error",
    });
  }
};

export const cancelOrder = async (req, res) => {
  let userId = req.user._id;
  const role = req.user.role;
  try {
    console.log("Payments : cancelOrder() : Exceution Start");
    const { orderId } = req.body;
    if (!isValidMongoId(orderId)) {
      return errorResponse(res, {
        message: "Invalid mongoid",
        statusCode: 422,
      });
    }
    let query = {
      _id: orderId,
      orderStatus: { $ne: DELIVERED },
    };
    if (role !== ADMIN) {
      query.userId = userId;
    }
    const order = await Order.findOne(query);
    if (!order) {
      return errorResponse(res, {
        message: "Order not found or already paid",
        statusCode: 409,
      });
    }
    if (order.orderStatus === CANCELLED) {
      return errorResponse(res, {
        message: "Order already cancelled",
        statusCode: 409,
      });
    }
    order.orderStatus = CANCELLED;
    await order.save();
    console.log("Payments : cancelOrder() : Exceution End");
    return successResponse(res, { message: "Order cancelled successfully" });
  } catch (error) {
    console.log(`Error: ${error.message} failed to cancel order`);
    return errorResponse(res, {
      error: error.message,
      message: "Internal server error",
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    console.log("Payments : getOrders() : Exceution Start");
    const userId = req.user._id;
    const role = req.user.role;
    const { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = req.query;
    let query = {};
    if (role !== ADMIN) {
      query.userId = userId;
    }
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
    };
    const orders = await Order.paginate(query, {
      ...options,
      lean: true,
      leanWithId: false,
    });
    if (orders.docs.length === 0) {
      return errorResponse(res, {
        message: "Orders not found",
        statusCode: 404,
      });
    }
    const data = {
      orders: orders.docs,
      total: orders.totalDocs,
      page: orders.page,
      totalPages: orders.totalPages,
    };
    const orderIds = data.orders.map((order) => order._id);
    const items = await OrderItem.find({ orderId: { $in: orderIds } });
    const allDatas = data.orders.map((order) => ({
      ...order,
      orderItems: items.filter(
        (itm) => itm.orderId.toString() === order._id.toString(),
      ),
    }));
    data.orders = allDatas;
    console.log("Payments : getOrders() : Exceution End");
    return successResponse(res, {
      data: {
        orders: allDatas,
        total: orders.totalDocs,
        page: orders.page,
        totalPages: orders.totalPages,
      },
      message: "Orders fetched successfully",
    });
  } catch (error) {
    console.log(`Error: ${error.message} failed to get orders`);
    return errorResponse(res, {
      error: error.message,
      message: "Internal server error",
    });
  }
};

// Perfect — this is the moment where a **visual timeline** will make everything click.

// I’ll show BOTH versions side by side so you *see exactly why version 2 breaks immediately*.

// ---

// # 🧪 Example setup

// ```js id="data"
// cartItems = [A, B, C]
// cloudinaryImageUploader = async operation (takes time)
// ```

// ---

// # 🚀 VERSION 1 (CORRECT: async + await)

// ```js
// const result = await Promise.all(
//   cartItems.map(async (itm) => {
//     const image = await cloudinaryImageUploader(itm.thumbnail);

//     return {
//       ...itm,
//       thumbnail: image.secure_url,
//     };
//   })
// );
// ```

// ---

// ## ⏱️ VISUAL TIMELINE (Version 1)

// ```
// t = 0ms
// ────────────────────────────
// map starts

// A → upload starts 🔄
// B → upload starts 🔄
// C → upload starts 🔄
// (all run in parallel)

// ────────────────────────────
// t = 50ms

// A → waiting ⏳
// B → waiting ⏳
// C → waiting ⏳

// ────────────────────────────
// t = 120ms

// B finishes ✔
// A still running ⏳
// C still running ⏳

// ────────────────────────────
// t = 180ms

// A finishes ✔
// C still running ⏳

// ────────────────────────────
// t = 220ms

// C finishes ✔

// ────────────────────────────
// Promise.all collects:
// ✔ A result
// ✔ B result
// ✔ C result

// FINAL OUTPUT returned
// ```

// ---

// # 💥 VERSION 2 (BROKEN: NO await inside map)

// ```js
// const result = await Promise.all(
//   cartItems.map((itm) => {
//     const image = cloudinaryImageUploader(itm.thumbnail);

//     return {
//       ...itm,
//       thumbnail: image.secure_url,
//     };
//   })
// );
// ```

// ---

// ## ⏱️ VISUAL TIMELINE (Version 2)

// ```
// t = 0ms
// ────────────────────────────
// map starts

// A → cloudinaryImageUploader() returns PROMISE ❗
// B → returns PROMISE ❗
// C → returns PROMISE ❗

// BUT you do NOT wait

// ────────────────────────────
// t = 1ms (IMPORTANT)

// return happens IMMEDIATELY:

// A → thumbnail = undefined ❌
// B → thumbnail = undefined ❌
// C → thumbnail = undefined ❌

// ────────────────────────────
// t = 100ms

// Cloudinary finishes in background ✔
// BUT your code already returned WRONG data

// ────────────────────────────
// FINAL RESULT:

// [
//   { thumbnail: undefined },
//   { thumbnail: undefined },
//   { thumbnail: undefined }
// ]
// ```

// ---

// # 🔥 KEY DIFFERENCE (MOST IMPORTANT PART)

// ## ✔ Version 1

// ```
// wait → get real image → return correct object
// ```

// ## ❌ Version 2

// ```
// return immediately → Promise not resolved → broken data
// ```

// ---

// # 🧠 One-line truth

// > `await` controls WHEN you get data
// > `Promise.all` controls HOW MANY run together
// > missing `await` = you are using data before it exists

// ---

// # ⚡ Why version 2 “breaks instantly”

// Because this line:

// ```js
// image.secure_url
// ```

// runs BEFORE:

// ```js
// cloudinaryImageUploader finishes
// ```

// So `image` is still:

// ```
// Promise (not real object)
// ```

// ---

// # ✔️ FINAL ANSWER

// 👉 Version 1 = correct parallel + correct data
// 👉 Version 2 = parallel yes, but returns **undefined data immediately**
// 👉 That’s why version 2 “breaks instantly”

// ---

// If you want, I can show you a **“3-second rule to decide async vs non-async map instantly”** — it removes 100% of this confusion in backend code.
