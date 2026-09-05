export const APP_CONFIG = Object.freeze({
  EMAIL_REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  CONTACT_NUMBER_REGEX: /^\+[1-9]{1}[0-9]{7,14}$/,
  DEFAULT_PAGE: 1,
  CATEGORY_LIMIT: 5,
  DEFAULT_LIMIT: 10,
  CATEGORY_PRODUCT_LIMIT: 10,
  MAX_LIMIT: 10,
  ROLE: { ADMIN: "Admin", CUSTOMER: "Customer" },
  ORDERSTATUS: {
    PENDING: "Pending",
    PLACED: "Placed",
    PAID: "Paid",
    FAILED: "Failed",
    CANCELLED: "Cancelled",
    DELIVERED: "Delivered",
  },
  PAYEMENTSTAUS: { COD: "Cod", ONLINE: "Online" },
});
