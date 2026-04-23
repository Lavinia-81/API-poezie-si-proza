// src/utils/loadAutorData.js
import fs from "fs";
import path from "path";
import logger from "../logger/logger.js";
import { getDataFolder } from "./getDataFolder.js";
import { safePath } from "./safePath.js";
import { cache } from "./cache.js";
import { normalizeAutor } from "./normalizeAutor.js";

export function loadAutorData(autorRaw) {
  try {
    if (typeof autorRaw !== "string") {
      logger.warn("Invalid author input type", { autorRaw });
      return null;
    }

    const autorNormalizat = normalizeAutor(autorRaw);
    const dataFolder = getDataFolder();
    if (!dataFolder) return null;

    // Cache hit
    if (cache.autoriData.has(autorNormalizat)) {
      return cache.autoriData.get(autorNormalizat);
    }

    // Read folders safely
    let folders;
    try {
      folders = fs.readdirSync(dataFolder, { withFileTypes: true });
    } catch (err) {
      logger.error("Failed to read data folder", { error: err });
      return null;
    }

    // Find matching folder
    const match = folders.find(
      f => f.isDirectory() && normalizeAutor(f.name) === autorNormalizat
    );

    if (!match) return null;

    const autorFolder = safePath(path.join(dataFolder, match.name));

    // Find JSON file
    let jsonFile;
    try {
      jsonFile = fs
        .readdirSync(autorFolder, { withFileTypes: true })
        .find(f => f.isFile() && f.name.endsWith(".json"));
    } catch (err) {
      logger.error("Failed to read author folder", { error: err });
      return null;
    }

    if (!jsonFile) return null;

    const jsonPath = safePath(path.join(autorFolder, jsonFile.name));

    // Check file size (max 5MB)
    const stats = fs.statSync(jsonPath);
    if (stats.size > 5 * 1024 * 1024) {
      logger.warn("JSON file too large", { file: jsonPath });
      return null;
    }

    // Read + parse JSON safely
    let data;
    try {
      const raw = fs.readFileSync(jsonPath, "utf8");
      data = JSON.parse(raw);
    } catch (err) {
      logger.error("Invalid JSON file", { file: jsonPath, error: err });
      return null;
    }

    // Cache result
    cache.autoriData.set(autorNormalizat, data);

    return data;

  } catch (err) {
    logger.error("Unexpected error in loadAutorData", { error: err });
    return null;
  }
}