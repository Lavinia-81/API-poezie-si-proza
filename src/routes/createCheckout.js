import express from "express";
import { stripe } from "../config/stripe.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/create-checkout-session", async (req, res) => {
  const { plan } = req.body;

  // Alegem priceId în funcție de plan
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
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        plan: plan, // AICI punem metadata
      },
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: "Stripe session creation failed" });
  }
});

export default router;
