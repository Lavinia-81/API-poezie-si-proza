const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const { z } = require('zod');
const winston = require('winston');

const app = express();
const PORT = 3000;

/* ============================================================
   LOGGER (WINSTON)
   ============================================================ */

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/server.log' }),
        new winston.transports.File({ filename: 'logs/security.log', level: 'warn' })
    ]
});

/* ============================================================
   SECURITATE GLOBALĂ
   ============================================================ */

// Compresie HTTP
app.use(compression());

// CORS – ajustează origin după nevoie
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET"]
}));

// Rate limiting
app.use(rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    handler: (req, res) => {
        logger.warn('Rate limit exceeded', { ip: req.ip, path: req.originalUrl });
        res.status(429).json({ mesaj: "Prea multe cereri. Încearcă mai târziu." });
    }
}));

// Anti-injection simplu
app.use((req, res, next) => {
    const forbidden = /(\.\.|<|>|script|%00|%2e%2e)/i;
    const all = JSON.stringify(req.query) + JSON.stringify(req.params);

    if (forbidden.test(all)) {
        logger.warn('Blocked suspicious input', { ip: req.ip, params: req.params, query: req.query });
        return res.status(400).json({ mesaj: "Parametri invalizi" });
    }
    next();
});

// Static (dacă ai nevoie)
app.use("/static", express.static(path.join(__dirname)));

/* ============================================================
   VALIDARE PARAMETRI (ZOD)
   ============================================================ */

const autorSchema = z.string().min(1).max(100);
const idSchema = z.string().min(1).max(100);
const titluSchema = z.string().min(1).max(200);

function validateParams(schemaMap) {
    return (req, res, next) => {
        try {
            for (const [key, schema] of Object.entries(schemaMap)) {
                if (req.params[key] === undefined) continue;
                schema.parse(req.params[key]);
            }
            next();
        } catch (err) {
            logger.warn('Parameter validation failed', {
                ip: req.ip,
                path: req.originalUrl,
                error: err.message
            });
            return res.status(400).json({ mesaj: "Parametri invalizi" });
        }
    };
}

/* ============================================================
   CACHING INTERN
   ============================================================ */

const cache = {
    autoriList: null,
    autoriData: new Map(),          // key: autor normalizat -> JSON autor
    poezieText: new Map(),          // key: versuri_path -> text
    bibliografieText: new Map()     // key: bibliografie_path -> text
};

/* ============================================================
   FUNCȚII UTILE
   ============================================================ */

function normalizeAutor(autor) {
    return autor
        .replace(/\.txt$/i, "")
        .replace(/[_-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function getDataFolder() {
    const dataPath = path.join(__dirname, "data");
    return fs.existsSync(dataPath) ? dataPath : null;
}

const ROOT = path.resolve(__dirname);

function safePath(userPath) {
    const full = path.normalize(path.join(ROOT, userPath));
    if (!full.startsWith(ROOT)) {
        logger.warn('Path traversal attempt', { userPath, full });
        throw new Error("Access denied");
    }
    return full;
}

function loadAutorData(autorRaw) {
    const folderName = normalizeAutor(autorRaw);
    const dataFolder = getDataFolder();
    if (!dataFolder) return null;

    // caching autor
    if (cache.autoriData.has(folderName)) {
        return cache.autoriData.get(folderName);
    }

    const autorFolder = safePath(path.join("data", folderName));
    if (!fs.existsSync(autorFolder)) return null;

    const jsonFile = fs.readdirSync(autorFolder).find(f => f.endsWith(".json"));
    if (!jsonFile) return null;

    const jsonPath = safePath(path.join("data", folderName, jsonFile));
    const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

    cache.autoriData.set(folderName, data);
    return data;
}

/* ============================================================
   HEALTH CHECK
   ============================================================ */

app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        version: "1.0.0"
    });
});

/* ============================================================
   ENDPOINTURI
   ============================================================ */

// 1. Lista tuturor poeților
app.get("/api/poeti", (req, res) => {
    try {
        const dataFolder = getDataFolder();
        if (!dataFolder) {
            logger.error("Folderul 'data' nu există");
            return res.status(500).json({ mesaj: "Folderul 'data' nu există" });
        }

        if (cache.autoriList) {
            return res.json(cache.autoriList);
        }

        const autori = fs.readdirSync(dataFolder).filter(f =>
            fs.lstatSync(path.join(dataFolder, f)).isDirectory()
        );

        cache.autoriList = autori;
        res.json(autori);
    } catch (err) {
        logger.error('Eroare la /api/poeti', { error: err.message });
        res.status(500).json({ mesaj: "Eroare internă" });
    }
});

// 2. Toate poeziile unui autor
app.get(
    "/api/autor/:autor/poezii",
    validateParams({ autor: autorSchema }),
    (req, res) => {
        const data = loadAutorData(req.params.autor);
        if (!data) return res.status(404).json({ mesaj: "Autorul nu există" });
        res.json(data.poezii);
    }
);

// 3. Toată proza unui autor
app.get(
    "/api/autor/:autor/proza",
    validateParams({ autor: autorSchema }),
    (req, res) => {
        const data = loadAutorData(req.params.autor);
        if (!data) return res.status(404).json({ mesaj: "Autorul nu există" });
        res.json(data.proza);
    }
);

// 4. Căutare după titlu
app.get(
    "/api/cauta/:autor/:titlu",
    validateParams({ autor: autorSchema, titlu: titluSchema }),
    (req, res) => {
        const { autor, titlu } = req.params;
        const data = loadAutorData(autor);

        if (!data) return res.status(404).json({ mesaj: "Autorul nu există" });

        const toate = [...data.poezii, ...data.proza];

        const rezultat = toate.filter(item =>
            item.titlu.toLowerCase().includes(titlu.toLowerCase())
        );

        if (!rezultat.length) return res.status(404).json({ mesaj: "Nimic găsit" });

        res.json(rezultat);
    }
);

// 5. Căutare după ID
app.get(
    "/api/autor/:autor/id/:id",
    validateParams({ autor: autorSchema, id: idSchema }),
    (req, res) => {
        const { autor, id } = req.params;
        const data = loadAutorData(autor);

        if (!data) return res.status(404).json({ mesaj: "Autorul nu există" });

        const toate = [...data.poezii, ...data.proza];
        const item = toate.find(p => p.id === id);

        if (!item) return res.status(404).json({ mesaj: "ID-ul nu există" });

        res.json(item);
    }
);

// 6. Poezie JSON
app.get(
    "/api/poezie/:autor/:id/versuri",
    validateParams({ autor: autorSchema, id: idSchema }),
    (req, res) => {
        const { autor, id } = req.params;
        const data = loadAutorData(autor);

        if (!data) return res.status(404).json({ mesaj: "Autorul nu există" });

        const poezie = data.poezii.find(p => p.id === id);
        if (!poezie) return res.status(404).json({ mesaj: "Poezia nu a fost găsită" });

        const versuriPath = poezie.versuri_path;

        // caching text poezie
        if (cache.poezieText.has(versuriPath)) {
            return res.json({
                id: poezie.id,
                titlu: poezie.titlu,
                tip: poezie.tip,
                continut: cache.poezieText.get(versuriPath)
            });
        }

        try {
            const filePath = safePath(versuriPath);

            fs.readFile(filePath, 'utf-8', (err, text) => {
                if (err) {
                    logger.error('Eroare la citirea versurilor', { error: err.message, filePath });
                    return res.status(500).json({ mesaj: "Eroare la citirea versurilor" });
                }

                cache.poezieText.set(versuriPath, text);

                res.json({
                    id: poezie.id,
                    titlu: poezie.titlu,
                    tip: poezie.tip,
                    continut: text
                });
            });
        } catch (e) {
            logger.warn('Cale invalidă la versuri', { error: e.message, path: versuriPath });
            res.status(400).json({ mesaj: "Cale invalidă" });
        }
    }
);

// 7. Poezie text simplu
app.get(
    "/api/poezie/:autor/:id/text",
    validateParams({ autor: autorSchema, id: idSchema }),
    (req, res) => {
        const { autor, id } = req.params;

        const data = loadAutorData(autor);
        if (!data) return res.status(404).json({ mesaj: "Autorul nu există" });

        const poezie = data.poezii.find(p => p.id === id);
        if (!poezie) return res.status(404).json({ mesaj: "Poezia nu a fost găsită" });

        const versuriPath = poezie.versuri_path;

        if (cache.poezieText.has(versuriPath)) {
            return res.send(cache.poezieText.get(versuriPath));
        }

        try {
            const filePath = safePath(versuriPath);

            fs.readFile(filePath, "utf-8", (err, text) => {
                if (err) {
                    logger.error('Eroare la citirea poeziei', { error: err.message, filePath });
                    return res.status(500).json({ mesaj: "Eroare la citirea poeziei" });
                }

                cache.poezieText.set(versuriPath, text);
                res.send(text);
            });
        } catch (e) {
            logger.warn('Cale invalidă la poezie text', { error: e.message, path: versuriPath });
            res.status(400).json({ mesaj: "Cale invalidă" });
        }
    }
);

// 8. Bibliografie
app.get(
    "/api/autor/:autor/bibliografie/text",
    validateParams({ autor: autorSchema }),
    (req, res) => {
        const data = loadAutorData(req.params.autor);
        if (!data) return res.status(404).json({ mesaj: "Autorul nu există" });

        const biblioPath = data.bibliografie_path;

        if (cache.bibliografieText.has(biblioPath)) {
            return res.send(cache.bibliografieText.get(biblioPath));
        }

        try {
            const filePath = safePath(biblioPath);

            fs.readFile(filePath, "utf-8", (err, text) => {
                if (err) {
                    logger.error('Eroare la citirea bibliografiei', { error: err.message, filePath });
                    return res.status(500).json({ mesaj: "Eroare la citirea bibliografiei" });
                }

                cache.bibliografieText.set(biblioPath, text);
                res.send(text);
            });
        } catch (e) {
            logger.warn('Cale invalidă la bibliografie', { error: e.message, path: biblioPath });
            res.status(400).json({ mesaj: "Cale invalidă" });
        }
    }
);

// 9. Poza autorului
app.get(
    "/api/autor/:autor/poza",
    validateParams({ autor: autorSchema }),
    (req, res) => {
        const data = loadAutorData(req.params.autor);
        if (!data) return res.status(404).json({ mesaj: "Autorul nu există" });

        try {
            const filePath = safePath(data.poza);
            res.sendFile(filePath);
        } catch (e) {
            logger.warn('Cale invalidă la poza autorului', { error: e.message, path: data.poza });
            res.status(400).json({ mesaj: "Cale invalidă" });
        }
    }
);

/* ============================================================
   PORNIRE SERVER
   ============================================================ */

app.listen(PORT, () => {
    logger.info(`Serverul rulează pe portul ${PORT}`);
    console.log(`Serverul rulează pe portul ${PORT}`);
});