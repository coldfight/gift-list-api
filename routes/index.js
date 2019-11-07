const express = require("express");
const router = express.Router();

const giftRouter = require("./giftRouter");
const recipientRouter = require("./recipientRouter");

// Set up all of the routes here.
router.use("/gifts", giftRouter);
router.use("/recipients", recipientRouter);

module.exports = router;
