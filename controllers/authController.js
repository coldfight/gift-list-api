const { handleError, getValidationErrors } = require("../libs/errorHandler");
const User = require("../models/user");

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

  console.log("Gonna login with ", username, password);
  return res.json({ message: "@todo: Need to use passportjs..." });
  // try {
  //   // Password gets hashed before the user gets created and saved
  //   const user = new User({
  //     username,
  //     password
  //   });
  //   const savedUser = await user.save();
  //   // Should return a JWT token and authenticate at this point too
  //   res.status(201).json({ message: "User created!", userId: savedUser.id });
  // } catch (err) {
  //   next(handleError(err));
  // }
};
