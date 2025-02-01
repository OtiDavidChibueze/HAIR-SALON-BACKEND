import { Logger } from "../config/logger.js";
import UserService from "../service/userService.js";
import ResponseHelper from "../util/responseHelper.js";

class UserController {
  static async login(req, res) {
    try {
      const result = await UserService.login(res, req.body);

      if (
        result.statusCode === 422 ||
        result.statusCode === 404 ||
        result.statusCode === 406
      )
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
      Logger.error("loginController Error:", err);
      return ResponseHelper.errorResponse(res, 500, "internal server error ");
    }
  }

  static async signIn(req, res) {
    try {
      const result = await UserService.signIn(req.body);

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

  static async forgottenPassword(req, res) {
    try {
      const result = await UserService.forgottenPassword(req.body);

      if (result.statusCode === 404)
        return ResponseHelper.errorResponse(
          res,
          result.statusCode,
          result.message
        );

      Logger.info(
        `forgottenPasswordController: ${JSON.stringify(result.data)}`
      );

      return ResponseHelper.successResponse(
        res,
        result.statusCode,
        result.message,
        result.data
      );
    } catch (err) {
      Logger.error("forgottenPasswordController Error:", err);
      return ResponseHelper.errorResponse(res, 500, "internal server error ");
    }
  }

  static async resetPassword(req, res) {
    try {
      const result = await UserService.resetPassword(req.query.token, req.body);

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

      Logger.info(`resetPasswordController: ${JSON.stringify(result.data)}`);

      return ResponseHelper.successResponse(
        res,
        result.statusCode,
        result.message,
        result.data
      );
    } catch (err) {
      Logger.error("resetPasswordController Error:", err);
      return ResponseHelper.errorResponse(res, 500, "internal server error ");
    }
  }

  static async profile(req, res) {
    try {
      const result = await UserService.profile(req.user);

      if (result.statusCode === 404)
        return ResponseHelper.errorResponse(
          res,
          result.statusCode,
          result.message
        );

      Logger.info(`profileController: ${JSON.stringify(result.data)}`);

      return ResponseHelper.successResponse(
        res,
        result.statusCode,
        result.message,
        result.data
      );
    } catch (err) {
      Logger.error("profileController Error:", err);
      return ResponseHelper.errorResponse(res, 500, "Internal server error");
    }
  }

  static async logOut(req, res) {
    try {
      const result = await UserService.logOut(res, req.cookies);

      if (result.statusCode === 400 || result.statusCode === 403)
        return ResponseHelper.errorResponse(
          res,
          result.statusCode,
          result.message
        );

      Logger.info(`logOutController: ${JSON.stringify(result.data)}`);

      return ResponseHelper.successResponse(
        res,
        result.statusCode,
        result.message,
        result.data
      );
    } catch (err) {
      Logger.error("logOutController Error:", err);
      return ResponseHelper.errorResponse(res, 500, "Internal server error");
    }
  }

  static async refreshToken(req, res) {
    try {
      const result = await UserService.refreshToken(res, req.cookies);

      if (result.statusCode === 404 || result.statusCode === 403)
        return ResponseHelper.errorResponse(
          res,
          result.statusCode,
          result.message
        );

      Logger.info(`refreshTokenController: ${JSON.stringify(result.data)}`);

      return ResponseHelper.successResponse(
        res,
        result.statusCode,
        result.message,
        result.data
      );
    } catch (err) {
      Logger.error("refreshTokenController Error:", err);
      return ResponseHelper.errorResponse(res, 500, "Internal server error");
    }
  }

  static async uploadProfilePic(req, res) {
    try {
      const result = await UserService.uploadProfilePicture(req.user, req);

      if (result.statusCode === 404)
        return ResponseHelper.errorResponse(
          res,
          result.statusCode,
          result.message
        );

      Logger.info(
        "uploadProfilePictureController:",
        JSON.stringify(result.data)
      );

      return ResponseHelper.successResponse(
        res,
        result.statusCode,
        result.message,
        result.data
      );
    } catch (err) {
      console.error("uploadProfilePicController Error:", err);
      return ResponseHelper.errorResponse(res, 500, "Internal server error");
    }
  }

  static async deleteProfilePic(req, res) {
    try {
      const result = await UserService.deleteProfilePic(req.user);

      if (result.statusCode === 404)
        return ResponseHelper.errorResponse(
          res,
          result.statusCode,
          result.message
        );

      Logger.info("deleteProfilePicController:", JSON.stringify(result.data));

      return ResponseHelper.successResponse(
        res,
        result.statusCode,
        result.message,
        result.data
      );
    } catch (err) {
      console.error("deleteProfilePicController Error:", err);
      return ResponseHelper.errorResponse(res, 500, "Internal server error");
    }
  }

  static async deleteYourAccount(req, res) {
    try {
      const result = await UserService.deleteYourAccount(req.user);

      if (result.statusCode === 404)
        return ResponseHelper.errorResponse(
          res,
          result.statusCode,
          result.message
        );

      Logger.info("deleteYourAccountController:", JSON.stringify(result.data));

      return ResponseHelper.successResponse(
        res,
        result.statusCode,
        result.message,
        result.data
      );
    } catch (err) {
      console.error("deleteYourAccountController Error:", err);
      return ResponseHelper.errorResponse(res, 500, "Internal server error");
    }
  }

  static async confirmAccountDelete(req, res) {
    try {
      const result = await UserService.confirmAccountDelete(req.query);

      if (result.statusCode === 403 || result.statusCode === 404)
        return ResponseHelper.errorResponse(
          res,
          result.statusCode,
          result.message
        );

      Logger.info(
        `confirmAccountDeleteController: ${JSON.stringify(result.data)}`
      );

      return ResponseHelper.successResponse(
        res,
        result.statusCode,
        result.message,
        result.data
      );
    } catch (err) {
      Logger.error("confirmAccountDeletexController Error:", err);
      return ResponseHelper.errorResponse(res, 500, "internal server error ");
    }
  }

  static async deleteProfilePicByUserId(req, res) {
    try {
      const result = await UserService.deleteProfilePicByUserId(req.params);

      if (result.statusCode === 404)
        return ResponseHelper.errorResponse(
          res,
          result.statusCode,
          result.message
        );

      Logger.info(
        `deleteProfilePicByPublicIdController: ${JSON.stringify(result.data)}`
      );

      return ResponseHelper.successResponse(
        res,
        result.statusCode,
        result.message,
        result.data
      );
    } catch (err) {
      Logger.error("deleteProfilePicByPublicIdController Error:", err);
      return ResponseHelper.errorResponse(res, 500, "internal server error ");
    }
  }

  static async deleteAccountById(req, res) {
    try {
      const result = await UserService.deleteAccountById(req.params);

      if (result.statusCode === 404)
        return ResponseHelper.errorResponse(
          res,
          result.statusCode,
          result.message
        );

      Logger.info(`deleteUserByIdController: ${JSON.stringify(result.data)}`);

      return ResponseHelper.successResponse(
        res,
        result.statusCode,
        result.message,
        result.data
      );
    } catch (err) {
      Logger.error("deleteUserByIdController Error:", err);
      return ResponseHelper.errorResponse(res, 500, "internal server error ");
    }
  }

  static async editAccount(req, res) {
    try {
      const result = await UserService.editAccount(req, req.user);

      if (result.statusCode === 404 || result.statusCode === 406)
        return ResponseHelper.errorResponse(
          res,
          result.statusCode,
          result.message
        );

      Logger.info(`editAccountController: ${JSON.stringify(result.data)}`);

      return ResponseHelper.successResponse(
        res,
        result.statusCode,
        result.message,
        result.data
      );
    } catch (err) {
      Logger.error("editAccountController Error:", err);
      return ResponseHelper.errorResponse(res, 500, "internal server error ");
    }
  }
}

export default UserController;
