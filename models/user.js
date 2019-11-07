const bcrypt = require("bcryptjs");
const Sequelize = require("sequelize");
const sequelize = require("../libs/database");

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  username: {
    type: Sequelize.STRING(45),
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

User.addHook("beforeCreate", async (user, options) => {
  try {
    const hashedPassword = await bcrypt.hash(user.password, 12);
    user.password = hashedPassword;
    return user;
  } catch (err) {
    throw err;
  }
});

User.prototype.isPasswordValid = async function(rawPassword) {
  return await bcrypt.compare(rawPassword, this.password);
};

module.exports = User;
