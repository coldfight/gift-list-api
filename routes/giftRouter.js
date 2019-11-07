var express = require("express");
const giftController = require("../controllers/giftController");
const validators = require("../validators/giftValidators");
var router = express.Router();

router.get("/", giftController.getGifts);
router.get("/:id", giftController.getGift);
router.post("/", validators.createGift, giftController.createGift);

module.exports = router;
