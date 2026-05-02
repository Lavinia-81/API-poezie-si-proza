// validators.js

// Validate email (without allowing dangerous characters)
export function validateEmail(email) {
  if (typeof email !== "string") return false;

  // Regex simple for validare email, without suspicious characters
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email.trim());
}

// Validate plan (only "basic" or "premium")
export function validatePlan(plan) {
  const allowedPlans = ["basic", "premium"];

  return allowedPlans.includes(plan);
}

// Validate API key (safe format, no special characters)
export function validateApiKey(key) {
  if (typeof key !== "string") return false;

  // Accept only alphanumeric and dashes, length between 20 and 100 characters
  const apiKeyRegex = /^[A-Za-z0-9\-]{20,100}$/;

  return apiKeyRegex.test(key);
}

// Middleware Express for validate email
export function requireValidEmail(req, res, next) {
  const email = req.body.email || req.params.email;

  if (!validateEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  next();
}

// Middleware Express for validate plan
export function requireValidPlan(req, res, next) {
  const { plan } = req.body;

  if (!validatePlan(plan)) {
    return res.status(400).json({ error: "Invalid plan" });
  }

  next();
}

// Middleware Express for validate API key
export function requireValidApiKey(req, res, next) {
  const key = req.headers["x-api-key"];

  if (!validateApiKey(key)) {
    return res.status(401).json({ error: "Invalid or missing API key" });
  }

  next();
}