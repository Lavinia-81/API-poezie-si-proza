// src/middleware/validation/schemas.js
import { z } from "zod";


const safeAutor = z
  .string()
  .min(1)
  .max(100)
  .transform((val) => val.normalize("NFC"))
  .transform((val) => val.replace(/\s+/g, " ").trim())
  .refine((val) => /^[\p{L}\s.'-]+$/u.test(val), "Invalid characters in author name");

// Generic safeString pentru alte câmpuri
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

// SCHEME
export const autorSchema = z.object({
  autor: safeAutor
});

export const idSchema = z.object({
  autor: safeAutor,
  id: safeString(100)
});

export const cautareSchema = z.object({
  autor: safeAutor,
  titlu: safeString(100)
});

export const checkoutSchema = z.object({
  priceId: safeString(200),
  successUrl: safeString(200),
  cancelUrl: safeString(200)
});


export const titluSchema = z.object({
  autor: safeAutor,
  titlu: safeString(200)
});
