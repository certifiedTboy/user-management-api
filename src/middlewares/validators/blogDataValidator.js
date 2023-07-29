const UnprocessableError = require("../../../lib/errorInstances/UnprocessableError");

const checkBlogDataValidity = async (req, res, next) => {
  try {
    const { title, description, content } = req.body;

    if (!title || !description || !content) {
      throw new UnprocessableError("all blog input fields are require");
    }

    if (title.length > 100) {
      throw new UnprocessableError(
        "title can not be longer than 100 characters"
      );
    }

    if (description.length > 250) {
      throw new UnprocessableError(
        "description can not be longer than 250 characters"
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

const checkCommentDataValidity = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) {
      throw new UnprocessableError("comment filed can not be empty");
    }

    if (text.length > 1000) {
      throw new UnprocessableError(
        "comments should not be longer than 1000 characters"
      );
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { checkBlogDataValidity, checkCommentDataValidity };
