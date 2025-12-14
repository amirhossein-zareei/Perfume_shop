const AppError = require("../utils/AppError");

exports.requireEmailVerification = (req, res, next) => {
  if (!req.user.isVerified) {
    throw new AppError("Please verify your email before proceeding", 403);
  }

  next();
};
