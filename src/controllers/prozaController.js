import { getPoeziiAutor, getProzaAutor } from '../services/autorService.js';
import { normalizeAutor } from "../utils/normalizeAutor.js";
import logger from '../logger/logger.js';

export function poeziiAutor(req, res) {
  try {
    // Sanitize autor
    const autorNormalizat = normalizeAutor(
      String(req.params.autor || "")
        .normalize("NFKC")
        .replace(/[\u0000-\u001F\u007F]/g, "")
        .trim()
    );

    if (autorNormalizat.length > 200) {
      return res.status(400).json({ message: "Author name too long" });
    }

    const poezii = getPoeziiAutor(autorNormalizat);

    if (!poezii) {
      return res.status(404).json({ message: "Author not found" });
    }

    res.json(poezii);

  } catch (err) {
    logger.error("Error in controller poeziiAutor", {
      error: err.message.replace(/[\n\r]/g, "")
    });
    res.status(500).json({ message: "Internal server error" });
  }
}

export function prozaAutor(req, res) {
  try {
    // Sanitize autor
    const autorNormalizat = normalizeAutor(
      String(req.params.autor || "")
       .normalize("NFKC") // normalizează diacriticele
        .replace(/[\u0000-\u001F\u007F]/g, "") // elimină caractere de control
        .replace(/[^a-zA-ZăâîșțĂÂÎȘȚ0-9\s'-]/g, "") // păstrează DOAR alfabetul românesc
        .replace(/\s+/g, " ") // normalizează spațiile
        .trim()
        .toLowerCase()
    );

    if (autorNormalizat.length > 200) {
      return res.status(400).json({ message: "Author name too long" });
    }

    const proza = getProzaAutor(autorNormalizat);

    if (!proza) {
      return res.status(404).json({ message: "Author not found" });
    }

    res.json(proza);

  } catch (err) {
    logger.error("Error in controller prozaAutor", {
      error: err.message.replace(/[\n\r]/g, "")
    });
    res.status(500).json({ message: "Internal server error" });
  }
}