const logger = require("../utils/logger");
const { app } = require("../config/env");

const { deleteFiles } = require("../services/cloudinaryService");

module.exports = async (err, req, res, next) => {
  if (req.file) {
    const publicId = req.file.filename;

    await deleteFiles(publicId);

    logger.warn(
      `An error occurred after file upload. Deleting orphan file: ${publicId}`
    );
  }

  if (req.files) {
    const publicIds = req.files.map((file) => file.filename);

    await deleteFiles(publicIds);

    logger.warn(
      `An error occurred after multiple file uploads. Deleting orphan files: ${publicIds.join(
        ", "
      )}`
    );
  }

  const isProduction = app.nodeEnv === "production";

  const status = err.status || "error";
  const statusCode = err.statusCode || 500;
  const message = err.message;
  const errors = err.errors;

  const logDetails = {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    stack: err.stack,
    errors: err.errors || null,
  };

  if (statusCode >= 500) {
    logger.error(`${err.message}`, logDetails);
  } else {
    logger.warn(`${err.message}`, logDetails);
  }

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
