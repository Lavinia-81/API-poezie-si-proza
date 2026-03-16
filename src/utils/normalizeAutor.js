export function normalizeAutor(autor) {
    return autor
        .normalize("NFC")
        .normalize("NFD")                 // separă diacriticele
        .replace(/[\u0300-\u036f]/g, "")  // elimină diacriticele
        .replace(/\.txt$/i, "")
        .replace(/[_-]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
}


export function normalizeTitlu(titlu) {
  return decodeURIComponent(titlu)
    .normalize("NFC")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}