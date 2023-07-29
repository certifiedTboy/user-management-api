const UserSession = require("../models/userSession");
const User = require("../models/user");
const dateTimeCalculator = require("../utils/general/dateAndTimeCalculator");
const { generateJWTToken } = require("../utils/JWT/jwtHelpers");

/**
 * @method createOrUpdatePlatformSession
 * @param {string} userId
 * @param {string} ipAddress
 * @return {object <UserSession>}
 */
const createOrUpdatePlatformSession = async (userId, ipAddress) => {
  let userSession = await getUserPlatformSession(userId);

  const AUTH_TOKEN_TTL_IN_HOURS = 24;
  const AUTH_TOKEN = await getAuthToken(userId, AUTH_TOKEN_TTL_IN_HOURS);

  userSession.token = AUTH_TOKEN;
  userSession.ipAddress = ipAddress;

  userSession.expiresAt = dateTimeCalculator(AUTH_TOKEN_TTL_IN_HOURS);

  return userSession.save();
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
const getAuthToken = async (userId, ttlInHours) => {
  const user = await User.findById(userId);
  if (user) {
    const PAYLOAD = { id: user._id.toString(), userType: user.userType };

    return generateJWTToken(PAYLOAD, `${ttlInHours}h`);
  }
};

module.exports = createOrUpdatePlatformSession;
