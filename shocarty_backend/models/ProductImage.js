import mongoose from "mongoose";

const productImageSchema = new mongoose.Schema({
  Image: {
    type: String,
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});

export default mongoose.model("ProductImage", productImageSchema);
