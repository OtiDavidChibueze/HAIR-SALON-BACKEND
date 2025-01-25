import bcrypt from "bcrypt";
import ResponseHelper from "./responseHelper.js";
import mongoose from "mongoose";
import { Logger } from "../config/logger.js";
import redisClient from "../config/redis.js";

class HelperFunction {
  static async hashPassword(newPassword) {
    return await bcrypt.hash(newPassword, await bcrypt.genSalt(10));
  }

  static IdValidation(id) {
    try {
      const validId = mongoose.isValidObjectId(id);

      if (!validId)
        return ResponseHelper.errorResponse("Invalid mongoose ID:", id);
    } catch (err) {
      Logger.error("idValidation", err);
    }
  }

  static async comparePassword(newPassword, oldPassword) {
    return await bcrypt.compare(newPassword, oldPassword);
  }

  // static async isTokenBlacklisted(token, type) {
  //   let tokenBlacklisted;

  //   try {
  //     tokenBlacklisted = await redisClient.get(`blacklist:${token}`);
  //   } catch (err) {
  //     return Logger.error("isTokenBlacklisted Error:", err);
  //   }

  //   if (tokenBlacklisted)
  //     return ResponseHelper.errorResponse(res, 400, "Token has been revoked!");
  // }
}

export default HelperFunction;
