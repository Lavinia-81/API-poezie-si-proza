// src/config/plans.js

export const plans = Object.freeze({
  free: Object.freeze({
    name: "Free",
    dailyLimit: 100
  }),
  basic: Object.freeze({
    name: "Basic",
    dailyLimit: 1000
  }),
  premium: Object.freeze({
    name: "Premium",
    dailyLimit: 10000
  })
});

// Helper to safely get a plan
export function getPlan(planName) {
  const key = String(planName).toLowerCase().trim();
  return plans[key] || plans.free; // fallback safe
}
