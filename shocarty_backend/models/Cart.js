import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    totalPrice: {
      type: Number,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Cart", cartSchema);
