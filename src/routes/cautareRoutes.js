// src/routes/cautareRoutes.js
import express from 'express';
import { validateRequest } from '../middleware/validation/validateRequest.js';
import { cautareSchema } from '../middleware/validation/schemas.js';
import { cautareTitlu } from '../controllers/cautareController.js';
import { cautaGlobal } from "../services/cautareGlobalService.js";
// import { antiCloning } from "../middleware/security/antiCloning.js";   // TEMPORAR dezactivat pentru testare
// import { antiScraping } from "../middleware/security/antiScraping.js";// TEMPORAR dezactivat pentru testare
// import { textLimiter } from "../middleware/security/textLimiter.js";// TEMPORAR dezactivat pentru testare
// import { verifyApiKey } from "../middleware/auth/verifyApiKey.js";// TEMPORAR dezactivat pentru testare

const router = express.Router();

// router.use(antiCloning);
// router.use(antiScraping);
// router.use(textLimiter);

router.get(
  '/autor/:autor/:titlu',
  validateRequest({ params: cautareSchema }),
  // verifyApiKey,
  // antiCloning,
  // antiScraping,
  // textLimiter,
  cautareTitlu
);


router.get("/cauta-global", (req, res) => {
  const { text } = req.query;
  const results = cautaGlobal(text);
  res.json(results);
});


export default router;