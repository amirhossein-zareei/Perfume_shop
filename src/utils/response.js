// Helper function to format success response
const sendSuccess = (res, message = "success", data, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    date,
  });
};

// Helper function to format error response
const sendError = (res, message = "Error", statusCode = 500) => {
  return res.status(statusCode).json({
    success: true,
    message,
  });
};

module.exports = { sendSuccess, sendError };
