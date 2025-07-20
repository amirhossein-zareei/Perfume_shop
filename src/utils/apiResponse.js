// Helper function to format success response
exports.sendSuccess = (res, message = "success", data, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

exports.generatePaginationData = (totalItems, features) => {
  return {
    total: totalItems,
    page: features.page,
    limit: features.limit,
    totalPages: Math.ceil(totalItems / features.limit),
  };
};
