const AppError = require("../utils/AppError");

module.exports = (fieldsToParse) => (req, res, next) => {
  try {
    if (req.body && fieldsToParse && fieldsToParse.length > 0) {
      fieldsToParse.forEach((field) => {
        if (req.body[field] && typeof req.body[field] === "string") {
          req.body[field] = JSON.parse(req.body[field]);
        }
      });
    }

    next();
  } catch (err) {
    throw new AppError("Invalid JSON format in form data.", 400);
  }
};
