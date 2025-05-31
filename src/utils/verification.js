const crypto = require("crypto");

const { Redis } = require("../config/index");

function generateVerificationCode(length = 6) {
  const characters = "00123456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, characters.length);
    code += characters[randomIndex];
  }

  return code;
}

function generateRedisKey(keyPrefix, email) {
  return `${keyPrefix}:${email}`;
}

//* Chatgpt
// ذخیره داده موقت در Redis با کلید دلخواه
const storeTempData = async (keyPrefix, identifier, data, expiry = 900) => {
  try {
    const key = `${keyPrefix}:${identifier}`;
    await redis.set(key, JSON.stringify(data), "EX", expiry);
    return true;
  } catch (error) {
    throw new Error(`Failed to store data for ${keyPrefix}`);
  }
};

// دریافت داده موقت از Redis
const getTempData = async (keyPrefix, identifier) => {
  try {
    const key = `${keyPrefix}:${identifier}`;
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    throw new Error(`Failed to retrieve data for ${keyPrefix}`);
  }
};

// حذف داده موقت از Redis
const deleteTempData = async (keyPrefix, identifier) => {
  try {
    const key = `${keyPrefix}:${identifier}`;
    await redis.del(key);
    return true;
  } catch (error) {
    throw new Error(`Failed to delete data for ${keyPrefix}`);
  }
};

// ذخیره کد در Redis
const storeCodeInRedis = async (keyPrefix, identifier, code, expiry = 300) => {
  try {
    const key = `${keyPrefix}:${identifier}`;
    await redis.set(key, code, "EX", expiry);
    return true;
  } catch (error) {
    throw new Error(`Failed to store code for ${keyPrefix}`);
  }
};

// دریافت کد از Redis
const getCodeFromRedis = async (keyPrefix, identifier) => {
  try {
    const key = `${keyPrefix}:${identifier}`;
    return await redis.get(key);
  } catch (error) {
    throw new Error(`Failed to retrieve code for ${keyPrefix}`);
  }
};

// حذف کد از Redis
const deleteCodeFromRedis = async (keyPrefix, identifier) => {
  try {
    const key = `${keyPrefix}:${identifier}`;
    await redis.del(key);
    return true;
  } catch (error) {
    throw new Error(`Failed to delete code for ${keyPrefix}`);
  }
};

module.exports = {
  generateVerificationCode,
  storeTempData,
  getTempData,
  deleteTempData,
  storeCodeInRedis,
  getCodeFromRedis,
  deleteCodeFromRedis,
};
