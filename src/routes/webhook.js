import express from "express";
import { stripe } from "../config/stripe.js";
import User from "../models/User.js";

const router = express.Router();

// Allowed Stripe events
const ALLOWED_EVENTS = new Set([
  "checkout.session.completed",
  "customer.subscription.updated",
  "customer.subscription.deleted"
]);

// Webhook route
router.post(
  "/",
  express.raw({ type: "application/json", limit: "1mb" }), // limit body size
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig) {
      return res.status(400).send("Missing Stripe signature");
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        endpointSecret
      );
    } catch (err) {
      console.error("❌ Invalid webhook signature");
      return res.status(400).send("Invalid signature");
    }

    // Reject unknown events
    if (!ALLOWED_EVENTS.has(event.type)) {
      console.warn(`⚠️ Ignored event: ${event.type}`);
      return res.json({ received: true });
    }

    // Protect against replay attacks (timestamp older than 5 minutes)
    const timestamp = Number(sig.split(",")[0].replace("t=", ""));
    const now = Math.floor(Date.now() / 1000);

    if (now - timestamp > 300) {
      console.warn("⚠️ Replay attack detected");
      return res.status(400).send("Event too old");
    }

    try {
      switch (event.type) {
        case "checkout.session.completed":
          await handleCheckoutCompleted(event.data.object);
          break;

        case "customer.subscription.updated":
          await handleSubscriptionUpdated(event.data.object);
          break;

        case "customer.subscription.deleted":
          await handleSubscriptionCancelled(event.data.object);
          break;
      }
    } catch (err) {
      console.error("❌ Webhook handler error:", err);
      return res.status(500).send("Webhook handler failed");
    }

    res.json({ received: true });
  }
);

// ---------------------------------------------------------
// HANDLE CHECKOUT COMPLETED
// ---------------------------------------------------------
async function handleCheckoutCompleted(session) {
  try {
    let email = session.customer_email;

    if (!email && session.customer) {
      const customer = await stripe.customers.retrieve(session.customer);
      email = customer.email;
    }

    if (!email) return;

    let plan = session.metadata?.plan;

    if (!["basic", "premium"].includes(plan)) {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      const priceId = lineItems.data?.[0]?.price?.id;

      plan =
        priceId === process.env.STRIPE_BASIC_PRICE_ID
          ? "basic"
          : priceId === process.env.STRIPE_PREMIUM_PRICE_ID
          ? "premium"
          : null;
    }

    if (!plan) return;

    const customerId = session.customer;
    let user = await User.findOne({ email }) || await User.findOne({ stripeCustomerId: customerId });

    if (!user) return;

    user.stripeCustomerId = customerId;
    user.stripeSubscriptionId = session.subscription;
    user.plan = plan;
    user.status = "active";
    user.requestsToday = 0;
    user.lastRequestDate = new Date();

    await user.save();
  } catch (err) {
    console.error("Checkout handler error:", err);
  }
}

// ---------------------------------------------------------
// HANDLE SUBSCRIPTION UPDATED
// ---------------------------------------------------------
async function handleSubscriptionUpdated(subscription) {
  try {
    const customerId = subscription.customer;
    const priceId = subscription.items.data[0].price.id;

    const plan =
      priceId === process.env.STRIPE_BASIC_PRICE_ID
        ? "basic"
        : priceId === process.env.STRIPE_PREMIUM_PRICE_ID
        ? "premium"
        : null;

    if (!plan) return;

    const user = await User.findOne({ stripeCustomerId: customerId });
    if (!user) return;

    user.plan = plan;
    user.status = "active";
    user.stripeSubscriptionId = subscription.id;

    await user.save();
  } catch (err) {
    console.error("Subscription update error:", err);
  }
}

// ---------------------------------------------------------
// HANDLE SUBSCRIPTION CANCELLED
// ---------------------------------------------------------
async function handleSubscriptionCancelled(subscription) {
  try {
    const customerId = subscription.customer;

    const user = await User.findOne({ stripeCustomerId: customerId });
    if (!user) return;

    user.plan = "free";
    user.status = "cancelled";

    await user.save();
  } catch (err) {
    console.error("Subscription cancel error:", err);
  }
}


export default router;