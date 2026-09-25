import { describe, it, expect } from "vitest";
import { supportRequestSchema } from "@/lib/validations/support";
import { careerApplicationSchema } from "@/lib/validations/career";
import { signupSchema } from "@/lib/validations/signup";
import { adminLoginSchema } from "@/lib/validations/auth";
import { blogPostSchema } from "@/lib/validations/blog";

describe("Validation Schemas Unit Tests", () => {
  describe("Support Request Schema", () => {
    it("should accept valid support payload", () => {
      const valid = {
        name: "Dr. Ananya Sen",
        email: "ananya@hospital.org",
        subject: "Institutional Installation Inquiry",
        message: "We would like to request demonstration and pilot testing for our maternity ward.",
        captchaAnswer: "12",
        captchaToken: "valid_token_1234567890",
        website_honeypot: "",
      };
      const res = supportRequestSchema.safeParse(valid);
      expect(res.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const invalid = {
        name: "Dr. Ananya Sen",
        email: "not-an-email",
        subject: "Pilot Inquiry",
        message: "Short message but long enough here.",
        captchaAnswer: "12",
        captchaToken: "valid_token_1234567890",
      };
      const res = supportRequestSchema.safeParse(invalid);
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.errors.some((e) => e.path[0] === "email")).toBe(true);
      }
    });

    it("should reject bot honeypot submission", () => {
      const botPayload = {
        name: "Bot User",
        email: "bot@spam.com",
        subject: "Buy Cheap Meds",
        message: "Spam content message here for test.",
        captchaAnswer: "12",
        captchaToken: "valid_token_1234567890",
        website_honeypot: "https://spam.com",
      };
      const res = supportRequestSchema.safeParse(botPayload);
      expect(res.success).toBe(false);
    });
  });

  describe("Career Application Schema", () => {
    it("should accept valid career application", () => {
      const valid = {
        fullName: "Karthik Raja",
        mobileNumber: "+91 9876543210",
        email: "karthik.raja@srm.edu",
        physicalAddress: "Bharathi Salai, Ramapuram, Chennai",
        topSkills: "Embedded Firmware, STM32, Thermal Sensors",
        department: "Embedded Systems",
        roleType: "Full-time",
        bot_trap: "",
      };
      const res = careerApplicationSchema.safeParse(valid);
      expect(res.success).toBe(true);
    });

    it("should reject default unselected department or role", () => {
      const invalid = {
        fullName: "Karthik Raja",
        mobileNumber: "+91 9876543210",
        email: "karthik.raja@srm.edu",
        physicalAddress: "Chennai",
        topSkills: "Embedded Firmware",
        department: "-- Choose a Department --",
        roleType: "-- Choose Role Type --",
      };
      const res = careerApplicationSchema.safeParse(invalid);
      expect(res.success).toBe(false);
    });
  });

  describe("Blog Post Schema", () => {
    it("should enforce lowercase slug format", () => {
      const invalidSlug = {
        title: "Test Article Title",
        slug: "Test Slug With Capital And Space",
        category: "Deep Dive",
        excerpt: "This is a valid excerpt exceeding ten characters.",
        body: "This is the body content of the test article which is sufficiently long.",
        published: true,
      };
      const res = blogPostSchema.safeParse(invalidSlug);
      expect(res.success).toBe(false);
    });

    it("should accept clean lowercase hyphenated slug", () => {
      const validSlug = {
        title: "Thermal Neutralization Physics",
        slug: "thermal-neutralization-physics",
        category: "Deep Dive",
        excerpt: "This is a valid excerpt exceeding ten characters.",
        body: "This is the body content of the test article which is sufficiently long.",
        published: true,
      };
      const res = blogPostSchema.safeParse(validSlug);
      expect(res.success).toBe(true);
    });
  });

  describe("Admin Login Schema", () => {
    it("should validate email format and password length", () => {
      expect(
        adminLoginSchema.safeParse({ email: "bad", password: "123" }).success
      ).toBe(false);
      expect(
        adminLoginSchema.safeParse({
          email: "admin@organdaura.com",
          password: "Admin@OrgAura2026!",
        }).success
      ).toBe(true);
    });
  });
});
