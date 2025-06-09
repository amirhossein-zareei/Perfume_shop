const bcrypt = require("bcrypt");

const { User } = require("../../../models/index");
const sendSuccess = require("../../../utils/apiResponse");
const AppError = require("../../../utils/AppError");
const logger = require("../../../utils/logger");
const { app, auth } = require("../../../config/env");
const {
  generateCaptcha,
  verifyCaptcha,
} = require("../../../services/captchaService");
const {
  generateAccessToken,
  generateRefreshToken,
  blocklistAccessToken,
  revokeRefreshToken,
  verifyRefreshToken,
  passwordResetTokenHandler
} = require("../../../services/tokenService");
const { sendPasswordRestEmail } = require("../../../services/emailService");

//---- Helper Function ----
const _handleCaptchaValidation = async (uuid, captcha) => {
  const isCaptchaValid = await verifyCaptcha(uuid, captcha);

  if (!isCaptchaValid) {
    throw new AppError("Invalid CAPTCHA, Please try again", 400);
  }
};

const _setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: app.mode === "production",
    sameSite: "Strict",
    maxAge: auth.refreshTokenExpiresIn * 24 * 60 * 60 * 1000,
  });
};

const _clearRefreshTokenCookie = (res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: app.mode === "production",
    sameSite: "Strict",
  });
};

const _getAndValidateRefreshTokenCookie = (req) => {
  const refreshTokenFromCookie = req.cookies.refreshToken;
  if (!refreshTokenFromCookie) {
    throw new AppError(
      "Refresh token not found in cookies. Please log in.",
      401
    );
  }
  return refreshTokenFromCookie;
};

//---- Exported Controller Actions ----
exports.getCaptcha = async (req, res, next) => {
  try {
    const { captcha, uuid } = await generateCaptcha();

    return sendSuccess(res, "Captcha generated successfully", {
      uuid,
      captcha,
    });
  } catch (err) {
    next(err);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, captcha, uuid } = req.body;

    await _handleCaptchaValidation(uuid, captcha);

    const user = await User.exists({ email });

    if (user) {
      throw new AppError("Email is already registered", 409);
    }

    const isFirstUser = (await User.countDocuments()) === 0;

    const newUser = new User({
      name,
      email,
      password,
      role: isFirstUser ? "ADMIN" : "USER",
    });

    await newUser.save();

    const userToSend = newUser.toObject();
    delete userToSend.password;

    logger.info("User registered successfully", {
      userId: newUser._id,
      email: newUser.email,
    });

    return sendSuccess(res, "User registered successfully", userToSend, 201);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password, captcha, uuid } = req.body;

    await _handleCaptchaValidation(uuid, captcha);

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    if (user.isBanned) {
      throw new AppError("Your account has been suspended.", 403);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user._id);

    _setRefreshTokenCookie(res, refreshToken);

    return sendSuccess(res, "Login successful", {
      id: user._id,
      name: user.name,
      accessToken,
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const { accessToken } = req;

    const refreshTokenFromCookie = _getAndValidateRefreshTokenCookie(req);

    _clearRefreshTokenCookie(res);

    await Promise.all([
      blocklistAccessToken(accessToken),
      revokeRefreshToken(refreshTokenFromCookie),
    ]);

    return sendSuccess(res, "Successfully logged out.");
  } catch (err) {
    next(err);
  }
};

exports.getMe = (req, res, next) => {
  const user = req.user;

  return sendSuccess(res, "User profile retrieved successfully.", user);
};

exports.refreshToken = async (req, res, next) => {
  try {
    const refreshTokenFromCookie = _getAndValidateRefreshTokenCookie(req);

    const userId = await verifyRefreshToken(refreshTokenFromCookie);

    const user = await User.findById(userId).lean();

    if (!user) {
      throw new AppError("User associated with this token not found.", 403);
    }

    if (user.isBanned) {
      throw new AppError("Access to this account has been suspended.", 403);
    }

    const newRefreshToken = await generateRefreshToken(userId);

    const newAccessToken = generateAccessToken(user);

    _setRefreshTokenCookie(res, newRefreshToken);

    await revokeRefreshToken(refreshTokenFromCookie);

    return sendSuccess(res, "Tokens refreshed successfully.", {
      accessToken: newAccessToken,
    });
  } catch (err) {
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId).select("+password");

    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordMatch) {
      throw new AppError("The old password you entered incorrect.", 400);
    }

    user.password = newPassword;
    await user.save();

    return sendSuccess(res, "Password changed successfully.");
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email }).lean();

    if (user && !user.isBanned) {
      const resetToken = await passwordResetTokenHandler.generate(user._id);
      const resetUrl = `${app.frontendUrl}/reset-password/${resetToken}`;

      await sendPasswordRestEmail({
        name: user.name,
        email: user.email,
        url: resetUrl,
      });
    }
    return sendSuccess(
      res,
      "If an account with that email address exists, a password reset link has been sent."
    );
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const userId = await passwordResetTokenHandler.verify(token);

    const user = await User.findById(userId);

    if (!user) {
      throw new AppError("Password reset link is invalid or has expired.", 400);
    }

    if (user.isBanned) {
      throw new AppError("Access to this account has been suspended.", 403);
    }

    user.password = newPassword;
    await user.save();

    await passwordResetTokenHandler.delete(token);

    return sendSuccess(res, "Your password has been reset successfully");
  } catch (err) {
    next(err);
  }
};
