const { body } = require("express-validator/check");
const User = require("../models/user");

module.exports = {
  signup: [
    body("username")
      .not()
      .isEmpty()
      .withMessage("Please enter a username.")
      .custom((value, { req }) => {
        return User.findOne({ where: { username: value } }).then(user => {
          if (user) {
            return Promise.reject("User already exists.");
          }
          return true;
        });
      }),
    body("password", "Your password must be at least 6 characters long")
      .trim()
      .isLength({ min: 6 })
  ],
  login: [
    body("username")
      .not()
      .isEmpty()
      .withMessage("Please enter your username."),
    body("password")
      .not()
      .isEmpty()
      .withMessage("Please enter your password.")
  ]
};
