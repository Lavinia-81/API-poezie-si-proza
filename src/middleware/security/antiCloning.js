// // src/middleware/security/antiCloning.js

// const clonePatterns = [
//   /postman/i,
//   /insomnia/i,
//   /openapi/i,
//   /swagger/i,
//   /harvest/i,
//   /collector/i,
//   /scan/i,
//   /mapping/i
// ];

// const routeAccessHistory = new Map();
// const OWNER_IP = process.env.OWNER_IP;

// export function antiCloning(req, res, next) {
//   const ip = req.ip;
//   const ua = req.headers["user-agent"] || "";
//   const now = Date.now();

//   //  0. Permitem Swagger/OpenAPI DOAR pentru tine sau pentru userii premium
//   const user = req.user;
//   const isPremium = user?.plan === "premium";
//   const isOwner = ip === OWNER_IP;

//   const isSwagger = clonePatterns.some(p => p.test(ua));

//   if (isSwagger) {
//     if (!isPremium && !isOwner) {
//       return res.status(403).json({
//         error: "Swagger/OpenAPI allowed only for Premium users",
//         code: "SWAGGER_PREMIUM_ONLY"
//       });
//     }
//     // dacă e premium sau owner → permitem
//   }

//   // 🔥 1. Detect tools used for API cloning (Postman, Insomnia, scanners)
//   // DAR permitem Swagger dacă e premium sau owner
//   if (isSwagger === false && clonePatterns.some(p => p.test(ua))) {
//     return res.status(403).json({
//       error: "Automated API mapping tools are not allowed",
//       code: "API_CLONING_DETECTED"
//     });
//   }

//   // 🔥 2. Detect sequential route scanning
//   const history = routeAccessHistory.get(ip) || [];
//   history.push({ route: req.path, time: now });

//   if (history.length > 20) history.shift();
//   routeAccessHistory.set(ip, history);

//   const recent = history.filter(h => now - h.time < 5000);
//   const uniqueRoutes = new Set(recent.map(h => h.route));

//   if (uniqueRoutes.size > 10) {
//     return res.status(429).json({
//       error: "Suspicious route scanning detected",
//       code: "API_STRUCTURE_PROBING"
//     });
//   }

//   // 🔥 3. Detect enumeration of IDs
//   if (req.params?.id && /^\d+$/.test(req.params.id)) {
//     const last = history[history.length - 2];
//     if (last && last.route.includes("/:id")) {
//       const prevId = parseInt(last.route.split("/").pop());
//       const currId = parseInt(req.params.id);

//       if (currId === prevId + 1) {
//         return res.status(429).json({
//           error: "Sequential ID enumeration blocked",
//           code: "API_ENUMERATION"
//         });
//       }
//     }
//   }

//   next();
// }