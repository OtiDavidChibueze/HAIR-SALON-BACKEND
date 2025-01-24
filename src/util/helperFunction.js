import bcrypt from "bcrypt";
import ResponseHelper from "./responseHelper.js";
import mongoose from "mongoose";
import { Logger } from "../config/logger.js";

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

  static async comparePassword(oldPassword, newPassword) {
    return await bcrypt.compare(oldPassword, newPassword);
  }
}

export default HelperFunction;
