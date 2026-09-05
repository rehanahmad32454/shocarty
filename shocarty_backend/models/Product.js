import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required:true
    },
    productName: {
      type: String,
      required: true,
    },
    productDescription: {
      type: String,
      required: true,
    },
    productPrice: {
      type: String,
      required: true,
    },
    productThumbnail: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

productSchema.plugin(mongoosePaginate);

export default mongoose.model("Product", productSchema);
