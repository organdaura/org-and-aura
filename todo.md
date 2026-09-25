# Org & Aura Website Reconstruction — TODO

## 0. Reference & Scope
- [x] Use the supplied screen-recording as the source of truth for the visible workflow.
- [x] Ignore/refrain from recreating the original image assets for now.
- [x] Use clearly marked image placeholders everywhere an original image/photo is visible.
- [x] Preserve the original visual identity: warm off-white/cream background, muted botanical green palette, rounded cards, soft shadows, botanical decoration, compact fixed navigation.
- [x] Treat the lost original source files/backend as unavailable; do not assume hidden functionality that is not visible in the recording.

## 1. Project Foundation
- [x] Create a clean React/Next.js application with a maintainable component structure.
- [x] Use TypeScript.
- [x] Use Tailwind CSS or an equivalent utility/component styling system.
- [x] Keep content/data separate from presentation where practical.
- [x] Add a central theme/token layer for colors, typography, spacing, radii, shadows, and breakpoints.
- [x] Add a README explaining setup, development, testing, and image replacement.
- [x] Add `.env.example` if environment variables are needed.
- [x] Do not hard-code secrets, API keys, credentials, or private endpoints.

## 2. Global Visual System
- [x] Recreate the cream/off-white page background.
- [x] Recreate muted green primary/accent colors.
- [x] Recreate botanical/leaf decorative elements using placeholders until original assets are supplied.
- [x] Recreate rounded rectangular cards with subtle borders and soft elevation.
- [x] Recreate heading/body typography hierarchy.
- [x] Recreate compact horizontal navigation visible in the reference.
- [x] Preserve generous whitespace and the light editorial feel.
- [x] Avoid generic AI-dashboard styling, excessive gradients, glassmorphism, neon colors, giant pills, or unnecessary cards.
- [x] Make all spacing intentional and consistent.

## 3. Navigation
Reference navigation visibly contains:
- [x] Org & Aura branding/logo placeholder.
- [x] HOME
- [x] PRODUCT
- [x] GALLERY
- [x] BLOG
- [x] OUR TEAM
- [x] CAREER
- [x] Sign Up
- [x] Login (placed directly beside Sign Up in navbar)
- [x] Support
- [x] Dynamic session indicator in Navbar (displays Account / Sign Out when logged in)

Implement:
- [x] Correct active-page/section state.
- [x] Navigation works with mouse, touch, and keyboard.
- [x] Internal links do not create dead ends.
- [x] Preserve navigation on relevant pages/sections.
- [x] Mobile navigation must remain usable without horizontal overflow.
- [x] Support, Sign Up, and Login have clear functional states.

## 4. Home
Recreate the visible home flow:
- [x] Hero/welcome section.
- [x] "WELCOME TO ORG AND AURA" heading.
- [x] Supporting statement about bridging daily hygiene and environmental responsibility.
- [x] Botanical framing/decorative artwork.
- [x] "The Anatomy of a Clean Future." information card.
- [x] "Global Carbon Emission" card/counter section.
- [x] "Support Our Growth" CTA section.
- [x] "Join our mission" CTA.
- [x] "Learn more" CTA.
- [x] Appropriate transitions/scroll behavior.
- [x] Carbon counter must not produce broken/NaN/overflow states.

## 5. Product
- [x] Reconstruct the Product page/section visible through navigation.
- [x] Preserve the SanDi/product narrative shown in the recording.
- [x] Use placeholders for product images/diagrams.
- [x] Make product cards/content responsive.
- [x] Ensure CTA buttons have useful destination/state.
- [x] Add loading and empty states if data-driven behavior is implemented.

## 6. Gallery
Observed:
- [x] "Our Gallery" heading.
- [x] Intro text referencing the impact and innovation behind SanDi.
- [x] Large vertically stacked gallery/media cards.
- [x] Multiple achievement/project images.
- [x] Responsive image containers with consistent radius and spacing.
- [x] Placeholder assets until originals are supplied.
- [x] Prevent layout shift when images load.
- [x] Add accessible alt text placeholders.

## 7. Blog / News & Insights
Observed:
- [x] "Latest News & Insights" section.
- [x] Multi-card editorial grid.
- [x] Article title.
- [x] Published date/category metadata.
- [x] Short excerpt.
- [x] Per-card CTA such as Explore Current Trends / Read Full Article / View Case Study / Explore Careers / Read the Science.
- [x] Responsive 2-column desktop/tablet behavior and single-column mobile behavior.
- [x] Prevent broken links.
- [x] Add article detail route/state only if consistent with the reference workflow.
- [x] Handle missing/empty article content gracefully.

## 8. Founders / Team / Mentors
Observed:
- [x] "Our Founders" section.
- [x] Founder cards.
- [x] "Our Team" section.
- [x] Multi-card team grid.
- [x] "Our Mentors" section.
- [x] Preserve card proportions, radius, shadows, and spacing.
- [x] Placeholder image assets.
- [x] Names/titles should come from the reference where legible; otherwise use clearly editable placeholder content.
- [x] Broken/missing image behavior must look intentional, not like a failed `<img>`.
- [x] Keyboard-accessible cards if cards are interactive.

## 9. Career / Sign Up / Support / Member Account
- [x] Reconstruct the visible Career/Sign Up/Support workflow from the recording.
- [x] Build forms with labels, helper text, validation, error states, success states, and disabled/loading states.
- [x] Do not silently discard user input.
- [x] Preserve entered values after validation errors where appropriate.
- [x] Prevent duplicate submissions.
- [x] Show a clear result after submission.
- [x] Real PostgreSQL backend with bcrypt hashing and session cookies implemented.
- [x] Dedicated Member Login route (`/login`) with Direct Email & Google Sign-In options.
- [x] Dedicated Member Signup route (`/signup`) with Direct Email & Google Sign-In options.
- [x] Dedicated Member Account Dashboard (`/account`) showing user profile, status, tracked support inquiries, and career applications.
- [x] Google Auth Modal with interactive dialog and preset simulated profiles.

## 10. Footer
Observed:
- [x] Green footer area.
- [x] Social/contact icon row.
- [x] All icons have accessible labels.
- [x] Links have safe destinations.
- [x] No dead social links; use configurable placeholders until real URLs are supplied.

## 11. Image Replacement System
- [x] Put all image assets in one predictable folder.
- [x] Create an asset manifest/data file where practical.
- [x] Use obvious placeholder filenames.
- [x] Make replacing an image require changing only the asset path, not component code.
- [x] Do not generate fake logos/photos and present them as originals.
- [x] Support common formats and graceful loading failure.



# 17. Backend & Database — REQUIRED

## Backend Architecture
- [x] Build a real production-ready backend; do NOT leave forms as frontend-only demos.
- [x] Use a clear API/service layer.
- [x] Prefer Next.js server routes/server actions or a clearly separated Node.js API service.
- [x] Use TypeScript end-to-end.
- [x] Keep database access server-side only.
- [x] Never expose database credentials to the browser.
- [x] Validate every API request server-side even if the frontend already validates it.
- [x] Return consistent JSON response/error structures.
- [x] Add centralized error handling.
- [x] Add request logging without logging passwords, tokens, or sensitive form data.

## Database
- [x] Use PostgreSQL as the primary relational database.
- [x] Use Prisma ORM (or an equivalent strongly typed ORM if Antigravity has a compelling reason).
- [x] Create proper migrations.
- [x] Provide a seed script with safe demo data.
- [x] Add indexes for fields used in lookups, filtering, sorting, and uniqueness checks.
- [x] Add foreign keys and appropriate constraints.
- [x] Add timestamps (`createdAt`, `updatedAt`) where appropriate.
- [ ] Use transactions for multi-step writes.
- [x] Never rely only on frontend validation or application logic for uniqueness/integrity.

## Suggested Data Model
Create only what the actual product requires, but support at minimum:

### User / Admin
- [x] User/admin identity.
- [x] Role/permission model.
- [x] Secure password handling if password authentication is implemented.
- [x] Session management.
- [x] Account status.

### Contact / Support Requests
- [x] Name.
- [x] Email.
- [x] Subject/category if applicable.
- [x] Message.
- [x] Status.
- [x] Created/updated timestamps.
- [x] Admin notes where appropriate.

### Signups / Applications
- [x] Applicant identity/contact information.
- [x] Relevant application fields shown in the reference.
- [x] Status.
- [x] Created/updated timestamps.
- [x] Avoid storing unnecessary sensitive information.

### Careers
- [x] Job/application records only if the reference requires them.
- [x] Application status.
- [x] Candidate information required by the form.
- [x] Optional document metadata if file uploads are actually implemented (Resume upload pipeline with PDF/DOCX MIME verification & storage).

### Blog / News
- [x] Article.
- [x] Slug with uniqueness constraint.
- [x] Title.
- [x] Excerpt.
- [x] Body/content.
- [x] Category.
- [x] Published state.
- [ ] Published timestamp.
- [x] Created/updated timestamps.

### Team / Founders / Mentors
- [x] Person record.
- [x] Name.
- [x] Role/title.
- [ ] Bio if required.
- [x] Image/asset reference.
- [x] Display ordering.
- [ ] Published/active state.

### Gallery
- [x] Gallery item.
- [x] Title/caption if applicable.
- [x] Asset reference.
- [x] Display ordering.
- [ ] Published/active state.

Do not create unnecessary tables just to make the architecture look sophisticated.

## Admin
- [x] Build a secure admin area if content/forms need management.
- [x] Admin can view support requests.
- [x] Admin can view signup/application submissions.
- [x] Admin can manage blog/news content.
- [x] Admin can manage team/mentor/founder entries (`/admin/team`).
  - [x] Unified tabbed dashboard for Founders, Core Team, and Mentors.
  - [x] Add/Edit member modal with displayOrder and type selection.
  - [x] Direct image upload via `/api/admin/upload`.
  - [x] Member deletion and visibility toggle.
- [x] Admin can manage gallery metadata.
- [x] Admin can publish/unpublish content.
  - [x] Blog article publish/unpublish toggle switch.
  - [x] Team member active/published toggle switch.
- [x] Admin notes on support tickets (`/admin/support`).
  - [x] Expandable quick-triage card with editable Admin Notes.
  - [x] Quick action status buttons ("Save Note", "Mark In Progress", "Resolve Ticket").
- [x] Admin actions must be authorized server-side.
- [x] Never rely on hiding an admin button as authorization.
- [ ] Add audit logging for sensitive administrative actions.

## API
- [x] Implement REST/route handlers or equivalent API endpoints for all required CRUD operations.
- [x] GET collection endpoints support safe pagination.
- [ ] GET detail endpoints validate IDs/slugs.
- [x] POST endpoints validate body schemas.
- [x] PATCH/PUT endpoints validate updates.
- [x] DELETE endpoints require appropriate authorization.
- [x] Never accept arbitrary database field names/order clauses directly from users.
- [ ] Whitelist sortable/filterable fields.
- [ ] Add pagination limits.
- [ ] Prevent unbounded queries.

## Production Configuration
- [x] `.env.example` documents required variables.
- [x] DATABASE_URL is server-only.
- [x] Authentication secrets are server-only.
- [x] No secrets committed to git.
- [x] Provide development, test, and production configuration guidance.
- [x] Provide database migration commands.
- [x] Provide seed/reset commands for local development.
- [x] Add health endpoint that does not expose secrets or internal configuration.

## Backend Security Testing
- [x] Test server-side schema validation.
- [x] Test malformed JSON.
- [x] Test missing fields.
- [x] Test unexpected fields.
- [ ] Test wrong types.
- [ ] Test oversized bounded payloads.
- [ ] Test invalid IDs.
- [ ] Test invalid slugs.
- [ ] Test duplicate records.
- [ ] Test concurrent/duplicate submissions.
- [x] Test unauthorized CRUD requests.
- [ ] Test privilege escalation attempts between roles.
- [x] Test direct API access without the frontend.
- [x] Test expired/invalid sessions.
- [ ] Test logout/session invalidation.
- [ ] Test IDOR-style access to records belonging to another user where applicable.
- [ ] Test mass-assignment attempts.
- [ ] Test unsafe sort/filter parameters.
- [ ] Test pagination abuse.
- [x] Test rate limiting on public submission endpoints.
- [ ] Test CORS configuration.
- [ ] Test CSRF protections where cookie-based authentication/state-changing browser requests are used.
- [x] Test security headers.
- [x] Test that database errors are not returned verbatim to clients.
- [x] Test that stack traces are not exposed in production.
- [x] Test that secrets never appear in API responses.
- [ ] Test that sensitive fields are excluded from public API responses.
- [x] Test that admin endpoints reject non-admin users.

All testing must be bounded, non-destructive, and performed only against the local/development or explicitly authorized deployment.

## Backend Reliability
- [ ] Database connection failures produce graceful application errors.
- [ ] API timeout states are handled.
- [ ] Transaction failures roll back appropriately.
- [ ] Duplicate writes are safely handled.
- [ ] Partial failures do not leave inconsistent records.
- [ ] User sees a recoverable error.
- [ ] Retry behavior is deliberate and idempotent where appropriate.

# 12. Functional Testing

## Navigation & Routing
- [x] Every visible nav item resolves correctly.
- [x] Active route/section is correct.
- [x] Back/forward browser navigation works.
- [x] Refreshing every route works.
- [x] Directly opening deep links works.
- [x] Unknown routes show a useful 404.
- [ ] Hash/anchor navigation does not create broken states.
- [ ] Rapidly clicking navigation does not corrupt the UI.

## Forms
Test:
- [x] Empty submission.
- [x] Required fields omitted.
- [ ] Minimum/maximum lengths.
- [ ] Very long input.
- [ ] Whitespace-only input.
- [ ] Leading/trailing whitespace.
- [ ] Unicode.
- [ ] Emoji.
- [ ] Non-Latin scripts.
- [ ] RTL text.
- [ ] Newlines where not expected.
- [x] Invalid email formats.
- [ ] Extremely large numbers.
- [ ] Negative numbers.
- [ ] Decimal/scientific notation where numeric fields exist.
- [ ] Copy/paste.
- [ ] Autofill.
- [ ] Browser validation disabled.
- [ ] Repeated submit clicks.
- [ ] Submit while network is slow.
- [ ] Submit while offline.
- [ ] Back button during submission.
- [ ] Refresh during submission.
- [ ] Form reset behavior.
- [x] Validation messages are understandable and accessible.

## Security / Abuse Resistance
Only use harmless, non-destructive validation strings in local/pre-production testing.

- [x] Test HTML-like input such as `<b>test</b>` and verify it is treated as data where appropriate.
- [x] Test harmless XSS probes such as `<script>alert(1)</script>` in local validation and confirm they are escaped/rejected; never execute against a real third-party target.
- [x] Test quote characters: `' " \``.
- [x] Test `< > &`.
- [ ] Test Unicode confusables.
- [ ] Test null/control characters where the runtime allows them.
- [ ] Test repeated parameters.
- [ ] Test unexpected query parameters.
- [ ] Test unexpected JSON/object fields if an API exists.
- [ ] Test wrong HTTP methods against API routes.
- [ ] Test missing/invalid content types.
- [ ] Test oversized request bodies within safe local limits.
- [ ] Test duplicate submissions and replayed requests.
- [x] Test authorization boundaries if authenticated features exist.
- [x] Test that client-side-only authorization cannot expose protected data.
- [x] Test direct navigation to protected routes.
- [x] Test expired/invalid sessions if authentication exists.
- [ ] Test logout followed by browser-back navigation.
- [ ] Test CSRF protections for state-changing requests if a backend exists.
- [ ] Test open-redirect behavior in return/redirect parameters.
- [ ] Test unsafe URL schemes such as `javascript:` in user-controlled link fields.
- [ ] Test external-link handling.
- [ ] Verify sensitive data is not placed in URLs unnecessarily.
- [x] Verify secrets are not exposed in client bundles.
- [x] Verify error pages do not reveal stack traces, filesystem paths, tokens, or internal configuration.
- [x] Verify server/API errors do not crash the UI.
- [x] Verify rate limiting or abuse controls if public backend endpoints exist.
- [x] Verify uploads, if any, enforce type/size limits and never trust filenames.
- [x] Verify user-controlled filenames/content cannot escape the intended storage path.
- [x] Verify dangerous HTML is sanitized if rich text is supported.
- [ ] Verify third-party scripts are minimized and trusted.

## Weird User Behavior
- [ ] Spam-click every button.
- [ ] Double-click/triple-click every CTA.
- [ ] Rapidly scroll up/down.
- [ ] Scroll while a section is animating.
- [ ] Resize the viewport during animations.
- [ ] Rotate a mobile device.
- [ ] Zoom browser to 200% and 400%.
- [ ] Use very small viewport.
- [ ] Use very wide viewport.
- [ ] Open multiple tabs.
- [ ] Open the same form in multiple tabs.
- [ ] Refresh halfway through every workflow.
- [ ] Use browser Back/Forward repeatedly.
- [ ] Disable JavaScript and verify graceful degradation where practical.
- [ ] Disable images.
- [ ] Use slow 3G/network throttling.
- [ ] Toggle offline/online while loading.
- [ ] Block a requested image.
- [ ] Simulate a failed API response.
- [ ] Simulate a 401/403/404/409/429/500 response.
- [ ] Simulate delayed responses.
- [ ] Simulate partial/empty API data.
- [ ] Enter huge amounts of text.
- [ ] Paste rich text into plain text fields.
- [ ] Paste HTML into fields.
- [ ] Use emojis and unusual Unicode.
- [ ] Use screen readers/keyboard-only navigation.
- [ ] Tab through the entire page without a mouse.
- [ ] Press Enter/Space on focused controls.
- [ ] Press Escape during modals/popups.
- [ ] Click outside modals.
- [ ] Press browser refresh while a modal is open.
- [ ] Open links with middle-click/new tab.

## Visual Regression
- [ ] Compare the implementation against the supplied video at the same mobile viewport.
- [ ] Verify header height and position.
- [ ] Verify section spacing.
- [ ] Verify card width/height.
- [ ] Verify shadows and radii.
- [ ] Verify typography scale.
- [ ] Verify decorative botanical positioning.
- [ ] Verify footer proportions.
- [ ] Verify no horizontal overflow.
- [ ] Verify no overlapping content.
- [ ] Verify images do not distort.
- [ ] Verify layout does not jump while loading.

# 13. Accessibility
- [x] Semantic headings in logical order.
- [x] Landmark elements (`header`, `nav`, `main`, `section`, `footer`).
- [x] Keyboard reachable controls.
- [x] Visible focus states.
- [x] Proper form labels.
- [x] Error messages associated with fields.
- [ ] Sufficient color contrast.
- [ ] Meaningful alt text for real assets.
- [ ] Decorative assets marked decorative.
- [x] Reduced-motion support.
- [ ] Modal focus management if modals exist.
- [ ] Escape closes dismissible overlays.
- [ ] No keyboard traps.
- [ ] Test with axe or equivalent automated accessibility checks.

# 14. Performance
- [ ] Lazy-load below-the-fold images.
- [ ] Avoid unnecessary JavaScript.
- [ ] Avoid layout shifts.
- [ ] Optimize image dimensions once real assets are added.
- [ ] Avoid animation loops that consume excessive CPU.
- [ ] Keep bundle size reasonable.
- [ ] Test mobile performance.
- [ ] Test on slow network.
- [ ] Check Lighthouse/Core Web Vitals where available.

# 15. Automated Test Suite
- [x] Unit tests for validation/utilities (12/12 passing).
- [ ] Component tests for forms and important interactive components.
- [x] End-to-end tests with Playwright (100/100 passing across desktop and mobile viewports).
- [x] Smoke test every primary route (`smoke.spec.ts`).
- [x] Navigation E2E test (`navigation.spec.ts`).
- [x] Form validation and resume upload E2E tests (`forms.spec.ts`).
- [x] User authentication and Member Dashboard E2E tests (`user-auth.spec.ts`).
- [x] Admin CMS E2E tests for Team, Blog toggles, Support Notes & Uploads (`admin-cms.spec.ts`).
- [ ] Duplicate-submit E2E test.
- [ ] Error-state E2E test.
- [x] Keyboard navigation E2E test.
- [x] Responsive viewport smoke tests (`responsive.spec.ts`).
- [x] Accessibility automated test.
- [x] Security-focused input test suite using harmless payloads.
- [x] Run tests after each major feature.

# 16. Final Acceptance
- [x] No console errors during normal use.
- [x] No unhandled promise rejections.
- [x] No broken internal links.
- [x] No missing required assets except intentionally marked placeholders.
- [x] No horizontal scrolling on supported mobile layouts.
- [x] All primary CTAs produce a clear result.
- [x] Forms never silently fail.
- [x] Error states are understandable.
- [ ] App survives hostile-but-normal user behavior.
- [x] Security checks do not reveal obvious client-side secrets or unsafe DOM injection.
- [ ] Video/reference comparison completed at the reference viewport.
- [x] Real images can be inserted without changing component architecture.
- [x] Final README documents how to replace placeholders and run tests.
