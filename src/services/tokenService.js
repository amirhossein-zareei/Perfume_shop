const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const { setCode, getCode, deleteCode } = require("../utils/redisCode");
const { auth } = require("../config/env");
const AppError = require("../utils/AppError");

const _getJtiFromToken = (token) => {
  const decodedToken = jwt.decode(token);

  if (!decodedToken || !decodedToken.jti) {
    throw new AppError(
      "Cannot blocklist token: Invalid format or missing.",
      400
    );
  }

  return decodedToken.jti;
};

const _verifyTokenAndGetPayload = (token, secretKey) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (err) {
    throw new AppError("Invalid or expired token. Authentication failed.", 401);
  }
};

//---Token Generation---
exports.generateAccessToken = (user) => {
  try {
    const accessToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
        jti: uuidv4(),
      },
      auth.accessTokenSecretKey,
      { expiresIn: auth.accessTokenExpiresIn + "m" }
    );

    return accessToken;
  } catch (err) {
    throw err;
  }
};

exports.generateRefreshToken = async (userId) => {
  try {
    const jti = uuidv4();
    const currentUserId = userId.toString();

    const refreshToken = jwt.sign(
      {
        id: currentUserId,
        jti,
      },
      auth.refreshTokenSecretKey,
      { expiresIn: auth.refreshTokenExpiresIn + "d" }
    );

    const expires = auth.refreshTokenExpiresIn * 24 * 60;

    await setCode(`refreshToken:${jti}`, currentUserId, expires);

    return refreshToken;
  } catch (err) {
    throw err;
  }
};

//---Token Validation---
exports.verifyAccessToken = async (token) => {
  try {
    const jti = _getJtiFromToken(token);

    const blocklistEntry = await getCode(`blocklist:access:${jti}`);

    if (blocklistEntry) {
      throw new AppError("Access denied. Token is invalid or revoked.", 401);
    }

    const payload = _verifyTokenAndGetPayload(token, auth.accessTokenSecretKey);

    return payload;
  } catch (err) {
    throw err;
  }
};

exports.verifyRefreshToken = async (token) => {
  try {
    const payload = _verifyTokenAndGetPayload(
      token,
      auth.refreshTokenSecretKey
    );

    if (!payload.jti) {
      throw new AppError("Malformed token payload.", 400);
    }

    const redisKey = `refreshToken:${payload.jti}`;
    const storedSessionInfo = await getCode(redisKey);

    if (!storedSessionInfo) {
      throw new AppError(
        "Session invalid or expired. Please log in again.",
        401
      );
    }

    return payload.id;
  } catch (err) {
    throw err;
  }
};

//---Token Revocation---
exports.revokeRefreshToken = async (token) => {
  try {
    const payload = _verifyTokenAndGetPayload(
      token,
      auth.refreshTokenSecretKey
    );

    if (!payload.jti) {
      throw new AppError("Malformed token payload.", 400);
    }

    const redisKey = `refreshToken:${payload.jti}`;
    const deletedRefreshToken = await deleteCode(redisKey);

    if (!deletedRefreshToken) {
      throw new AppError("Refresh token not found or already inactive.", 400);
    }

    return true;
  } catch (err) {
    throw err;
  }
};

exports.blocklistAccessToken = async (token) => {
  try {
    const jti = _getJtiFromToken(token);

    const blocklistMarker = await getCode(`blocklist:access:${jti}`);

    if (blocklistMarker) {
      return true;
    }

    try {
      jwt.verify(token, auth.accessTokenSecretKey);
    } catch (err) {
      if (err.name !== "TokenExpiredError") {
        throw new AppError("Invalid or malformed access token.", 401);
      }

      return true;
    }

    await setCode(`blocklist:access:${jti}`, true, auth.accessTokenExpiresIn);

    return true;
  } catch (err) {
    throw err;
  }
};

exports.generatePasswordResetToken = async (userId) => {
  try {
    const token = uuidv4();

    await setCode(`resetPassword:${token}`, userId.toString(), 15);

    return token;
  } catch (err) {
    throw err;
  }
};

exports.verifyPasswordResetToken = async (inputToken) => {
  try {
    const userId = await getCode(`resetPassword:${inputToken}`);

    if (!userId) {
      throw new AppError("Password reset link is invalid or has expired.", 400);
    }

    return userId;
  } catch (err) {
    throw err;
  }
};

exports.deletePasswordResetToken = async (token) => {
  try {
    await deleteCode(`resetPassword:${token}`);
  } catch (err) {
    throw err;
  }
};
