const { sendContactEmail } = require("../../../services/emailService");
const { sendSuccess } = require("../../../utils/apiResponse");

exports.sendContactEmail = async (req, res) => {
  try {
    const { email, message } = req.body;

    await sendContactEmail({ email, message });

    return sendSuccess(res, "Contact email sent successfully");
  } catch (err) {
    next(err);
  }
};
