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

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

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

    let tokenBlacklisted;

    try {
      tokenBlacklisted = await redisClient.get(`blacklist:${token}`);
    } catch (err) {
      return Logger.error("Redis Error:", err);
    }

    if (tokenBlacklisted)
      return {
        statusCode: 403,
        message: "Token has already been revoked",
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
}

export default UserService;
