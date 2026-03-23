import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import mongoose from "mongoose";
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import { fileURLToPath } from 'url';
import path from 'path';

import logger from './src/logger/logger.js';
import config from './src/config/config.js';
import { connectDB } from "./src/db.js";
import User from "./src/models/User.js";

// Middleware
import { requestLogger } from './src/middleware/logging/requestLogger.js';
import { responseLogger } from './src/middleware/logging/responseLogger.js';
import { antiInjection } from './src/middleware/security/antiInjection.js';
import { errorHandler } from './src/middleware/error/errorHandler.js';
import { verifyApiKey } from "./src/middleware/auth/verifyApiKey.js";


// Routes
import autorRoutes from './src/routes/autorRoutes.js';
import poezieRoutes from './src/routes/poezieRoutes.js';
import cautareRoutes from './src/routes/cautareRoutes.js';
import poetiRoutes from './src/routes/poetiRoutes.js';
import authRoutes from './src/routes/auth.js';
import webhookRoutes from './src/routes/webhook.js';
import createCheckoutRouter from './src/routes/createCheckout.js';


// Fix dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// AICI trebuie să fie definit app
const app = express();
app.use("/", webhookRoutes);  

app.use(express.static("public"));   // 1. Servește HTML-ul
app.use(express.json());             // 2. Body parser
app.use(cors({ origin: config.corsOrigin, methods: ["GET", "POST"] }));

// app.use("/", webhookRoutes);         // 3. Webhook
app.use("/", createCheckoutRouter);  // 4. Checkout session

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });



// Logging
app.use(requestLogger);
app.use(responseLogger);

// Security
app.use(antiInjection);
app.use(compression());
app.use(rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    handler: (req, res) => {
        logger.warn('Rate limit exceeded', { ip: req.ip, path: req.originalUrl });
        res.status(429).json({ mesaj: "Prea multe cereri. Încearcă mai târziu." });
    }
}));


// AICI adaugi ruta de autentificare
app.use("/auth", authRoutes);

// Routes existente
app.use("/autor", verifyApiKey, autorRoutes);
app.use("/poezie", verifyApiKey, poezieRoutes);
app.use("/cauta", verifyApiKey, cautareRoutes);
app.use("/poeti", verifyApiKey, poetiRoutes);

// Health check
app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        version: "1.0.0"
    });
});

// Global error handler
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
    logger.info(`Server pornit pe portul ${config.port} în modul ${config.env}`);
});
