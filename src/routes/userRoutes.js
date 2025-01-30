import express from "express";
const route = express.Router();
import RBAC_Auth from "../middleware/RBAC.js";
import JwtAuth from "../middleware/authentication.js";
import UserController from "../controller/userController.js";
import SchemaValidationHelper from "../util/schemaValidationHelper.js";
import {
  createUser,
  forgottenPassword,
  login,
  resetPassword,
} from "../validation/schema/userSchemaValidation.js";
import { loginLimiter } from "../config/rateLimit.js";
import { uploadProfilePic } from "../middleware/upload.js";

route.post(
  "/login",
  loginLimiter,
  SchemaValidationHelper.validateInput(login),
  UserController.login
);
route.post(
  "/createUser",
  SchemaValidationHelper.validateInput(createUser),
  UserController.signIn
);
route.post(
  "/upload-profile-pic",
  JwtAuth,
  uploadProfilePic.single("image"),
  UserController.uploadProfilePic
);

route.get("/verify-email", UserController.verifyAccount);
route.get("/confirm-delete-account", UserController.confirmAccountDelete);

route.get(
  "/reset-password",
  SchemaValidationHelper.validateInput(resetPassword),
  UserController.resetPassword
);
route.get(
  "/forgotten-password",
  SchemaValidationHelper.validateInput(forgottenPassword),
  UserController.forgottenPassword
);
route.get("/profile", JwtAuth, UserController.profile);
route.get("/logOut", JwtAuth, UserController.logOut);
route.get("/refresh", JwtAuth, UserController.refreshToken);

route.delete("/delete-profile-pic", JwtAuth, UserController.deleteProfilePic);
route.delete("/delete-your-account", JwtAuth, UserController.deleteYourAccount);
route.delete(
  "/delete-profile-pic/:id",
  JwtAuth,
  RBAC_Auth("Admin", "SuperAdmin"),
  UserController.deleteProfilePicByUserId
);
route.delete(
  "/delete-account/:id",
  JwtAuth,
  RBAC_Auth("Admin", "SuperAdmin"),
  UserController.deleteAccountById
);

export default route;
