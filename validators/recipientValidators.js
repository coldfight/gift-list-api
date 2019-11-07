const { body } = require("express-validator/check");

module.exports = {
  createRecipient: [
    body("name")
      .not()
      .isEmpty()
      .withMessage("You must provide the recipient's name")
  ]
};
