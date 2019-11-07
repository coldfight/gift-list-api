const { handleError, HttpError } = require("../libs/errorHandler");
const Gift = require("../models/gift");

exports.getGifts = async (req, res, next) => {
  try {
    const gifts = await Gift.findAll();
    res.json({ gifts });
  } catch (err) {
    next(handleError(err));
  }
};

exports.getGift = async (req, res, next) => {
  const giftId = req.params.id;

  try {
    const gift = await Gift.findByPk(giftId);
    if (!gift) {
      throw new HttpError("Gift does not exist");
    }
    res.json({ gift });
  } catch (err) {
    next(handleError(err));
  }
};

/**
 * @param req.body.name String The name of the gift
 * @param req.body.recipientId Integer The id of the recipient
 */
exports.createGift = async (req, res, next) => {
  try {
    const createdGift = await Gift.create({
      name: req.body.name,
      recipientId: req.body.recipientId
    });

    res.json({
      gift: createdGift
    });
  } catch (err) {
    next(handleError(err));
  }
};
