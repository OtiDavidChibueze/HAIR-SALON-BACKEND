import multer from "multer";
import { Logger } from "../config/logger.js";

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(Logger.error("Only JPEG, JPG, and PNG files are allowed!"));
  }

  cb(null, true);
};

const uploadProfilePic = multer({
  storage: multer.diskStorage({}),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Proper file size limit
});

export { uploadProfilePic };
