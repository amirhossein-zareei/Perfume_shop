const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");

const { user } = require("../config/env");
const AppError = require("../utils/AppError");

const transports = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: user.email,
    pass: user.pass,
  },
});

const sendEmail = async ({ to, subject, text, html }) => {
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

const _sendTemplateEmail = async ({ to, subject, template, replacements }) => {
  try {
    const templatePath = path.join(__dirname, "../templates", template);
    let htmlContent = fs.readFileSync(templatePath, "utf-8");

    for (const key in replacements) {
      const regex = new RegExp(`{{${key}}}`, "g");

      htmlContent = htmlContent.replace(regex, replacements[key]);
    }

    await sendEmail({
      to,
      subject,
      html: htmlContent,
    });

    return true;
  } catch (err) {
    throw err;
  }
};

exports.sendPasswordRestEmail = async ({ name, email, url }) => {
  return _sendTemplateEmail({
    to: email,
    subject: "Reset Your Password for Perfume Shop",
    template: "passwordReset.html",
    replacements: {
      name: name,
      resetLink: url,
    },
  });
};
