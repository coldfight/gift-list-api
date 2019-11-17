/**
 * Setup the winston logger.
 *
 * Documentation: https://github.com/winstonjs/winston
 */

const winston = require("winston");

// Import Functions
const { createLogger, format, transports } = winston;
const { File, Console } = transports;

// Init Logger
const wintstonLogger = createLogger({
  level: "info"
});

/**
 * For production write to all logs with level `info` and below
 * to `combined.log. Write all logs error (and below) to `error.log`.
 * For development, print to the console.
 */
if (process.env.NODE_ENV === "production") {
  const fileFormat = format.combine(format.timestamp(), format.json());
  const errTransport = new File({
    filename: "./logs/error.log",
    format: fileFormat,
    level: "error"
  });
  const infoTransport = new File({
    filename: "./logs/combined.log",
    format: fileFormat
  });
  wintstonLogger.add(errTransport);
  wintstonLogger.add(infoTransport);
} else if (process.env.NODE_ENV === "testing") {
  const consoleTransport = new Console({
    silent: true
  });
  wintstonLogger.add(consoleTransport);
} else {
  const errorStackFormat = format(info => {
    if (info.stack) {
      console.log(info.stack);
      return false;
    }
    return info;
  });
  const consoleTransport = new Console({
    format: format.combine(
      format.colorize(),
      format.simple(),
      errorStackFormat()
    )
  });
  wintstonLogger.add(consoleTransport);
}

// Export logger
module.exports = wintstonLogger;
