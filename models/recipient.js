const Sequelize = require("sequelize");
const sequelize = require("../libs/database");

/**
 * The person that the gift is for
 */
const Recipient = sequelize.define("recipient", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  spendLimit: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  completed: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
});

module.exports = Recipient;
