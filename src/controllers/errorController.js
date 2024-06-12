const AppError = require("../utils/appError");

const sendErrorRes = function (error, res) {
  if (error.isOperational) {
    res
      .status(error.statusCode)
      .json({ status: error.status, message: error.message });
  } else {
    console.log(error, error.stack);

    res
      .status(500)
      .json({ status: "error", message: "Something went wrong in the server" });
  }
};

const handleCastError = function (error) {
  const message = `Invalid ${error.path} : ${error.value}`;
  return new AppError(message, 400);
};

// handling mongoose validation error
const handleValidationError = function (error) {
  return new AppError(error.message, 400);
};

// handlign duplicate field error
const handleDuplicateFieldError = function (error) {
  const message = `Duplicate field value : ${
    error.message.match(/"(.*?)"/)[0]
  }. Please enter another one.`;
  return new AppError(message, 400);
};

// handling jwt expired error
const handleTokenExpireError = function () {
  return new AppError("The token has been expired. Please login again", 401);
};

// handling jwt invalid signature error
const handleJWTError = function () {
  return new AppError("Invalid token. Please login again", 401);
};

const errorController = function (error, req, res, next) {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (error.name === "CastError") error = handleCastError(error);
  if (error.name === "ValidationError") error = handleValidationError(error);
  if (error.name === "TokenExpiredError") error = handleTokenExpireError();
  if (error.name === "JsonWebTokenError") error = handleJWTError();
  if (error.code === 11000) error = handleDuplicateFieldError(error);

  sendErrorRes(error, res);
};

module.exports = errorController;
