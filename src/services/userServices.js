const User = require("../models/user");
const { sendVerificationUrl } = require("./emailServices");
const generateVerificationUrl = require("../utils/url-generator/verificationUrl");
const UnprocessableError = require("../../lib/errorInstances/UnprocessableError");
const NotFoundError = require("../../lib/errorInstances/NotFoundError");
const ConflictError = require("../../lib/errorInstances/ConflictError");

/**
 * @method createNewUser
 * @param {string} email
 * @param {string} firstName
 * @param {string} lastName
 * @return {object<User>}
 */
const createNewUser = async (email, firstName, lastName) => {
  // check if user exist to avoid multiple creation of unverified accounts on multiple request
  const user = await checkThatUserAlreadyExist(email);
  if (!user) {
    //generates unique username from email address if new user
    const uniqueSuffix = Math.round(Math.random() * 1e9);
    const username = email.split("@")[0] + "-" + uniqueSuffix;

    const newUser = new User({ email, firstName, lastName, username });

    await newUser.save();

    if (newUser) {
      // generates a verificationData if user account creation is successful
      // verification data is an object of verificationToken and a verificationUrl with an expiry time (24hrs)
      // verification url is an encoded url of frontend base-url, verificationToken and the unique user Id
      const verificationData = await generateVerificationUrl(
        newUser._id.toString()
      );

      if (verificationData) {
        // store verification token to associated user information
        newUser.verificationToken = verificationData.verificationToken;
        newUser.verificationTokenExpiresAt = verificationData.expiresAt;
        await newUser.save();

        // sendverification url to unique user email
        // await sendVerificationUrl(user.email, verificationData.verificationUrl);

        // A response of user email, userId and verification token is sent back to user
        // Verification token and userId is sent here for the sake of testing on POSTMAN agent
        return {
          email: newUser.email,
          userId: newUser._id,
          verificationToken: newUser.verificationToken,
        };
      }
    }
  } else if (!user.isVerified) {
    // On re-eccuring request for user account creation
    // A check is done if user is verified or not
    // if user is not verified, a new verification token and url is generated and updated on associated user information
    const verificationData = await generateVerificationUrl(user._id.toString());
    if (verificationData) {
      user.verificationToken = verificationData.verificationToken;
      user.verificationTokenExpiresAt = verificationData.expiresAt;
      await user.save();
      // on successful update, user is sent new verification url via unique email provided
      // await sendVerificationUrl(user.email, verificationData.verificationUrl);
      return {
        email: user.email,
        userId: user._id,
        verificationToken: user.verificationToken,
      };
    }
  } else {
    // if user exist on db, and is verified, a error response is sent
    throw new UnprocessableError("This email address is already registered");
  }
};

/**
 * @method userNameUpdate
 * @param {string} userId
 * @param {string} firstName
 * @param {string} lastName
 * @return {object <User>}
 */
const userNameUpdate = async (userId, firstName, lastName) => {
  const user = await checkThatUserExistById(userId);

  if (user) {
    user.firstName = firstName;
    user.lastName = lastName;

    await user.save();
    return user;
  }
};

/**
 * @method checkThatUserAlreadyExist
 * @param {string} email
 * @return {object<User>}
 */
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

/**
 * @method checkThatUserIsVerified
 * @param {string} email
 * @return {object<User>}
 */
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

/**
 * @method checkUserForNewPassword
 * @param {string}email
 * @return {object <User>}
 */
const checkUserForNewPassword = async (email) => {
  const user = await User.findOne({ email });
  if (user) {
    if (!user) {
      throw new ConflictError("user account does not exist");
    }
    return user;
  }
};

/**
 * @method checkUserForVerification
 * @param {string} userId
 * @return {User}
 */
const checkUserForVerification = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new NotFoundError("invalid token");
  } else {
    return user;
  }
};

/**
 * @method deleteUserById
 * @param {string}userId
 * @return {Void}
 */
const deleteUserById = async (userId) => {
  return await User.findByIdAndRemove(userId);
};

module.exports = {
  createNewUser,
  checkThatUserExistById,
  deleteUserById,
  checkThatUserAlreadyExist,
  checkThatUserIsVerified,
  userNameUpdate,
  checkUserForNewPassword,
  checkThatUserExistByUsername,
  checkUserForVerification,
};
