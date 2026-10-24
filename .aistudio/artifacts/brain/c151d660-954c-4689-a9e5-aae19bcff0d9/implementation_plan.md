# Fleet Modernization & Demo Data Purge System

Cleanse all legacy demo records, inject an authentic Pakistani rental fleet (Economy to Luxury 4x4) with high-fidelity automotive photography, and upgrade the Admin Vehicle Manager with native file upload, curated presets, and instant public synchronization.

### User Review & Critical Decisions

> [!IMPORTANT]
> Based on your response "all hi rakh do", we are enabling the complete end-to-end suite:
> 1. Replacing all dummy cars with a 9-car comprehensive fleet representing top rental choices in Pakistan (Suzuki Alto, Suzuki Cultus, Toyota Yaris, Honda City, Toyota Corolla Grande, Honda Civic RS, Toyota Fortuner Legender, Toyota Land Cruiser Prado, and Toyota Hiace Grand Cabin).
> 2. Generating authentic, studio and road-lit photographic assets for each car to replace external placeholder URLs.
> 3. Purging old test bookings and fake inquiries so your admin booking dashboard and operational metrics start fresh.
> 4. Upgrading the Admin Fleet Manager with direct file upload (converting local photos to persistent data URLs), instant presets, and live synchronization across both client-facing catalog and booking engine.

- **Confirmed Decision 1**: All vehicle categories (Economy, Sedans, Luxury SUVs, and Passenger Vans) will be populated with realistic Pakistani rental rates (PKR/day with driver & self-drive, hourly overtime rates, security deposits).
- **Confirmed Decision 2**: Admin panel will include a "Reset/Clean Demo Data" utility allowing you to purge test orders at any time without losing vehicle inventory.
- **Confirmed Decision 3**: Photo handling in Admin will support both image file uploads directly from your computer/phone and custom image URLs, accompanied by a quick-fill preset library.

---

### 1. Overview & Core Concept

- **What It Does**: Upgrades Rent2Go's vehicle inventory system into a production-ready fleet management engine. Administrators can add, edit, toggle availability, upload vehicle photos directly, or select from built-in popular Pakistani car presets with pre-configured specs. The public website immediately reflects new additions, price adjustments, and status changes across the Home featured cars, Fleet catalog, Search filter, and WhatsApp Booking Wizard.
- **Target Audience / Persona**: Rent2Go fleet managers and operations staff managing vehicle dispatches in Sadiqabad, as well as customers seeking accurate, transparent rental choices.
- **Key Value**: Eliminates synthetic demo clutter, equips the rental business with real fleet assets and images, and delivers a seamless, zero-friction fleet administration workflow.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Admin Fleet Management**:
   - Admin navigates to **Vehicles & Fleet** tab in the Admin Portal.
   - Admin views the clean, high-density vehicle grid with status badges (`Available`, `On-Trip`, `Maintenance`), registration numbers, and rental tariffs.
   - Admin clicks **Add Vehicle** or **Edit Vehicle**:
     - Can choose a pre-filled preset (e.g., "Corolla Grande", "Fortuner Legender", "Alto VXL").
     - Can upload an image directly from device storage (instant base64 preview) or paste a custom URL.
     - Sets daily self-drive rate, daily with-driver fee, overtime hourly rate, and security deposit.
     - Saves changes: the updated car appears instantaneously in the admin list and live on the public site without requiring a server reboot.
2. **One-Click Demo Data Purge**:
   - Admin can click "Purge Demo Bookings & Inquiries" to clean up test reservations while keeping the active vehicle catalog intact.
3. **Public Customer Experience**:
   - Visitors on the home page and `/fleet` page view authentic photos of actual available cars with bilingual (English/Urdu) descriptions.
   - Selecting a vehicle opens the Booking Wizard with exact, up-to-date pricing, driver options, and WhatsApp direct checkout.

#### Visual Identity & Theme
- **Aesthetic Direction**: High-trust automotive rental and fleet management aesthetic. Clean, utilitarian, and premium.
- **Color Palette**:
  - Dominant Neutral: Crisp Slate canvas (`#F8FAFC`), deep navy headers (`#0B1F3A`).
  - Structural Surfaces: Pure white cards (`#FFFFFF`) with subtle 1px border dividers (`#E2E8F0`).
  - Accent Color: Amber gold (`#F5B301`) for primary actions and active highlights; Emerald (`#10B981`) for available cars; Rose (`#EF4444`) for rented/overdue alerts.
- **Typography & Hierarchy**:
  - Display & Headings: `Plus Jakarta Sans` / `Inter`, bold weights for prominent titles.
  - Body Prose & Labels: Clean, legible sans-serif with Urdu typography supported via `Noto Naskh Arabic` and `Noto Nastaliq Urdu`.
  - Tabular Data: Strict `tabular-nums` formatting for prices, kilometers, and timestamps.
- **Component Styling & Layout**:
  - Unboxed metadata with subtle dot separators (`·`) avoiding cluttering pill badges.
  - Responsive cards with generous media presentation ($16:9$ and $4:3$ ratios).

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Direct File Upload via Data URL / Base64**:
  - *Chosen Approach*: Enable local image file upload in the Admin Vehicle modal using FileReader converting to compressed Data URLs saved in the unified state, alongside standard URL input.
  - *Why*: Allows the owner to photograph vehicles with their smartphone or computer and upload immediately without configuring third-party image hosting.
  - *Trade-off*: Large file uploads can take localStorage quota; we will include lightweight client-side compression/scaling (max 1200px width).
- **Decision 2: Comprehensive 9-Car Default Pakistani Fleet with Generated AI Imagery**:
  - *Chosen Approach*: Generate distinct, photorealistic automotive studio/outdoor images using `generate_image` for the 9 core vehicles, eliminating dependency on external hotlinked images.
  - *Why*: Ensures zero broken images in offline/restricted network environments and presents authentic vehicles commonly found in Pakistan.
- **Decision 3: Preserving Booking History Integrity on Demo Purge**:
  - *Chosen Approach*: Provide a targeted "Reset Sample Bookings" option rather than destructively erasing all system configurations, giving the admin total control.

---

### 4. Technical Architecture & Data Strategy

#### System Component & Data Flow Architecture
```
┌────────────────────────────────────────────────────────┐
│                   App Context & Store                  │
│               (LocalStorage & Reactive State)          │
└───────┬────────────────────────────────────────┬───────┘
        │                                        │
        ▼                                        ▼
┌───────────────────────────────┐  ┌───────────────────────────────┐
│        Admin Portal           │  │         Public Website        │
│ ┌───────────────────────────┐ │  │ ┌───────────────────────────┐ │
│ │ Vehicles & Fleet Manager  │ │  │ │ Fleet Showcase & Grid     │ │
│ │ - Direct Image Upload     │ │  │ │ - High-Res Car Imagery    │ │
│ │ - Preset Vehicle Models   │ │  │ │ - Category & Trans Filters│ │
│ │ - Rate & Spec Config      │ │  │ └─────────────┬─────────────┘ │
│ └─────────────┬─────────────┘ │  │               ▼               │
│               ▼               │  │ ┌───────────────────────────┐ │
│ ┌───────────────────────────┐ │  │ │ Booking Wizard / Drawer   │ │
│ │ Purge Demo Bookings Tool  │ │  │ │ - Dynamic Pricing calc    │ │
│ └───────────────────────────┘ │  │ │ - Instant WhatsApp Send   │ │
│                               │  │ └───────────────────────────┘ │
└───────────────────────────────┘  └───────────────────────────────┘
```

#### Data Model Enhancements
- **Vehicle Entity**:
  - `id`, `make`, `model`, `variant`, `modelYear`, `category`
  - `dailyRatePKR`, `driverDailyFeePKR`, `securityDeposit`, `extraKmRate`
  - `coverImage`, `galleryImages` (supporting both asset URLs and uploaded data URLs)
  - `opStatus` (`available`, `rented`, `maintenance`), `visibility` (`published`, `draft`)
  - `seats`, `doors`, `transmission`, `fuelType`, `hasAC`, `driverOption`
  - `features` list (e.g. "Chilled AC", "Push Start", "Sunroof", "Reverse Camera")
- **Initial Dataset**:
  - Clear out mock placeholder bookings and replace with active, pristine fleet data.
  - Retain the active demonstration booking for testing the overtime and billing calculation.
