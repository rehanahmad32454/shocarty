export const extractPublicIdFromUrl = (url) => {
  try {
    if (!url) return null;
    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");
    const publicIdParts = parts.slice(uploadIndex + 1);
    if (publicIdParts[0].startsWith("v")) {
      publicIdParts.shift();
    }
    const publicIdWithExtension = publicIdParts.join("/");
    const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, "");
    return publicId;
  } catch (error) {
    console.error("Error extracting public ID:", error);
    return null;
  }
};
