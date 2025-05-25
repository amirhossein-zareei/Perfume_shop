const logger = require("../config/logger");
const AppError = require("../utils/AppError");
const { app } = require("../config/env");

module.exports = (err, req, res, next) => {
  const isProduction = app.mode === "production";

  const status = err.status || "error";
  const statusCode = err.statusCode || 500;
  const message = err.message;
  const errors = err.errors;

  logger.error(`${err.message}`, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    stack: err.stack,
    errors: err.errors || null,
  });

  const response = {
    status,
    message:
      statusCode === 500 && !err.isOperational && isProduction
        ? "Something went wrong"
        : message,
  };

  if (errors) {
    response.errors = errors;
  }

  if (!isProduction) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
