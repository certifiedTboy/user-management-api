const { verifyAccessToken } = require("../../utils/JWT/jwtHelpers");
const UnauthenticatedError = require("../../../lib/errorInstances/UnauthenticatedError");

/**
 * @function Authenticate
 * @description Middleware to perform authentication in API routes with access token
 * @param {IUserRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const Authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const authToken = _checkThatValidTokenFormatIsProvided(authHeader);
    const authPayload = await verifyAccessToken(authToken);

    req.user = authPayload;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * @function _checkThatValidTokenFormatIsProvided
 * @param {string|undefined} authToken
 * @returns {string} authToken
 */
const _checkThatValidTokenFormatIsProvided = (authToken) => {
  let splitToken;

  if (
    !authToken ||
    (splitToken = authToken.split(" ")).length !== 2 ||
    splitToken[0].toLowerCase() !== "bearer" ||
    !splitToken[1]
  ) {
    throw new UnauthenticatedError("Invalid token!");
  }

  return splitToken[1];
};

module.exports = Authenticate;
