import { Logger } from "../config/logger.js";
import ResponseHelper from "../util/responseHelper.js";
import redisClient from "../config/redis.js";
import JwtHelper from "../util/jwtHelper.js";

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

  next();
};

export default JwtAuth;
