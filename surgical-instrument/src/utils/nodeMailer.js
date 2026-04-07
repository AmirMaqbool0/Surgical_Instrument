"use strict";

const nodemailer = require("nodemailer");
const { API_Email, API_PASSWORD } = require("@src/config");
const { loginTemplate, emailVerificationTemplate, passwordResetConfirmation, registrationTemplate } = require('../mail-templates')


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NodeMailer_EMAIL,
    pass: process.env.NodeMailer_PASSWORD,
  },
});

const sendEmail = async (to, subject, message) => {
  try {
    const mailOptions = {
      from: API_Email,
      to: to,
      subject: subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password Reseting OTP sent successfully to ${to}`);
    return true;
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    throw new Error("Failed to send email");
  }
};

module.exports = { sendEmail };