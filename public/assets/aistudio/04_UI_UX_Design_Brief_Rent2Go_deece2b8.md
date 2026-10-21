# Rent2Go — UI/UX Design Brief

**Version:** 1.0 | **Related:** `01_PRD_Rent2Go.md`, `03_App_Flow_Rent2Go.md`

---

## 1. Design Goals
1. **Trustworthy & professional** — local business jo reliable lage.
2. **Mobile-first** — zyada tar Pakistani users mobile par hongay.
3. **Fast to book** — car dekhna se request submit tak minimum friction.
4. **Urdu + English equal citizens** — RTL sirf "flip" nahi, properly designed.
5. **Admin = easy for non-technical owner** — visual, clear, safe (undo/preview).
6. **Honest UI** — fake prices, fake reviews, fake availability nahi.

**Brand personality:** Clean · Reliable · Modern · Friendly · Transport/Road-focused
**Tagline:** *Rent Easy. Travel Better.* / *آسان کرایہ، بہتر سفر* (final copy owner se approve)

---

## 2. Design Tokens (Admin se editable)

> Ye values *suggested defaults* hain; final brand owner approval ke baad. Admin Theme panel inhein CSS variables ke zariye change karega.

### 2.1 Colours
| Token | Default | Use |
|---|---|---|
| `--color-primary` | `#0B1F3A` (Deep Navy) | Header, headings, primary buttons |
| `--color-primary-hover` | `#142F57` | Hover |
| `--color-accent` | `#F5B301` (Warm Gold) | CTA highlights, badges |
| `--color-accent-text` | `#0B1F3A` | **Gold par text navy** (white on gold contrast weak) |
| `--color-bg` | `#FFFFFF` | Page background |
| `--color-surface` | `#F5F7FA` | Cards/sections |
| `--color-border` | `#E3E8EF` | Dividers |
| `--color-text` | `#122033` | Body text |
| `--color-text-muted` | `#5B6B80` | Secondary text |
| `--color-success` | `#1E8E5A` | Confirmed |
| `--color-warning` | `#B7791F` | Pending/Need info |
| `--color-danger` | `#C53030` | Rejected/Errors |
| `--color-info` | `#2563EB` | Info |
| `--color-whatsapp` | `#25D366` | WhatsApp button |

- Dark mode: optional (P2). Admin theme panel contrast checker: text/background ≥ 4.5:1 (large text ≥ 3:1).
- Status ko sirf colour se nahi — **colour + icon + text**.

### 2.2 Typography
| Role | English | Urdu |
|---|---|---|
| Headings | Inter / Poppins (600–700) | Noto Nastaliq Urdu (700) |
| Body | Inter (400/500) | Noto Nastaliq Urdu / Noto Naskh Arabic (400) |
| Numbers/Prices | Inter tabular | Western digits default (admin option for Urdu digits) |

- Scale (mobile → desktop): H1 28→44, H2 22→32, H3 18→24, Body 16, Small 14.
- Urdu line-height zyada (≈1.9–2.1) kyunke Nastaliq ko vertical space chahiye.
- `font-display: swap`; sirf zaroori weights load.

### 2.3 Spacing, Radius, Shadow, Motion
- Spacing scale 4px base: 4, 8, 12, 16, 24, 32, 48, 64, 96.
- Radius: 8 (inputs/buttons), 12–16 (cards); admin se changeable.
- Shadow: subtle `0 2px 8px rgba(11,31,58,.08)`; hover card `0 8px 24px rgba(11,31,58,.12)`.
- Motion: 150–250ms ease-out; `prefers-reduced-motion` respect; no heavy auto-play animations.
- Breakpoints: `sm 480`, `md 768`, `lg 1024`, `xl 1280`. Container max 1200px.

---

## 3. Layout & Responsive Rules
- Design **320px** se start; no horizontal scroll.
- Tap targets ≥ 44×44px.
- Sticky bottom action bar (mobile) on car detail: **[Request Booking] [WhatsApp] [Call]**.
- Grid: Cars 1 col (mobile) / 2 (tablet) / 3–4 (desktop).
- Images aspect-ratio fixed (cars 4:3 / 16:10) — layout shift nahi.
- Logical CSS properties (start/end) — RTL automatic.

---

## 4. Component Library

### 4.1 Core
Buttons (Primary navy, Accent gold, Secondary outline, WhatsApp green, Ghost, Destructive) · Inputs · Phone input (+92 prefix) · Date-time picker (Asia/Karachi) · Select/Combobox · Checkbox/Radio/Switch · Textarea (counter) · Tabs · Accordion · Modal/Drawer · Toast · Tooltip · Badge/Status chip · Breadcrumb · Pagination · Skeleton · Empty state · Alert banner.

### 4.2 Public Components
| Component | Notes |
|---|---|
| Header | Logo, nav, language switch, CTA; mobile drawer |
| Announcement bar | Dismissible, admin-scheduled |
| Hero | Image + headline + 2 CTAs + optional quick search |
| Quick Search bar | Pickup/Return/Service/Category |
| Car card | Image, title, spec icons (seats, AC, gear), rate or "Contact for quote", CTAs |
| Filter panel | Desktop sidebar / mobile bottom-sheet |
| Filter chips | Removable + Clear all |
| Gallery + Lightbox | Swipe, keyboard, zoom |
| Spec table / icon list | Custom fields supported |
| Price breakdown card | Lines + "Estimated" tag |
| Availability picker | Result state chip |
| Stepper (booking) | 7 steps, progress, mobile compact |
| Service card | Icon, title, short text |
| Review card | Name, rating, text (approved only) |
| FAQ accordion | Keyboard accessible |
| Map block | Verified location only |
| Floating WhatsApp | Optional |
| Footer | Contact, links, policies |

### 4.3 CMS Blocks (render components, admin-configurable)
`hero`, `rich_text`, `image_text`, `card_grid`, `feature_list`, `steps`, `faq`, `testimonials`, `featured_cars`, `services_list`, `cta`, `gallery`, `video`, `map`, `contact_info`, `custom_embed`.
Har block ke **variants** (e.g. image left/right, 2/3/4 columns, light/dark/accent background).

---

## 5. Key Screen Wireframes (Low-Fidelity)

### 5.1 Home (Mobile)
```
┌──────────────────────┐
│ ☰  Rent2Go   EN|اردو │
├──────────────────────┤
│ [Announcement bar]   │
├──────────────────────┤
│  Rent a Car in       │
│  Sadiqabad           │
│  Rent Easy. Travel   │
│  Better.             │
│ [Explore Cars]       │
│ [Book on WhatsApp]   │
│  (hero image)        │
├──────────────────────┤
│ Pickup ▢  Return ▢   │
│ Service ▾ [Search]   │
├──────────────────────┤
│ Featured Cars  →     │
│ ┌────┐ ┌────┐ (swipe)│
│ │car │ │car │        │
│ └────┘ └────┘        │
├──────────────────────┤
│ Our Services (grid)  │
│ Why Rent2Go          │
│ How it works 1-2-3-4 │
│ Reviews / FAQ        │
│ Service Areas        │
│ [Final CTA band]     │
├──────────────────────┤
│ Footer               │
└──────────────────────┘
        (●WhatsApp)
```

### 5.2 Cars Listing (Desktop)
```
┌────────────────────────────────────────────────────────┐
│ Header                                                 │
├───────────────┬────────────────────────────────────────┤
│ Filters       │ Cars (24)         Sort: Featured ▾     │
│ Type ☐☐☐      │ [chip: SUV ✕][chip: 7 seats ✕] Clear   │
│ Seats         │ ┌──────┐ ┌──────┐ ┌──────┐             │
│ Gear          │ │ car  │ │ car  │ │ car  │             │
│ Driver        │ │ info │ │ info │ │ info │             │
│ Budget ──●──  │ │[View][WA]│...                        │
│ Dates         │ └──────┘ └──────┘ └──────┘             │
│               │ Pagination / Load more                 │
└───────────────┴────────────────────────────────────────┘
```

### 5.3 Car Detail
```
Breadcrumb: Home / Cars / Toyota Corolla
┌──────────────────────┬───────────────────────────┐
│ Gallery (main+thumbs)│ Title, year, badges       │
│                      │ From Rs. X / day*         │
│                      │ *or "Contact for quote"   │
│                      │ Dates [pick] → availability│
│                      │ [Request Booking][WhatsApp]│
├──────────────────────┴───────────────────────────┤
│ Tabs: Overview | Specs | Rates & Inclusions | Terms│
│ Similar Cars                                      │
└───────────────────────────────────────────────────┘
(Mobile: sticky bottom CTA bar)
```

### 5.4 Booking Form (Mobile Stepper)
```
Step 3 of 7  ●●●○○○○
Pickup location  [__________]
Destination      [__________]
[ Back ]            [ Next ]
```
Final step: Summary card + estimate + consent checkbox + **[Submit Request]**.

### 5.5 Booking Success
```
✔ Request Received
Reference: R2G-7K3M9QXA  [Copy]
Your request is PENDING. Rent2Go will confirm availability & price.
[Chat on WhatsApp] [Back to Home]
```

---

## 6. ADMIN PANEL DESIGN

### 6.1 Principles
- **Clarity over cleverness:** bara text, clear icons, plain-language labels.
- **Safe editing:** autosave drafts, preview, publish, undo, rollback, confirm dialogs.
- **Progressive disclosure:** basic fields pehle, advanced "More options" mein.
- **Responsive:** tablet/mobile par bhi bookings/calendar usable.
- **Consistent patterns:** list → detail → edit same layout har module mein.
- Admin UI language English (Urdu content editing tabs available); RTL preview in editor.

### 6.2 Shell Layout
```
┌─────────────────────────────────────────────────────────┐
│ ☰ Logo   🔍 Global search        🔔(3)   👤 Owner ▾     │
├────────────┬────────────────────────────────────────────┤
│ Dashboard  │ Page title            [Secondary][Primary] │
│ Bookings   │ ─────────────────────────────────────────  │
│ Calendar   │ Content area (cards / tables / forms)      │
│ Vehicles   │                                            │
│ Customers  │                                            │
│ Pricing    │                                            │
│ Services   │                                            │
│ ▸ Website  │                                            │
│   Pages    │                                            │
│   Menus    │                                            │
│   Theme    │                                            │
│   Translat.│                                            │
│   Media    │                                            │
│   SEO      │                                            │
│ Reviews    │                                            │
│ Reports    │                                            │
│ Team       │                                            │
│ Settings   │                                            │
│ Audit Log  │                                            │
└────────────┴────────────────────────────────────────────┘
```
- Sidebar collapsible; permission-based items hide.
- Mobile: bottom nav (Dashboard, Bookings, Calendar, Vehicles, More).
- **Setup checklist banner** jab tak required business info missing ho.

### 6.3 Dashboard
Top row KPI cards (Pending, Upcoming, Today Pickups, Today Returns, Maintenance, New Enquiries) → "Needs attention" list → Mini calendar (next 7 days) → Recent activity → Warnings (channel failing, missing settings/translations).

### 6.4 Tables (Bookings/Vehicles/Customers)
Search · filter chips · saved views · sortable columns · column toggle · bulk actions · row action menu · sticky header · pagination · status chip (colour+icon+text) · empty/loading states.

### 6.5 Booking Detail
```
Header: R2G-7K3M9QXA  [Pending ●]            [Confirm][More ▾]
┌─────────────── Left ───────────────┬──── Right ─────────────┐
│ Trip: car, dates, pickup→dest      │ Customer card          │
│ Estimate / Final quote (editable)  │ [Call][WhatsApp]       │
│ Payment & deposit                  │ Assigned staff         │
│ Notes (internal)                   │ Conflict check ✔/⚠     │
│ Status timeline (who/when/why)     │ Source: Website        │
└────────────────────────────────────┴────────────────────────┘
```

### 6.6 Calendar
Toolbar: Month|Week|Day|Timeline, vehicle filter, status filter, today. Event styles: Pending (outline+clock icon), Confirmed (solid+check), Maintenance (hatched+wrench), Completed (muted). Click empty slot → quick-add menu.

### 6.7 Vehicle Editor
Tabs: **Basic** · **Specs & Custom Fields** · **Photos** · **Rates** · **Availability/Maintenance** · **SEO** · **Preview**.
Photos: drag-drop upload, reorder grid, cover star, alt text input (EN/UR). Sticky save bar: *Save draft · Preview · Publish*.

### 6.8 Website Content Editor (Visual CMS)
```
┌───────────┬────────────────────────────┬───────────────────┐
│ Sections  │  LIVE PREVIEW              │ Section settings   │
│ ⋮⋮ Hero 👁│  [Desktop|Mobile|Urdu RTL] │ Tabs: EN | اردو    │
│ ⋮⋮ Search │  ┌──────────────────────┐  │ Headline [______]  │
│ ⋮⋮ Cars   │  │  rendered page       │  │ Subtext  [______]  │
│ ⋮⋮ Services│ │                      │  │ Image    [Choose]  │
│ ⋮⋮ FAQ    │  └──────────────────────┘  │ Variant  ◉ Left    │
│ [+ Add]   │                            │ Visible  [on]      │
├───────────┴────────────────────────────┴───────────────────┤
│ Draft saved 12:04   [History] [Preview link] [Schedule][Publish]│
└────────────────────────────────────────────────────────────┘
```
- Drag handle reorder, eye toggle, duplicate, delete (confirm).
- "+ Add section" → block gallery with thumbnails.
- **History drawer:** list of versions with author/time/note → Compare → Restore.
- Validation panel: missing alt text, missing Urdu, empty required fields.

### 6.9 Other Admin Screens
| Screen | Key UI |
|---|---|
| Navigation | Tree list drag-nest, add item, link picker, visible toggle |
| Theme | Colour pickers w/ contrast badge, font select, radius slider, logo/favicon upload, live preview |
| Translations | Table: key / English / اردو / status; filter "Missing"; inline edit |
| Media Library | Grid, folders, search, upload drag-drop, side panel (alt, size, usage) |
| FAQ | Sortable list, categories, EN/UR |
| Pricing | Rules table, rule drawer, **Fare Preview** panel |
| SEO | Page list w/ title/meta counters, OG image, redirects table |
| Form Builder | Field list w/ required/visible toggles, label EN/UR, locked-core badge |
| Settings | Sectioned form: Business, Contact, Hours, Booking rules, WhatsApp template, Notifications, Modules (toggles), Maintenance mode |
| Team & Roles | Users table, invite, role select, permission matrix grid |
| Audit Log | Filterable timeline, before/after diff |
| Reports | Date picker, KPI cards, charts, export |

### 6.10 Admin Safety UX
- Destructive → confirmation modal (type name for critical).
- Soft delete / archive.
- Toast with **Undo** (where possible).
- "Unsaved changes" guard.
- Locked/core fields indicated by lock icon + tooltip.
- Role-based: disabled actions show reason tooltip.

---

## 7. Urdu / RTL Design Guidelines
- `dir="rtl"` + `lang="ur"`; logical spacing; mirrored layout (nav, breadcrumb arrows, steppers, sliders).
- **Don't mirror:** phone numbers, logos, media controls play icon, charts' time axis (follow convention), numerals in prices.
- Icons with direction (chevrons, back arrows) flip; neutral icons (search, phone) nahi.
- Form: labels start-aligned (right), inputs text-align start; phone input stays LTR inside RTL.
- Mixed-language text (English car names in Urdu text) `bdi`/`unicode-bidi` handle.
- Longer Urdu text ke liye cards flexible height; truncation avoid.
- QA har page par EN + UR screenshots.

---

## 8. Accessibility (WCAG 2.1 AA)
- Contrast: text 4.5:1, large 3:1, UI components 3:1.
- Keyboard: full navigation, visible focus ring (2px accent/navy), skip-to-content.
- Forms: associated labels, error text linked via `aria-describedby`, `aria-live` for status.
- Images: meaningful alt (EN/UR); decorative `alt=""`.
- Modals: focus trap, Esc to close.
- Status never colour-only.
- Reduced motion respected; no auto-playing video with sound.
- Admin tables/calendars keyboard accessible; DnD ka keyboard alternative (move up/down buttons).

---

## 9. Content & Microcopy Guidelines
- Tone: simple, respectful, local (Roman Urdu nahi — public site par proper English / Urdu script).
- CTAs: "Book a Car / گاڑی بک کریں", "Check Availability", "Ask on WhatsApp".
- Price copy: "Estimated — subject to confirmation"; "Contact for quote".
- Avoid unverified claims ("No.1", "Cheapest", "Insured") jab tak owner proof na de.
- Error messages: kya hua + kya karna hai ("Pickup time must be in the future").
- Empty states: encouraging + action.

---

## 10. Imagery & Iconography
- Real owner-provided car photos (permission ke sath); consistent crop 4:3, clean background preferred.
- Stock images actual fleet ke taur par nahi dikhayen (label/avoid).
- Icons: Lucide (consistent stroke 1.75).
- Logo: wordmark "Rent2Go" + subtle road/arrow/car motif; SVG; light/dark variants; favicon.
- Image optimization: WebP/AVIF, responsive `srcset`, blur placeholder.

---

## 11. Design Deliverables Checklist
- [ ] Brand kit (logo, colours, fonts) — owner approved
- [ ] Design tokens file
- [ ] Component library (Figma / Storybook)
- [ ] Public wireframes → hi-fi (Home, Cars, Detail, Booking, Services, Contact)
- [ ] Admin hi-fi (Dashboard, Bookings, Calendar, Vehicle editor, **CMS editor**, Theme, Translations)
- [ ] RTL versions of key screens
- [ ] Mobile 320 / 375 / 414, Tablet 768, Desktop 1280 frames
- [ ] Empty/loading/error states
- [ ] Accessibility annotations
- [ ] Prototype for booking flow + CMS publish flow
- [ ] Owner sign-off

---

## 12. Design Acceptance Criteria
- [ ] 320px par koi overflow nahi
- [ ] Urdu RTL har public page par correct
- [ ] Contrast checks pass
- [ ] Booking flow mobile par ≤ 7 steps, clear progress
- [ ] Admin owner (non-technical) bina training ke car add + home headline edit + publish kar sake (usability test)
- [ ] Status chips colour + icon + text
