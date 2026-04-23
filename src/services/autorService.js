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

// Poeziile unui autor
export function getPoeziiAutor(autor) {
  const data = loadAutorData(autor);
  if (!data) return null;

  return Array.isArray(data.poezii) ? data.poezii : [];
}

// Proza unui autor
export function getProzaAutor(autor) {
  const data = loadAutorData(autor);
  if (!data) return null;

  return Array.isArray(data.proza) ? data.proza : [];
}

// Item după ID
export function getItemById(autor, idRaw) {
  const data = loadAutorData(autor);
  if (!data) return null;

  const id = cleanId(idRaw);

  const toate = [...(data.poezii || []), ...(data.proza || [])];

  const item = toate.find((p) => {
    if (!p?.id) return false;

    const pid = cleanId(p.id);

    return (
      pid === id ||
      pid === `poezie-${id}` ||
      pid === `proza-${id}` ||
      pid.endsWith(`-${id}`)
    );
  });

  return item || false;
}

// Bibliografia unui autor
export function getBibliografieText(autor) {
  const data = loadAutorData(autor);
  if (!data) return null;

  const biblioPath = data.bibliografie_path;

  if (cache.bibliografieText.has(biblioPath)) {
    return cache.bibliografieText.get(biblioPath);
  }

  try {
    const filePath = safePath(biblioPath);

    const stats = fs.statSync(filePath);
    if (stats.size > 2 * 1024 * 1024) {
      throw new Error("Bibliography file too large");
    }

    const text = fs.readFileSync(filePath, "utf-8");

    cache.bibliografieText.set(biblioPath, text);

    return text;
  } catch (err) {
    logger.error("Error reading bibliography", { error: err.message });
    throw new Error("Error reading bibliography");
  }
}

// Poza autorului
export function getPozaAutor(autor) {
  const data = loadAutorData(autor);
  if (!data) return null;

  try {
    const filePath = safePath(data.poza);
    return filePath;
  } catch (err) {
    logger.warn("Invalid path for author photo", { error: err.message });
    throw new Error("Invalid path");
  }
}