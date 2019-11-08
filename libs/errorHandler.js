const { validationResult } = require("express-validator/check");
const HttpStatus = require("http-status-codes");
const logger = require("../libs/logger");

class HttpError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = HttpStatus.NOT_FOUND;
  }
}
exports.HttpError = HttpError;

class BadRequestError extends Error {
  constructor(message, data) {
    super(message);
    this.statusCode = HttpStatus.BAD_REQUEST;
    this.data = data;
  }
}
exports.BadRequestError = BadRequestError;

class UnprocessableEntityError extends Error {
  constructor(message, data) {
    super(message);
    this.statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
    this.data = data;
  }
}
exports.UnprocessableEntityError = UnprocessableEntityError;


class UnauthorizedError extends Error {
  constructor(message, data) {
    super(message);
    this.statusCode = HttpStatus.UNAUTHORIZED;
    this.data = data;
  }
}
exports.UnauthorizedError = UnauthorizedError;


exports.handleError = err => {
  logger.error(err.message);
  if (err.statusCode) {
    return err;
  }

  const error = new Error("There was an issue pulling the list of gifts.");
  error.statusCode = 500;
  return error;
};

exports.getValidationErrors = req => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new UnprocessableEntityError(
      "Validation failed.",
      errors.array()
    );
    return error;
  }
  return false;
};
