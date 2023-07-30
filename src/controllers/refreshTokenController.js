const { generateAccessToken } = require("../services/refreshTokenServices");
const ResponseHandler = require("../../lib/generalResponse/ResponseHandler");

/**
 * @method refreshTokenHandler
 * @param {Request}req
 * @param {Response}res
 * @param {NextFunction}next
 * @return {Promise<accessToken>}
 */
const refreshTokenHandler = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const accessToken = await generateAccessToken(cookies.refreshToken);
    ResponseHandler.send(res, accessToken, "success");
  } catch (error) {
    next(error);
  }
};

module.exports = { refreshTokenHandler };
