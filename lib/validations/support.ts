import { z } from "zod";

export const supportRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .max(150, "Email cannot exceed 150 characters"),
  subject: z
    .string()
    .trim()
    .min(3, "Subject must be at least 3 characters")
    .max(150, "Subject cannot exceed 150 characters"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message cannot exceed 2000 characters"),
  captchaAnswer: z
    .string()
    .trim()
    .min(1, "Please answer the anti-bot question"),
  captchaToken: z
    .string()
    .min(10, "Invalid captcha token"),
  // Honeypot field - must remain empty
  website_honeypot: z.string().max(0, "Bot detected").optional().or(z.literal("")),
});

export type SupportRequestInput = z.infer<typeof supportRequestSchema>;
