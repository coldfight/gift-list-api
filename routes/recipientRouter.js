const express = require("express");
const recipientController = require("../controllers/recipientController");
const validators = require("../validators/recipientValidators");
const isAuthenticated = require("../middleware/isAuthenticated");

const router = express.Router();

router.get("/", isAuthenticated, recipientController.getRecipients);
router.get("/:id", isAuthenticated, recipientController.getRecipient);
router.post(
  "/",
  isAuthenticated,
  validators.createRecipient,
  recipientController.createRecipient
);

module.exports = router;
