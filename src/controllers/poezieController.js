// src/controllers/poezieController.js
import { getPoezieVersuri, getPoezieText } from '../services/poezieService.js';
import logger from '../logger/logger.js';

export function poezieVersuri(req, res) {
  try {
    const autorRaw = req.params.autor;

    // Sanitize ID
    const id = String(req.params.id || "")
      .normalize("NFKC")
      .replace(/[\u0000-\u001F\u007F]/g, "")
      .replace(/[^a-zA-ZăâîșțĂÂÎȘȚ0-9\s'-]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

    if (id.length > 200) {
      return res.status(400).json({ message: "ID too long" });
    }

    const rezultat = getPoezieVersuri(autorRaw, id);

    if (rezultat === null) {
      return res.status(404).json({ message: "Author not found" });
    }

    if (rezultat === false) {
      return res.status(404).json({ message: "Poem not found" });
    }

    res.json(rezultat);

  } catch (err) {
    logger.error("Error in controller poezieVersuri", {
      error: err.message.replace(/[\n\r]/g, "")
    });
    res.status(500).json({ message: "Internal server error" });
  }
}

export function poezieText(req, res) {
  try {
    const autorRaw = req.params.autor;

    // Sanitize ID
    const id = String(req.params.id || "")
      .normalize("NFKC")
      .replace(/[\u0000-\u001F\u007F]/g, "")
      .trim();

    if (id.length > 200) {
      return res.status(400).json({ message: "ID too long" });
    }

    const text = getPoezieText(autorRaw, id);

    if (text === null) {
      return res.status(404).json({ message: "Author not found" });
    }

    if (text === false) {
      return res.status(404).json({ message: "Poem not found" });
    }

    res.type("text/plain").send(text.replace(/\u0000/g, ""));

  } catch (err) {
    logger.error("Error in controller poezieText", {
      error: err.message.replace(/[\n\r]/g, "")
    });
    res.status(500).json({ message: "Internal server error" });
  }
}