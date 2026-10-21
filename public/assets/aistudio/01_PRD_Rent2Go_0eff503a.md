# Rent2Go — PRD (Project Required Document)

**Project:** Rent2Go Rent-a-Car Website + Advanced Admin Panel
**Initial service area:** Sadiqabad, Punjab, Pakistan
**Tagline (suggested):** *Rent Easy. Travel Better.*
**Version:** 1.0 | **Status:** Draft for development
**Source:** `Rent2Go_Features_and_Requirements.md`

> **Rule #1:** Business ka phone, WhatsApp, address, fleet, rates, hours, policies owner se aayenge. Jab tak real data na ho, placeholder dikhayen ya section hide rakhen. Fake prices/claims kabhi publish na hon.

---

## 1. Product Overview

Rent2Go aik mobile-first, Urdu + English car rental website hai jahan customers cars dekh kar, estimated rent samajh kar **booking request** submit karte hain ya WhatsApp/phone par rabta karte hain. Website ke sath aik **advanced Admin Panel (mini-CMS)** hoga jahan owner cars, rates, bookings, calendar, services, pages, menus, theme, translations, forms aur SEO sab kuch bina developer ke edit kar sake.

### 1.1 Problem Statement
- Local rent-a-car business ki online presence nahi / unorganized hai.
- Bookings WhatsApp/phone par scattered hoti hain, double-booking aur follow-up miss hone ka risk hai.
- Website content (rates, cars, offers) badalne ke liye developer par dependency.

### 1.2 Goals
| # | Goal | Success Signal |
|---|------|----------------|
| G1 | Professional online presence | Live site, branded, Urdu/English |
| G2 | Cars + services + clear pricing show karna | Har active car ka complete detail page |
| G3 | Asaan booking request flow | Form completion rate track ho |
| G4 | Double booking rokna | Server-side conflict check, 0 overlapping confirmed bookings |
| G5 | Enquiries ek jagah manage | Website/WhatsApp/phone source tracking |
| G6 | Local SEO (Sadiqabad) | Indexed pages, Google Business link |
| G7 | **Owner website khud edit kar sake** | Developer ke baghair content/cars/rates/layout change |
| G8 | Future growth ready | Payments, coupons, notifications add ho saken |

### 1.3 Non-Goals (Initial Launch)
Online payment capture, instant auto-confirmation, customer ID document storage, GPS tracking, loyalty/accounts, autonomous AI booking bot, multi-vendor marketplace, guaranteed Google ranking.

---

## 2. Users & Personas

| Persona | Needs |
|---|---|
| **Local customer** (Sadiqabad) | Quick car dekhna, rate samajhna, WhatsApp par book karna |
| **Family/Intercity traveler** | Seats, AC, route pricing, driver option |
| **Event customer** (wedding) | Date-specific availability, decorated/luxury cars |
| **Corporate client** | Daily/weekly/monthly rental, invoice info |
| **Airport transfer customer** | Pickup/drop time, flight details |
| **Owner (Super Admin)** | Poori website + business control |
| **Staff (later)** | Limited booking/enquiry handling |

---

## 3. Scope & Priority Legend
- **P0** = MVP, launch ke liye lazmi
- **P1** = Launch ke foran baad
- **P2** = Future

---

## 4. Functional Requirements — Public Website

### 4.1 Global
| ID | Requirement | P |
|---|---|---|
| FR-G1 | Header: logo, nav (Home, Cars, Services, Rates, About, FAQ, Contact), language switch, "Book a Car" CTA | P0 |
| FR-G2 | WhatsApp/Call icons sirf jab number configured ho | P0 |
| FR-G3 | Footer: configured contact, links, policies, auto-year; koi admin link/debug data nahi | P0 |
| FR-G4 | English (LTR) + Urdu (RTL), language preference save, same page par switch | P0 |
| FR-G5 | Responsive 320px se desktop tak, no horizontal overflow | P0 |
| FR-G6 | Floating WhatsApp button (admin se on/off) | P1 |
| FR-G7 | Announcement bar (offer/holiday notice, admin editable, schedule ke sath) | P1 |
| FR-G8 | Cookie/consent banner (agar analytics on ho) | P1 |

### 4.2 Pages
`/` Home · `/cars` · `/cars/:slug` · `/book` · `/services` · `/services/:slug` · `/rates` · `/about` · `/reviews` · `/faq` · `/contact` · `/booking-status` (P2) · `/terms` · `/privacy` · `/cancellation-policy` · `/404` · **admin-created custom pages** `/p/:slug` (P0 — CMS)

### 4.3 Home Page (P0)
- Hero (headline, subtext, image, 2 CTAs) — sab admin se editable
- Quick search (pickup/return date, service, category) → `/cars` prefilled
- Featured cars (admin selected, hidden/inactive nahi)
- Services overview cards
- Why Rent2Go (sirf verified claims)
- How it works (4 steps)
- Approved reviews, 3–5 FAQs, service areas, final CTA
- **Sections ko admin reorder / show / hide kar sake** (section builder)

### 4.4 Cars Listing (P0)
- Card: image, make/model/variant/year, category, seats, transmission, AC, rental type, "starting rate" (sirf real rate ho), availability hint, View Details / WhatsApp
- Filters: category, seats, transmission, driver/self-drive, budget, date availability (jab ready ho), service area
- Sorting: featured, price (same unit only), capacity, newest
- URL query params se shareable filters, filter chips, Clear all, empty state, pagination/load more
- Hidden/inactive/maintenance cars public mein nahi

### 4.5 Car Detail (P0)
- Gallery + lightbox + alt text; video optional (click-to-load)
- Specs, features (verified), **admin-defined custom fields** (e.g. luggage, mileage)
- Rates & inclusions/exclusions, deposit, minimum rental, overtime
- Server-based availability check, similar cars, alternate suggestions
- Actions: Request Booking, WhatsApp (prefilled), Call
- Vehicle status: Available / Temporarily Unavailable / Maintenance / Hidden

### 4.6 Booking Request (P0)
- Multi-step form: car/service → dates → pickup/destination → rental type → driver option → contact → estimate review → consent → submit
- Required: name, PK mobile (+92 normalized), contact method, car/service, pickup date/time, pickup location, destination, trip type, passengers (≤ capacity), consent
- Conditional: return date, flight info (airport), company name (corporate), self-drive confirmation (only if offered)
- Validation: client + server; pickup future (Asia/Karachi); return > pickup; rate-limit; spam protection; idempotency; sanitized notes
- Output: unique unguessable **booking reference**, status `Pending`, clear "admin confirmation required" message
- **Admin form-builder se fields on/off, required/optional, label/translation edit** (P1)

### 4.7 Pricing & Estimate (P0/P1)
- Estimated breakdown: base, duration, add-ons, included/excluded, deposit, total
- Missing rate = "Contact for quote" (kabhi Rs. 0 nahi)
- Server-side recalculation; "Estimated / subject to confirmation" label

### 4.8 Services, Rates, About, FAQ, Contact, Reviews (P0)
- Services catalogue (10 types, admin enable/disable); service page: description, cars, pricing, inclusions, terms, coverage, CTA
- Rates page: configured packages & rules
- Contact: phone/WhatsApp/address/hours/map + enquiry form
- Reviews: sirf approved genuine reviews
- Legal pages: terms, privacy, cancellation (business-supplied text)

### 4.9 WhatsApp / Call (P0)
- Number `site_settings` se; URL-encoded prefilled message (car, dates, from/to, reference)
- WhatsApp click booking ko confirmed mark nahi karta

### 4.10 SEO (P0/P1)
Per-page title/meta (admin editable), H1 per page, canonical, sitemap.xml, robots.txt, OG tags, valid structured data, noindex for admin/private/demo, custom 404.

---

## 5. Functional Requirements — ADVANCED ADMIN PANEL

> Admin panel ka maqsad: owner **poori website** ko visually aur safely edit kar sake — cars, rates, content, layout, theme, translations, forms, SEO — **draft → preview → publish → rollback** workflow ke sath.

### 5.1 Authentication & Roles (P0)
- Individual accounts, strong password, secure reset, 2FA/TOTP (P1)
- Roles: **Owner/Super Admin, Admin, Manager, Staff, Content Editor, Viewer**
- **Custom role builder** + permission matrix (module × action: view/create/edit/delete/publish/export) (P1)
- Login rate-limit/cooldown, generic error messages, idle timeout, session list + "logout all devices"
- Server/DB level authorization (UI hiding security nahi)

### 5.2 Dashboard (P0)
Cards: pending requests, upcoming confirmed, today pickups/returns, cars in maintenance/unavailable, enquiries needing reply, recent actions, notification failure warnings. Sab numbers DB se; helpful empty states. **Widgets customizable** (show/hide/reorder) (P2).

### 5.3 Vehicle Management (P0)
- CRUD, duplicate car, bulk actions (publish/hide/feature/delete)
- Multi-photo upload, drag-reorder, cover image, alt text per image, auto-optimization
- Title, slug, specs, description (EN/UR), categories, features, services, rate rules
- **Custom fields builder** (text/number/boolean/select/list — admin khud nai spec fields bana sake)
- Visibility: Draft/Published/Hidden; operating status: Available/Temp. Unavailable/Maintenance
- Maintenance windows, internal notes, featured flag, public preview, publish-validation

### 5.4 Booking Management (P0)
- Table with search (reference/phone/name/car/date), filters (status, service, dates, staff), saved filters (P1)
- Detail view: trip info, customer, status timeline, communication notes
- Actions: Approve, Need More Info, Reject, Cancel (reason), Complete, No Show
- Final agreed quote (frozen snapshot), deposit/payment status, internal notes, assign staff
- **Manual booking creation** (phone/WhatsApp booking admin khud enter kare) (P0)
- Server-side conflict check on confirm; actionable warning
- Print/summary (P1), PDF/invoice (P2)

### 5.5 Calendar & Scheduling (P0)
Month/week/day + per-vehicle timeline; pending vs confirmed alag colour+icon; maintenance blocks; buffer/cleaning time; drag-to-reschedule (P2).

### 5.6 Customers / Enquiries CRM (P0/P1)
Minimal data, history, follow-up notes & dates, source (website/WhatsApp/phone/referral), tags, **enquiry inbox** (contact form + booking), role-restricted logged CSV export.

### 5.7 Pricing & Packages (P0/P1)
Rate rules by vehicle/service/route/duration; included/excluded costs; deposit, delivery, overtime, discount; **effective dates**; **fare preview calculator**; change history; past bookings keep agreed quote.

### 5.8 Services & Service Areas (P0)
Enable/disable services, full content edit (EN/UR), service-area/route manager, per-service FAQs/terms.

### 5.9 Website Content Manager (CMS) — **core of "advanced"** (P0/P1)
| Feature | Detail | P |
|---|---|---|
| **Page manager** | Existing pages edit + naye custom pages banana (slug, title, SEO) | P0 |
| **Section/Block builder** | Hero, text, image+text, cards grid, FAQ, CTA, gallery, testimonials, service list, featured cars, video, map, custom HTML-safe (sanitized) — drag-reorder, show/hide, duplicate | P1 |
| **Home page editor** | Har section ka content, order, visibility | P0 |
| **Navigation manager** | Header/footer menus add/edit/reorder/hide, submenus | P1 |
| **Theme/Brand settings** | Logo, favicon, colours (contrast checker), fonts, button style, radius, dark-mode toggle (opt.) | P1 |
| **Translation manager** | EN/UR keys table, missing-translation report, inline edit | P1 |
| **Media library** | Upload, folders, search, alt text, usage tracking, safe delete | P0 |
| **FAQ manager** | Categories, order, EN/UR | P0 |
| **Offers/Announcements** | Start/end dates, enable/disable, placement | P1 |
| **Reviews moderation** | Approve/hide/reply, manual add (verified source) | P0 |
| **SEO manager** | Per-page title/meta/OG image/canonical/noindex, sitemap preview, redirects (301) manager | P1 |
| **Legal pages** | Rich-text editor with versioning | P0 |
| **Form builder** | Booking & contact form fields on/off, required, labels, order | P1 |
| **Feature toggles / Modules** | Self-drive, hourly, airport, reviews, floating WhatsApp, announcement bar, payments tracking — on/off | P0 |
| **Draft / Preview / Publish / Schedule** | Har content draft rahe, preview link (mobile/desktop/Urdu), schedule publish | P1 |
| **Version history & rollback** | Har edit ka revision, diff view, one-click restore | P1 |
| **Global search in admin** | Cars, bookings, customers, pages ek search se | P2 |

### 5.10 Settings (P0)
Business profile (name, phone, WhatsApp, email, address, map location, hours, holidays), languages, timezone (Asia/Karachi), currency (PKR), booking rules (min notice, buffer, max advance, min duration), WhatsApp message template editor, notification channels, analytics IDs, maintenance mode, backup/export (P1).

### 5.11 Payments & Deposits (P1)
Status: unpaid/deposit requested/received/partial/paid/refunded/issue; method label; amount (PKR), date, receipt note, staff. Card/PIN/OTP kabhi store nahi.

### 5.12 Reports (P1)
Bookings by range/status, enquiry→confirmed conversion, popular cars/services, estimated vs confirmed value vs received payments (alag), CSV export (role-restricted, minimal).

### 5.13 Audit Log (P1)
Rates, bookings, permissions, settings, content publish/rollback — who/when/what/before-after. Filter + export.

### 5.14 Notifications (P1)
In-admin bell + email (+WhatsApp/SMS later): new booking, update/cancel, upcoming confirmation, conflict, channel failure. Delivery log; failure par bhi booking save.

### 5.15 Admin UX Requirements
Responsive admin (mobile par bhi bookings handle ho sakein), keyboard shortcuts (P2), autosave drafts, unsaved-changes warning, undo toast, bulk actions, table sort/filter/column toggle, loading/empty/error states, English admin UI (Urdu content editing support).

---

## 6. Booking Status Lifecycle
`Pending → Need More Info → Confirmed → Completed` · `Rejected` · `Cancelled` · `No Show`
Har transition: timestamp + actor + reason saved.

---

## 7. Non-Functional Requirements
| Area | Requirement |
|---|---|
| Performance | Mobile LCP ≤ 2.5s target; WebP/AVIF; lazy-load; minimal public JS |
| Accessibility | WCAG 2.1 AA target; keyboard nav; focus states; colour + text/icon for status |
| Security | RBAC, RLS, rate-limit, input sanitize, secrets server-side, upload limits |
| Privacy | Minimal data; no PII in URLs/logs/analytics; retention policy |
| Reliability | DB-backed (no demo arrays), backups, error monitoring, graceful errors |
| i18n | EN/UR, RTL, direction-aware UI |
| Timezone | Store UTC, display Asia/Karachi |
| SEO | Per section 4.10 |
| Browser support | Last 2 versions Chrome/Safari/Edge/Firefox; Android Chrome, iOS Safari |

---

## 8. Business Rules
1. Form submit ≠ confirmed booking.
2. Admin confirm se pehle availability + final quote verify.
3. Overlapping confirmed bookings (same car) reject.
4. Maintenance block conflicts ko rokta hai.
5. Missing rate → "Contact for quote".
6. Confirmed quote frozen; default rate change purani booking ko nahi badalta.
7. Reviews/badges/claims sirf verified aur approved.
8. Self-drive sirf jab owner offer kare.
9. Estimated fare ko revenue na kaha jaye.

---

## 9. Analytics (Optional)
Car views, booking form starts/submits, WhatsApp/call clicks, popular cars/services, enquiry→booking conversion, traffic source. **Names/phones/destinations event labels mein nahi.**

---

## 10. Information Needed from Owner (Launch Blockers)
Phone, WhatsApp, address/service area, business hours, fleet details + real photos, rates (daily/weekly/monthly/route/quote), included/excluded costs, min booking duration, cancellation/no-show, deposit & payment methods, routes, self-drive policy, email/social, legal text (terms/privacy/cancellation), final logo/colours/copy.

---

## 11. Risks & Mitigations
| Risk | Mitigation |
|---|---|
| Owner data late aaye | Placeholders + hide-unset logic, launch checklist |
| Double booking | DB exclusion constraint + server check |
| Admin se site tod dena | Draft/preview/rollback, validation, roles |
| Spam bookings | Rate-limit, honeypot/captcha, idempotency |
| Fake/unverified claims | Admin warnings + owner sign-off |
| Urdu RTL bugs | RTL QA checklist har page par |
| Scope creep | Phase-wise roadmap + exit rules |

---

## 12. Release Phases (Summary)
- **Phase 1:** Public site + design foundation
- **Phase 2:** Backend, auth, Booking requests, Admin MVP (cars/bookings/calendar/settings/basic CMS)
- **Phase 3:** Advanced CMS (block builder, theme, translations, menus, form builder, versioning), pricing engine, notifications, reports, audit
- **Phase 4:** Growth (coupons, payments, customer tracking, PWA, etc.)

Detail: `06_Implementation_Plan.md`

---

## 13. Acceptance Criteria (Highlights)
- [ ] Public pages error-free, responsive (320px+), Urdu RTL correct
- [ ] Hidden/draft/inactive cars public par nahi
- [ ] Missing rate par fake price nahi
- [ ] Booking → unique reference + `Pending`; duplicate submit rok
- [ ] Overlap/maintenance conflicts server par reject
- [ ] Anonymous user admin/protected data access nahi kar sakta
- [ ] Admin car add/edit/hide → public site par reflect
- [ ] **Admin home page sections reorder/edit/publish kar sake, preview dekh sake, purana version restore kar sake**
- [ ] **Admin naya custom page, menu item, FAQ, translation, theme colour khud change kar sake**
- [ ] Status history + final quote history saved
- [ ] Build, lint, tests pass; results recorded
