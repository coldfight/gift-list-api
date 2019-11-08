const express = require("express");

const User = require("../models/user");
const authController = require("../controllers/authController");
const validators = require("../validators/authValidators");
const isAuthenticated = require("../middleware/isAuthenticated");

const router = express.Router();

router.post("/signup", validators.signup, authController.signup);
router.post("/login", validators.login, authController.login);
router.post("/token", validators.token, authController.token);
router.delete(
  "/token",
  isAuthenticated,
  validators.deleteToken,
  authController.deleteToken
);

module.exports = router;
