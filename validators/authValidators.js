const { body } = require("express-validator");
const User = require("../models/user");

module.exports = {
  signup: [
    body("username")
      .not()
      .isEmpty()
      .withMessage("Please enter a username.")
      .custom((value, { req }) => {
        return User.findOne({ where: { username: value } })
          .then(user => {
            if (user) {
              return Promise.reject("User already exists.");
            }
            return true;
          })
          .catch(err => {
            return Promise.reject(err);
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
  ],
  token: [
    body("username")
      .not()
      .isEmpty()
      .withMessage("Username is required."),
    body("refreshToken")
      .not()
      .isEmpty()
      .withMessage("Refresh token is required.")
  ]
};
