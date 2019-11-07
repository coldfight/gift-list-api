const express = require("express");

const User = require("../models/user");
const authController = require("../controllers/authController");
const validators = require("../validators/authValidators");
// const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.post("/signup", validators.signup, authController.signup);
router.post("/login", validators.login, authController.login);

module.exports = router;
