// src/config/stripe.js
import Stripe from "stripe";

// Sanitize env variable
function cleanKey(key) {
  return typeof key === "string"
    ? key.replace(/[\u0000-\u001F\u007F]/g, "").trim()
    : "";
}

const secretKey = cleanKey(process.env.STRIPE_SECRET_KEY);

if (!secretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}

export const stripe = new Stripe(secretKey, {
  apiVersion: "2023-10-16",
});