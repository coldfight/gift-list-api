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
    const token = generateJwt(user.username, user.id);
    let refreshToken;
    if (req.body.refresh) {
      refreshToken = await RefreshToken.create({
        userId: user.id
      });
    }

    res.status(201).json({
      token,
      userId: savedUser.id,
      refreshToken: refreshToken ? refreshToken.token : undefined
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

    const token = generateJwt(user.username, user.id);
    let refreshToken;
    if (req.body.refresh) {
      refreshToken = await RefreshToken.create({
        userId: user.id
      });
    }

    res.status(200).json({
      token,
      userId: user.id,
      refreshToken: refreshToken ? refreshToken.token : undefined
    });
  } catch (err) {
    next(handleError(err));
  }
};

const generateJwt = (username, userId) => {
  return jwt.sign({ username, userId }, process.env.JWT_SECRET, {
    expiresIn: "1h"
  });
};
