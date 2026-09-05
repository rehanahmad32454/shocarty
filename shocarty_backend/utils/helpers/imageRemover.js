import { v2 as cloudinary } from "cloudinary";

export const cloudinaryImageRemover = async (
  publicId,
  resourceType = "image",
) => {
  try {
    if (!publicId) return;
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw error;
  }
};
