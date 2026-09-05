import mongoose from "mongoose";

const resetPasswordTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    default: Date.now,
    expires: "7d",
  },
});

export default mongoose.model("ResetToken", resetPasswordTokenSchema);
