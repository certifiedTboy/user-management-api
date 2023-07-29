class CustomError extends Error {
  statusCode;

  metaData;

  constructor(statusCode, message, metaData) {
    super(message);

    this.statusCode = statusCode;

    this.metaData = metaData;
  }
}

module.exports = CustomError;
