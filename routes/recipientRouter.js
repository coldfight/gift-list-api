const express = require("express");
const recipientController = require("../controllers/recipientController");
const validators = require("../validators/recipientValidators");

const router = express.Router();

router.get("/", recipientController.getRecipients);
router.get("/:id", recipientController.getRecipient);
router.post(
  "/",
  validators.createRecipient,
  recipientController.createRecipient
);

module.exports = router;
