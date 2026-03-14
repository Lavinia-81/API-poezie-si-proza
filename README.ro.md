# 📚 API – Poeții Clasici Români  
## 📄 Documentație API
Documentația completă este disponibilă aici:  
[![Documentation](https://img.shields.io/badge/Docs-OpenAPI%20Redoc-blue)](https://lavinia-81.github.io/API-Poezii-si-Proza/)
![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0-green)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express.js-API-blue)
![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0-yellow)
![License: MIT](https://img.shields.io/badge/License-MIT-purple)
![Status](https://img.shields.io/badge/Status-Active-success)

Perfect, Maria — acum că documentația ta este LIVE și funcționează impecabil, Pasul 5 este despre profesionalizare.
Aici transformăm proiectul tău într-un API care arată ca unul enterprise, cu branding, badge-uri, linkuri clare și o prezentare impecabilă.
Hai să-l facem să arate ca un proiect matur, gata de portofoliu și de prezentat oricărui recrutor sau client.

⭐ PASUL 5 — Îmbunătățim README-ul și documentația publică
🎯 Obiectivele Pasului 5
- Adăugăm un badge de documentație
- Adăugăm un link vizibil către documentația Redoc
- Adăugăm un badge OpenAPI
- Facem README-ul să arate profesionist
- (opțional) Adăugăm și Swagger UI ca alternativă interactivă
- (opțional) Adăugăm un logo și culori personalizate în Redoc
Începem cu partea esențială: README-ul.

📘 1. Adăugăm badge-ul de documentație
Copiază acest badge în README.md:
[![Documentation](https://img.shields.io/badge/Docs-OpenAPI%20Redoc-blue)](https://lavinia-81.github.io/API-Poezii-si-Proza/)


Acum README-ul tău va avea un buton frumos care duce direct la documentație.

📘 2. Adăugăm linkul către documentație în partea de sus
În README.md, imediat sub titlu, pune:
## 📄 Documentație API
Documentația completă este disponibilă aici:  
👉 https://lavinia-81.github.io/API-Poezii-si-Proza/



📘 3. Adăugăm badge-ul OpenAPI
![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0-green)



📘 4. Structură profesională pentru README
Îți propun o structură completă, elegantă și potrivită pentru un proiect public:
# Romanian Classical Literature API

[![Documentation](https://img.shields.io/badge/Docs-OpenAPI%20Redoc-blue)](https://lavinia-81.github.io/API-Poezii-si-Proza/)
![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0-green)

## 📄 Documentație API
Documentația completă este disponibilă aici:  
👉 https://lavinia-81.github.io/API-Poezii-si-Proza/

---

## 📚 Descriere
Acest API oferă acces la poezii, proză și biografii ale autorilor clasici români.  
Este un API **read-only**, curat, scalabil și structurat pentru utilizare educațională și literară.

---

## 🚀 Funcționalități
- Acces la poezii clasice românești  
- Acces la proză scurtă  
- Biografii ale autorilor  
- Structură JSON standardizată  
- Documentație OpenAPI 3.0  
- Endpointuri curate și consistente  

---

## 🛠 Tehnologii
- Node.js  
- Express  
- OpenAPI 3.0  
- Redoc  
- GitHub Pages  

---

## 📦 Instalare locală
```bash
npm install
npm start



📁 Structura proiectului
API-Poezii-si-Proza/
│
├── openapi.yaml
├── docs/
│     └── index.html
├── src/
├── data/
└── README.md



📝 Licență
MIT License

Dacă vrei, îl pot genera complet personalizat pentru stilul tău.

---

# 🎨 5. (Opțional) Stilizăm Redoc cu logo și culori

Dacă vrei, putem transforma documentația într-o pagină elegantă, cu:

- logo-ul tău  
- culori personalizate  
- fonturi  
- layout modern  

Redoc permite asta foarte ușor.

---

# 🧪 6. (Opțional) Adăugăm și Swagger UI

Dacă vrei o versiune interactivă (unde poți testa endpointurile), pot genera și:


docs/swagger.html

cu Swagger UI.

---

# 💬 Spune-mi ce vrei să facem mai întâi:

1. **Badge-uri + README complet**  
2. **Stilizare Redoc (logo, culori, layout)**  
3. **Swagger UI**  
4. **Workflow GitHub Actions pentru validare OpenAPI**  

Alegi tu direcția și mergem mai departe.



![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express.js-API-blue)
![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0-yellow)
![License: MIT](https://img.shields.io/badge/License-MIT-purple)
![Status](https://img.shields.io/badge/Status-Active-success)

Un API Node.js + Express care oferă acces la operele marilor poeți români: poezii, proză, bibliografie și imagini.  
Datele sunt citite direct din structura de fișiere a fiecărui autor, fără baze de date externe.


## 📁 Structura proiectului
API‑ul funcționează indiferent dacă folderul principal conține sau nu diacritice:
- Poezii si Proza (fără diacritice)
- Poezii și Proză (cu diacritice)

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
    Fiecare autor are:
    - un fișier JSON cu metadate
    - un folder cu poezii (.txt)
    - un folder cu proză (.txt)
    - un folder cu bibliografie și imagin

    Exemplu de JSON:
      {
      "autor": "Mihai Eminescu",
      "poza": "data/Mihai Eminescu/bibliografie/Eminescu.jpg",
      "bibliografie_path": "data/Mihai Eminescu/bibliografie/Note Bibliografice.txt",
      "poezii": [...],
      "proza": [...]
     }


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


## 🚀 Pornirea serverului
Instalare dependențe:
`npm install`

Pornire server:
`npm start`

Mod dezvoltare (cu auto‑reload):
`npm run dev`

Serverul rulează implicit pe:
`http://localhost:3000`


## 📡 Endpoint‑uri disponibil

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


## 🧩 Observații
- API‑ul este tolerant la diacritice și la variații de nume.
- Structura este modulară și ușor de extins.
- Pentru a adăuga un autor nou, este suficient să creezi folderul și fișierul JSON.
- Endpoint‑urile sunt optimizate pentru consum rapid și caching.
- Nu necesită baze de date — totul este file‑based


## 📝 Licență
Acest proiect este distribuit sub licența MIT, una dintre cele mai permisive și utilizate licențe open‑source.
Aceasta îți oferă libertatea de a utiliza, modifica, distribui și integra codul în proiecte personale sau comerciale, cu condiția păstrării notificării de copyright.
Pentru detalii complete, consultă fișierul
LICENSE


## ❤️ Autor
Acest API a fost construit cu grijă pentru a oferi acces modern, sigur și elegant la literatura românească clasică.
Proiect dezvoltat de Maria Lavinia Dusca.

