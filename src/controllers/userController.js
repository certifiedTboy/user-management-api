const ResponseHandler = require("../../lib/generalResponse/ResponseHandler");
const {
  createNewUser,
  updateUserData,
  checkThatUserExistById,
  deleteUserById,
} = require("../services/userServices");
const { verifyUserToken } = require("../services/verificationServices");

/**
 * @method createUser
 * @param {Request}req
 * @param {Response}res
 * @param {NextFunction}next
 * @return {Promise<User>}
 */
const createUser = async (req, res, next) => {
  try {
    const { email, firstName, lastName } = req.body;
    const createdUser = await createNewUser(email, firstName, lastName);
    if (createdUser) {
      ResponseHandler.created(
        res,
        createdUser,
        `A mail has been sent to ${createdUser.email} to complete your registration process`
      );
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @method verifyUser
 * @param {Request}req
 * @param {Response}res
 * @param {NextFunction}next
 * @return {Promise<User>}
 */
const verifyUser = async (req, res, next) => {
  try {
    const { userId, verificationToken } = req.body;
    const userIsVerified = await verifyUserToken(userId, verificationToken);
    if (userIsVerified) {
      ResponseHandler.ok(
        res,
        userIsVerified,
        `verification for ${userIsVerified.email} is successful. Choose a valid password to complete registration`
      );
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @method updateUser
 * @param {Request}req
 * @param {Response}res
 * @param {NextFunction}next
 * @return {Promise<User>}
 */
const updateUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName } = req.body;

    const updatedUser = await updateUserData(userId, firstName, lastName);

    if (updatedUser) {
      ResponseHandler.ok(res, updatedUser, "user update successful");
    }
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const response = await deleteUserById(userId);

    if (response) {
      ResponseHandler.ok(res, {}, "User delete success");
    }
  } catch (error) {
    next(error);
  }
};
/**
 * @method getCurrentUser
 * @param {Request}req
 * @param {Response}res
 * @param {NextFunction}next
 * @return {Promise<User>}
 */
const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const currentUser = await checkThatUserExistById(userId);

    if (currentUser) {
      ResponseHandler.ok(res, currentUser, "success");
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @method viewDashboard
 * @param {Request}req
 * @param {Response}res
 * @param {NextFunction}next
 * @return {Promise<User>}
 */
const viewDashboard = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const currentUser = await checkThatUserExistById(userId);

    if (currentUser) {
      ResponseHandler.ok(
        res,
        currentUser,
        `You are current sign in as ${currentUser.firstName} - ${currentUser.lastName}`
      );
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  verifyUser,
  updateUser,
  deleteUser,
  getCurrentUser,
  viewDashboard,
};
