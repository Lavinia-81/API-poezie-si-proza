// src/middleware/auth/verifyApiKey.js
import User from "../../models/User.js";
import { PLAN_LIMITS } from "../../config/config.js";
import { validateApiKey } from "../../validators.js";

export const verifyApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers["x-api-key"];

    // 1. Missing key
    if (!apiKey) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // 2. Validate format (anti-XSS, anti-injection)
    if (!validateApiKey(apiKey)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // 3. Find user (constant-time lookup)
    const user = await User.findOne({ apiKey }).lean();

    if (!user) {
      // generic response (anti-enumeration)
      return res.status(401).json({ error: "Unauthorized" });
    }

    // 4. Daily reset (safe)
    const today = new Date().toISOString().split("T")[0];
    const last = user.lastRequestDate
      ? user.lastRequestDate.toISOString().split("T")[0]
      : null;

    if (today !== last) {
      await User.updateOne(
        { apiKey },
        { $set: { requestsToday: 0, lastRequestDate: new Date() } }
      );
      user.requestsToday = 0;
    }

    // 5. Validate plan
    const limit = PLAN_LIMITS[user.plan] ?? PLAN_LIMITS["free"];

    if (typeof limit !== "number") {
      return res.status(500).json({ error: "Invalid plan configuration" });
    }

    // 6. Rate limit per user
    if (user.requestsToday >= limit) {
      return res.status(429).json({
        error: "Daily request limit reached",
        plan: user.plan,
        limit
      });
    }

    // 7. Atomic increment (prevents race conditions)
    await User.updateOne(
      { apiKey },
      {
        $inc: { requestsToday: 1 },
        $set: { lastRequestDate: new Date() }
      }
    );

    // 8. Attach user to request (safe version)
    req.user = {
      email: user.email,
      plan: user.plan,
      requestsToday: user.requestsToday + 1,
      lastRequestDate: new Date()
    };

    next();

  } catch (err) {
    console.error("verifyApiKey error:", err);
    res.status(500).json({ error: "Server error" });
  }
};