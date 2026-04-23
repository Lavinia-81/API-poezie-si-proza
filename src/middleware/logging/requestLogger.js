// src/middleware/logging/requestLogger.js
import logger from "../../logger/logger.js";

export function requestLogger(req, res, next) {
  try {
    // Sanitize URL
    const safeUrl =
      typeof req.originalUrl === "string"
        ? req.originalUrl.replace(/[\u0000-\u001F\u007F]/g, "").slice(0, 500)
        : "unknown";

    // Sanitize IP
    const safeIp =
      typeof req.ip === "string"
        ? req.ip.replace(/[\n\r\t]/g, "").slice(0, 100)
        : "unknown";

    logger.info("Incoming request", {
      method: req.method,
      path: safeUrl,
      ip: safeIp
    });
  } catch (err) {
    console.error("Request logger failure:", err);
  }

  next();
}