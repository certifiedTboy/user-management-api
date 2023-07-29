const envVariable = require("../../config/config");
const dateTimeCalculator = require("../general/dateAndTimeCalculator");
const randomCodeGenerator = require("../general/randomCodeGenerator");

const generateVerificationUrl = async (userId) => {
  const TOKEN_SEPERATOR = ":";

  const verificationData = await generateToken();
  const verificationToken = `${verificationData?.verificationToken}${TOKEN_SEPERATOR}${userId}`;

  const encodedVerificationToken =
    Buffer.from(verificationToken).toString("base64");

  return {
    verificationUrl: `${envVariable.FRONT_END_URL}/auth/account/verify/${encodedVerificationToken}`,
    verificationToken,
    expiresAt: verificationData.expiresAt,
  };
};

const generateToken = () => {
  const verificationToken = randomCodeGenerator(60);
  const expiresAt = dateTimeCalculator(
    envVariable.ACCOUNT_VERIFY_TOKEN_TTL_IN_HOURS
  );

  const verificationData = { verificationToken, expiresAt };

  return verificationData;
};

module.exports = generateVerificationUrl;
