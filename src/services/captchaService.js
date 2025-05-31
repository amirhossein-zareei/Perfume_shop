const svgCaptcha = require("svg-captcha");
const uuidv4 = require("uuid").v4;

const { setCode, getCode, deleteCode } = require("../utils/redisCode");

exports.generateCaptcha = async () => {
  try {
    const captcha = svgCaptcha.create({
      size: 5,
      noise: 4,
      color: true,
      ignoreChars: "0oO1iIl",
    });

    const uuid = uuidv4();

    await setCode(`captcha:${uuid}`, captcha.text.toLowerCase());

    return {
      uuid,
      captcha: captcha.data,
    };
  } catch (err) {
    throw err;
  }
};

exports.verifyCaptcha = async (uuid, inputCaptcha) => {
  try {
    const storedCaptcha = await getCode(`captcha:${uuid}`);

    if (!storedCaptcha) {
      return false;
    }

    await deleteCode(`captcha:${uuid}`);

    if (storedCaptcha !== inputCaptcha.toLowerCase()) {
      return false;
    }

    return true;
  } catch (err) {
    throw err;
  }
};
