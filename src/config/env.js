require("dotenv").config();

module.exports = {
  app: {
    port: process.env.PORT || 4000,
    nodeEnv: process.env.NODE_ENV || "development",
    frontendUrl: process.env.FRONTEND_URL,
  },

  user: {
    email: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  auth: {
    accessTokenSecretKey: process.env.ACCESS_TOKEN_SECRET_KEY,
    refreshTokenSecretKey: process.env.REFRESH_TOKEN_SECRET_KEY,
    accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  },

  mongoUrl: process.env.MONGO_URL,

  redisUrl: process.env.REDIS_URL,

  cloudinaryConfigs: {
    name: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
};
