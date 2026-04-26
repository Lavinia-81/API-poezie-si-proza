// src/controllers/autorController.js
import fs from "fs";
import path from "path";
import logger from "../logger/logger.js";
import { loadAutorData } from "../utils/loadAutorData.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -----------------------------------------------------
// Poeziile unui autor
// -----------------------------------------------------
export function poeziiAutor(req, res) {
  try {
    const autor = req.params.autor;
    const data = loadAutorData(autor);

    if (!data) return res.status(404).json({ message: "Author not found" });

    res.json(data.poezii || []);
  } catch (err) {
    logger.error("Error in poeziiAutor", { error: err.message });
    res.status(500).json({ message: "Internal server error" });
  }
}

// -----------------------------------------------------
// Proza unui autor
// -----------------------------------------------------
export function prozaAutor(req, res) {
  try {
    const autor = req.params.autor;
    const data = loadAutorData(autor);

    if (!data) return res.status(404).json({ message: "Author not found" });

    res.json(data.proza || []);
  } catch (err) {
    logger.error("Error in prozaAutor", { error: err.message });
    res.status(500).json({ message: "Internal server error" });
  }
}

// -----------------------------------------------------
// Text poezie
// -----------------------------------------------------
export function poezieText(req, res) {
  try {
    const autor = req.params.autor;
    const id = req.params.id;

    const data = loadAutorData(autor);
    if (!data) return res.status(404).json({ message: "Author not found" });

    const poezie = data.poezii.find(p => p.id === id);
    if (!poezie) return res.status(404).json({ message: "Poem not found" });

    const filePath = path.join(__dirname, "../../", poezie.versuri_path);
    const text = fs.readFileSync(filePath, "utf8");

    res.type("text/plain").send(text);
  } catch (err) {
    logger.error("Error in poezieText", { error: err.message });
    res.status(500).json({ message: "Internal server error" });
  }
}

// -----------------------------------------------------
// Text proză
// -----------------------------------------------------
export function prozaText(req, res) {
  try {
    const autor = req.params.autor;
    const id = req.params.id;

    const data = loadAutorData(autor);
    if (!data) return res.status(404).json({ message: "Author not found" });

    const proza = data.proza.find(p => p.id === id);
    if (!proza) return res.status(404).json({ message: "Prose not found" });

    const filePath = path.join(__dirname, "../../", proza.versuri_path);
    const text = fs.readFileSync(filePath, "utf8");

    res.type("text/plain").send(text);
  } catch (err) {
    logger.error("Error in prozaText", { error: err.message });
    res.status(500).json({ message: "Internal server error" });
  }
}

// -----------------------------------------------------
// Bibliografie
// -----------------------------------------------------
export function bibliografieText(req, res) {
  try {
    const autor = req.params.autor;
    const data = loadAutorData(autor);

    if (!data) return res.status(404).json({ message: "Author not found" });

    const filePath = path.join(__dirname, "../../", data.bibliografie_path);
    const text = fs.readFileSync(filePath, "utf8");

    res.type("text/plain").send(text);
  } catch (err) {
    logger.error("Error in bibliografieText", { error: err.message });
    res.status(500).json({ message: "Internal server error" });
  }
}

// -----------------------------------------------------
// Poza autorului
// -----------------------------------------------------
export function pozaAutor(req, res) {
  try {
    const autor = req.params.autor;
    const data = loadAutorData(autor);

    if (!data) return res.status(404).json({ message: "Author not found" });

    const filePath = path.join(__dirname, "../../", data.poza);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.sendFile(filePath);
  } catch (err) {
    logger.error("Error in pozaAutor", { error: err.message });
    res.status(500).json({ message: "Internal server error" });
  }
}
