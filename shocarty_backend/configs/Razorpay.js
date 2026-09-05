import Razorpay from "razorpay";
import { ENV } from "./Env.js";

export const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: ENV.RAZORPAY_KEY,
    key_secret: ENV.RAZORPAY_SECRET,
  });
};
