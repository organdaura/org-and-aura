import crypto from "crypto";

const CAPTCHA_SECRET =
  process.env.SESSION_SECRET || "default_captcha_secret_must_change_in_prod";
const CAPTCHA_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

export interface CaptchaChallenge {
  question: string;
  token: string;
}

/**
 * Generates an accessible math or word challenge with an HMAC-signed token
 */
export function generateCaptcha(): CaptchaChallenge {
  const num1 = Math.floor(Math.random() * 8) + 2; // 2-9
  const num2 = Math.floor(Math.random() * 8) + 2; // 2-9
  const expectedAnswer = String(num1 + num2);
  const timestamp = Date.now();

  const payload = `${expectedAnswer}:${timestamp}`;
  const signature = crypto
    .createHmac("sha256", CAPTCHA_SECRET)
    .update(payload)
    .digest("hex");

  const token = Buffer.from(`${payload}:${signature}`).toString("base64");

  return {
    question: `Security Check: What is ${num1} + ${num2}?`,
    token,
  };
}

/**
 * Verifies the user's captcha answer against the signed token
 */
export function verifyCaptcha(answer: string, token: string): boolean {
  try {
    if (!answer || !token) return false;

    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [expectedAnswer, timestampStr, signature] = decoded.split(":");

    if (!expectedAnswer || !timestampStr || !signature) return false;

    // Check expiration
    const timestamp = parseInt(timestampStr, 10);
    if (isNaN(timestamp) || Date.now() - timestamp > CAPTCHA_EXPIRY_MS) {
      return false;
    }

    // Verify HMAC
    const expectedSignature = crypto
      .createHmac("sha256", CAPTCHA_SECRET)
      .update(`${expectedAnswer}:${timestampStr}`)
      .digest("hex");

    if (
      !crypto.timingSafeEqual(
        Buffer.from(signature, "hex"),
        Buffer.from(expectedSignature, "hex")
      )
    ) {
      return false;
    }

    // Compare user answer (trim and lowercase)
    return answer.trim().toLowerCase() === expectedAnswer.trim().toLowerCase();
  } catch (err) {
    console.error("Captcha verification failure:", err);
    return false;
  }
}
