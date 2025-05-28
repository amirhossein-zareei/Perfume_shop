const { connectRedis, Redis } = require("./redis");

module.exports = {
  connectMongoDB: require("./mongoDB"),
  connectRedis,
  Redis,
  env: require("./env"),
};
