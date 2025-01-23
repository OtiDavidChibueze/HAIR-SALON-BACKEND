import bcrypt from "bcrypt";
import ResponseHelper from "./responseHelper";
import mongoose from "mongoose";
import { Logger } from "../config/logger";

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
}

export default HelperFunction;
