import mongoose from "mongoose";
import { Logger } from "../config/logger.js";
import ResponseHelper from "./responseHelper.js";

class SchemaValidationHelper {
  static validateSchema(schema, object) {
    const { error, value } = schema.validate(object, {
      aboutEarly: false,
      stripUnknown: true,
    });

    if (error)
      Logger.warn(
        JSON.stringify(`Validation failed: ${JSON.stringify(error.details)}`)
      );

    return { error, value };
  }

  static validateInput(schema, target = "body") {
    return (req, res, next) => {
      const { error, value } = SchemaValidationHelper.validateSchema(
        schema,
        req[target]
      );

      if (!error) {
        req[target] = value;
        return next();
      }

      Logger.error(
        `Validation Error: ${error.details.map((e) => e.message).join(" ")}`
      );

      const errors = error.details.map((d) => ({
        field: d.context.label,
        message: d.message,
      }));

      return ResponseHelper.errorResponse(res, 422, {
        message: "Validation failed",
        errors,
      });
    };
  }
}
export default SchemaValidationHelper;
