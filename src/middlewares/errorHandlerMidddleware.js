const logger = require("../config/logger");
const AppError = require("../utils/AppError");
const { app } = require("../config/env");

module.exports = (err, req, res, next) => {
  let error = err;
  const isProduction = app.mode === "production";

  if (!(error instanceof AppError)) {
    const message = error.message || "Internal Server Error";

    error = new AppError( message, errorCode);

    if (err.stack) {
      error.stack = err.stack;
    }
  }

  logger.error(`${error.message} - ${error.errorCode}`, {
    path: req.originalUrl,
    method: req.method,
    ip: req.ip,
    stack: error.stack,
    details: error.errors,
  });

  const clientResponse = {
    success: false,
    message:
      isProduction && !error.isOperational
        ? "Internal Server Error"
        : error.message,
    errorCode: error.errorCode,
  };

  if (!isProduction || error.isOperational) {
    if (error.errors && error.errors.length > 0) {
      clientResponse.errors = error.errors;
    }
  }

  res.status(error.statusCode).json(clientResponse);
};
