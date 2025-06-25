const jwt = require("jsonwebtoken");
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
    const payload = _verifyTokenAndGetPayload(token, auth.accessTokenSecretKey);

    const blocklistEntry = await getCode(`blocklist:access:${payload.jti}`);

    if (blocklistEntry) {
      throw new AppError("Access denied. Token is invalid or revoked.", 401);
    }
    
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

exports.getAccessToken = (headers) => {
  const authHeader = headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError(
      "A valid Bearer token is required for authorization.",
      401
    );
  }

  const accessTokenValue = authHeader.split(" ")[1];

  return accessTokenValue;
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

//--- One-Time Token Handler Factory ---
const createOneTimeTokenHandler = (option) => {
  const { prefix, ttlInMinutes, errorMessage } = option;

  const generate = async (value) => {
    const token = uuidv4();
    const redisKey = `${prefix}:${token}`;

    await setCode(redisKey, value.toString(), ttlInMinutes);

    return token;
  };

  const verify = async (token) => {
    const redisKey = `${prefix}:${token}`;

    const value = await getCode(redisKey);

    if (!value) {
      throw new AppError(errorMessage, 400);
    }

    return value;
  };

  const deleteToken = async (token) => {
    const redisKey = `${prefix}:${token}`;

    await deleteCode(redisKey);
  };

  return { generate, verify, delete: deleteToken };
};

//--- One-Time Token Service Instances ---
exports.passwordResetTokenHandler = createOneTimeTokenHandler({
  prefix: "resetPassword",
  ttlInMinutes: 15,
  errorMessage: "Password reset link is invalid or has expired.",
});

exports.emailVerificationTokenHandler = createOneTimeTokenHandler({
  prefix: "emailVerification",
  ttlInMinutes: 15,
  errorMessage: "Email Verification link is invalid or has expired.",
});
