import mongoose from "mongoose";
import { ENV } from "./Env.js";

export const dbConnect = async () => {
  try {
    await mongoose.connect(ENV.MONGODB_URL);
    console.log("DATABASE CONNECTED SUCCESSFULLY");
  } catch (error) {
    console.log(`Error: ${error.message} failed to database connect`);
    process.exit(1);
  }
};
