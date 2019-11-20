const HttpStatus = require("http-status-codes");
const { handleError, getValidationErrors } = require("../libs/errorHandler");
const Gift = require("../models/gift");
const Recipient = require("../models/recipient");
const HttpError = require("../libs/errors/httpError");
const BadRequestError = require("../libs/errors/badRequestError");

exports.getGifts = async (req, res, next) => {
  try {
    // Only get gifts related to the currently authenticated user.
    const gifts = await Gift.findAll({
      where: {
        userId: req.user.id
      }
    });
    res.json(gifts);
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
    res.json(gift);
  } catch (err) {
    next(handleError(err));
  }
};

/**
 * @param req.body.name String The name of the gift
 * @param req.body.price Integer The id of the recipient
 * @param req.body.recipientId Integer The id of the recipient
 */
exports.createGift = async (req, res, next) => {
  const validationError = getValidationErrors(req);
  if (validationError) {
    return next(validationError);
  }

  const { name, price, recipientId } = req.body;
  try {
    // you can only set the recipientId IF the recipient's userId
    // is the authenticated user's id (req.user.id)
    const recipient = await Recipient.findOne({
      where: { id: recipientId, userId: req.user.id }
    });

    if (!recipient) {
      return next(new BadRequestError("Recipient does not exist."));
    }

    const createdGift = await Gift.create({
      name,
      price,
      recipientId,
      userId: req.user.id
    });

    res.status(HttpStatus.CREATED).json(createdGift);
  } catch (err) {
    next(handleError(err));
  }
};

/**
 * @param req.body.name String The name of the gift
 */
exports.updateGift = async (req, res, next) => {
  const validationError = getValidationErrors(req);
  if (validationError) {
    return next(validationError);
  }
  try {
    let gift = await Gift.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!gift) {
      return next(new HttpError("Gift does not exist"));
    }

    if (req.body.hasOwnProperty("name")) {
      gift.name = req.body.name;
    }
    if (req.body.hasOwnProperty("price")) {
      gift.price = req.body.price;
    }
    if (req.body.hasOwnProperty("bought")) {
      gift.bought = req.body.bought;
    }

    gift = await gift.save();
    res.json(gift);
  } catch (err) {
    next(handleError(err));
  }
};

exports.deleteGift = async (req, res, next) => {
  try {
    const numDeleted = await Gift.destroy({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (numDeleted === 0) {
      return next(new HttpError("Gift does not exist"));
    }

    res.status(HttpStatus.NO_CONTENT).json();
  } catch (err) {
    next(handleError(err));
  }
};
