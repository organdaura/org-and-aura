import { test, expect } from "@playwright/test";

test.describe("Accessibility and Keyboard Navigation", () => {
  const routes = [
    "/",
    "/product",
    "/gallery",
    "/blog",
    "/team",
    "/career",
    "/signup",
    "/support",
  ];

  for (const route of routes) {
    test(`should have exactly one h1 tag on ${route}`, async ({ page }) => {
      await page.goto(route);
      const h1Count = await page.locator("h1").count();
      expect(h1Count).toBe(1);
    });
  }

  test("Career form controls should have accessible labels", async ({ page }) => {
    await page.goto("/career");
    await expect(page.getByLabel("Full Name")).toBeVisible();
    await expect(page.getByLabel("Mobile Number")).toBeVisible();
    await expect(page.getByLabel("Email Address")).toBeVisible();
    await expect(page.getByLabel("Physical Address")).toBeVisible();
    await expect(page.getByLabel("Your Top Skills")).toBeVisible();
    await expect(page.getByLabel("Select Department")).toBeVisible();
    await expect(page.getByLabel("Role Type")).toBeVisible();
  });

  test("Support form controls should have accessible labels", async ({ page }) => {
    await page.goto("/support");
    await expect(page.getByLabel("Your Name")).toBeVisible();
    await expect(page.getByLabel("Email Address")).toBeVisible();
    await expect(page.getByLabel("Subject / Category")).toBeVisible();
    await expect(page.getByLabel("Message")).toBeVisible();
  });
});
