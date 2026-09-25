# ANTIGRAVITY MASTER BUILD PROMPT — ORG & AURA RECONSTRUCTION

You are rebuilding a website whose original source files are lost.

The supplied screen-recording is the primary visual/workflow reference. Do NOT invent a completely new website. Reconstruct the observed product as faithfully as possible while making the implementation maintainable, responsive, accessible, and secure.

IMPORTANT:
- Ignore the original photographs/images for now.
- Do NOT spend time recreating the actual image assets.
- Wherever the reference contains a photograph, logo, poster, team image, gallery image, diagram, or other visual asset, use an obvious but polished placeholder.
- Build the asset system so I can replace every placeholder later by changing an asset path/config entry instead of rewriting components.
- The reference video is approximately an 80-second mobile-browser walkthrough. Use it as the source of truth for the visible workflow and visual language.
- Do not claim functionality exists if the recording does not show it.
- Because the original backend/files are gone, use deterministic local/demo behavior for functionality that cannot be backed by the original backend. Make real integrations easy to add later.

---

# 1. CORE OBJECTIVE

Recreate the Org & Aura website shown in the supplied video.

The implementation must feel like the same website, not an AI-generated approximation.

Prioritize:
1. Visual fidelity to the recording.
2. Correct page/section hierarchy.
3. Correct navigation/workflow.
4. Responsive behavior.
5. Accessibility.
6. Robustness against weird user behavior.
7. Secure handling of user-controlled input.
8. Maintainable code.
9. Easy replacement of placeholder assets.
10. Thorough automated testing.

Do not add trendy UI patterns merely because they are popular.

NO:
- generic SaaS dashboard styling
- excessive glassmorphism
- neon gradients
- random floating cards
- giant meaningless rounded pills
- excessive animations
- fake statistics
- invented product functionality
- unnecessary AI-generated copy
- stock imagery presented as the original assets

The site should feel intentional, editorial, organic, and human-designed.

---

# 2. VISUAL LANGUAGE FROM THE REFERENCE

The reference has a warm, organic sustainability aesthetic.

Recreate the following visual language:

- warm cream/off-white page background
- muted natural greens
- dark green/charcoal typography
- subtle botanical/leaf decorative framing
- rounded rectangular content cards
- soft shadows/elevation
- restrained borders
- generous whitespace
- editorial-style typography
- clean image/media presentation
- simple green CTA buttons
- understated secondary buttons
- compact horizontal navigation
- calm, sustainability-oriented visual rhythm

Create reusable design tokens for:
- background
- surface
- primary green
- dark text
- muted text
- border
- shadow
- radius
- spacing
- typography sizes
- breakpoints

Do not scatter arbitrary values throughout the code.

---

# 3. GLOBAL NAVIGATION

The reference visibly contains:

- Org & Aura logo/branding placeholder
- HOME
- PRODUCT
- GALLERY
- BLOG
- OUR TEAM
- CAREER
- Sign Up
- Support

Implement this as a real navigation system.

Requirements:
- active route/section must be visually clear
- keyboard accessible
- touch friendly
- no accidental horizontal overflow
- works on desktop and mobile
- browser Back/Forward works
- direct route loading works
- refresh works
- unknown route has a useful 404
- navigation must not silently fail

If the reference uses a compact fixed/sticky header, reproduce that behavior.

---

# 4. HOME PAGE

Recreate the home workflow visible in the recording.

## Hero

Include:
- "WELCOME TO ORG AND AURA"
- the supporting statement about bridging necessary daily hygiene and environmental responsibility
- botanical decorative elements
- restrained typography
- correct vertical spacing

Use image placeholders for the botanical artwork.

## Information Card

Recreate the "The Anatomy of a Clean Future." card.

It includes:
- small introductory label
- large heading
- supporting paragraph
- green CTA
- abstract/technical visual placeholder

The layout should match the reference: text on one side and a visual area on the other where appropriate.

## Global Carbon Emission Card

Recreate the large white card containing:
- "Global Carbon Emission"
- large numeric figure
- explanatory text
- subtle abstract background visual

Do not create a fake live carbon-data API.

If the displayed number is hard-coded from the reference, make it explicit in a local data file.

The number must never render as:
- NaN
- undefined
- null
- overflowing text
- broken counter

## Support Our Growth

Recreate the card containing:
- "Support Our Growth"
- supporting sentence
- "Join our mission"
- "Learn more"

Buttons must have meaningful local/demo behavior if the backend does not exist.

---

# 5. PRODUCT

Reconstruct the Product page/section shown through the navigation.

Use:
- product content cards
- SanDi/product narrative visible in the recording
- placeholder product imagery
- responsive layouts
- appropriate CTA behavior

Do not invent a large ecommerce system unless the reference actually shows one.

Keep content data-driven so text/images can be replaced later.

---

# 6. GALLERY

The recording visibly shows an "Our Gallery" page/section.

Recreate:

Heading:
"Our Gallery"

Supporting line:
"Explore the impact and innovation behind SanDi."

Then a vertically flowing gallery of large media cards.

The reference shows achievement/project imagery, including event/project posters and photographs.

For now:
- replace every image with a polished placeholder
- preserve approximate aspect ratios
- preserve rounded corners
- preserve spacing
- preserve vertical rhythm
- do not crop placeholders in a way that changes the intended composition

When real images are later supplied, they should fit into the same containers without changing the layout.

---

# 7. BLOG / LATEST NEWS & INSIGHTS

Recreate the editorial grid shown in the recording.

Visible structure:
- "Latest News & Insights"
- article cards
- title
- publication date/category
- excerpt
- CTA

Examples visible in the reference include topics such as:
- Global Trends in Sustainable Waste Management
- The Hidden Environmental Cost of Traditional Diapers
- Why We Choose Gold: The Psychology of Premium Sustainability
- SanDi Field Test: Results from Our Latest Pilot Program
- Joining the Revolution: What We Look for in Interns
- The Science Behind Rapid Thermal Degradation

Use the visible copy where it is legible in the reference.

Build reusable ArticleCard components.

Responsive behavior:
- desktop/tablet: editorial grid
- mobile: single-column flow
- no horizontal overflow

Every CTA must either:
- navigate to a real implemented detail page, OR
- show a clearly implemented demo state

Never create a button that looks functional but does nothing.

---

# 8. FOUNDERS / TEAM / MENTORS

Recreate the sections visible in the reference:

## Our Founders
- section heading
- founder cards
- image placeholder
- name/title area

## Our Team
- multi-column card grid
- team image placeholders
- name/title
- same rounded-card visual treatment

## Our Mentors
- mentor card grid
- image placeholders
- names/titles where visible
- consistent card proportions

IMPORTANT:
Some images in the recording appear missing/failed to load in places.

Do NOT reproduce broken browser-image icons as the intended final design.

Instead create polished placeholders that preserve the card geometry.

---

# 9. CAREER / SIGN UP / SUPPORT

Implement the user flows represented by:
- Career
- Sign Up
- Support
- Join our mission

Forms must be real interactive forms even if the original backend is unavailable.

If no backend exists:
- use local deterministic demo submission
- show loading
- show success
- show validation errors
- show failure state
- clearly separate demo behavior from future production integration

Never pretend a message was actually sent to a company if there is no backend.

---

# 10. FORMS — VALIDATION

Every form must handle:

Normal:
- valid input
- empty input
- required fields
- minimum length
- maximum length
- valid/invalid email
- valid/invalid numeric input
- whitespace

Weird:
- whitespace-only
- extremely long strings
- Unicode
- emoji
- non-Latin text
- RTL text
- pasted rich text
- newline characters
- repeated submit
- rapid submit
- browser autofill
- copy/paste
- refresh while submitting
- Back while submitting
- slow network
- offline state

Never lose entered form values unnecessarily.

Never allow a loading state to become permanently stuck.

Disable duplicate submission appropriately while still keeping the UI accessible.

---


# 10A. REAL BACKEND + DATABASE — MANDATORY

This is NOT a static frontend recreation.

Build a proper full-stack application with a real backend and persistent database.

## Required Architecture

Use:

- Next.js + TypeScript for the application unless the existing project structure strongly requires another equivalent architecture.
- PostgreSQL as the production database.
- Prisma ORM.
- Server-side API routes/server actions for backend operations.
- A proper validation library such as Zod.
- Secure authentication/session handling for admin functionality.
- A clean service/repository layer where useful.

The browser must NEVER connect directly to PostgreSQL.

Database credentials, authentication secrets, service credentials, and private environment variables must remain server-side.

Create:

- database schema
- migrations
- seed data
- API layer
- service layer
- validation
- authentication/authorization
- admin functionality
- error handling
- tests

Do not replace the backend with localStorage.

Do not pretend a submission succeeded when there is no server-side persistence.

---

## DATABASE MODEL

Design a normalized relational schema based on the actual website workflow.

At minimum, support the following entities where they are actually needed:

### Users/Admins
Fields should support:
- id
- name
- email
- password hash or secure auth provider identity
- role
- status
- createdAt
- updatedAt

Use roles such as:
- ADMIN
- EDITOR where useful

Never store plaintext passwords.

### Support Requests

Store:
- id
- name
- email
- subject/category
- message
- status
- createdAt
- updatedAt

### Signups / Mission Applications

Store only fields actually collected by the UI.

Include:
- id
- relevant applicant information
- status
- createdAt
- updatedAt

### Career Applications

If the Career workflow requires applications, store:
- id
- applicant information
- position/job reference
- application status
- createdAt
- updatedAt

Do not collect unnecessary sensitive personal data.

### Blog / News

Support:
- id
- title
- slug
- excerpt
- body/content
- category
- published
- publishedAt
- createdAt
- updatedAt

`slug` must be unique.

### Team / Founders / Mentors

Use a reusable person/content model where appropriate.

Support:
- id
- name
- title/role
- bio
- image/asset reference
- type
- displayOrder
- published
- createdAt
- updatedAt

### Gallery

Support:
- id
- title/caption
- asset reference
- displayOrder
- published
- createdAt
- updatedAt

Use foreign keys where relationships exist.

Use indexes for:
- email
- slug
- status
- published
- publishedAt
- displayOrder
- foreign keys

Use database constraints for uniqueness and integrity rather than relying only on application code.

---

# 10B. REAL API

Build actual backend endpoints/server actions.

Examples:

### Public
- `GET /api/blog`
- `GET /api/blog/:slug`
- `GET /api/gallery`
- `GET /api/team`
- `GET /api/founders`
- `GET /api/mentors`
- `POST /api/support`
- `POST /api/signup`
- `POST /api/career/apply`

Use the exact routes that make architectural sense.

### Admin
- authenticated admin login/session
- CRUD for blog
- CRUD for gallery
- CRUD for team/founders/mentors
- view/update support requests
- view/update applications
- publish/unpublish content

Every admin operation must be authorized on the server.

Hiding admin controls in the frontend is NOT authorization.

---

# 10C. SERVER-SIDE VALIDATION

Every incoming request must be validated on the server.

Frontend validation is only for UX.

Validate:
- required fields
- data types
- length
- email format
- enum values
- allowed status values
- allowed IDs
- allowed slugs
- allowed pagination
- allowed sorting fields

Reject:
- unknown/unsafe fields where appropriate
- invalid types
- huge unbounded values
- malformed requests

Return consistent errors such as:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please check the submitted fields.",
    "fields": {}
  }
}
```

Never return:
- SQL errors
- stack traces
- filesystem paths
- secrets
- database credentials
- internal tokens

---

# 10D. ADMIN PANEL

Build a real admin interface if the website content is intended to be maintained.

It should allow an authorized administrator to:

- view dashboard
- view support requests
- view signups/applications
- update request/application status
- create/edit/delete blog posts
- publish/unpublish posts
- manage gallery
- manage founders/team/mentors
- reorder content
- replace asset references
- see useful timestamps

Keep it visually consistent with the main site but optimized for administration.

Admin routes must be protected server-side.

Test:

1. logged-out user → denied
2. normal user → denied
3. admin → allowed
4. direct API request without admin role → denied
5. modified request attempting another user's/resource's ID → denied

---

# 10E. REAL FORM SUBMISSIONS

The Support, Sign Up, Career, and other forms must actually persist submissions.

Flow:

1. User fills form.
2. Client performs immediate UX validation.
3. Request is sent to backend.
4. Backend validates independently.
5. Backend applies abuse/rate-limit checks.
6. Backend writes to PostgreSQL.
7. Database constraint errors are handled cleanly.
8. Backend returns a safe response.
9. Frontend displays success/error.
10. Duplicate clicks do not create duplicate records.

Use idempotency or another appropriate duplicate-submission strategy where needed.

Do not fake persistence with localStorage.

---

# 10F. DATABASE FAILURE HANDLING

Intentionally test:

- PostgreSQL unavailable
- connection timeout
- migration mismatch
- duplicate unique field
- transaction failure
- malformed database result
- missing optional record
- deleted referenced record

The frontend must show a useful recovery message.

Never expose raw database errors.

---

# 10G. SECURITY TESTING OF THE BACKEND

After implementing the backend, actively test it against harmless, bounded abuse.

### Input abuse

Try:
- empty strings
- whitespace
- huge strings within safe test bounds
- Unicode
- emoji
- RTL text
- quotes
- backticks
- `< > &`
- harmless HTML
- harmless XSS strings
- unexpected JSON fields
- wrong data types
- arrays where strings are expected
- objects where strings are expected
- null where required
- missing fields

### Authorization abuse

Try:
- accessing admin API while logged out
- accessing admin API as non-admin
- modifying another record's ID
- changing role fields from the client
- injecting an admin role into request bodies
- calling private endpoints directly
- accessing unpublished content through guessed IDs/slugs

### API abuse

Try:
- repeated submissions
- concurrent submissions
- invalid methods
- malformed JSON
- missing Content-Type
- oversized bounded request
- invalid pagination
- negative pagination
- enormous pagination values
- unsafe sort values
- unsafe filter values
- invalid UUID/ID
- invalid slug
- duplicate slug

### Session abuse

If sessions/auth are implemented:
- invalid session
- expired session
- logout then reuse session
- modified cookies
- missing cookies
- multiple sessions
- privilege change
- direct API access

### Web security

Check:
- XSS
- CSRF where relevant
- CORS
- security headers
- open redirects
- unsafe URL schemes
- sensitive information leakage
- server error leakage

Do NOT run destructive payloads, denial-of-service attacks, credential attacks, or destructive database commands.

All security testing must be against the local development/staging system or another explicitly authorized environment.

---

# 10H. DATABASE OPERATIONS

Provide scripts for:

- database setup
- migration
- migration reset for development
- seed
- test database setup

Document commands in README.

Example conceptual commands:

```bash
npm run db:migrate
npm run db:seed
npm run db:reset
npm run test
npm run test:e2e
```

Use the project's actual package manager/scripts.

Do not commit `.env`.

Create `.env.example`.

---

# 10I. BACKEND TEST SUITE

Create automated backend tests for:

- validation
- CRUD
- authorization
- authentication/session
- duplicate submissions
- database constraints
- API error handling
- pagination
- sorting
- public/private boundaries
- rate limiting
- malformed requests
- security headers where testable

Add integration tests against a test PostgreSQL database.

Add E2E tests covering the complete user journey:

Home → Product → Gallery → Blog → Team → Career → Signup/Support → backend persistence.

Verify submitted data actually appears in the database/admin interface.

---

# 10J. PRODUCTION READINESS

Before completion verify:

- migrations work from a clean database
- seed works
- API works without the frontend
- database errors are handled
- no secrets are bundled client-side
- authentication is secure
- authorization is server-side
- forms persist real records
- admin operations persist changes
- public APIs expose only intended fields
- logs do not contain sensitive values
- production errors do not reveal internals
- rate limiting exists where appropriate
- CORS is intentional
- security headers are configured
- backups/restore considerations are documented
- deployment environment variables are documented

# 11. SECURITY HARDENING

Treat all user-controlled values as untrusted.

Implement appropriate defenses against:

## XSS
Test harmless strings such as:
`<b>test</b>`
`<script>alert(1)</script>`
`"><img src=x onerror=alert(1)>`

The application must never interpret arbitrary user input as executable HTML.

Prefer:
- React's normal escaping
- strict sanitization when rich text is genuinely required
- safe DOM APIs

Do NOT use `dangerouslySetInnerHTML` unless absolutely necessary.

If it is necessary, sanitize the content first.

## Injection-like input
Test:
- `'`
- `"`
- backticks
- `<`
- `>`
- `&`
- backslashes
- Unicode confusables
- unexpected control characters

The application must remain stable.

## URL abuse
If user-controlled URLs exist:
- reject dangerous schemes such as `javascript:`
- validate protocols
- handle external links safely
- test open-redirect parameters
- do not blindly redirect based on arbitrary query parameters

## API abuse
If APIs/backend routes are created:
- validate request method
- validate content type
- validate body schema
- reject unexpected fields where appropriate
- enforce reasonable request-size limits
- return safe errors
- never expose stack traces
- never expose filesystem paths
- never expose secrets
- never trust client-side authorization

## Authentication/authorization
If authentication exists:
- test direct navigation to protected routes
- test logged-out access
- test expired sessions
- test invalid sessions
- test logout + browser Back
- test direct API access
- verify authorization server-side

## CSRF
For state-changing backend operations, implement appropriate CSRF protection where applicable.

## Rate limiting / abuse controls
For public state-changing endpoints, add sensible rate limiting or abuse protection.

Do not make destructive or denial-of-service tests.

All security tests should be local, harmless, bounded, and repeatable.

---

# 12. EXTREME / WEIRD USER BEHAVIOR

The finished site must survive users behaving badly or unpredictably.

Test:

- double-click buttons
- triple-click buttons
- spam-click navigation
- rapid scrolling
- scrolling during animations
- resize during animations
- rotate mobile viewport
- browser zoom 200%
- browser zoom 400%
- extremely narrow viewport
- extremely wide viewport
- multiple tabs
- same form open in multiple tabs
- refresh during every workflow
- Back/Forward repeatedly
- open links in new tabs
- middle-click
- Escape during dialogs
- click outside dialogs
- disable images
- block image requests
- slow 3G
- offline mode
- reconnect during request
- API timeout
- API 400
- API 401
- API 403
- API 404
- API 409
- API 429
- API 500
- malformed API response
- empty API response
- partial API response
- missing optional fields
- unexpected fields

No UI should:
- freeze
- become permanently disabled
- duplicate records
- show NaN
- show undefined
- show null
- expose stack traces
- lose navigation
- create horizontal overflow
- become impossible to recover from

---

# 13. ACCESSIBILITY

Implement:

- semantic HTML
- correct heading hierarchy
- landmarks
- keyboard navigation
- visible focus states
- accessible buttons
- accessible links
- proper form labels
- accessible validation errors
- `aria-describedby` where useful
- meaningful image alt text
- decorative images marked decorative
- modal focus management
- Escape-to-close for dismissible overlays
- no keyboard traps
- reduced-motion support
- adequate contrast

Run automated accessibility testing with axe or equivalent.

---

# 14. RESPONSIVENESS

The reference recording is mobile, but do not build a mobile-only website.

Support:
- small mobile
- large mobile
- tablet
- laptop
- desktop
- wide desktop

At minimum test approximately:
- 320px
- 375px
- 390px
- 430px
- 768px
- 1024px
- 1280px
- 1440px
- 1920px

Do not simply stretch the mobile layout.

Use intentional responsive breakpoints.

Verify:
- no horizontal scrolling
- no overlapping cards
- no clipped headings
- no broken nav
- no unusable forms
- no image distortion
- no huge empty gaps caused by fixed heights

---

# 15. ANIMATION

Use animation only where it improves fidelity.

Possible behaviors:
- subtle section reveal
- button hover
- card hover
- smooth navigation
- restrained entrance transitions

Requirements:
- short and purposeful
- no animation blocking interaction
- no infinite CPU-heavy animation
- support `prefers-reduced-motion`
- animation must not cause layout shifts

Do not invent elaborate cinematic animations that are not present in the reference.

---

# 16. IMAGE / ASSET ARCHITECTURE

Create something like:

`/public/assets/`

and a logical structure such as:

`/public/assets/placeholders/`
`/public/assets/gallery/`
`/public/assets/team/`
`/public/assets/mentors/`
`/public/assets/branding/`
`/public/assets/product/`

For now, placeholders live in the appropriate directories.

Create an asset configuration/manifest where useful.

The goal:

I should later be able to replace:

`/assets/placeholders/team-01.webp`

with the real file without touching component logic.

---

# 17. CODE QUALITY

Use:
- TypeScript
- reusable components
- clear naming
- small logical components
- data-driven cards/grids
- centralized validation
- centralized theme tokens
- no duplicated giant JSX blocks
- no mysterious magic numbers
- no dead code
- no unused dependencies
- no secrets in source
- no unnecessary client-side state

Prefer simple architecture over overengineering.

---

# 18. TESTING REQUIREMENTS

Create a serious automated test suite.

Use Playwright or equivalent for end-to-end testing.

Include:

### Smoke
- home loads
- product loads
- gallery loads
- blog loads
- team loads
- career loads
- signup loads
- support loads

### Navigation
- every nav link
- browser Back
- browser Forward
- direct URL
- refresh
- 404

### Forms
- valid submission
- invalid submission
- empty submission
- long input
- Unicode
- duplicate submit
- loading
- failure
- recovery after failure

### Security
- harmless XSS probes
- unsafe URL schemes
- malformed query parameters
- unexpected fields
- oversized but bounded input
- authorization boundary if applicable
- safe server errors

### Accessibility
- keyboard-only navigation
- focus order
- accessible labels
- automated axe scan

### Responsive
Run smoke tests against multiple viewport sizes.

### Resilience
Mock:
- timeout
- 400
- 401
- 403
- 404
- 409
- 429
- 500
- malformed response
- empty response

The test suite must fail loudly if the application enters a broken state.

---

# 19. DEVELOPMENT WORKFLOW

Build in this order:

PHASE 1
- project setup
- theme
- global layout
- navigation
- routing

PHASE 2
- home
- product
- gallery

PHASE 3
- blog/news
- founders
- team
- mentors

PHASE 4
- career
- signup
- support
- forms

PHASE 5
- responsive polish
- animation
- accessibility

PHASE 6
- security hardening
- weird-user tests
- error-state tests
- E2E tests

PHASE 7
- visual comparison against the supplied recording
- final cleanup
- performance pass

After each phase:
1. run the application
2. inspect visually
3. run tests
4. fix regressions
5. only then continue

Do not build everything and postpone testing until the end.

---

# 20. VISUAL ACCEPTANCE TEST

Use the supplied video as a visual regression reference.

At the closest practical mobile viewport:

- compare header
- compare navigation
- compare hero
- compare card geometry
- compare section spacing
- compare typography
- compare green tones
- compare botanical decoration
- compare gallery layout
- compare blog grid
- compare team/mentor grids
- compare footer

The objective is not "similar."

The objective is:
**same visual hierarchy, same workflow, same spacing language, same interaction model, with placeholder assets where the original assets are unavailable.**

---

# 21. FINAL QUALITY GATE

Before declaring the project complete, verify:

- [ ] no console errors
- [ ] no unhandled promise rejections
- [ ] no broken internal links
- [ ] no dead primary CTAs
- [ ] no horizontal overflow
- [ ] no inaccessible controls
- [ ] no stuck loading states
- [ ] no duplicate submissions
- [ ] no obvious XSS injection
- [ ] no unsafe user-controlled redirects
- [ ] no secrets in frontend
- [ ] no stack traces exposed to users
- [ ] no fake backend success messages
- [ ] no missing placeholder mappings
- [ ] no broken images
- [ ] no `undefined` / `null` / `NaN` UI
- [ ] mobile layout matches the reference
- [ ] desktop layout is intentionally responsive
- [ ] reduced-motion works
- [ ] keyboard navigation works
- [ ] accessibility scan passes
- [ ] E2E tests pass
- [ ] security/abuse tests pass
- [ ] performance is reasonable on mobile

If something fails, fix it before completion.

Do not simply report the failure and move on.

---

# 22. IMPORTANT FINAL RULE

Do not stop after creating a visually convincing mockup.

This is a reconstruction project.

The final result must be:
**visually faithful + functional + responsive + accessible + resilient + security-conscious + thoroughly tested.**

When you finish, provide:
1. what was implemented
2. routes/pages created
3. placeholder assets that need replacement
4. test commands
5. test results
6. any assumptions made because the original files/backend were unavailable
7. any remaining items that require the real assets/backend
