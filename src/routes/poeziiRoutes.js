import express from 'express';
import * as poeziiController from '../controllers/poeziiController.js';
import { validateRequest } from '../middleware/validation/validateRequest.js';
import { idSchema } from '../middleware/validation/schemas.js';
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
  antiCloning,
  antiScraping,
  textLimiter,
  poeziiController.getAll
);

router.get(
  '/:id',
  verifyApiKey,
  antiCloning,
  antiScraping,
  textLimiter,
  validateRequest({ params: idSchema }),
  poeziiController.getById
);

export default router;