import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    hairstylist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    service: { type: String, required: true }, // Could also reference a Service model
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true }, // e.g., "10:00 AM - 11:00 AM"
    status: {
      type: String,
      enum: ["booked", "rescheduled", "canceled", "completed"],
      default: "booked",
    },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
  },
  { timestamps: true }
);

const appointmentModel = mongoose.model("Appointment", appointmentSchema);

export default appointmentModel;
