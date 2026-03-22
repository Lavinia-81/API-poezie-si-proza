import User from "../../models/User.js";

export async function verifyApiKey(req, res, next) {
    try {
        const apiKey = req.header("x-api-key");

        if (!apiKey) {
            return res.status(401).json({ mesaj: "Lipsește API key-ul." });
        }

        const user = await User.findOne({ apiKey });

        if (!user) {
            return res.status(403).json({ mesaj: "API key invalid." });
        }

        // Resetare limită dacă a trecut o zi
        const today = new Date().toISOString().split("T")[0];
        if (user.lastRequestDate !== today) {
            user.requestsToday = 0;
            user.lastRequestDate = today;
        }

        // Verificare limită în funcție de plan
        const planLimits = {
            free: 50,
            basic: 500,
            premium: 5000
        };

        const limit = planLimits[user.plan] || 50;

        if (user.requestsToday >= limit) {
            return res.status(429).json({
                mesaj: "Ai depășit limita zilnică pentru planul tău."
            });
        }

        // Incrementăm consumul
        user.requestsToday += 1;
        await user.save();

        // Atașăm userul la request pentru rute
        req.user = user;

        next();

    } catch (err) {
        console.error("Eroare middleware API key:", err);
        res.status(500).json({ mesaj: "Eroare server." });
    }
}
