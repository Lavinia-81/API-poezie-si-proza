// src/middleware/error/errorTypes.js

export class AppError extends Error {
  constructor(message, statusCode = 500, internalCode = "INTERNAL_ERROR") {
    // Sanitize message to avoid log injection
    const safeMessage =
      typeof message === "string" ? message.slice(0, 300) : "Unknown error";

    super(safeMessage);

    // Proper error name
    this.name = this.constructor.name;

    // Sanitize internal code
    this.internalCode =
      typeof internalCode === "string"
        ? internalCode.replace(/[^A-Z0-9_]/g, "").slice(0, 50)
        : "INTERNAL_ERROR";

    this.statusCode = Number(statusCode) || 500;

    // Capture stack trace correctly
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}