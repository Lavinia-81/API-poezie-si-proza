import express from "express";
import User from "../models/User.js";
import { generateApiKey } from "../utils/generateApiKey.js";
import { verifyApiKey } from "../middleware/auth/verifyApiKey.js";
import { plans } from "../config/plans.js";
import { stripe } from "../config/stripe.js";
import { requireValidEmail, requireValidPlan } from "../validators.js";
import { planLimiter } from "../middleware/security/planLimiter.js";

const router = express.Router();

/* REGISTER USER */
router.get("/me", async (req, res) => {
  try {
    const apiKey = req.query.apiKey;
    if (!apiKey) return res.status(401).json({ error: "Unauthorized" });

    const user = await User.findOne({ apiKey });
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const plan = user.plan.toLowerCase();
    const limits = plans[plan];

    let used, limit;

    if (plan === "free") {
      used = user.requestsToday;
      limit = limits.dailyLimit;
    } else {
      used = user.requestsThisMonth;
      limit = limits.monthlyLimit;
    }

    const remaining = Math.max(0, limit - used);

    res.json({
      email: user.email,
      plan: user.plan,
      apiKey: user.apiKey,

      // câmpuri pentru dashboard
      requestsToday: user.requestsToday,
      requestsThisMonth: user.requestsThisMonth,
      dailyLimit: limits.dailyLimit || null,
      monthlyLimit: limits.monthlyLimit || null,
      remainingRequests: remaining,

      // extra
      status: user.status,
      cancelAt: user.cancelAt
    });

  } catch (err) {
    console.error("Me endpoint error:", err);
    res.status(500).json({ error: "Server error" });
  }
});




/* UPGRADE PLAN */
router.post("/upgrade", requireValidEmail, requireValidPlan, async (req, res) => {
  try {
    const { email, plan } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Operation failed" });
    }

    user.plan = plan;
    user.requestsToday = 0;
    user.lastRequestDate = new Date();

    await user.save();

    res.json({
      message: "Plan updated",
      email: user.email,
      plan: user.plan
    });

  } catch (err) {
    console.error("Upgrade error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


/* USAGE */
router.get("/usage/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });

    if (!user) {
      return res.status(400).json({ error: "Operation failed" });
    }

    res.json({
      email: user.email,
      plan: user.plan,
      apiKey: user.apiKey,  
      requestsToday: user.requestsToday,
      lastRequestDate: user.lastRequestDate,
    });

  } catch (err) {
    console.error("Usage error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


/* STRIPE CHECKOUT */
router.post("/create-checkout-session", requireValidEmail, requireValidPlan, async (req, res) => {
  try {
    const { email, plan } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: email,
      metadata: { plan },
      line_items: [
        {
          price: plan === "basic"
            ? process.env.STRIPE_BASIC_PRICE_ID
            : process.env.STRIPE_PREMIUM_PRICE_ID,
          quantity: 1
        }
      ],
      success_url: `${process.env.FRONTEND_URL}/checkout.html`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout.html`
    });

    res.json({ url: session.url });

  } catch (err) {
    console.error("Stripe session error:", err);
    res.status(500).json({ error: "Stripe session creation failed" });
  }
});


/* ME (API KEY PROTECTED) */
router.get("/me", async (req, res) => {
  try {
    const apiKey = req.query.apiKey;
    if (!apiKey) return res.status(401).json({ error: "Unauthorized" });

    const user = await User.findOne({ apiKey });
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const plan = user.plan.toLowerCase();
    const limits = plans[plan];

    let used, limit;

    if (plan === "free") {
      used = user.requestsToday;
      limit = limits.dailyLimit;
    } else {
      used = user.requestsThisMonth;
      limit = limits.monthlyLimit;
    }

    const remaining = Math.max(0, limit - used);

    res.json({
      email: user.email,
      plan: user.plan,
      apiKey: user.apiKey,

      // câmpuri pentru dashboard
      requestsToday: user.requestsToday,
      requestsThisMonth: user.requestsThisMonth,
      dailyLimit: limits.dailyLimit || null,
      monthlyLimit: limits.monthlyLimit || null,
      remainingRequests: remaining,

      // extra
      status: user.status,
      cancelAt: user.cancelAt
    });

  } catch (err) {
    console.error("Me endpoint error:", err);
    res.status(500).json({ error: "Server error" });
  }
});




/* CUSTOMER PORTAL */
router.post("/customer-portal", requireValidEmail, async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Operation failed" });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.FRONTEND_URL}/dashboard.html`
    });

    res.json({ url: session.url });

  } catch (err) {
    console.error("Customer portal error:", err);
    res.status(500).json({ error: "Stripe portal creation failed" });
  }
});

/* DELETE ACCOUNT */
router.post("/delete", async (req, res) => {
  try {
    const { email } = req.body;
    console.log("BODY:", req.body);

    if (!email) {
      return res.status(400).json({ error: "Email missing" });
    }

    // 1. Găsim userul
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 2. Verificăm planul
    if (user.plan !== "free") {
      return res.status(403).json({
        error: "Cannot delete account while subscription is active. Please cancel your subscription first."
      });
    }

    // 3. Ștergem userul DOAR dacă planul este FREE
    const result = await User.deleteOne({ email });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ success: true });

  } catch (err) {
    console.error("DELETE ERROR:", err.stack);
    return res.status(500).json({ error: "Server error" });
  }
});


export default router;