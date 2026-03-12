## 1. Purpose of This Document
This security plan defines the policies, controls, and technical measures required to protect the Poezii și Proză API from unauthorized access, abuse, data exposure, and operational disruption.
It serves as a long‑term foundation for secure development, deployment, and maintenance.

## 2. Security Objectives
- Protect the API from common web attacks (injection, traversal, DoS).
- Protect the server and file system from unauthorized access.
- Ensure availability even under high load or malicious traffic.
- Maintain integrity of literary content and metadata.
- Enable safe scaling as the project grows.
- Provide transparency through logging and monitoring.


## 3. Threat Model
3.1. Potential Attack Vectors
- Path traversal attempts (../../etc/passwd)
- Injection via URL parameters
- High‑volume scraping or brute‑force requests
- Denial‑of‑Service (DoS)
- Unauthorized access to internal file paths
- Malformed requests designed to crash the server
- Exposure of stack traces or sensitive errors

3.2. Assets to Protect
- Literary text files (.txt)
- Author metadata (.json)
- Author images
- Server resources (CPU, memory, disk)
- Directory structure and internal paths


## 4. Existing Security Controls
The API already includes several strong protections:
4.1. Path Traversal Protection
All file access is routed through a safePath() function that ensures paths remain inside the project directory.
4.2. Anti‑Injection Middleware
A global middleware blocks suspicious characters and patterns in request parameters.
4.3. Rate Limiting
Limits the number of requests per IP to prevent brute force and DoS attempts.
4.4. CORS Restrictions
Only approved origins can access the API.
4.5. No Dynamic Code Execution
The API does not use eval, Function(), or shell execution.
4.6. Sanitized Error Messages
Internal paths and stack traces are not exposed to clients.


## 5. Immediate Security Enhancements (High Priority)
5.1. Parameter Validation
Introduce strict validation for all route parameters using a schema validator (Zod or Joi).
- autor → sanitized string
- id → regex pattern (poezie-\d+, proza-\d+)
- titlu → max length + safe characters
5.2. Structured Logging
Implement a logging system (Winston or Pino) to record:
- suspicious requests
- blocked traversal attempts
- rate‑limit violations
- server errors
Logs should be stored in:
`/logs/security.log`
`/logs/server.log`

5.3. Health Check Endpoint
Add: `GET /api/health`

Returns:
 {
  "status": "ok",
  "timestamp": "...",
  "version": "1.0.0"
}

## 6. Medium‑Term Enhancements
6.1. Reverse Proxy & Edge Protection
Place the API behind Cloudflare (free tier is enough):
- DDoS protection
- WAF rules
- Caching for static files
- Bot filtering
6.2. Internal Caching
Cache frequently accessed data:
- author list
- JSON metadata
- bibliography text
This reduces disk access and improves resilience.
6.3. HTTP Compression
Enable gzip/brotli compression for faster responses and reduced bandwidth.


## 7. Long‑Term Enhancements
7.1. Automated Security Testing
Add Jest + Supertest tests for:
- invalid input
- traversal attempts
- rate limiting
- endpoint stability
7.2. SECURITY.md Policy File
Create a public security policy describing:
- how to report vulnerabilities
- responsible disclosure guidelines
- supported versions
7.3. Monitoring & Alerts
Use external monitoring tools:
- UptimeRobot
- Healthchecks.io
- BetterStack
Monitor:
- uptime
- response time
- error rate


## 8. Operational Security Practices
- Run Node.js under a non‑root user
- Set data/ folder to read‑only
- Perform regular backups of JSON and text files
- Review logs weekly
- Update dependencies monthly (npm audit, npm outdated)
- Avoid exposing internal directory names in responses


## 9. Security Roadmap
Phase 1 — Immediate
- Parameter validation
- Logging
- Health check
Phase 2 — Within 2 Weeks
- Cloudflare protection
- Caching
- Compression
Phase 3 — Ongoing
- Automated tests
- Monitoring
- Security policy documentation


## 10. Conclusion
This plan provides a structured, scalable approach to securing the Poezii și Proză API.
By implementing the controls outlined here, the API will remain stable, resilient, and safe for public use while preserving the integrity of Romanian literary heritage.
