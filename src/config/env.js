require("dotenv").config();

module.exports = {
  app: {
    port: process.env.PORT || 4000,
    mode: process.env.MODE || "development",
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

  mongo: {
    uri: process.env.MONGO_URI,
  },

  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    tls: process.env.REDIS_TLS === "true",
  },

  cloudinaryConfigs: {
    name: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
};
