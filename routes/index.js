const express = require("express");
const router = express.Router();

const giftRouter = require("./giftRouter");
const recipientRouter = require("./recipientRouter");
const authRouter = require("./authRouter");

// Set up all of the routes here.
router.use("/gifts", giftRouter);
router.use("/recipients", recipientRouter);
router.use("/auth", authRouter);

module.exports = router;
