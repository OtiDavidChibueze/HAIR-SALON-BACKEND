import { Logger } from "../config/logger.js";
import JwtHelper from "../util/jwtHelper.js";
import HelperFunction from "../util/helperFunction.js";
import UserModel from "../model/userModel.js";
import {
  PRODUCTION_EMAIL_ADDRESS,
  PRODUCTION_BASE_URL,
} from "../config/keys.js";
import transporter from "../config/nodemailer.js";
import redisClient from "../config/redis.js";
import cloudinary from "../config/cloudinary.js";
const APPNAME = "DIVINE GIFT HAIR SALON";

class UserService {
  static async login(res, { email, password }) {
    if (!email && !password)
      return {
        statusCode: 422,
        message: "Provide email and password",
      };

    let userAlreadyBlocked;

    try {
      userAlreadyBlocked = await redisClient.get(`blockedAccount:${email}`);
    } catch (err) {
      Logger.error("Redis Error:", err);
    }

    if (userAlreadyBlocked)
      return {
        statusCode: 406,
        message: "This account has been blocked!",
      };

    const getUser = await UserModel.findOne({ email });

    if (!getUser)
      return {
        statusCode: 404,
        message: "Invalid email/password",
      };

    if (getUser.isVerified == false) {
      const verificationToken = JwtHelper.generateVerificationToken(getUser);

      const mailOption = {
        from: PRODUCTION_EMAIL_ADDRESS,
        to: getUser.email,
        subject: "Account Verification",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                }
                a {
                  color: #007BFF;
                  text-decoration: none;
                }
                a:hover {
                  text-decoration: underline;
                }
              </style>
            </head>
            <body>
              <h1>${APPNAME}</h1>
              <p>Please click the link below to verify your account:</p>
              <p>
                <a href="${PRODUCTION_BASE_URL}/verify-email?token=${verificationToken}">
                  Verify Your Account
                </a>
              </p>
              <p>If you didn’t request this, you can safely ignore this email.</p>
            </body>
          </html>
        `,
      };

      await transporter.sendMail(mailOption);

      return {
        statusCode: 406,
        message: "Please verify account before attempting login!",
      };
    }

    const comparePassword = HelperFunction.comparePassword(
      getUser.password,
      password
    );

    if (!comparePassword)
      return {
        statusCode: 404,
        message: "Invalid email/password",
      };

    const accessToken = JwtHelper.generateAccessToken(getUser);
    const refreshToken = JwtHelper.generateRefreshToken(getUser);

    HelperFunction.accessTokenCookie(res, accessToken);
    HelperFunction.refreshTokenCookie(res, refreshToken);

    return {
      statusCode: 200,
      message: "log in successful",
      data: {
        user: getUser.name,
        role: getUser.role,
        refreshToken,
        accessToken,
      },
    };
  }

  static async signIn(data) {
    if (!data || Object.keys(data).length === 0)
      return {
        statusCode: 422,
        message: "Provide inputs for fields",
      };

    let userAlreadyBlocked;

    try {
      userAlreadyBlocked = await redisClient.get(
        `blockedAccount:${data.email}`
      );
    } catch (err) {
      Logger.error("Redis Error:", err);
    }

    if (userAlreadyBlocked)
      return {
        statusCode: 406,
        message: "This account has been blocked!",
      };

    const userExists = await UserModel.findOne({
      $or: [{ email: data.email }, { phone: data.phone }],
    });

    if (userExists)
      return {
        statusCode: 406,
        message: "User already have an existing account",
      };

    const hashPassword = await HelperFunction.hashPassword(data.password);

    const user = new UserModel(data);

    user.password = hashPassword;

    await user.save();

    const verificationToken = JwtHelper.generateVerificationToken(user);

    const mailOption = {
      from: PRODUCTION_EMAIL_ADDRESS,
      to: user.email,
      subject: "Account Verification",
      html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                }
                a {
                  color: #007BFF;
                  text-decoration: none;
                }
                a:hover {
                  text-decoration: underline;
                }
              </style>
            </head>
            <body>
              <h1>${APPNAME}</h1>
              <p>Please click the link below to verify your account:</p>
              <p>
                <a href="${PRODUCTION_BASE_URL}/verify-email?token=${verificationToken}">
                  Verify Your Account
                </a>
              </p>
              <p>If you didn’t request this, you can safely ignore this email.</p>
            </body>
          </html>
        `,
    };

    await transporter.sendMail(mailOption);

    return {
      statusCode: 200,
      message:
        "Account created, and a verification mail has been sent to your email !",
      data: { user, verificationToken },
    };
  }

  static async verifyAccount(token) {
    if (!token)
      return {
        statusCode: 404,
        message: "No token found",
      };

    let tokenBlackListed;

    try {
      tokenBlackListed = await redisClient.get(`blacklist:${token}`);
    } catch (err) {
      Logger.error("Redis Error:", err);
    }

    if (tokenBlackListed)
      return {
        statusCode: 403,
        message: "Token has been revoked",
      };

    const decode = JwtHelper.decodeVerificationToken(token);

    if (!decode)
      return {
        statusCode: 400,
        message: "Invalid token or token expired",
      };

    const user = await UserModel.findById(decode.id);

    if (!user)
      return {
        statusCode: 404,
        message: "User does not exist",
      };

    if (user.isVerified === true)
      return {
        statusCode: 406,
        message: "Account has already been verified",
      };

    user.isVerified = true;
    await user.save();

    return {
      statusCode: 200,
      message: "Account has been verified, you can now login!",
      data: { isVerified: user.isVerified },
    };
  }

  static async forgottenPassword({ email }) {
    if (!email)
      return {
        statusCode: 404,
        message: "Provide an email field",
      };

    const getUser = await UserModel.findOne({ email });

    if (!getUser)
      return {
        statusCode: 404,
        message: "User with the provided email not found",
      };

    const resetToken = JwtHelper.generateVerificationToken(getUser);

    const mailOption = {
      from: PRODUCTION_EMAIL_ADDRESS,
      to: getUser.email,
      subject: "Password Reset",
      html: `
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                  }
                  a {
                    color: #007BFF;
                    text-decoration: none;
                  }
                  a:hover {
                    text-decoration: underline;
                  }
                </style>
              </head>
              <body>
                <h1>${APPNAME}</h1>
                <p>Please click the link below to reset your account password:</p>
                <p>
                  <a href="${PRODUCTION_BASE_URL}/reset-password?token=${resetToken}">
                    Verify Your Account
                  </a>
                </p>
                <p>If you didn’t request this, you can safely ignore this email.</p>
              </body>
            </html>
          `,
    };

    await transporter.sendMail(mailOption);

    return {
      statusCode: 200,
      message: "A password reset link has been sent to your provided email!",
      data: { user: getUser.email, resetToken },
    };
  }

  static async resetPassword(token, { newPassword, comfirmPassword }) {
    if (!token)
      return {
        statusCode: 404,
        message: "No token found",
      };

    if (!newPassword && !comfirmPassword)
      return {
        statusCode: 404,
        message: "Provide new password and comfrim password input!",
      };

    const decode = JwtHelper.decodeAccessToken(token);

    if (!decode)
      return {
        statusCode: 400,
        message: "Invalid token or token expired",
      };

    const user = await UserModel.findById(decode.id);

    if (!user)
      return {
        statusCode: 404,
        message: "User does not exist",
      };

    if (newPassword !== comfirmPassword)
      return {
        statusCode: 406,
        message: "passwords isnt matched, please check your inputs",
      };

    const hashPassword = await HelperFunction.hashPassword(comfirmPassword);

    user.password = hashPassword;
    await user.save();

    return {
      statusCode: 200,
      message: "Account password has been reset, you can now login!",
      data: { user: user.email },
    };
  }

  static async profile({ id }) {
    HelperFunction.IdValidation(id);

    const user = await UserModel.findById(id, { password: 0 });

    if (!user)
      return {
        statusCode: 404,
        message: "User not found",
      };

    return {
      statusCode: 200,
      message: "Profile fetched!",
      data: { user },
    };
  }

  static async logOut(res, { refreshToken, accessToken }) {
    if (!refreshToken)
      return {
        statusCode: 400,
        message: "No tokens provided for log out",
      };

    const decode = accessToken
      ? JwtHelper.decodeRefreshToken(refreshToken)
      : refreshToken
      ? JwtHelper.decodeRefreshToken(refreshToken)
      : null;

    if (!decode)
      return {
        statusCode: 403,
        message: "Invalid or expired token",
      };

    accessToken
      ? await redisClient.setEx(
          `blacklist:${accessToken}`,
          15 * 60 * 1000,
          decode.id
        )
      : null;

    refreshToken
      ? await redisClient.setEx(
          `blacklist:${refreshToken}`,
          7 * 24 * 24 * 60 * 1000,
          decode.id
        )
      : null;

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return {
      statusCode: 200,
      message: "user logged out",
      data: { userId: decode.id },
    };
  }

  static async refreshToken(res, { accessToken, refreshToken }) {
    if (!accessToken || !refreshToken)
      return {
        statusCode: 404,
        message: "No token found",
      };

    const decode = accessToken
      ? JwtHelper.decodeAccessToken(accessToken)
      : refreshToken
      ? JwtHelper.decodeRefreshToken(refreshToken)
      : null;

    if (!decode)
      return {
        statusCode: 403,
        message: "Invalid or expired token",
      };

    const user = await UserModel.findById(decode.id);

    if (!user)
      return {
        statusCode: 404,
        message: "User not found",
      };

    accessToken
      ? await redisClient.setEx(
          `blacklist:${accessToken}`,
          15 * 60 * 1000,
          decode.id
        )
      : refreshToken
      ? await redisClient.setEx(
          `blacklist:${refreshToken}`,
          7 * 24 * 60 * 60 * 1000,
          decode.id
        )
      : null;

    const generateAccessToken = JwtHelper.generateAccessToken(user);
    const generateRefreshToken = JwtHelper.generateRefreshToken(user);

    HelperFunction.accessTokenCookie(res, generateAccessToken);
    HelperFunction.refreshTokenCookie(res, generateRefreshToken);

    return {
      statusCode: 200,
      message: "refreshed successfully",
      data: { generateAccessToken, generateRefreshToken },
    };
  }

  static async uploadProfilePicture({ id }, { file }) {
    HelperFunction.IdValidation(id);

    if (!file) {
      return {
        statusCode: 404,
        message: "Please select a file to upload",
      };
    }

    const user = await UserModel.findById(id);
    if (!user) {
      return {
        statusCode: 404,
        message: "User does not exist",
      };
    }

    user.profilePic?.publicId
      ? await cloudinary.uploader.destroy(user.profilePic.publicId)
      : null;

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "profile_pictures",
          public_id: `user-${user.id}-${Date.now()}`,
        },
        (error, result) => {
          error ? reject(error) : resolve(result);
        }
      );

      stream.end(file.buffer);
    });

    user.profilePic = {
      url: result.secure_url,
      publicId: result.public_id,
    };
    await user.save();

    return {
      statusCode: 200,
      message: "Profile picture uploaded successfully",
      data: user.profilePic,
    };
  }

  static async deleteProfilePic({ id }) {
    HelperFunction.IdValidation(id);

    const user = await UserModel.findById(id);

    if (!user)
      return {
        statusCode: 404,
        message: "User not found",
      };

    user.profilePic.publicId
      ? await cloudinary.uploader.destroy(user.profilePic.publicId)
      : null;

    user.profilePic.url = "";
    user.profilePic.publicId = "";

    await user.save();

    return {
      statusCode: 200,
      message: "profile picture deleted",
      data: user.profilePic,
    };
  }

  static async deleteYourAccount({ id }) {
    HelperFunction.IdValidation(id);

    const user = await UserModel.findById(id, { password: 0 });

    if (!user)
      return {
        statusCode: 404,
        message: "User not found",
      };

    const verificationToken = JwtHelper.generateVerificationToken(user);

    const mailOption = {
      from: PRODUCTION_EMAIL_ADDRESS,
      to: user.email,
      subject: "Delete Your Account",
      html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                }
                a {
                  color: #007BFF;
                  text-decoration: none;
                }
                a:hover {
                  text-decoration: underline;
                }
              </style>
            </head>
            <body>
              <h1>${APPNAME}</h1>
              <p>Please click the link below to delete your account:</p>
              <p>
                <a href="${PRODUCTION_BASE_URL}/delete-account?token=${verificationToken}">
                  Delete Your Account
                </a>
              </p>
              <p>If you didn’t request this, you can safely ignore this email.</p>
            </body>
          </html>
        `,
    };

    await transporter.sendMail(mailOption);

    return {
      statusCode: 200,
      message:
        "To permantly delete your account, comfrim via mail sent to your email!",
      data: { user: user.email, verificationToken },
    };
  }

  static async confirmAccountDelete({ token }) {
    if (!token)
      return {
        statusCode: 404,
        message: "No verification token found",
      };

    let tokenBlackListed;

    try {
      tokenBlackListed = await redisClient.get(`blacklist:${token}`);
    } catch (err) {
      Logger.error("Redis Error:", err);
    }

    if (tokenBlackListed)
      return {
        statusCode: 403,
        message: "Token has been revoked",
      };

    const decode = JwtHelper.decodeVerificationToken(token);

    if (!decode)
      return {
        statusCode: 403,
        message: "Invalid or expired token",
      };

    const user = await UserModel.findByIdAndDelete(decode.id);

    if (!user)
      return {
        statusCode: 404,
        message: "User not found",
      };

    return {
      statusCode: 200,
      message: "Account successfully deleted!",
    };
  }

  static async deleteProfilePicByUserId({ id }) {
    if (!id) {
      return {
        statusCode: 404,
        message: "Provide the user id to delete the image",
      };
    }

    HelperFunction.IdValidation(id);

    const user = await UserModel.findById(id);

    if (!user) {
      return {
        statusCode: 404,
        message: "User with the provided ID does not exist",
      };
    }

    if (user.profilePic?.publicId) {
      await cloudinary.uploader.destroy(user.profilePic.publicId);
    } else {
      return {
        statusCode: 404,
        message: "No profile picture found to delete",
      };
    }

    user.profilePic = {
      url: "",
      publicId: "",
    };

    await user.save();

    const mailOption = {
      from: PRODUCTION_EMAIL_ADDRESS,
      to: user.email,
      subject: "Warning On Profile Picture",
      html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                }
                a {
                  color: #007BFF;
                  text-decoration: none;
                }
                a:hover {
                  text-decoration: underline;
                }
              </style>
            </head>
            <body>
              <h1>${APPNAME}</h1>
              <p>Hi dear ${user.name}</p>
              <p>Your profile picture goes against our community standard and has been deleted! Please take note else your account would be permantly blocked!</p>
              <p>Thank for your understanding :)</p>
            </body>
          </html>
        `,
    };

    await transporter.sendMail(mailOption);

    return {
      statusCode: 200,
      message: "Profile picture deleted successfully",
      data: user.profilePic,
    };
  }

  static async deleteAccountById({ id }) {
    if (!id)
      return {
        statusCode: 404,
        message: "Provide user id to delete",
      };

    HelperFunction.IdValidation(id);

    const user = await UserModel.findById(id);

    if (!user)
      return {
        statusCode: 404,
        message: "User does not exist",
      };

    await UserModel.findByIdAndDelete(id);

    try {
      await redisClient.setEx(
        `blockedAccount:${user.email}`,
        3 * 365 * 24 * 60 * 60 * 1000,
        user.id
      );
    } catch (err) {
      Logger.error("Redis Error:", err);
    }

    const mailOption = {
      from: PRODUCTION_EMAIL_ADDRESS,
      to: user.email,
      subject: "Account Deleted",
      html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                }
                a {
                  color: #007BFF;
                  text-decoration: none;
                }
                a:hover {
                  text-decoration: underline;
                }
              </style>
            </head>
            <body>
              <h1>${APPNAME}</h1>
              <p>Hi dear ${user.name}</p>
              <p>Your account has been permantly blocked! bacause it goes against our community standard!</p>
              <p>If you feel like we made a mistake, kindly request for a review</p>
              <p>Thanks for your understanding:)<p/>
            </body>
          </html>
        `,
    };

    await transporter.sendMail(mailOption);

    return {
      statusCode: 200,
      message: "Account has been permantly deleted",
      data: user.email,
    };
  }

  static async editAccount({ body }, { id }) {
    if (!body || Object.keys(body).length === 0)
      return {
        statusCode: 404,
        message: "Provide inputs to proceed with account edit ",
      };

    HelperFunction.IdValidation(id);

    console.log("id", id);

    const user = await UserModel.findById(id);

    if (!user)
      return {
        statusCode: 404,
        message: "User does not exist",
      };

    if (user.id !== id)
      return {
        statusCode: 404,
        message: "Sorry! you can't proceed with this request",
      };

    if (body.email && body.email !== user.email) {
      const isDupulicate = await UserModel.findOne({ email: body.email });

      if (isDupulicate)
        return {
          statusCode: 406,
          message: "Provided email has already been taken!!!",
        };

      user.email = body.email;
      user.isVerified = !user.isVerified;
    }

    if (body.phone && body.phone !== user.phone) {
      const isDupulicate = await UserModel.findOne({ phone: body.phone });

      if (isDupulicate)
        return {
          statusCode: 406,
          message: "Provided phone number has already been taken!!!",
        };

      user.phone = body.phone;
    }

    Object.keys(body).forEach((key) => {
      key !== "email" && key !== "phone" ? (user[key] = body[key]) : null;
    });

    const updateUser = await user.save();

    return {
      statusCode: 200,
      message: "User updated successfully",
      data: updateUser,
    };
  }

  static async users() {
    const users = await UserModel.find({ role: "User" }, { password: 0 }).sort({
      name: 1,
      createdAt: 1,
    });

    if (users.length === 0)
      return {
        statusCode: 404,
        message: [{ message: "No users found", count: users.length }],
      };

    const count = users.length;

    return {
      statusCode: 200,
      message: "Users fetched successfully",
      data: { users, count },
    };
  }

  static async admins() {
    const admins = await UserModel.find(
      { role: "Admin" },
      { password: 0 }
    ).sort({
      name: 1,
      createdAt: 1,
    });

    if (admins.length === 0)
      return {
        statusCode: 404,
        message: [{ message: "No admins found", count: admins.length }],
      };

    const count = admins.length;

    return {
      statusCode: 200,
      message: "admins fetched successfully",
      data: { admins, count },
    };
  }

  static async superAdmins() {
    const superAdmins = await UserModel.find(
      { role: "SuperAdmin" },
      { password: 0 }
    ).sort({
      name: 1,
      createdAt: 1,
    });

    if (superAdmins.length === 0)
      return {
        statusCode: 404,
        message: [
          { message: "No superAdmins found", count: superAdmins.length },
        ],
      };

    const count = superAdmins.length;

    return {
      statusCode: 200,
      message: "superAdmins fetched successfully",
      data: { superAdmins, count },
    };
  }

  static async usersTotalCounts() {
    const allUsers = await UserModel.countDocuments();

    return {
      statusCode: 200,
      message: "total Users Count fetched",
      data: allUsers,
    };
  }
}

export default UserService;
