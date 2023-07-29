const JWT = require("jsonwebtoken");
const envVariable = require("../../config/config");

const { JWT_TOKEN_SECRET } = envVariable;

/**
 * @method generateJWTToken
 * @param {string} payload
 * @param {string} expiresIn
 * @return {string <authToken>}
 */
const generateJWTToken = (payload, expiresIn) => {
  if (!expiresIn) {
    return JWT.sign(payload, config.JWT_TOKEN_SECRET);
  }

  return JWT.sign(payload, JWT_TOKEN_SECRET, { expiresIn });
};

/**
 * @method verifyToken
 * @param {string} token
 * @param {string} JWT_TOKEN_SECRET
 * @return {Boolean <true>}
 */
const verifyToken = (token) => {
  try {
    return JWT.verify(token, JWT_TOKEN_SECRET);
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { generateJWTToken, verifyToken };
