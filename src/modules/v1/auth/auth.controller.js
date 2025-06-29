const { User } = require("../../../models/index");
const sendSuccess = require("../../../utils/apiResponse");
const AppError = require("../../../utils/AppError");
const logger = require("../../../utils/logger");
const { app } = require("../../../config/env");
const {
  generateCaptcha,
  verifyCaptcha,
} = require("../../../services/captchaService");
const {
  generateAccessToken,
  generateRefreshToken,
  revokeRefreshToken,
  verifyRefreshToken,
  passwordResetTokenHandler,
  emailVerificationTokenHandler,
  performLogout,
} = require("../../../services/tokenService");
const {
  sendPasswordRestEmail,
  sendVerificationEmail,
} = require("../../../services/emailService");

const {
  setRefreshTokenCookie,
  getAndValidateRefreshTokenCookie,
} = require("../../../utils/cookieHelper");

//---- Helper Function ----
const _handleCaptchaValidation = async (captchaId, captcha) => {
  const isCaptchaValid = await verifyCaptcha(captchaId, captcha);

  if (!isCaptchaValid) {
    throw new AppError("Invalid CAPTCHA, Please try again", 400);
  }
};

//---- Exported Controller Actions ----
exports.getCaptcha = async (req, res, next) => {
  try {
    const { captcha, captchaId } = await generateCaptcha();

    return sendSuccess(res, "Captcha generated successfully", {
      captchaId,
      captcha,
    });
  } catch (err) {
    next(err);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, captcha, captchaId } = req.body;

    await _handleCaptchaValidation(captchaId, captcha);

    const user = await User.exists({ email });

    if (user) {
      if (!user.isActive) {
        throw new AppError(
          "An account with this email already exists but is deactivated. Please contact support.",
          409
        );
      } else {
        throw new AppError("Email is already registered", 409);
      }
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
    const { email, password, captcha, captchaId } = req.body;

    await _handleCaptchaValidation(captchaId, captcha);

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    if (user.isBanned) {
      throw new AppError("Your account has been suspended.", 403);
    }

    if (!user.isActive) {
      throw new AppError(
        "Your account has been deactivated. Please contact support for assistance.",
        403
      );
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user._id);

    setRefreshTokenCookie(res, refreshToken);

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
    await performLogout(req, res);

    return sendSuccess(res, "Successfully logged out.");
  } catch (err) {
    next(err);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const refreshTokenFromCookie = getAndValidateRefreshTokenCookie(req);

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

    setRefreshTokenCookie(res, newRefreshToken);

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

    const isPasswordMatch = await user.comparePassword(oldPassword);

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
    const { resetToken } = req.params;
    const { newPassword } = req.body;

    const userId = await passwordResetTokenHandler.verify(resetToken);

    const user = await User.findById(userId);

    if (!user) {
      throw new AppError("Password reset link is invalid or has expired.", 400);
    }

    if (user.isBanned) {
      throw new AppError("Access to this account has been suspended.", 403);
    }

    user.password = newPassword;
    await user.save();

    await passwordResetTokenHandler.delete(resetToken);

    return sendSuccess(res, "Your password has been reset successfully");
  } catch (err) {
    next(err);
  }
};

exports.resendVerification = async (req, res, next) => {
  try {
    const name = req.user.name;
    const email = req.user.email;
    const userId = req.user._id;

    if (req.user.isVerified) {
      throw new AppError("Your email address has already been verified", 400);
    }

    const verifyToken = await emailVerificationTokenHandler.generate(userId);
    const verifyUrl = `${app.frontendUrl}/verify-email/${verifyToken}`;

    await sendVerificationEmail({
      name,
      email,
      url: verifyUrl,
    });

    return sendSuccess(
      res,
      "A new verification link has been sent to your email address."
    );
  } catch (err) {
    next(err);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    const userId = await emailVerificationTokenHandler.verify(token);

    const user = await User.findById(userId);

    if (!user) {
      throw new AppError(
        "Email verification link is invalid or has expired.",
        400
      );
    }

    if (user.isBanned) {
      throw new AppError("Access to this account has been suspended.", 403);
    }

    user.isVerified = true;
    await user.save();

    await emailVerificationTokenHandler.delete(token);

    return sendSuccess(res, "Your email has been verified successfully");
  } catch (err) {
    next(err);
  }
};
