import express from "express";
import { auth, isAdmin } from "../middlewares/auth.js";
import {
  contactUs,
  getAllUsers,
  getUserDetails,
  updateProfile,
} from "../controllers/User.js";
import { cleanupTempFile } from "../middlewares/cleanupTempFiles.js";
import { doubleCsrfProtection } from "../middlewares/csrf.js";
import { authLimiter, normalLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.get("/getuserdetails", normalLimiter, auth, getUserDetails);

router.post(
  "/getallusers",
  authLimiter,
  auth,
  isAdmin,
  getAllUsers,
);
router.patch(
  "/updateprofile",
  authLimiter,
  auth,
  doubleCsrfProtection,
  cleanupTempFile,
  updateProfile,
);
router.post("/contactUs", normalLimiter, contactUs);

export default router;