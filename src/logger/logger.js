// src/logger/logger.js
import winston from "winston";
import "winston-daily-rotate-file";
import config from "../config/config.js";

// Sanitize log messages to prevent log injection
const sanitize = winston.format((info) => {
  if (typeof info.message === "string") {
    info.message = info.message.replace(/[\u0000-\u001F\u007F]/g, "").slice(0, 2000);
  }
  return info;
});

// Production JSON format
const prodFormat = winston.format.combine(
  sanitize(),
  winston.format.timestamp(),
  winston.format.json()
);

// Development console format
const devFormat = winston.format.combine(
  sanitize(),
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.printf(({ level, message, timestamp, ...meta }) => {
    const metaString = Object.keys(meta).length ? JSON.stringify(meta) : "";
    return `${timestamp} [${level}] ${message} ${metaString}`;
  })
);

// General logs
const appTransport = new winston.transports.DailyRotateFile({
  filename: "logs/app-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "14d",
  maxSize: "20m",
  level: "info"
});

// Error logs
const errorTransport = new winston.transports.DailyRotateFile({
  filename: "logs/error-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "30d",
  maxSize: "20m",
  level: "error"
});

// Security logs
const securityTransport = new winston.transports.DailyRotateFile({
  filename: "logs/security-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "60d",
  maxSize: "20m",
  level: "warn"
});

const logger = winston.createLogger({
  level: "info",
  format: config.env === "production" ? prodFormat : devFormat,
  transports: [
    appTransport,
    errorTransport,
    securityTransport,
    new winston.transports.Console({ level: "info" })
  ],
  exitOnError: false // prevents crashes
});

export default logger;