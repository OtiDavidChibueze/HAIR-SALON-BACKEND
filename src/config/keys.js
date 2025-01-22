import dotenv from "dotenv";
dotenv.config();

const PRODUCTION_LEVEL = process.env.PRODUCTION_LEVEL;
const MONGODB_URI = process.env.MONGODB_URI;
const PRODUCTION_PORT = process.env.PRODUCTION_PORT;

export { PRODUCTION_LEVEL, MONGODB_URI, PRODUCTION_PORT };
