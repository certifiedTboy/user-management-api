const bcrypt = require("bcryptjs");
const UnauthenticatedError = require("../../../lib/errorInstances/UnauthenticatedError");

/**
 * @method hashedPassword
 * @param {string} plainTextPassword
 * @return {string <hashedPassword>}
 */
const hashPassword = (plainTextPassword) => {
  if (!plainTextPassword) {
    throw new Error("Invalid plain-text password");
  }
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(plainTextPassword, salt);
};

/**
 * @method verifyPassword
 * @param {string} plainTextPassword
 * @param {string} hashedPassword
 * @return {Boolean <true>}
 */
const verifyPassword = (plainTextPassword, hashedPassword) => {
  if (!bcrypt.compareSync(plainTextPassword, hashedPassword)) {
    throw new UnauthenticatedError("Incorrect login credentials");
  }
};

module.exports = { hashPassword, verifyPassword };
