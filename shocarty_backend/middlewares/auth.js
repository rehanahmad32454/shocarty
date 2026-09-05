import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../configs/Env.js";
import { errorResponse } from "../utils/helpers/response.js";
import { APP_CONFIG } from "../constants/appConfig.js";

const {
  ROLE: { ADMIN, CUSTOMER },
} = APP_CONFIG;

export const auth = async (req, res, next) => {
  try {
    let token;
    let authHeader = req.header("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
    if (req.cookies?.accessToken) {
      token = req.cookies?.accessToken;
    }
    if (!token) {
      return errorResponse(res, {
        message: "Invalid token or token not found",
        statusCode: 401,
      });
    }
    const decode = jwt.verify(token, ENV.JWT_ACCESS_SECRET);
    const user = await User.findById(decode._id);
    if (!user) {
      return errorResponse(res, {
        message: "User not found",
        statusCode: 401,
      });
    }
    if (user?.isBlocked) {
      return errorResponse(res, {
        message: "User is blocked",
        statusCode: 403,
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(`Error: ${error.message} failed to auth`);
    if (error.name === "TokenExpiredError") {
      return errorResponse(res, {
        message: "Token expired",
        statusCode: 401,
      });
    }
    if (error.name === "JsonWebTokenError") {
      return errorResponse(res, {
        message: "Token is invalid",
        statusCode: 401,
      });
    }
    return errorResponse(res, {
      error: error.message,
      message: "Internal server error",
    });
  }
};

export const isAdmin = (req, res, next) => {
  let role = req?.user?.role;
  if (role !== ADMIN) {
    return errorResponse(res, {
      message: "Admin access only",
      statusCode: 403,
    });
  }
  next();
};

export const isCustomer = (req, res, next) => {
  let role = req?.user?.role;
  if (role !== CUSTOMER) {
    return errorResponse(res, {
      message: "Customer access only",
      statusCode: 403,
    });
  }
  next();
};
