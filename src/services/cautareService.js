import { loadAutorData } from '../utils/loadAutorData.js';

function cleanString(value) {
  return String(value || "")
    .normalize("NFKC") // normalizează diacriticele
    .replace(/[\u0000-\u001F\u007F]/g, "") // elimină caractere de control
    .replace(/[^a-zA-ZăâîșțĂÂÎȘȚ0-9\s'-]/g, "") // păstrează DOAR alfabetul românesc
    .replace(/\s+/g, " ") // normalizează spațiile
    .trim()
    .toLowerCase();

}

export function cautaDupaTitlu(autor, titluRaw) {
  const data = loadAutorData(autor);
  if (!data) return null;

  const poezii = Array.isArray(data.poezii) ? data.poezii : [];
  const proza = Array.isArray(data.proza) ? data.proza : [];

  const toate = [...poezii, ...proza];

  // sanitize title
  const titlu = cleanString(titluRaw);

  // prevent DoS
  if (titlu.length > 200) return [];

  return toate.filter(item => {
    if (!item?.titlu) return false;

    const titluItem = cleanString(item.titlu);
    return titluItem.includes(titlu);
  });
}