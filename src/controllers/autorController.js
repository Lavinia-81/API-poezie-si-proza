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

export function poeziiAutor(req, res, next) {
  try {
    const autorNormalizat = normalizeAutor(req.params.autor);
    const data = getPoeziiAutor(autorNormalizat);

    if (!data) return res.status(404).json({ message: "Author not found" });

    res.json(data);
  } catch (err) {
    next(err);
  }
}

export function prozaAutor(req, res, next) {
  try {
    const autorNormalizat = normalizeAutor(req.params.autor);
    const data = getProzaAutor(autorNormalizat);

    if (!data) return res.status(404).json({ message: "Author not found" });

    res.json(data);
  } catch (err) {
    next(err);
  }
}

export function itemById(req, res, next) {
  try {
    const autorNormalizat = normalizeAutor(req.params.autor);
    const id = String(req.params.id).replace(/[\u0000-\u001F\u007F]/g, "").trim();

    const data = getItemById(autorNormalizat, id);

    if (data === null) return res.status(404).json({ message: "Author not found" });
    if (data === false) return res.status(404).json({ message: "Item not found" });

    res.json(data);
  } catch (err) {
    next(err);
  }
}

export function bibliografieText(req, res) {
  const autorNormalizat = normalizeAutor(req.params.autor);

  try {
    const text = getBibliografieText(autorNormalizat);

    if (text === null) {
      return res.status(404).json({ message: "Author not found" });
    }

    res.type("text/plain").send(text.replace(/\u0000/g, ""));
  } catch (err) {
    logger.error("Error in controller bibliografieText", { error: err.message });
    res.status(500).json({ message: "Error reading bibliography" });
  }
}

export function pozaAutor(req, res) {
  const autorNormalizat = normalizeAutor(req.params.autor);

  try {
    const filePath = getPozaAutor(autorNormalizat);

    if (filePath === null) {
      return res.status(404).json({ message: "Author not found" });
    }

    res.sendFile(filePath, { root: "/" }, (err) => {
      if (err) {
        logger.error("sendFile error", { error: err.message });
        return res.status(400).json({ message: "Invalid file path" });
      }
    });

  } catch (err) {
    logger.error("Error in controller pozaAutor", { error: err.message });
    res.status(400).json({ message: "Invalid file path" });
  }
}

export function poezieText(req, res, next) {
  try {
    const autorNormalizat = normalizeAutor(req.params.autor);
    const id = String(req.params.id).replace(/[\u0000-\u001F\u007F]/g, "").trim();

    const item = getItemById(autorNormalizat, id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const filePath = safePath(item.versuri_path);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    const stats = fs.statSync(filePath);

    if (stats.size > 2 * 1024 * 1024) {
      return res.status(413).json({ message: "File too large" });
    }

    const text = fs.readFileSync(filePath, "utf8");

    res.type("text/plain").send(text.replace(/\u0000/g, ""));
  } catch (err) {
    next(err);
  }
}

export function prozaText(req, res, next) {
  try {
    const autorNormalizat = normalizeAutor(req.params.autor);
    const id = String(req.params.id).replace(/[\u0000-\u001F\u007F]/g, "").trim();

    const item = getItemById(autorNormalizat, id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const filePath = safePath(item.versuri_path);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    const stats = fs.statSync(filePath);

    if (stats.size > 2 * 1024 * 1024) {
      return res.status(413).json({ message: "File too large" });
    }

    const text = fs.readFileSync(filePath, "utf8");

    res.type("text/plain").send(text.replace(/\u0000/g, ""));
  } catch (err) {
    next(err);
  }
}