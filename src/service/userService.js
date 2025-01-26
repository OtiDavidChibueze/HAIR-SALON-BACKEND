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

class UserService {
  static async login(res, { email, password }) {
    if (!email && !password)
      return {
        statusCode: 422,
        message: "Provide email and password",
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
      data: { user: getUser.name, refreshToken, accessToken },
    };
  }

  static async createUser(data) {
    if (!data)
      return {
        statusCode: 422,
        message: "Provide inputs for fields",
      };

    const userExists = await UserModel.findOne({ email: data.email });

    if (userExists)
      return {
        statusCode: 406,
        message: "User already have an existing account",
      };

    const hashPassword = await HelperFunction.hashPassword(data.password);

    const user = await new UserModel(data);

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

    const decode = JwtHelper.decodeRefreshToken(refreshToken);

    if (!decode)
      return {
        statusCode: 403,
        message: "Invalid or expired token",
      };

    await redisClient.setEx(
      `blacklist:${accessToken}`,
      15 * 60 * 1000,
      decode.id
    );
    await redisClient.setEx(
      `blacklist:${refreshToken}`,
      7 * 24 * 24 * 60 * 1000,
      decode.id
    );

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
}

export default UserService;
