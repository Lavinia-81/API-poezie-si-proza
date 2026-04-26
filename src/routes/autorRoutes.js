// src/routes/autorRoutes.js
import express from 'express';
import { validateRequest } from '../middleware/validation/validateRequest.js';
// import { verifyApiKey } from "../middleware/auth/verifyApiKey.js";// TEMPORAR dezactivat pentru testare
import { autorSchema, idSchema } from '../middleware/validation/schemas.js';
// import { antiCloning } from "../middleware/security/antiCloning.js"; // TEMPORAR dezactivat pentru testare
// import { antiScraping } from "../middleware/security/antiScraping.js";// TEMPORAR dezactivat pentru testare
// import { textLimiter } from "../middleware/security/textLimiter.js";// TEMPORAR dezactivat pentru testare
import {
    poeziiAutor,
    prozaAutor,
    bibliografieText,
    pozaAutor,
    poezieText,
    prozaText
} from '../controllers/autorController.js';

const router = express.Router();
// router.use(antiCloning);


router.get(
  '/:autor/poezii',
  validateRequest({ params: autorSchema }),
  // verifyApiKey,
  // antiCloning,
  // antiScraping,
  // textLimiter,
  poeziiAutor
);

router.get(
  '/:autor/proza',
  validateRequest({ params: autorSchema }),
  // verifyApiKey,
  // antiCloning,
  // antiScraping,
  // textLimiter,
  prozaAutor
);

router.get(
  '/:autor/poezie/:id/text',
  validateRequest({ params: idSchema }),
  // verifyApiKey,
  // antiCloning,
  // antiScraping,
  // textLimiter,
  poezieText
);

router.get(
  '/:autor/proza/:id/text',
  validateRequest({ params: idSchema }),
  // verifyApiKey,
  // antiCloning,
  // antiScraping,
  // textLimiter,
  prozaText
);

router.get(
  '/:autor/bibliografie/text',
  validateRequest({ params: autorSchema }),
  // verifyApiKey,
  // antiCloning,
  // antiScraping,
  // textLimiter,
  bibliografieText
);

router.get(
  '/:autor/poza',
  validateRequest({ params: autorSchema }),
  // verifyApiKey,
  // antiCloning,
  // antiScraping,
  // textLimiter,
  pozaAutor
);

router.get(
  '/:autor/poezie/:id',
  validateRequest({ params: idSchema }),
  // verifyApiKey,
  // antiCloning,
  // antiScraping,
  // textLimiter,
  poezieText
);

router.get(
  '/:autor/proza/:id',
  validateRequest({ params: idSchema }),
  // verifyApiKey,
  // antiCloning,
  // antiScraping,
  // textLimiter,
  prozaText
);


router.get(
  '/:autor',
  validateRequest({ params: autorSchema }),
  async (req, res, next) => {
    try {
      const { autor } = req.params;

      // Normalizează numele autorului (spații, diacritice)
      const normalized = autor.replace(/%20/g, ' ');

      // Construiește path-ul către JSON
      const filePath = `../../data/${normalized}/${normalized}.json`;

      // Încarcă JSON-ul
      const json = await import(filePath, {
        assert: { type: "json" }
      });

      res.json(json.default || json);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
