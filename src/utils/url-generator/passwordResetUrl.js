const envVariable = require("../../config/config");
const dateTimeCalculator = require("../general/dateAndTimeCalculator");
const randomCodeGenerator = require("../general/randomCodeGenerator");

const generatePasswordResetUrl = async (userId) => {
  const TOKEN_SEPERATOR = ":";

  const passwordResetData = await generateToken();
  const passwordResetToken = `${passwordResetData?.passwordResetToken}${TOKEN_SEPERATOR}${userId}`;

  const encodedPasswordResetToken =
    Buffer.from(passwordResetToken).toString("base64");

  return {
    passwordResetUrl: `${envVariable.FRONT_END_URL}/auth/account/reset-password/${encodedPasswordResetToken}`,
    passwordResetToken,
    expiresAt: passwordResetData.expiresAt,
  };
};

const generateToken = () => {
  const passwordResetToken = randomCodeGenerator(60);
  const expiresAt = dateTimeCalculator(
    envVariable.PASSWORD_RESET_TOKEN_TTL_IN_HOURS
  );

  const passwordResetData = { passwordResetToken, expiresAt };

  return passwordResetData;
};

module.exports = generatePasswordResetUrl;
