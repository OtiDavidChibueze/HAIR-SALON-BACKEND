import { Logger } from "../config/logger.js";
import ResponseHelper from "../util/responseHelper.js";
import JwtHelper from "../util/jwtHelper.js";
import HelperFunction from "../util/helperFunction.js";
import UserModel from "../model/userModel.js";

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
}

export default UserService;
