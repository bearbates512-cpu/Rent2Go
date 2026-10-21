# Rent2Go — TRD (Technical Required Document)

**Version:** 1.0 | **Related:** `01_PRD_Rent2Go.md`, `05_Backend_Schema.md`

> Agar project pehle se kisi framework (React/Vite, AI Studio, etc.) mein bana hua ho to pehle usay review karein; sirf is document ki wajah se bina soche migrate na karein. Neeche recommended stack hai.

---

## 1. Recommended Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Frontend framework | **Next.js (App Router) + TypeScript** | SSR/ISR for SEO, server actions, middleware |
| Styling | **Tailwind CSS** + design tokens (CSS variables) | Theme editable from admin |
| UI components | Accessible primitives (Radix UI / shadcn/ui) | A11y, RTL friendly |
| Forms & validation | React Hook Form + **Zod** (shared client/server schemas) | Double validation |
| Database | **PostgreSQL (Supabase)** | RLS, exclusion constraints, JSONB |
| Auth | Supabase Auth (+ TOTP 2FA) | Secure, RBAC-ready |
| File storage | Supabase Storage (+ image transform) | Media library |
| i18n | `next-intl` | EN/UR, RTL, per-locale routing |
| Rich text editor | TipTap (sanitized output) | CMS content/legal pages |
| Drag & drop | dnd-kit | Section/menu/gallery reorder |
| Tables | TanStack Table | Admin tables |
| Calendar | FullCalendar or custom timeline | Booking calendar |
| Charts | Recharts | Reports |
| Email | Resend / SMTP provider | Notifications |
| Rate limiting | Upstash Redis (or DB-based) | Login/public form protection |
| Spam protection | Cloudflare Turnstile / hCaptcha + honeypot | Low friction |
| Hosting | Vercel (or equivalent) | Edge, ISR |
| Monitoring | Sentry + privacy-aware analytics (Plausible/GA with consent) | Errors/metrics |
| Testing | Vitest, Playwright, Axe, Lighthouse CI | Unit/E2E/A11y/Perf |
| CI/CD | GitHub Actions | lint+test+build gate |

---

## 2. High-Level Architecture

```
                ┌────────────────────────────────────────────┐
 Customer  ───► │  Next.js (Vercel)                          │
 Browser        │  ├─ Public site (SSR/ISR, i18n EN/UR)      │
                │  ├─ API route handlers / Server Actions    │
 Admin     ───► │  ├─ Admin app (/admin, protected, noindex) │
 Browser        │  └─ Middleware (auth, locale, rate-limit)  │
                └───────────────┬────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────────┐
        ▼                       ▼                           ▼
┌───────────────┐      ┌────────────────┐         ┌─────────────────┐
│ Supabase       │      │ Storage (media)│         │ External         │
│ Postgres + RLS │      │ images/videos  │         │ Email/SMS/WA API │
│ Auth + RBAC    │      │ CDN + transform│         │ Turnstile, Sentry│
└───────────────┘      └────────────────┘         └─────────────────┘
```

### 2.1 Application Structure
```
/src
  /app
    /[locale]                 # en | ur
      /(public)               # home, cars, services, rates, about, faq, contact...
      /p/[slug]               # CMS custom pages
      /book
    /admin                    # protected area
      /dashboard /cars /bookings /calendar /customers
      /pricing /services /content /media /navigation
      /theme /translations /forms /seo /reviews
      /reports /team /settings /audit-log
    /api                      # webhooks, public booking endpoint, revalidate
  /components (ui, public, admin, blocks)
  /lib (db, auth, rbac, pricing, availability, i18n, sanitize, ratelimit)
  /modules (bookings, vehicles, cms, pricing, notifications)
  /schemas (zod)
  /styles (tokens.css)
  /tests
```

---

## 3. Rendering & Caching Strategy

| Content | Strategy |
|---|---|
| Home, services, about, FAQ, legal, CMS pages | **ISR** + on-demand revalidation when admin publishes |
| Cars list / detail | ISR (short revalidate) + tag-based revalidation on car change |
| Availability / price estimate | **Dynamic**, server-computed, `no-store` |
| Booking submit | Server action/API, no cache |
| Admin | Dynamic, authenticated, `no-store`, `noindex` |

- Admin "Publish" → `revalidateTag()` / `revalidatePath()` relevant pages.
- Public cache mein private data kabhi nahi.

---

## 4. Internationalization (EN / UR)

- Locale prefix: `/en/...`, `/ur/...` (default locale admin configurable).
- `dir="rtl"` on `<html>` for Urdu; Tailwind logical utilities (`ms-*`, `me-*`, `ps-*`, `pe-*`, `text-start`), direction-aware icons.
- **UI strings:** `translations` table (key, locale, value) — admin editable; build-time JSON fallback.
- **Content fields:** JSONB `{ "en": "...", "ur": "..." }` for cars, services, FAQs, blocks, SEO.
- Fallback: missing Urdu → English + admin "missing translation" report.
- Fonts: Latin (Inter) + Urdu (Noto Nastaliq Urdu / Noto Naskh Arabic) with `font-display: swap`.
- Numbers/dates: locale-aware; trip time Asia/Karachi.
- Car/brand names translate na hon.

---

## 5. Authentication, Authorization & RBAC

### 5.1 Auth
- Supabase Auth email+password; TOTP 2FA (P1); secure reset.
- Admin session: short-lived JWT + refresh; idle timeout (e.g. 30 min configurable); logout invalidates session; "logout all devices".
- Generic login errors; rate limit + progressive cooldown; security events logged.

### 5.2 RBAC model
- Tables: `roles`, `permissions`, `role_permissions`, `admin_profiles(user_id, role_id)`.
- Permission key format: `module.action` e.g. `bookings.confirm`, `cars.publish`, `content.rollback`, `customers.export`, `settings.edit`, `theme.edit`.
- **Enforcement layers:**
  1. Middleware: `/admin/*` requires session.
  2. Server action/API: `requirePermission('bookings.confirm')`.
  3. **DB RLS** policies using `has_permission(auth.uid(), 'module.action')`.
- UI hiding sirf UX; security nahi.

### 5.3 Default roles
| Role | Access |
|---|---|
| Owner | Sab kuch + team + danger zone |
| Admin | Sab kuch except owner-only (roles, delete account) |
| Manager | Bookings, cars, calendar, customers, pricing view, reports |
| Staff | Bookings/enquiries (limited customer data) |
| Content Editor | CMS, media, FAQ, SEO, translations (no bookings/customers) |
| Viewer | Read-only dashboard/reports |
| Custom | Owner-defined permission set |

---

## 6. Core Engines

### 6.1 Availability Engine
- Input: `vehicle_id`, `start_at`, `end_at`.
- Blocks: confirmed bookings + maintenance blocks + buffer (setting) + vehicle status.
- Implementation:
  - Postgres range type `tstzrange` + **EXCLUDE USING gist** constraint on confirmed bookings and maintenance blocks (hard guarantee against race conditions).
  - `check_availability()` SQL function / server util used by public API and admin confirm.
- Confirm flow runs in a **transaction**; constraint violation → friendly error "Car already booked in this period".
- Pending requests do **not** block (admin policy configurable: soft-hold toggle P2).

### 6.2 Pricing Engine
- Pure function `calculateQuote(input, rateRules, settings)` shared by server (authoritative) and client (preview only).
- Inputs: vehicle, service, route, rental type, start/end, driver option, add-ons.
- Rule resolution priority: **vehicle+route > vehicle+service > vehicle > service > global**, filtered by `effective_from/to`.
- Output: breakdown lines, subtotal, deposit, total, flags (`estimated`, `needs_quote`).
- Missing rate → `needs_quote = true` (UI: "Contact for quote").
- On confirm: snapshot saved to `bookings.confirmed_quote` (JSONB) + `booking_quote_history`.

### 6.3 Booking Service
1. Zod validate → 2. rate limit + captcha → 3. idempotency key check → 4. sanitize → 5. phone normalize (+92) → 6. estimate → 7. insert `bookings` (`Pending`) + `booking_status_history` + upsert customer → 8. create admin notification → 9. try email/WA (failure logged, booking safe) → 10. return reference.
- **Reference:** `R2G-` + 8 chars base32 (non-sequential, crypto random), unique index.

### 6.4 CMS Engine (Advanced Admin Core)
- **Pages** table (`pages`) → ordered **sections/blocks** (`page_sections`) each with `type`, `props` JSONB (translatable), `is_visible`, `sort_order`.
- **Block registry** (code-defined, schema-validated via Zod): `hero`, `rich_text`, `image_text`, `card_grid`, `feature_list`, `steps`, `faq`, `testimonials`, `featured_cars`, `services_list`, `cta`, `gallery`, `video`, `map`, `contact_info`, `custom_embed` (sanitized/allow-listed).
- Admin editor: form-based props panel + live preview iframe (desktop/mobile/RTL toggle).
- **Draft/Publish:** content_revisions stores `draft` and `published` snapshots; public reads only `published`.
- **Versioning:** every publish creates immutable revision (author, time, note, diff); **rollback** = publish an old revision as new.
- **Scheduled publish:** `publish_at` + cron (Vercel Cron / Supabase pg_cron).
- **Preview:** signed, expiring preview token, `noindex`.
- **Sanitization:** DOMPurify (server) for rich text; no raw script injection; embeds allow-list (YouTube, Google Maps).
- **Navigation:** `navigation_items` (menu, parent, label i18n, link type: page/url/custom, order, visible).
- **Theme:** `theme_settings` → CSS variables injected at render (colors, radius, fonts, button style); WCAG contrast validator blocks unsafe combos.
- **Feature flags:** `feature_flags` (key, enabled, config) read via cached helper.
- **Form builder:** `form_definitions` + `form_fields` JSON driving booking/contact form rendering **and** matching Zod schema generation (server remains authoritative; core fields like phone/pickup cannot be removed).
- **Redirects:** `redirects` table consumed by middleware.
- **Safe-guards:** required core fields locked, "reset to default" per section, validation before publish.

### 6.5 Media Pipeline
- Upload → type/size validation (jpg/png/webp/avif; video optional) → virus/MIME sniff → store original → generate responsive variants (WebP/AVIF) → save `media_assets` (alt i18n, width/height, usage).
- Max size e.g. 8 MB image; EXIF strip; unique filenames; folder structure.
- Usage tracking prevents deleting in-use assets (warn).

### 6.6 Notification Service
- Channel abstraction: `in_app`, `email`, `whatsapp`, `sms` (providers pluggable).
- `notification_log` (event, channel, status, error, attempts); retry with backoff; admin warning for failing channel.
- Templates editable in admin (EN/UR).

### 6.7 WhatsApp Link Builder
`https://wa.me/<number>?text=<urlencoded template>`; number/template from settings; placeholders `{car} {pickup} {return} {from} {to} {ref}`.

---

## 7. API Design (Internal)

| Endpoint / Action | Method | Auth | Notes |
|---|---|---|---|
| `submitBooking` | POST | Public | Rate-limit, captcha, idempotency |
| `submitEnquiry` | POST | Public | Contact form |
| `getAvailability` | GET | Public | Dynamic, no-store |
| `getQuote` | POST | Public | Server estimate |
| `bookingStatusLookup` | POST | Public (P2) | Ref + OTP |
| `admin.bookings.*` | — | Perm | confirm/reject/cancel/complete/create |
| `admin.vehicles.*` | — | Perm | CRUD, publish |
| `admin.cms.*` | — | Perm | pages, sections, publish, rollback |
| `admin.media.*` | — | Perm | upload/delete/alt |
| `admin.settings.*` | — | Perm | settings/theme/flags/nav/translations |
| `admin.reports.*` | — | Perm | aggregates, export |
| `/api/revalidate` | POST | Secret | On-demand ISR |
| `/api/cron/*` | GET | Cron secret | Scheduled publish, reminders |

Zod schema har input par; errors consistent `{ code, message, fieldErrors }`.

---

## 8. Security Requirements

| Control | Implementation |
|---|---|
| AuthZ | Middleware + server `requirePermission` + **RLS** |
| Input | Zod + server sanitize; notes plain text only |
| XSS | Escape by default; DOMPurify for rich text; CSP header |
| CSRF | SameSite cookies, server actions origin check |
| Rate limiting | Login, booking, enquiry, upload endpoints |
| Secrets | Env vars only; service-role key server-side only |
| Uploads | Type/size limit, private buckets for sensitive, signed URLs |
| Headers | CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy |
| PII | Not in URLs/logs/analytics; log redaction |
| Audit | `audit_events` on sensitive actions |
| Backups | Daily DB backup + storage backup; restore test |
| Dependencies | Dependabot, `npm audit` in CI |
| Admin | noindex, 2FA option, session timeout, IP/device log |

---

## 9. Performance Targets
- LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms (mobile, 4G).
- Hero image `priority`, others lazy; explicit width/height.
- Public pages minimal client JS (server components); admin heavy components dynamic-imported.
- DB indexes (see schema); pagination on all lists.
- Lighthouse CI budget: Perf ≥ 85, A11y ≥ 95, SEO ≥ 95.

---

## 10. Observability
- Sentry (frontend + server), structured logs (no PII).
- Admin health panel: notification failures, failed jobs, last backup.
- Uptime monitor on `/` and `/api/health`.

---

## 11. Environment Variables (Example)
```
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # server only
REVALIDATE_SECRET=
CRON_SECRET=
TURNSTILE_SECRET_KEY= / NEXT_PUBLIC_TURNSTILE_SITE_KEY=
RESEND_API_KEY=                   # optional
UPSTASH_REDIS_REST_URL= / TOKEN=
SENTRY_DSN=
PREVIEW_TOKEN_SECRET=
```
Secrets repo mein commit nahi; `.env.example` sirf keys ke sath.

---

## 12. Testing Strategy

| Type | Tool | Coverage |
|---|---|---|
| Unit | Vitest | pricing engine, phone normalize, date rules, permission checks |
| Integration | Vitest + test DB | booking service, availability, RLS policies |
| E2E | Playwright | booking flow, admin car CRUD, CMS publish/rollback, RTL |
| A11y | axe + manual | all public/admin key pages |
| Performance | Lighthouse CI | budgets |
| Security | RLS tests, authz negative tests, rate-limit tests | anonymous access denied |
| Visual/RTL | Playwright screenshots EN/UR | key pages |

**Concurrency test:** do admins ek hi car ke overlapping bookings confirm karein → sirf aik succeed.

---

## 13. Deployment & Environments

| Env | Purpose |
|---|---|
| Local | Dev + Supabase local/dev project |
| Preview | Per-PR Vercel preview (demo data labelled) |
| Staging | Owner review, real-like data |
| Production | Live |

- CI pipeline: install → lint → typecheck → unit → build → e2e (preview) → deploy.
- DB migrations versioned (Supabase migrations), reviewed before prod.
- Rollback: Vercel instant rollback + DB migration down-scripts/backup.
- **Launch gate:** build/lint/tests pass + RLS verified + real settings filled + backup tested.

---

## 14. Data Retention & Privacy
- Customer data minimum; retention period owner/legal se decide (e.g. old enquiries archive/delete schedule).
- Export/delete request procedure documented.
- Analytics consent-aware.

---

## 15. Technical Risks
| Risk | Mitigation |
|---|---|
| Race condition double booking | DB exclusion constraint + transaction |
| CMS admin se broken layout | Zod-validated blocks, preview, rollback, core fields locked |
| Urdu RTL regressions | Logical CSS props, RTL snapshot tests |
| Cache stale after publish | Tag-based revalidation tests |
| Over-permissive RLS | Automated RLS test suite |
| Vendor lock-in | Standard Postgres, abstraction for notifications/storage |
