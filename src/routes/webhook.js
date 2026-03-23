import express from "express";
import { stripe } from "../config/stripe.js";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Stripe webhook — raw body
router.post(
  "/webhook/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        endpointSecret
      );
    } catch (err) {
      console.error("Webhook signature error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log("Received event:", event.type);

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionCancelled(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  }
);

async function handleCheckoutCompleted(session) {
  const email = session.customer_email;

  // 1. Încercăm să luăm planul din metadata (funcționează și cu Stripe CLI)
  let plan = session.metadata?.plan;

  // 2. Dacă metadata nu există, încercăm fallback la line_items (pentru evenimente reale)
  if (!plan) {
    const priceId = session.line_items?.[0]?.price?.id;

    plan =
      priceId === process.env.STRIPE_BASIC_PRICE_ID
        ? "basic"
        : priceId === process.env.STRIPE_PREMIUM_PRICE_ID
        ? "premium"
        : null;
  }

  if (!plan) {
    console.log("No plan found in session — skipping upgrade.");
    return;
  }

  const user = await User.findOne({ email });
  if (!user) return;

  user.plan = plan;
  user.requestsToday = 0;
  user.lastRequestDate = new Date();
  await user.save();

  console.log(`User ${email} upgraded to ${plan}`);
}



async function handleSubscriptionCancelled(subscription) {
  const customer = await stripe.customers.retrieve(subscription.customer);
  const email = customer.email;

  const user = await User.findOne({ email });
  if (!user) return;

  user.plan = "free";
  await user.save();

  console.log(`User ${email} downgraded to free`);
}

export default router;
