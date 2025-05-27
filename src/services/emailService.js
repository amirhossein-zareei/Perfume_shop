const nodemailer = require("nodemailer");

const { user } = require("../config/env");
const AppError = require("../utils/AppError");

const transports = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: user.email,
    pass: user.pass,
  },
});

exports.sendEmail = async ({ to, subject, text, html }) => {
  if (!to || !subject || (!text && !html)) {
    throw new AppError("Invalid email parameters");
  }

  const mailOptions = {
    from: user.email,
    to,
    subject,
    text,
    html,
  };

  await transports.sendMail(mailOptions);
};
