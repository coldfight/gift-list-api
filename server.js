const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const baseRouter = require("./routes");
const { notFound, fallback } = require("./middleware/errors");

const app = express();

app.use(logger("dev"));
app.use(express.json());

app.use(cors());

app.use("/api", baseRouter);

app.use(notFound);
app.use(fallback);

module.exports = app;
