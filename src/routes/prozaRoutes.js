import express from 'express';
import * as prozaController from '../controllers/prozaController.js';
import { validateRequest } from '../middleware/validation/validateRequest.js';
import { idSchema } from '../middleware/validation/schemas.js';
import { verifyApiKey } from '../middleware/auth/verifyApiKey.js';
import { antiCloning } from "../middleware/security/antiCloning.js";
import { antiScraping } from "../middleware/security/antiScraping.js";
import { textLimiter } from "../middleware/security/textLimiter.js";


const router = express.Router();
router.use(antiCloning);
router.use(antiScraping);
router.use(textLimiter);

router.get(
  '/',
  verifyApiKey,
  antiCloning,
  antiScraping,
  textLimiter,
  prozaController.getAll
);

router.get(
  '/:id',
  verifyApiKey,
  antiCloning,
  antiScraping,
  textLimiter,
  validateRequest({ params: idSchema }),
  prozaController.getById
);

export default router;