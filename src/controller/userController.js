import { Logger } from "../config/logger.js";
import UserService from "../service/userService.js";
import ResponseHelper from "../util/responseHelper.js";

class UserController {
  static async login(req, res) {
    try {
      const result = await UserService.login(res, req.body);

      if (result.statusCode === 422 || result.statusCode === 404)
        return ResponseHelper.errorResponse(
          res,
          result.statusCode,
          result.message
        );

      Logger.info(`loginController: ${JSON.stringify(result.data)}`);

      return ResponseHelper.successResponse(
        res,
        result.statusCode,
        result.message,
        result.data
      );
    } catch (err) {
      Logger.error("loginController Error:", err.message);
      return ResponseHelper.errorResponse(res, 500, "internal server error ");
    }
  }

  static async createUser(req, res) {
    try {
      const result = await UserService.createUser(req.body);

      if (result.statusCode === 422 || result.statusCode === 406)
        return ResponseHelper.errorResponse(
          res,
          result.statusCode,
          result.message
        );

      Logger.info(`createUserController: ${JSON.stringify(result.data)}`);

      return ResponseHelper.successResponse(
        res,
        result.statusCode,
        result.message,
        result.data
      );
    } catch (err) {
      Logger.error("createUserController Error:", err);
      return ResponseHelper.errorResponse(res, 500, "internal server error ");
    }
  }

  static async verifyAccount(req, res) {
    try {
      const result = await UserService.verifyAccount(req.query.token);

      if (
        result.statusCode === 400 ||
        result.statusCode === 403 ||
        result.statusCode === 404 ||
        result.statusCode === 406
      )
        return ResponseHelper.errorResponse(
          res,
          result.statusCode,
          result.message
        );

      Logger.info(`verifyAccountController: ${JSON.stringify(result.data)}`);

      return ResponseHelper.successResponse(
        res,
        result.statusCode,
        result.message,
        result.data
      );
    } catch (err) {
      Logger.error("verifyAccountController Error:", err);
      return ResponseHelper.errorResponse(res, 500, "internal server error ");
    }
  }
}

export default UserController;
