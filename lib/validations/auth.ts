import { z } from "zod";

export const userSignupSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(150, "Email cannot exceed 150 characters"),
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password cannot exceed 128 characters"),
});

export const userLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required"),
});

export const googleAuthSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Valid Google account email required"),
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .default("Google User"),
  googleId: z.string().optional(),
});

export const adminLoginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type UserSignupInput = z.infer<typeof userSignupSchema>;
export type UserLoginInput = z.infer<typeof userLoginSchema>;
export type GoogleAuthInput = z.infer<typeof googleAuthSchema>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

