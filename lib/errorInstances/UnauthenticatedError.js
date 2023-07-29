const K = require("../constants/index");
const CustomError = require("./CustomError");

class UnauthenticatedError extends CustomError {
  constructor(message = K.responseMessage.ERR_UNAUTHENTICATED, metaData) {
    super(K.httpStatusCode.UNAUTHENTICATED, message, metaData);
  }
}

module.exports = UnauthenticatedError;
