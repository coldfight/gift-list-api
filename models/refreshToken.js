const randToken = require("rand-token");
const Sequelize = require("sequelize");
const sequelize = require("../libs/database");
const User = require("../models/user");

const { Op } = Sequelize;

// Expiry set in milliseconds. 1000ms * 3600s (in an hour) * 8760h (in a year)
const REFRESH_TOKEN_EXPIRE_TIME = 1000 * 3600 * 8760;

const RefreshToken = sequelize.define("refreshToken", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  token: {
    type: Sequelize.STRING
  },
  expireTime: {
    type: Sequelize.DATE
  },
  blackListed: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
});

RefreshToken.addHook("beforeCreate", async (refreshToken, options) => {
  try {
    refreshToken.token = randToken.uid(255);
    refreshToken.expireTime = new Date(
      new Date().getTime() + REFRESH_TOKEN_EXPIRE_TIME
    );
    return refreshToken;
  } catch (err) {
    throw err;
  }
});

RefreshToken.getValidRefreshTokenForUser = function(token, username) {
  return this.findOne({
    include: [
      {
        model: User,
        where: { username }
      }
    ],
    where: {
      token,
      expireTime: {
        [Op.gt]: new Date()
      },
      blackListed: false
    }
  });
};
module.exports = RefreshToken;
