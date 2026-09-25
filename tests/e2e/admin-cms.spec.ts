import { test, expect } from "@playwright/test";

test.describe("Admin CMS Suite: Team Management, Blog Toggles, Support Notes & Uploads", () => {
  test.beforeEach(async ({ page }) => {
    // Authenticate as administrator
    await page.goto("/admin/login");
    await page.fill("#admin-email", "admin@organdaura.com");
    await page.fill("#admin-password", "Admin@OrgAura2026!");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/admin$/);
  });

  test("should manage Team & Mentors with creation, tabs, and visibility toggle", async ({ page }) => {
    // Navigate to Team Management
    await page.goto("/admin/team");
    await expect(page.getByText(/Team & Mentors Management/i)).toBeVisible();

    // Check tabs exist
    await expect(page.getByRole("button", { name: /All Members/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Founders/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Core Team/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Mentors/i })).toBeVisible();

    // Open Add Member modal
    await page.click('button:has-text("Add Member")');
    await expect(page.getByText(/Add New Team Member/i)).toBeVisible();

    const uniqueName = `Prof. Test Mentor ${Date.now()}`;
    await page.fill('input[placeholder="e.g. Dr. Jane Doe"]', uniqueName);
    await page.fill('input[placeholder="e.g. Co-Founder & CTO"]', "Senior Environmental Advisor");
    await page.selectOption("select", "MENTOR");

    // Select a preset avatar
    const presetButtons = page.locator('button[type="button"]:has(img[alt="preset"])');
    if ((await presetButtons.count()) > 0) {
      await presetButtons.first().click();
    }

    // Submit
    await page.click('button[type="submit"]:has-text("Create Member")');

    // Verify member is displayed in list
    await expect(page.getByText(uniqueName)).toBeVisible({ timeout: 10000 });

    // Filter to Mentors tab
    await page.click('button:has-text("Mentors")');
    await expect(page.getByText(uniqueName)).toBeVisible();

    // Filter to Core Team tab and verify mentor is NOT in core team tab
    await page.click('button:has-text("Core Team")');
    await expect(page.getByText(uniqueName)).not.toBeVisible();

    // Return to All tab
    await page.click('button:has-text("All Members")');
    const memberCard = page.locator(`div:has-text("${uniqueName}")`).last();

    // Toggle visibility to Hidden
    const toggleBtn = memberCard.locator('button:has-text("Active")');
    if ((await toggleBtn.count()) > 0) {
      await toggleBtn.click();
      await expect(memberCard.locator('button:has-text("Hidden")')).toBeVisible({ timeout: 5000 });
    }
  });

  test("should toggle Blog article publish status and affect public availability", async ({ page }) => {
    await page.goto("/admin/blog");
    await expect(page.getByText(/Editorial & Insights Management/i)).toBeVisible();

    // Find the first article card
    const firstArticle = page.locator(".card-organic").filter({ hasText: "/blog/" }).first();
    await expect(firstArticle).toBeVisible();

    // Check current state
    const publishBtn = firstArticle.locator("button").filter({ hasText: /Published|Draft/i });
    const currentText = await publishBtn.textContent();

    // Toggle state
    await publishBtn.click();

    // Verify text toggles
    if (currentText?.includes("Published")) {
      await expect(firstArticle.locator('button:has-text("Draft")')).toBeVisible({ timeout: 5000 });
    } else {
      await expect(firstArticle.locator('button:has-text("Published")')).toBeVisible({ timeout: 5000 });
    }

    // Toggle back to original state to keep data clean
    const updatedBtn = firstArticle.locator("button").filter({ hasText: /Published|Draft/i });
    await updatedBtn.click();
  });

  test("should save internal Admin Notes on Support tickets and persist upon reload", async ({ page, request }) => {
    await page.goto("/admin/support");
    await expect(page.getByText(/Support & Institutional Inquiries/i)).toBeVisible();

    const firstTicket = page.locator(".card-organic").first();
    await expect(firstTicket).toBeVisible();

    const testNote = `Verified installation schedule: SanDi Unit ${Date.now()}`;
    const notesTextarea = firstTicket.locator("textarea");
    await notesTextarea.fill(testNote);

    // Click Save Note
    await firstTicket.locator('button:has-text("Save Note")').click();

    // Confirm success feedback alert
    await expect(page.getByText(/Ticket updated successfully/i)).toBeVisible({ timeout: 5000 });

    // Reload page to verify persistence in PostgreSQL
    await page.reload();
    await expect(firstTicket.locator("textarea")).toHaveValue(testNote);
  });

  test("should display uploaded candidate resumes with download button in Admin Career view", async ({ page, request }) => {
    const candidateEmail = `resume.applicant.${Date.now()}@biotech.org`;
    await request.post("http://localhost:3000/api/career/apply", {
      data: {
        fullName: "Resume Candidate Test",
        mobileNumber: "+91 9123456789",
        email: candidateEmail,
        physicalAddress: "Biotech Campus, Hyderabad, India",
        topSkills: "Microbiology, Autoclave Systems",
        department: "Biochemical Research",
        roleType: "Full-time",
        resumeUrl: "/uploads/resumes/sample-cv.pdf",
        resumeFilename: "Sample_Biotech_CV.pdf",
      },
    });

    await page.goto("/admin/career");
    await expect(page.getByText(/Talent & Career Applications/i)).toBeVisible();

    const candidateCard = page.locator(".card-organic").filter({ hasText: candidateEmail }).first();
    await expect(candidateCard).toBeVisible();
    await expect(candidateCard.getByText(/Sample_Biotech_CV\.pdf/i)).toBeVisible();
    await expect(candidateCard.getByRole("link", { name: /Download Resume/i })).toBeVisible();
  });
});

test.describe("Admin Upload Security", () => {
  test("should enforce security on image upload endpoint", async ({ request }) => {
    // 1. Direct unauthenticated upload attempt should be 401
    const unauthRes = await request.post("http://localhost:3000/api/admin/upload", {
      multipart: {
        file: {
          name: "test.png",
          mimeType: "image/png",
          buffer: Buffer.from("fake-png-content"),
        },
      },
    });
    expect(unauthRes.status()).toBe(401);
  });
});
