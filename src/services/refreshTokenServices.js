const JWT = require("jsonwebtoken");
const {
  checkThatTokenSessionExist,
  deleteSession,
} = require("./sessionServices");
const {
  verifyRefreshToken,
  generateJWTToken,
} = require("../utils/JWT/jwtHelpers");
const NotFoundError = require("../../lib/errorInstances/NotFoundError");
const UnauthenticatedError = require("../../lib/errorInstances/UnauthenticatedError");
const envVariable = require("../config/config");

const { ACCESS_TOKEN_SECRET } = envVariable;

const generateAccessToken = async (refreshToken) => {
  // throw error error if not refresh is provided by client
  if (!refreshToken) {
    throw new NotFoundError("token does not exist");
  }

  // check that token senssion still exist on database
  const tokenSession = await checkThatTokenSessionExist(refreshToken);

  // delete token if validity elapses
  if (tokenSession.updatedAt - new Date() <= 0) {
    await deleteSession(tokenSession._id.toString());
    throw new UnauthenticatedError("invalid refresh token");
  }

  //if token session is still valid, verify token is authentic and still valid
  const authPayload = await verifyRefreshToken(
    tokenSession?.refreshToken,
    tokenSession?._id.toString()
  );

  // On successful validation, extract payload data from valid token to generate new access token
  const PAYLOAD = { id: authPayload.id, userType: authPayload.userType };
  const ACCESS_TOKEN_TTL_IN_HOURS = 0.5;
  const token = generateJWTToken(
    PAYLOAD,
    `${ACCESS_TOKEN_TTL_IN_HOURS}h`,
    ACCESS_TOKEN_SECRET
  );
  // return access token generated to client
  return { accessToken: token };
};

module.exports = { generateAccessToken };
