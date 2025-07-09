const User = require("../models/User");
const AppError = require("../utils/AppError");
const {
  verifyAccessToken,
  getAccessToken,
  performLogout,
} = require("../services/tokenService");

exports.auth = async (req, res, next) => {
  try {
    const accessTokenValue = getAccessToken(req.headers);

    const payload = await verifyAccessToken(accessTokenValue);

    const userId = payload.id;

    if (!userId) {
      throw new AppError(
        "Provided token is incomplete for authentication.",
        401
      );
    }

    const user = await User.findById(userId).lean();

    if (!user) {
      throw new AppError(
        "Unable to authenticate with the provided token.",
        401
      );
    }

    if (user.isBanned) {
      await performLogout(req, res);
      throw new AppError("Access to this account has been suspended.", 403);
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
