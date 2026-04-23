import { cautaDupaTitlu } from '../services/cautareService.js';
import { normalizeAutor } from "../utils/normalizeAutor.js";
import logger from '../logger/logger.js';

export function cautareTitlu(req, res) {
  try {
    const autorNormalizat = normalizeAutor(req.params.autor);

    // Sanitize title
    let titlu = String(req.params.titlu || "")
      .normalize("NFKC") // normalizează diacriticele
      .replace(/[\u0000-\u001F\u007F]/g, "") // elimină caractere de control
      .replace(/[^a-zA-ZăâîșțĂÂÎȘȚ0-9\s'-]/g, "") // păstrează DOAR alfabetul românesc
      .replace(/\s+/g, " ") // normalizează spațiile
      .trim()
      .toLowerCase();


    // Prevent DoS
    if (titlu.length > 200) {
      return res.status(400).json({ message: "Title too long" });
    }

    const rezultat = cautaDupaTitlu(autorNormalizat, titlu);

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