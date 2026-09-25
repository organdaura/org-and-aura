import { test, expect } from "@playwright/test";

test.describe("Admin Portal Authentication & Operations", () => {
  test("unauthenticated access to /admin should redirect to /admin/login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.getByText(/Administrative Portal/i)).toBeVisible();
  });

  test("should authenticate with seed credentials and view dashboard", async ({ page }) => {
    await page.goto("/admin/login");

    await page.fill("#admin-email", "admin@organdaura.com");
    await page.fill("#admin-password", "Admin@OrgAura2026!");
    await page.click('button[type="submit"]');

    // Wait for Executive Dashboard heading to be visible
    await expect(
      page.getByRole("heading", { name: /Executive Dashboard/i })
    ).toBeVisible({ timeout: 10000 });

    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByText("Inquiries", { exact: true })).toBeVisible();
    await expect(page.getByText("Applications", { exact: true })).toBeVisible();
  });

  test("should view support tickets and allow updating status", async ({ page }) => {
    // Log in first and wait for dashboard
    await page.goto("/admin/login");
    await page.fill("#admin-email", "admin@organdaura.com");
    await page.fill("#admin-password", "Admin@OrgAura2026!");
    await page.click('button[type="submit"]');

    await expect(
      page.getByRole("heading", { name: /Executive Dashboard/i })
    ).toBeVisible({ timeout: 10000 });

    // Navigate to support management
    await page.goto("/admin/support");
    await expect(
      page.getByRole("heading", { name: /Support & Institutional Inquiries/i })
    ).toBeVisible({ timeout: 10000 });

    // Check if select elements exist and update status
    const statusSelects = page.locator('select[id^="status-"]');
    if ((await statusSelects.count()) > 0) {
      const firstSelect = statusSelects.first();
      await firstSelect.selectOption("IN_PROGRESS");
      await expect(firstSelect).toHaveValue("IN_PROGRESS");
    }
  });
});
