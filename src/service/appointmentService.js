import { PRODUCTION_EMAIL_ADDRESS } from "../config/keys.js";
import transporter from "../config/nodemailer.js";
import AppointmentModel from "../model/appointmentModel.js";
import UserModel from "../model/userModel.js";
import HelperFunction from "../util/helperFunction.js";

class AppointmentService {
  static async createAppointment({ body }, { id }) {
    if (!body || Object.keys(body).length === 0) {
      return {
        statusCode: 400,
        message: "Please provide all required fields",
      };
    }

    HelperFunction.IdValidation(id);

    const customer = await UserModel.findById(id);
    if (!customer) {
      return {
        statusCode: 404,
        message: "User does not exist!",
      };
    }

    const hairstylist = await UserModel.findById(body.hairstylist);
    if (!hairstylist) {
      return {
        statusCode: 404,
        message: "Hairstylist does not exist!",
      };
    }

    const isDuplicate = await AppointmentModel.findOne({
      date: body.date,
      timeSlot: body.timeSlot,
      hairstylist: body.hairstylist,
    });

    if (isDuplicate) {
      return {
        statusCode: 406,
        message: "Sorry! This time slot has already been booked.",
      };
    }

    const appointment = new AppointmentModel({
      customer: id,
      hairstylist: body.hairstylist,
      service: body.service,
      date: body.date,
      timeSlot: body.timeSlot,
      address: customer.address,
    });

    await appointment.save();

    const generateEmailTemplate = (
      recipientName,
      otherPartyName,
      appointment,
      isHairstylist = false
    ) => {
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #4CAF50;">Appointment ${
            isHairstylist ? "Booking" : "Confirmation"
          }</h2>
          <p>Dear <strong>${recipientName}</strong>,</p>
          <p>Your appointment ${
            isHairstylist ? "with" : "has been booked with"
          } <strong>${otherPartyName}</strong>.</p>
          <p><strong>Service:</strong> ${appointment.service}</p>
          <p><strong>Date:</strong> ${new Date(
            appointment.date
          ).toDateString()}</p>
          <p><strong>Time Slot:</strong> ${appointment.timeSlot}</p>
          <p><strong>Address:</strong> ${
            isHairstylist ? customer.address : hairstylist.address
          } </p>
          <p>Thank you for choosing our salon!</p>
          <p style="color: #888; font-size: 12px;">This is an automated email. Please do not reply.</p>
        </div>
      `;
    };

    const subject = "Appointment Confirmation";
    const customerEmailHTML = generateEmailTemplate(
      customer.name,
      hairstylist.name,
      body
    );
    const hairstylistEmailHTML = generateEmailTemplate(
      hairstylist.name,
      customer.name,
      body,
      true
    );

    const mailOptions = [
      {
        from: PRODUCTION_EMAIL_ADDRESS,
        to: customer.email,
        subject,
        html: customerEmailHTML,
      },
      {
        from: PRODUCTION_EMAIL_ADDRESS,
        to: hairstylist.email,
        subject,
        html: hairstylistEmailHTML,
      },
    ];

    await Promise.all(mailOptions.map((mail) => transporter.sendMail(mail)));

    return {
      statusCode: 200,
      message: "Appointment has been created successfully!",
      data: appointment,
    };
  }

  static async appointments({ id }) {
    if (!id)
      return {
        statusCode: 404,
        message: "ID not provided",
      };

    HelperFunction.IdValidation(id);

    const user = await UserModel.findById(id);

    if (!user)
      return {
        statusCode: 404,
        message: "User does not exist",
      };

    const getAppointments = await AppointmentModel.find({ customer: id });

    return {
      statusCode: 200,
      message: "Appointments fetched successfully",
      data: { appointments: getAppointments },
    };
  }
}

export default AppointmentService;
