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

exports.sendPasswordRestEmail = async ({ name, email, url }) => {
  try {
    const templatePath = path.join(
      __dirname,
      "../templates/passwordReset.html"
    );
    let htmlContent = fs.readFileSync(templatePath, "utf-8");

    htmlContent = htmlContent.replace("{{name}}", name);
    htmlContent = htmlContent.replace("{{resetLink}}", url);

    await sendEmail({
      to: email,
      subject: "Reset Your Password for Perfume Shop",
      html: htmlContent,
    });

    return true;
  } catch (err) {
    throw err;
  }
};
