import rateLimit from "express-rate-limit";
import { ENV } from "../configs/Env.js";
import { errorResponse } from "../utils/helpers/response.js";

const {
  AUTH_LIMIT_WINDOW,
  AUTH_LIMIT_MAX,
  NORMAL_WINDOW,
  NORMAL_MAX,
  SEARCH_WINDOW,
  SEARCH_MAX,
} = ENV;

export const authLimiter = rateLimit({
  windowMs: parseInt(AUTH_LIMIT_WINDOW) * 60 * 1000,
  max: parseInt(AUTH_LIMIT_MAX),
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    errorResponse(res, {
      message: `Too many attempts. please try again after ${AUTH_LIMIT_WINDOW} minutes.`,
      statusCode: 429,
    });
  },
});

export const normalLimiter = rateLimit({
  windowMs: parseInt(NORMAL_WINDOW) * 60 * 1000,
  max: parseInt(NORMAL_MAX),
  skipSuccessfulRequests: false,
  handler: (req, res) => {
    errorResponse(res, {
      message: `Too many attempts. please try again after ${NORMAL_WINDOW} minutes.`,
      statusCode: 429,
    });
  },
});

export const searchLimiter = rateLimit({
  windowMs: parseInt(SEARCH_WINDOW) * 60 * 1000,
  max: parseInt(SEARCH_MAX),
  skipSuccessfulRequests: false,
  handler: (req, res) => {
    errorResponse(res, {
      message: `Too many attempts. please try again after ${SEARCH_WINDOW} minutes.`,
      statusCode: 429,
    });
  },
});
