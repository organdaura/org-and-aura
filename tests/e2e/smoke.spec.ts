import { test, expect } from "@playwright/test";

test.describe("Public Smoke Tests", () => {
  test("should render Home page with correct headings and carbon counter", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Org & Aura/);
    await expect(
      page.getByRole("heading", { name: /WELCOME TO ORG AND AURA/i })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /The Anatomy of a Clean Future/i })
    ).toBeVisible();
    await expect(page.getByText(/Global Carbon Emission/i)).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Support Our Growth/i })
    ).toBeVisible();
  });

  test("should render Product page with SanDi specs and FAQs", async ({ page }) => {
    await page.goto("/product");
    await expect(
      page.getByRole("heading", { name: /The SanDi Machine/i })
    ).toBeVisible();
    await expect(page.getByText(/Product Information/i)).toBeVisible();
    await expect(page.getByText(/Why Sandi\?/i)).toBeVisible();
    await expect(page.getByText(/Safety Features/i)).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Frequently Asked Questions/i })
    ).toBeVisible();
  });

  test("should render Gallery page with project cards", async ({ page }) => {
    await page.goto("/gallery");
    await expect(
      page.getByRole("heading", { name: /Our Gallery/i })
    ).toBeVisible();
    await expect(
      page.getByText(/Explore the impact and innovation behind SanDi/i)
    ).toBeVisible();
    await expect(page.getByText(/SRM Easwari Engineering College/i)).toBeVisible();
  });

  test("should render Blog editorial grid and article detail route", async ({ page }) => {
    await page.goto("/blog");
    await expect(
      page.getByRole("heading", { name: /Latest News & Insights/i })
    ).toBeVisible();
    await expect(
      page.getByText(/Global Trends in Sustainable Waste Management/i).first()
    ).toBeVisible();

    // Click article
    await page.click("text=Global Trends in Sustainable Waste Management");
    await expect(page).toHaveURL(/.*\/blog\/global-trends-in-sustainable-waste-management/);
    await expect(
      page.getByRole("heading", { name: /Global Trends in Sustainable Waste Management/i })
    ).toBeVisible();
  });

  test("should render Team page with founders and team members", async ({ page }) => {
    await page.goto("/team");
    await expect(
      page.getByRole("heading", { name: /Our Founders/i })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Our Team/i })
    ).toBeVisible();
    await expect(page.getByText(/Lokesh Rao/i)).toBeVisible();
    await expect(page.getByText(/Bargav/i)).toBeVisible();
  });

  test("should render Career hiring page", async ({ page }) => {
    await page.goto("/career");
    await expect(
      page.getByRole("heading", { name: /Join the Org and Aura Team/i })
    ).toBeVisible();
    await expect(page.getByLabel(/Full Name/i)).toBeVisible();
    await expect(page.getByLabel(/Mobile Number/i)).toBeVisible();
    await expect(page.getByLabel(/Email Address/i)).toBeVisible();
  });

  test("should render Signup page", async ({ page }) => {
    await page.goto("/signup");
    await expect(
      page.getByRole("heading", { name: /Create an Account/i })
    ).toBeVisible();
    await expect(page.getByText(/Sign in with Google/i)).toBeVisible();
  });

  test("should render Support page with contact card", async ({ page }) => {
    await page.goto("/support");
    await expect(
      page.getByRole("heading", { name: /Support & Contact/i })
    ).toBeVisible();
    await expect(page.getByText(/organdaura@gmail.com/i).first()).toBeVisible();
    await expect(page.getByText(/Email Us Directly/i)).toBeVisible();
  });
});
