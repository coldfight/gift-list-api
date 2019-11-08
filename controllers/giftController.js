const { handleError, getValidationErrors } = require("../libs/errorHandler");
const Gift = require("../models/gift");
const Recipient = require("../models/recipient");
const HttpError = require("../libs/errors/httpError");

exports.getGifts = async (req, res, next) => {
  try {
    // Only get gifts related to the currently authenticated user.
    const gifts = await Gift.findAll({
      where: {
        userId: req.user.id
      }
    });
    res.json({ gifts });
  } catch (err) {
    next(handleError(err));
  }
};

exports.getGift = async (req, res, next) => {
  const giftId = req.params.id;

  try {
    const gift = await Gift.findOne({
      where: {
        id: giftId,
        userId: req.user.id
      }
    });
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
  const validationError = getValidationErrors(req);
  if (validationError) {
    return next(validationError);
  }

  const { name, recipientId } = req.body;
  try {
    // you can only set the recipientId IF the recipient's userId
    // is the authenticated user's id (req.user.id)
    const recipient = await Recipient.findOne({
      where: { id: recipientId, userId: req.user.id }
    });

    if (!recipient) {
      return next(new HttpError("Recipient does not exist"));
    }

    const createdGift = await Gift.create({
      name,
      recipientId,
      userId: req.user.id
    });

    res.json({
      gift: createdGift
    });
  } catch (err) {
    next(handleError(err));
  }
};
