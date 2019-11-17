const Sequelize = require("sequelize");

const database = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    dialect: "mysql",
    host: "localhost"
  }
);

module.exports = database;
