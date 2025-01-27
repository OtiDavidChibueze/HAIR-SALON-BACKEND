import cloudinary from "cloudinary";
import {
  PRODUCTION_CLOUDINARY_NAME,
  PRODUCTION_CLOUDINARY_SECRET,
  PRODUCTION_CLOUDINARY_URL,
} from "./keys.js";

cloudinary.v2.config({
  cloud_name: PRODUCTION_CLOUDINARY_NAME,
  api_key: PRODUCTION_CLOUDINARY_URL,
  api_secret: PRODUCTION_CLOUDINARY_SECRET,
});

export default cloudinary.v2;
