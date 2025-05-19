const { Redis } = require("ioredis");

const { redis } = require("./env");

const client = new Redis({
  host: redis.host,
  port: redis.port,
  password: redis.password,
  tls: redis.tls ? {} : undefined,
  lazyConnect: true,
});

const connectRedis = async () => {
  try {
    await client.connect();

    console.log("✅ Successfully connected to Redis");
  } catch (err) {
    console.error("❌ Redis connection error ->", err);
    process.exit(1);
  }
};

module.exports = connectRedis;
