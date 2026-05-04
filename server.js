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
import { trackUsage } from "./src/middleware/trackUsage.js";

import autorRoutes from "./src/routes/autorRoutes.js";
import poetiRoutes from "./src/routes/poetiRoutes.js";
import cautareRoutes from "./src/routes/cautareRoutes.js";
import authRoutes from "./src/routes/auth.js";
import webhookRoutes from "./src/routes/webhook.js";
import createCheckoutRouter from "./src/routes/createCheckout.js";

// -----------------------------------------------------
// Setup dirname
// -----------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -----------------------------------------------------
// Initialize app
// -----------------------------------------------------

dotenv.config();
const app = express();
app.use("/webhook", webhookRoutes);

app.use("/docs", express.static(path.join(__dirname, "docs")));
app.use(express.static(path.join(__dirname, "public")));
// -----------------------------------------------------
// Helmet + CSP (MUST BE FIRST!)
// -----------------------------------------------------

applySecurity(app);

// -----------------------------------------------------
// Security middlewares
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
// Body parsers
// -----------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -----------------------------------------------------
// CORS (just one instance)
// -----------------------------------------------------
// app.use(
//   cors({
//     origin: config.corsOrigin,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "x-api-key"],
//   })
// );
// CORS — trebuie să fie înainte de orice alt middleware

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://api-poezie-si-proza.onrender.com"
  ],
  methods: ["GET"],
  allowedHeaders: ["Content-Type", "x-api-key"]
}));




// -----------------------------------------------------
// Logging
// -----------------------------------------------------
app.use(requestLogger);
app.use(responseLogger);

// -----------------------------------------------------
// Routes
// -----------------------------------------------------

app.use("/", createCheckoutRouter);
app.use("/auth", authRoutes)

app.use("/cauta-global", trackUsage, cautareRoutes);
app.use("/autor", trackUsage, autorRoutes);
app.use("/poeti", trackUsage, poetiRoutes);
app.use("/cauta", trackUsage, cautareRoutes);


// -----------------------------------------------------
//  Static files (after Helmet, before the rutes)
// -----------------------------------------------------
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, "public")));

// -----------------------------------------------------
// Health check
// -----------------------------------------------------
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// -----------------------------------------------------
// Global error handler
// -----------------------------------------------------
app.use(errorHandler);

app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  res.status(204).end(); 
});

// -----------------------------------------------------
// Start server
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