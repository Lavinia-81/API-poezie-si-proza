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

import autorRoutes from "./src/routes/autorRoutes.js";
import poezieRoutes from "./src/routes/poezieRoutes.js";
import cautareRoutes from "./src/routes/cautareRoutes.js";
import poetiRoutes from "./src/routes/poetiRoutes.js";
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
const app = express();
dotenv.config();
app.use("/docs", express.static(path.join(__dirname, "docs")));
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

// -----------------------------------------------------
// 8. Static files (după Helmet, înainte de rute)
// -----------------------------------------------------
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, "public")));
app.use("/docs", express.static(path.join(__dirname, "docs")));

// -----------------------------------------------------
// 9. Stripe webhook (raw body)
// -----------------------------------------------------
app.use(
  "/webhook",
  express.raw({ type: "application/json" }),
  webhookRoutes
);

// -----------------------------------------------------
// 10. Routes
// -----------------------------------------------------
app.use("/", createCheckoutRouter);
app.use("/auth", authRoutes);

app.use("/", verifyApiKey, autorRoutes);
app.use("/autor", verifyApiKey, autorRoutes);
app.use("/poezii", verifyApiKey, autorRoutes);
app.use("/poezie", verifyApiKey, poezieRoutes);
app.use("/proza", verifyApiKey, autorRoutes);
app.use("/bibliografie", verifyApiKey, autorRoutes);
app.use("/poza", verifyApiKey, autorRoutes);
app.use("/cauta", verifyApiKey, cautareRoutes);
app.use("/poeti", verifyApiKey, poetiRoutes);

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