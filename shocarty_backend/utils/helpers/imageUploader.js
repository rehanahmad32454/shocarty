import { v2 as cloudinary } from "cloudinary";

export const cloudinaryImageUploader = async (file, folder, quality) => {
  const options = {
    folder,
    resource_type: "auto",
  };
  if (quality) {
    options.quality = quality;
  }
  try {
    let uploadSource;
    if (file?.tempFilePath) {
      uploadSource = file.tempFilePath;
    } else if (typeof file === "string") {
      uploadSource = file;
    } else {
      throw new Error("Invalid file provided for upload");
    }
    const result = await cloudinary.uploader.upload(uploadSource, options);
    return result;
  } catch (error) {
    throw error;
  }
};
