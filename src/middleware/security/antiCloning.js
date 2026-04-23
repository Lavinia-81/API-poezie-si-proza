// src/middleware/security/antiCloning.js

const clonePatterns = [
  /postman/i,
  /insomnia/i,
  /openapi/i,
  /swagger/i,
  /harvest/i,
  /collector/i,
  /scan/i,
  /mapping/i
];

const routeAccessHistory = new Map();

export function antiCloning(req, res, next) {
  const ip = req.ip;
  const ua = req.headers["user-agent"] || "";
  const now = Date.now();

  // 1. Detect tools used for API cloning
  if (clonePatterns.some(p => p.test(ua))) {
    return res.status(403).json({
      error: "Automated API mapping tools are not allowed",
      code: "API_CLONING_DETECTED"
    });
  }

  // 2. Detect sequential route scanning
  const history = routeAccessHistory.get(ip) || [];
  history.push({ route: req.path, time: now });

  // Keep only last 20 entries
  if (history.length > 20) history.shift();

  routeAccessHistory.set(ip, history);

  // If user hits 10+ different routes in < 5 seconds → cloning attempt
  const recent = history.filter(h => now - h.time < 5000);
  const uniqueRoutes = new Set(recent.map(h => h.route));

  if (uniqueRoutes.size > 10) {
    return res.status(429).json({
      error: "Suspicious route scanning detected",
      code: "API_STRUCTURE_PROBING"
    });
  }

  // 3. Detect enumeration of IDs (1,2,3,4,5...)
  if (req.params?.id && /^\d+$/.test(req.params.id)) {
    const last = history[history.length - 2];
    if (last && last.route.includes("/:id")) {
      const prevId = parseInt(last.route.split("/").pop());
      const currId = parseInt(req.params.id);

      if (currId === prevId + 1) {
        return res.status(429).json({
          error: "Sequential ID enumeration blocked",
          code: "API_ENUMERATION"
        });
      }
    }
  }

  next();
}