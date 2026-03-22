import User from "../../models/User.js";
import { plans } from "../../config/plans.js";

export const verifyApiKey = async (req, res, next) => {
  try {
    const apiKey = req.header("x-api-key");

    if (!apiKey) {
      return res.status(401).json({ error: "API key missing" });
    }

    const user = await User.findOne({ apiKey });

    if (!user) {
      return res.status(401).json({ error: "Invalid API key" });
    }

    // Reset daily counter if date changed
    let lastDate = null;

    if (user.lastRequestDate) {
      const parsed = new Date(user.lastRequestDate);
      if (!isNaN(parsed)) {
        lastDate = parsed.toISOString().split("T")[0];
      }
    }


    if (today !== lastDate) {
      user.requestsToday = 0;
      user.lastRequestDate = new Date();
    }

    // Get plan limits
    const userPlan = plans[user.plan] || plans.free;

    if (user.requestsToday >= userPlan.dailyLimit) {
      return res.status(429).json({
        error: "Daily limit reached",
        plan: user.plan,
        limit: userPlan.dailyLimit
      });
    }

    // Increment usage
    user.requestsToday += 1;
    user.lastRequestDate = new Date();
    await user.save();

    // Attach user to request
    req.user = user;

    next();

  } catch (err) {
    console.error("API key verification error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
