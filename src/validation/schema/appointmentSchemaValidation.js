import Joi from "joi";
import mongoose from "mongoose";

// Joi validation schema
const createAppointment = Joi.object({
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
}).unknown(true);

const editAppointment = Joi.object({
  status: Joi.string().valid("booked", "rescheduled", "canceled", "completed"),
}).unknown(true);

export { createAppointment, editAppointment };
