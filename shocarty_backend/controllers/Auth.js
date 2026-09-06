import Otp from "../models/Otp.js";
import User from "../models/User.js";
import Profile from "../models/Profile.js";
import otpGenerator from "otp-generator";
import {
  RefreshTokenGenerator,
  AccessTokenGenerator,
} from "../utils/auth/token.js";
import bcrypt from "bcrypt";
import RefreshToken from "../models/RefreshToken.js";
import crypto from "crypto";
import {
  isEmpty,
  isValidEmail,
  isValidRole,
} from "../utils/validation/validate.js";
import { isValidMongoId } from "../utils/validation/validate.js";
import jwt from "jsonwebtoken";
import {
  csrfCookieOptions,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
} from "../utils/helpers/cookiesOption.js";
import { mailSender } from "../utils/helpers/mailSender.js";
import { ENV } from "../configs/Env.js";
import { errorResponse, successResponse } from "../utils/helpers/response.js";
import { APP_CONFIG } from "../constants/appConfig.js";
import { generateCsrfToken } from "../middlewares/csrf.js";
import { emailVerification } from "../utils/mail/templates/emailVerification.js";
import { resetPassword } from "../utils/mail/templates/resetPassword.js";

const { JWT_REFRESH_SECRET } = ENV;
const {
  ROLE: { ADMIN },
} = APP_CONFIG;

const isProduction = ENV.NODE_ENV === "production";
const isCrossSite = ENV.CROSS_SITE === "true";

export const signUp = async (req, res) => {
  try {
    console.log("Auth : signUp() : Exceution Start");
    const { firstName, lastName, email, password, role, otp } = req.body;
    if (
      isEmpty(firstName) ||
      isEmpty(lastName) ||
      isEmpty(password) ||
      !isValidRole(role) ||
      isEmpty(otp)
    ) {
      return errorResponse(res, {
        message: "All fields are required",
        statusCode: 400,
      });
    }
    if (!isValidEmail(email)) {
      return errorResponse(res, {
        message: "Invalid email",
        statusCode: 400,
      });
    }
    if (role === ADMIN) {
      const existingAdminUser = await User.findOne({ role: ADMIN });
      if (existingAdminUser) {
        return errorResponse(res, {
          message: "Admin already exist cannot create another admin",
          statusCode: 401,
        });
      }
    }
    const userExist = await User.findOne({ email });
    if (userExist) {
      if (userExist?.isBlocked) {
        return errorResponse(res, {
          message: "User is blocked",
          statusCode: 401,
        });
      }
      return errorResponse(res, {
        message: "User already registered",
        statusCode: 401,
      });
    }
    const verifyOtp = await Otp.findOne({ email }).sort({ createdAt: -1 });
    if (!verifyOtp) {
      return errorResponse(res, {
        message: "Otp not found or expired",
        statusCode: 404,
      });
    }
    if (verifyOtp.otp !== otp) {
      return errorResponse(res, {
        message: "Invalid otp",
        statusCode: 400,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      image: `https://api.dicebear.com/9.x/initials/svg?seed=${firstName} ${lastName}`,
      password: hashedPassword,
      role,
    });
    await Profile.create({
      userId: user._id,
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });
    console.log("Auth : signUp() : Exceution End");
    return successResponse(res, {
      message: "User registered succesfully",
      statusCode: 201,
    });
  } catch (error) {
    console.log(`Error: ${error.message} register failed`);
    return errorResponse(res, {
      error: error.message,
      message: "Internal server error",
    });
  }
};

export const sendOtp = async (req, res) => {
  try {
    console.log("Auth : sendOtp() : Exceution Start");
    const { email } = req.body;
    if (!isValidEmail(email)) {
      return errorResponse(res, {
        message: "Invalid email",
        statusCode: 422,
      });
    }
    const isFounduser = await User.findOne({ email });
    if (isFounduser) {
      return errorResponse(res, {
        message: "User already registered",
        statusCode: 401,
      });
    }
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    const result = await Otp.create({ email: email, otp: otp });
    await mailSender(email, "Email verification", emailVerification(otp));
    console.log("Auth : sendOtp() : Exceution End");
    return successResponse(res, {
      message: `Otp sent successfully on ${email}`,
    });
  } catch (error) {
    console.log(`Error: ${error.message} failed to send otp`);
    return errorResponse(res, {
      error: error.message,
      message: "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    console.log("Auth : login() : Exceution Start");
    const { email, password } = req.body;
    if (!isValidEmail(email)) {
      return errorResponse(res, {
        message: "Invalid email",
        statusCode: 422,
      });
    }
    if (isEmpty(password)) {
      return errorResponse(res, {
        message: "Password is required",
        statusCode: 400,
      });
    }
    const userExist = await User.findOne({ email: email })
      .select("-resetPasswordExpires -resetPasswordToken -updatePassword")
      .lean();
    if (userExist?.isBlocked) {
      return errorResponse(res, {
        message: "User is blocked",
        statusCode: 401,
      });
    }
    if (!userExist) {
      return errorResponse(res, {
        message: "User not registered",
        statusCode: 401,
      });
    }
    const additionalDetails = await Profile.findOne({ userId: userExist._id });
    userExist.additionalDetails = additionalDetails;
    if (userExist.isBlocked === true) {
      return errorResponse(res, {
        message: "User is blocked",
        statusCode: 403,
      });
    }
    if (await bcrypt.compare(password, userExist.password)) {
      const refreshtoken = RefreshTokenGenerator({
        _id: userExist._id,
        email: userExist.email,
        role: userExist.role,
      });
      const accessToken = AccessTokenGenerator({
        _id: userExist._id,
        role: userExist.role,
      });
      await RefreshToken.create({ userId: userExist._id, token: refreshtoken });
      delete userExist.isBlocked;
      delete userExist.password;
      generateCsrfToken(req, res);
      console.log("Auth : login() : Exceution End");
      return successResponse(res, {
        data: { user: userExist },
        message: "Login successfully",
        refreshTokencookie: {
          name: "refreshToken",
          value: refreshtoken,
          options: getRefreshTokenCookieOptions(),
        },
        accessTokencookie: {
          name: "accessToken",
          value: accessToken,
          options: getAccessTokenCookieOptions(),
        },
      });
    }
    return errorResponse(res, {
      message: "Invalid credentials",
      statusCode: 401,
    });
  } catch (error) {
    console.log(error);
    console.log(`Error: ${error.message} failed to login`);
    return errorResponse(res, {
      error: error.message,
      message: "Internal server error",
    });
  }
};

export const resetPasswordToken = async (req, res) => {
  try {
    console.log("Auth : resetPasswordToken() : Exceution Start");
    const { email } = req.body;
    if (!isValidEmail(email)) {
      return errorResponse(res, {
        message: "Invalid email",
        statusCode: 422,
      });
    }
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return errorResponse(res, {
        message: "User not registered",
        statusCode: 401,
      });
    }
    const token = crypto.randomBytes(20).toString("hex");
    const user = await User.findOneAndUpdate(
      { email },
      {
        resetPasswordToken: token,
        updatePassword: true,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { returnDocument: "after" },
    );
    await mailSender(
      email,
      "CLICK BELOW FOR RESETING PASSWORD",
      resetPassword(user.resetPasswordToken),
    );
    console.log("Auth : resetPasswordToken() : Exceution End");
    return successResponse(res, {
      message: `Token sent sucessfully on ${email}`,
    });
  } catch (error) {
    console.log(`Error: ${error.message} reset password token send failed`);
    return errorResponse(res, {
      error: error.message,
      message: "Internal server error",
    });
  }
};

export const verifyResetToken = async (req, res) => {
  try {
    console.log("Auth : verifyResetToken() : Exceution Start");
    const { resetPasswordToken, password } = req.body;
    if (isEmpty(resetPasswordToken) || isEmpty(password)) {
      return errorResponse(res, {
        message: "All fields are required",
        statusCode: 400,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.findOneAndUpdate(
      {
        resetPasswordToken,
        updatePassword: true,
        resetPasswordExpires: { $gt: Date.now() },
      },
      {
        password: hashedPassword,
        updatePassword: false,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
      { returnDocument: "after" },
    );
    if (!user) {
      return errorResponse(res, {
        message: "Invalid or expired token",
        statusCode: 401,
      });
    }
    console.log("Auth : verifyResetToken() : Exceution End");
    return successResponse(res, {
      message: "Password updated sucessfully",
    });
  } catch (error) {
    console.log(`Error: ${error.message} reset password token send failed`);
    return errorResponse(res, {
      error: error.message,
      message: "Internal server error",
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    console.log("Auth : changePassword() : Exceution Start");
    const { oldPassword, newPassword } = req.body;
    if (isEmpty(oldPassword) || isEmpty(newPassword)) {
      return errorResponse(res, {
        message: "All fields are required",
        statusCode: 400,
      });
    }
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, {
        message: "User not registered",
        statusCode: 401,
      });
    }
    if (await bcrypt.compare(oldPassword, user.password)) {
      const newPasswrd = await bcrypt.hash(newPassword, 10);
      await User.findByIdAndUpdate(
        userId,
        { password: newPasswrd },
        { returnDocument: "after" },
      );
      console.log("Auth : changePassword() : Exceution End");
      return successResponse(res, {
        message: "Password updated successfully",
      });
    }
    return errorResponse(res, {
      message: "Incorrect password",
      statusCode: 401,
    });
  } catch (error) {
    console.log(`Error: ${error.message} failed to change password`);
    return errorResponse(res, {
      error: error.message,
      message: "Internal server error",
    });
  }
};

export const refreshToken = async (req, res) => {
  console.log("Auth : refreshToken() : Exceution Start");
  const oldRefreshtoken = req.cookies.refreshToken;
  if (!oldRefreshtoken) {
    return errorResponse(res, {
      message: "No refresh token provided",
      statusCode: 401,
    });
  }
  try {
    const payload = jwt.verify(oldRefreshtoken, JWT_REFRESH_SECRET);
    const refreshTokenDoc = await RefreshToken.findOne({
      userId: payload._id,
      token: oldRefreshtoken,
    });
    if (!refreshTokenDoc) {
      return errorResponse(res, {
        message: "No Refresh token found or revoked",
        statusCode: 401,
      });
    }
    const user = await User.findOne({ _id: payload._id })
      .select("_id email role")
      .lean();
    if (!user) {
      return errorResponse(res, {
        message: "User not found",
        statusCode: 401,
      });
    }
    await RefreshToken.deleteOne({ userId: user._id, token: oldRefreshtoken });
    const refreshToken = RefreshTokenGenerator({
      _id: user._id,
      email: user.email,
      role: user.role,
    });
    const accessToken = AccessTokenGenerator({
      _id: user._id,
      role: user.role,
    });
    await RefreshToken.create({ userId: user._id, token: refreshToken });
    generateCsrfToken(req, res);
    console.log("Auth : refreshToken() : Exceution End");
    return successResponse(res, {
      message: "Refresh token generated successfully",
      refreshTokencookie: {
        name: "refreshToken",
        value: refreshToken,
        options: getRefreshTokenCookieOptions(),
      },
      accessTokencookie: {
        name: "accessToken",
        value: accessToken,
        options: getAccessTokenCookieOptions(),
      },
    });
  } catch (error) {
    console.log(`Error: ${error.message} failed to refresh token`);
    return errorResponse(res, {
      error: error.message,
      message: "Internal server error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    console.log("Auth : logout() : Exceution Start");
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return errorResponse(res, {
        message: "No refresh token provided",
        statusCode: 401,
      });
    }
    const userId = req.user._id;
    await RefreshToken.findOneAndDelete({
      userId: userId,
      token: refreshToken,
    });
    console.log("Auth : logout() : Exceution End");
    res.clearCookie("accessToken", getAccessTokenCookieOptions());
    res.clearCookie("refreshToken", getRefreshTokenCookieOptions());
    res.clearCookie("csrfToken", csrfCookieOptions());
    // res.clearCookie("csrfToken", {
    //   httpOnly: false,
    //   secure: isProduction,
    //   sameSite: isProduction ? (isCrossSite ? "none" : "strict") : "lax",
    // });
    return successResponse(res, {
      message: "Logout successfully",
    });
  } catch (error) {
    console.log(`Error: ${error.message} failed to logout`);
    return errorResponse(res, {
      error: error.message,
      message: "Internal server error",
    });
  }
};

export const blockUser = async (req, res) => {
  try {
    console.log("Auth : blockUser() : Exceution Start");
    const { userId } = req.body;
    if (!isValidMongoId(userId)) {
      return errorResponse(res, {
        message: "Invalid mongoid",
        statusCode: 422,
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, {
        message: "User not found",
        statusCode: 401,
      });
    }
    if (user.role === ADMIN) {
      return errorResponse(res, {
        message: "Admin cannot block self account",
        statusCode: 403,
      });
    }
    const blockedUser = await User.findByIdAndUpdate(
      userId,
      { isBlocked: true },
      { new: true },
    ).select(
      "-password -resetPasswordExpires -resetPasswordToken -updatePassword",
    );
    console.log("Auth : blockUser() : Exceution End");
    return successResponse(res, {
      data: { user: blockedUser },
      message: "User is blocked",
    });
  } catch (error) {
    console.log(`Error: ${error.message} failed to block user`);
    return errorResponse(res, {
      error: error.message,
      message: "Internal server error",
    });
  }
};

export const unBlockUser = async (req, res) => {
  try {
    console.log("Auth : unBlockUser() : Exceution Start");
    const { userId } = req.body;
    if (!isValidMongoId(userId)) {
      return errorResponse(res, {
        message: "Invalid mongoid",
        statusCode: 422,
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, {
        message: "User not found",
        statusCode: 401,
      });
    }
    const unBlockedUser = await User.findByIdAndUpdate(
      userId,
      { isBlocked: false },
      { new: true },
    ).select(
      "-password -resetPasswordExpires -resetPasswordToken -updatePassword",
    );
    console.log("Auth : unBlockUser() : Exceution End");
    return successResponse(res, {
      data: { user: unBlockedUser },
      message: "User is un blocked",
    });
  } catch (error) {
    console.log(`Error: ${error.message} failed to un block user`);
    return errorResponse(res, {
      error: error.message,
      message: "Internal server error",
    });
  }
};

export const getCsrfToken = (req, res) => {
  try {
    const csrfToken = generateCsrfToken(req, res);
    return successResponse(res, {
      data: { csrfToken },
      message: "CSRF topken generated successfully",
    });
  } catch (error) {
    return errorResponse(res, {
      error: error.message,
      message: "Internal server error",
    });
  }
};
