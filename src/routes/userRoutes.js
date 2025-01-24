import express from "express";
const route = express.Router();
import RBAC_Auth from "../middleware/RBAC.js";
import JwtAuth from "../middleware/authentication.js";
import UserController from "../controller/userController.js";
import SchemaValidationHelper from "../util/schemaValidationHelper.js";
import {
  createUser,
  login,
} from "../validation/schema/userSchemaValidation.js";

route.post(
  "/login",
  SchemaValidationHelper.validateInput(login),
  UserController.login
);

route.post(
  "/createUser",
  SchemaValidationHelper.validateInput(createUser),
  UserController.createUser
);

route.get("/verify-email", UserController.verifyAccount);

export default route;
