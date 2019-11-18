const { validationResult } = require("express-validator");
const HttpStatus = require("http-status-codes");
const logger = require("../libs/logger");
const UnprocessableEntityError = require("../libs/errors/unprocessableEntityError");

exports.handleError = err => {
  logger.error(err.stack);
  if (err.statusCode) {
    return err;
  }

  const error = new Error("There was an issue.");
  error.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
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
