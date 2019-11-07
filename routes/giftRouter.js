var express = require("express");
const giftController = require("../controllers/giftController");

var router = express.Router();

router.get("/", giftController.getGifts);
router.get("/:id", giftController.getGift);
router.post("/", giftController.createGift);

module.exports = router;
