// src/routes/cautareRoutes.js
import express from 'express';
import { validateRequest } from '../middleware/validation/validateRequest.js';
import { cautareSchema } from '../middleware/validation/schemas.js';
import { cautareTitlu } from '../controllers/cautareController.js';
// import { antiCloning } from "../middleware/security/antiCloning.js";   // TEMPORAR dezactivat pentru testare
import { antiScraping } from "../middleware/security/antiScraping.js";
import { textLimiter } from "../middleware/security/textLimiter.js";
import { verifyApiKey } from "../middleware/auth/verifyApiKey.js";

const router = express.Router();

router.use(antiCloning);
router.use(antiScraping);
router.use(textLimiter);

router.get(
  '/:autor/:titlu',
  validateRequest({ params: cautareSchema }),
  verifyApiKey,
  // antiCloning,
  antiScraping,
  textLimiter,
  cautareTitlu
);

export default router;