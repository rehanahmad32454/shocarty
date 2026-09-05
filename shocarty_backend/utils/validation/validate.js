import mongoose from "mongoose";
import { APP_CONFIG } from "../../constants/appConfig.js";

const {
  ROLE: { ADMIN, CUSTOMER },
  PAYEMENTSTAUS: { COD, ONLINE },
  EMAIL_REGEX,
  CONTACT_NUMBER_REGEX,
} = APP_CONFIG;

export function isEmpty(value) {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim() === "") ||
    (typeof value === "object" &&
      !Array.isArray(value) &&
      Object.keys(value).length === 0) ||
    (typeof value === "number" && (!isFinite(value) || isNaN(value)))
  );
}

export function isValidEmail(value) {
  return EMAIL_REGEX.test(value);
}

export function isValidContactNumber(value) {
  return CONTACT_NUMBER_REGEX.test(value);
}

export function isValidRole(value) {
  return value === ADMIN || value === CUSTOMER;
}

export function isValidPaymentMethod(value) {
  return value === COD || value === ONLINE;
}

export function fileSize(SIZE, MAXFILESIZE) {
  return SIZE >= MAXFILESIZE;
}

export function isValidMongoId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// export function hasHTML(value) {
//   return typeof value === "string" && /[<>]/.test(value);
// }