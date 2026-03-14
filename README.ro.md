# 📚 API –  Poezii și Proză - Poeții Clasici ai României

[![Documentation](https://img.shields.io/badge/Docs-OpenAPI%20Redoc-blue)](https://lavinia-81.github.io/API-Poezii-si-Proza/)
![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0-green)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express.js-API-blue)
![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0-yellow)
![License: MIT](https://img.shields.io/badge/License-MIT-purple)
![Status](https://img.shields.io/badge/Status-Active-success)

---

## 📄 Documentație API

Documentația completă este disponibilă aici:  
👉 https://lavinia-81.github.io/API-Poezii-si-Proza/

`/docs/swagger.html` 
`/docs/home.html` 
---

## 📚 Descriere

Acest API oferă acces la poezii, proză, bibliografie și imagini ale autorilor clasici români.  
Este un API **read-only**, curat, scalabil și structurat pentru utilizare educațională și literară.
Datele sunt citite direct din structura de fișiere a fiecărui autor, fără baze de date externe.

---

## ✨ Funcționalități

- 📜 Acces la poezie clasică românească
- 📘 Acces la proză și povestiri
- 🖼️ Imagini ale autorilor (JPEG/PNG)
- 🧾 Text biografic pentru fiecare autor
- 🔍 Căutare după autor și titlu
- 📂 Structură curată, bazată pe fișiere (fără bază de date)
- 🔒 API doar pentru citire — sigur pentru utilizare publică
- 🌐 Documentație completă folosind OpenAPI 3.0.3
- 🎨 Interfață elegantă Redoc + opțional Swagger U

---

## 📁 Structura proiectului

API‑ul funcționează indiferent dacă folderul principal conține sau nu diacritice:
- Poezii si Proza (fără diacritice)
- Poezii și Proză (cu diacritice)

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
    └── 
├── docs/
│   ├── index.html        
│   ├── pana.jpg
│   └── home.html         
├── openapi.yaml         
├── LICENSE            
├── README.md
└── server.js   
```
    Fiecare autor are:
    - un fișier JSON cu metadate
    - un folder cu poezii (.txt)
    - un folder cu proză (.txt)
    - un folder cu bibliografie și imagin

    Exemplu de JSON:
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

## ⚙️ Funcționare

API‑ul:
- detectează automat folderul principal (cu sau fără diacritice)
- încarcă JSON‑ul fiecărui autor
- citește fișierele .txt pentru poezii, proză și bibliografie
- servește imaginile autorilor
- normalizează numele autorilor pentru a permite URL‑uri flexibil
- servește imaginile autorilor
- folosește caching intern pentru performanță
- protejează accesul la fișiere prin safePath (anti‑path‑traversal)

Este ideal pentru:
- aplicații web
- aplicații mobile
- biblioteci online
- proiecte educaționale
- arhive literare digitale

---

## 🛠 Tehnologii

- Node.js  
- Express  
- OpenAPI 3.0  
- Redoc  
- GitHub Pages  

---

## 🚀 Pornirea serverului

```bash
git clone https://github.com/lavinia-81/API-Poezii-si-Proza.git
cd API-Poezii-si-Proza
npm install
npm start
Serverul rulează implicit pe: `http://localhost:3000`
```
---

## 📡 Endpoint‑uri disponibil
```
🔍 1. Lista tuturor poeților
`GET /api/poeti`
Returnează lista folderelor din data/.

📜 2. Toate poeziile unui autor
`GET /api/autor/:autor/poezii`
Exemplu: /api/autor/Mihai%20Eminescu/poezii

📘 3. Toată proza unui autor
`GET /api/autor/:autor/proza`

🔎 4. Căutare după titlu (poezie + proză)
`GET /api/cauta/:autor/:titlu`
Exemplu: /api/cauta/mihai_eminescu/adio

🆔 5. Căutare după ID  (fără text)
`GET /api/autor/:autor/id/:id`
Exemplu: /api/autor/Mihai%20Eminescu/poezie/poezie-1/text

✍️ 6. Poezie în format JSON (cu titlu + text)
`GET /api/autor/:autor/poezie/:id/text`

  Returnează:
    {
      "id": "poezie-1",
      "titlu": "Adio",
      "tip": "poezie",
      "continut": "Textul poeziei..."
    }

📚 7. Bibliografie (text simplu)
`GET /api/autor/:autor/bibliografie/text`
Returnează conținutul fișierului Note Bibliografice.txt

🖼️ 7. Afiseaza fotografia unui autor
`GET /api/autor/:autor/poza`
```
---

## 🛡️ Securitate

API‑ul include:
- protecție împotriva path traversal
- validare parametri
- middleware anti‑injection
- rate limiting
- CORS configurabil
- acces controlat la fișiere
- caching intern pentru performanță
Aceste măsuri îl fac potrivit pentru producție.

---

## 🧩 Observații

- API‑ul este tolerant la diacritice și la variații de nume.
- Structura este modulară și ușor de extins.
- Pentru a adăuga un autor nou, este suficient să creezi folderul și fișierul JSON.
- Endpoint‑urile sunt optimizate pentru consum rapid și caching.
- Nu necesită baze de date — totul este file‑based

---

## 📝 Licență

Acest proiect este distribuit sub licența MIT, una dintre cele mai permisive și utilizate licențe open‑source.
Aceasta îți oferă libertatea de a utiliza, modifica, distribui și integra codul în proiecte personale sau comerciale, cu condiția păstrării notificării de copyright.
Pentru detalii complete, consultă fișierul
LICENSE

---

## ❤️ Autor

Acest API a fost construit cu grijă pentru a oferi acces modern, sigur și elegant la literatura românească clasică.
Proiect dezvoltat de Maria Lavinia.

