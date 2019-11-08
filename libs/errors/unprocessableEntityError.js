const { UNPROCESSABLE_ENTITY } = require("http-status-codes");

module.exports = class UnprocessableEntityError extends Error {
  constructor(message, data) {
    super(message);
    this.statusCode = UNPROCESSABLE_ENTITY;
    this.data = data;
  }
};
