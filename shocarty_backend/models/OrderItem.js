import mongoose from "mongoose";

const orderItem = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  priceAtPurchase: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("OrderItem", orderItem);
