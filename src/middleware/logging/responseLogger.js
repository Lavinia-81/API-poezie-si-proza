// src/middleware/logging/responseLogger.js
import logger from "../../logger/logger.js";

export function responseLogger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    try {
      const duration = Date.now() - start;

      // Sanitize URL
      const safeUrl =
        typeof req.originalUrl === "string"
          ? req.originalUrl.replace(/[\u0000-\u001F\u007F]/g, "").slice(0, 500)
          : "unknown";

      logger.info("Response sent", {
        method: req.method,
        path: safeUrl,
        status: res.statusCode,
        duration: `${duration}ms`
      });
    } catch (err) {
      console.error("Response logger failure:", err);
    }
  });

  next();
}