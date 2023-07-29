const K = require("../constants/index");
const CustomError = require("./CustomError");

class ServerError extends CustomError {
  constructor(message, metaData) {
    super(K.httpStatusCode.SERVER_ERROR, message, metaData);
  }
}

module.exports = ServerError;
