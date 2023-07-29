const bcrypt = require("bcryptjs");
const UnauthenticatedError = require("../../../lib/errorInstances/UnauthenticatedError");

const hashPassword = (plainTextPasword) => {
  if (!plainTextPasword) {
    throw new Error("Invalid plain-text password");
  }
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(plainTextPasword, salt);
};

const verifyPassword = (plainTextPasword, hashedPassword) => {
  if (!bcrypt.compareSync(plainTextPasword, hashedPassword)) {
    throw new UnauthenticatedError("Incorrect login credentials");
  }
};

module.exports = { hashPassword, verifyPassword };
