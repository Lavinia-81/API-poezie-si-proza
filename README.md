# 📚 Romanian Classical Literature API
A Node.js + Express API that provides structured access to the works of major Romanian classical authors: poetry, prose, bibliography, and author images.
The API reads data directly from the project’s folder structure, making it easy to maintain, extend, and integrate into educational or cultural applications.


## 📁 Project Structure
The API automatically detects the main directory, whether it is named:
- Poezi si Proza (without diacritics), or
- Poezi și Proză (with diacritics)
Internal structure:

Poezi și Proză/
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


## Each author folder contains:
- poezii/ – poetry text files
- proza/ – prose text files
- bibliografie/ – author image + bibliography
- JSON metadata file – author info + file path


## 📦 Author JSON Structure
Each author has a JSON file containing metadata and references to their works
{
  "autor": "Mihai Eminescu",
  "poza": "data/Mihai Eminescu/bibliografie/Eminescu.jpg",
  "bibliografie_path": "data/Mihai Eminescu/bibliografie/Note Bibliografice.txt",
  "poezii": [...],
  "proza": [...]
}


## 🚀 Running the Server
Install dependencies (if needed):
`npm install`

Start the server:
`npm start`

Development mode (auto‑reload):
`npm run dev`
Default address:
`http://localhost:3000`



## 📡 Available Endpoints
🔍 1. List all authors
`GET /api/poeti`

📜 2. Get all poems by an author
`GET /api/autor/:autor/poezii`
Example: /api/autor/mihai_eminescu/poezii

📘 3. Get all prose by an author
`GET /api/autor/:autor/proza`

🔎 4. Search by title (poetry + prose)
`GET /api/cauta/:autor/:titlu`
Example: `/api/cauta/mihai_eminescu/luceafarul`

🆔 5. Search by ID (metadata only)
`GET /api/autor/:autor/id/:id`

✍️ 6. Get poem as JSON (title + text)
`GET /api/poezie/:autor/:id/versuri`
Example response:
{
  "id": "poezie-1",
  "titlu": "Adio",
  "tip": "poezie",
  "continut": "Full poem text..."
}

📝 7. Get poem text only
`GET /api/poezie/:autor/:id/text`
Returns the raw .txt content.

📚 8. Get bibliography text
`GET /api/autor/:autor/bibliografie/text`

🖼️ 9. Get author image
`GET /api/autor/:autor/poza`
Returns the image file.


## 🛡️ Security
The API includes:
- path traversal protection
- parameter validation
- anti‑injection middleware
- rate limiting
- strict CORS configuration
- controlled file access
These measures ensure a stable, safe, and production‑ready environment.


## 🧩 Notes
- The API is fully file‑based: adding a new author requires only a folder and a JSON file.
- The system automatically handles folder names with or without diacritics.
- The structure is modular, clean, and easy to extend.
- Ideal for educational apps, literary archives, digital humanities, and cultural preservation projects.


## 📝 License
This project is distributed under the MIT License, a permissive open‑source license that allows reuse, modification, and distribution with minimal restrictions.
See the full license text in the LICENSE file


## ❤️ About This Project
This API was built to provide modern, structured access to Romanian classical literature, preserving cultural heritage while enabling developers,educators, and researchers to integrate it into contemporary digital experiences.
