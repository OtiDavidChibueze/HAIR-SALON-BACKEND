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
  updateUser,
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
  "/user/upload-profile-pic",
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
route.get("/user/profile", JwtAuth, UserController.profile);
route.get("/user/logOut", JwtAuth, UserController.logOut);
route.get("/user/refresh", JwtAuth, UserController.refreshToken);

route.delete(
  "/user/delete-profile-pic",
  JwtAuth,
  UserController.deleteProfilePic
);
route.delete(
  "/user/delete-your-account",
  JwtAuth,
  UserController.deleteYourAccount
);
route.delete(
  "/delete-profile-pic/:id",
  JwtAuth,
  RBAC_Auth("Admin", "SuperAdmin"),
  UserController.deleteProfilePicByUserId
);
route.delete(
  "/user/delete-account/:id",
  JwtAuth,
  RBAC_Auth("Admin", "SuperAdmin"),
  UserController.deleteAccountById
);
route.put(
  "/user/update-profile",
  JwtAuth,
  SchemaValidationHelper.validateInput(updateUser),
  UserController.editAccount
);

route.get(
  "/users",
  JwtAuth,
  RBAC_Auth("Admin", "SuperAdmin"),
  UserController.users
);
route.get(
  "/admins",
  JwtAuth,
  RBAC_Auth("Admin", "SuperAdmin"),
  UserController.admins
);
route.get(
  "/superAdmins",
  JwtAuth,
  RBAC_Auth("Admin", "SuperAdmin"),
  UserController.superAdmins
);
route.get(
  "/users/totalCounts",
  JwtAuth,
  RBAC_Auth("SuperAdmin"),
  UserController.usersTotalCounts
);
export default route;
