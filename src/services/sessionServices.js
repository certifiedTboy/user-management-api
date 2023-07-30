const UserSession = require("../models/userSession");
const User = require("../models/user");
const dateTimeCalculator = require("../utils/general/dateAndTimeCalculator");
const { generateJWTToken } = require("../utils/JWT/jwtHelpers");
const envVariable = require("../config/config");

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = envVariable;

/**
 * @method createOrUpdatePlatformSession
 * @param {string} userId
 * @param {string} ipAddress
 * @return {object <UserSession>}
 */
const createOrUpdatePlatformSession = async (userId, ipAddress) => {
  let userSession = await getUserPlatformSession(userId);

  const REFRESH_TOKEN_TTL_IN_HOURS = 24;
  const ACCESS_TOKEN_TTL_IN_HOURS = 0.5;
  const REFRESH_TOKEN = await getAuthToken(
    userId,
    REFRESH_TOKEN_TTL_IN_HOURS,
    REFRESH_TOKEN_SECRET
  );
  const ACCESS_TOKEN = await getAuthToken(
    userId,
    ACCESS_TOKEN_TTL_IN_HOURS,
    ACCESS_TOKEN_SECRET
  );

  userSession.refreshToken = REFRESH_TOKEN;
  userSession.ipAddress = ipAddress;

  userSession.expiresAt = dateTimeCalculator(REFRESH_TOKEN_TTL_IN_HOURS);

  await userSession.save();

  return { userSession, accessToken: ACCESS_TOKEN };
};

/**
 * @method checkThatSessionExist
 * @param {string} refreshToken
 * @return {object <UserSession}
 */
const checkThatTokenSessionExist = async (refreshToken) => {
  const session = await UserSession.findOne({ refreshToken });
  if (!session) {
    throw new NotFoundError("invalid refresh token");
  }

  return session;
};

/**
 * @method getUserPlatformSession
 * @param {string} userId
 * @return {object <UserSession}
 */
const getUserPlatformSession = async (userId) => {
  let userSession = await UserSession.findOne({ userId });

  if (!userSession) {
    userSession = new UserSession();
    userSession.userId = userId;
    await userSession.save();
  }

  return userSession;
};

/**
 * @method getAuthToken
 * @param {string} userId
 * @param {number} ttlInHours
 * @return {string <authToken>}
 */
const getAuthToken = async (userId, ttlInHours, secret) => {
  const user = await User.findById(userId);
  if (user) {
    const PAYLOAD = { id: user._id.toString(), userType: user.userType };

    return generateJWTToken(PAYLOAD, `${ttlInHours}h`, secret);
  }
};

module.exports = { createOrUpdatePlatformSession, checkThatTokenSessionExist };
