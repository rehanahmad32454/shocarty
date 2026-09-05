import express from "express";
import {
  addToCart,
  emptyCart,
  getCartItems,
  updateCartItem,
} from "../controllers/Cart.js";
import { auth, isCustomer } from "../middlewares/auth.js";
import { doubleCsrfProtection } from "../middlewares/csrf.js";
import { normalLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post(
  "/addtocart",
  normalLimiter,
  auth,
  doubleCsrfProtection,
  isCustomer,
  addToCart,
);
router.patch(
  "/updatecartitem",
  normalLimiter,
  auth,
  doubleCsrfProtection,
  isCustomer,
  updateCartItem,
);
router.get("/getcartitems", normalLimiter, auth, isCustomer, getCartItems);
router.delete(
  "/emptycart",
  normalLimiter,
  auth,
  doubleCsrfProtection,
  isCustomer,
  emptyCart,
);

export default router;
