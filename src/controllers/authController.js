const {
  updateUserPassword,
  loginUser,
  requestPasswordReset,
  logoutUser,
} = require("../services/authServices");
const {
  verifyPasswordResetToken,
} = require("../services/verificationServices");
const ResponseHandler = require("../../lib/generalResponse/ResponseHandler");

/**
 * @method setUserPassword
 * @param {Request}req
 * @param {Response}res
 * @param {NextFunction}next
 * @return {Promise}
 */
const setUserPassword = async (req, res, next) => {
  try {
    const { password, email } = req.body;
    const updatedUser = await updateUserPassword(email, password);
    if (updatedUser) {
      ResponseHandler.ok(
        res,
        {},
        "Password changed successfully, proceed to login with your valid credentials"
      );
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @method userLogin
 * @param {Request}req
 * @param {Response}res
 * @param {NextFunction}next
 * @return {Promise<AuthToken>}
 */
const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const ipAddress = req.ip;

    const data = await loginUser(email, password, ipAddress);
    if (data) {
      const jwtTokenOptions = {
        expires: data.userSession.userSession.expiresAt,
        maxAge: 59 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax",
        secure: true,
      };

      ResponseHandler.authenticated(
        res,
        data,
        jwtTokenOptions,
        "login success"
      );
    }
  } catch (error) {
    next(error);
  }
};

const userLogout = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const response = await logoutUser(cookies.refreshToken);
    if (response) {
      const jwtTokenOptions = {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      };
      ResponseHandler.clearCookie(res, {}, jwtTokenOptions, "logout success");
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @method passwordResetRequest
 * @param {Request}req
 * @param {Response}res
 * @param {NextFunction}next
 * @return {Promise<PasswordResetToken>}
 */
const passwordResetRequest = async (req, res, next) => {
  try {
    const { email } = req.body;
    const response = await requestPasswordReset(email);

    if (response) {
      ResponseHandler.ok(
        res,
        response,
        `A mail has been sent to ${response.email} to complete your request`
      );
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @method verifyPasswordResetData
 * @param {Request}req
 * @param {Response}res
 * @param {NextFunction}next
 * @return {Promise}
 */
const verifyPasswordResetData = async (req, res, next) => {
  try {
    const { userId, passwordResetToken } = req.body;
    const response = await verifyPasswordResetToken(userId, passwordResetToken);

    if (response) {
      ResponseHandler.ok(
        res,
        { email: response.email },
        "Select a new password"
      );
    }
  } catch (error) {
    next(error);
  }
};
module.exports = {
  setUserPassword,
  userLogin,
  passwordResetRequest,
  verifyPasswordResetData,
  userLogout,
};
