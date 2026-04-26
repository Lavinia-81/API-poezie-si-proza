import fs from "fs";
import path from "path";
import { getDataFolder } from "../utils/getDataFolder.js";
import { safePath } from "../utils/safePath.js";
import { normalizeString, levenshtein } from "../utils/normalizeAutor.js";
import { loadAutorData } from "../utils/loadAutorData.js";

export function cautaGlobal(textRaw) {
  const text = normalizeString(textRaw);
  if (!text || text.length < 2) return [];

  const dataFolder = getDataFolder();
  if (!dataFolder) return [];

  const results = [];

  // 1. Citește toate folderele de autori
  const folders = fs.readdirSync(dataFolder, { withFileTypes: true })
    .filter(f => f.isDirectory())
    .map(f => f.name);

  for (const folder of folders) {
    const autorOriginal = folder;
    const autorNorm = normalizeString(folder);

    // match pe autor
    const distAutor = levenshtein(autorNorm, text);

    if (autorNorm.includes(text) || distAutor <= 2) {
      results.push({
        autor: autorOriginal,
        titlu: null,
        tip: "autor",
        scor: Number((1 - distAutor / Math.max(autorNorm.length, text.length)).toFixed(3))
      });
    }

    const data = loadAutorData(autorOriginal);
    if (!data) continue;

    const poezii = Array.isArray(data.poezii) ? data.poezii : [];
    const proza = Array.isArray(data.proza) ? data.proza : [];
    const toate = [...poezii, ...proza];

    for (const item of toate) {
      if (!item?.titlu) continue;

      const titluNorm = normalizeString(item.titlu);
      const dist = levenshtein(titluNorm, text);

      // scor între 0 și 1
      const scor = 1 - dist / Math.max(titluNorm.length, text.length);

      if (titluNorm.includes(text) || dist <= 3 || scor > 0.6) {
        results.push({
          autor: autorOriginal,
          titlu: item.titlu,
          tip: item.tip,
          scor: Number(scor.toFixed(3))
        });
      }
    }
  }

  // 2. Sortează după scor descrescător
  results.sort((a, b) => b.scor - a.scor);

  return results;
}
