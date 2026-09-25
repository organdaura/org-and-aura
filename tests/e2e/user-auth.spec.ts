import { test, expect } from "@playwright/test";

test.describe("Member Authentication, Navbar State & Account Dashboard", () => {
  test("Navbar displays Login button directly beside Sign Up", async ({ page }) => {
    await page.goto("/");

    // Verify both Login and Sign Up are visible in header
    const loginLink = page.locator('header a[href="/login"]:visible');
    const signupLink = page.locator('header a[href="/signup"]:visible');

    await expect(loginLink).toBeVisible();
    await expect(signupLink).toBeVisible();

    // Verify clicking Login navigates to /login
    await loginLink.first().click();
    await expect(page).toHaveURL(/.*\/login/);
    await expect(page.locator("h1")).toContainText(/Welcome Back/i);
  });

  test("User can register via Direct Email, redirects to /account, and updates Navbar", async ({ page }) => {
    await page.goto("/signup");

    const uniqueEmail = `member.${Date.now()}@example.com`;
    const fullName = "Aria Montgomery";
    const password = "Password@123!";

    // Switch to Direct Email tab
    await page.getByRole("button", { name: /Direct Email/i }).click();

    // Fill registration form
    await page.fill("#signup-name", fullName);
    await page.fill("#signup-email", uniqueEmail);
    await page.fill("#signup-password", password);

    await page.click('button[type="submit"]:has-text("Create Account")');

    // Should redirect to /account
    await expect(page).toHaveURL(/.*\/account/, { timeout: 10000 });

    // Verify account profile card
    await expect(page.locator("h1")).toContainText(fullName);
    await expect(page.getByText(uniqueEmail)).toBeVisible();
    await expect(page.getByText("Member", { exact: true })).toBeVisible();

    // Verify Navbar shows Account link
    await expect(page.locator('header a[href="/account"]:visible')).toBeVisible();

    // Sign out
    await page.locator('button[title="Sign Out"]:visible').click();
    await expect(page).toHaveURL(/\/$/, { timeout: 10000 });

    // Navbar should return to Login / Sign Up
    await expect(page.locator('header a[href="/login"]:visible')).toBeVisible();
  });

  test("Registered user can log in via /login with valid password", async ({ page }) => {
    const email = `login.test.${Date.now()}@example.com`;
    const password = "ValidPassword123!";

    // Register user via API for fast setup
    const regRes = await page.request.post("/api/auth/signup", {
      data: {
        name: "Test Login User",
        email,
        password,
      },
    });
    expect(regRes.status()).toBe(200);

    // Clear session by visiting /
    await page.goto("/");
    await page.context().clearCookies();

    // Visit login page
    await page.goto("/login");
    await page.fill("#login-email", email);
    await page.fill("#login-password", password);
    await page.click('button[type="submit"]:has-text("Log In")');

    // Should redirect to /account
    await expect(page).toHaveURL(/.*\/account/, { timeout: 10000 });
    await expect(page.getByText(email)).toBeVisible();
  });

  test("Google Sign-In modal provisions account and logs user in", async ({ page }) => {
    await page.goto("/login");

    // Click Google Sign-in button
    await page.click('button:has-text("Sign in with Google")');

    // Modal opens
    await expect(page.getByRole("heading", { name: /Sign in with Google/i })).toBeVisible();

    const googleEmail = `google.user.${Date.now()}@gmail.com`;
    const googleName = "Eco Visionary";

    await page.fill('input[placeholder="e.g. Alex Henderson"]', googleName);
    await page.fill('input[placeholder="alex.henderson@gmail.com"]', googleEmail);

    await page.click('button:has-text("Confirm & Authenticate")');

    // Redirect to member dashboard
    await expect(page).toHaveURL(/.*\/account/, { timeout: 10000 });
    await expect(page.locator("h1")).toContainText(googleName);
    await expect(page.getByText(googleEmail)).toBeVisible();
  });

  test("Unauthenticated user accessing /account is redirected to /login", async ({ browser }) => {
    const context = await browser.newContext(); // fresh context with no cookies
    const page = await context.newPage();

    await page.goto("/account");
    await expect(page).toHaveURL(/.*\/login/, { timeout: 10000 });
    await context.close();
  });
});
