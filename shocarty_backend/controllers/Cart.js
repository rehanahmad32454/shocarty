import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import CartItem from "../models/CartItem.js";
import Product from "../models/Product.js";
import { errorResponse, successResponse } from "../utils/helpers/response.js";
import { isEmpty, isValidMongoId } from "../utils/validation/validate.js";

export const addToCart = async (req, res) => {
  let session;
  try {
    console.log("Cart : addToCart() : Exceution Start");
    const userId = req.user._id;
    const { productId } = req.body;
    if (!isValidMongoId(productId)) {
      return errorResponse(res, {
        message: "Invalid mongoid",
        statusCode: 422,
      });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return errorResponse(res, {
        message: "Product not exist",
        statusCode: 404,
      });
    }
    session = await mongoose.startSession();
    session.startTransaction();
    let cart = await Cart.findOne({ userId: userId }).session(session);
    if (!cart) {
      [cart] = await Cart.create([{ userId: userId }], { session });
    }
    const existProduct = await CartItem.findOne({
      productId: productId,
      cartId: cart._id,
    }).session(session);
    if (existProduct) {
      existProduct.quantity += 1;
      await existProduct.save({ session });
    } else {
      await CartItem.create(
        [
          {
            cartId: cart._id,
            productId: product._id,
            priceAtAdd: product.productPrice,
            thumbnail: product.productThumbnail,
            quantity: 1,
          },
        ],
        { session },
      );
    }
    const items = await CartItem.find({ cartId: cart._id })
      .session(session)
      .lean();
    let total = 0;
    for (let item of items) {
      total += item.priceAtAdd * item.quantity;
    }
    cart.totalPrice = total;
    const cartData = await cart.save({ session });
    cartData.cartItems = items;
    let totalItems = await CartItem.countDocuments({
      cartId: cart._id,
    }).session(session);
    await session.commitTransaction();
    console.log("Cart : addToCart() : Exceution End");
    return successResponse(res, {
      data: { cart: { ...cartData.toObject(), cartItems: items, totalItems } },
      message: "Product added to cart",
    });
  } catch (error) {
    if (session?.inTransaction()) {
      await session.abortTransaction();
    }
    console.log(`Error: ${error.message} failed to add item to cart`);
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

export const updateCartItem = async (req, res) => {
  let session;
  try {
    console.log("Cart : updateCart() : Exceution Start");
    let userId = req.user._id;
    const { cartItemId, quantity } = req.body;
    let parsedQuantity = parseInt(quantity);
    if (!isValidMongoId(cartItemId)) {
      return errorResponse(res, {
        message: "Invalid mongoid",
        statusCode: 422,
      });
    }
    if (isEmpty(parsedQuantity)) {
      return errorResponse(res, {
        message: "Quantity is required",
        statusCode: 400,
      });
    }
    if (parsedQuantity < 0) {
      return errorResponse(res, {
        message: "Minimum 1 quantity required",
        statusCode: 400,
      });
    }
    let cartItem = await CartItem.findById(cartItemId);
    if (!cartItem) {
      return errorResponse(res, {
        message: "Item is not available in cart",
        statusCode: 404,
      });
    }
    const cart = await Cart.findOne({
      _id: cartItem.cartId,
      userId: userId,
    });
    if (!cart) {
      return errorResponse(res, {
        message: "Item is not available in cart",
        statusCode: 404,
      });
    }
    session = await mongoose.startSession();
    session.startTransaction();
    if (parsedQuantity === 0) {
      await CartItem.findByIdAndDelete(cartItemId).session(session);
    } else {
      cartItem.quantity = parsedQuantity;
      await cartItem.save({ session });
    }
    const items = await CartItem.find({ cartId: cart._id }).session(session);
    let total = 0;
    for (let item of items) {
      total += item.priceAtAdd * item.quantity;
    }
    cart.totalPrice = total;
    cart.cartItem = items;
    console.log("Cart : updateCart() : Exceution End");
    await cart.save({ session });
    await session.commitTransaction();
    const cartData = await Cart.findById(cart._id).lean();
    const cartItems = await CartItem.find({ cartId: cart._id });
    cartData.cartItems = cartItems;
    cartData.totalItems = cartItems.length;
    return successResponse(res, {
      data: { cart: cartData },
      message: "Cart data updated successfully",
    });
  } catch (error) {
    if (session?.inTransaction()) {
      await session.abortTransaction();
    }
    console.log(`Error: ${error.message} failed to update cart item`);
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

export const getCartItems = async (req, res) => {
  try {
    console.log("Cart : getCartItems() : Exceution Start");
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId: userId }).lean();
    if (!cart) {
      return errorResponse(res, {
        message: "Item is not available in cart",
        statusCode: 404,
      });
    }
    const cartItems = await CartItem.find({ cartId: cart._id }).lean();
    if (cartItems.length === 0) {
      return errorResponse(res, {
        message: "Item is not available in cart",
        statusCode: 404,
      });
    }
    cart.cartItems = cartItems;
    cart.totalItems = cartItems.length;
    console.log("Cart : getCartItems() : Exceution End");
    return successResponse(res, {
      data: { cart },
      message: "Cart data fetched successfully",
    });
  } catch (error) {
    console.log(`Error: ${error.message} failed to get items from cart`);
    return errorResponse(res, {
      error: error.message,
      message: "Internal server error",
    });
  }
};

export const emptyCart = async (req, res) => {
  let session;
  try {
    console.log("Cart : emptyCart() : Exceution End");
    const userId = req.user._id;
    const existCart = await Cart.findOne({ userId: userId });
    if (!existCart) {
      return errorResponse(res, {
        message: "Item is not available in cart",
        statusCode: 404,
      });
    }
    const cartItems = await CartItem.find({ cartId: existCart._id }).lean();
    if (cartItems.length === 0) {
      return errorResponse(res, {
        message: "Item is not available in cart",
        statusCode: 404,
      });
    }
    session = await mongoose.startSession();
    session.startTransaction();
    await Cart.findOneAndDelete({ userId: userId }).session(session);
    await CartItem.deleteMany({ cartId: existCart._id }, { session });
    await session.commitTransaction();
    console.log("Cart : emptyCart() : Exceution End");
    return successResponse(res, { message: "All items deleted from cart" });
  } catch (error) {
    if (session?.inTransaction()) {
      await session.abortTransaction();
    }
    console.log(`Error: ${error.message} failed to empty cart`);
    return errorResponse(res, {
      error: error.message,
      message: "Internal server error",
    });
  } finally {
    await session.endSession();
  }
};
