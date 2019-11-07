const HttpStatus = require("http-status-codes");
const logger = require("../libs/logger");

exports.handleError = err => {
  logger.error(err.message);
  if (err.statusCode) {
    return err;
  }

  const error = new Error("There was an issue pulling the list of gifts.");
  error.statusCode = 500;
  return error;
};

exports.HttpError = class HttpError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = HttpStatus.NOT_FOUND;
  }
};

exports.BadRequestError = class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = HttpStatus.BAD_REQUEST;
  }
};
