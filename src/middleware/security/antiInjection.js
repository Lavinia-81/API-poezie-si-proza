// src/middleware/security/antiInjection.js
import logger from "../../logger/logger.js";
import { AppError } from "../error/errorTypes.js";

// Patterns that indicate *real* injection attempts
const dangerousPatterns = [
  /\$where\b/i,
  /\$regex\b/i,
  /\$ne\b/i,
  /\$gt\b/i,
  /\$lt\b/i,
  /<script.*?>/i,
  /<\/script>/i
];

export function antiInjection(req, res, next) {
  try {
    // Combine all inputs safely
    let allInputs = JSON.stringify({
      params: req.params,
      query: req.query,
      body: req.body
    });

    // Limit size to prevent DoS
    if (allInputs.length > 5000) {
      throw new AppError("Suspiciously large input", 400, "INPUT_TOO_LARGE");
    }

    // Normalize unicode (prevents bypass)
    allInputs = allInputs.normalize("NFKC");

    // Remove null bytes
    allInputs = allInputs.replace(/\0/g, "");

    // Scan for dangerous patterns
    for (const pattern of dangerousPatterns) {
      if (pattern.test(allInputs)) {
        logger.warn("Blocked suspicious input", {
          ip: req.ip.replace(/[\n\r]/g, ""),
          input: allInputs.slice(0, 500) // prevent log flooding
        });

        throw new AppError("Suspicious input detected", 400, "INJECTION_DETECTED");
      }
    }

    next();
  } catch (err) {
    next(err);
  }
}