import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  gender: {
    type: String,
  },
  dateOfBirth: {
    type: String,
  },
  about: {
    type: String,
  },
  contactNumber: {
    type: String,
  },
});

export default mongoose.model("Profile", profileSchema);
