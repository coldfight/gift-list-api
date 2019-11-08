const { handleError, getValidationErrors } = require("../libs/errorHandler");
const Recipient = require("../models/recipient");
const HttpError = require("../libs/errors/httpError");

exports.getRecipients = async (req, res, next) => {
  try {
    const recipients = await Recipient.findAll({
      where: {
        userId: req.user.id
      }
    });
    res.json({ recipients });
  } catch (err) {
    next(handleError(err));
  }
};

exports.getRecipient = async (req, res, next) => {
  const recipientId = req.params.id;

  try {
    const recipient = await Recipient.findOne({
      where: {
        id: recipientId,
        userId: req.user.id
      }
    });
    if (!recipient) {
      throw new HttpError("Recipient does not exist");
    }
    res.json({ recipient });
  } catch (err) {
    next(handleError(err));
  }
};

/**
 * @param req.body.name String The name of the recipient
 */
exports.createRecipient = async (req, res, next) => {
  const validationError = getValidationErrors(req);
  if (validationError) {
    return next(validationError);
  }

  try {
    const createdRecipient = await Recipient.create({
      name: req.body.name,
      userId: req.user.id
    });

    res.json({
      recipient: createdRecipient
    });
  } catch (err) {
    next(handleError(err));
  }
};
