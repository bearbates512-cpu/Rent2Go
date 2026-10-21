# Rent2Go — Implementation Plan

**Version:** 1.0 | **Related:** `01_PRD`, `02_TRD`, `03_App_Flow`, `04_UI_UX`, `05_Backend_Schema`

> **Phase exit rule:** Phase tab complete maana jaye ga jab UI + backend + validation + access control + tests implement aur verify ho jayen. Sirf mockup = production functionality nahi.

Timeline andaza hai (1 full-stack developer + 1 designer part-time). Team bara ho to weeks kam ho sakte hain.

---

## 1. Phase Overview

| Phase | Focus | Duration (approx) |
|---|---|---|
| **0** | Discovery, owner data, design kickoff | 1 week |
| **1** | Foundation + Public website (demo data labelled) | 3 weeks |
| **2** | Backend, Auth, Booking requests, Admin MVP | 4 weeks |
| **3** | **Advanced Admin CMS**, Pricing engine, Notifications, Reports | 5 weeks |
| **4** | QA, Security hardening, Launch | 2 weeks |
| **5** | Growth features (post-launch) | Ongoing |

Total launch tak: **~15 weeks**.

---

## 2. Phase 0 — Discovery & Setup (Week 1)

### Tasks
- [ ] Owner se **Section 25 info list** collect karna (phone, WhatsApp, address, hours, fleet, photos, rates, policies, legal text, logo/colours).
- [ ] Domain + hosting + Supabase + GitHub + Vercel accounts.
- [ ] Brand kit finalize (logo, colours, fonts) — owner approval.
- [ ] Repo setup: Next.js + TypeScript + Tailwind + ESLint + Prettier + Husky.
- [ ] CI pipeline (lint, typecheck, test, build).
- [ ] Environments: local / preview / staging / production.
- [ ] `.env.example`, secrets management.
- [ ] Project board (backlog, sprints) + decision log.

### Deliverables
Approved brand kit, repo + CI green, access to all accounts, owner info tracker.

---

## 3. Phase 1 — Foundation & Public Website (Weeks 2–4)

### 3.1 Foundation
- [ ] Design tokens → Tailwind config + CSS variables.
- [ ] i18n setup (`next-intl`), `/en` `/ur`, RTL (`dir`), logical CSS utilities.
- [ ] Fonts (Inter + Noto Nastaliq Urdu), language switcher.
- [ ] Core UI components (buttons, inputs, modal, toast, accordion, tabs, chips, skeleton).
- [ ] Layout: Header, Footer, mobile drawer, announcement bar slot.
- [ ] SEO base: metadata helper, sitemap.xml, robots.txt, OG, custom 404.
- [ ] Demo data layer (clearly labelled "DEMO" — real data jaisa present na ho).

### 3.2 Public Pages
- [ ] Home (hero, quick search, featured cars, services, why, how-it-works, reviews/FAQ placeholders, CTA).
- [ ] `/cars` (cards, filters, sorting, URL params, chips, empty state, pagination).
- [ ] `/cars/[slug]` (gallery/lightbox, specs, rates, sticky CTA bar, similar cars).
- [ ] `/services`, `/services/[slug]`, `/rates`, `/about`, `/faq`, `/contact`, `/reviews`.
- [ ] Legal page templates (terms, privacy, cancellation).
- [ ] WhatsApp/Call buttons (settings-driven, hide if unset).
- [ ] "Contact for quote" logic (no fake prices).

### 3.3 Quality
- [ ] Responsive 320px+ QA, Urdu RTL QA har page.
- [ ] Accessibility pass (axe + keyboard).
- [ ] Lighthouse baseline.

### Exit Criteria
- [ ] Sab public pages EN + UR mein error-free.
- [ ] No horizontal overflow @320px.
- [ ] Demo data visibly labelled; booking/availability claim nahi.

---

## 4. Phase 2 — Backend, Auth, Booking & Admin MVP (Weeks 5–8)

### 4.1 Database & Auth (Week 5)
- [ ] Migrations 0001–0011 (see `05_Backend_Schema`) apply on dev/staging.
- [ ] Seed: roles, permissions, form definitions, feature flags (all off), system pages, translations, empty settings.
- [ ] Supabase Auth + admin_profiles + `has_permission()`.
- [ ] RLS policies + **RLS test suite** (anon denied, role matrix).
- [ ] Middleware: `/admin` protection, noindex, session idle timeout.
- [ ] Login: rate limit, cooldown, generic errors, security_events log.
- [ ] Storage buckets + upload validation.

### 4.2 Admin Shell & Vehicles (Week 6)
- [ ] Admin layout (sidebar, topbar, notifications bell, permission-based nav).
- [ ] Settings (business profile, contact, hours, WhatsApp template, booking rules) — public pages ab real settings se.
- [ ] Media library (basic): upload, alt text, folders.
- [ ] Vehicle CRUD: specs, categories, **custom fields**, photos (reorder/cover/alt), visibility/status, featured, maintenance blocks, preview, publish validation.
- [ ] Public site demo arrays → **DB data** (ISR + tag revalidation).

### 4.3 Booking Request System (Week 7)
- [ ] Zod schemas (shared client/server).
- [ ] Multi-step booking form (EN/UR), PK phone normalize, passenger ≤ capacity, PST date rules.
- [ ] Server action: rate-limit + Turnstile/honeypot + idempotency + sanitize.
- [ ] Reference generator (`R2G-XXXXXXXX`), `Pending` status, history row, customer upsert.
- [ ] Success page (reference + "admin confirmation required").
- [ ] Contact/enquiry form → `enquiries`.
- [ ] Availability API (`is_vehicle_available`) + car detail date checker.

### 4.4 Admin Bookings & Calendar (Week 8)
- [ ] Bookings table (search/filter/sort/pagination), detail view, status timeline.
- [ ] Actions: confirm / need info / reject / cancel (reason) / complete / no-show.
- [ ] **Confirm in transaction** + exclusion-constraint error → friendly conflict message.
- [ ] Manual booking creation (phone/WhatsApp source).
- [ ] Calendar (month/week/day + per-vehicle), pending vs confirmed vs maintenance styles.
- [ ] Customers/enquiries inbox (basic), follow-up notes.
- [ ] Dashboard cards (DB-driven) + setup checklist.
- [ ] In-app admin notification for new booking.

### Exit Criteria
- [ ] Anonymous user admin data access nahi kar sakta (tests).
- [ ] Booking submit → `Pending` + unique reference; duplicate submit safe.
- [ ] Concurrent confirm test: sirf aik overlapping booking confirm ho.
- [ ] Admin car add/edit/hide → public par reflect.
- [ ] Status history + actor saved.

---

## 5. Phase 3 — Advanced Admin CMS, Pricing, Notifications, Reports (Weeks 9–13)

> Ye phase "admin panel advanced" requirement ka core hai: owner poori website bina developer ke edit kare.

### 5.1 CMS Engine (Weeks 9–10)
- [ ] `pages`, `page_sections`, `content_revisions` implement.
- [ ] **Block registry** + Zod schemas: hero, rich_text, image_text, card_grid, feature_list, steps, faq, testimonials, featured_cars, services_list, cta, gallery, video, map, contact_info, custom_embed (sanitized).
- [ ] Public renderer: published revision se blocks render (EN/UR).
- [ ] **Visual editor:** section list (drag reorder, show/hide, duplicate, delete), props panel with EN | UR tabs, live preview (Desktop/Mobile/Urdu RTL).
- [ ] Autosave drafts, unsaved-changes guard, validation panel (missing alt/Urdu/required).
- [ ] **Publish** → revision snapshot + `revalidateTag`; **Schedule publish** (cron); **Preview link** (signed, expiring, noindex).
- [ ] **Version history:** list, compare/diff, **rollback**.
- [ ] Custom pages `/p/[slug]` (create, SEO, publish, add to menu).
- [ ] Home page fully block-driven.
- [ ] Rich text editor (TipTap) + DOMPurify sanitization; legal pages versioned.

### 5.2 Site-wide Controls (Week 11)
- [ ] **Navigation manager** (header/footer, nesting, reorder, hide, link picker).
- [ ] **Theme manager** (colours with contrast checker, fonts, radius, buttons, logo/favicon) → CSS variable injection, draft/publish.
- [ ] **Translation manager** (table, missing filter, inline edit, publish).
- [ ] **Media library (advanced):** usage tracking, safe delete, search, folders, bulk upload.
- [ ] **FAQ manager**, **Offers/Announcements** (schedule, placement).
- [ ] **SEO manager** (per-page meta/OG/canonical/noindex, sitemap preview, **redirects** table + middleware).
- [ ] **Form builder** (booking/contact fields on/off, required, labels, order, conditional; core fields locked) → dynamic form + dynamic Zod.
- [ ] **Feature toggles/modules** UI (self-drive, hourly, airport, reviews, floating WhatsApp, announcement bar, payments tracking).
- [ ] Services & service areas manager; reviews moderation.

### 5.3 Pricing Engine (Week 12)
- [ ] Rate rules CRUD + effective dates + history.
- [ ] `calculateQuote()` pure function (+ unit tests: priority resolution, missing rate → "contact for quote", add-ons, deposit).
- [ ] Server-side authoritative estimate in booking flow; public estimate breakdown UI.
- [ ] Admin **Fare Preview**; final quote editor; **frozen `confirmed_quote`** + quote history.
- [ ] Price sorting only same-unit.
- [ ] Payment/deposit tracking (status, amount, method label, receipt note).

### 5.4 Roles, Notifications, Reports, Audit (Week 13)
- [ ] Team management: invite, roles, **custom role + permission matrix**, deactivate, session list/logout-all, 2FA (TOTP).
- [ ] Notification service: in-app + email (Resend/SMTP), templates editable (EN/UR), `notification_log`, retry, failure warning in admin.
- [ ] WhatsApp/SMS adapters (provider ready; enable after credentials).
- [ ] Reports (bookings by range/status, popular cars/services, conversion, estimated vs confirmed vs received) + role-restricted CSV export (logged).
- [ ] **Audit log** UI + before/after diff; audit hooks on rates, bookings, permissions, settings, publish/rollback.
- [ ] Maintenance mode toggle, backup/export tools.

### Exit Criteria
- [ ] Owner (non-technical) test: home headline edit + section reorder + naya page + menu item + colour change + publish + rollback bina developer ke.
- [ ] Draft content public par leak nahi hota; scheduled publish kaam karta hai.
- [ ] Rich text/embed XSS tests pass.
- [ ] Theme contrast checker invalid combos block/warn karta hai.
- [ ] Permission matrix server + DB level par enforced (negative tests).
- [ ] Notification fail hone par booking safe + admin indicator.
- [ ] Pricing tests pass; confirmed booking par rate change ka asar nahi.

---

## 6. Phase 4 — QA, Hardening & Launch (Weeks 14–15)

### 6.1 Testing
- [ ] Unit + integration + E2E (Playwright): booking flow EN/UR, admin booking confirm, vehicle CRUD, CMS publish/rollback, anonymous access denied.
- [ ] Concurrency test (double confirm).
- [ ] A11y (axe + manual keyboard/screen reader spot-check).
- [ ] Cross-device: Android Chrome, iOS Safari, 320px, tablet, desktop.
- [ ] RTL visual regression.
- [ ] Performance: Lighthouse CI (Perf ≥ 85, A11y ≥ 95, SEO ≥ 95), image optimization audit.
- [ ] Security: RLS audit, authz negative tests, rate-limit tests, CSP headers, dependency audit, secret scan.
- [ ] UAT with owner (checklist walkthrough).

### 6.2 Content & Data Entry
- [ ] Real settings enter (phone, WhatsApp, address, hours).
- [ ] Real fleet + photos + alt text (EN/UR) + rates.
- [ ] Services enable/disable per owner; service areas.
- [ ] Legal pages (owner/legal-approved text).
- [ ] FAQs, About, Why section — sirf verified claims.
- [ ] Demo data **purge** + "demo" labels remove.
- [ ] SEO titles/meta, Google Business Profile link, structured data (real info).
- [ ] Translation completeness check (missing-translation report = 0 critical).

### 6.3 Launch Checklist
- [ ] Production env vars set, secrets rotated, service-role key client mein nahi.
- [ ] Domain + SSL + redirects.
- [ ] Production migrations applied, seed minimal.
- [ ] Backups enabled + **restore test**.
- [ ] Sentry + uptime monitor + analytics (consent) live.
- [ ] Owner + staff accounts created, 2FA enabled for Owner.
- [ ] Sitemap submit (Search Console), robots check, admin `noindex`.
- [ ] Final build/lint/tests **real results recorded**.
- [ ] Rollback plan documented (Vercel rollback + DB backup).
- [ ] Owner training (1–2 hours) + admin user guide (short video/PDF).

### Exit Criteria
Real settings + real data + verified policies + secure auth + tested conflict checks + passing build/lint/tests — tabhi "production-ready" claim karein.

---

## 7. Phase 5 — Post-Launch Growth (Backlog)

Priority business need ke mutabiq:
1. Online deposits/payment gateway (webhook verification, refunds).
2. Coupons/offers engine (expiry, limits).
3. Customer accounts + OTP + secure booking status tracking.
4. Automated WhatsApp/SMS reminders.
5. Driver profiles/assignment, maintenance reminders, handover checklist.
6. Rental agreement + e-signature (legal review ke baad).
7. Corporate recurring bookings/invoices, downloadable invoice.
8. PWA; multi-branch/multi-city; area landing pages (genuine areas only).
9. AI chatbot (sirf reliable FAQ/data ke baad; rates/availability invent na kare).

---

## 8. Work Breakdown by Module (Checklist View)

| Module | Phase | Priority |
|---|---|---|
| Brand/Design tokens/Components | 0–1 | P0 |
| i18n + RTL | 1 | P0 |
| Public pages | 1 | P0 |
| DB schema + RLS | 2 | P0 |
| Admin auth + RBAC | 2 | P0 |
| Vehicles + media | 2 | P0 |
| Booking requests | 2 | P0 |
| Admin bookings + calendar | 2 | P0 |
| CMS block engine + visual editor | 3 | P0 |
| Draft/Publish/Rollback | 3 | P0 |
| Navigation/Theme/Translations | 3 | P1 |
| Form builder + feature toggles | 3 | P1 |
| SEO + redirects | 3 | P1 |
| Pricing engine + quote freeze | 3 | P0/P1 |
| Notifications | 3 | P1 |
| Reports + audit | 3 | P1 |
| Team/custom roles + 2FA | 3 | P1 |
| QA + security hardening | 4 | P0 |
| Payments/coupons/accounts | 5 | P2 |

---

## 9. Sprint Plan (2-Week Sprints Example)

| Sprint | Goals |
|---|---|
| S0 (Wk 1) | Discovery, repo, CI, brand kit |
| S1 (Wk 2–3) | i18n/RTL, components, layout, Home, Cars list |
| S2 (Wk 4–5) | Car detail, remaining public pages, A11y; DB + Auth + RLS start |
| S3 (Wk 6–7) | Admin shell, settings, vehicles, media; booking form + server logic |
| S4 (Wk 8–9) | Admin bookings, calendar, dashboard; CMS engine start |
| S5 (Wk 10–11) | Visual editor, publish/rollback, custom pages; navigation/theme/translations |
| S6 (Wk 12–13) | Form builder, toggles, SEO; pricing engine; notifications; roles/reports/audit |
| S7 (Wk 14–15) | QA, security, content entry, UAT, launch |

---

## 10. Team & Responsibilities

| Role | Responsibility |
|---|---|
| Owner / Product | Real data, approvals, policies, UAT |
| Full-stack Developer | Frontend, backend, DB, CMS, tests |
| UI/UX Designer | Brand, Figma, RTL, admin UX |
| Content/Translator | EN/UR copy, FAQs, legal text review |
| QA (or dev) | Test plans, device/RTL/A11y checks |
| Legal advisor (optional) | Terms, privacy, cancellation |

---

## 11. Risks & Mitigation

| Risk | Impact | Mitigation |
|---|---|---|
| Owner info/photos delay | Launch delay | Placeholder/hide logic; weekly follow-up; info tracker |
| CMS scope bohat bara | Timeline slip | Block engine pehle (P0), baqi tools incremental; MVP blocks first |
| Urdu RTL bugs | Poor UX | Logical CSS from day 1, RTL QA each sprint |
| Double booking | Business loss | DB exclusion constraint + tests |
| Admin se site kharab | Downtime/embarrassment | Draft/preview/rollback, locked core fields, validation |
| RLS misconfig | Data leak | Automated RLS tests, security review |
| Spam submissions | Admin noise | Rate limit, Turnstile, honeypot, idempotency |
| Notification provider issues | Missed alerts | Booking always saved; in-app fallback; failure indicator |
| Legal/policy gaps | Compliance risk | Owner/legal sign-off before publish |

---

## 12. Definition of Done (Per Feature)
- [ ] UI complete (EN + UR, mobile + desktop)
- [ ] Server-side validation + authorization
- [ ] RLS/DB constraints (jahan applicable)
- [ ] Empty/loading/error states
- [ ] Audit log hook (sensitive actions)
- [ ] Unit/integration/E2E tests
- [ ] A11y check
- [ ] No fake/demo data in production path
- [ ] Docs/admin help text updated
- [ ] Code reviewed, CI green

---

## 13. Post-Launch Support Plan
- **Week 1–2:** daily monitoring (errors, bookings, notification logs), quick fixes.
- **Month 1:** owner feedback, small UX tweaks, content help.
- **Ongoing:** dependency updates, backup checks, quarterly security review, analytics review → Phase 5 prioritization.
- Admin user guide + short training videos (bookings, cars, CMS publish/rollback).

---

## 14. Immediate Next Steps (Is Hafte)
1. Owner se info list collect karna shuru karein (Section 25 checklist).
2. Brand kit (logo/colours) approve karwayen.
3. Repo + CI + Supabase project setup.
4. Figma mein Home, Cars, Car Detail, Booking, aur **Admin CMS editor** screens ka design.
5. Sprint S1 start: i18n/RTL + components + Home.
