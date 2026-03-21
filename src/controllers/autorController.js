// src/controllers/autorController.js
import fs from 'fs';
import { safePath } from '../utils/safePath.js';
import { normalizeAutor } from "../utils/normalizeAutor.js";
import logger from '../logger/logger.js';
import {
    getPoeziiAutor,
    getProzaAutor,
    getItemById,
    getBibliografieText,
    getPozaAutor
} from '../services/autorService.js';


export function poeziiAutor(req, res) {
    const autorNormalizat = normalizeAutor(req.params.autor);
    const data = getPoeziiAutor(autorNormalizat);

    if (!data) return res.status(404).json({ mesaj: "Autorul nu există" });
    res.json(data);
}

export function prozaAutor(req, res) {
    const autorNormalizat = normalizeAutor(req.params.autor);
    const data = getProzaAutor(autorNormalizat);

    if (!data) return res.status(404).json({ mesaj: "Autorul nu există" });
    res.json(data);
}

export function itemById(req, res) {
    const autorNormalizat = normalizeAutor(req.params.autor);
    const { id } = req.params;

    const data = getItemById(autorNormalizat, id);

    if (data === null) return res.status(404).json({ mesaj: "Autorul nu există" });
    if (data === false) return res.status(404).json({ mesaj: "Itemul nu a fost găsit" });

    res.json(data);
}

export function bibliografieText(req, res) {
    const autorNormalizat = normalizeAutor(req.params.autor);

    try {
        const text = getBibliografieText(autorNormalizat);

        if (text === null) {
            return res.status(404).json({ mesaj: "Autorul nu există" });
        }

        res.type('text/plain').send(text);

    } catch (err) {
        logger.error("Eroare în controller bibliografieText", { error: err.message });
        res.status(500).json({ mesaj: "Eroare la citirea bibliografiei" });
    }
}

export function pozaAutor(req, res) {
    const autorNormalizat = normalizeAutor(req.params.autor);

    try {
        const filePath = getPozaAutor(autorNormalizat);

        if (filePath === null) {
            return res.status(404).json({ mesaj: "Autorul nu există" });
        }

        res.sendFile(filePath);

    } catch (err) {
        logger.error("Eroare în controller pozaAutor", { error: err.message });
        res.status(400).json({ mesaj: "Cale invalidă" });
    }
}


export function poezieText(req, res, next) {
    try {
         const autorNormalizat = normalizeAutor(req.params.autor);
        const { id } = req.params;

        const item = getItemById(autorNormalizat, id);

        if (!item) {
            return res.status(404).json({ mesaj: "Nu există acest ID" });
        }

        const filePath = safePath(item.versuri_path);
        const text = fs.readFileSync(filePath, 'utf8');

        // returnează exact conținutul fișierului, fără JSON
        res.type('text/plain').send(text);

    } catch (err) {
        next(err);
    }
}


export function prozaText(req, res, next) {
    try {
         const autorNormalizat = normalizeAutor(req.params.autor);
        const { id } = req.params;

        const item = getItemById(autorNormalizat, id);

        if (!item) {
            return res.status(404).json({ mesaj: "Nu există acest ID" });
        }

        const filePath = safePath(item.versuri_path);
        const text = fs.readFileSync(filePath, 'utf8');

         // returnează exact conținutul fișierului, fără JSON
        res.type('text/plain').send(text);

    } catch (err) {
        next(err);
    }
}
