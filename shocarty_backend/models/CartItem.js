import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  cartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
  },
  thumbnail: {
    type: String,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  priceAtAdd: {
    type: Number,
  },
  quantity: {
    type: Number,
  },
});

export default mongoose.model("CartItem", cartItemSchema);