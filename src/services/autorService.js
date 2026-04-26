import fs from "fs";
import logger from "../logger/logger.js";
import { resolveAutorName } from "../utils/resolveAutorName.js";
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

export function getPoeziiAutor(inputAutor) {
  const autor = resolveAutorName(inputAutor);
  if (!autor) return null;

  const data = loadAutorData(autor);
  return data?.poezii || null;
}

export function getProzaAutor(inputAutor) {
  const autor = resolveAutorName(inputAutor);
  if (!autor) return null;

  const data = loadAutorData(autor);
  return data?.proza || null;
}

export function getItemById(inputAutor, id) {
  const autor = resolveAutorName(inputAutor);
  if (!autor) return null;

  const data = loadAutorData(autor);
  if (!data) return null;

  const all = [...data.poezii, ...data.proza];
  const item = all.find(i => i.id === id);

  return item || false;
}

export function getBibliografieText(inputAutor) {
  const autor = resolveAutorName(inputAutor);
  if (!autor) return null;

  const data = loadAutorData(autor);
  if (!data?.bibliografie_path) return null;

  const filePath = safePath(data.bibliografie_path);
  return fs.readFileSync(filePath, "utf8");
}

export function getPozaAutor(inputAutor) {
  const autor = resolveAutorName(inputAutor);
  if (!autor) return null;

  const data = loadAutorData(autor);
  if (!data?.poza) return null;

  return safePath(data.poza);
}