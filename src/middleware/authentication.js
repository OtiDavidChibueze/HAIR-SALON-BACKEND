import { Logger } from "../config/logger.js";
import ResponseHelper from "../util/responseHelper.js";
import redisClient from "../config/redis.js";
import JwtHelper from "../util/jwtHelper.js";
import UserModel from "../model/userModel.js";
import HelperFunction from "../util/helperFunction.js";

const JwtAuth = async (req, res, next) => {
  const token = req.cookies.accessToken || req.cookies.refreshToken;

  if (!token) return ResponseHelper.errorResponse(res, 404, "No token found");

  let tokenBlackListed;

  try {
    tokenBlackListed = await redisClient.get(`blacklist:${token}`);
  } catch (err) {
    Logger.error("Redis Error", err);
    return ResponseHelper.errorResponse(res, 500, "internal server error");
  }

  if (tokenBlackListed)
    return ResponseHelper.errorResponse(
      res,
      403,
      "Token has been revoked. Please login again"
    );

  const decode = req.cookies.accessToken
    ? JwtHelper.decodeAccessToken(req.cookies.accessToken)
    : req.cookies.refreshToken
    ? JwtHelper.decodeRefreshToken(req.cookies.refreshToken)
    : null;

  if (!decode) {
    return ResponseHelper.errorResponse(res, 403, "Invalid or expired token!!");
  }

  req.user = decode;

  try {
    HelperFunction.IdValidation(decode.id);

    const user = await UserModel.findById(decode.id);

    if (!user)
      return ResponseHelper.errorResponse(
        res,
        400,
        "Sorry! you're not recognised as a user"
      );

    if (user.isVerified !== true)
      return ResponseHelper.errorResponse(
        res,
        400,
        "Sorry you have to be verified!!! to make requests"
      );
  } catch (err) {
    Logger.error("JwtAuth User:", err);
  }

  next();
};

export default JwtAuth;
