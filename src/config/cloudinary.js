import cloudinary from "cloudinary";
cloudinary.v2;

import {
  PRODUCTION_CLOUDINARY_NAME,
  PRODUCTION_CLOUDINARY_SECRET,
  PRODUCTION_CLOUDINARY_KEY,
} from "./keys.js";

cloudinary.config({
  cloud_name: PRODUCTION_CLOUDINARY_NAME,
  api_key: PRODUCTION_CLOUDINARY_KEY,
  api_secret: PRODUCTION_CLOUDINARY_SECRET,
});

export default cloudinary;

console.log("Cloudinary Config:", {
  cloud_name: process.env.PRODUCTION_CLOUDINARY_NAME,
  api_key: process.env.PRODUCTION_CLOUDINARY_KEY,
  api_secret: process.env.PRODUCTION_CLOUDINARY_SECRET,
});
