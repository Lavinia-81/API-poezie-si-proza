// src/routes/createCheckout.js
import express from "express";
import { stripe } from "../config/stripe.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

/**
 * PUBLIC Stripe Checkout Session Route
 * This route must NOT be protected by API keys, anti-scraping,
 * anti-cloning, text limiters, or validation middleware.
 * Stripe requires a clean, untouched JSON body.
 */

router.post("/create-checkout-session", async (req, res) => {
  console.log("BODY RECEIVED:", req.body); // Debug log

  const { email, plan } = req.body;

  // Select Stripe price ID based on the chosen plan
  const priceId =
    plan === "basic"
      ? process.env.STRIPE_BASIC_PRICE_ID
      : plan === "premium"
      ? process.env.STRIPE_PREMIUM_PRICE_ID
      : null;

  if (!priceId) {
    return res.status(400).json({ error: "Invalid plan" });
  }

  try {
    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        plan: plan, 
      },
      success_url: `${process.env.FRONTEND_URL}/success.html`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel.html`,
    });

    // Return the Stripe Checkout URL to the frontend
    res.json({ url: session.url });

  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: "Stripe session creation failed" });
  }
});

export default router;