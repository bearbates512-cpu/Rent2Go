import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Locale,
  Vehicle,
  Booking,
  BookingStatus,
  CMSPage,
  CMSSection,
  ServiceItem,
  CustomerReview,
  SiteSettings,
  Enquiry,
  AuditEvent,
  AdminRole,
  AdminUser,
  QuoteBreakdown
} from '../types/index.ts';
import {
  INITIAL_VEHICLES,
  INITIAL_BOOKINGS,
  INITIAL_SERVICES,
  INITIAL_REVIEWS,
  INITIAL_SETTINGS,
  INITIAL_CMS_PAGE,
  INITIAL_AUDIT_LOGS
} from '../data/initialData.ts';
import { generateBookingReference } from '../utils/reference.ts';
import { checkVehicleAvailability } from '../utils/availability.ts';
import { getSupabaseClient, AUTHORIZED_ADMIN_EMAIL, AUTHORIZED_ADMIN_PASSWORD } from '../utils/supabase.ts';

interface AppContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  dir: 'ltr' | 'rtl';
  currentView: string;
  setCurrentView: (v: string) => void;
  selectedCarSlug: string | null;
  setSelectedCarSlug: (slug: string | null) => void;
  selectedCarForBooking: Vehicle | null;
  setSelectedCarForBooking: (v: Vehicle | null) => void;
  vehicles: Vehicle[];
  bookings: Booking[];
  cmsPage: CMSPage;
  services: ServiceItem[];
  reviews: CustomerReview[];
  settings: SiteSettings;
  enquiries: Enquiry[];
  auditLogs: AuditEvent[];
  adminRole: AdminRole;
  setAdminRole: (r: AdminRole) => void;
  adminUser: AdminUser | null;
  isAdminAuthenticated: boolean;
  loginAdmin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => void;
  lastCreatedBooking: Booking | null;
  setLastCreatedBooking: (b: Booking | null) => void;
  announcementDismissed: boolean;
  setAnnouncementDismissed: (d: boolean) => void;
  filterCategory: string | null;
  setFilterCategory: (c: string | null) => void;
  searchDates: { pickup: string; returnDate: string; service: string };
  setSearchDates: (d: { pickup: string; returnDate: string; service: string }) => void;
  themeMode: 'light' | 'dark';
  setThemeMode: (mode: 'light' | 'dark') => void;
  toggleThemeMode: () => void;
  // Actions
  createBookingRequest: (bookingData: Partial<Booking>) => { success: boolean; booking?: Booking; error?: string };
  updateBookingStatus: (
    bookingId: string,
    newStatus: BookingStatus,
    reason?: string
  ) => { success: boolean; error?: string };
  updateBookingPayment: (
    bookingId: string,
    data: {
      confirmedTotal?: number;
      depositAmount?: number;
      totalPaidAmount?: number;
      remainingBalance?: number;
      paymentStatus?: Booking['paymentStatus'];
      tripStatus?: Booking['tripStatus'];
      actualReturnedAt?: string;
      dispatchedAt?: string;
      overtimeHourlyRate?: number;
      overtimeCharges?: number;
    }
  ) => void;
  createManualBooking: (bookingData: Partial<Booking>) => { success: boolean; booking?: Booking; error?: string };
  addVehicle: (v: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (v: Vehicle) => void;
  deleteVehicle: (id: string) => void;
  addMaintenanceBlock: (vehicleId: string, start: string, end: string, reason: string) => { success: boolean; error?: string };
  updateCMSSections: (sections: CMSSection[]) => void;
  publishCMSRevision: (note?: string) => void;
  restoreCMSRevision: (version: number) => boolean;
  updateSiteSettings: (settings: SiteSettings) => void;
  addReview: (review: Omit<CustomerReview, 'id' | 'date' | 'isApproved'>) => void;
  moderateReview: (id: string, isApproved: boolean) => void;
  submitEnquiry: (enquiry: Omit<Enquiry, 'id' | 'createdAt' | 'status'>) => void;
  convertEnquiryToBooking: (enquiryId: string) => void;
  duplicateVehicle: (id: string) => void;
  clearDemoFleet: () => void;
  clearDemoBookings: () => void;
  resetFleetToDefault: () => void;
  purgeAllDemoData: () => void;
  exportAllData: () => string;
  importAllData: (jsonStr: string) => { success: boolean; error?: string };
  resetAllData: () => void;
  navigateToCar: (slug: string) => void;
  navigateToBooking: (vehicleId?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'rent2go_v3_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    return (localStorage.getItem(`${STORAGE_KEY_PREFIX}locale`) as Locale) || 'en';
  });

  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedCarSlug, setSelectedCarSlug] = useState<string | null>(null);
  const [selectedCarForBooking, setSelectedCarForBooking] = useState<Vehicle | null>(null);
  const [lastCreatedBooking, setLastCreatedBooking] = useState<Booking | null>(null);
  const [announcementDismissed, setAnnouncementDismissed] = useState<boolean>(false);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [searchDates, setSearchDates] = useState({ pickup: '', returnDate: '', service: '' });
  const [themeMode, setThemeModeState] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}themeMode`);
    if (saved === 'dark' || saved === 'light') return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const setThemeMode = (mode: 'light' | 'dark') => {
    setThemeModeState(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}themeMode`, mode);
    }
  };

  const toggleThemeMode = () => {
    const next = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(next);
  };

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      document.body.classList.remove('dark');
    }
  }, [themeMode]);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}adminUser`);
    if (saved) {
      try {
        const u = JSON.parse(saved);
        if (u && typeof u.email === 'string' && u.email.trim().toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
          return u;
        }
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [adminRole, setAdminRoleState] = useState<AdminRole>(() => {
    if (typeof window === 'undefined') return 'staff';
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}adminUser`);
    if (saved) {
      try {
        return JSON.parse(saved).role || 'owner';
      } catch (e) {
        return 'staff';
      }
    }
    return 'staff';
  });

  const setAdminRole = (role: AdminRole) => {
    setAdminRoleState(role);
    if (adminUser) {
      const updated = { ...adminUser, role };
      setAdminUser(updated);
      localStorage.setItem(`${STORAGE_KEY_PREFIX}adminUser`, JSON.stringify(updated));
    }
  };

  const isAdminAuthenticated = Boolean(adminUser);

  const loginAdmin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      return { success: false, error: 'Please enter both email and password.' };
    }

    // STRICT SECURITY: Only bearbates512@gmail.com is allowed. No other email is permitted!
    if (cleanEmail !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
      return {
        success: false,
        error: `Access Denied: Only registered administrator (${AUTHORIZED_ADMIN_EMAIL}) is permitted.`
      };
    }

    // 1. If Supabase Auth is active and configured, attempt Supabase Auth verification
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPass
        });
        if (!error && data.user) {
          const userObj: AdminUser = {
            email: AUTHORIZED_ADMIN_EMAIL,
            role: 'owner',
            name: data.user.user_metadata?.full_name || 'Owner (Super Admin)'
          };
          setAdminUser(userObj);
          setAdminRoleState('owner');
          localStorage.setItem(`${STORAGE_KEY_PREFIX}adminUser`, JSON.stringify(userObj));
          return { success: true };
        }
      } catch (err: any) {
        console.warn('Supabase auth network attempt:', err);
      }
    }

    // 2. Strict Password Verification: only office@12 is allowed
    if (cleanPass !== AUTHORIZED_ADMIN_PASSWORD) {
      return {
        success: false,
        error: 'Invalid password. Access denied.'
      };
    }

    // Success: authenticated as Super Admin Owner
    const userObj: AdminUser = {
      email: AUTHORIZED_ADMIN_EMAIL,
      role: 'owner',
      name: 'Owner (Super Admin)'
    };
    setAdminUser(userObj);
    setAdminRoleState('owner');
    localStorage.setItem(`${STORAGE_KEY_PREFIX}adminUser`, JSON.stringify(userObj));
    return { success: true };
  };

  const logoutAdmin = () => {
    // 1. Sign out from Supabase if client is active
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        supabase.auth.signOut();
      } catch (e) {
        // ignore
      }
    }
    // 2. Completely reset in-memory state
    setAdminUser(null);
    setAdminRoleState('staff');

    // 3. Purge all stored admin keys across versions
    try {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}adminUser`);
      localStorage.removeItem('rent2go_v1_adminUser');
      localStorage.removeItem('rent2go_v2_adminUser');
      localStorage.removeItem('rent2go_adminUser');
      sessionStorage.removeItem('rent2go_adminUser');
      sessionStorage.removeItem('rent2go_admin_session');
    } catch (e) {
      // ignore
    }

    // 4. Return to home view and clear admin path from URL
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      if (path === '/admin/panel' || path === '/admin' || window.location.hash.includes('admin')) {
        window.history.pushState(null, '', '/');
      }
    }
    setCurrentView('home');
  };

  // Core Persistent State
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}vehicles`);
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}bookings`);
    if (saved) {
      try {
        const parsed: Booking[] = JSON.parse(saved);
        if (!parsed.some(b => b.id === 'bk-1004')) {
          const merged = [...parsed, ...INITIAL_BOOKINGS.filter(init => !parsed.some(p => p.id === init.id))];
          localStorage.setItem(`${STORAGE_KEY_PREFIX}bookings`, JSON.stringify(merged));
          return merged;
        }
        return parsed;
      } catch (e) {
        return INITIAL_BOOKINGS;
      }
    }
    return INITIAL_BOOKINGS;
  });

  const [cmsPage, setCmsPage] = useState<CMSPage>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}cmsPage`);
    return saved ? JSON.parse(saved) : INITIAL_CMS_PAGE;
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}services`);
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}reviews`);
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}settings`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.whatsappNumber === '923007865432' || parsed.phone === '03007865432') {
          const updated = {
            ...parsed,
            phone: '03271126457',
            phoneFormatted: '+92 327 1126457',
            whatsappNumber: '923271126457'
          };
          localStorage.setItem(`${STORAGE_KEY_PREFIX}settings`, JSON.stringify(updated));
          return updated;
        }
        return parsed;
      } catch (e) {
        return INITIAL_SETTINGS;
      }
    }
    return INITIAL_SETTINGS;
  });

  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}enquiries`);
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'enq-1',
            name: 'Malik Jahangir',
            phone: '+92 300 9988776',
            email: 'jahangir.cotton@gmail.com',
            service: 'Wedding & Event Luxury Fleet',
            message: 'Need 2 Fortuners and 1 Civic for 15th November wedding convoy in Sadiqabad.',
            status: 'new',
            createdAt: '2026-10-19T16:20:00Z',
            notes: 'Follow up on rates'
          }
        ];
  });

  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}auditLogs`);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}locale`, locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ur' ? 'rtl' : 'ltr';
  }, [locale]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}vehicles`, JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}bookings`, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}cmsPage`, JSON.stringify(cmsPage));
  }, [cmsPage]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}services`, JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}reviews`, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}settings`, JSON.stringify(settings));
    // Apply dynamic theme color tokens to CSS variables
    document.documentElement.style.setProperty('--color-primary', settings.themeTokens.primaryColor);
    document.documentElement.style.setProperty('--color-accent', settings.themeTokens.accentColor);
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}enquiries`, JSON.stringify(enquiries));
  }, [enquiries]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}auditLogs`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
  };

  const dir = locale === 'ur' ? 'rtl' : 'ltr';

  const logAudit = (module: string, action: string, details: string) => {
    const newLog: AuditEvent = {
      id: `aud-${Date.now()}`,
      actor: `Admin (${adminRole})`,
      role: adminRole,
      module,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Create public booking request
  const createBookingRequest = (bookingData: Partial<Booking>) => {
    const reference = generateBookingReference();
    const newId = `bk-${Date.now()}`;
    const now = new Date().toISOString();

    const newBooking: Booking = {
      id: newId,
      reference,
      customerId: `cust-${Date.now()}`,
      customerName: bookingData.customerName || 'Customer',
      customerPhone: bookingData.customerPhone || '',
      customerEmail: bookingData.customerEmail,
      preferredContact: bookingData.preferredContact || 'whatsapp',
      vehicleId: bookingData.vehicleId || null,
      vehicleName: bookingData.vehicleName || 'Vehicle',
      serviceId: bookingData.serviceId,
      status: 'pending',
      source: 'website',
      rentalType: bookingData.rentalType || 'daily',
      driverOption: bookingData.driverOption || 'with_driver',
      pickupDate: bookingData.pickupDate || '',
      pickupTime: bookingData.pickupTime || '09:00',
      returnDate: bookingData.returnDate || '',
      returnTime: bookingData.returnTime || '09:00',
      pickupLocation: bookingData.pickupLocation || 'Sadiqabad',
      destination: bookingData.destination || 'Sadiqabad',
      dropoffLocation: bookingData.dropoffLocation,
      passengers: bookingData.passengers || 1,
      customerNotes: bookingData.customerNotes || '',
      estimate: bookingData.estimate as QuoteBreakdown,
      paymentStatus: 'unpaid',
      createdAt: now,
      updatedAt: now,
      statusHistory: [
        {
          fromStatus: null,
          toStatus: 'pending',
          changedAt: now,
          changedBy: 'Customer (Online Request)'
        }
      ]
    };

    setBookings(prev => [newBooking, ...prev]);
    setLastCreatedBooking(newBooking);
    logAudit('Bookings', 'New Online Request', `Received booking request ${reference} for ${newBooking.vehicleName}`);
    return { success: true, booking: newBooking };
  };

  // Create manual booking by Admin
  const createManualBooking = (bookingData: Partial<Booking>) => {
    const reference = generateBookingReference();
    const newId = `bk-${Date.now()}`;
    const now = new Date().toISOString();

    // Check availability if confirming immediately
    if (bookingData.status === 'confirmed' && bookingData.vehicleId) {
      const veh = vehicles.find(v => v.id === bookingData.vehicleId);
      if (veh) {
        const avail = checkVehicleAvailability(
          veh,
          bookings,
          `${bookingData.pickupDate}T${bookingData.pickupTime || '09:00'}:00Z`,
          `${bookingData.returnDate}T${bookingData.returnTime || '09:00'}:00Z`
        );
        if (!avail.isAvailable) {
          return { success: false, error: avail.reason || 'Conflict detected: Vehicle already booked' };
        }
      }
    }

    const newBooking: Booking = {
      id: newId,
      reference,
      customerId: `cust-${Date.now()}`,
      customerName: bookingData.customerName || 'Customer',
      customerPhone: bookingData.customerPhone || '',
      customerEmail: bookingData.customerEmail,
      preferredContact: (bookingData.preferredContact === 'whatsapp' || bookingData.preferredContact === 'email') ? bookingData.preferredContact : 'call',
      vehicleId: bookingData.vehicleId || null,
      vehicleName: bookingData.vehicleName || 'Vehicle',
      status: bookingData.status || 'confirmed',
      source: bookingData.source || 'phone',
      rentalType: bookingData.rentalType || 'daily',
      driverOption: bookingData.driverOption || 'with_driver',
      pickupDate: bookingData.pickupDate || '',
      pickupTime: bookingData.pickupTime || '09:00',
      returnDate: bookingData.returnDate || '',
      returnTime: bookingData.returnTime || '09:00',
      pickupLocation: bookingData.pickupLocation || 'Sadiqabad',
      destination: bookingData.destination || 'Sadiqabad',
      passengers: bookingData.passengers || 1,
      customerNotes: bookingData.customerNotes || '',
      internalNotes: bookingData.internalNotes || '',
      estimate: bookingData.estimate as QuoteBreakdown,
      confirmedTotal: bookingData.confirmedTotal,
      depositAmount: bookingData.depositAmount || 0,
      paymentStatus: bookingData.paymentStatus || 'unpaid',
      assignedTo: bookingData.assignedTo,
      createdAt: now,
      updatedAt: now,
      statusHistory: [
        {
          fromStatus: null,
          toStatus: bookingData.status || 'confirmed',
          changedAt: now,
          changedBy: `Admin (${adminRole})`
        }
      ]
    };

    setBookings(prev => [newBooking, ...prev]);
    logAudit('Bookings', 'Manual Booking Created', `Admin created ${reference} (${newBooking.status})`);
    return { success: true, booking: newBooking };
  };

  // Update Booking Status with Server-Level Double Booking Guard
  const updateBookingStatus = (
    bookingId: string,
    newStatus: BookingStatus,
    reason?: string
  ): { success: boolean; error?: string } => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return { success: false, error: 'Booking not found' };

    // If moving to 'confirmed', run availability conflict check against other confirmed bookings and maintenance!
    if (newStatus === 'confirmed' && booking.vehicleId) {
      const veh = vehicles.find(v => v.id === booking.vehicleId);
      if (veh) {
        const check = checkVehicleAvailability(
          veh,
          bookings,
          `${booking.pickupDate}T${booking.pickupTime || '09:00'}:00Z`,
          `${booking.returnDate}T${booking.returnTime || '09:00'}:00Z`,
          booking.id // Exclude self
        );

        if (!check.isAvailable) {
          return {
            success: false,
            error: `Cannot confirm booking: ${check.reason || 'Overlapping confirmed booking exists for this vehicle.'}`
          };
        }
      }
    }

    const now = new Date().toISOString();
    const historyItem = {
      fromStatus: booking.status,
      toStatus: newStatus,
      changedAt: now,
      changedBy: `Admin (${adminRole})`,
      reason: reason || ''
    };

    setBookings(prev =>
      prev.map(b => {
        if (b.id !== bookingId) return b;
        return {
          ...b,
          status: newStatus,
          cancelReason: newStatus === 'cancelled' || newStatus === 'rejected' ? reason : b.cancelReason,
          updatedAt: now,
          statusHistory: [historyItem, ...b.statusHistory]
        };
      })
    );

    logAudit('Bookings', `Status: ${newStatus.toUpperCase()}`, `Booking ${booking.reference} updated to ${newStatus}${reason ? ` (${reason})` : ''}`);
    return { success: true };
  };

  const updateBookingPayment = (
    bookingId: string,
    data: {
      confirmedTotal?: number;
      depositAmount?: number;
      totalPaidAmount?: number;
      remainingBalance?: number;
      paymentStatus?: Booking['paymentStatus'];
      tripStatus?: Booking['tripStatus'];
      actualReturnedAt?: string;
      dispatchedAt?: string;
      overtimeHourlyRate?: number;
      overtimeCharges?: number;
    }
  ) => {
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, ...data, updatedAt: new Date().toISOString() } : b))
    );
    logAudit('Bookings', 'Payment & Trip Settlement', `Booking ID ${bookingId} updated`);
  };

  // Vehicle Fleet CRUD
  const addVehicle = (v: Omit<Vehicle, 'id'>) => {
    const newVehicle: Vehicle = {
      ...v,
      id: `veh-${Date.now()}`
    };
    setVehicles(prev => [newVehicle, ...prev]);
    logAudit('Vehicles', 'Add Vehicle', `Added vehicle ${newVehicle.make} ${newVehicle.model} (${newVehicle.stockCode})`);
  };

  const updateVehicle = (v: Vehicle) => {
    setVehicles(prev => prev.map(item => (item.id === v.id ? v : item)));
    logAudit('Vehicles', 'Update Vehicle', `Updated ${v.make} ${v.model}`);
  };

  const deleteVehicle = (id: string) => {
    const v = vehicles.find(item => item.id === id);
    setVehicles(prev => prev.filter(item => item.id !== id));
    logAudit('Vehicles', 'Delete Vehicle', `Removed ${v?.make} ${v?.model}`);
  };

  const addMaintenanceBlock = (vehicleId: string, start: string, end: string, reason: string) => {
    const veh = vehicles.find(v => v.id === vehicleId);
    if (!veh) return { success: false, error: 'Vehicle not found' };

    // Check if any confirmed booking conflicts
    const reqStart = new Date(start).getTime();
    const reqEnd = new Date(end).getTime();

    for (const b of bookings) {
      if (b.vehicleId === vehicleId && b.status === 'confirmed') {
        const bStart = new Date(`${b.pickupDate}T${b.pickupTime || '09:00'}:00`).getTime();
        const bEnd = new Date(`${b.returnDate}T${b.returnTime || '09:00'}:00`).getTime();
        if (reqStart < bEnd && reqEnd > bStart) {
          return {
            success: false,
            error: `Cannot schedule maintenance: Conflicted with confirmed booking ${b.reference}`
          };
        }
      }
    }

    const newWindow = {
      id: `maint-${Date.now()}`,
      start,
      end,
      reason
    };

    setVehicles(prev =>
      prev.map(v => {
        if (v.id !== vehicleId) return v;
        return {
          ...v,
          maintenanceWindows: [...v.maintenanceWindows, newWindow]
        };
      })
    );

    logAudit('Vehicles', 'Maintenance Scheduled', `Maintenance scheduled for ${veh.make} ${veh.model}: ${reason}`);
    return { success: true };
  };

  // CMS Section & Revision Manager
  const updateCMSSections = (sections: CMSSection[]) => {
    setCmsPage(prev => ({
      ...prev,
      sections
    }));
  };

  const publishCMSRevision = (note: string = 'Content updated') => {
    const now = new Date().toISOString();
    setCmsPage(prev => {
      const nextVersion = prev.version + 1;
      const historyRecord = {
        version: prev.version,
        savedAt: now,
        savedBy: `Admin (${adminRole})`,
        note,
        sections: [...prev.sections]
      };
      const updatedHistory = prev.history ? [historyRecord, ...prev.history] : [historyRecord];

      return {
        ...prev,
        version: nextVersion,
        publishedAt: now,
        history: updatedHistory
      };
    });

    logAudit('CMS Engine', 'Published Revision', `CMS published version ${cmsPage.version + 1}: ${note}`);
  };

  const restoreCMSRevision = (versionToRestore: number): boolean => {
    if (!cmsPage.history) return false;
    const target = cmsPage.history.find(h => h.version === versionToRestore);
    if (!target) return false;

    const now = new Date().toISOString();
    const historyRecord = {
      version: cmsPage.version,
      savedAt: now,
      savedBy: `Admin (${adminRole})`,
      note: `Before rollback to v${versionToRestore}`,
      sections: [...cmsPage.sections]
    };

    setCmsPage(prev => ({
      ...prev,
      version: prev.version + 1,
      publishedAt: now,
      sections: [...target.sections],
      history: [historyRecord, ...(prev.history || [])]
    }));

    logAudit('CMS Engine', 'Rollback Revision', `Rolled back CMS content to version ${versionToRestore}`);
    return true;
  };

  const updateSiteSettings = (newSettings: SiteSettings) => {
    setSettings(newSettings);
    logAudit('Settings', 'Updated Settings', 'Site settings and business profile updated');
  };

  const addReview = (review: Omit<CustomerReview, 'id' | 'date' | 'isApproved'>) => {
    const newRev: CustomerReview = {
      ...review,
      id: `rev-${Date.now()}`,
      date: 'Just now',
      isApproved: true
    };
    setReviews(prev => [newRev, ...prev]);
    logAudit('Reviews', 'Review Added', `New review added by ${newRev.name}`);
  };

  const moderateReview = (id: string, isApproved: boolean) => {
    setReviews(prev => prev.map(r => (r.id === id ? { ...r, isApproved } : r)));
    logAudit('Reviews', 'Review Moderated', `Review ${id} status set to ${isApproved ? 'Approved' : 'Hidden'}`);
  };

  const submitEnquiry = (enquiryData: Omit<Enquiry, 'id' | 'createdAt' | 'status'>) => {
    const newEnq: Enquiry = {
      ...enquiryData,
      id: `enq-${Date.now()}`,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    setEnquiries(prev => [newEnq, ...prev]);
    logAudit('Enquiries', 'New Contact Message', `Received message from ${newEnq.name} (${newEnq.phone})`);
  };

  const convertEnquiryToBooking = (enquiryId: string) => {
    const enq = enquiries.find(e => e.id === enquiryId);
    if (!enq) return;

    createBookingRequest({
      customerName: enq.name,
      customerPhone: enq.phone,
      customerEmail: enq.email,
      customerNotes: `Enquiry message: ${enq.message}`,
      source: 'website'
    });

    setEnquiries(prev => prev.map(e => (e.id === enquiryId ? { ...e, status: 'converted' } : e)));
    logAudit('Enquiries', 'Converted to Booking', `Enquiry ${enquiryId} converted to booking`);
  };

  const duplicateVehicle = (id: string) => {
    const existing = vehicles.find(v => v.id === id);
    if (!existing) return;
    const newId = `veh-${Date.now()}`;
    const duplicated: Vehicle = {
      ...existing,
      id: newId,
      stockCode: `${existing.stockCode}-COPY`,
      slug: `${existing.slug}-copy-${Date.now().toString().slice(-4)}`,
      title: {
        en: `${existing.title.en} (Copy)`,
        ur: `${existing.title.ur} (کاپی)`
      },
      customFields: {
        ...existing.customFields,
        registrationNumber: existing.customFields?.registrationNumber ? `${existing.customFields.registrationNumber}-B` : undefined
      },
      maintenanceWindows: []
    };
    setVehicles(prev => [duplicated, ...prev]);
    logAudit('Fleet', 'Duplicate Vehicle', `Cloned vehicle ${existing.make} ${existing.model} as ${duplicated.stockCode}`);
  };

  const clearDemoFleet = () => {
    setVehicles([]);
    logAudit('Fleet', 'Clear Fleet', 'Admin cleared all vehicle records to begin with empty real fleet.');
  };

  const resetFleetToDefault = () => {
    setVehicles(INITIAL_VEHICLES);
    logAudit('Fleet', 'Reset Fleet', 'Admin reset fleet to new 8-car high-definition inventory.');
  };

  const clearDemoBookings = () => {
    setBookings([]);
    logAudit('Bookings', 'Clear Bookings', 'Admin wiped booking history.');
  };

  const purgeAllDemoData = () => {
    setBookings([]);
    setEnquiries([]);
    logAudit('System', 'Purge Demo Records', 'Admin cleared all demo bookings and incoming inquiries.');
  };

  const exportAllData = (): string => {
    const exportPayload = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      data: {
        vehicles,
        bookings,
        cmsPage,
        services,
        reviews,
        settings,
        enquiries
      }
    };
    return JSON.stringify(exportPayload, null, 2);
  };

  const importAllData = (jsonStr: string): { success: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(jsonStr);
      const data = parsed.data || parsed;
      if (data.vehicles && Array.isArray(data.vehicles)) setVehicles(data.vehicles);
      if (data.bookings && Array.isArray(data.bookings)) setBookings(data.bookings);
      if (data.cmsPage) setCmsPage(data.cmsPage);
      if (data.services && Array.isArray(data.services)) setServices(data.services);
      if (data.reviews && Array.isArray(data.reviews)) setReviews(data.reviews);
      if (data.settings) setSettings(data.settings);
      if (data.enquiries && Array.isArray(data.enquiries)) setEnquiries(data.enquiries);
      logAudit('System', 'Import Backup', 'Successfully restored system data from backup JSON.');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Invalid JSON format' };
    }
  };

  const resetAllData = () => {
    setVehicles(INITIAL_VEHICLES);
    setBookings(INITIAL_BOOKINGS);
    setCmsPage(INITIAL_CMS_PAGE);
    setServices(INITIAL_SERVICES);
    setReviews(INITIAL_REVIEWS);
    setSettings(INITIAL_SETTINGS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    localStorage.clear();
    logAudit('System', 'Reset Defaults', 'Reset entire database back to default Sadiqabad seed data.');
  };

  const navigateToCar = (slug: string) => {
    setSelectedCarSlug(slug);
    setCurrentView('car-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToBooking = (vehicleId?: string) => {
    if (vehicleId) {
      const v = vehicles.find(item => item.id === vehicleId);
      setSelectedCarForBooking(v || null);
    } else {
      setSelectedCarForBooking(null);
    }
    setCurrentView('book');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppContext.Provider
      value={{
        locale,
        setLocale,
        dir,
        currentView,
        setCurrentView,
        selectedCarSlug,
        setSelectedCarSlug,
        selectedCarForBooking,
        setSelectedCarForBooking,
        vehicles,
        bookings,
        cmsPage,
        services,
        reviews,
        settings,
        enquiries,
        auditLogs,
        adminRole,
        setAdminRole,
        adminUser,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        lastCreatedBooking,
        setLastCreatedBooking,
        announcementDismissed,
        setAnnouncementDismissed,
        filterCategory,
        setFilterCategory,
        searchDates,
        setSearchDates,
        themeMode,
        setThemeMode,
        toggleThemeMode,
        createBookingRequest,
        updateBookingStatus,
        updateBookingPayment,
        createManualBooking,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        addMaintenanceBlock,
        updateCMSSections,
        publishCMSRevision,
        restoreCMSRevision,
        updateSiteSettings,
        addReview,
        moderateReview,
        submitEnquiry,
        convertEnquiryToBooking,
        duplicateVehicle,
        clearDemoFleet,
        clearDemoBookings,
        resetFleetToDefault,
        purgeAllDemoData,
        exportAllData,
        importAllData,
        resetAllData,
        navigateToCar,
        navigateToBooking
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
