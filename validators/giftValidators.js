const { body } = require("express-validator");

module.exports = {
  createGift: [
    body("name")
      .not()
      .isEmpty()
      .withMessage("You must provide the name of the gift"),
    body("price")
      .isNumeric()
      .withMessage("You must provide a valid price"),
    body("recipientId")
      .not()
      .isEmpty()
      .withMessage("You must provide the name of the gift")
  ],
  updateGift: [
    body("name")
      .if(body("name").exists())
      .not()
      .isEmpty()
      .withMessage("You must provide the name of the gift"),
    body("price")
      .if(body("price").exists())
      .isNumeric()
      .withMessage("You must provide a valid price"),
    body("bought")
      .if(body("bought").exists())
      .isBoolean()
  ]
};
