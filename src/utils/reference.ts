/**
 * Booking reference generator
 * Generates human-readable, unambiguous uppercase alphanumeric booking codes
 * Format: R2G-XXXXXXXX (e.g., R2G-7K3M9QXA)
 */

export function generateBookingReference(): string {
  // Exclude easily confused characters like 0, O, 1, I
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  return `R2G-${result}`;
}
