const HttpStatus = require("http-status-codes");
const logger = require("../libs/logger");

exports.notFound = (req, res, next) => {
  res.status(404).json({
    message: "This endpoint does not exist."
  });
};

exports.fallback = (error, req, res, next) => {
  logger.error(error.stack);
  const status = error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
  const message = error.message;
  const data = error.data;
  res.status(status).json({
    message,
    data
  });
};
