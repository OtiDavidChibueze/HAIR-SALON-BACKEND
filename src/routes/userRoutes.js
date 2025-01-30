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
  UserController.createUser
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
// delete profile pic by id
route.delete(
  "/delete-profile-pic/:id",
  JwtAuth,
  RBAC_Auth("Admin", "SuperAdmin"),
  UserController.deleteProfilePicByUserId
);

// delete user by id
// update profile
// update profile by id
// get all users
// get all admins
// get all superAdmins
// get total user total count
// get total admin total count
// get total superAdmin total count
// find closest admin(hairStylist)
// static async findNearby(req, res) {
//   const { longitude, latitude, maxDistance = 5000 } = req.query; // Default max distance: 5km

//   if (!longitude || !latitude) {
//     return res.status(400).json({
//       status: "error",
//       message: "Longitude and latitude are required",
//     });
//   }

//   try {
// const hairstylists = await UserModel.find({
//   role: "hairstylist",
//   location: {
//     $near: {
//       $geometry: { type: "Point", coordinates: [longitude, latitude] },
//       $maxDistance: maxDistance,
//     },
//   },
// }).sort({ location: 1 }); // Sort by proximity

//     res.status(200).json({
//       status: "success",
//       message: "Nearby hairstylists found",
//       data: hairstylists,
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: "error",
//       message: "Internal server error",
//       error: err.message,
//     });
//   }
// }

export default route;
