const fs = require("fs");
const path = require("path");

// Folderul principal este chiar directorul curent
const base = __dirname;
const dataFolder = path.join(base, "data");

if (!fs.existsSync(dataFolder)) {
    console.error("❌ Folderul 'data' nu există în directorul curent.");
    process.exit(1);
}

console.log("📁 Folder principal detectat:", base);

// Normalizează titlul din numele fișierului
function formatTitle(filename) {
    return filename
        .replace(".txt", "")
        .replace(/[_-]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        // .replace(/\b\w/g, c => c.toUpperCase());
}

// Generează JSON pentru un autor
function generateAuthorJSON(autorFolder) {
    const autorPath = path.join(dataFolder, autorFolder);

    const poeziiFolder = path.join(autorPath, "poezii");
    const prozaFolder = path.join(autorPath, "proza");
    const biblioFolder = path.join(autorPath, "bibliografie");

    // ȘTERGE orice JSON vechi
    const existingJson = fs.readdirSync(autorPath).filter(f => f.endsWith(".json"));
    existingJson.forEach(file => {
        fs.unlinkSync(path.join(autorPath, file));
        console.log(`🗑 Șters JSON vechi: ${file}`);
    });

    const jsonOutput = {
        autor: autorFolder,
        poza: "",
        bibliografie_path: "",
        poezii: [],
        proza: []
    };

    // Detectează poza autorului
    if (fs.existsSync(biblioFolder)) {
        const files = fs.readdirSync(biblioFolder);
        const img = files.find(f => f.match(/\.(jpg|jpeg|png)$/i));
        const biblio = files.find(f => f.toLowerCase().includes("note"));

        if (img) jsonOutput.poza = `data/${autorFolder}/bibliografie/${img}`;
        if (biblio) jsonOutput.bibliografie_path = `data/${autorFolder}/bibliografie/${biblio}`;
    }

    // Procesare poezii
    if (fs.existsSync(poeziiFolder)) {
        const poeziiFiles = fs.readdirSync(poeziiFolder).filter(f => f.endsWith(".txt"));

        poeziiFiles.forEach((file, index) => {
            jsonOutput.poezii.push({
                id: `poezie-${index + 1}`,
                titlu: formatTitle(file),
                tip: "poezie",
                versuri_path: `data/${autorFolder}/poezii/${file}`
            });
        });
    }

    // Procesare proză
    if (fs.existsSync(prozaFolder)) {
        const prozaFiles = fs.readdirSync(prozaFolder).filter(f => f.endsWith(".txt"));

        prozaFiles.forEach((file, index) => {
            jsonOutput.proza.push({
                id: `proza-${index + 1}`,
                titlu: formatTitle(file),
                tip: "proza",
                versuri_path: `data/${autorFolder}/proza/${file}`
            });
        });
    }

    // Scriere JSON final cu numele corect
    const outputPath = path.join(autorPath, `${autorFolder}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(jsonOutput, null, 2), "utf8");

    console.log(`✔ JSON regenerat pentru: ${autorFolder}`);
}

// Rulare pentru toți autorii
console.log("🔄 Regenerare JSON-uri...");

const autori = fs.readdirSync(dataFolder).filter(f =>
    fs.lstatSync(path.join(dataFolder, f)).isDirectory()
);

autori.forEach(generateAuthorJSON);

console.log("🎉 Gata! Toate JSON-urile au fost regenerate corect.");