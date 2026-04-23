// src/middleware/validation/schemas.js
import { z } from "zod";

// Helper: creează un string sigur cu limită variabilă
const safeString = (max) =>
  z
    .string()
    .min(1)
    .max(max)
    .transform((val) => val.normalize("NFKC"))
    .transform((val) => val.replace(/[\u0000-\u001F\u007F]/g, ""))
    .transform((val) => val.replace(/\s+/g, " ").trim())
    .refine((val) => !/[<>]/.test(val), "Invalid characters detected")
    .refine((val) => !/(\.\.|\/|\\)/.test(val), "Path traversal detected")
    .refine((val) => !/\$[a-z]+/i.test(val), "Mongo operator detected");

// Schemas
export const autorSchema = z.object({
  autor: safeString(100)
});

export const cautareSchema = z.object({
  autor: safeString(50),
  titlu: safeString(100)
});

export const idSchema = z.object({
  autor: safeString(100),
  id: safeString(100)
});

export const checkoutSchema = z.object({
  priceId: safeString(200),
  successUrl: safeString(200),
  cancelUrl: safeString(200)
});