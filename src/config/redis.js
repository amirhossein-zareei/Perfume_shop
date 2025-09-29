const { Redis } = require("ioredis");

const { redisUrl } = require("./env");

const client = new Redis(redisUrl, { lazyConnect: true });

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
