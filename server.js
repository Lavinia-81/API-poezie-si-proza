import express from 'express';
import config from './src/config/config.js';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import { fileURLToPath } from 'url';
import path from 'path';
import logger from './src/logger/logger.js';

// Middleware
import { requestLogger } from './src/middleware/logging/requestLogger.js';
import { responseLogger } from './src/middleware/logging/responseLogger.js';
import { antiInjection } from './src/middleware/security/antiInjection.js';
import { errorHandler } from './src/middleware/error/errorHandler.js';

// Routes
import autorRoutes from './src/routes/autorRoutes.js';
import poezieRoutes from './src/routes/poezieRoutes.js';
import cautareRoutes from './src/routes/cautareRoutes.js';
import poetiRoutes from './src/routes/poetiRoutes.js';

// Fix dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Logging
app.use(requestLogger);
app.use(responseLogger);

// Security
app.use(antiInjection);
app.use(compression());
app.use(cors({ origin: config.corsOrigin, methods: ["GET"] }));

app.use(rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    handler: (req, res) => {
        logger.warn('Rate limit exceeded', { ip: req.ip, path: req.originalUrl });
        res.status(429).json({ mesaj: "Prea multe cereri. Încearcă mai târziu." });
    }
}));

// Routes
app.use('/autor', autorRoutes);
app.use('/poezie', poezieRoutes);
app.use('/cauta', cautareRoutes);
app.use('/poeti', poetiRoutes);



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