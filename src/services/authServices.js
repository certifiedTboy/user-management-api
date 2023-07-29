const {
  checkThatUserIsVerified,
  checkUserForNewPassword,
} = require("./userServices");
const {
  hashPassword,
  verifyPassword,
} = require("../utils/general/passwordHelpers");
const generatePasswordResetUrl = require("../utils/url-generator/passwordResetUrl");
const createOrUpdatePlatformSession = require("./sessionServices");
const { sendPasswordResetUrl } = require("./emailServices");

const updateUserPassword = async (email, password) => {
  const user = await checkUserForNewPassword(email);

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
        // user password update for password reset request
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        return user;
      }
    }
  }
};

const loginUser = async (email, password, ipAddress) => {
  const user = await checkThatUserIsVerified(email);
  if (user) {
    await verifyPassword(password, user.password);

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

const requestPasswordReset = async (email) => {
  const user = await checkThatUserIsVerified(email);

  if (user) {
    const passwordResetData = await generatePasswordResetUrl(
      user._id.toString()
    );

    if (passwordResetData) {
      if (passwordResetData) {
        user.resetPasswordToken = passwordResetData.passwordResetToken;
        user.resetPasswordExpires = passwordResetData.expiresAt;
        await user.save();
        // await sendPasswordResetUrl(
        //   user.email,
        //   passwordResetData.passwordResetUrl
        // );

        return { email: user.email };
      }
    }
  }
};

module.exports = { updateUserPassword, loginUser, requestPasswordReset };
