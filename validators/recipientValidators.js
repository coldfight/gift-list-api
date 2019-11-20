const { body } = require("express-validator");

module.exports = {
  createRecipient: [
    body("name")
      .not()
      .isEmpty()
      .withMessage("You must provide the recipient's name")
  ],
  updateRecipient: [
    body("name")
      .if(body("name").exists())
      .not()
      .isEmpty()
      .withMessage("You must provide the name of the recipient")
  ]
};
