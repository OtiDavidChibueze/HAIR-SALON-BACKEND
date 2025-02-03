import { Logger } from "../config/logger.js";
import AppointmentService from "../service/appointmentService.js";
import ResponseHelper from "../util/responseHelper.js";

class AppointmentController {
  static async createAppointment(req, res) {
    try {
      const result = await AppointmentService.createAppointment(req, req.user);

      if (result.statusCode == 404 || result.statusCode == 406)
        return ResponseHelper.errorResponse(
          res,
          result.statusCode,
          result.message
        );

      Logger.info(
        "createAppointmentController ->:",
        JSON.stringify(result.data)
      );

      return ResponseHelper.successResponse(
        res,
        result.statusCode,
        result.message,
        result.data
      );
    } catch (err) {
      Logger.error("createAppointment Error:", err);
      return ResponseHelper.errorResponse(res, 500, "Internal server error");
    }
  }

  static async appointments(req, res) {
    try {
      const result = await AppointmentService.appointments(req.user);

      if (result.statusCode == 404)
        return ResponseHelper.errorResponse(
          res,
          result.statusCode,
          result.message
        );

      Logger.info("appointmentsController ->:", JSON.stringify(result.data));

      return ResponseHelper.successResponse(
        res,
        result.statusCode,
        result.message,
        result.data
      );
    } catch (err) {
      Logger.error("appointmentsController Error:", err);
      return ResponseHelper.errorResponse(res, 500, "Internal server error");
    }
  }
}

export default AppointmentController;
