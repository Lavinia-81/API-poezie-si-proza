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
https://lavinia-81.github.io/API-poezie-si-proza/

### 🔗 Swagger UI (optional)
`/docs/swagger.html` 
`/docs/home.html` 

---

##  📚 Description

A modern **Node.js + Express** API that provides structured access to the works of major Romanian classical authors: poetry, prose, bibliography, and author images.

The API is now backed by a full SaaS architecture, including:

- user accounts
- API keys
-  plans (Free, Basic, Premium)
- Stripe Checkout
- Stripe Webhooks
- rate limiting per plan
- secure access to all endpoints
The literary content remains file‑based, predictable, and easy to extend.

---

## ✨ Features

- 📜 Access to classical Romanian poetry  
- 📘 Access to prose and poesis 
- 🖼️ Author images (JPEG/PNG)  
- 🧾 Bibliography text for each author  
- 🔍 Search by author and title  
- 📂 File‑based architecture (easy to extend)   
- 🔒 Read‑only API — safe for public use  
- 🌐 Fully documented using **OpenAPI 3.0.3**  
- 🎨 Elegant Redoc UI + optional Swagger UI  
- 🔤 Full support for **diacritics and case‑insensitive author names** 

---

## 🛡️ Security

- Path traversal protection
- Anti‑injection middleware
- Strict CORS
- CSP‑compliant frontend
- Anti‑abuse per‑minute limiter
- Read‑only file access
- Webhook signature verification

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

## 🧪 Subscription Plans
Plan	Limits	Billing	Features
Free	500 requests/day	Free	API key, read-only access
Basic	5000 requests/month	Paid (Stripe)	Higher limits, Customer Portal
Premium	50,000 requests/month	Paid (Stripe)	Highest limits, priority access

---

## Stripe Integration
Stripe Checkout (subscription mode)
Webhooks:
- ``checkout.session.completed``
- ``customer.subscription.updated``
- ``customer.subscription.deleted``
- Automatic user creation
- Automatic plan updates
- Pending cancellation
- Downgrade to Free

---

## 🛠 Technologies used

- Node.js  
- Express  
- OpenAPI 3.0  
- Redoc  
- GitHub Pages

---

## 📡 Endpoints (Protected by API Key)

The API exposes the following main resources:
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
All endpoints are **read‑only**

--- 

## 🔐 Authentication
# Register (Free plan)
```
POST /auth/register
  {
    "email": "user@example.com"
  }
  ```

# Login
```POST /auth/login```

# API Key Usage
```GET /poeti?apiKey=YOUR_API_KEY```

---

## 🧩 Notes

- The API is fully file‑based: adding a new author requires only a folder and a JSON file.
- Folder names with or without diacritics are supported automatically.
- The structure is modular, clean, and easy to extend.
- Ideal for educational apps, literary archives, digital humanities, and cultural preservation projects.

---

## 📝 License

Distributed under the MIT License.
See the LICENSE file for details

---

## ❤️ About This Project

This API was built to preserve and modernize access to Romanian classical literature, enabling developers, educators, and researchers to integrate cultural heritage into modern digital experiences
