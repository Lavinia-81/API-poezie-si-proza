// src/middleware/auth/verifyApiKey.js
import User from "../../models/User.js";
import { PLAN_LIMITS } from "../../config/config.js";

export const verifyApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
      return res.status(401).json({ error: "API key missing" });
    }

    const user = await User.findOne({ apiKey });

    if (!user) {
      return res.status(401).json({ error: "Invalid API key" });
    }

    // Reset zilnic
    const today = new Date().toISOString().split("T")[0];
    const last = user.lastRequestDate
      ? user.lastRequestDate.toISOString().split("T")[0]
      : null;

    if (today !== last) {
      user.requestsToday = 0;
      user.lastRequestDate = new Date();
    }

    // Limita per plan
    const limit = PLAN_LIMITS[user.plan];

    if (user.requestsToday >= limit) {
      return res.status(429).json({
        error: "Daily request limit reached",
        plan: user.plan,
        limit
      });
    }

    // Incrementăm consumul
    user.requestsToday += 1;
    user.lastRequestDate = new Date();
    await user.save();

    req.user = user;
    next();

  } catch (err) {
    console.error("verifyApiKey error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
