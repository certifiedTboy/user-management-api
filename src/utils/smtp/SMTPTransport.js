const nodemailer = require("nodemailer");
const envVariable = require("../../config/config");

const { SMTP_HOST, SMTP_PASSWORD, SMTP_PORT, SMTP_USER } = envVariable;

const transport = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT || 2525,
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

module.exports = transport;
