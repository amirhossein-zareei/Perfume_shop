const logger = require("../utils/logger");
const { app } = require("../config/env");

const { deleteFiles } = require("../services/cloudinaryService");

module.exports = async (err, req, res, next) => {
  if (req.file) {
    const publicId = req.file.filename;

    logger.warn(
      `An error occurred after file upload. Deleting orphan file: ${publicId}`
    );

    await deleteFiles(publicId);
  }

  if (req.files) {
    const publicIds = req.files.map((file) => file.filename);

    logger.warn(
      `An error occurred after multiple file uploads. Deleting orphan files: ${publicIds.join(
        ", "
      )}`
    );

    await deleteFiles(publicIds);
  }

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

  return res.status(statusCode).json(response);
};
