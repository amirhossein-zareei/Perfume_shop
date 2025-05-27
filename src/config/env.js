require("dotenv").config();

module.exports = {
  app: {
    port: process.env.PORT || 4000,
    mode: process.env.MODE || "development",
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
};
