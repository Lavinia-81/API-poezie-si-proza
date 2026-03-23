// src/routes/autorRoutes.js
import express from 'express';
import { validateRequest } from '../middleware/validation/validateRequest.js';
import { verifyApiKey } from "../middleware/auth/verifyApiKey.js";
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
    verifyApiKey,
    validateRequest({ params: autorSchema }),
    poeziiAutor
    );

// Toată proza unui autor
router.get(
    '/:autor/proza',
    verifyApiKey,
    validateRequest({ params: autorSchema }),
    prozaAutor
    );

// Căutare poezie după ID si textul acesteia
router.get(
    '/:autor/poezie/:id/text',
    verifyApiKey,
    validateRequest({ params: idSchema }),
    poezieText
    ); 

// Căutare proză după ID si textul acesteia
router.get(
    '/:autor/proza/:id/text',
    verifyApiKey,
    validateRequest({ params: idSchema }),
    prozaText
    );    

// Bibliografie text
router.get(
    '/:autor/bibliografie/text',
    verifyApiKey,
    validateRequest({ params: autorSchema }),
    bibliografieText
    );

// Poza autorului
router.get(
    '/:autor/poza',
    verifyApiKey,
    validateRequest({ params: autorSchema }),
    pozaAutor
    );

// Căutare poezii după ID
router.get(
    '/:autor/poezie/:id',
    verifyApiKey,
    validateRequest({ params: idSchema }),
    itemById
    );

// Căutare proză după ID
router.get(
    '/:autor/proza/:id',
    verifyApiKey,
    validateRequest({ params: idSchema }),
    itemById
    );

export default router;
