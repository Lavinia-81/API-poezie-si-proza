// src/utils/safePath.js
import path from "path";
import fs from "fs";
import logger from "../logger/logger.js";

export function safePath(filePath) {
  if (typeof filePath !== "string") {
    throw new Error("Invalid path");
  }

  // 1. Block null byte injection
  if (filePath.includes("\0")) {
    logger.warn("Null byte attack detected", { filePath });
    throw new Error("Invalid path");
  }

  // 2. Normalize the path (anti unicode bypass)
  const normalized = path.normalize(filePath);

  // 3. Resolve absolute path (../)
  const projectRoot = process.cwd();
  const resolved = path.resolve(projectRoot, normalized);

  // 4. Permit the access to the "data" folder
  const dataDir = path.join(projectRoot, "data");

  if (!resolved.startsWith(dataDir)) {
    logger.warn("Path traversal attempt blocked", { filePath });
    throw new Error("Invalid path");
  }

  // 5. Block symlink attacks
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

 // 6. Permite foldere + extension only .txt, .json, .md

// If it's a folder → we allow it
  try {
    if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
      return resolved;
    }
  } catch (err) {
    logger.warn("Failed to stat path", { filePath });
  }

  // If it's a file → check extension
  const ext = path.extname(resolved).toLowerCase();

  const allowedExtensions = [".txt", ".json", ".md"];

  // If the extension is empty → it's a file without extension, we can allow it (e.g. "LICENSE")
  if (ext === "") {
    return resolved;
  }

  // If the extension is not in the allowed list → block
  if (!allowedExtensions.includes(ext)) {
    logger.warn("Blocked file extension", { filePath });
    throw new Error("Invalid file type");
  }

  return resolved;

}