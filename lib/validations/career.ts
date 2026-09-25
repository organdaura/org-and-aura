import { z } from "zod";

export const careerApplicationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full Name must be at least 2 characters")
    .max(100, "Full Name cannot exceed 100 characters"),
  mobileNumber: z
    .string()
    .trim()
    .regex(/^[0-9+\s\-()]{7,20}$/, "Please enter a valid mobile phone number"),
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .max(150, "Email cannot exceed 150 characters"),
  physicalAddress: z
    .string()
    .trim()
    .min(5, "Physical Address must be at least 5 characters")
    .max(250, "Address cannot exceed 250 characters"),
  topSkills: z
    .string()
    .trim()
    .min(2, "Please list your primary skills")
    .max(300, "Skills description cannot exceed 300 characters"),
  department: z
    .string()
    .trim()
    .min(1, "Please select a department")
    .refine((val) => val !== "-- Choose a Department --", "Please choose a valid department"),
  roleType: z
    .string()
    .trim()
    .min(1, "Please select a role type")
    .refine((val) => val !== "-- Choose Role Type --", "Please choose a valid role type"),
  resumeUrl: z.string().trim().max(500).optional().nullable(),
  resumeFilename: z.string().trim().max(255).optional().nullable(),
  // Honeypot field
  bot_trap: z.string().max(0, "Bot detected").optional().or(z.literal("")),
});

export type CareerApplicationInput = z.infer<typeof careerApplicationSchema>;
