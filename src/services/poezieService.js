import fs from "fs";
import logger from "../logger/logger.js";
import { loadAutorData } from "../utils/loadAutorData.js";
import { safePath } from "../utils/safePath.js";
import { cache } from "../utils/cache.js";

function cleanId(id) {
  return String(id || "")
    .normalize("NFKC") // normalizează diacriticele
    .replace(/[\u0000-\u001F\u007F]/g, "") // elimină caractere de control
    .replace(/[^a-zA-ZăâîșțĂÂÎȘȚ0-9\s'-]/g, "") // păstrează DOAR alfabetul românesc
    .replace(/\s+/g, " ") // normalizează spațiile
    .trim()
    .toLowerCase();

}

export function getPoezieVersuri(autor, idRaw) {
  const data = loadAutorData(autor);
  if (!data) return null;

  const id = cleanId(idRaw);

  const poezie = (data.poezii || []).find(p => p?.id === id);
  if (!poezie) return false;

  const versuriPath = poezie.versuri_path;

  if (cache.poezieText.has(versuriPath)) {
    return {
      id: poezie.id,
      titlu: poezie.titlu,
      tip: poezie.tip,
      continut: cache.poezieText.get(versuriPath)
    };
  }

  try {
    const filePath = safePath(versuriPath);

    const stats = fs.statSync(filePath);
    if (stats.size > 2 * 1024 * 1024) {
      throw new Error("File too large");
    }

    const text = fs.readFileSync(filePath, "utf8");

    cache.poezieText.set(versuriPath, text);

    return {
      id: poezie.id,
      titlu: poezie.titlu,
      tip: poezie.tip,
      continut: text
    };

  } catch (err) {
    logger.error("Error reading poem verses", { error: err.message });
    throw new Error("Error reading poem verses");
  }
}

export function getPoezieText(autor, idRaw) {
  const data = loadAutorData(autor);
  if (!data) return null;

  const id = cleanId(idRaw);

  const poezie = (data.poezii || []).find(p => p?.id === id);
  if (!poezie) return false;

  const versuriPath = poezie.versuri_path;

  if (cache.poezieText.has(versuriPath)) {
    return cache.poezieText.get(versuriPath);
  }

  try {
    const filePath = safePath(versuriPath);

    const stats = fs.statSync(filePath);
    if (stats.size > 2 * 1024 * 1024) {
      throw new Error("File too large");
    }

    const text = fs.readFileSync(filePath, "utf8");

    cache.poezieText.set(versuriPath, text);

    return text;

  } catch (err) {
    logger.error("Error reading poem text", { error: err.message });
    throw new Error("Error reading poem text");
  }
}