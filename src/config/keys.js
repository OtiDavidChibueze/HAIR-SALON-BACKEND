import dotenv from "dotenv";
dotenv.config();

const PRODUCTION_LEVEL = process.env.PRODUCTION_LEVEL;
const MONGODB_URI = process.env.MONGODB_URI;
const PRODUCTION_PORT = process.env.PRODUCTION_PORT;
const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;
const PRODUCTION_SECRET_KEY = process.env.PRODUCTION_SECRET_KEY;
const PRODUCTION_REFRESH_SECRET_KEY = process.env.PRODUCTION_REFRESH_SECRET_KEY;
const PRODUCTION_EMAIL_ADDRESS = process.env.PRODUCTION_EMAIL_ADDRESS;
const PRODUCTION_APP_PASS = process.env.PRODUCTION_APP_PASS;
const PRODUCTION_EMAIL_PORT = process.env.PRODUCTION_EMAIL_PORT;
const PRODUCTION_EMAIL_HOST = process.env.PRODUCTION_EMAIL_HOST;
const PRODUCTION_EMAIL_SECURE = process.env.PRODUCTION_EMAIL_SECURE;
const PRODUCTION_BASE_URL = process.env.PRODUCTION_BASE_URL;

export {
  PRODUCTION_LEVEL,
  PRODUCTION_REFRESH_SECRET_KEY,
  MONGODB_URI,
  PRODUCTION_PORT,
  REDIS_HOST,
  REDIS_PORT,
  PRODUCTION_SECRET_KEY,
  PRODUCTION_APP_PASS,
  PRODUCTION_EMAIL_ADDRESS,
  PRODUCTION_EMAIL_PORT,
  PRODUCTION_EMAIL_HOST,
  PRODUCTION_EMAIL_SECURE,
  PRODUCTION_BASE_URL,
};
