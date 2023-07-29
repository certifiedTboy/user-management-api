const UnprocessableError = require("../../../lib/errorInstances/UnprocessableError");

const checkVerificationDataInputIsEmpty = async (req, res, next) => {
  try {
    const { userId, verificationToken } = req.body;
    if (
      !userId ||
      !verificationToken ||
      userId.trim().length === 0 ||
      verificationToken.trim().length === 0
    ) {
      throw new UnprocessableError(
        "Invalid token or empty verificaton data is sent"
      );
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

const checkPasswordResetDataInputIsEmpty = async (req, res, next) => {
  try {
    const { userId, passwordResetToken } = req.body;
    if (
      !userId ||
      !passwordResetToken ||
      userId.trim().length === 0 ||
      passwordResetToken.trim().length === 0
    ) {
      throw new UnprocessableError(
        "Invalid token or empty password reset data is sent"
      );
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkVerificationDataInputIsEmpty,
  checkPasswordResetDataInputIsEmpty,
};
