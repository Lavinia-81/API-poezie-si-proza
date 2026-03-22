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

export default router;
