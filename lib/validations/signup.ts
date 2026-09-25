import { z } from "zod";

export const signupSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .max(150, "Email cannot exceed 150 characters"),
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .optional(),
  provider: z.enum(["GOOGLE", "EMAIL"]).default("EMAIL"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),
});

export type SignupInput = z.infer<typeof signupSchema>;
