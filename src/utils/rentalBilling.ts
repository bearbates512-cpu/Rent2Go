/**
 * Rent2Go Rental Billing & Overtime Calculations
 * Calculates trip status, remaining balance, elapsed overtime, and hourly charges.
 */

export interface OvertimeCalculation {
  isOverdue: boolean;
  overdueHours: number;
  overdueMinutes: number;
  chargeableHours: number;
  hourlyRate: number;
  overtimeCharges: number;
  baseTotal: number;
  paidAmount: number;
  remainingBaseBalance: number;
  finalTotalAmount: number;
  finalRemainingDue: number;
  statusLabel: string;
}

export interface BookingBillingInput {
  pickupDate: string; // YYYY-MM-DD
  pickupTime?: string; // HH:mm
  returnDate: string; // YYYY-MM-DD
  returnTime?: string; // HH:mm
  confirmedTotal?: number;
  estimatedTotal?: number;
  depositAmount?: number;
  totalPaidAmount?: number;
  dailyRate?: number | null;
  overtimeHourlyRate?: number;
  customOvertimeCharges?: number;
  actualReturnedAt?: string; // ISO string or undefined
  status?: string;
  tripStatus?: 'scheduled' | 'on_trip' | 'returned' | 'overdue';
}

/**
 * Calculates default hourly overtime rate from daily rental rate.
 * Pakistan standard car rental convention: 12-hour operational day basis or minimum PKR 300/hr.
 */
export function getDefaultHourlyOvertimeRate(dailyRate?: number | null): number {
  if (!dailyRate || dailyRate <= 0) return 500;
  // 12-hour operational rental day rate calculation
  const calculated = Math.round(dailyRate / 12 / 50) * 50; // round to nearest 50 PKR
  return Math.max(300, calculated);
}

/**
 * Computes billing, overtime hours, and outstanding payments.
 */
export function calculateRentalBilling(
  booking: BookingBillingInput,
  currentTimestamp: number = Date.now()
): OvertimeCalculation {
  const baseTotal = booking.confirmedTotal ?? booking.estimatedTotal ?? 0;
  const paidAmount = booking.totalPaidAmount ?? booking.depositAmount ?? 0;
  const remainingBaseBalance = Math.max(0, baseTotal - paidAmount);

  // Parse scheduled return date and time
  const returnTimeStr = booking.returnTime && booking.returnTime.includes(':')
    ? booking.returnTime
    : '18:00';
  const scheduledReturnDate = new Date(`${booking.returnDate}T${returnTimeStr}:00`);
  const scheduledReturnMs = isNaN(scheduledReturnDate.getTime())
    ? new Date(booking.returnDate).getTime()
    : scheduledReturnDate.getTime();

  // Determine the reference time to evaluate overtime
  let evaluationMs = currentTimestamp;
  if (booking.actualReturnedAt) {
    const act = new Date(booking.actualReturnedAt).getTime();
    if (!isNaN(act)) {
      evaluationMs = act;
    }
  }

  // Grace period: 30 minutes before overtime starts counting
  const GRACE_PERIOD_MS = 30 * 60 * 1000;
  const diffMs = evaluationMs - scheduledReturnMs;

  const isReturned = booking.tripStatus === 'returned' || booking.status === 'completed';
  const isOverdue = !isReturned && diffMs > GRACE_PERIOD_MS;

  let overdueHours = 0;
  let overdueMinutes = 0;
  let chargeableHours = 0;

  if (diffMs > 0 && (!isReturned || booking.actualReturnedAt)) {
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    overdueHours = Math.floor(totalMinutes / 60);
    overdueMinutes = totalMinutes % 60;

    // If beyond 30 min grace period, round up partial hours >= 20 mins
    if (diffMs > GRACE_PERIOD_MS) {
      chargeableHours = overdueHours + (overdueMinutes >= 20 ? 1 : 0);
    }
  }

  // Hourly Rate calculation
  const hourlyRate = booking.overtimeHourlyRate && booking.overtimeHourlyRate > 0
    ? booking.overtimeHourlyRate
    : getDefaultHourlyOvertimeRate(booking.dailyRate);

  // Overtime charges: either manual override or calculated
  const overtimeCharges = booking.customOvertimeCharges !== undefined
    ? booking.customOvertimeCharges
    : chargeableHours * hourlyRate;

  const finalTotalAmount = baseTotal + overtimeCharges;
  const finalRemainingDue = Math.max(0, finalTotalAmount - paidAmount);

  let statusLabel = 'On Schedule';
  if (isReturned) {
    statusLabel = 'Returned';
  } else if (isOverdue) {
    statusLabel = `${overdueHours}h ${overdueMinutes}m Overdue`;
  } else if (booking.tripStatus === 'on_trip') {
    statusLabel = 'Active On Trip';
  }

  return {
    isOverdue,
    overdueHours,
    overdueMinutes,
    chargeableHours,
    hourlyRate,
    overtimeCharges,
    baseTotal,
    paidAmount,
    remainingBaseBalance,
    finalTotalAmount,
    finalRemainingDue,
    statusLabel
  };
}
