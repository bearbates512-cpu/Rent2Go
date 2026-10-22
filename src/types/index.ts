/**
 * Rent2Go Domain & Application Types
 * Based on 01_PRD_Rent2Go, 02_TRD_Rent2Go, and 05_Backend_Schema_Rent2Go
 */

export type Locale = 'en' | 'ur';

export type TranslatableString = {
  en: string;
  ur: string;
};

export type VehicleCategory = 'sedan' | 'suv' | 'hatchback' | 'van' | 'luxury';
export type TransmissionType = 'automatic' | 'manual';
export type DriverOption = 'with_driver' | 'self_drive' | 'both';
export type VehicleVisibility = 'published' | 'draft' | 'hidden';
export type VehicleOpStatus = 'available' | 'temporarily_unavailable' | 'maintenance';

export interface Vehicle {
  id: string;
  stockCode: string;
  slug: string;
  make: string;
  model: string;
  variant?: string;
  modelYear: number;
  category: VehicleCategory;
  title: TranslatableString;
  description: TranslatableString;
  seats: number;
  doors: number;
  transmission: TransmissionType;
  fuelType: 'petrol' | 'diesel' | 'hybrid' | 'electric';
  hasAC: boolean;
  driverOption: DriverOption;
  features: string[];
  customFields: {
    registrationNumber?: string;
    odometerKm?: number;
    gpsTrackerInstalled?: boolean;
    insuranceExpiry?: string;
    mileageLimitPerDay?: string;
    extraKmRate?: number;
    securityDeposit?: number;
    luggageBags?: number;
    [key: string]: any;
  };
  dailyRatePKR: number | null; // null represents "Contact for quote"
  driverDailyFeePKR: number;
  visibility: VehicleVisibility;
  opStatus: VehicleOpStatus;
  isFeatured: boolean;
  featuredOrder?: number;
  coverImage: string;
  galleryImages: string[];
  maintenanceWindows: {
    id: string;
    start: string; // ISO string
    end: string;
    reason: string;
  }[];
}

export type RentalType = 'daily' | 'hourly' | 'one_way' | 'round_trip' | 'weekly' | 'monthly' | 'wedding_event';

export type BookingStatus =
  | 'pending'
  | 'need_more_info'
  | 'confirmed'
  | 'rejected'
  | 'cancelled'
  | 'completed'
  | 'no_show';

export type BookingSource = 'website' | 'whatsapp' | 'phone' | 'walk_in';

export interface QuoteBreakdown {
  rentalDays: number;
  baseRatePerDay: number | null;
  baseTotal: number | null;
  driverFeePerDay: number;
  driverTotal: number;
  securityDeposit: number;
  estimatedTotal: number | null;
  needsQuote: boolean;
  currency: string;
  inclusions: string[];
  exclusions: string[];
}

export interface Booking {
  id: string;
  reference: string; // e.g. R2G-7K3M9QXA
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  preferredContact: 'whatsapp' | 'call' | 'email';
  vehicleId: string | null;
  vehicleName: string;
  serviceId?: string;
  status: BookingStatus;
  source: BookingSource;
  rentalType: RentalType;
  driverOption: 'with_driver' | 'self_drive';
  pickupDate: string; // YYYY-MM-DD
  pickupTime: string; // HH:mm
  returnDate: string;
  returnTime: string;
  pickupLocation: string;
  destination: string;
  dropoffLocation?: string;
  passengers: number;
  customerNotes?: string;
  internalNotes?: string;
  cancelReason?: string;
  estimate: QuoteBreakdown;
  confirmedTotal?: number;
  depositAmount?: number;
  totalPaidAmount?: number;
  remainingBalance?: number;
  paymentStatus: 'unpaid' | 'deposit_requested' | 'deposit_received' | 'paid' | 'refunded';
  tripStatus?: 'scheduled' | 'on_trip' | 'returned' | 'overdue';
  dispatchedAt?: string;
  actualReturnedAt?: string;
  overtimeHourlyRate?: number;
  overtimeCharges?: number;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: {
    fromStatus: BookingStatus | null;
    toStatus: BookingStatus;
    changedAt: string;
    changedBy: string;
    reason?: string;
  }[];
}

export type CMSBlockType =
  | 'hero'
  | 'quick_search'
  | 'featured_cars'
  | 'services_list'
  | 'why_us'
  | 'how_it_works'
  | 'reviews'
  | 'faq'
  | 'service_areas'
  | 'cta_banner';

export interface CMSSection {
  id: string;
  blockType: CMSBlockType;
  title: TranslatableString;
  subtitle?: TranslatableString;
  props: Record<string, any>;
  isVisible: boolean;
  sortOrder: number;
}

export interface CMSPage {
  id: string;
  slug: string;
  title: TranslatableString;
  isCustom: boolean;
  seo: {
    title: TranslatableString;
    description: TranslatableString;
  };
  sections: CMSSection[];
  version: number;
  publishedAt?: string;
  history?: {
    version: number;
    savedAt: string;
    savedBy: string;
    note: string;
    sections: CMSSection[];
  }[];
}

export interface ServiceItem {
  id: string;
  slug: string;
  name: TranslatableString;
  shortDesc: TranslatableString;
  description: TranslatableString;
  inclusions: TranslatableString[];
  exclusions: TranslatableString[];
  icon: string;
  image: string;
  isEnabled: boolean;
  startingPricePKR?: number;
}

export interface CustomerReview {
  id: string;
  name: string;
  rating: number; // 1-5
  comment: TranslatableString;
  trip: TranslatableString;
  vehicleName?: string;
  date: string;
  isApproved: boolean;
  source: string;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  service?: string;
  message: string;
  status: 'new' | 'contacted' | 'converted' | 'closed';
  createdAt: string;
  notes?: string;
}

export interface SiteSettings {
  businessName: TranslatableString;
  tagline: TranslatableString;
  phone: string;
  phoneFormatted: string;
  whatsappNumber: string;
  email: string;
  address: TranslatableString;
  city: string;
  businessHours: TranslatableString;
  whatsappMessageTemplate: string;
  announcementBar: {
    enabled: boolean;
    text: TranslatableString;
    linkUrl?: string;
  };
  features: {
    selfDriveEnabled: boolean;
    hourlyRentalEnabled: boolean;
    floatingWhatsAppEnabled: boolean;
    reviewsSectionEnabled: boolean;
  };
  themeTokens: {
    primaryColor: string;
    primaryHover: string;
    accentColor: string;
    surfaceColor: string;
    borderRadius: string;
  };
}

export interface AuditEvent {
  id: string;
  actor: string;
  role: string;
  module: string;
  action: string;
  details: string;
  timestamp: string;
}

export type AdminRole = 'owner' | 'admin' | 'manager' | 'staff' | 'content_editor';

export interface AdminUser {
  email: string;
  role: AdminRole;
  name: string;
}

export interface NavigationItem {
  id: string;
  menu: 'header' | 'footer';
  label: TranslatableString;
  targetView: string; // view id or custom page slug
  isCustomUrl?: boolean;
  url?: string;
  isVisible: boolean;
  sortOrder: number;
}

export interface TranslationItem {
  id: string;
  key: string;
  category: string;
  en: string;
  ur: string;
}

export interface MediaAsset {
  id: string;
  title: string;
  url: string;
  altText: TranslatableString;
  category: 'cars' | 'banners' | 'drivers' | 'general';
  sizeKB: number;
  uploadedAt: string;
}

export interface FormFieldConfig {
  id: string;
  fieldKey: string;
  formType: 'booking' | 'contact';
  label: TranslatableString;
  fieldType: 'text' | 'phone' | 'date' | 'time' | 'select' | 'textarea';
  isRequired: boolean;
  isVisible: boolean;
  isCore: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
  lastLogin: string;
}

