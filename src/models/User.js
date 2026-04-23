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

  requestsToday: {
    type: Number,
    default: 0
  },

  lastRequestDate: {
    type: Date,
    default: null
  },

  requestsUsed: {
    type: Number,
    default: 0
  },

  requestsLimit: {
    type: Number,
    default: 500
  },

  resetDate: {
    type: Date,
    default: () => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() + 1);
      return d;
    }
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
    enum: ["active", "canceled", "past_due"],
    default: "active"
  }
});

// Indexes for performance
// userSchema.index({ apiKey: 1 });
userSchema.index({ stripeCustomerId: 1 });
userSchema.index({ stripeSubscriptionId: 1 });

export default mongoose.model("User", userSchema);