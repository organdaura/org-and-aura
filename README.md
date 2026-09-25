# Org & Aura Website Reconstruction

Faithful full-stack reconstruction of the **Org & Aura** web platform, modeled after the mobile video reference and built with modern, high-performance web standards.

## Tech Stack & Architecture

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS v3 with an intentional organic design system (warm cream `#FBF8F2`, muted botanical forest green `#4F7C5A` / `#416A4B`, and charcoal typography).
- **Backend & API**: Next.js Server-side Route Handlers & Server Actions, Zod input validation schemas, anti-bot CAPTCHA challenge defense.
- **Database & Persistence**: PostgreSQL with Prisma ORM (normalized models for Support Requests, Career Applications, Signups, Blog Articles, Team Members, and Gallery Projects).
- **Authentication**: Secure HTTP-only cryptographic session cookies, bcrypt password hashing, role-based authorization (ADMIN / USER).
- **Testing**: Vitest for unit validation tests; Playwright for end-to-end user workflows, accessibility, and responsive viewport testing.

---

## Getting Started

### Prerequisites

- Node.js 18+ (tested on Node v22)
- PostgreSQL running locally or via Docker

### 1. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Default local database connection:
```env
DATABASE_URL="postgresql://hritish@localhost:5432/org_aura"
SESSION_SECRET="org_aura_super_secure_session_secret_key_2026_at_least_32_chars"
ADMIN_DEFAULT_EMAIL="admin@organdaura.com"
ADMIN_DEFAULT_PASSWORD="Admin@OrgAura2026!"
```

### 2. Database Migration & Seeding

Sync the Prisma schema to PostgreSQL and seed initial records (admin user, 6 blog posts, team members, and gallery items):

```bash
npm run db:push
npm run db:seed
```

### 3. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

---

## Routes & Pages

### Public Experience
- **`/`**: Welcome hero, botanical framing, The Anatomy of a Clean Future card, Global Carbon Emission live counter (`42,200,010,704`), Support Our Growth.
- **`/product`**: The SanDi Machine architecture diagram, contactless safety specifications, and interactive FAQ accordions.
- **`/gallery`**: Our Gallery media stream (SRM Easwari Engineering College, SanDi Startup showcase, hospital pilot testing).
- **`/blog`**: Latest News & Insights 2-column editorial grid.
- **`/blog/[slug]`**: Dedicated editorial article reading view with metadata and inquiry CTAs.
- **`/team`**: Our Founders & 3-column Our Team grid with polished placeholders.
- **`/career`**: Join the Org and Aura Team hiring form with real-time validation and PostgreSQL persistence.
- **`/signup`**: Centered account creation card with One-Click Google sign-in and direct email registration.
- **`/support`**: Support & Contact card with official emails/phones/incubator address, plus an embedded ticket submission form with bot protection.
- **`/_not-found`**: Cohesive custom 404 page.

### Administrative Portal
- **`/admin/login`**: Administrator authentication portal.
  - **Email**: `admin@organdaura.com`
  - **Password**: `Admin@OrgAura2026!`
- **`/admin`**: Executive dashboard with metrics (Inquiries, Applications, Signups, Articles).
- **`/admin/support`**: View inquiries and change status (`NEW` &rarr; `IN_PROGRESS` &rarr; `RESOLVED`).
- **`/admin/career`**: Review talent applications (`PENDING` &rarr; `REVIEWED` &rarr; `ACCEPTED` &rarr; `REJECTED`).
- **`/admin/signups`**: Registered platform members table.
- **`/admin/blog`**: Create, publish, and delete research/insight articles.

---

## Asset Replacement Guide

All media assets are centrally registered in `config/assets.config.ts`. To replace placeholder graphics with real photography when available, place your `.webp` or `.png` files in the corresponding `public/assets/` subfolder and update the `src` path in `config/assets.config.ts` without touching any component code:

- **Branding**: `public/assets/branding/logo.png`
- **Hero Framing**: `public/assets/decorations/leaves-top.svg`, `leaves-bottom.svg`
- **Product**: `public/assets/product/sandi-diagram.svg`, `sandi-rendering.svg`
- **Gallery**: `public/assets/gallery/`
- **Blog Thumbnails**: `public/assets/blog/`
- **Team Portraits**: `public/assets/team/`

---

## Automated Test Suites

### Unit Tests (Vitest)
Validates Zod parsing, email formatting, phone numbers, slug normalization, honeypot bot trap detection, and HMAC CAPTCHA challenges:

```bash
npm test
```

### End-to-End Tests (Playwright)
Executes smoke tests, navigation flows, interactive form submissions, and admin authorization across desktop and mobile viewports:

```bash
npm run test:e2e
```
