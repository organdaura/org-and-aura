import { test, expect } from "@playwright/test";

test.describe("Interactive Form Submissions & PostgreSQL Persistence", () => {
  test("should successfully submit Career Application and show confirmation", async ({ page }) => {
    await page.goto("/career");

    const uniqueEmail = `test.applicant.${Date.now()}@example.com`;

    await page.fill('input[name="fullName"]', "Playwright Candidate");
    await page.fill('input[name="mobileNumber"]', "+91 9123456780");
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('textarea[name="physicalAddress"]', "12 Green Way, Chennai, India");
    await page.fill('input[name="topSkills"]', "Next.js, TypeScript, Mechanical Engineering");
    await page.selectOption('select[name="department"]', "Hardware Engineering");
    await page.selectOption('select[name="roleType"]', "Full-time");

    await page.click('button[type="submit"]');

    // Verification of success alert
    await expect(page.getByText(/Application Submitted!/i)).toBeVisible({ timeout: 10000 });
  });

  test("should handle Support form CAPTCHA calculation and submission", async ({ page }) => {
    await page.goto("/support");

    // Fill form fields
    await page.fill('input[name="name"]', "Facilities Director");
    await page.fill('input[name="email"]', `support.test.${Date.now()}@hospital.org`);
    await page.fill('input[name="subject"]', "Automated E2E Pilot Request");
    await page.fill('textarea[name="message"]', "This is an automated test inquiring about pilot machine specs.");

    // Wait for the captcha challenge label
    const captchaLabel = page.locator('label[for="captcha-answer-input"]');
    await expect(captchaLabel).toBeVisible();
    const labelText = await captchaLabel.textContent();

    // Extract numbers from "Security Check: What is X + Y?"
    const match = labelText?.match(/What is (\d+) \+ (\d+)\?/);
    if (match) {
      const sum = String(parseInt(match[1], 10) + parseInt(match[2], 10));
      await page.fill("#captcha-answer-input", sum);
    } else {
      await page.fill("#captcha-answer-input", "10");
    }

    await page.click('button[type="submit"]:has-text("Submit Request")');

    // Confirm success message
    await expect(page.getByText(/Request Received/i)).toBeVisible({ timeout: 10000 });
  });

  test("should reject support submission with invalid captcha", async ({ page }) => {
    await page.goto("/support");

    await page.fill('input[name="name"]', "Bot Suspect");
    await page.fill('input[name="email"]', "bot@spamsite.org");
    await page.fill('input[name="subject"]', "Spam Request");
    await page.fill('textarea[name="message"]', "Automated spam test should be rejected.");
    await page.fill("#captcha-answer-input", "9999"); // intentionally wrong

    await page.click('button[type="submit"]:has-text("Submit Request")');

    await expect(
      page.getByText(/Anti-bot verification failed/i)
    ).toBeVisible({ timeout: 10000 });
  });
});
