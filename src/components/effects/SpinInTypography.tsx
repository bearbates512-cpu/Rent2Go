import React from 'react';

interface SpinInHeadingProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: React.ReactNode;
  className?: string;
  delay?: number;
  splitWords?: boolean;
  axis?: 'x' | 'y';
}

/**
 * Clean, static heading component (all animations removed per user request).
 */
export const SpinInHeading: React.FC<SpinInHeadingProps> = ({
  as: Tag = 'h2',
  children,
  className = ''
}) => {
  return <Tag className={className}>{children}</Tag>;
};

interface SpinInTextProps {
  as?: 'p' | 'span' | 'div' | 'label';
  children: React.ReactNode;
  className?: string;
  delay?: number;
  axis?: 'x' | 'y';
}

/**
 * Clean, static text component (all animations removed per user request).
 */
export const SpinInText: React.FC<SpinInTextProps> = ({
  as: Tag = 'p',
  children,
  className = ''
}) => {
  return <Tag className={className}>{children}</Tag>;
};

interface LiquidGasBadgeProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Clean, static badge component (all animations and glowing pulses removed).
 */
export const LiquidGasBadge: React.FC<LiquidGasBadgeProps> = ({
  children,
  className = ''
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${className}`}
    >
      {children}
    </span>
  );
};
