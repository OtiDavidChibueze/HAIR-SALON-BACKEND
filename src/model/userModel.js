import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    avatar: {
      url: String,
      publicId: String,
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
