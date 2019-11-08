const { body } = require("express-validator");

module.exports = {
  createGift: [
    body("name")
      .not()
      .isEmpty()
      .withMessage("You must provide the name of the gift"),
    body("recipientId")
      .not()
      .isEmpty()
      .withMessage("You must provide the name of the gift")
  ]
};
