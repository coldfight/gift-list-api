const { UNAUTHORIZED } = require("http-status-codes");
module.exports = class UnauthorizedError extends Error {
  constructor(message, data) {
    super(message);
    this.statusCode = UNAUTHORIZED;
    this.data = data;
  }
};
