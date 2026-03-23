import mongoose from "mongoose";
import User from "./src/models/User.js";

async function run() {
  try {
    await mongoose.connect("mongodb://localhost:27017/poezii_proza");
    console.log("Connected to DB");

    const users = await User.find();
    console.log("Users:", users);

    process.exit(0);
  } catch (err) {
    console.error("DB error:", err);
    process.exit(1);
  }
}

run();