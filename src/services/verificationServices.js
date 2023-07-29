const {
  checkThatUserExistById,
  deleteUserById,
  checkUserForVerification,
} = require("./userServices");
const UnprocessableError = require("../../lib/errorInstances/UnprocessableError");
const ConflictError = require("../../lib/errorInstances/ConflictError");
const NotFoundError = require("../../lib/errorInstances/NotFoundError");

const verifyUserToken = async (userId, verificationToken) => {
  const user = await checkUserForVerification(userId);

  console.log(user);

  if (user) {
    if (!user.verificationToken) {
      throw new NotFoundError("token does not exist or is invalid");
    }

    const now = +new Date();
    const verificationTokenExpiryDate = +user.verificationTokenExpiresAt;

    if (now - verificationTokenExpiryDate >= 0) {
      await deleteUserById(userId);
      throw UnprocessableError("expired verification token");
    }

    if (user.verificationToken !== `${verificationToken}:${userId}`) {
      throw new ConflictError("invalid verification token");
    }
    return { email: user.email };
  }
};

const verifyPasswordResetToken = async (userId, passwordResetToken) => {
  const user = await checkThatUserExistById(userId);
  if (user) {
    if (!user.resetPasswordToken) {
      throw new NotFoundError("token does not exist or is invalid");
    }
    const now = new Date();
    const passwordResetTokenExpiryDate = user.resetPasswordExpires;

    if (now - passwordResetTokenExpiryDate >= 0) {
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
