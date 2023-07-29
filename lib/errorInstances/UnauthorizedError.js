const K = require("../constants/index");
const CustomError = require("./CustomError");

class UnauthorizedError {
  constructor(message = K.responseMessage.ERR_UNAUTHENTICATED, metaData) {
    super(K.httpStatusCode.UNAUTHORIZED, message, metaData);
  }
}

module.exports = UnauthorizedError;
