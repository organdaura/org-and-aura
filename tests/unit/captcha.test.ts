import { describe, it, expect } from "vitest";
import { generateCaptcha, verifyCaptcha } from "@/lib/captcha";

describe("Anti-bot CAPTCHA Security", () => {
  it("should generate a valid challenge question and signed token", () => {
    const challenge = generateCaptcha();
    expect(challenge.question).toMatch(/^Security Check: What is \d+ \+ \d+\?$/);
    expect(challenge.token).toBeDefined();
    expect(challenge.token.length).toBeGreaterThan(20);
  });

  it("should accept the correct mathematical answer", () => {
    const challenge = generateCaptcha();
    const match = challenge.question.match(/What is (\d+) \+ (\d+)\?/);
    expect(match).not.toBeNull();
    if (!match) return;

    const n1 = parseInt(match[1], 10);
    const n2 = parseInt(match[2], 10);
    const sum = String(n1 + n2);

    expect(verifyCaptcha(sum, challenge.token)).toBe(true);
  });

  it("should reject incorrect answers", () => {
    const challenge = generateCaptcha();
    expect(verifyCaptcha("999", challenge.token)).toBe(false);
    expect(verifyCaptcha("wrong", challenge.token)).toBe(false);
    expect(verifyCaptcha("", challenge.token)).toBe(false);
  });

  it("should reject tampered or empty tokens", () => {
    expect(verifyCaptcha("5", "")).toBe(false);
    expect(verifyCaptcha("5", "invalid_base64_string")).toBe(false);
  });
});
