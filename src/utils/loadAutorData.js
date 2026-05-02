// src/utils/loadAutorData.js
import fs from "fs";
import path from "path";
import logger from "../logger/logger.js";
import { getDataFolder } from "./getDataFolder.js";
import { safePath } from "./safePath.js";
import { cache } from "./cache.js";
import { levenshtein } from "./normalizeAutor.js";

// 🔥 Normalize the author name 
function normalizeSoft(str) {
  return String(str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")          // elimină diacritice
    .replace(/[\s\u00A0\u202F\-_]+/g, " ")    // toate spațiile/hyphens → un spațiu
    .trim()
    .toLowerCase();
}

export function loadAutorData(autorRaw) {
  try {
    if (typeof autorRaw !== "string") {
      logger.warn("Invalid author input type", { autorRaw });
      return null;
    }

    const autorSoft = normalizeSoft(autorRaw);
    const dataFolder = getDataFolder();
    if (!dataFolder) return null;

    // Cache global
    if (cache.autoriData.has(autorSoft)) {
      return cache.autoriData.get(autorSoft);
    }

    // Read the author folders
    let folders;
    try {
      folders = fs.readdirSync(dataFolder, { withFileTypes: true })
        .filter(f => f.isDirectory());
    } catch (err) {
      logger.error("Failed to read data folder", { error: err });
      return null;
    }

    // Normalize the folder names
    const folderMap = folders.map(f => ({
      real: f.name,
      soft: normalizeSoft(f.name)
    }));

    // 1️⃣ Exact match tolerant
    let match = folderMap.find(f => f.soft === autorSoft);

    // 2️⃣ Fuzzy match tolerant (prag 3)
    if (!match) {
      match = folderMap.find(
        f => levenshtein(f.soft, autorSoft) <= 3
      );
    }

    // 3️⃣ Fallback: search the JSON files for a match
    if (!match) {
      for (const f of folderMap) {
        try {
          const folderPath = safePath(path.join(dataFolder, f.real));
          const jsonFile = fs.readdirSync(folderPath, { withFileTypes: true })
            .find(x => x.isFile() && x.name.endsWith(".json"));

          if (!jsonFile) continue;

          const jsonPath = safePath(path.join(folderPath, jsonFile.name));
          const raw = fs.readFileSync(jsonPath, "utf8");
          const data = JSON.parse(raw);

          if (normalizeSoft(data.autor) === autorSoft) {
            match = f;
            break;
          }
        } catch {
          continue;
        }
      }
    }

    if (!match) {
      logger.warn("Author not found", { autorRaw });
      return null;
    }

    // read JSON file
    const autorFolder = safePath(path.join(dataFolder, match.real));

    let jsonFile;
    try {
      jsonFile = fs.readdirSync(autorFolder, { withFileTypes: true })
        .find(f => f.isFile() && f.name.endsWith(".json"));
    } catch (err) {
      logger.error("Failed to read author folder", { error: err });
      return null;
    }

    if (!jsonFile) return null;

    const jsonPath = safePath(path.join(autorFolder, jsonFile.name));

    // check size (max 5MB)
    const stats = fs.statSync(jsonPath);
    if (stats.size > 5 * 1024 * 1024) {
      logger.warn("JSON file too large", { file: jsonPath });
      return null;
    }

    // Parse JSON
    let data;
    try {
      const raw = fs.readFileSync(jsonPath, "utf8");
      data = JSON.parse(raw);
    } catch (err) {
      logger.error("Invalid JSON file", { file: jsonPath, error: err });
      return null;
    }

    // Cache
    cache.autoriData.set(autorSoft, data);

    return data;

  } catch (err) {
    logger.error("Unexpected error in loadAutorData", { error: err });
    return null;
  }
}
