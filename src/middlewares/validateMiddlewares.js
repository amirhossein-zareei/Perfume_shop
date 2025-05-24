const { sendError } = require("../utils/apiResponse");
const AppError = require("../utils/AppError");

module.exports = (validator) => {
  return (req, res, next) => {
    const { error } = validator.validate(req.body, { abortEarly: false });

    if (error) {
      let formattedError = error.details.map((detail) => ({
        field: detail.path[0],
        message: detail.message.replace(/"/g, ""),
      }));

      
      throw new AppError(String(formattedError), 400);
    }

    next();
  };
};
