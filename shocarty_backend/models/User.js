import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Admin", "Customer"],
      required: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    updatePassword: {
      type: Boolean,
    },
  },
  { timestamps: true },
);

userSchema.plugin(mongoosePaginate);

export default mongoose.model("User", userSchema);
