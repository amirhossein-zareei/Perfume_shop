const { isValidObjectId } = require("mongoose");

const AppError = require("../utils/AppError");

module.exports = (paramName) => (req, res, next) => {
  const id = req.params[paramName];
  const isValidUserId = isValidObjectId(id);

  if (!isValidUserId) {
    throw new AppError(`Id (${id}) is not valid`, 409);
  }
  next();
};
