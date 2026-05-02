import mongoose from "mongoose";

const sanitizeString = (v) =>
  typeof v === "string"
    ? v.normalize("NFKC").replace(/[\u0000-\u001F\u007F]/g, "").trim()
    : v;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 200,
    set: sanitizeString,
    validate: {
      validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: "Invalid email format"
    }
  },

  apiKey: {
    type: String,
    required: true,
    unique: true,
    maxlength: 200,
    set: sanitizeString
  },

  plan: {
    type: String,
    enum: ["free", "basic", "premium"],
    default: "free"
  },

  // FREE plan
  requestsToday: {
    type: Number,
    default: 0
  },
  lastDailyReset: {
    type: Date,
    default: null
  },

  // BASIC / PREMIUM plans
  requestsThisMonth: {
    type: Number,
    default: 0
  },
  lastMonthlyReset: {
    type: Date,
    default: null
  },

  stripeCustomerId: {
    type: String,
    default: null,
    maxlength: 200,
    set: sanitizeString
  },

  stripeSubscriptionId: {
    type: String,
    default: null,
    maxlength: 200,
    set: sanitizeString
  },

  status: {
    type: String,
    enum: ["active", "pending_cancel", "cancelled"],
    default: "active"
  }
});

// Indexes
userSchema.index({ stripeCustomerId: 1 });
userSchema.index({ stripeSubscriptionId: 1 });

export default mongoose.model("User", userSchema);