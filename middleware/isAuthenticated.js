const jwt = require("jsonwebtoken");
const logger = require("../libs/logger");
const UnauthorizedError = require("../libs/errors/unauthorizedError");
const User = require("../models/user");

module.exports = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    logger.error("No auth header");
    return next(new UnauthorizedError("Not authenticated"));
  }

  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    logger.error(err.stack);
    err.statusCode = 401;
    return next(err);
  }

  if (!decodedToken) {
    logger.error("No decodedToken");
    return next(new UnauthorizedError("Not authenticated"));
  }

  try {
    const user = await User.findByPk(decodedToken.userId);
    if (!user) {
      logger.error(`User not found for userId: ${decodedToken.userId}`);
      return next(new UnauthorizedError("Not authenticated"));
    }
    req.user = user;
    next();
  } catch (err) {
    logger.error(err.stack);
    return next(new UnauthorizedError("Not authenticated"));
  }
};
