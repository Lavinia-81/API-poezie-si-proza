// validators.js

// Validare email (strict, fără caractere suspecte)
export function validateEmail(email) {
  if (typeof email !== "string") return false;

  // Regex simplu, sigur și suficient pentru validare generală
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email.trim());
}

// Validare plan (doar valorile permise)
export function validatePlan(plan) {
  const allowedPlans = ["basic", "premium"];

  return allowedPlans.includes(plan);
}

// Validare API key (format sigur, fără caractere periculoase)
export function validateApiKey(key) {
  if (typeof key !== "string") return false;

  // Acceptă doar litere, cifre și liniuțe — nimic executabil
  const apiKeyRegex = /^[A-Za-z0-9\-]{20,100}$/;

  return apiKeyRegex.test(key);
}

// Middleware Express pentru validarea emailului
export function requireValidEmail(req, res, next) {
  const email = req.body.email || req.params.email;

  if (!validateEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  next();
}

// Middleware Express pentru validarea planului
export function requireValidPlan(req, res, next) {
  const { plan } = req.body;

  if (!validatePlan(plan)) {
    return res.status(400).json({ error: "Invalid plan" });
  }

  next();
}

// Middleware Express pentru validarea API key-ului
export function requireValidApiKey(req, res, next) {
  const key = req.headers["x-api-key"];

  if (!validateApiKey(key)) {
    return res.status(401).json({ error: "Invalid or missing API key" });
  }

  next();
}