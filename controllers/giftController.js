const {
  handleError,
  getValidationErrors,
  HttpError
} = require("../libs/errorHandler");
const Gift = require("../models/gift");

exports.getGifts = async (req, res, next) => {
  const authenticatedUser = req.user;
  try {
    // Only get gifts related to the currently authenticated user.
    const gifts = await Gift.findAll({
      where: {
        userId: authenticatedUser.id
      }
    });
    res.json({ gifts });
  } catch (err) {
    next(handleError(err));
  }
};

exports.getGift = async (req, res, next) => {
  const giftId = req.params.id;
  const authenticatedUser = req.user;

  try {
    const gift = await Gift.findOne({
      where: {
        id: giftId,
        userId: authenticatedUser.id
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
  const authenticatedUser = req.user;
  const { name, recipientId } = req.body;
  try {
    // @todo: you can only set the recipientId IF the recipient's userId is the authenticatedUser.id

    const createdGift = await Gift.create({
      name,
      recipientId,
      userId: authenticatedUser.id
    });

    res.json({
      gift: createdGift
    });
  } catch (err) {
    next(handleError(err));
  }
};
