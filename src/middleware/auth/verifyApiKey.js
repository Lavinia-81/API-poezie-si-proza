// src/middleware/auth/verifyApiKey.js
import User from "../../models/User.js";
import { plans } from "../../config/plans.js";
import { validateApiKey } from "../../validators.js";

export const verifyApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers["x-api-key"];
    if (!apiKey) return res.status(401).json({ error: "Unauthorized" });

    if (!validateApiKey(apiKey)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await User.findOne({ apiKey });
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const plan = user.plan.toLowerCase();
    const limits = plans[plan];

    const now = new Date();
    const today = now.toISOString().split("T")[0];

    // DAILY RESET (FREE)
    if (plan === "free") {
      const last = user.lastDailyReset
        ? user.lastDailyReset.toISOString().split("T")[0]
        : null;

      if (today !== last) {
        user.requestsToday = 0;
        user.lastDailyReset = now;
      }

      if (user.requestsToday >= limits.dailyLimit) {
        return res.status(429).json({
          error: "Daily request limit reached",
          plan: user.plan,
          limit: limits.dailyLimit
        });
      }

      user.requestsToday += 1;
    }

    // MONTHLY RESET (BASIC / PREMIUM)
    if (plan !== "free") {
      const lastMonth = user.lastMonthlyReset
        ? user.lastMonthlyReset.getMonth()
        : null;

      if (lastMonth !== now.getMonth()) {
        user.requestsThisMonth = 0;
        user.lastMonthlyReset = now;
      }

      if (user.requestsThisMonth >= limits.monthlyLimit) {
        return res.status(429).json({
          error: "Monthly request limit reached",
          plan: user.plan,
          limit: limits.monthlyLimit
        });
      }

      user.requestsThisMonth += 1;
    }

    await user.save();

    req.user = user;
    next();

  } catch (err) {
    console.error("verifyApiKey error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
