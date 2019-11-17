const app = require("./server");
const logger = require("./libs/logger");
const sequelize = require("./libs/database");
const { normalizePort } = require("./libs/helper");

// ssh pi@192.168.2.45 -p 22022 -L 3306:127.0.0.1:3306 -N
sequelize.sync().then(() => {
  const port = normalizePort(process.env.PORT || "3000");
  const server = app.listen(port);
  server.on("error", error => {
    if (error.syscall !== "listen") {
      throw error;
    }

    const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case "EACCES":
        logger.error(bind + " requires elevated privileges");
        process.exit(1);
        break;
      case "EADDRINUSE":
        logger.error(bind + " is already in use");
        process.exit(1);
        break;
      default:
        throw error;
    }
  });

  server.on("listening", () => {
    const addr = server.address();
    const bind =
      typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    logger.info(`Express server started on ${bind}`);
  });

  // const io = require("./socket").init(server);
  // io.on("connection", socket => {
  //   console.log("WebSocket Client connected");
  // });
});
