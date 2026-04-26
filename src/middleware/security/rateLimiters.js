// // src/middleware/security/rateLimiters.js
// import rateLimit from "express-rate-limit";
// import logger from "../../logger/logger.js";

// // Custom handler for blocked requests
// function rateLimitHandler(req, res) {
//   logger.warn("Rate limit exceeded", {
//     ip: req.ip.replace(/[\n\r]/g, ""),
//     path: req.originalUrl.slice(0, 200)
//   });

//   res.status(429).json({
//     message: "Too many requests. Please try again later.",
//     code: "RATE_LIMIT_EXCEEDED"
//   });
// }

// // Strict limiter (for sensitive routes)
// export const strictLimiter = rateLimit({
//   windowMs: 60 * 1000,
//   max: 10,
//   standardHeaders: true,
//   legacyHeaders: false,
//   handler: rateLimitHandler,
//   keyGenerator: (req) => req.ip.replace(/[\n\r]/g, "")
// });

// // Medium limiter (for normal routes)
// export const mediumLimiter = rateLimit({
//   windowMs: 60 * 1000,
//   max: 50,
//   standardHeaders: true,
//   legacyHeaders: false,
//   handler: rateLimitHandler,
//   keyGenerator: (req) => req.ip.replace(/[\n\r]/g, "")
// });