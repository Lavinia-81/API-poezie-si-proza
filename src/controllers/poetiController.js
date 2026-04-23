import { getListaPoeti } from '../services/poetiService.js';
import logger from '../logger/logger.js';

export function listaPoeti(req, res) {
  try {
    const autori = getListaPoeti();

    if (!autori || !Array.isArray(autori)) {
      return res.status(500).json({ message: "Invalid poets data" });
    }

    res.json(autori);

  } catch (err) {
    logger.error("Error in controller listaPoeti", {
      error: err.message.replace(/[\n\r]/g, "")
    });

    res.status(500).json({ message: "Internal server error" });
  }
}