import express from "express";
import { auth, isAdmin, isCustomer } from "../middlewares/auth.js";
import {
  cancelOrder,
  deliverOrder,
  getOrders,
  markPaymentFailed,
  placeOrder,
  verifyPayment,
} from "../controllers/Order.js";
import { doubleCsrfProtection } from "../middlewares/csrf.js";
import { normalLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post(
  "/placeorder",
  normalLimiter,
  auth,
  isCustomer,
  doubleCsrfProtection,
  placeOrder,
);
router.post(
  "/verifypayment",
  normalLimiter,
  auth,
  isCustomer,
  doubleCsrfProtection,
  verifyPayment,
);
router.post(
  "/deliverorder",
  normalLimiter,
  auth,
  isAdmin,
  doubleCsrfProtection,
  deliverOrder,
);
router.post("/getorders", normalLimiter, auth, getOrders);
router.post(
  "/cancelorder",
  normalLimiter,
  auth,
  doubleCsrfProtection,
  cancelOrder,
);
router.post(
  "/markpaymentfailed",
  normalLimiter,
  auth,
  isCustomer,
  doubleCsrfProtection,
  markPaymentFailed,
);
export default router;
