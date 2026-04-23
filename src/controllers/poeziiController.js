// src/controllers/poeziiController.js
import * as poeziiService from '../services/poeziiService.js';
import logger from '../logger/logger.js';

export function getAll(req, res) {
  try {
    const poezii = poeziiService.getAllPoezii();

    if (!Array.isArray(poezii)) {
      return res.status(500).json({ message: "Invalid poems data" });
    }

    res.json(poezii);

  } catch (err) {
    logger.error("Error in controller getAll", {
      error: err.message.replace(/[\n\r]/g, "")
    });
    res.status(500).json({ message: "Internal server error" });
  }
}

export function getById(req, res) {
  try {
    // Sanitize ID
    const id = String(req.params.id || "")
      .normalize("NFKC") // normalizează diacriticele
      .replace(/[\u0000-\u001F\u007F]/g, "") // elimină caractere de control
      .replace(/[^a-zA-ZăâîșțĂÂÎȘȚ0-9\s'-]/g, "") // păstrează DOAR alfabetul românesc
      .replace(/\s+/g, " ") // normalizează spațiile
      .trim()
      .toLowerCase();


    if (id.length > 200) {
      return res.status(400).json({ message: "ID too long" });
    }

    const poezie = poeziiService.getPoezieById(id);

    if (!poezie) {
      return res.status(404).json({ message: "Poem not found" });
    }

    res.json(poezie);

  } catch (err) {
    logger.error("Error in controller getById", {
      error: err.message.replace(/[\n\r]/g, "")
    });
    res.status(500).json({ message: "Internal server error" });
  }
}