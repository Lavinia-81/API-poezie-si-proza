# 📚 Romanian Classical Literature API   
[![Documentation](https://img.shields.io/badge/Docs-OpenAPI%20Redoc-blue)](https://lavinia-81.github.io/API-Poezii-si-Proza/)
![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0-green)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express.js-API-blue)
![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0-yellow)
![License: MIT](https://img.shields.io/badge/License-MIT-purple)
![Status](https://img.shields.io/badge/Status-Active-success)

---

## 📄 API Documentation
Here is the complete documentation 
👉 https://lavinia-81.github.io/API-Poezii-si-Proza/

---

##  📚 Description
A Node.js + Express API that provides structured access to the works of major Romanian classical authors: poetry, prose, bibliography, and author images.
The API reads data directly from the project’s folder structure, making it easy to maintain, extend, and integrate into educational or cultural applications.

---

## 📁 Project Structure
The API automatically detects the main directory, whether it is named:
- Poezii si Proza (without diacritics), or
- Poezii și Proză (with diacritics)
Internal structure:

Poezii și Proză/
└── data/
    ├── Mihai Eminescu/
    │   ├── poezii/
    │   ├── proza/
    │   ├── bibliografie/
    │   │     ├── Eminescu.jpg
    │   │     └── Note Bibliografice.txt
    │   └── Mihai Eminescu.json
    │
    ├── George Topîrceanu/
    │   ├── poezii/
    │   ├── proza/
    │   ├── bibliografie/
    │   │     ├── George Topîrceanu.jpg
    │   │     └── Note Bibliografice.txt
    │   └── George Topîrceanu.json
    │
    └── ...
---

## Each author folder contains:
- poezii/ – poetry text files
- proza/ – prose text files
- bibliografie/ – author image + bibliography
- JSON metadata file – author info + file path

---

## 📦 Author JSON Structure
Each author has a JSON file containing metadata and references to their works
{
  "autor": "Mihai Eminescu",
  "poza": "data/Mihai Eminescu/bibliografie/Eminescu.jpg",
  "bibliografie_path": "data/Mihai Eminescu/bibliografie/Note Bibliografice.txt",
  "poezii": [...],
  "proza": [...]
}

---

## 🛠 Technologies used
- Node.js  
- Express  
- OpenAPI 3.0  
- Redoc  
- GitHub Pages

---

## 🚀 Running the Server
Install dependencies (if needed):
`npm install`

Start the server:
`npm start`

Development mode (auto‑reload):
`npm run dev`
Default address:
`http://localhost:3000`

---

## 📡 Available Endpoints
🔍 1. List all authors
`GET /api/poeti`

📜 2. Get all poems by an author
`GET /api/autor/:autor/poezii`
Example: /api/autor/mihai_eminescu/poezii

📘 3. Get all prose by an author
`GET /api/autor/:autor/proza`

🆔 4. Search by ID (metadata only)
`GET /api/autor/:autor/id/:id`

✍️ 5. Get poem as JSON (title + text)
`GET /api/poezie/:autor/:id/text`
Example response:
{
  "id": "poezie-1",
  "titlu": "Adio",
  "tip": "poezie",
  "continut": "Full poem text..."
}

📚 6. Get bibliography text
`GET /api/autor/:autor/bibliografie/text`

🖼️ 7. Get author image
`GET /api/autor/:autor/poza`
Returns the image file.

---

## 🛡️ Security
The API includes:
- path traversal protection
- parameter validation
- anti‑injection middleware
- rate limiting
- strict CORS configuration
- controlled file access
- internal caching for performance
These measures ensure a stable, safe, and production‑ready environment.

---

## 🧩 Notes
- The API is fully file‑based: adding a new author requires only a folder and a JSON file.
- Folder names with or without diacritics are supported automatically.
- The structure is modular, clean, and easy to extend.
- Ideal for educational apps, literary archives, digital humanities, and cultural preservation projects.

---

## 📝 License
This project is distributed under the MIT License, a permissive open‑source license that allows reuse, modification, and distribution with minimal restrictions.
See the full license text in the LICENSE file

---

## ❤️ About This Project
This API was built to provide modern, structured access to Romanian classical literature, preserving cultural heritage while enabling developers,educators, and researchers to integrate it into contemporary digital experiences.
