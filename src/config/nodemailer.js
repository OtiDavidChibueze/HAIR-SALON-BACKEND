import nodemailer from "nodemailer";
import {
  PRODUCTION_EMAIL_ADDRESS,
  PRODUCTION_EMAIL_HOST,
  PRODUCTION_APP_PASS,
  PRODUCTION_EMAIL_PORT,
  PRODUCTION_EMAIL_SECURE,
} from "../config/keys.js";
import { Logger } from "./logger.js";

const transporter = nodemailer.createTransport({
  host: PRODUCTION_EMAIL_HOST,
  port: PRODUCTION_EMAIL_PORT,
  secure: PRODUCTION_EMAIL_SECURE === "true",
  auth: {
    user: PRODUCTION_EMAIL_ADDRESS,
    pass: PRODUCTION_APP_PASS,
  },
});

// Verify the connection
transporter.verify((error, success) => {
  if (error) {
    Logger.error("Error connecting to email server:", error);
  } else {
    Logger.info("Email server is ready to send messages.", success);
  }
});

export default transporter;
