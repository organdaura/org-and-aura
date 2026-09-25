import { test, expect } from "@playwright/test";

test.describe("Responsive Viewport & Overflow Tests", () => {
  const viewports = [
    { width: 375, height: 667, name: "iPhone SE" },
    { width: 390, height: 844, name: "iPhone 12/13/14" },
    { width: 768, height: 1024, name: "iPad Portrait" },
    { width: 1280, height: 800, name: "Desktop" },
  ];

  for (const vp of viewports) {
    test(`should render Home without horizontal overflow on ${vp.name} (${vp.width}x${vp.height})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/");

      // Check for horizontal overflow
      const isOverflowing = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      expect(isOverflowing).toBe(false);
    });

    test(`should render Product without horizontal overflow on ${vp.name} (${vp.width}x${vp.height})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/product");

      const isOverflowing = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      expect(isOverflowing).toBe(false);
    });
  }
});
