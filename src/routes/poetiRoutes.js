// src/routes/poetiRoutes.js
import express from 'express';
import { listaPoeti } from '../controllers/poetiController.js';
import { verifyApiKey } from '../middleware/auth/verifyApiKey.js';
// import { antiCloning } from "../middleware/security/antiCloning.js";   // TEMPORAR dezactivat pentru testare
import { antiScraping } from "../middleware/security/antiScraping.js";
import { textLimiter } from "../middleware/security/textLimiter.js";


const router = express.Router();

router.use(antiCloning);
router.use(antiScraping);
router.use(textLimiter);

router.get(
  '/',
  verifyApiKey,
  listaPoeti);

export default router;
