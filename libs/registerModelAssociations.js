// Models
const Gift = require("../models/gift");
const Recipient = require("../models/recipient");
const User = require("../models/user");

Gift.belongsTo(Recipient, {
  constraints: true,
  foreignKey: {
    field: "recipientId",
    allowNull: false
  },
  onDelete: "CASCADE" // Deleting the Recipient will delete the gift
});
Recipient.hasMany(Gift);

Gift.belongsTo(User, {
  constraints: true,
  foreignKey: {
    field: "userId",
    allowNull: false
  },
  onDelete: "CASCADE"
});
User.hasMany(Gift);

Recipient.belongsTo(User, {
  constraints: true,
  foreignKey: {
    field: "userId",
    allowNull: false
  },
  onDelete: "CASCADE"
});
User.hasMany(Recipient);

// Eventually We'll be adding a User. User =/= Recipient.
// User is the currently authenticated user. Where as Recipient is the peron who the gift belongs to
module.exports = () => {};
