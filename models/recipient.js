const Sequelize = require("sequelize");
const sequelize = require("../libs/database");

const Recipient = sequelize.define("recipient", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  spendLimit: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  completed: {
    type: Sequelize.BOOLEAN,
    default: false
  }
});

module.exports = Recipient;
