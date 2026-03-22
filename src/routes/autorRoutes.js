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
    poezieText,
    prozaText
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

// Căutare poezie după ID si textul acesteia
router.get(
    '/:autor/poezie/:id/text',
    validateRequest({ params: idSchema }),
    poezieText); 

// Căutare proză după ID si textul acesteia
router.get(
  '/:autor/proza/:id/text',
  validateRequest({ params: idSchema }),
  prozaText
);    

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

// Căutare poezii după ID
router.get(
    '/:autor/poezii/:id',
    validateRequest({ params: idSchema }),
    itemById
);

// Căutare proză după ID
router.get(
    '/:autor/proza/:id',
    validateRequest({ params: idSchema }),
    itemById
);

export default router;
