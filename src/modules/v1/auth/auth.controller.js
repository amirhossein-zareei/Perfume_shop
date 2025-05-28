const { User } = require("../../../models/index");
const sendSuccess = require("../../../utils/apiResponse");
const AppError = require("../../../utils/AppError");
const logger = require("../../../utils/logger");
const { generateCaptcha, verifyCaptcha } = require("../../../utils/captcha");

const _findUserByEmail = async (email) => {
  const userFound = await User.findOne({ email });

  return userFound;
};

const _handleCaptchaValidation = async (uuid, captcha) => {
  const isCaptchaValid = await verifyCaptcha(uuid, captcha);

  if (!isCaptchaValid) {
    throw new AppError("Invalid CAPTCHA, Please try again", 400);
  }
};

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

    const user = await findUserByEmail(email);

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
