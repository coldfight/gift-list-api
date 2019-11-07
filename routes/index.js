const express = require("express");
const testRouter = require("./test");
const router = express.Router();

// Set up all of the routes here.
router.use("/test", testRouter);

module.exports = router;
