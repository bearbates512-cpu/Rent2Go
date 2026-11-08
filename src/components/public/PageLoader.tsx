import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PageLoaderProps {
  onComplete?: () => void;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Check if user already saw the loader in this session to avoid annoyance
    const hasSeen = sessionStorage.getItem('rent2go_seen_intro');
    if (hasSeen) {
      setIsFinished(true);
      onComplete?.();
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFinished(true);
            sessionStorage.setItem('rent2go_seen_intro', '1');
            onComplete?.();
          }, 200);
          return 100;
        }
        // Smooth random progression
        const increment = Math.floor(Math.random() * 18) + 12;
        return Math.min(prev + increment, 100);
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  if (isFinished) return null;

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          key="drkst-page-loader"
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-50 flex flex-col justify-between p-6 sm:p-12 bg-[#090D14] text-white select-none pointer-events-auto"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 tracking-wider">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>SADIQABAD FLEET DISPATCH</span>
            </span>
            <span>2026 EDITION</span>
          </div>

          {/* Center Brand Reveal */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/10 p-2 flex items-center justify-center border border-white/20">
                <img
                  src="/assets/aistudio/Rent2Go_icon_transparent.png"
                  alt="Rent2Go"
                  className="w-full h-full object-contain brightness-125"
                />
              </div>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white font-mono">
                Rent<span className="text-[#F5B301]">2Go</span>®
              </h1>
            </motion.div>
            <p className="text-xs sm:text-sm text-slate-400 font-mono tracking-widest uppercase">
              Your Journey. Your Ride. Your Freedom.
            </p>
          </div>

          {/* Bottom Progress Bar & Percentage */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>LOADING EXPERIENCE</span>
              <span className="text-amber-400 font-bold">{progress}%</span>
            </div>
            <div className="h-0.5 w-full bg-white/10 overflow-hidden rounded-full">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-400 via-amber-300 to-[#F5B301]"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
