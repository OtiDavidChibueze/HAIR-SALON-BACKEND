import multer from "multer";
import { Logger } from "../config/logger.js";

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowedTypes.includes(file.mimetype)) {
    Logger.error("Only JPEG, JPG, and PNG files are allowed!");
    return cb(null, false); // Reject file
  }
  cb(null, true); // Accept file
};

// Use memory storage for compatibility with Cloudinary
const uploadProfilePic = multer({
  storage: multer.memoryStorage(), // File stored in memory, no physical path
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
});

export { uploadProfilePic };
