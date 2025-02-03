import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, unique: true, required: true },
    phone: { type: String, unique: true, required: true },
    role: {
      type: String,
      enum: ["User", "Hairstylist", "Admin"],
      default: "User",
    },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },

    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],

    profilePic: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

mongoose.plugin(mongoosePaginate);

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
