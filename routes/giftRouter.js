const express = require("express");
const giftController = require("../controllers/giftController");
const validators = require("../validators/giftValidators");
const isAuthenticated = require("../middleware/isAuthenticated");

const router = express.Router();

router.get("/", isAuthenticated, giftController.getGifts);
router.get("/:id", isAuthenticated, giftController.getGift);
router.post(
  "/",
  isAuthenticated,
  validators.createGift,
  giftController.createGift
);
router.patch(
  "/:id",
  isAuthenticated,
  validators.updateGift,
  giftController.updateGift
);
router.delete(
  "/:id",
  isAuthenticated,
  giftController.deleteGift
);


module.exports = router;
