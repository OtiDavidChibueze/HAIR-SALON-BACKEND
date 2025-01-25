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

route.post(
  "/login",
  loginLimiter,
  SchemaValidationHelper.validateInput(login),
  UserController.login
);
route.post(
  "/createUser",
  SchemaValidationHelper.validateInput(createUser),
  UserController.createUser
);

route.get("/verify-email", UserController.verifyAccount);
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

export default route;
