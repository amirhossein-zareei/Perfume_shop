const { createLogger, format, transports } = require("winston");
const path = require("path");

const { app } = require("./env");

const isProduction = app.mode === "production";

const logger = createLogger({
  level: "info",

  format: format.combine(
    format.timestamp(),
    format.errors({ stack: !isProduction }),
    format.json()
  ),

  transports: [
    new transports.File({
      filename: path.join(__dirname, "../../logs/error.log"),
      level: "error",
    }),

    new transports.File({
      filename: path.join(__dirname, "../../logs/combine.log"),
    }),
  ],
});

if (!isProduction) {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple(),
        format.prettyPrint()
      ),
    })
  );
}

module.exports = logger;
