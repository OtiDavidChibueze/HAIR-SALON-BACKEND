import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    profilePic: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },

    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["customer", "admin", "superAdmin"],
      default: "customer",
    },

    createdAt: { type: Date, default: Date.now() },

    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("user", userSchema);

export default UserModel;
