import fs from "fs/promises";

export const cleanupTempFile = (req, res, next) => {
  let cleaned = false;
  const cleanup = async () => {
    if (cleaned) return;
    cleaned = true;
    if (!req.files) return;
    const files = Object.values(req.files).flat();
    await Promise.all(
      files
        .filter(
          (file) =>
            file &&
            typeof file.tempFilePath === "string" &&
            file.tempFilePath.trim() !== "",
        )
        .map(async (file) => {
          try {
            await fs.unlink(file.tempFilePath);
          } catch (err) {
            console.log(
              "Temp file delete failed:",
              file.tempFilePath,
              err.message,
            );
          }
        }),
    );
  };
  res.on("finish", cleanup);
  res.on("close", cleanup);
  next();
};
