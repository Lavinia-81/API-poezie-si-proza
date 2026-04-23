// src/utils/getDataFolder.js
import fs from "fs";
import path from "path";
import logger from "../logger/logger.js";

export function getDataFolder() {
  try {
    const projectRoot = process.cwd();
    const dataPath = path.join(projectRoot, "data");

    // 1. Normalize path (prevents unicode/path bypass)
    const normalized = path.normalize(dataPath);

    // 2. Check existence
    if (!fs.existsSync(normalized)) {
      logger.error("The 'data' folder does not exist");
      return null;
    }

    // 3. Ensure it's a directory
    const stats = fs.statSync(normalized);
    if (!stats.isDirectory()) {
      logger.error("'data' is not a directory");
      return null;
    }

    // 4. Prevent symlink attacks
    const realPath = fs.realpathSync(normalized);
    if (realPath !== normalized) {
      logger.error("Symlink detected for the 'data' folder");
      return null;
    }

    // 5. Check read/write permissions
    try {
      fs.accessSync(normalized, fs.constants.R_OK | fs.constants.W_OK);
    } catch {
      logger.error("Insufficient permissions for the 'data' folder");
      return null;
    }

    return normalized;

  } catch (err) {
    logger.error("Error accessing the 'data' folder", { error: err });
    return null;
  }
}