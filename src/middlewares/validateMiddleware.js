const AppError = require("../utils/AppError");

module.exports = (schema) => {
  return (req, res, next) => {
    const partsToValidate = ["body", "params", "query"];
    const errors = [];

    partsToValidate.forEach((part) => {
      if (schema[part]) {
        const { error } = schema[part].validate(req[part], {
          abortEarly: false,
        });

        if (error) {
          errors.push(...error.details);
        }
      }
    });

    if (errors.length > 0) {
      let formattedError = errors.map((detail) => ({
        field: detail.path[0],
        message: detail.message.replace(/"/g, ""),
      }));

      throw new AppError("Validation failed", 400, formattedError);
    }

    next();
  };
};
