import express from "express";
const route = express.Router();
import JwtAuth from "../middleware/authentication.js";
import AppointmentController from "../controller/appointmentController.js";
import { appointmentLimiter } from "../config/rateLimit.js";
import SchemaValidationHelper from "../util/schemaValidationHelper.js";
import {
  createAppointment,
  editAppointment,
} from "../validation/schema/appointmentSchemaValidation.js";
import RBAC_Auth from "../middleware/RBAC.js";

route.post(
  "/user/new-appointment",
  JwtAuth,
  appointmentLimiter,
  SchemaValidationHelper.validateInput(createAppointment),
  AppointmentController.createAppointment
);
route.get(
  "/user/appointments",
  JwtAuth,
  RBAC_Auth("Hairstylist"),
  AppointmentController.HairStylistAppointments
);
route.get(
  "/user/all-appointments",
  JwtAuth,
  RBAC_Auth("Admin"),
  AppointmentController.appointments
);
route.get(
  "/user/appointment/:id",
  JwtAuth,
  RBAC_Auth("Hairstylist", "Admin"),
  AppointmentController.getAppointmentById
);
route.put(
  "/user/edit-appointment/:id",
  JwtAuth,
  SchemaValidationHelper.validateInput(editAppointment),
  RBAC_Auth("Hairstylist", "Admin"),
  AppointmentController.editAppointmentById
);
route.delete(
  "/user/del-appointment/:id",
  JwtAuth,
  RBAC_Auth("Hairstylist", "Admin"),
  AppointmentController.deleteAppointmentById
);

export default route;
