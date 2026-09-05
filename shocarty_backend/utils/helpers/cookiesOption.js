import { ENV } from "../../configs/Env.js";

const isProduction = ENV.NODE_ENV === "production";
const isCrossSite = ENV.CROSS_SITE === "true";

export const getRefreshTokenCookieOptions = () => {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? (isCrossSite ? "none" : "strict") : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
};

export const getAccessTokenCookieOptions = () => {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? (isCrossSite ? "none" : "strict") : "lax",
    maxAge: 15 * 60 * 1000,
  };
};