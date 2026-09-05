import express from "express";
import { auth, isAdmin } from "../middlewares/auth.js";
import {
  addCategory,
  categoryShowCase,
  deleteCategory,
  editCategory,
  getCategory,
  paginateCategory,
} from "../controllers/Category.js";
import { doubleCsrfProtection } from "../middlewares/csrf.js";
import { normalLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.get("/categoryshowcase", categoryShowCase);
router.post(
  "/addcategory",
  normalLimiter,
  auth,
  doubleCsrfProtection,
  isAdmin,
  addCategory,
);

router.get("/getcategory", normalLimiter, auth, isAdmin, getCategory);

router.patch(
  "/editcategory",
  normalLimiter,
  auth,
  doubleCsrfProtection,
  isAdmin,
  editCategory,
);
router.delete(
  "/deletecategory",
  normalLimiter,
  auth,
  doubleCsrfProtection,
  isAdmin,
  deleteCategory,
);
router.post(
  "/paginatecategory",
  normalLimiter,
  auth,
  isAdmin,
  paginateCategory,
);

router.post("/categoryShowCase", normalLimiter, categoryShowCase);
export default router;
