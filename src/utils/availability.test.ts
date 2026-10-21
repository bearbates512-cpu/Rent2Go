import test from 'node:test';
import assert from 'node:assert/strict';
import { checkVehicleAvailability } from './availability.ts';
import { Vehicle, Booking } from '../types/index.ts';

const mockVehicle: Vehicle = {
  id: 'v-1',
  stockCode: 'R2G-COROLLA-01',
  slug: 'toyota-corolla-gli',
  make: 'Toyota',
  model: 'Corolla GLi',
  modelYear: 2023,
  category: 'sedan',
  title: { en: 'Toyota Corolla GLi', ur: 'ٹویوٹا کرولا جی ایل آئی' },
  description: { en: 'Reliable sedan', ur: 'آرام دہ سیڈان' },
  seats: 5,
  doors: 4,
  transmission: 'automatic',
  fuelType: 'petrol',
  hasAC: true,
  driverOption: 'both',
  features: ['Dual AC', 'ABS', 'Bluetooth'],
  customFields: {},
  dailyRatePKR: 6000,
  driverDailyFeePKR: 1500,
  visibility: 'published',
  opStatus: 'available',
  isFeatured: true,
  coverImage: '',
  galleryImages: [],
  maintenanceWindows: [
    {
      id: 'm-1',
      start: '2026-11-10T00:00:00Z',
      end: '2026-11-12T23:59:59Z',
      reason: 'Scheduled brake overhaul'
    }
  ]
};

const mockBookings: Booking[] = [
  {
    id: 'b-1',
    reference: 'R2G-AB12CD34',
    customerId: 'c-1',
    customerName: 'Ahmad Khan',
    customerPhone: '+923001234567',
    preferredContact: 'whatsapp',
    vehicleId: 'v-1',
    vehicleName: 'Toyota Corolla GLi',
    status: 'confirmed',
    source: 'website',
    rentalType: 'daily',
    driverOption: 'with_driver',
    pickupDate: '2026-11-01',
    pickupTime: '10:00',
    returnDate: '2026-11-04',
    returnTime: '18:00',
    pickupLocation: 'Sadiqabad',
    destination: 'Rahim Yar Khan',
    passengers: 3,
    estimate: {} as any,
    paymentStatus: 'paid',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    statusHistory: []
  },
  {
    id: 'b-2',
    reference: 'R2G-XX99YY88',
    customerId: 'c-2',
    customerName: 'Pending User',
    customerPhone: '+923011112222',
    preferredContact: 'call',
    vehicleId: 'v-1',
    vehicleName: 'Toyota Corolla GLi',
    status: 'pending', // Pending does not hard block
    source: 'website',
    rentalType: 'daily',
    driverOption: 'with_driver',
    pickupDate: '2026-11-05',
    pickupTime: '10:00',
    returnDate: '2026-11-07',
    returnTime: '10:00',
    pickupLocation: 'Sadiqabad',
    destination: 'Sukkur',
    passengers: 2,
    estimate: {} as any,
    paymentStatus: 'unpaid',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    statusHistory: []
  }
];

test('detects conflict with confirmed booking', () => {
  const res = checkVehicleAvailability(
    mockVehicle,
    mockBookings,
    '2026-11-02T09:00:00Z',
    '2026-11-03T09:00:00Z'
  );
  assert.equal(res.isAvailable, false);
  assert.match(res.reason || '', /confirmed booking/);
});

test('allows booking outside confirmed dates even if pending exists', () => {
  const res = checkVehicleAvailability(
    mockVehicle,
    mockBookings,
    '2026-11-05T12:00:00Z',
    '2026-11-06T12:00:00Z'
  );
  assert.equal(res.isAvailable, true);
});

test('detects conflict with maintenance window', () => {
  const res = checkVehicleAvailability(
    mockVehicle,
    mockBookings,
    '2026-11-11T10:00:00Z',
    '2026-11-12T10:00:00Z'
  );
  assert.equal(res.isAvailable, false);
  assert.match(res.reason || '', /maintenance/);
});

test('rejects draft or maintenance vehicles', () => {
  const draftVehicle = { ...mockVehicle, visibility: 'draft' as const };
  const res = checkVehicleAvailability(draftVehicle, mockBookings, '2026-12-01T00:00:00Z', '2026-12-02T00:00:00Z');
  assert.equal(res.isAvailable, false);
});
