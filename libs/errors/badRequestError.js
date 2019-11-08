const { BAD_REQUEST } = require("http-status-codes");

module.exports = class BadRequestError extends Error {
  constructor(message, data) {
    super(message);
    this.statusCode = BAD_REQUEST;
    this.data = data;
  }
};
