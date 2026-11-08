import React from 'react';

/**
 * No-op trigger (all thunder and blast animations deleted per user request).
 */
export const triggerThunderBlast = (_originX?: number, _originY?: number, _intensity: number = 1) => {
  // Animations completely removed
};

/**
 * Empty null component (all lightning, shockwave, and flash animations removed).
 */
export const ThunderBlastSystem: React.FC = () => {
  return null;
};
