const { Redis } = require("ioredis");

const { redisUrl } = require("./env");

const redisOption = {
  lazyConnect: true,
};

if (redisUrl.startsWith("rediss://")) {
  redisOption.tls = {
    rejectUnauthorized: false,
  };
}

const client = new Redis(redisUrl, redisOption);

const connectRedis = async () => {
  try {
    await client.connect();

    console.log("✅ Successfully connected to Redis");
  } catch (err) {
    console.error("❌ Redis connection error ->", err);
    process.exit(1);
  }
};

module.exports = {
  connectRedis,
  Redis: client,
};
