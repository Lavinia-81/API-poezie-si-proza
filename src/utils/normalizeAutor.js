// src/utils/normalizeAutor.js

// Allowed characters after normalization
const SAFE_CHARS = /[^a-zăâîșț0-9\s]/gi;

export function normalizeAutor(autor) {
  try {
    if (typeof autor !== "string") return "";
    // Decode URL-encoded input (e.g. "Mihai%20Eminescu" → "Mihai Eminescu")
    try {
      autor = decodeURIComponent(autor);
    } catch {}

      // Limit length (prevents DoS)
      if (autor.length > 200) autor = autor.slice(0, 200);

      return autor
        .replace(/\0/g, "")                 // remove null bytes
        .normalize("NFD")                   // split diacritics
        .replace(/[\u0300-\u036f]/g, "")    // remove diacritics
        .replace(/[\u202E\u202D]/g, "")     // remove RTL overrides
        .replace(/\.txt$/i, "")
        .replace(/[_-]/g, " ")
        .replace(/\s+/g, " ")
        .replace(/[^a-zăâîșț0-9\s]/gi, "")       // al
        // low Romanian letters before diacritics removal
        .trim()
        .toLowerCase();

    } catch {
      return "";
    }
  }

export function normalizeTitlu(titlu) {
  try {
    if (typeof titlu !== "string") return "";

    if (titlu.length > 200) titlu = titlu.slice(0, 200);

    let decoded = "";
    try {
      decoded = decodeURIComponent(titlu);
    } catch {
      decoded = titlu; // fallback
    }

    return decoded
    .replace(/\0/g, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")   // elimină diacritice
    .replace(/[\u202E\u202D]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  } catch {
    return "";
  }
}

export function normalizeString(value) {
  return String(value || "")
    .replace(/[\u2010-\u2015]/g, "-")
    .replace(/[ţț]/g, "t")
    .replace(/[şș]/g, "s")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s'-]/gi, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}


export function levenshtein(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = b.charAt(i - 1) === a.charAt(j - 1) ? 0 : 1;

      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // delete
        matrix[i][j - 1] + 1,      // insert
        matrix[i - 1][j - 1] + cost // substitute
      );
    }
  }

  return matrix[b.length][a.length];
}
