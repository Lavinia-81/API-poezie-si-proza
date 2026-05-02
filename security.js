// security.js
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

export function applySecurity(app) {
  // 1. HTTP security headers (XSS, clickjacking, sniffing etc.)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],

        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdn.redoc.ly",
          "https://cdnjs.cloudflare.com",
          "https://unpkg.com",
          "https://petstore.swagger.io"
        ],

        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
          "https://unpkg.com"
        ],

        imgSrc: [
          "'self'",
          "data:",
          "https:",
          "https://cdn.redoc.ly"
        ],

        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com"
        ],

        workerSrc: [
          "'self'",
          "blob:"
        ],

        connectSrc: [
          "'self'",
          "https://cdn.redoc.ly",
          "https://unpkg.com"
        ],

        childSrc: [
          "'self'",
          "blob:"
        ]
      }
    }

  })
);

  // 2. CORS – permite doar originile tale (ajustează după nevoie)
  app.use(cors({
    origin: [
      "http://poezie-si-proza.ro",
      "http://localhost:3000",
      "http://localhost:5173"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "x-api-key"],
  }));

  // 3. Rate limiting – protecție împotriva abuzului pe API
  const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minut
    max: 60,             // max 60 request-uri / minut / IP
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use("/auth", apiLimiter);
  app.use("/api", apiLimiter);

  // 4. Dezactivăm header-ul X-Powered-By (ascunde stack-ul)
  app.disable("x-powered-by");
}

