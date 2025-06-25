const { app, auth } = require("../config/env");
const AppError = require("./AppError");

exports.setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: app.mode === "production",
    sameSite: "Strict",
    maxAge: auth.refreshTokenExpiresIn * 24 * 60 * 60 * 1000,
  });
};

exports.clearRefreshTokenCookie = (res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: app.mode === "production",
    sameSite: "Strict",
  });
};

exports.getAndValidateRefreshTokenCookie = (req) => {
  const refreshTokenFromCookie = req.cookies.refreshToken;
  if (!refreshTokenFromCookie) {
    throw new AppError(
      "Refresh token not found in cookies. Please log in.",
      401
    );
  }
  return refreshTokenFromCookie;
};
