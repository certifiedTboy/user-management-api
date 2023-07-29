const K = require("../constants/index");
const CustomError = require("./CustomError");

class UnprocessableError extends CustomError {
  constructor(message = K.responseMessage.ERR_UNPROCESSABLE, metaData) {
    super(K.httpStatusCode.UNPROCESSABLE_ENTITY, message, metaData);
  }
}

module.exports = UnprocessableError;
