// src/services/autorService.js
import { loadAutorData } from "../utils/loadAutorData.js";

function cleanAutor(autor) {
  return String(autor || "")
    .normalize("NFKC") // normalizează diacriticele
    .replace(/[\u0000-\u001F\u007F]/g, "") // elimină caractere de control
    .replace(/[^a-zA-ZăâîșțĂÂÎȘȚ0-9\s'-]/g, "") // păstrează DOAR alfabetul românesc
    .replace(/\s+/g, " ") // normalizează spațiile
    .trim()
    .toLowerCase();

}

export function getPoeziiAutor(autorRaw) {
  const autor = cleanAutor(autorRaw);
  const data = loadAutorData(autor);

  if (!data) return null;

  return Array.isArray(data.poezii) ? data.poezii : [];
}

export function getProzaAutor(autorRaw) {
  const autor = cleanAutor(autorRaw);
  const data = loadAutorData(autor);

  if (!data) return null;

  return Array.isArray(data.proza) ? data.proza : [];
}