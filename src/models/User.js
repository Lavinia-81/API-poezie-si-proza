import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  apiKey: {
    type: String,
    required: true,
    unique: true,
  },

  plan: {
    type: String,
    enum: ["free", "basic", "premium"],
    default: "free",
  },

  requestsToday: {
  type: Number,
  default: 0,
  },

  lastRequestDate: {
    type: Date,
    default: null,
  },

  requestsUsed: {
    type: Number,
    default: 0,
  },

  requestsLimit: {
    type: Number,
    default: 500, // pentru planul free
  },

  resetDate: {
    type: Date,
    default: () => {
      const d = new Date();
      d.setHours(24, 0, 0, 0); // reset zilnic pentru free
      return d;
    },
  },

  stripeCustomerId: {
    type: String,
    default: null,
  },

  stripeSubscriptionId: {
    type: String,
    default: null,
  },

  status: {
    type: String,
    enum: ["active", "canceled", "past_due"],
    default: "active",
  },
});

export default mongoose.model("User", userSchema);
