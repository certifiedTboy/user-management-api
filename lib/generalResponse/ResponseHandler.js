const express = require("express");
const K = require("../constants/index");
const httpStatusCode = require("../constants/httpStatusCode");

class ResponseHandler {
  static send(res, statusCode, data, message = K.responseMessage.SUCCESS) {
    return res.status(statusCode).json({ message: message, data });
  }

  static auth(res, jwtTokenOptions, data, message = K.responseMessage.SUCCESS) {
    res
      .cookie("authToken", data.userSession.token, jwtTokenOptions)
      .json({
        message: message,
        userData: data.userData,
        authToken: data.userSession.token,
      });
  }

  static ok(res, data, message = K.responseMessage.OK) {
    return ResponseHandler.send(res, httpStatusCode.SUCCESS, data, message);
  }

  static created(res, data, message = K.responseMessage.CREATED) {
    return ResponseHandler.send(res, httpStatusCode.CREATED, data, message);
  }

  static authenticated(
    res,
    data,
    jwtTokenOptions,
    message = K.responseMessage.OK
  ) {
    return ResponseHandler.auth(res, jwtTokenOptions, data, message);
  }
}

module.exports = ResponseHandler;
