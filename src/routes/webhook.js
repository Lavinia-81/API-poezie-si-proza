// src/routes/webhook.js
import express from "express";
import crypto from "crypto";
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
  express.raw({ type: "application/json", limit: "1mb" }),
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
      console.error("❌ Invalid webhook signature:", err.message);
      return res.status(400).send("Invalid signature");
    }

    // Ignore events we don't care about
    if (!ALLOWED_EVENTS.has(event.type)) {
      console.warn(`⚠️ Ignored event: ${event.type}`);
      return res.json({ received: true });
    }

    // Basic replay protection (5 minutes)
    const timestampPart = String(sig).split(",")[0];
    const timestamp = Number(timestampPart.replace("t=", ""));
    const now = Math.floor(Date.now() / 1000);

    if (!Number.isFinite(timestamp) || now - timestamp > 300) {
      console.warn("⚠️ Possible replay attack (timestamp too old)");
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
// - user nou cu BASIC/PREMIUM → îl creăm
// - user existent (FREE sau plătit) → îl actualizăm
// ---------------------------------------------------------
async function handleCheckoutCompleted(session) {
  try {
    let email = session.customer_email || session.customer_details?.email;

    if (!email && session.customer) {
      const customer = await stripe.customers.retrieve(session.customer);
      email = customer.email;
    }

    if (!email) {
      console.warn("⚠️ checkout.session.completed fără email, ignor");
      return;
    }

    // Determinăm planul
    let plan = session.metadata?.plan;

    if (!["basic", "premium"].includes(plan)) {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        limit: 1
      });
      const priceId = lineItems.data?.[0]?.price?.id;

      plan =
        priceId === process.env.STRIPE_BASIC_PRICE_ID
          ? "basic"
          : priceId === process.env.STRIPE_PREMIUM_PRICE_ID
          ? "premium"
          : null;
    }

    if (!plan) {
      console.warn("⚠️ checkout.session.completed fără plan valid, ignor");
      return;
    }

    const customerId = session.customer;
    const subscriptionId = session.subscription;

    // Căutăm userul după email sau stripeCustomerId
    let user =
      (await User.findOne({ email })) ||
      (await User.findOne({ stripeCustomerId: customerId }));

    // Dacă NU există → îl CREĂM
    if (!user) {
      const apiKey = crypto.randomBytes(32).toString("hex");

      user = await User.create({
        email,
        apiKey,
        plan,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        status: "active",
        requestsToday: 0,
        requestsThisMonth: 0,
        lastDailyReset: null,
        lastMonthlyReset: null,
        cancelAt: null
      });

      console.log("✅ User created from Stripe checkout:", email);
      return;
    }

    // Dacă există → îl ACTUALIZĂM
    user.stripeCustomerId = customerId;
    user.stripeSubscriptionId = subscriptionId;
    user.plan = plan;
    user.status = "active";
    user.cancelAt = null;

    // La upgrade/downgrade, poți reseta și contorii dacă vrei:
    // user.requestsToday = 0;
    // user.requestsThisMonth = 0;

    await user.save();
    console.log("✅ User updated from Stripe checkout:", email);
  } catch (err) {
    console.error("Checkout handler error:", err);
  }
}

// ---------------------------------------------------------
// HANDLE SUBSCRIPTION UPDATED
// - cancel_at_period_end = true → pending_cancel + cancelAt
// - status = "canceled" → lăsăm deleted handler să se ocupe
// - altfel → upgrade/downgrade normal (basic/premium)
// ---------------------------------------------------------
async function handleSubscriptionUpdated(subscription) {
  try {
    const customerId = subscription.customer;

    // 1. User a apăsat "Cancel subscription" → pending_cancel
    if (subscription.cancel_at_period_end === true) {
      const user = await User.findOne({ stripeCustomerId: customerId });
      if (!user) return;

      const cancelDate = subscription.cancel_at
        ? new Date(subscription.cancel_at * 1000)
        : null;

      user.status = "pending_cancel";
      user.cancelAt = cancelDate;

      await user.save();
      console.log("✅ Subscription marked as pending_cancel:", customerId, cancelDate);
      return;
    }

    // 2. Dacă statusul e deja "canceled", lăsăm `customer.subscription.deleted` să facă downgrade
    if (subscription.status === "canceled") {
      console.log("ℹ️ Subscription already canceled, waiting for deleted event:", customerId);
      return;
    }

    // 3. Upgrade / downgrade normal (price change)
    const priceId = subscription.items.data[0].price.id;

    const plan =
      priceId === process.env.STRIPE_BASIC_PRICE_ID
        ? "basic"
        : priceId === process.env.STRIPE_PREMIUM_PRICE_ID
        ? "premium"
        : null;

    if (!plan) {
      console.warn("⚠️ Subscription updated cu price necunoscut, ignor");
      return;
    }

    const user = await User.findOne({ stripeCustomerId: customerId });
    if (!user) return;

    user.plan = plan;
    user.status = "active";
    user.stripeSubscriptionId = subscription.id;
    user.cancelAt = null;

    await user.save();
    console.log("✅ Subscription upgraded/downgraded:", customerId, plan);
  } catch (err) {
    console.error("Subscription update error:", err);
  }
}

// ---------------------------------------------------------
// HANDLE SUBSCRIPTION CANCELLED
// - downgrade la FREE
// - resetăm contorii
// ---------------------------------------------------------
async function handleSubscriptionCancelled(subscription) {
  try {
    const customerId = subscription.customer;

    const user = await User.findOne({ stripeCustomerId: customerId });
    if (!user) return;

    user.plan = "free";
    user.status = "cancelled";
    user.requestsToday = 0;
    user.requestsThisMonth = 0;
    user.lastDailyReset = null;
    user.lastMonthlyReset = null;
    user.stripeSubscriptionId = null;
    user.cancelAt = null;

    await user.save();
    console.log("✅ Subscription cancelled, user downgraded to free:", customerId);
  } catch (err) {
    console.error("Subscription cancel error:", err);
  }
}

export default router;
