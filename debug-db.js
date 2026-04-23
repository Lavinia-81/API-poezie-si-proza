import mongoose from "mongoose";
import User from "./src/models/User.js";
import dotenv from "dotenv";

dotenv.config();

async function run() {
  try {
    if (process.env.NODE_ENV === "production") {
      throw new Error("This script cannot run in production");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });

    console.log("Connected to DB");

    const users = await User.find().lean();
    console.log("Users:", users);

    process.exit(0);

  } catch (err) {
    console.error("DB error:", err.message);
    process.exit(1);
  }
}

run();