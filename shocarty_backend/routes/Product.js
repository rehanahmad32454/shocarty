import express from "express";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  searchFilter,
  updateProduct,
} from "../controllers/Product.js";
import { auth, isAdmin } from "../middlewares/auth.js";
import { cleanupTempFile } from "../middlewares/cleanupTempFiles.js";
import { doubleCsrfProtection } from "../middlewares/csrf.js";
import { normalLimiter, searchLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/getproduct", normalLimiter, getProduct);
router.post(
  "/addproduct",
  normalLimiter,
  auth,
  isAdmin,
  doubleCsrfProtection,
  cleanupTempFile,
  addProduct,
);
router.patch(
  "/updateproduct",
  normalLimiter,
  auth,
  isAdmin,
  doubleCsrfProtection,
  cleanupTempFile,
  updateProduct,
);
router.delete(
  "/deleteproduct",
  normalLimiter,
  auth,
  isAdmin,
  doubleCsrfProtection,
  deleteProduct,
);
router.post(
  "/getallproducts",
  normalLimiter,
  auth,
  isAdmin,
  getAllProducts,
);
router.post("/searchfilter", searchLimiter, searchFilter);

export default router;
