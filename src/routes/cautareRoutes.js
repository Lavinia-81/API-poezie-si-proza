// src/routes/cautareRoutes.js
import express from 'express';
import { validateRequest } from '../middleware/validation/validateRequest.js';
import { cautareSchema } from '../middleware/validation/schemas.js';
import { cautareTitlu } from '../controllers/cautareController.js';
import { cautaGlobal } from "../services/cautareGlobalService.js";
import { planLimiter } from '../middleware/security/planLimiter.js';
import { antiCloning } from "../middleware/security/antiCloning.js";  
import { antiScraping } from "../middleware/security/antiScraping.js";
import { textLimiter } from "../middleware/security/textLimiter.js";
import { verifyApiKey } from "../middleware/auth/verifyApiKey.js";

const router = express.Router();

router.use(antiCloning);
router.use(antiScraping);
router.use(textLimiter);


router.get("/", verifyApiKey, (req, res) => {
  const { text } = req.query;
  const results = cautaGlobal(text);
  res.json(results);
});


router.get(
  "/:autor/:titlu",
  validateRequest({ params: cautareSchema }),
  verifyApiKey,
  cautareTitlu
);


export default router;