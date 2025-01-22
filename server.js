import express from "express";
import cors from "cors";
import { PRODUCTION_PORT, MONGODB_URI } from "./src/config/keys.js";
const app = express();
import { Logger } from "./src/config/logger.js";
import { apiLimiter } from "./src/config/rateLimit.js";
import mongoose from "mongoose";
import helmet from "helmet";

app.use(express.json());
app.use(cors());
app.use(apiLimiter);
app.use(helmet());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const port = PRODUCTION_PORT || 5000;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    app.listen(port, () => {
      Logger.info(` Server is running on port: ${port}`);
    });
    Logger.info("Database connected");
  } catch (err) {
    Logger.error("Database Error:", err);
    process.exit(1);
  }
};

connectDB();
