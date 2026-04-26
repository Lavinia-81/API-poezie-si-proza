import { getPoeziiAutor, getProzaAutor } from '../services/autorService.js';
import logger from '../logger/logger.js';

export function poeziiAutor(req, res) {
  try {
    const autorRaw = req.params.autor;

    const poezii = getPoeziiAutor(autorRaw);

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
    const autorRaw = req.params.autor;

    const proza = getProzaAutor(autorRaw);

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
