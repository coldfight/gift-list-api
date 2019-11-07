const express = require("express");
const recipientController = require("../controllers/recipientController");

const router = express.Router();

router.get("/", recipientController.getRecipients);
router.get("/:id", recipientController.getRecipient);
router.post("/", recipientController.createRecipient);

module.exports = router;
