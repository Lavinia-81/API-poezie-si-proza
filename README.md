# 📚 Poems and Prose - API - Romanian Classical Literature
[![Documentation](https://img.shields.io/badge/Docs-OpenAPI%20Redoc-blue)](https://lavinia-81.github.io/API-Poezii-si-Proza/)
![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0-green)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express.js-API-blue)
![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0-yellow)
![License: MIT](https://img.shields.io/badge/License-MIT-purple)
![Status](https://img.shields.io/badge/Status-Active-success)

---

## 🚀 Live Documentation
### 🔗 Redoc (recommended)
https://lavinia-81.github.io/API-Poezii-si-Proza/docs/

### 🔗 Swagger UI (optional)
`/docs/swagger.html` 
`/docs/home.html` 

---

##  📚 Description

A Node.js + Express API that provides structured access to the works of major Romanian classical authors: poetry, prose, bibliography, and author images.
The API reads data directly from the project’s folder structure, making it easy to maintain, extend, and integrate into educational or cultural applications.

---

## ✨ Features

- 📜 Access to classical Romanian poetry  
- 📘 Access to prose and poesis 
- 🖼️ Author images (JPEG/PNG)  
- 🧾 Bibliography text for each author  
- 🔍 Search by author and title  
- 📂 Clean file‑based structure (no database required)  
- 🔒 Read‑only API — safe for public use  
- 🌐 Fully documented using **OpenAPI 3.0.3**  
- 🎨 Elegant Redoc UI + optional Swagger UI  

---

## 📁 Project Structure

The API automatically detects the main directory, whether it is named:
- Poezii si Proza (without diacritics), or
- Poezii și Proză (with diacritics)
Internal structure:

```
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
├── docs/
│   ├── index.html        
│   ├── pana.jpg
│   └── home.html         
├── openapi.yaml         
├── LICENSE            
├── README.md
└── server.js     
```        
---

## Each author folder contains:

- poezii/ – poetry text files
- proza/ – prose text files
- bibliografie/ – author image + bibliography
- JSON metadata file – author info + file path

---

## 📦 Author JSON Structure

Each author has a JSON file containing metadata and references to their works
```
{
  "autor": "Mihai Eminescu",
  "poza": "data/Mihai Eminescu/bibliografie/Eminescu.jpg",
  "bibliografie_path": "data/Mihai Eminescu/bibliografie/Note Bibliografice.txt",
  "poezii": [...],
  "proza": [...]
}
```

---

## 🛠 Technologies used

- Node.js  
- Express  
- OpenAPI 3.0  
- Redoc  
- GitHub Pages

---

## 📦 Installation (local development)

```bash
git clone https://github.com/lavinia-81/API-Poezii-si-Proza.git
cd API-Poezii-si-Proza
npm install
npm start
Server runs at: `http://localhost:3000`
```
---

## 📡 Available Endpoints

The API exposes the following main resources:
```
- `/api/poeti` — list all authors  
- `/api/autor/{autor}/poezii` — poems by author  
- `/api/autor/{autor}/proza` — prose by author  
- `/api/autor/{autor}/id/{id}` — metadata by ID  
- `/api/autor/{autor}/poezie/{id}/text` — full poem text  
- `/api/autor/{autor}/bibliografie/text` — bibliography  
- `/api/autor/{autor}/poza` — author image  
- `/api/cauta/{autor}/{titlu}` — search  

```
All endpoints are **read‑only**

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
