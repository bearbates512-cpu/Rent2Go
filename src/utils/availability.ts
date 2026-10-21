import { Booking, Vehicle } from '../types/index.ts';

export interface AvailabilityResult {
  isAvailable: boolean;
  reason?: string;
  conflictingBookingId?: string;
}

export function checkVehicleAvailability(
  vehicle: Vehicle,
  allBookings: Booking[],
  startDateStr: string,
  endDateStr: string,
  excludeBookingId?: string
): AvailabilityResult {
  if (vehicle.visibility !== 'published') {
    return { isAvailable: false, reason: 'Vehicle is currently not published' };
  }

  if (vehicle.opStatus === 'maintenance') {
    return { isAvailable: false, reason: 'Vehicle is currently in scheduled maintenance' };
  }

  if (vehicle.opStatus === 'temporarily_unavailable') {
    return { isAvailable: false, reason: 'Vehicle is temporarily unavailable' };
  }

  const reqStart = new Date(startDateStr).getTime();
  const reqEnd = new Date(endDateStr).getTime();

  if (isNaN(reqStart) || isNaN(reqEnd) || reqEnd <= reqStart) {
    return { isAvailable: false, reason: 'Invalid date range specified' };
  }

  // Check maintenance windows
  if (vehicle.maintenanceWindows && vehicle.maintenanceWindows.length > 0) {
    for (const win of vehicle.maintenanceWindows) {
      const winStart = new Date(win.start).getTime();
      const winEnd = new Date(win.end).getTime();

      // Overlap condition: reqStart < winEnd && reqEnd > winStart
      if (reqStart < winEnd && reqEnd > winStart) {
        return {
          isAvailable: false,
          reason: `Vehicle in scheduled maintenance (${win.reason || 'Service'})`
        };
      }
    }
  }

  // Check confirmed bookings for this vehicle
  for (const b of allBookings) {
    if (b.vehicleId !== vehicle.id) continue;
    if (excludeBookingId && b.id === excludeBookingId) continue;
    // Only 'confirmed' bookings hard-block (per PRD Section 6.1)
    if (b.status !== 'confirmed') continue;

    const bStart = new Date(`${b.pickupDate}T${b.pickupTime || '09:00'}:00`).getTime();
    const bEnd = new Date(`${b.returnDate}T${b.returnTime || '09:00'}:00`).getTime();

    if (reqStart < bEnd && reqEnd > bStart) {
      return {
        isAvailable: false,
        reason: `Vehicle has a confirmed booking (${b.reference}) during these dates`,
        conflictingBookingId: b.id
      };
    }
  }

  return { isAvailable: true };
}
