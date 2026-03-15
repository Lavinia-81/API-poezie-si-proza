// src/routes/autorRoutes.js
import express from 'express';
import { validateRequest } from '../middleware/validation/validateRequest.js';
import { autorSchema, idSchema } from '../middleware/validation/schemas.js';
import {
    poeziiAutor,
    prozaAutor,
    itemById,
    bibliografieText,
    pozaAutor,
    poezieText 
} from '../controllers/autorController.js';

const router = express.Router();

// Toate poeziile unui autor
router.get(
    '/:autor/poezii',
    validateRequest({ params: autorSchema }),
    poeziiAutor
);

// Toată proza unui autor
router.get(
    '/:autor/proza',
    validateRequest({ params: autorSchema }),
    prozaAutor
);

// Căutare după ID (poezie sau proză)
router.get(
    '/:autor/poezie/:id/text',
    validateRequest({ params: idSchema }),
    poezieText);

// Bibliografie text
router.get(
    '/:autor/bibliografie/text',
    validateRequest({ params: autorSchema }),
    bibliografieText
);

// Poza autorului
router.get(
    '/:autor/poza',
    validateRequest({ params: autorSchema }),
    pozaAutor
);

export default router;