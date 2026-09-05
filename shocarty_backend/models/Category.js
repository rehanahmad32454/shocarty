import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

categorySchema.plugin(mongoosePaginate);

export default mongoose.model("Category", categorySchema);
