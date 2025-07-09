const AppError = require("../utils/AppError");

module.exports = (role) => {
  return (req, res, next) => {
    try {
      if (!req.user.role === role) {
        return AppError("You have not access to this route", 401);
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
