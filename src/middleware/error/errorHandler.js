// src/middleware/error/errorHandler.js
import { AppError } from "./errorTypes.js";
import logger from "../../logger/logger.js";
import crypto from "crypto";

export function errorHandler(err, req, res, next) {
  const trackingId = crypto.randomUUID();

  const isAppError = err instanceof AppError;

  const status = isAppError ? err.statusCode : 500;
  const message = isAppError ? err.message : "Internal server error";
  const internalCode = isAppError ? err.internalCode : "INTERNAL_ERROR";

  // Sanitize potentially dangerous fields
  const safeMessage =
    typeof err.message === "string"
      ? err.message.slice(0, 500) // prevent log flooding
      : "Unknown error";

  const safePath =
    typeof req.originalUrl === "string"
      ? req.originalUrl.slice(0, 200)
      : "unknown";

  try {
    logger.error("Error caught by global handler", {
      trackingId,
      internalCode,
      message: safeMessage,
      stack: err.stack,
      path: safePath,
      method: req.method
    });
  } catch (logErr) {
    console.error("Logger failure:", logErr);
  }

  res.status(status).json({
    message,
    code: internalCode,
    trackingId
  });
}

// Global process-level safety
process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Promise Rejection", { reason });
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception", {
    message: err.message,
    stack: err.stack,
    name: err.name,
  });
});