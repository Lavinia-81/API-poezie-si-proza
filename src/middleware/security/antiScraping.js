// src/middleware/security/antiScraping.js
import rateLimit from "express-rate-limit";

const suspiciousUserAgents = [
  /python/i,
  /curl/i,
  /wget/i,
  /scrapy/i,
  /bot/i,
  /spider/i,
  /crawler/i
];

const recentRequests = new Map();

export function antiScraping(req, res, next) {
  const ip = req.ip;
  const ua = req.headers["user-agent"] || "";
  const now = Date.now();

  // 1. Block suspicious User-Agents
  if (suspiciousUserAgents.some(pattern => pattern.test(ua))) {
    return res.status(403).json({ error: "Scraping tools are not allowed" });
  }

  // 2. Detect extremely fast repeated requests
  const last = recentRequests.get(ip);
  if (last && now - last < 150) {
    return res.status(429).json({ error: "Too many requests" });
  }
  recentRequests.set(ip, now);

  // 3. Block missing headers typical for bots
  // if (!req.headers["accept-language"] || !req.headers["referer"]) {
  //   // Allow your frontend, block others
  //   if (!req.headers["referer"]?.includes(process.env.FRONTEND_URL)) {
  //     return res.status(403).json({ error: "Suspicious request blocked" });
  //   }
  // }

  next();
}

// 4. Optional: route-level rate limiter for text-heavy endpoints
export const textLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: "Too many text requests" }
});