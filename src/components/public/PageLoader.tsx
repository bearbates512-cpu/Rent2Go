import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PageLoaderProps {
  onComplete?: () => void;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [statusText, setStatusText] = useState('Initializing Fleet Engine...');

  useEffect(() => {
    // Smooth progress counter reaching 100% in ~1.2s
    let current = 0;
    const interval = setInterval(() => {
      // Natural non-linear increments
      const step = current < 40 ? 5 : current < 80 ? 4 : current < 95 ? 3 : 2;
      current = Math.min(current + step, 100);
      setProgress(current);

      if (current < 30) {
        setStatusText('Synchronizing Fleet Telemetry...');
      } else if (current < 65) {
        setStatusText('Loading Motorway & Local Tariffs...');
      } else if (current < 95) {
        setStatusText('Verifying Chauffeurs & AC Readiness...');
      } else {
        setStatusText('Fleet Ready · Sadiqabad 2026');
      }

      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsDone(true);
          onComplete?.();
        }, 300);
      }
    }, 35);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="drkst-editorial-page-loader"
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[99999] flex flex-col justify-between p-6 sm:p-12 md:p-16 bg-[#070D18] text-white select-none pointer-events-auto overflow-hidden"
        >
          {/* Ambient Gold Radial Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

          {/* Top Bar */}
          <div className="relative z-10 flex items-center justify-between text-xs font-mono text-slate-400 tracking-wider">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
              <span className="text-slate-200 font-bold">SADIQABAD FLEET DISPATCH</span>
              <span className="hidden sm:inline text-slate-500">·</span>
              <span className="hidden sm:inline text-slate-400">M-5 HIGHWAY READY</span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-white/10 text-white text-[11px] font-bold">
              2026 EDITION
            </span>
          </div>

          {/* Center Brand Reveal */}
          <div className="relative z-10 flex flex-col items-center justify-center space-y-6 my-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-4 text-center"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/10 p-3.5 flex items-center justify-center border border-white/20 shadow-2xl backdrop-blur-md">
                <img
                  src="/assets/aistudio/Rent2Go_icon_transparent.png"
                  alt="Rent2Go"
                  className="w-full h-full object-contain brightness-125"
                />
              </div>

              <div className="space-y-2">
                <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white font-mono">
                  Rent<span className="text-[#F5B301]">2Go</span>®
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 font-mono tracking-widest uppercase">
                  Your Journey. Your Ride. Your Freedom.
                </p>
              </div>
            </motion.div>

            {/* Dynamic Status Pill */}
            <motion.div
              key={statusText}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-amber-400/90 tracking-wider uppercase"
            >
              {statusText}
            </motion.div>
          </div>

          {/* Bottom Bar: Oversized Counter & Hairline Progress */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-end justify-between font-mono">
              <div className="space-y-1">
                <span className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest block">
                  LOADING EXPERIENCE
                </span>
                <span className="text-xs text-slate-400">
                  Sadiqabad · Rahim Yar Khan · Motorway
                </span>
              </div>

              {/* Big Editorial Counter */}
              <div className="text-5xl sm:text-7xl lg:text-8xl font-black font-mono text-[#F5B301] tracking-tight leading-none drop-shadow-[0_0_25px_rgba(245,179,1,0.3)]">
                {progress}%
              </div>
            </div>

            {/* Glowing Golden Progress Bar */}
            <div className="h-1 w-full bg-white/10 overflow-hidden rounded-full relative">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-[#F5B301] rounded-full shadow-[0_0_15px_rgba(245,179,1,0.8)]"
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
