// src/middleware/validation/validateRequest.js
import { z } from "zod";
import { AppError } from "../error/errorTypes.js";
import logger from "../../logger/logger.js";

export function validateRequest(schemas) {
  return (req, res, next) => {
    try {
      // Limit total input size (prevents DoS)
      const totalSize = JSON.stringify({
        params: req.params,
        query: req.query,
        body: req.body
      }).length;

      if (totalSize > 5000) {
        throw new AppError("Input too large", 400, "INPUT_TOO_LARGE");
      }

      if (schemas.params) {
        schemas.params.parse({ ...req.params });
      }

      if (schemas.query) {
        schemas.query.parse({ ...req.query });
      }

      if (schemas.body) {
        schemas.body.parse({ ...req.body });
      }

      next();

    } catch (err) {
      // Log validation error safely
      logger.warn("Validation failed", {
        error: err?.issues || err?.message || "Unknown validation error",
        path: req.originalUrl.slice(0, 200),
        ip: req.ip.replace(/[\n\r]/g, "")
      });

      throw new AppError("Invalid input", 400, "VALIDATION_ERROR");
    }
  };
}
