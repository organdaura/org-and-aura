import { test, expect } from "@playwright/test";

test.describe("Navigation & Active Route Flow", () => {
  test("should highlight active link indicator on each public route", async ({ page }) => {
    // 1. Visit Home
    await page.goto("/");
    const homeLink = page.locator('header a:has-text("HOME"):visible').first();
    await expect(homeLink).toHaveClass(/text-forest-700/);

    // 2. Click PRODUCT
    await page.locator('header a:has-text("PRODUCT"):visible').first().click();
    await expect(page).toHaveURL(/.*\/product/);
    const productLink = page.locator('header a:has-text("PRODUCT"):visible').first();
    await expect(productLink).toHaveClass(/text-forest-700/);

    // 3. Click GALLERY
    await page.locator('header a:has-text("GALLERY"):visible').first().click();
    await expect(page).toHaveURL(/.*\/gallery/);
    const galleryLink = page.locator('header a:has-text("GALLERY"):visible').first();
    await expect(galleryLink).toHaveClass(/text-forest-700/);

    // 4. Click BLOG
    await page.locator('header a:has-text("BLOG"):visible').first().click();
    await expect(page).toHaveURL(/.*\/blog/);
    const blogLink = page.locator('header a:has-text("BLOG"):visible').first();
    await expect(blogLink).toHaveClass(/text-forest-700/);

    // 5. Click OUR TEAM
    await page.locator('header a:has-text("OUR TEAM"):visible').first().click();
    await expect(page).toHaveURL(/.*\/team/);
    const teamLink = page.locator('header a:has-text("OUR TEAM"):visible').first();
    await expect(teamLink).toHaveClass(/text-forest-700/);

    // 6. Click CAREER
    await page.locator('header a:has-text("CAREER"):visible').first().click();
    await expect(page).toHaveURL(/.*\/career/);
    const careerLink = page.locator('header a:has-text("CAREER"):visible').first();
    await expect(careerLink).toHaveClass(/text-forest-700/);
  });

  test("should render 404 page on invalid route", async ({ page }) => {
    const response = await page.goto("/non-existent-page-route-test-404");
    expect(response?.status()).toBe(404);
    await expect(page.getByText("404")).toBeVisible();
    await expect(page.getByRole("heading", { name: /Page Not Found/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Return to Home/i })).toBeVisible();
  });
});
