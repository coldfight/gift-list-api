const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const baseRouter = require("./routes");
const errorHandlers = require("./middleware/errorHandlers");

const app = express();

app.use(logger("dev"));
app.use(express.json());

app.use(cors());

app.use("/api", baseRouter);

app.use(errorHandlers.notFound);
app.use(errorHandlers.fallback);

module.exports = app;
