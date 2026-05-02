// src/config/plans.js

export const plans = Object.freeze({
  free: Object.freeze({
    name: "Free",
    dailyLimit: 500,
    monthlyLimit: null
  }),
  basic: Object.freeze({
    name: "Basic",
    dailyLimit: null,
    monthlyLimit: 5000
  }),
  premium: Object.freeze({
    name: "Premium",
    dailyLimit: null,
    monthlyLimit: 50000
  })
});

export function getPlan(planName) {
  const key = String(planName).toLowerCase().trim();
  return plans[key] || plans.free;
}

