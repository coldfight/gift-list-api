const express = require("express");
const logger = require("morgan");

const baseRouter = require("./routes");
const corsProtect = require("./middleware/cors");
const errorHandlers = require("./middleware/errorHandlers");

const app = express();

app.use(logger("dev"));
app.use(express.json());

app.use(corsProtect);

app.use("/api", baseRouter);

app.use(errorHandlers.notFound);
app.use(errorHandlers.fallback);

module.exports = app;
