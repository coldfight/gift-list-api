const logger = require("../libs/logger");

exports.notFound = (req, res, next) => {
  logger.error("Page Not Found");
  res.status(404).json({
    message: "This endpoint does not exist."
  });
};

exports.fallback = (error, req, res, next) => {
  logger.error("Server error");
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({
    message,
    data
  });
};
