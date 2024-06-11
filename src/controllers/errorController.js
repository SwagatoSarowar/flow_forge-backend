const AppError = require("../utils/appError");

const sendErrorRes = function (error, res) {
  if (error.isOperational) {
    res
      .status(error.statusCode)
      .json({ status: error.status, message: error.message });
  } else {
    console.log(error);

    res
      .status(500)
      .json({ status: "error", message: "Something went wrong in the server" });
  }
};

const handleDuplicateFieldError = function (error) {
  const message = `Duplicate field value : ${
    error.message.match(/"(.*?)"/)[0]
  }. Please enter another one.`;
  return new AppError(message, 400);
};

const handleCastError = function (error) {
  const message = `Invalid ${error.path}:${error.value}`;
  return new AppError(message, 400);
};

const errorController = function (error, req, res, next) {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (error.name === "CastError") error = handleCastError(error);
  if (error.code === 11000) error = handleDuplicateFieldError(error);

  sendErrorRes(error, res);
};

module.exports = errorController;
