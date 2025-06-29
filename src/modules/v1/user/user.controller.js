const { User, Address } = require("../../../models");
const { performLogout } = require("../../../services/tokenService");
const sendSuccess = require("../../../utils/apiResponse");
const AppError = require("../../../utils/AppError");

exports.getMe = (req, res, next) => {
  const user = req.user;

  return sendSuccess(res, "User profile retrieved successfully.", user);
};

exports.deleteMe = async (req, res, next) => {
  try {
    const userId = req.user._id;

    await User.findByIdAndUpdate(userId, { isActive: false }, { new: true });

    await performLogout(req, res);

    return sendSuccess(
      res,
      "Your account has been successfully deactivated and you have been logged out."
    );
  } catch (err) {
    next(err);
  }
};

exports.updateMe = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { name } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name },
      { new: true }
    );
    return sendSuccess(res, "Your information has been updated successfully", {
      name: updatedUser.name,
    });
  } catch (err) {
    next(err);
  }
};
