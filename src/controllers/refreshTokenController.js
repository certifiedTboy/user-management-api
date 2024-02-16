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
    const result = await generateAccessToken(cookies?.refreshToken || "");

    if (!result) {
      const jwtTokenOptions = {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      };
      ResponseHandler.clearCookie(
        res,
        {},
        jwtTokenOptions,
        "failed verification, login with valid credentials"
      );
    }

    ResponseHandler.created(res, result.accessToken, "success");
  } catch (error) {
    next(error);
  }
};

module.exports = { refreshTokenHandler };
