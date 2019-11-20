const HttpStatus = require("http-status-codes");
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
    res.json(recipients);
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
    res.json(recipient);
  } catch (err) {
    next(handleError(err));
  }
};

/**
 * @param req.body.name String The name of the recipient
 * @param req.body.spendLimit Number The max amount to spend for recipient
 */
exports.createRecipient = async (req, res, next) => {
  const validationError = getValidationErrors(req);
  if (validationError) {
    return next(validationError);
  }

  try {
    const { name, spendLimit } = req.body;
    const createdRecipient = await Recipient.create({
      name,
      spendLimit,
      userId: req.user.id
    });

    res.status(HttpStatus.CREATED).json(createdRecipient);
  } catch (err) {
    next(handleError(err));
  }
};

/**
 * @param req.body.name String The name of the recipient
 */
exports.updateRecipient = async (req, res, next) => {
  const validationError = getValidationErrors(req);
  if (validationError) {
    return next(validationError);
  }
  try {
    let recipient = await Recipient.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!recipient) {
      return next(new HttpError("Recipient does not exist"));
    }

    if (req.body.hasOwnProperty("name")) {
      recipient.name = req.body.name;
    }

    recipient = await recipient.save();
    res.json(recipient);
  } catch (err) {
    next(handleError(err));
  }
};

exports.deleteRecipient = async (req, res, next) => {
  try {
    const numDeleted = await Recipient.destroy({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (numDeleted === 0) {
      return next(new HttpError("Recipient does not exist"));
    }

    res.status(HttpStatus.NO_CONTENT).json();
  } catch (err) {
    next(handleError(err));
  }
};
