import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizePkPhone } from './phone.ts';

test('normalizes standard 11-digit local PK numbers', () => {
  const res = normalizePkPhone('03001234567');
  assert.equal(res.isValid, true);
  assert.equal(res.e164, '+923001234567');
  assert.equal(res.formatted, '+92 300 1234567');
});

test('handles dashed and spaced numbers', () => {
  const res = normalizePkPhone('0302 - 987 6543');
  assert.equal(res.isValid, true);
  assert.equal(res.e164, '+923029876543');
});

test('handles international +92 format', () => {
  const res = normalizePkPhone('+923211122334');
  assert.equal(res.isValid, true);
  assert.equal(res.e164, '+923211122334');
});

test('rejects non-Pakistani or invalid length numbers', () => {
  assert.equal(normalizePkPhone('12345').isValid, false);
  assert.equal(normalizePkPhone('02134567890').isValid, false); // Landline
  assert.equal(normalizePkPhone('').isValid, false);
});
