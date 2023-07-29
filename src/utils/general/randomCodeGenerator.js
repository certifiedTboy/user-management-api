const crypto = require("crypto");

const randomCodeGenerator = (length) => {
  if (length < 1) {
    throw new Error("Minimum length of token is 1");
  }

  return crypto
    .randomBytes(length)
    .toString("base64")
    .replace(/[^a-zA-Z0-9]/, "-")
    .substr(0, length);
};

module.exports = randomCodeGenerator;
