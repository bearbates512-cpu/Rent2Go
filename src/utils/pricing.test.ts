import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateDays, calculateQuote } from './pricing.ts';

test('calculateDays computes 1 day for same day / 24 hour period', () => {
  const days = calculateDays('2026-10-25', '10:00', '2026-10-26', '10:00');
  assert.equal(days, 1);
});

test('calculateDays computes 3 days for 3-day booking', () => {
  const days = calculateDays('2026-10-25', '10:00', '2026-10-28', '10:00');
  assert.equal(days, 3);
});

test('calculateQuote computes base and driver fees for with_driver', () => {
  const quote = calculateQuote({
    dailyRatePKR: 6000,
    driverDailyFeePKR: 1500,
    driverOption: 'with_driver',
    pickupDate: '2026-11-01',
    pickupTime: '09:00',
    returnDate: '2026-11-03',
    returnTime: '09:00'
  });

  assert.equal(quote.rentalDays, 2);
  assert.equal(quote.baseTotal, 12000);
  assert.equal(quote.driverTotal, 3000);
  assert.equal(quote.estimatedTotal, 15000);
  assert.equal(quote.securityDeposit, 0);
  assert.equal(quote.needsQuote, false);
});

test('calculateQuote handles self_drive with deposit and no driver fee', () => {
  const quote = calculateQuote({
    dailyRatePKR: 8000,
    driverOption: 'self_drive',
    customDeposit: 15000,
    pickupDate: '2026-11-01',
    pickupTime: '09:00',
    returnDate: '2026-11-02',
    returnTime: '09:00'
  });

  assert.equal(quote.rentalDays, 1);
  assert.equal(quote.baseTotal, 8000);
  assert.equal(quote.driverTotal, 0);
  assert.equal(quote.estimatedTotal, 8000);
  assert.equal(quote.securityDeposit, 15000);
});

test('calculateQuote returns needsQuote=true if daily rate is null', () => {
  const quote = calculateQuote({
    dailyRatePKR: null,
    driverOption: 'with_driver',
    pickupDate: '2026-11-01',
    pickupTime: '09:00',
    returnDate: '2026-11-02',
    returnTime: '09:00'
  });

  assert.equal(quote.needsQuote, true);
  assert.equal(quote.estimatedTotal, null);
});
