// src/middleware/security/textLimiter.js
import rateLimit from "express-rate-limit";

// 1. Creăm limiterele O SINGURĂ DATĂ
const freeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 2,
  message: { error: "Free plan limit reached. Slow down." },
  standardHeaders: true,
  legacyHeaders: false
});

const basicLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: "Basic plan limit reached. Slow down." },
  standardHeaders: true,
  legacyHeaders: false
});

const premiumLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: "Premium plan limit reached. Slow down." },
  standardHeaders: true,
  legacyHeaders: false
});

// 2. Middleware-ul doar alege limiterul potrivit
export function textLimiter(req, res, next) {
  const plan = req.user?.plan?.toLowerCase() || "free";

  switch (plan) {
    case "premium":
      return premiumLimiter(req, res, next);
    case "basic":
      return basicLimiter(req, res, next);
    default:
      return freeLimiter(req, res, next);
  }
}