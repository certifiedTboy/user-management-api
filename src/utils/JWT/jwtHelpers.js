const JWT = require("jsonwebtoken");
const envVariable = require("../../config/config");

const { JWT_TOKEN_SECRET } = envVariable;
const generateJWTToken = (payload, expiresIn) => {
  if (!expiresIn) {
    return JWT.sign(payload, config.JWT_TOKEN_SECRET);
  }

  return JWT.sign(payload, JWT_TOKEN_SECRET, { expiresIn });
};

const verifyToken = (token) => {
  try {
    return JWT.verify(token, JWT_TOKEN_SECRET);
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = { generateJWTToken, verifyToken };
