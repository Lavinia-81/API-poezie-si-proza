//src/controllers/poeziiController.js
import fs from "fs";
import path from "path";
import logger from "../logger/logger.js";
import { loadAutorData } from "../utils/loadAutorData.js";
import { resolveAutorName } from "../utils/resolveAutorName.js";

const DATA_DIR = "data";

export function getAll(req, res) {
  try {
    // 1. citim toți autorii din folderul data/
    const autori = fs.readdirSync(DATA_DIR, { withFileTypes: true })
      .filter(dir => dir.isDirectory())
      .map(dir => dir.name);

    let toatePoeziile = [];

    // 2. încărcăm JSON-ul fiecărui autor
    for (const autor of autori) {
      const data = loadAutorData(autor);
      if (!data) continue;

      const poezii = Array.isArray(data.poezii) ? data.poezii : [];

      // 3. adăugăm numele autorului în fiecare poezie
      poezii.forEach(p => {
        toatePoeziile.push({
          ...p,
          autor: autor
        });
      });
    }

    res.json(toatePoeziile);

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
      .normalize("NFKC")
      .replace(/[\u0000-\u001F\u007F]/g, "")
      .replace(/[^a-zA-ZăâîșțĂÂÎȘȚ0-9\s'-]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

    if (id.length > 200) {
      return res.status(400).json({ message: "ID too long" });
    }

    // 1. citim toți autorii
    const autori = fs.readdirSync(DATA_DIR, { withFileTypes: true })
      .filter(dir => dir.isDirectory())
      .map(dir => dir.name);

    // 2. căutăm poezia în fiecare JSON
    for (const autor of autori) {
      const data = loadAutorData(autor);
      if (!data) continue;

      const poezii = Array.isArray(data.poezii) ? data.poezii : [];

      const poezie = poezii.find(p => p.id === id);

      if (poezie) {
        return res.json({
          ...poezie,
          autor: autor
        });
      }
    }

    return res.status(404).json({ message: "Poem not found" });

  } catch (err) {
    logger.error("Error in controller getById", {
      error: err.message.replace(/[\n\r]/g, "")
    });
    res.status(500).json({ message: "Internal server error" });
  }
}
