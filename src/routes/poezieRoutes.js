import express from 'express';
import { poezieVersuri, poezieText } from '../controllers/poezieController.js';
import { validateRequest } from '../middleware/validation/validateRequest.js';
import { autorSchema, idSchema } from '../middleware/validation/schemas.js';
import { verifyApiKey } from '../middleware/auth/verifyApiKey.js';
// import { antiCloning } from "../middleware/security/antiCloning.js";   // TEMPORAR dezactivat pentru testare
import { antiScraping } from "../middleware/security/antiScraping.js";
import { textLimiter } from "../middleware/security/textLimiter.js";

const router = express.Router();

router.use(antiCloning);
router.use(antiScraping);
router.use(textLimiter);


router.get(
  '/:autor/:id/versuri',
  verifyApiKey,
  antiCloning,
  antiScraping,
  textLimiter,
  validateRequest({ params: { autor: autorSchema, id: idSchema } }),
  poezieVersuri
);

router.get(
  '/:autor/:id/text',
  verifyApiKey,
  antiCloning,
  antiScraping,
  textLimiter,
  validateRequest({ params: { autor: autorSchema, id: idSchema } }),
  poezieText
);

export default router;