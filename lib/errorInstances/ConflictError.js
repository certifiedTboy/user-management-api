const K = require("../constants/index");
const CustomError = require("./CustomError");

class ConflictError extends CustomError {
  constructor(message = K.responseMessage.ERR_CONFLICT, metaData = {}) {
    super(K.httpStatusCode.CONFLICT, message, metaData);
  }
}

module.exports = ConflictError;
