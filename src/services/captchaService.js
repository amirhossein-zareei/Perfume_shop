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

    const captchaId = uuidv4();

    await setCode(`captcha:${captchaId}`, captcha.text.toLowerCase());

    const svgBase64 = Buffer.from(captcha.data).toString("base64");
    const captchaImage = `data:image/svg+xml;base64,${svgBase64}`;

    return {
      captchaId,
      captcha: captchaImage,
    };
  } catch (err) {
    throw err;
  }
};

exports.verifyCaptcha = async (captchaId, inputCaptcha) => {
  try {
    const storedCaptcha = await getCode(`captcha:${captchaId}`);

    if (!storedCaptcha) {
      return false;
    }

    await deleteCode(`captcha:${captchaId}`);

    if (storedCaptcha !== inputCaptcha.toLowerCase()) {
      return false;
    }

    return true;
  } catch (err) {
    throw err;
  }
};
