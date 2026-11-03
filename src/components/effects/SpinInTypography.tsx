import React from 'react';
import { motion } from 'motion/react';

interface SpinInHeadingProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: React.ReactNode;
  className?: string;
  delay?: number;
  splitWords?: boolean;
  axis?: 'x' | 'y';
}

/**
 * 3D Spin-In Typography for headings.
 * Re-triggers on EVERY scroll up or down (viewport once: false).
 */
export const SpinInHeading: React.FC<SpinInHeadingProps> = ({
  as: Tag = 'h2',
  children,
  className = '',
  delay = 0,
  splitWords = false,
  axis = 'x'
}) => {
  // If children is pure text and splitWords is enabled, spin word-by-word
  if (splitWords && typeof children === 'string') {
    const words = children.split(' ');
    return (
      <Tag className={`perspective-1000 ${className}`}>
        <motion.span
          className="inline-flex flex-wrap gap-x-[0.28em] gap-y-1"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.05,
                delayChildren: delay
              }
            }
          }}
        >
          {words.map((word, idx) => (
            <motion.span
              key={idx}
              className="inline-block transform-gpu will-change-transform"
              variants={{
                hidden: {
                  opacity: 0,
                  y: axis === 'x' ? 24 : 0,
                  rotateX: axis === 'x' ? -75 : 0,
                  rotateY: axis === 'y' ? 65 : 0,
                  scale: 0.88
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  rotateX: 0,
                  rotateY: 0,
                  scale: 1,
                  transition: {
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1]
                  }
                }
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.span>
      </Tag>
    );
  }

  // Full heading 3D spin-in
  const MotionTag = motion[Tag];

  return (
    <div className="perspective-1000">
      <MotionTag
        initial={{
          opacity: 0,
          y: axis === 'x' ? 28 : 0,
          rotateX: axis === 'x' ? -55 : 0,
          rotateY: axis === 'y' ? 45 : 0,
          scale: 0.92
        }}
        whileInView={{
          opacity: 1,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          scale: 1
        }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{
          duration: 0.65,
          delay,
          ease: [0.22, 1, 0.36, 1]
        }}
        className={`transform-gpu will-change-transform ${className}`}
      >
        {children}
      </MotionTag>
    </div>
  );
};

interface SpinInTextProps {
  as?: 'p' | 'span' | 'div' | 'label';
  children: React.ReactNode;
  className?: string;
  delay?: number;
  axis?: 'x' | 'y';
}

/**
 * 3D Spin-In Text for paragraphs, subheadings, labels, and badges.
 * Re-triggers on EVERY scroll up or down (viewport once: false).
 */
export const SpinInText: React.FC<SpinInTextProps> = ({
  as: Tag = 'p',
  children,
  className = '',
  delay = 0,
  axis = 'y'
}) => {
  const MotionTag = motion[Tag];

  return (
    <div className="perspective-1000 inline-block w-full">
      <MotionTag
        initial={{
          opacity: 0,
          y: axis === 'x' ? 18 : 0,
          rotateY: axis === 'y' ? 35 : 0,
          rotateX: axis === 'x' ? -35 : 0,
          scale: 0.95
        }}
        whileInView={{
          opacity: 1,
          y: 0,
          rotateY: 0,
          rotateX: 0,
          scale: 1
        }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{
          duration: 0.55,
          delay,
          ease: [0.22, 1, 0.36, 1]
        }}
        className={`transform-gpu will-change-transform ${className}`}
      >
        {children}
      </MotionTag>
    </div>
  );
};

interface LiquidGasBadgeProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Liquid Gas Aura Badge with floating fluid plasma border and spin-in.
 */
export const LiquidGasBadge: React.FC<LiquidGasBadgeProps> = ({
  children,
  className = '',
  delay = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.75, rotateY: 50 }}
      whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider overflow-hidden group perspective-1000 ${className}`}
    >
      {/* Liquid Gas Plasma Shimmer Background */}
      <span
        className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-cyan-500/25 to-purple-500/20 dark:from-amber-400/30 dark:via-cyan-400/35 dark:to-purple-400/30 animate-pulse pointer-events-none"
        aria-hidden="true"
      />
      {/* Animated fluid border */}
      <span
        className="absolute inset-0 rounded-full border border-amber-500/40 dark:border-cyan-400/40 shadow-[0_0_15px_rgba(245,179,1,0.25)] pointer-events-none"
        aria-hidden="true"
      />
      <span className="relative z-10 flex items-center gap-1.5">{children}</span>
    </motion.div>
  );
};
