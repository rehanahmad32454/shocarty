import { ENV } from "../configs/Env.js";

const { MAX_FILE_SIZE } = ENV;

export const FILE_CONFIG = Object.freeze({
  IMAGE: Object.freeze({
    mimeTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/heic",
      "image/heif",
    ],
    maxSize: 5 * 1024 * 1024,
  }),
  MAX_FILE_SIZE: MAX_FILE_SIZE,
});
