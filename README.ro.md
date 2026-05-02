# 📚 API –  Poezii și Proză - Poeții Clasici ai României
### Acces modern la literatura clasică românească + platformă API completă cu planuri și abonamente

[![Documentation](https://img.shields.io/badge/Docs-OpenAPI%20Redoc-blue)](https://lavinia-81.github.io/API-Poezii-si-Proza/)
![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0-green)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express.js-API-blue)
![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0-yellow)
![License: MIT](https://img.shields.io/badge/License-MIT-purple)
![Status](https://img.shields.io/badge/Status-Active-success)

---

## 📄 Documentație API

### 🔗 Redoc (recomandat)
https://lavinia-81.github.io/API-poezie-si-proza/

### 🔗 Swagger UI (optional)
`/docs/swagger.html` 
`/docs/home.html` 

---

## 📚 Descriere

Acest proiect oferă un API modern, construit cu **Node.js + Express**, care pune la dispoziție operele marilor autori clasici români: poezii, proză, bibliografie și imagini.

Pe lângă accesul la conținut literar, API‑ul include acum o platformă completă de abonamente, cu:
- conturi de utilizator
- chei API
- planuri Free / Basic / Premium
- Stripe Checkout
- Stripe Webhooks
- rate‑limiting în funcție de plan
- Customer Portal
- pagini bilingve (EN/RO)
- securitate avansată
Conținutul literar rămâne file‑based, ușor de extins și fără baze de date.

---

## ✨ Funcționalități

### 📖 Acces la literatură
- Poezii clasice româneșt
- Proză și povestiri
- Bibliografie text
- Imagini ale autorilor
- Căutare după autor și titlu
- Suport complet pentru diacritice

### 🧩 Funcționalități API Platform
- Înregistrare utilizatori (plan Free)
- Stripe Checkout pentru Basic & Premium
- Creare automată utilizator prin webhook
- Generare automată API key
- Rate‑limiting zilnic/lunar
- Upgrade / downgrade abonament
- Pending cancellation + cancelAt
- Downgrade automat la Free
- Customer Portal securizat
- Interfață bilingvă (EN/RO)

### 🛡️ Securitate
- Protecție path traversal
- Middleware anti‑injection
- CORS strict
- CSP compatibil
- Limitare per minut anti‑abuz
- Verificare semnătură webhook
- Acces read‑only la fișiere
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
├── src/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── createCheckout.js
│   │   ├── webhook.js
│   │   ├── authors.js
│   │   └── search.js
│   ├── middleware/
│   │   ├── verifyApiKey.js
│   │   ├── rateLimiter.js
│   │   └── security.js
│   ├── models/
│   │   └── User.js
│   └── config/
│       └── stripe.js
│
├── public/
│   ├── success.html
│   ├── cancel.html
│   ├── dashboard.html
│   └── js/
│       ├── success.js
│       ├── cancel.js
│       └── dashboard.js
│
├── docs/
│   ├── index.html
│   ├── pana.jpg
│   └── home.html
│
├── openapi.yaml
├── LICENSE
├── README.md
└── server.js

```

---

## 📦 Structura JSON pentru fiecare autor
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

## 💳 Planuri și abonamente
```
Plan	Limită	Facturare	Beneficii
Free	500 cereri/zi	Gratuit	API key, acces read‑only
Basic	5000 cereri/lună	Stripe	Limite mai mari, Customer Portal
Premium	50.000 cereri/lună	Stripe	Limite maxime, prioritate
```

---

## Stripe Integration
### Stripe Checkout (subscription mode)
- Webhook‑uri:
- ``checkout.session.completed``
- ``customer.subscription.updated``
- ``customer.subscription.deleted``
- Creare automată utilizator
- Actualizare automată plan
- Pending cancellation
- Downgrade automat la Free

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

## 📡 Endpoint‑uri (protejate cu API key

```
GET /poeti
GET /autor/{autor}/poezii
GET /autor/{autor}/proza
GET /autor/{autor}/id/{id}
GET /autor/{autor}/poezie/{id}/text
GET /autor/{autor}/bibliografie/text
GET /autor/{autor}/poza
GET /cauta/{autor}/{titlu}
```

---

## 🔐 Autentificare
### Înregistrare (plan Free)
```
POST /auth/register
{
  "email": "user@example.com"
}
```

### Login
```POST /auth/login```

### Folosirea API key‑ului
```GET /poeti?apiKey=CHEIA_TA_API```

## 🛠 Instalare
```
git clone https://github.com/lavinia-81/API-Poezii-si-Proza.git
cd API-Poezii-si-Proza
npm install
npm start
Serverul rulează la:```http://localhost:3000
```

---

## 🧩 Observații

- API‑ul este tolerant la diacritice și la variații de nume.
- Structura este modulară și ușor de extins.
- Pentru a adăuga un autor nou, este suficient să creezi folderul și fișierul JSON.
- Endpoint‑urile sunt optimizate pentru consum rapid și caching.
- Nu necesită baze de date — totul este file‑based

---

## 📝 Licență

Acest proiect este distribuit sub licența MIT.
Pentru detalii complete, consultă fișierul LICENSE

---

## Despre proiect
Acest API a fost creat pentru a moderniza accesul la literatura românească clasică și pentru a o integra în aplicații educaționale, culturale și digitale moderne.

---

## ❤️ Autor

Acest API a fost construit cu grijă pentru a oferi acces modern, sigur și elegant la literatura românească clasică.
Proiect dezvoltat de Maria Lavinia.

## Notă:  
Notă privind performanța API‑ului  
Acest serviciu rulează în prezent pe un plan gratuit Render.
Prima cerere după o perioadă de inactivitate poate avea o întârziere de aproximativ 60 de secunde, deoarece instanța este repornită automat.
După activare, toate răspunsurile sunt livrate instant.
Lucrăm la optimizări și viitoare actualizări pentru a îmbunătăți experiența de utilizare.