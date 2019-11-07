const Sequelize = require("sequelize");
const sequelize = require("../libs/database");

const Gift = sequelize.define("gift", {
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
  price: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  bought: {
    type: Sequelize.BOOLEAN,
    default: false
  }
});

module.exports = Gift;
