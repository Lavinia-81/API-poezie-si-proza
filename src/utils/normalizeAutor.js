// src/utils/normalizeAutor.js

// Allowed characters after normalization
const SAFE_CHARS = /[^a-z0-9\s]/g;

export function normalizeAutor(autor) {
  try {
    if (typeof autor !== "string") return "";

    // Limit length (prevents DoS)
    if (autor.length > 200) autor = autor.slice(0, 200);

    return autor
      .replace(/\0/g, "")                 // remove null bytes
      .normalize("NFC")
      .normalize("NFD")                   // split diacritics
      .replace(/[\u0300-\u036f]/g, "")    // remove diacritics
      .replace(/[\u202E\u202D]/g, "")     // remove RTL overrides
      .replace(/\.txt$/i, "")
      .replace(/[_-]/g, " ")
      .replace(/\s+/g, " ")
      .replace(SAFE_CHARS, "")            // remove unsafe chars
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
      .normalize("NFC")
      .replace(/[\u202E\u202D]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

  } catch {
    return "";
  }
}