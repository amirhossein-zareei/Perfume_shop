const { Redis } = require("../config/index");

exports.setCode = async (key, value, ttl = 1) => {
  await Redis.set(key, value, "EX", ttl * 60);
};

exports.getCode = async (key) => {
  return await Redis.get(key);
};

exports.deleteCode = async (key) => {
  await Redis.del(key);
};
