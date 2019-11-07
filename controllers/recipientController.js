const { handleError, HttpError } = require("../libs/errorHandler");
const Recipient = require("../models/recipient");

exports.getRecipients = async (req, res, next) => {
  try {
    const recipients = await Recipient.findAll();
    res.json({ recipients });
  } catch (err) {
    next(handleError(err));
  }
};

exports.getRecipient = async (req, res, next) => {
  const recipientId = req.params.id;

  try {
    const recipient = await Recipient.findByPk(recipientId);
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
  try {
    const createdRecipient = await Recipient.create({
      name: req.body.name
    });

    res.json({
      recipient: createdRecipient
    });
  } catch (err) {
    next(handleError(err));
  }
};
