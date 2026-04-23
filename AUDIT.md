# 🔍 Security & Quality Audit — Poezii și Proză API
Acest audit evaluează arhitectura, securitatea, performanța și scalabilitatea API‑ului tău Node.js + Express, care servește conținut literar din fișiere locale.


## 🛡️ 1. Security Audit
✔️ 1.1. Strengths (lucruri deja implementate corect)
✓ Path Traversal Protection
Utilizarea safePath() împiedică accesul la fișiere din afara directorului data/.
Este una dintre cele mai importante măsuri pentru un API care servește fișiere.
✓ Input Validation Middleware
Există un sistem de validare (Zod/Joi sau custom) pentru unele rute.
Acesta reduce riscul de:
- path traversal
- malformed input
- Unicode spoofing (parțial)
✓ API Key Authentication (pe majoritatea rutelor)
Protejează resursele împotriva accesului neautorizat.
✓ Rate Limiting
Limitează numărul de requesturi per IP, reducând riscul de:
- brute force
- scraping agresiv
- DoS de nivel mic
✓ CORS Restrictiv
Permiți doar origini specifice — foarte bine pentru un API public.
✓ Fără execuție de cod dinamic
Nu folosești:
- eval
- Function()
- child_process.exec
Elimină o categorie întreagă de vulnerabilități.

⚠️ 1.2. Weaknesses (riscuri identificate)
⚠️ 1.2.1. Validare incompletă a parametrilor
Unele rute validează doar id, dar nu și autor sau titlu.
Riscuri:
- Unicode spoofing
- control characters
- path traversal indirect
- input malițios
Recomandare:
Validare strictă pentru TOȚI parametrii.

⚠️ 1.2.2. Unele rute sunt publice fără API key
Exemple:
- /poezii
- /proza
- /cautare/:autor/:titlu
Riscuri:
- scraping masiv
- brute-force
- DoS
Recomandare:
Adaugă verifyApiKey pe toate rutele sensibile.

⚠️ 1.2.3. Lipsa sanitizării pentru autor și titlu
Fără normalizare Unicode, pot apărea:
- caractere rusești/grecești care arată identic
- diacritice compuse/decompuse
- %00 injection
Recomandare:
Normalizează cu NFKC și permite DOAR alfabetul românesc.

⚠️ 1.2.4. Lipsa protecției împotriva requesturilor foarte mari
Express poate crăpa dacă primește:
- URL-uri de 100k caractere
- header-uri uriașe
Recomandare:
Setează limite în express.json() și express.urlencoded().

⚠️ 1.2.5. Lipsa unui sistem de logging profesionist
console.log nu este suficient pentru:
- tentative de atac
- erori de acces la fișiere
- requesturi suspecte
Recomandare:
Folosește Winston sau Pino.

⚠️ 1.2.6. Endpoint Stripe fără protecție
/create-checkout-session este public.
Riscuri:
- fraudă
- spam Stripe sessions
- costuri neprevăzute
Recomandare:
Adaugă verifyApiKey + validare strictă.



## ⚙️ 2. Architecture Audit
✔️ 2.1. Strengths
✓ Arhitectură modulară
Controllers, services, utils, routes — bine separate.
✓ File-based content
Simplu, transparent, ușor de extins.
✓ JSON metadata per author
Separă clar:
- metadatele
- conținutul
- structura folderelor

⚠️ 2.2. Weaknesses
⚠️ 2.2.1. Caching incomplet
Unele servicii folosesc cache, altele nu.
Unele cache-uri nu invalidează fișiere modificate.
Recomandare:
Cache unificat + invalidare manuală.

⚠️ 2.2.2. Lipsa unui health check
Nu există un endpoint pentru monitorizare.
Recomandare:
GET /api/health

🚀 3. Performance Audit
✔️ 3.1. Strengths
- Node.js excelent pentru I/O
- Fișiere mici
- Structură simplă

⚠️ 3.2. Weaknesses
⚠️ 3.2.1. Citire repetată a fișierelor
Fiecare request re-citește .txt și .json.
Recomandare:
Cache în memorie.

⚠️ 3.2.2. Lipsa compresiei
Fără compression(), răspunsurile text sunt mai mari decât trebuie.

🧩 4. Maintainability Audit
✔️ 4.1. Strengths
- cod clar
- funcții bine separate
- endpointuri intuitive
- structura proiectului logică

⚠️ 4.2. Weaknesses
⚠️ 4.2.1. Lipsa testelor
Nu există teste unitare sau de integrare.
Recomandare:
Jest + Supertest.

⚠️ 4.2.2. Lipsa documentației OpenAPI
Nu există un fișier openapi.yaml.

📈 5. Scalability Audit
⚠️ 5.1. Weaknesses
⚠️ 5.1.1. File-based storage nu scalează
Pentru trafic mare, filesystem-ul devine bottleneck.
⚠️ 5.1.2. Lipsa unui CDN
Imaginile și textele nu sunt servite prin caching extern.

## 🏆 6. Overall Rating
| Categorie       |  Evaluare         |
| Security        | ⭐⭐⭐⭐☆ (4/5) | 
| Architecture    | ⭐⭐⭐⭐☆ (4/5) | 
| Performance     | ⭐⭐⭐☆☆ (3/5)  | 
| Maintainability | ⭐⭐⭐⭐☆ (4/5) | 
| Scalability     | ⭐⭐⭐☆☆ (3/5)  | 


## 🎯  7. Recommended Next Steps
🔐 Securitate
- Validare strictă pentru autor, id, titlu
- Normalizare Unicode (NFKC)
- Autentificare pe toate rutele sensibile
- Rate limiting global + per rută
- Logging profesionist (Winston/Pino)
- Protecție Stripe endpoint
⚙️ Arhitectură
- Cache unificat pentru fișiere
- Health check endpoint
🚀 Performanță
- Adaugă compression()
- CDN / Cloudflare caching
🧪 Testare & Documentație
- Teste automate (Jest + Supertest)
- Documentație OpenAPI
