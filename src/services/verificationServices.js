const {
  checkThatUserExistById,
  deleteUserById,
  checkUserForVerification,
} = require("./userServices");
const UnprocessableError = require("../../lib/errorInstances/UnprocessableError");
const ConflictError = require("../../lib/errorInstances/ConflictError");
const NotFoundError = require("../../lib/errorInstances/NotFoundError");

/**
 * @method verifyUserToken
 * @param {string}userId
 * @param {string} verificationToken
 * @return {object<email>}
 */
const verifyUserToken = async (userId, verificationToken) => {
  const user = await checkUserForVerification(userId);
  if (user) {
    if (!user.verificationToken) {
      throw new NotFoundError("token does not exist or is invalid");
    }
    // check verificationtoken time validity if it exceeds 24hours
    if (user.verificationTokenExpiresAt - new Date() <= 0) {
      // deletes user account on late verification attempt
      await deleteUserById(userId);
      throw UnprocessableError("expired verification token");
    }

    if (user.verificationToken !== verificationToken) {
      throw new ConflictError("invalid verification token");
    }
    return { email: user.email };
  }
};

/**
 * @method verifyPasswordResetToken
 * @param {string}userId
 * @param {string} passwordResetToken
 * @return {object<email>}
 */
const verifyPasswordResetToken = async (userId, passwordResetToken) => {
  const user = await checkThatUserExistById(userId);
  if (user) {
    if (!user.resetPasswordToken) {
      throw new NotFoundError("token does not exist or is invalid");
    }

    // check passwordResetToken time validity if it exceeds 1hour
    if (user.resetPasswordExpires - new Date() <= 0) {
      // deletes password reset token on late verification attempt
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save();

      throw new UnprocessableError("expired password reset token");
    }

    if (user.resetPasswordToken !== passwordResetToken) {
      throw new ConflictError("invalid password reset token");
    }

    return { email: user.email };
  }
};

module.exports = { verifyUserToken, verifyPasswordResetToken };
