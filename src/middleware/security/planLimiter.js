// src/middleware/security/planLimiter.js
import User from "../../models/User.js";
import { plans } from "../../config/plans.js";

// Helper: reset daily counter
function shouldResetDaily(lastReset) {
  if (!lastReset) return true;
  const last = new Date(lastReset);
  const now = new Date();
  return (
    last.getUTCFullYear() !== now.getUTCFullYear() ||
    last.getUTCMonth() !== now.getUTCMonth() ||
    last.getUTCDate() !== now.getUTCDate()
  );
}

// Helper: reset monthly counter
function shouldResetMonthly(lastReset) {
  if (!lastReset) return true;
  const last = new Date(lastReset);
  const now = new Date();
  return (
    last.getUTCFullYear() !== now.getUTCFullYear() ||
    last.getUTCMonth() !== now.getUTCMonth()
  );
}

export async function planLimiter(req, res, next) {
  try {
    const user = req.user; // injectat de auth middleware
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const plan = user.plan?.toLowerCase() || "free";
    const limits = plans[plan];

    // FREE → daily limit
    if (plan === "free") {
      if (shouldResetDaily(user.lastDailyReset)) {
        user.requestsToday = 0;
        user.lastDailyReset = new Date();
      }

      if (user.requestsToday >= limits.dailyLimit) {
        return res.status(429).json({
          error: "Daily request limit reached for Free plan."
        });
      }

      user.requestsToday += 1;
      await user.save();
      return next();
    }

    // BASIC / PREMIUM → monthly limit
    if (plan === "basic" || plan === "premium") {
      if (shouldResetMonthly(user.lastMonthlyReset)) {
        user.requestsThisMonth = 0;
        user.lastMonthlyReset = new Date();
      }

      if (user.requestsThisMonth >= limits.monthlyLimit) {
        return res.status(429).json({
          error: `Monthly request limit reached for ${limits.name} plan.`
        });
      }

      user.requestsThisMonth += 1;
      await user.save();
      return next();
    }

    // fallback
    return next();

  } catch (err) {
    console.error("PLAN LIMITER ERROR:", err);
    return res.status(500).json({ error: "Server error in plan limiter" });
  }
}
