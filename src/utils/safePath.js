// src/utils/safePath.js
import path from "path";
import fs from "fs";
import logger from "../logger/logger.js";

export function safePath(filePath) {
  if (typeof filePath !== "string") {
    throw new Error("Invalid path");
  }

  // 1. Blochează null byte injection
  if (filePath.includes("\0")) {
    logger.warn("Null byte attack detected", { filePath });
    throw new Error("Invalid path");
  }

  // 2. Normalizează calea (anti unicode bypass)
  const normalized = path.normalize(filePath);

  // 3. Rezolvă calea absolută
  const projectRoot = process.cwd();
  const resolved = path.resolve(projectRoot, normalized);

  // 4. Permitem doar acces în folderul "data"
  const dataDir = path.join(projectRoot, "data");

  if (!resolved.startsWith(dataDir)) {
    logger.warn("Path traversal attempt blocked", { filePath });
    throw new Error("Invalid path");
  }

  // 5. Blochează symlink attacks
  try {
    const real = fs.realpathSync(resolved);
    if (!real.startsWith(dataDir)) {
      logger.warn("Symlink attack blocked", { filePath });
      throw new Error("Invalid path");
    }
  } catch (err) {
    logger.warn("Invalid realpath", { filePath });
    throw new Error("Invalid path");
  }

 // 6. Permite foldere + extensii sigure

// Dacă este folder → îl permitem
try {
  if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
    return resolved;
  }
} catch (err) {
  logger.warn("Failed to stat path", { filePath });
}

// Dacă nu este folder → verificăm extensia
const ext = path.extname(resolved).toLowerCase();

const allowedExtensions = [".txt", ".json", ".md"];

// Dacă nu are extensie → este folder → PERMITEM
if (ext === "") {
  return resolved;
}

// Dacă extensia nu este permisă → blocăm
if (!allowedExtensions.includes(ext)) {
  logger.warn("Blocked file extension", { filePath });
  throw new Error("Invalid file type");
}

return resolved;


}