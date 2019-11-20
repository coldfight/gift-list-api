const app = require("../app");
const { normalizePort } = require("../libs/helper");

const port = normalizePort(process.env.PORT || "3000");
const server = app.listen(port);

module.exports = server;
