import jwt from "jsonwebtoken";
import { ENV } from "../../configs/Env.js";

const {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRATION,
  JWT_REFRESH_EXPIRATION,
} = ENV;

export const AccessTokenGenerator = (payload) =>
  jwt.sign(payload, ENV.JWT_ACCESS_SECRET, {
    expiresIn: `${JWT_ACCESS_EXPIRATION}`,
  });

export const RefreshTokenGenerator = (payload) =>
  jwt.sign(payload, ENV.JWT_REFRESH_SECRET, {
    expiresIn: `${JWT_REFRESH_EXPIRATION}`,
  });