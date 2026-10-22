import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateRentalBilling, getDefaultHourlyOvertimeRate } from './rentalBilling.ts';

test('getDefaultHourlyOvertimeRate computes reasonable rate based on daily rent', () => {
  // Daily rent 6000 PKR / 12 = 500 PKR/hr
  assert.equal(getDefaultHourlyOvertimeRate(6000), 500);
  // Daily rent 18000 PKR / 12 = 1500 PKR/hr
  assert.equal(getDefaultHourlyOvertimeRate(18000), 1500);
  // Default fallback for small or null daily rate is minimum 300 PKR/hr
  assert.equal(getDefaultHourlyOvertimeRate(null), 500);
  assert.equal(getDefaultHourlyOvertimeRate(2000), 300);
});

test('calculateRentalBilling computes remaining balance correctly when on schedule', () => {
  const futureReturn = new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0];
  const res = calculateRentalBilling({
    pickupDate: '2026-10-20',
    pickupTime: '10:00',
    returnDate: futureReturn,
    returnTime: '18:00',
    confirmedTotal: 15000,
    depositAmount: 5000,
    dailyRate: 5000,
    tripStatus: 'on_trip'
  });

  assert.equal(res.isOverdue, false);
  assert.equal(res.baseTotal, 15000);
  assert.equal(res.paidAmount, 5000);
  assert.equal(res.remainingBaseBalance, 10000);
  assert.equal(res.overtimeCharges, 0);
  assert.equal(res.finalRemainingDue, 10000);
  assert.equal(res.statusLabel, 'Active On Trip');
});

test('calculateRentalBilling computes overdue hours and overtime charges when past return time', () => {
  // Set scheduled return to 3 hours ago
  const now = new Date('2026-10-22T15:00:00Z').getTime();
  const pastReturnDate = '2026-10-22';
  const pastReturnTime = '12:00'; // 3 hours before 15:00

  const res = calculateRentalBilling(
    {
      pickupDate: '2026-10-21',
      pickupTime: '09:00',
      returnDate: pastReturnDate,
      returnTime: pastReturnTime,
      confirmedTotal: 10000,
      depositAmount: 2000,
      dailyRate: 6000, // 500 PKR/hr overtime
      tripStatus: 'on_trip'
    },
    now
  );

  assert.equal(res.isOverdue, true);
  assert.equal(res.overdueHours, 3);
  assert.equal(res.chargeableHours, 3);
  assert.equal(res.hourlyRate, 500);
  assert.equal(res.overtimeCharges, 1500); // 3 * 500
  assert.equal(res.finalTotalAmount, 11500); // 10000 + 1500
  assert.equal(res.finalRemainingDue, 9500); // 11500 - 2000
});

test('calculateRentalBilling respects returned status and does not flag overdue', () => {
  const res = calculateRentalBilling({
    pickupDate: '2026-10-10',
    pickupTime: '10:00',
    returnDate: '2026-10-12',
    returnTime: '18:00',
    confirmedTotal: 8000,
    depositAmount: 8000,
    tripStatus: 'returned',
    status: 'completed'
  });

  assert.equal(res.isOverdue, false);
  assert.equal(res.statusLabel, 'Returned');
  assert.equal(res.finalRemainingDue, 0);
});
