const Sequelize = require("sequelize");

const database = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: process.env.DB_DIALECT,
    host: "localhost",
    logging: process.env.DB_LOGGING === "true"
  }
);

module.exports = database;
