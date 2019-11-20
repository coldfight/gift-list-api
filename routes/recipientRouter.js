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
router.patch(
  "/:id",
  isAuthenticated,
  validators.updateRecipient,
  recipientController.updateRecipient
);
router.delete("/:id", isAuthenticated, recipientController.deleteRecipient);

module.exports = router;
