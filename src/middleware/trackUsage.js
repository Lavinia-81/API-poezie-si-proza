import User from "../models/User.js";
import { plans } from "../config/plans.js";


export const trackUsage = async (req, res, next) => {
  try {
    const apiKey = req.headers["x-api-key"];
    if (!apiKey) return next();

    const user = await User.findOne({ apiKey });
    if (!user) return next();

    const plan = plans[user.plan];

    // FREE → daily limit
    if (user.plan === "free") {
      user.requestsToday = (user.requestsToday || 0) + 1;

      if (user.requestsToday > plan.dailyLimit) {
        return res.status(429).json({
          error: "Daily limit exceeded for Free plan",
        });
      }
    }

    // BASIC / PREMIUM → monthly limit
    if (user.plan === "basic" || user.plan === "premium") {
      user.requestsThisMonth = (user.requestsThisMonth || 0) + 1;

      if (user.requestsThisMonth > plan.monthlyLimit) {
        return res.status(429).json({
          error: "Monthly limit exceeded",
        });
      }
    }

    await user.save();
    next();
  } catch (err) {
    console.error("trackUsage error:", err);
    next();
  }
};
