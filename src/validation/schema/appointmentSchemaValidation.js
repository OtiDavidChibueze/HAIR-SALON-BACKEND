import Joi from "joi";

// Custom validation for MongoDB ObjectId
const objectId = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .message("Invalid ObjectId format");

const appointmentValidationSchema = Joi.object({
  customer: objectId.required().messages({
    "any.required": "Customer is required",
    "string.pattern.base": "Customer must be a valid ObjectId",
  }),
  hairstylist: objectId.required().messages({
    "any.required": "Hairstylist is required",
    "string.pattern.base": "Hairstylist must be a valid ObjectId",
  }),
  service: objectId.required().messages({
    "any.required": "Service is required",
    "string.pattern.base": "Service must be a valid ObjectId",
  }),
  date: Joi.date().iso().greater("now").required().messages({
    "any.required": "Date is required",
    "date.base": "Date must be a valid ISO date",
    "date.greater": "Date must be in the future",
  }),
  timeSlot: Joi.string()
    .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      "any.required": "Time slot is required",
      "string.pattern.base": "Time slot must be in HH:mm format (24-hour)",
    }),
  status: Joi.string()
    .valid("booked", "rescheduled", "canceled", "completed")
    .default("booked")
    .messages({
      "any.only":
        "Status must be one of 'booked', 'rescheduled', 'canceled', or 'completed'",
    }),
});

export { appointmentValidationSchema };
