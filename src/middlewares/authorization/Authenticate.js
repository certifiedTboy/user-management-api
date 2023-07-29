const { verifyToken } = require("../../utils/JWT/jwtHelpers");

const Authenticate = (req, res, next) => {
  try {
    const { authToken } = req.cookies;
    const authPayload = verifyToken(authToken);
    req.user = authPayload;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = Authenticate;
