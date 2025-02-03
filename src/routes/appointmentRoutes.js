import express from "express";
const route = express.Router();
import JwtAuth from "../middleware/authentication.js";
import AppointmentController from "../controller/appointmentController.js";
import { appointmentLimiter } from "../config/rateLimit.js";
import SchemaValidationHelper from "../util/schemaValidationHelper.js";
import { appointmentSchema } from "../validation/schema/appointmentSchemaValidation.js";
import RBAC_Auth from "../middleware/RBAC.js";

route.post(
  "/user/new-appointment",
  JwtAuth,
  appointmentLimiter,
  SchemaValidationHelper.validateInput(appointmentSchema),
  AppointmentController.createAppointment
);
// get all appointment
route.get(
  "/user/appointments",
  JwtAuth,
  RBAC_Auth("User"),
  AppointmentController.appointments
);

// delete appointment
// update appointment
// get appointment by id
// delete appointment by id

export default route;
