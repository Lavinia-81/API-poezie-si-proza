// src/db.js
import mongoose from "mongoose";
import logger from "./logger/logger.js";

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  // 1. Validate URI
  if (!uri || typeof uri !== "string" || !uri.startsWith("mongodb")) {
    logger.error("Invalid or missing MONGODB_URI environment variable");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // fail fast
      socketTimeoutMS: 45000,
      retryWrites: true,
      maxPoolSize: 10,
      minPoolSize: 1,
      family: 4 // IPv4 only (prevents IPv6 DNS poisoning)
    });

    logger.info("MongoDB connected successfully");

    // 2. Handle disconnections
    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      logger.info("MongoDB reconnected");
    });

    mongoose.connection.on("error", (err) => {
      logger.error("MongoDB connection error", { error: err });
    });

  } catch (err) {
    logger.error("Failed to connect to MongoDB", { error: err });
    process.exit(1); // fail fast in production
  }
}