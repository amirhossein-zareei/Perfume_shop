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
    const currentUserId = userId.toString();

    const refreshToken = jwt.sign(
      {
        id: currentUserId,
      },
      auth.refreshTokenSecretKey,
      { expiresIn: auth.refreshTokenExpiresIn + "d" }
    );

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    const expires = auth.refreshTokenExpiresIn * 24 * 60;

    await setCode(`refreshToken:${currentUserId}`, hashedRefreshToken, expires);

    return refreshToken;
  } catch (err) {
    throw err;
  }
};

//---Token Validation---
exports.verifyAccessToken = async (token, userId) => {
  try {
    const jti = _getJtiFromToken(token);

    const blocklistEntry = await getCode(`blocklist:access:${jti}`);

    if (blocklistEntry) {
      throw new AppError("Access denied. Token is invalid or revoked.", 401);
    }

    try {
      const payload = jwt.verify(token, auth.accessTokenSecretKey);

      if (payload.id.toString() !== userId.toString()) {
        throw new AppError(
          "Access token does not match the expected user.",
          403
        );
      }

      return payload;
    } catch (error) {
      throw new AppError(
        "Invalid or expired token. Authentication failed.",
        401
      );
    }
  } catch (err) {
    throw err;
  }
};

exports.verifyRefreshToken = async (token, userId) => {
  try {
    const storedHashedRefreshToken = await getCode(`refreshToken:${userId}`);

    if (!storedHashedRefreshToken) {
      throw new AppError(
        "Session invalid or expired. Please log in again.",
        401
      );
    }

    const isTokenMatch = await bcrypt.compare(token, storedHashedRefreshToken);

    if (!isTokenMatch) {
      throw new AppError(
        "Session invalid or expired. Please log in again.",
        401
      );
    }

    try {
      const payload = jwt.verify(token, auth.refreshTokenSecretKey);

      if (payload.id !== userId.toString()) {
        await deleteCode(`refreshToken:${userId}`);

        throw new AppError(
          "Refresh token user mismatch. Please log in again.",
          401
        );
      }

      return payload;
    } catch (error) {
      throw new AppError(
        "Invalid or expired token. Authentication failed.",
        401
      );
    }
  } catch (err) {
    throw err;
  }
};

//---Token Revocation---
exports.revokeRefreshToken = async (userId) => {
  try {
    const deletedRefreshToken = await deleteCode(`refreshToken:${userId}`);

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
    } catch (error) {
      return true;
    }

    await setCode(
      `blocklist:access:${jti}`,
      true,
      auth.accessTokenExpiresIn
    );

    return true;
  } catch (err) {
    throw err;
  }
};
