// Helper function to format success response
const sendSuccess = (res, message = "success", data, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

module.exports = sendSuccess;
