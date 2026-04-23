import fs from "fs";
import path from "path";
import logger from "../logger/logger.js";
import { getDataFolder } from "../utils/getDataFolder.js";
import { cache } from "../utils/cache.js";

function cleanName(name) {
  return String(name || "")
    .normalize("NFKC") // normalizează diacriticele
    .replace(/[\u0000-\u001F\u007F]/g, "") // elimină caractere de control
    .replace(/[^a-zA-ZăâîșțĂÂÎȘȚ0-9\s'-]/g, "") // păstrează DOAR alfabetul românesc
    .replace(/\s+/g, " ") // normalizează spațiile
    .trim()
    .toLowerCase();

}

export function getListaPoeti() {
  const dataFolder = getDataFolder();

  if (!dataFolder) {
    throw new Error("Data folder does not exist");
  }

  // return cached list if available
  if (Array.isArray(cache.autoriList)) {
    return cache.autoriList;
  }

  try {
    const entries = fs.readdirSync(dataFolder, { withFileTypes: true });

    let autori = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => cleanName(entry.name))
      .filter((name) => name.length > 0);

    // prevent DoS
    if (autori.length > 5000) {
      logger.warn("Too many authors in data folder");
      autori = autori.slice(0, 5000);
    }

    cache.autoriList = autori;
    return autori;

  } catch (err) {
    logger.error("Error reading poets list", {
      error: err.message.replace(/[\n\r]/g, "")
    });
    throw new Error("Could not load poets list");
  }
}