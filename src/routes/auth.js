import express from "express";
import User from "../models/User.js";
import { generateApiKey } from "../utils/generateApiKey.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    console.log("BODY PRIMIT:", req.body);
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // verifică dacă există deja
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    // generează cheia
    const apiKey = generateApiKey();

    // creează userul
    const user = await User.create({
      email,
      apiKey,
      requestsToday: 0,
      lastRequestDate: null
    });

    return res.json({
      message: "User created successfully",
      apiKey: user.apiKey,
      plan: user.plan,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


router.post("/upgrade", async (req, res) => {
  try {
    const { email, newPlan } = req.body;

    if (!["free", "basic", "premium"].includes(newPlan)) {
      return res.status(400).json({ error: "Invalid plan" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.plan = newPlan;
    user.requestsToday = 0;
    user.lastRequestDate = new Date();

    await user.save();

    res.json({
      message: "Plan upgraded successfully",
      email: user.email,
      newPlan: user.plan
    });

  } catch (err) {
    console.error("Upgrade error:", err);
    res.status(500).json({ error: "Server error" });
  }
});



router.get("/usage/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      email: user.email,
      plan: user.plan,
      requestsToday: user.requestsToday,
      lastRequestDate: user.lastRequestDate,
    });

  } catch (err) {
    console.error("Usage error:", err);
    res.status(500).json({ error: "Server error" });
  }
});




export default router;
