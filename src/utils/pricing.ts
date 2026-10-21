import { QuoteBreakdown, RentalType } from '../types/index.ts';

export interface PricingInput {
  dailyRatePKR: number | null;
  driverDailyFeePKR?: number;
  driverOption: 'with_driver' | 'self_drive';
  pickupDate: string; // YYYY-MM-DD
  pickupTime: string; // HH:mm
  returnDate: string; // YYYY-MM-DD
  returnTime: string; // HH:mm
  rentalType?: RentalType;
  customDeposit?: number;
}

export function calculateDays(
  pickupDate: string,
  pickupTime: string,
  returnDate: string,
  returnTime: string
): number {
  if (!pickupDate || !returnDate) return 1;

  const start = new Date(`${pickupDate}T${pickupTime || '09:00'}:00`);
  const end = new Date(`${returnDate}T${returnTime || '09:00'}:00`);

  const diffMs = end.getTime() - start.getTime();
  if (diffMs <= 0) return 1;

  const hours = diffMs / (1000 * 60 * 60);
  // Full 24-hour cycles. If extra hours exceed 2 hours grace period, count another day.
  const fullDays = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  let totalDays = fullDays;
  if (remainingHours > 2 || fullDays === 0) {
    totalDays += 1;
  }

  return Math.max(1, totalDays);
}

export function calculateQuote(input: PricingInput): QuoteBreakdown {
  const days = calculateDays(
    input.pickupDate,
    input.pickupTime,
    input.returnDate,
    input.returnTime
  );

  const baseRate = input.dailyRatePKR;
  const driverFeePerDay = input.driverOption === 'with_driver' ? (input.driverDailyFeePKR ?? 1500) : 0;
  const securityDeposit = input.driverOption === 'self_drive' ? (input.customDeposit ?? 10000) : 0;

  if (baseRate === null || baseRate === undefined) {
    return {
      rentalDays: days,
      baseRatePerDay: null,
      baseTotal: null,
      driverFeePerDay,
      driverTotal: driverFeePerDay * days,
      securityDeposit,
      estimatedTotal: null,
      needsQuote: true,
      currency: 'PKR',
      inclusions: [
        'Clean & inspected vehicle',
        '24/7 Sadiqabad local roadside assistance',
        input.driverOption === 'with_driver' ? 'Experienced local verified driver' : 'Self-drive allowance'
      ],
      exclusions: [
        'Fuel (tank-to-tank policy)',
        'Motorway / M-5 toll taxes & parking fees',
        'Overtime beyond agreed dropoff window'
      ]
    };
  }

  const baseTotal = baseRate * days;
  const driverTotal = driverFeePerDay * days;
  const estimatedTotal = baseTotal + driverTotal;

  return {
    rentalDays: days,
    baseRatePerDay: baseRate,
    baseTotal,
    driverFeePerDay,
    driverTotal,
    securityDeposit,
    estimatedTotal,
    needsQuote: false,
    currency: 'PKR',
    inclusions: [
      'Clean & inspected vehicle',
      '24/7 Sadiqabad local roadside assistance',
      input.driverOption === 'with_driver' ? 'Experienced local verified driver' : 'Self-drive authorization'
    ],
    exclusions: [
      'Fuel (tank-to-tank policy)',
      'Motorway / M-5 toll taxes & parking fees',
      'Overtime beyond agreed dropoff window'
    ]
  };
}
