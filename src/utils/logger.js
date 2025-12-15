const { createLogger, format, transports } = require("winston");

const { app } = require("../config/env");

const isProduction = app.nodeEnv === "production";

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: !isProduction }),
    format.json()
  ),
  transports: [new transports.Console()],
});

module.exports = logger;
