const {
  checkThatUserIsVerified,
  checkUserForNewPassword,
} = require("./userServices");
const {
  hashPassword,
  verifyPassword,
} = require("../utils/general/passwordHelpers");
const generatePasswordResetUrl = require("../utils/url-generator/passwordResetUrl");
const { createOrUpdatePlatformSession } = require("./sessionServices");
const { sendPasswordResetUrl } = require("./emailServices");
const UnprocessableError = require("../../lib/errorInstances/UnprocessableError");

/**
 * @method updateUserPassword
 * @param {string} email
 * @param {string} password
 * @return {object<User>}
 */
const updateUserPassword = async (email, password) => {
  const user = await checkUserForNewPassword(email);
  // To avoid WET code, setting new password and resetting password is handled in this method
  if (user) {
    const hashedPassword = await hashPassword(password);
    if (hashedPassword) {
      if (!user.password) {
        /// user password update for first time registration
        user.password = hashedPassword;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        user.isVerified = true;

        await user.save();
        return user;
      } else {
        // this checks if user actually requested for a password reset
        // which can be validated if resetPassword token is available on their data
        if (user.resetPasswordToken) {
          // user password update for password reset request
          user.password = hashedPassword;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;
          await user.save();
          return user;
        } else {
          // error response is sent if user haven't request for a password reset
          throw new UnprocessableError(
            "You have not requested for a password reset"
          );
        }
      }
    }
  }
};

/**
 * @method loginUser
 * @param {string} email
 * @param {string} password
 * @param {string} ipAddress
 * @return {object <UserSession>}
 */
const loginUser = async (email, password, ipAddress) => {
  const user = await checkThatUserIsVerified(email);
  if (user) {
    await verifyPassword(password, user.password);
    // create new or update user session method
    const userSession = await createOrUpdatePlatformSession(
      user._id.toString(),
      ipAddress
    );

    const userData = {
      username: user.username,
      userType: user.userType,
    };

    if (userSession) {
      return { userData, userSession };
    }
  }
};

/**
 * @method requestPasswordReset
 * @param {string} email
 * @return {object <User>}
 */
const requestPasswordReset = async (email) => {
  //check if user is verified
  const user = await checkThatUserIsVerified(email);

  if (user) {
    // generate password reset url if user exist and isVerified
    const passwordResetData = await generatePasswordResetUrl(
      user._id.toString()
    );

    if (passwordResetData) {
      if (passwordResetData) {
        // update user data in databases on url generation success
        user.resetPasswordToken = passwordResetData.passwordResetToken;
        user.resetPasswordExpires = passwordResetData.expiresAt;

        await user.save();
        // send password reset url to email on user data update success
        await sendPasswordResetUrl(
          user.email,
          passwordResetData.passwordResetUrl
        );

        return {
          email: user.email,
          userId: user._id,
          passwordResetToken: user.resetPasswordToken,
        };
      }
    }
  }
};

module.exports = { updateUserPassword, loginUser, requestPasswordReset };
