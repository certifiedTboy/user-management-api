const K = require("../constants/index");
const CustomError = require("./CustomError");

class NotFoundError extends CustomError {
  constructor(message = K.responseMessage.ERR_NOT_FOUND, metaData = {}) {
    super(K.httpStatusCode.NOT_FOUND, message, metaData);
  }
}

module.exports = NotFoundError;
