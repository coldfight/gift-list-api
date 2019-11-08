const { body } = require("express-validator");

module.exports = {
  createRecipient: [
    body("name")
      .not()
      .isEmpty()
      .withMessage("You must provide the recipient's name")
  ]
};
