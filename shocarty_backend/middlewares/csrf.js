// import { doubleCsrf } from "csrf-csrf";
// import { ENV } from "../configs/Env.js";

// const CSRF_SECRET = ENV.CSRF_SECRET;
// const isProduction = ENV.NODE_ENV === "production";
// const isCrossSite = ENV.CROSS_SITE === "true";

// const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
//   getSecret: () => CSRF_SECRET,
//   getSessionIdentifier: (req) => req.ip,
//   cookieName: "csrfToken",
//   cookieOptions: {
//     httpOnly: false,
//     secure: isProduction,
//     sameSite: isProduction ? (isCrossSite ? "none" : "strict") : "lax",
//   },
//   size: 64,
//   ignoredMethods: ["GET", "HEAD", "OPTIONS"],
//   errorConfig: {
//     statusCode: 403,
//     message: "Csrf validation failed",
//   },
// });

// export { generateCsrfToken, doubleCsrfProtection };


import { doubleCsrf } from "csrf-csrf";
import { ENV } from "../configs/Env.js";

const isProduction = ENV.NODE_ENV === "production";
const isCrossSite = ENV.CROSS_SITE === "true";

const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => ENV.CSRF_SECRET,

  // ✅ simplest safe version (no IP, no cookies, no fingerprint)
  getSessionIdentifier: () => "static",

  cookieName: "csrfToken",

  cookieOptions: {
    httpOnly: false,
    secure: isProduction,
    sameSite: isProduction
      ? (isCrossSite ? "none" : "strict")
      : "lax",
  },

  size: 64,

  ignoredMethods: ["GET", "HEAD", "OPTIONS"],

  errorConfig: {
    statusCode: 403,
    message: "CSRF validation failed",
  },
});

export { generateCsrfToken, doubleCsrfProtection };