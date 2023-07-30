const JWT = require("jsonwebtoken");
const envVariable = require("../../config/config");

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = envVariable;

/**
 * @method generateJWTToken
 * @param {string} payload
 * @param {string} expiresIn
 * @return {string <authToken>}
 */
const generateJWTToken = (payload, expiresIn, secret) => {
  if (!expiresIn) {
    return JWT.sign(payload, secret);
  }

  return JWT.sign(payload, secret, { expiresIn });
};

/**
 * @method verifyAccessToken
 * @param {string} token
 * @param {string} JWT_TOKEN_SECRET
 * @return {Boolean <true>}
 */
const verifyAccessToken = (token) => {
  try {
    return JWT.verify(token, ACCESS_TOKEN_SECRET);
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * @method verifyRefreshToken
 * @param {string} token
 * @param {string} JWT_TOKEN_SECRET
 * @return {Boolean <true>}
 */
const verifyRefreshToken = (refreshToken) => {
  try {
    return JWT.verify(refreshToken, REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { generateJWTToken, verifyAccessToken, verifyRefreshToken };
