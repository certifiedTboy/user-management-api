const User = require("../../models/user");
const UnprocessableError = require("../../../lib/errorInstances/UnprocessableError");

const checkUserAccountOwnership = async (req, res, next) => {
  try {
    if (req.user) {
      const currentUser = await User.findById(req.user.id);

      if (currentUser._id.toString() !== req.user.id) {
        throw new UnprocessableError("you do not have permission to do this");
      } else {
        next();
      }
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { checkUserAccountOwnership };
