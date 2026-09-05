import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    pinCode: {
      type: Number,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Placed", "Paid", "Failed", "Cancelled", "Delivered"],
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["Cod", "Online"],
    },
  },
  { timestamps: true },
);

orderSchema.plugin(mongoosePaginate);
export default mongoose.model("Order", orderSchema);

// TOTAL 36 API ROUTES

// router.post("/addtocart", auth, isCustomer, addToCart);✅
// router.post("/updatecart/", auth, isCustomer, updateCartItem);✅
// router.get("/getcartitems", auth, isCustomer, getCartItems);✅
// router.get("/emptycart", auth, isCustomer, emptyCart);✅

// router.get("/categoryshowcase",categoryShowCase)✅
// router.post("/addcategory", auth, isAdmin, addCategory);✅
// router.get("/getcategory", normalLimiter, auth, isAdmin, getCategory);✅
// router.post("/editcategory", auth, isAdmin, editCategory);✅
// router.delete("/deletecategory", auth, isAdmin, deleteCategory);✅
// router.post("/paginatecategory", auth, isAdmin, paginateCategory);✅

// router.post("/placeorder", auth, isCustomer, placeOrder);❗✅
// router.post("/verifypayment", auth, isCustomer, verifyPayment);❗
// router.post("/deliverorder", auth, isAdmin, deliverOrder);✅
// router.post("/getorders", auth, isCustomer, getOrders);✅
// router.post("/cancelorder", auth, cancelOrder);✅
// router.post("/markpaymentfailed",auth,isCustomer,markPaymentFailed)❗

// router.post("/getproduct", getProduct);✅
// router.post("/addproduct", auth, isAdmin, addProduct);✅
// router.post("/updateproduct", auth, isAdmin, updateProduct);✅
// router.post("/deleteproduct", auth, isAdmin, deleteProduct);✅
// router.post("/getallproducts", auth, isAdmin, getAllProducts);✅
// router.post("/searchfilter", searchLimiter, searchFilter);✅

// router.post("/sendotp", sendOtp);✅
// router.post("/signup", signUp);✅
// router.post("/login", login);✅
// router.get("/refreshtoken", refreshToken);✅
// router.post("/resetpasswordtoken", resetPasswordToken);✅
// router.post("/verifyresettoken", verifyResetToken);✅
// router.post("/changepassword", auth, changePassword);
// router.get("/logout", auth, logout);✅
// router.post("/block", auth, isAdmin, blockUser); ✅//only admin can block
// router.post("/unblock", auth, isAdmin, unBlockUser);✅ //only admin can un block

// router.get("/getuserdetails", auth, getUserDetails);✅
// router.post("/getallusers", auth, isAdmin, getAllUsers);✅
// router.post("/updateprofile", auth, updateProfile);✅
// router.post("/contactUs", normalLimiter, contactUs);✅
