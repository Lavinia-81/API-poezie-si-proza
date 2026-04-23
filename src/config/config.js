// config/config.js
import dotenv from "dotenv";
// Helper to sanitize env strings
function cleanEnv(value, fallback) {
  if (!value || typeof value !== "string") return fallback;
  return value.replace(/[\u0000-\u001F\u007F]/g, "").trim();
}

dotenv.config(); // Load .env file

// Safe number parser
function cleanNumber(value, fallback) {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? num : fallback;
}

const config = {
  env: cleanEnv(process.env.NODE_ENV, "development"),

  port: cleanNumber(process.env.PORT, 3000),

  corsOrigin: cleanEnv(process.env.CORS_ORIGIN, "https://yourdomain.com"), // <= domeniul tau aici

  rateLimit: {
    windowMs: cleanNumber(process.env.RATE_LIMIT_WINDOW_MS, 60000),
    max: cleanNumber(process.env.RATE_LIMIT_MAX, 100)
  }
};

// Freeze to prevent accidental mutation
export const PLAN_LIMITS = Object.freeze({
  free: 500,
  basic: 5000,
  premium: 50000
});

export default config;