const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("./libs/registerModelAssociations");

const baseRouter = require("./routes");
const { notFound, fallback } = require("./middleware/errors");

const app = express();

if (process.env.NODE_ENV !== "testing") {
  app.use(logger("dev"));
}
app.use(express.json());

app.use(cors());

app.use("/api", baseRouter);

app.use(notFound);
app.use(fallback);

module.exports = app;
