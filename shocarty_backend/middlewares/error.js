import { errorResponse } from "../utils/helpers/response.js";

export const errorMiddleware = (err, req, res, next) => {
  console.log(`Error: ${err.message} failed`);
  if (err.code === "EBADCSRFTOKEN") {
    return errorResponse(res, {
      message: "Csrf validation failed",
      statusCode: 403,
    });
  }
  if (err.name === "CastError") {
    return errorResponse(res, {
      message: "Invalid mongoid",
      statusCode: 422,
    });
  }
  if (err.name === "JsonWebTokenError") {
    return errorResponse(res, {
      message: "Invalid token",
      statusCode: 401,
    });
  }
  if (err.name === "TokenExpiredError") {
    return errorResponse(res, {
      message: "Token expired",
      statusCode: 401,
    });
  }
  if (err.type === "RazorpayError") {
    return errorResponse(res, {
      message: "Payment error",
      statusCode: 400,
    });
  }
  return errorResponse(res, {
    error: err.message,
    message: "Internal sever error",
  });
};
