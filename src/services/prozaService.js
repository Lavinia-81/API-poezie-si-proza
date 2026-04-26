import fs from "fs";
import logger from "../logger/logger.js";
import { loadAutorData } from "../utils/loadAutorData.js";
import { safePath } from "../utils/safePath.js";
import { cache } from "../utils/cache.js";
import { normalizeAutor } from "../utils/normalizeAutor.js";

function cleanId(id) {
  return String(id || "")
    .normalize("NFKC")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/[^a-zA-ZăâîșțĂÂÎȘȚ0-9\s'-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function getPoeziiAutor(autorRaw) {
  const autor = normalizeAutor(autorRaw);
  if (!autor) return null;

  const data = loadAutorData(autor);
  if (!data) return null;

  return Array.isArray(data.poezii) ? data.poezii : [];
}

export function getProzaAutor(autorRaw) {
  const autor = normalizeAutor(autorRaw);
  if (!autor) return null;

  const data = loadAutorData(autor);
  if (!data) return null;

  return Array.isArray(data.proza) ? data.proza : [];
}
