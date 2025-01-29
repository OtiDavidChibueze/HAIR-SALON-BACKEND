import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hairstylist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    service: { type: mongoose.Schema.ObjectId, ref: "Service", required: true },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    status: {
      type: String,
      enum: ["booked", "rescheduled", "canceled", "completed"],
      default: "booked",
    },
  },
  { timestamps: true }
);

const appointmentModel = mongoose.model("Appointment", appointmentSchema);

export default appointmentModel;
