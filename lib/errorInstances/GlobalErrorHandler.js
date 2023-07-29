const K = require("../constants/index");

const GlobalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || K.httpStatusCode.SERVER_ERROR;
  const message = err.message || K.ResponseMessage.ERR_SERVER;
  const metaData = err.metaData || {};

  res.status(statusCode).send({ message, ...metaData });
};

module.exports = GlobalErrorHandler;
