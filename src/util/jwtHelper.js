import jwt from "jsonwebtoken";
import {
  PRODUCTION_REFRESH_SECRET_KEY,
  PRODUCTION_SECRET_KEY,
} from "../config/keys.js";
import { Logger } from "../config/logger.js";

class JwtHelper {
  static decodeAccessToken(token) {
    try {
      return jwt.verify(token, PRODUCTION_SECRET_KEY);
    } catch (err) {
      return Logger.error("decodeAccessToken", err);
    }
  }

  static decodeRefreshToken(refreshToken) {
    try {
      return jwt.verify(refreshToken, PRODUCTION_REFRESH_SECRET_KEY);
    } catch (err) {
      return Logger.error("decodeRefreshToken", err);
    }
  }

  static generateAccessToken(userId, userRole) {
    return jwt.sign({ id: userId, role: userRole }, PRODUCTION_SECRET_KEY, {
      expiresIn: "15min",
    });
  }

  static generateRefreshToken(userId, userRole) {
    return jwt.sign(
      { id: userId, role: userRole },
      PRODUCTION_REFRESH_SECRET_KEY,
      {
        expiresIn: "7days",
      }
    );
  }
}

export default JwtHelper;
