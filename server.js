// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";
import compression from "compression";
import { fileURLToPath } from "url";
import path from "path";

import { applySecurity } from "./security.js";

import logger from "./src/logger/logger.js";
import config from "./src/config/config.js";
import { connectDB } from "./src/db.js";

import { requestLogger } from "./src/middleware/logging/requestLogger.js";
import { responseLogger } from "./src/middleware/logging/responseLogger.js";
import { antiInjection } from "./src/middleware/security/antiInjection.js";
import { errorHandler } from "./src/middleware/error/errorHandler.js";
import { verifyApiKey } from "./src/middleware/auth/verifyApiKey.js";
import { antiCloning } from "./src/middleware/security/antiCloning.js";

import autorRoutes from "./src/routes/autorRoutes.js";
import poetiRoutes from "./src/routes/poetiRoutes.js";
import cautareRoutes from "./src/routes/cautareRoutes.js";
import authRoutes from "./src/routes/auth.js";
import webhookRoutes from "./src/routes/webhook.js";
import createCheckoutRouter from "./src/routes/createCheckout.js";

// -----------------------------------------------------
// 1. Setup dirname
// -----------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -----------------------------------------------------
// 2. Initialize app
// -----------------------------------------------------

dotenv.config();
const app = express();
app.use("/webhook", webhookRoutes);

app.use("/docs", express.static(path.join(__dirname, "docs")));
app.use(express.static(path.join(__dirname, "public")));
// -----------------------------------------------------
// 3. Helmet + CSP (MUST BE FIRST!)
// -----------------------------------------------------

applySecurity(app);

// -----------------------------------------------------
// 4. Security middlewares
// -----------------------------------------------------
app.use(antiInjection);
app.use(compression());
app.use(
  rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    handler: (req, res) => {
      logger.warn("Rate limit exceeded", {
        ip: req.ip,
        path: req.originalUrl,
      });
      res
        .status(429)
        .json({ mesaj: "Rate limit exceeded. Try again later." });
    },
  })
);

// -----------------------------------------------------
// 5. Body parsers
// -----------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -----------------------------------------------------
// 6. CORS (o singură instanță)
// -----------------------------------------------------
app.use(
  cors({
    origin: config.corsOrigin,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "x-api-key"],
  })
);

// -----------------------------------------------------
// 7. Logging
// -----------------------------------------------------
app.use(requestLogger);
app.use(responseLogger);

// redoc docs - disponibil pentru toți utilizatorii cu API key valid
// app.get("/docs/redoc", verifyApiKey, (req, res) => {
//   res.sendFile(path.join(__dirname, "docs/redoc.html"));
// });

// swagger docs - doar pentru premium, cu anti-cloning
// app.get("/docs/swagger", verifyApiKey, antiCloning, (req, res) => {
//   if (req.user.plan !== "premium") {
//     return res.status(403).send("Swagger is available only for Premium users");
//   }

//   res.sendFile(path.join(__dirname, "docs/swagger.html"));
// });

// -----------------------------------------------------
// 10. Routes
// -----------------------------------------------------
app.use("/", createCheckoutRouter);
app.use("/auth", authRoutes);
app.use("/autor", verifyApiKey, autorRoutes);
app.use("/poeti", verifyApiKey, poetiRoutes);
app.use("/cauta", verifyApiKey, cautareRoutes);

// -----------------------------------------------------
// 8. Static files (după Helmet, înainte de rute)
// -----------------------------------------------------
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, "public")));

// -----------------------------------------------------
// 11. Health check
// -----------------------------------------------------
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// -----------------------------------------------------
// 12. Global error handler
// -----------------------------------------------------
app.use(errorHandler);

app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  res.status(204).end(); // No Content
});

// -----------------------------------------------------
// 13. Start server
// -----------------------------------------------------
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });