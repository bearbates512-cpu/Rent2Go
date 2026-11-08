import React from 'react';

/**
 * No-op trigger (all liquid gas splash animations deleted per user request).
 */
export const triggerLiquidGasSplash = (_originX?: number, _originY?: number, _intensity: number = 1) => {
  // Animations completely removed
};

/**
 * Empty null component (all canvas fluid loops removed).
 */
export const LiquidGasCanvas: React.FC = () => {
  return null;
};

/**
 * Static subtle background (all animation and pulse deleted).
 */
export const LiquidGasAura: React.FC<{ className?: string }> = ({ className = '' }) => {
  return null;
};
