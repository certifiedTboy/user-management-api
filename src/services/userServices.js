const User = require("../models/user");
const { sendVerificationUrl } = require("./emailServices");
const generateVerificationUrl = require("../utils/url-generator/verificationUrl");
const UnprocessableError = require("../../lib/errorInstances/UnprocessableError");
const NotFoundError = require("../../lib/errorInstances/NotFoundError");
const ConflictError = require("../../lib/errorInstances/ConflictError");

const newUser = async (email, firstName, lastName) => {
  const user = await checkThatUserAlreadyExist(email);

  if (!user) {
    const uniqueSuffix = Math.round(Math.random() * 1e9);

    const username = email.split("@")[0] + "-" + uniqueSuffix;
    const newUser = new User({ email, firstName, lastName, username });

    await newUser.save();

    if (newUser) {
      const verificationData = await generateVerificationUrl(
        newUser._id.toString()
      );

      if (verificationData) {
        newUser.verificationToken = verificationData.verificationToken;
        newUser.verificationTokenExpiresAt = verificationData.expiresAt;
        await newUser.save();
        await sendVerificationUrl(user.email, verificationData.verificationUrl);

        return { email: newUser.email };
      }
    }
  } else if (!user.isVerified) {
    const verificationData = await generateVerificationUrl(user._id.toString());
    if (verificationData) {
      user.verificationToken = verificationData.verificationToken;
      user.verificationTokenExpiresAt = verificationData.expiresAt;
      await user.save();
      await sendVerificationUrl(user.email, verificationData.verificationUrl);

      return { email: user.email };
    }
  } else {
    throw new UnprocessableError("This email address is already registered");
  }
};

const updateUserProfileImage = async (userId, imagePath) => {
  const user = await checkThatUserExistById(userId);

  if (user) {
    user.profilePicture = imagePath;

    await user.save();
    return user;
  }
};

const userNameUpdate = async (userId, firstName, lastName, about) => {
  const user = await checkThatUserExistById(userId);

  if (user) {
    user.firstName = firstName;
    user.lastName = lastName;
    user.about = about;

    await user.save();
    return user;
  }
};

const checkThatUserAlreadyExist = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

const checkThatUserExistById = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new NotFoundError("invalid user token");
  } else if (!user.isVerified) {
    throw new NotFoundError("invalid user token");
  } else {
    return user;
  }
};

const checkThatUserExistByUsername = async (username) => {
  const user = await User.findOne({ username }).select("-password");
  if (!user) {
    throw new NotFoundError("User does not exist");
  } else if (!user.isVerified) {
    throw new NotFoundError("User does not exist");
  } else {
    return user;
  }
};

const checkThatUserIsVerified = async (email) => {
  const user = await User.findOne({ email });
  if (user) {
    if (!user.isVerified) {
      throw new ConflictError("user account is not verified");
    }

    return user;
  } else {
    throw new NotFoundError("user account does not exist");
  }
};

const checkUserForNewPassword = async (email) => {
  const user = await User.findOne({ email });
  if (user) {
    if (!user) {
      throw new ConflictError("user account does not exist");
    }

    return user;
  }
};

const checkUserForVerification = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new NotFoundError("invalid user token");
  } else {
    return user;
  }
};

const deleteUserById = async (userId) => {
  return await User.findByIdAndRemove(userId);
};

module.exports = {
  newUser,
  checkThatUserExistById,
  deleteUserById,
  checkThatUserAlreadyExist,
  checkThatUserIsVerified,
  updateUserProfileImage,
  userNameUpdate,
  checkUserForNewPassword,
  checkThatUserExistByUsername,
  checkUserForVerification,
};
