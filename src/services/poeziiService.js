import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import logger from "../logger/logger.js";
import { safePath } from "../utils/safePath.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, "../../data/poezii");

function cleanId(id) {
  return String(id || "")
    .normalize("NFKC") // normalizează diacriticele
    .replace(/[\u0000-\u001F\u007F]/g, "") // elimină caractere de control
    .replace(/[^a-zA-ZăâîșțĂÂÎȘȚ0-9\s'-]/g, "") // păstrează DOAR alfabetul românesc
    .replace(/\s+/g, " ") // normalizează spațiile
    .trim()
    .toLowerCase();

}

export function getAllPoezii() {
  try {
    const entries = fs.readdirSync(dataPath, { withFileTypes: true });

    let files = entries
      .filter((e) => e.isFile() && e.name.endsWith(".json"))
      .map((e) => e.name);

    // prevent DoS
    if (files.length > 5000) {
      logger.warn("Too many poem files in data folder");
      files = files.slice(0, 5000);
    }

    const poezii = files.map((f) => {
      const filePath = safePath(path.join(dataPath, f));

      const stats = fs.statSync(filePath);
      if (stats.size > 2 * 1024 * 1024) {
        throw new Error(`File too large: ${f}`);
      }

      const content = fs.readFileSync(filePath, "utf8");
      return JSON.parse(content);
    });

    return poezii;

  } catch (err) {
    logger.error("Error reading poems", { error: err.message });
    throw new Error("Could not load poems");
  }
}

export function getPoezieById(idRaw) {
  try {
    const id = cleanId(idRaw);

    const filePath = safePath(path.join(dataPath, `${id}.json`));

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const stats = fs.statSync(filePath);
    if (stats.size > 2 * 1024 * 1024) {
      throw new Error("File too large");
    }

    const content = fs.readFileSync(filePath, "utf8");
    return JSON.parse(content);

  } catch (err) {
    logger.error("Error reading poem", {
      id: idRaw,
      error: err.message
    });
    throw new Error("Could not load poem");
  }
}