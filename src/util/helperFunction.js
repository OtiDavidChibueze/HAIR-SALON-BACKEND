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

  static async comparePassword(newPassword, oldPassword) {
    return await bcrypt.compare(newPassword, oldPassword);
  }

  static accessTokenCookie(
    type = "accessToken",
    token,
    object = {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    }
  ) {
    return (req, res, next) => {
      res.cookie(type, token, object);

      console.log({ resAccess: res });

      next();
    };
  }

  static refreshTokenCookie(
    type = "refreshToken",
    token,
    object = {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }
  ) {
    return (req, res, next) => {
      res.cookie(type, token, object);

      console.log({ resFresh: res });

      next();
    };
  }

  static accessTokenCookie(res, token) {
    return res.cookie("accessToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });
  }

  static refreshTokenCookie(res, token) {
    return res.cookie("refreshToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}

export default HelperFunction;
