# 📚 API – Poeții Clasici Români  
Un API Node.js + Express care oferă acces la operele marilor poeți români: poezii, proză, bibliografie și imagini.  
Datele sunt citite direct din structura de fișiere a fiecărui autor, fără baze de date externe.


## 📁 Structura proiectului
API‑ul funcționează indiferent dacă folderul principal conține sau nu diacritice:
- Poezi si Proza (fără diacritice)
- Poezi și Proză (cu diacritice)

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

Este ideal pentru:
- aplicații web
- proiecte educaționale
- aplicații mobile
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
`GET /api/poeti` => Returnează lista folderelor din data/.

📜 2. Toate poeziile unui autor
`GET /api/autor/:autor/poezii`
Exemplu: /api/autor/mihai_eminescu/poezii

📘 3. Toată proza unui autor
`GET /api/autor/:autor/proza`

🔎 4. Căutare după titlu (poezie + proză)
`GET /api/cauta/:autor/:titlu`
Exemplu: /api/cauta/mihai_eminescu/adio

🆔 5. Căutare după ID (fără text)
`GET /api/autor/:autor/id/:id`

✍️ 6. Poezie în format JSON (cu titlu + text)
`GET /api/poezie/:autor/:id/versuri`

  Returnează:
    {
      "id": "poezie-1",
      "titlu": "Adio",
      "tip": "poezie",
      "continut": "Textul poeziei..."
    }

📝 7. Poezie integrală (doar text simplu)
`GET /api/poezie/:autor/:id/text`
Returnează exact conținutul fișierului .txt.

📚 8. Bibliografie (text simplu)
`GET /api/autor/:autor/bibliografie/text`
Returnează conținutul fișierului Note Bibliografice.txt

🖼️ 9. Poza autorului
`GET /api/autor/:autor/poza`
Returnează imaginea ca fișier


## 🛡️ Securitate
API‑ul include:
- protecție împotriva path traversal
- validare parametri
- middleware anti‑injection
- rate limiting
- CORS configurabil
- acces controlat la fișiere
Aceste măsuri asigură un API stabil, sigur și pregătit pentru producție.


## 🧩 Observații
- API‑ul este tolerant la diacritice și la variații de nume.
- Structura este modulară și ușor de extins.
- Pentru a adăuga un autor nou, este suficient să creezi folderul și fișierul JSON.
- Endpoint‑urile sunt optimizate pentru consum rapid și caching.


## 📝 Licență
Acest proiect este distribuit sub licența MIT, una dintre cele mai permisive și utilizate licențe open‑source.
Aceasta îți oferă libertatea de a utiliza, modifica, distribui și integra codul în proiecte personale sau comerciale, cu condiția păstrării notificării de copyright.
Pentru detalii complete, consultă fișierul
LICENSE


## ❤️ Autor
Acest API a fost construit cu grijă pentru a oferi acces modern, sigur și elegant la literatura românească clasică.
Proiect dezvoltat de Maria Lavinia Dusca.

