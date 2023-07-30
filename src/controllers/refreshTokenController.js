const { generateAccessToken } = require("../services/refreshTokenServices");
const ResponseHandler = require("../../lib/generalResponse/ResponseHandler");

const refreshTokenHandler = async (req, res, next) => {
  try {
    const cookies = req.cookies;

    const accessToken = await generateAccessToken(cookies.refreshToken);

    console.log(accessToken);
    if (!cookies?.refreshToken) {
      const jwtTokenOptions = {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      };
      ResponseHandler.clearCookie(res, {}, jwtTokenOptions, "success");
    }
    const refreshToken = cookies.refreshToken;
  } catch (error) {
    next(error);
  }
};

module.exports = { refreshTokenHandler };
