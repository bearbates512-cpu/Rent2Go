/**
 * Phone number validation and normalization for Pakistan (+92)
 * Supports formats: 03001234567, 3001234567, +923001234567, 0300-1234567, etc.
 */

export function normalizePkPhone(rawInput: string): {
  isValid: boolean;
  e164: string;
  formatted: string;
  error?: string;
} {
  if (!rawInput || typeof rawInput !== 'string') {
    return { isValid: false, e164: '', formatted: '', error: 'Phone number is required' };
  }

  // Strip spaces, dashes, parentheses
  const cleaned = rawInput.replace(/[\s\-\(\)\.]/g, '');

  let digitsOnly = cleaned;
  if (digitsOnly.startsWith('+')) {
    digitsOnly = digitsOnly.substring(1);
  }

  // If starts with 92
  if (digitsOnly.startsWith('92')) {
    digitsOnly = digitsOnly.substring(2);
  } else if (digitsOnly.startsWith('0')) {
    digitsOnly = digitsOnly.substring(1);
  }

  // Now digitsOnly should be 10 digits starting with 3 (e.g. 3001234567)
  if (!/^3\d{9}$/.test(digitsOnly)) {
    return {
      isValid: false,
      e164: '',
      formatted: '',
      error: 'Please enter a valid Pakistani mobile number (e.g., 0300 1234567)'
    };
  }

  const e164 = `+92${digitsOnly}`;
  const formatted = `+92 ${digitsOnly.substring(0, 3)} ${digitsOnly.substring(3, 10)}`;

  return {
    isValid: true,
    e164,
    formatted
  };
}
