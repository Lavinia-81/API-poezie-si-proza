// src/routes/autorRoutes.js
import express from 'express';
import { loadAutorData } from '../utils/loadAutorData.js';
import { validateRequest } from '../middleware/validation/validateRequest.js';
// import { verifyApiKey } from "../middleware/auth/verifyApiKey.js";// TEMPORAR dezactivat pentru testare
import { autorSchema, idSchema } from '../middleware/validation/schemas.js';
import { planLimiter } from '../middleware/security/planLimiter.js';
// import { antiCloning } from "../middleware/security/antiCloning.js"; // TEMPORAR dezactivat pentru testare
// import { antiScraping } from "../middleware/security/antiScraping.js";// TEMPORAR dezactivat pentru testare
// import { textLimiter } from "../middleware/security/textLimiter.js";// TEMPORAR dezactivat pentru testare
import {
    poeziiAutor,
    prozaAutor,
    bibliografieText,
    pozaAutor,
    poezieText,
    prozaText,
    itemById
} from '../controllers/autorController.js';

const router = express.Router();
// router.use(antiCloning);


// METADATE AUTOR
router.get(
  '/:autor',
  validateRequest({ params:  autorSchema }),
  (req, res) => {
    const autorRaw = req.params.autor;
    const data = loadAutorData(autorRaw);
    if (!data) return res.status(404).json({ message: "Author not found" });
    res.json(data);
  }
);



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
  itemById
);

router.get(
  '/:autor/proza/:id',
  validateRequest({ params: idSchema }),
  // verifyApiKey,
  // antiCloning,
  // antiScraping,
  // textLimiter,
  itemById
);


export default router;
