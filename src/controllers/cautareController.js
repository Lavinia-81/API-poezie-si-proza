// src/controllers/cautareController.js
import { cautaDupaTitlu } from '../services/cautareService.js';
import logger from '../logger/logger.js';

export function cautareTitlu(req, res) {
  try {
    // NU mai normalizăm autorul aici
    const autorRaw = req.params.autor;

    // Sanitize title
    let titlu = String(req.params.titlu || "")
      .normalize("NFKC")
      .replace(/[\u0000-\u001F\u007F]/g, "")
      .replace(/[^a-zA-ZăâîșțĂÂÎȘȚ0-9\s'-]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

    // Prevent DoS
    if (titlu.length > 200) {
      return res.status(400).json({ message: "Title too long" });
    }

    // Trimitem autorul BRUT către serviciu
    const rezultat = cautaDupaTitlu(autorRaw, titlu);

    if (rezultat === null) {
      return res.status(404).json({ message: "Author not found" });
    }

    if (!rezultat.length) {
      return res.status(404).json({ message: "No results found" });
    }

    res.json(rezultat);

  } catch (err) {
    logger.error("Error in controller cautareTitlu", {
      error: err.message.replace(/[\n\r]/g, "")
    });

    res.status(500).json({ message: "Internal server error" });
  }
}
