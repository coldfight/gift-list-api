const jwt = require("jsonwebtoken");
const { handleError, getValidationErrors } = require("../libs/errorHandler");
const User = require("../models/user");
const UnauthorizedError = require("../libs/errors/unauthorizedError");

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
    // Should return a JWT token and authenticate at this point too
    res.status(201).json({ message: "User created!", userId: savedUser.id });
  } catch (err) {
    next(handleError(err));
  }
};

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

    const token = jwt.sign(
      {
        username: user.username,
        userId: user.id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );
    res.status(200).json({ token, userId: user.id });

    // @todo: refer to: https://solidgeargroup.com/refresh-token-with-jwt-authentication-node-js/
    // Here, we should also generate a refresh token. we're using this
    // in a mobile app so it makes sense to be able to request a new
    // access(jwt) token without re-entering the credentials
  } catch (err) {
    next(handleError(err));
  }
};
