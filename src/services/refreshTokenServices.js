const JWT = require("jsonwebtoken");
const { checkThatTokenSessionExist } = require("./sessionServices");
const {
  verifyRefreshToken,
  generateJWTToken,
} = require("../utils/JWT/jwtHelpers");
const NotFoundError = require("../../lib/errorInstances/NotFoundError");
const envVariable = require("../config/config");

const { ACCESS_TOKEN_SECRET } = envVariable;

const generateAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new NotFoundError("token does not exist");
  }

  const tokenSession = await checkThatTokenSessionExist(refreshToken);

  const authPayload = await verifyRefreshToken(tokenSession.refreshToken);
  const PAYLOAD = { id: authPayload.id, userType: authPayload.userType };
  const ACCESS_TOKEN_TTL_IN_HOURS = 0.5;
  const accessToken = generateJWTToken(
    PAYLOAD,
    `${ACCESS_TOKEN_TTL_IN_HOURS}h`,
    ACCESS_TOKEN_SECRET
  );

  return accessToken;
};

module.exports = { generateAccessToken };
