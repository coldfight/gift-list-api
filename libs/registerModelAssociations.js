// Models
const Gift = require("../models/gift");
const Recipient = require("../models/recipient");

Gift.belongsTo(Recipient, {
  constraints: true,
  foreignKey: {
    field: 'recipientId',
    allowNull: false
  },
  onDelete: "CASCADE" // Deleting the Recipient will delete the gift
});
Recipient.hasMany(Gift);

// Eventually We'll be adding a User. User =/= Recipient.
// User is the currently authenticated user. Where as Recipient is the peron who the gift belongs to
module.exports = () => {};
