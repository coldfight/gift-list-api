const Sequelize = require("sequelize");
const jwt = require("jsonwebtoken");
const { handleError, getValidationErrors } = require("../libs/errorHandler");
const User = require("../models/user");
const RefreshToken = require("../models/refreshToken");
const UnauthorizedError = require("../libs/errors/unauthorizedError");

/**
 * @param req.body.username String
 * @param req.body.password String
 * @param req.body.refresh boolean If set to true, the response will also return a refresh token
 */
exports.signup = async (req, res, next) => {
  const validationError = getValidationErrors(req);
  if (validationError) {
    return next(validationError);
  }

  const { username, password } = req.body;

  try {
    // Password gets hashed before the user gets created and saved
    const user = new User({
      username,
      password
    });
    const savedUser = await user.save();
    const jwtToken = generateJwt(user.username, user.id);
    let refreshTokenRecord;
    if (req.body.refresh) {
      refreshTokenRecord = await RefreshToken.create({
        userId: user.id
      });
    }

    res.status(201).json({
      token: jwtToken,
      userId: savedUser.id,
      refreshToken: refreshTokenRecord ? refreshTokenRecord.token : undefined
    });
  } catch (err) {
    next(handleError(err));
  }
};

/**
 * @param req.body.username String
 * @param req.body.password String
 * @param req.body.refresh boolean If set to true, the response will also return a refresh token
 */
exports.login = async (req, res, next) => {
  const validationError = getValidationErrors(req);
  if (validationError) {
    return next(validationError);
  }

  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return next(new UnauthorizedError("Incorrect credentials"));
    }

    const isValidPassword = await user.isPasswordValid(password);

    if (!isValidPassword) {
      return next(new UnauthorizedError("Incorrect credentials"));
    }

    const jwtToken = generateJwt(user.username, user.id);
    let refreshTokenRecord;
    if (req.body.refresh) {
      refreshTokenRecord = await RefreshToken.create({
        userId: user.id
      });
    }

    res.status(200).json({
      token: jwtToken,
      userId: user.id,
      refreshToken: refreshTokenRecord ? refreshTokenRecord.token : undefined
    });
  } catch (err) {
    next(handleError(err));
  }
};

/**
 * @param req.body.username String
 * @param req.body.refreshToken String
 */
exports.token = async (req, res, next) => {
  const validationError = getValidationErrors(req);
  if (validationError) {
    return next(validationError);
  }

  const { username, refreshToken } = req.body;

  try {
    const refreshTokenRecord = await RefreshToken.getValidRefreshTokenForUser(
      refreshToken,
      username
    );

    if (!refreshTokenRecord) {
      return next(new UnauthorizedError("Incorrect credentials"));
    }

    const jwtToken = generateJwt(
      refreshTokenRecord.user.username,
      refreshTokenRecord.user.id
    );
    res.json({ token: jwtToken, userId: refreshTokenRecord.user.id });
  } catch (err) {
    next(handleError(err));
  }
};

/**
 * @param req.body.username String
 * @param req.body.refreshToken String
 */
exports.deleteToken = async (req, res, next) => {
  const validationError = getValidationErrors(req);
  if (validationError) {
    return next(validationError);
  }

  const { refreshToken } = req.body;

  try {
    const refreshTokenRecord = await RefreshToken.getValidRefreshTokenForUser(
      refreshToken,
      req.user.username
    );

    if (!refreshTokenRecord) {
      return next(new UnauthorizedError("Incorrect credentials"));
    }

    await refreshTokenRecord.destroy();
    res.status(204).json();
  } catch (err) {
    next(handleError(err));
  }
};

const generateJwt = (username, userId) => {
  return jwt.sign({ username, userId }, process.env.JWT_SECRET, {
    expiresIn: "1h"
  });
};
