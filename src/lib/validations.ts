import { z } from "zod";

export const registerSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name too long")
    .trim()
    .regex(/^[a-zA-Z\s\-'.]+$/, "Name contains invalid characters"),
  email: z.string()
    .email("Invalid email address")
    .max(255)
    .trim()
    .toLowerCase(),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(128)
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address").max(255).trim().toLowerCase(),
  password: z.string().min(1, "Password is required").max(128),
});

export const searchSchema = z.object({
  q: z.string().min(1, "Search query is required").max(200).trim(),
});

export const surahIdSchema = z.coerce.number().int().min(1).max(114);

export const bookmarkIdSchema = z.string().min(1).max(50).regex(/^[a-zA-Z0-9_-]+$/, "Invalid bookmark ID");
