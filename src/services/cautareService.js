// src/services/cautareService.js
import { loadAutorData } from '../utils/loadAutorData.js';
import { normalizeAutor } from '../utils/normalizeAutor.js';
import { normalizeString, levenshtein } from "../utils/normalizeAutor.js"; 
// ai spus că le-ai pus pe toate în normalizeAutor.js

export function cautaDupaTitlu(autorRaw, titluRaw) {
  // 1. normalizăm autorul
  const autorNormalizat = normalizeAutor(autorRaw);
  if (!autorNormalizat) return null;

  // 2. încărcăm JSON-ul autorului (cu fuzzy search în loadAutorData)
  const data = loadAutorData(autorNormalizat);
  if (!data) return null;

  const poezii = Array.isArray(data.poezii) ? data.poezii : [];
  const proza = Array.isArray(data.proza) ? data.proza : [];
  const toate = [...poezii, ...proza];

  // 3. normalizăm titlul căutat
  const titluCautat = normalizeString(titluRaw);
  if (titluCautat.length > 200) return [];

  // 4. fuzzy search pe titluri
  return toate.filter(item => {
    if (!item?.titlu) return false;

    const titluItem = normalizeString(item.titlu);
    const dist = levenshtein(titluItem, titluCautat);

    return (
      titluItem.includes(titluCautat) ||   // match direct
      dist <= 2                            // fuzzy match tolerant
    );
  });
}
