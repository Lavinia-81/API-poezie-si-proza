import express from "express";
import User from "../models/User.js";
import { generateApiKey } from "../utils/generateApiKey.js";
import { verifyApiKey } from "../middleware/auth/verifyApiKey.js";
import { plans } from "../config/plans.js";
import { stripe } from "../config/stripe.js";
import {requireValidEmail,requireValidPlan} from "../validators.js";

const router = express.Router();

/* REGISTER USER */
router.post("/register", requireValidEmail, async (req, res) => {
  try {
    const { email } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Operation failed" });
    }

    const apiKey = generateApiKey();

    const user = await User.create({
      email,
      apiKey,
      requestsToday: 0,
      lastRequestDate: null
    });

    return res.json({
      message: "User created",
      apiKey: user.apiKey,
      plan: user.plan,
    });

  } catch (err) {
    console.error("Register error:", err);
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
router.get("/usage/:email", requireValidEmail, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });

    if (!user) {
      return res.status(400).json({ error: "Operation failed" });
    }

    res.json({
      email: user.email,
      plan: user.plan,
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
router.get("/me", verifyApiKey, async (req, res) => {
  try {
    const user = req.user;

    const limit = plans[user.plan]?.dailyLimit || plans.free.dailyLimit;
    const remaining = Math.max(0, limit - user.requestsToday);

    res.json({
      email: user.email,
      plan: user.plan,
      dailyLimit: limit,
      requestsToday: user.requestsToday,
      remainingRequests: remaining,
      lastRequestDate: user.lastRequestDate
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
      return_url: `${process.env.FRONTEND_URL}/dashboard`
    });

    res.json({ url: session.url });

  } catch (err) {
    console.error("Customer portal error:", err);
    res.status(500).json({ error: "Stripe portal creation failed" });
  }
});

export default router;