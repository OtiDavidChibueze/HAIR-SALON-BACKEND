import Joi from "joi";
import mongoose from "mongoose";

// Joi validation schema
const appointmentSchema = Joi.object({
  customer: Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.error("any.invalid");
    }
    return value;
  }, "MongoDB ObjectId validation"),

  hairstylist: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }, "MongoDB ObjectId validation")
    .required(),

  service: Joi.string().min(3).max(100).required(),

  date: Joi.date()
    .greater("now") // Ensures the date is in the future
    .required(),

  timeSlot: Joi.string()
    .pattern(
      /^([0-9]{1,2}):([0-9]{2})\s?(AM|PM)\s?-\s?([0-9]{1,2}):([0-9]{2})\s?(AM|PM)$/
    )
    .required(),

  status: Joi.string()
    .valid("booked", "rescheduled", "canceled", "completed")
    .default("booked"),

  address: Joi.object({
    street: Joi.string().required().messages({
      "string.empty": "Street is required",
    }),
    city: Joi.string().required().messages({
      "string.empty": "City is required",
    }),
    state: Joi.string().required().messages({
      "string.empty": "State is required",
    }),
    postalCode: Joi.string()
      .pattern(/^[0-9]{5}(-[0-9]{4})?$/)
      .min(5)
      .max(9)
      .required()
      .messages({
        "string.empty": "Postal Code is required",
        "string.pattern.base":
          "Postal Code must be a valid format (e.g., 12345 or 12345-6789)",
      }),
    country: Joi.string().required().messages({
      "string.empty": "Country is required",
    }),
  }),
});

export { appointmentSchema };
