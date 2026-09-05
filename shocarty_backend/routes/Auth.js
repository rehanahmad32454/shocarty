import express from "express";
import {
  blockUser,
  changePassword,
  getCsrfToken,
  login,
  logout,
  refreshToken,
  resetPasswordToken,
  sendOtp,
  signUp,
  unBlockUser,
  verifyResetToken,
} from "../controllers/Auth.js";
import { auth, isAdmin } from "../middlewares/auth.js";
import { doubleCsrfProtection } from "../middlewares/csrf.js";
import { authLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/sendotp", authLimiter, sendOtp);
router.post("/signup", authLimiter, signUp);
router.post("/login", authLimiter, login);
router.post("/resetpasswordtoken", authLimiter, resetPasswordToken);
router.post("/verifyresettoken", authLimiter, verifyResetToken);
// router.post("/refreshtoken", authLimiter, doubleCsrfProtection, refreshToken);
router.post("/refreshtoken", authLimiter, refreshToken);
router.post("/logout", authLimiter, auth, doubleCsrfProtection, logout);
router.patch(
  "/changepassword",
  authLimiter,
  auth,
  doubleCsrfProtection,
  changePassword,
);
router.post(
  "/block",
  authLimiter,
  auth,
  doubleCsrfProtection,
  isAdmin,
  blockUser,
);
router.post(
  "/unblock",
  authLimiter,
  auth,
  doubleCsrfProtection,
  isAdmin,
  unBlockUser,
);
router.get("/csrftoken", auth, getCsrfToken);
export default router;
