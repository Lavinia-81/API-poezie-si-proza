# 🔐 Security Plan — Poezii & Proză API
Arhitectură, politici și controale pentru un API sigur, scalabil și rezilient.

## 1. Purpose of This Document
Acest document definește politicile, controalele și măsurile tehnice necesare pentru a proteja API‑ul Poezii și Proză împotriva:
- accesului neautorizat
- abuzului
- expunerii de date
- degradării performanței
- atacurilor cibernetice
Documentul servește ca fundație pe termen lung pentru dezvoltare, mentenanță și scalare în condiții de securitate.

## 2. Security Objectives
- Prevenirea atacurilor comune: injection, path traversal, DoS, brute‑force.
- Protejarea sistemului de fișiere și a structurii interne.
- Asigurarea disponibilității API‑ului chiar și sub trafic malițios.
- Menținerea integrității conținutului literar și a metadatelor.
- Implementarea unui model de securitate scalabil.
- Creșterea vizibilității prin logging și monitorizare.

## 3. Threat Model
### 3.1. Potential Attack Vectors
- Path traversal (../../etc/passwd)
- Unicode spoofing (litere grecești/rusești care arată ca latine)
- Null-byte injection (%00)
- Injection prin parametri URL
- Requesturi masive (scraping, brute-force)
- Denial‑of‑Service (DoS)
- Requesturi malformate care pot bloca Express
- Exploatarea endpointurilor publice fără autentificare
- Crearea abuzivă de sesiuni Stripe
### 3.2. Assets to Protect
- Fișiere literare .txt
- Metadate .json
- Imagini ale autorilor
- Resurse server (CPU, RAM, I/O)
- Structura internă a directoarelor
- Datele utilizatorilor (în cazul Stripe sau MongoDB)

## 4. Existing Security Controls
### 4.1. Path Traversal Protection
Toate accesările de fișiere trec prin safePath(), care blochează ieșirea din directorul data/.
### 4.2. Input Filtering Middleware
Middleware global care blochează caractere periculoase:
- ..
- <, >
- %00
- caractere de control
### 4.3. Rate Limiting
Limite per IP pentru a preveni:
- brute-force
- scraping agresiv
- DoS de nivel mic
### 4.4. CORS Restrictiv
Doar origini aprobate pot accesa API‑ul.
### 4.5. No Dynamic Code Execution
Nu se folosesc:
- eval
- Function()
- child_process.exec
### 4.6. Sanitized Error Messages
Nu expui:
- path-uri interne
- stack traces
- informații sensibile

## 5. Immediate Security Enhancements (High Priority)
### 5.1. Strict Parameter Validation
Toate rutele trebuie să valideze TOȚI parametrii:
- autor → normalizare Unicode NFKC + doar alfabet românesc
- id → regex strict + lungime limitată
- titlu → lungime maximă + caractere permise
Validator recomandat: Zod sau Joi.

### 5.2. Structured Logging (Winston / Pino)
Loguri separate:
`/logs/security.log`
`/logs/server.log`


Loghează:
- tentative de atac
- input suspect
- path traversal blocat
- rate-limit violations
- erori de acces la fișiere
- requesturi anormale

### 5.3. Health Check Endpoint
Adaugă:
`GET /api/health`


Răspuns:
  `{
    "status": "ok",
    "timestamp": "...",
    "version": "1.0.0"
  }`



### 5.4. Protecție pentru Stripe
Endpointul /create-checkout-session trebuie:
- autentificare (verifyApiKey)
- validare strictă pentru plan
- rate limiting dedicat

## 6. Medium‑Term Enhancements
### 6.1. Reverse Proxy & Edge Protection (Cloudflare)
Beneficii:
- DDoS protection
- WAF rules
- Bot filtering
- Caching pentru imagini și texte
- Rate limiting la nivel de edge

### 6.2. Internal Caching Layer
Cache pentru:
- lista autorilor
- JSON metadata
- bibliografii
- textul poeziilor/prozelor
Beneficii:
- reducerea accesului la disc
- performanță crescută
- reziliență sub trafic mare

### 6.3. HTTP Compression
Activează compression() pentru:
- răspunsuri mai rapide
- consum redus de bandă

## 7. Long‑Term Enhancements
### 7.1. Automated Security Testing
Testare cu Jest + Supertest pentru:
- input invalid
- path traversal
- Unicode spoofing
- rate limiting
- stabilitatea endpointurilor

### 7.2. SECURITY.md Policy
Include:
- cum se raportează vulnerabilitățile
- politica de divulgare responsabilă
- versiuni suportate

### 7.3. Monitoring & Alerts
Recomandări:
- UptimeRobot
- BetterStack
- Healthchecks.io
Monitorizează:
- uptime
- latență
- rate-limit hits
- erori 4xx/5xx

### 8. Operational Security Practices
- Rulează Node.js sub un user non‑root
- Setează folderul data/ ca read‑only
- Backup regulat pentru .json și .txt
- Revizuiește logurile săptămânal
- Actualizează dependențele lunar (npm audit, npm outdated)
- Nu expune structura internă a directoarelor în răspunsuri
- Normalizează TOATE inputurile Unicode

## 9. Security Roadmap
Phase 1 — Immediate
- Validare parametri
- Logging profesionist
- Health check
- Protecție Stripe
Phase 2 — Within 2 Weeks
- Cloudflare
- Caching intern
- HTTP compression
Phase 3 — Ongoing
- Teste automate
- Monitorizare
- Documentație SECURITY.md

## 10. Conclusion
Acest plan oferă o strategie completă, scalabilă și profesionistă pentru securizarea API‑ului Poezii și Proză.
Implementarea acestor controale va asigura:
- stabilitate
- reziliență
- protecție împotriva atacurilor
- performanță ridicată
- integritatea patrimoniului literar românesc
