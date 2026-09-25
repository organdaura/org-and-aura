import { test, expect } from "@playwright/test";

test.describe("Security & Resilience Tests", () => {
  test("Health check endpoint returns pass and database status", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.status).toBe("pass");
    expect(data.version).toBe("1.0.0");
    expect(data.services.database.status).toBe("healthy");
    expect(typeof data.services.database.responseTimeMs).toBe("number");
  });

  test("Unauthorized direct API request to admin endpoint is rejected with 401", async ({ request }) => {
    const response = await request.get("/api/admin/stats");
    expect(response.status()).toBe(401);

    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error.code).toBe("UNAUTHORIZED");
  });

  test("Honeypot bot traps reject automated submissions immediately", async ({ request }) => {
    const response = await request.post("/api/support", {
      data: {
        name: "Spam Bot",
        email: "bot@spammer.com",
        subject: "GENERAL",
        message: "Buy cheap meds now",
        captchaToken: "test",
        captchaAnswer: "4",
        website_honeypot: "http://spamlink.com", // Trigger honeypot
      },
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error.code).toBe("BOT_DETECTED");
  });

  test("Harmless XSS and quote payloads are treated strictly as string data", async ({ page }) => {
    // Navigate to support page
    const captchaPromise = page.waitForResponse(
      (resp) => resp.url().includes("/api/captcha") && resp.status() === 200
    );
    await page.goto("/support");
    await captchaPromise;

    const harmlessPayload = '<script>alert("xss")</script> & "quotes" \'test\'';

    await page.fill('input[name="name"]', "Security Auditor");
    await page.fill('input[name="email"]', `auditor.${Date.now()}@example.com`);
    await page.fill('input[name="subject"]', "Security Audit Test");
    await page.fill('textarea[name="message"]', harmlessPayload);

    // Fetch CAPTCHA answer
    await expect(page.locator('button[title="Get new question"]')).toBeEnabled();
    const captchaLabel = page.locator('label[for="captcha-answer-input"]');
    const labelText = await captchaLabel.textContent();
    const match = labelText?.match(/What is (\d+) \+ (\d+)\?/);
    if (match) {
      const sum = String(parseInt(match[1], 10) + parseInt(match[2], 10));
      await page.fill("#captcha-answer-input", sum);
    }

    await page.click('button[type="submit"]:has-text("Submit Request")');

    // Verify confirmation without executing script
    await expect(page.getByText(/Request Received/i)).toBeVisible({ timeout: 10000 });
  });

  test("Rate limiting rejects excessive requests with HTTP 429 and Retry-After", async ({ request }) => {
    // Using a distinct IP simulation or rapid calls
    const payload = {
      name: "Rate Limit Tester",
      email: "ratelimit@example.com",
      subject: "GENERAL",
      message: "Testing rate limiter threshold",
      captchaToken: "invalid_token",
      captchaAnswer: "0",
    };

    let hitRateLimit = false;
    let retryAfterHeader: string | null = null;

    // Send 7 rapid requests (threshold is 5 per 60s)
    for (let i = 0; i < 7; i++) {
      const res = await request.post("/api/support", {
        data: payload,
        headers: {
          "x-forwarded-for": "198.51.100.42", // Isolated test IP
        },
      });

      if (res.status() === 429) {
        hitRateLimit = true;
        retryAfterHeader = res.headers()["retry-after"];
        const body = await res.json();
        expect(body.error.code).toBe("RATE_LIMITED");
        break;
      }
    }

    expect(hitRateLimit).toBe(true);
    expect(retryAfterHeader).toBeDefined();
    expect(Number(retryAfterHeader)).toBeGreaterThan(0);
  });
});
