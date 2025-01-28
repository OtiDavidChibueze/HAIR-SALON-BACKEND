import { createLogger, format, transports } from "winston";

export const Logger = createLogger({
  level: "info",

  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.splat(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp} ${level}: ${message}`;
    })
  ),

  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ timestamp, level, message }) => {
          return `[${timestamp} ${level}: ${message} `;
        })
      ),
    }),
    new transports.File({
      filename: "server.log",
    }),
  ],

  exceptionHandlers: [
    new transports.File({
      filename: "exceptions.log",
    }),
  ],

  exitOnError: false,
});

process.on("unhandledRejection", (reason) => {
  Logger.error("UnhandledRejection:", reason);
});
