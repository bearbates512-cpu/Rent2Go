import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext.tsx';
import { soundFX } from '../../utils/soundEffects.ts';
import { triggerThunderBlast } from '../effects/ThunderBlastSystem.tsx';
import { Calendar, Search, Car, Sparkles, Puzzle, Zap, RefreshCw } from 'lucide-react';

export const QuickSearchBar: React.FC = () => {
  const {
    locale,
    setCurrentView,
    searchDates,
    setSearchDates,
    setFilterCategory
  } = useApp();

  const [isExploded, setIsExploded] = useState<boolean>(false);
  const [activePiece, setActivePiece] = useState<number | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playScan();

    // Trigger thunder blast on search submit!
    triggerThunderBlast(window.innerWidth / 2, 220);

    // Trigger brief puzzle explosion & snap
    setIsExploded(true);
    soundFX.playPuzzleExplode();

    setTimeout(() => {
      setIsExploded(false);
      soundFX.playPuzzleSnap();
      setCurrentView('cars');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 550);
  };

  const triggerPuzzleExplosion = () => {
    if (isExploded) {
      setIsExploded(false);
      soundFX.playPuzzleSnap();
      triggerThunderBlast(window.innerWidth / 2, 250);
      return;
    }

    soundFX.playPuzzleExplode();
    setIsExploded(true);

    // Automatically re-assemble with magnetic snap after 1.2s
    setTimeout(() => {
      soundFX.playPuzzleSnap();
      setIsExploded(false);
      triggerThunderBlast(window.innerWidth / 2, 250);
    }, 1200);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 35, rotateX: 15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white/95 dark:bg-[#0B1523]/95 backdrop-blur-2xl rounded-3xl p-5 sm:p-7 shadow-2xl shadow-slate-900/10 dark:shadow-black/70 border border-slate-200/90 dark:border-slate-800 -mt-10 relative z-30 max-w-5xl mx-auto transition-colors duration-250 perspective-1000"
    >
      {/* Header bar with Puzzle Mode and Thunder Blast controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 mb-4 border-b border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2 font-mono font-bold text-[#0B1F3A] dark:text-white">
          <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
          <span>{locale === 'ur' ? 'گاڑی کی فوری دستیابی تلاش کریں' : 'QUICK RADAR FLEET SEARCH'}</span>
        </div>

        {/* Puzzle Explode & Assemble Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={triggerPuzzleExplosion}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-mono font-bold transition-all duration-300 active:scale-95 cursor-pointer ${
              isExploded
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg shadow-amber-400/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-400 hover:text-amber-500'
            }`}
            title="Interactive Puzzle Explode & Re-assemble UI"
          >
            <Puzzle className={`w-3.5 h-3.5 ${isExploded ? 'animate-spin' : ''}`} />
            <span>{isExploded ? (locale === 'ur' ? 'پزل جڑ رہا ہے...' : 'SNAPPING PUZZLE...') : (locale === 'ur' ? 'پزل دھماکہ موڈ' : 'PUZZLE EXPLODE')}</span>
          </button>

          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 hidden md:inline">
            Sadiqabad & M-5 Motorway
          </span>
        </div>
      </div>

      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end relative">
        {/* PUZZLE PIECE 1: Vehicle Class */}
        <motion.div
          animate={
            isExploded
              ? {
                  x: -28,
                  y: -22,
                  rotateZ: -6,
                  rotateX: 12,
                  scale: 1.05,
                  transition: { type: 'spring', stiffness: 350, damping: 20 }
                }
              : {
                  x: 0,
                  y: 0,
                  rotateZ: 0,
                  rotateX: 0,
                  scale: 1,
                  transition: { type: 'spring', stiffness: 450, damping: 24 }
                }
          }
          onMouseEnter={() => {
            setActivePiece(1);
            soundFX.playHover();
          }}
          onMouseLeave={() => setActivePiece(null)}
          className={`p-3 rounded-2xl border transition-all duration-300 relative ${
            isExploded
              ? 'border-amber-400 bg-amber-400/5 shadow-xl shadow-amber-500/20'
              : 'border-slate-200/80 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-900/40 hover:border-amber-400/60'
          }`}
        >
          {/* Neon Jigsaw Notch Visualizer */}
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <Car className="w-3.5 h-3.5 text-amber-500" />
              <span>{locale === 'ur' ? 'گاڑی کی قسم' : 'Vehicle Class'}</span>
            </label>
            <span className="text-[9px] font-mono font-bold text-amber-500/80 uppercase">
              Part #01
            </span>
          </div>

          <select
            onChange={e => {
              soundFX.playClick();
              setFilterCategory(e.target.value || null);
            }}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-400 transition-all cursor-pointer"
          >
            <option value="" className="dark:bg-slate-900">{locale === 'ur' ? 'تمام کیٹیگریز' : 'All Categories (Sedan, SUV)'}</option>
            <option value="sedan" className="dark:bg-slate-900">{locale === 'ur' ? 'سیڈان (کرولا، سیوک، یارس)' : 'Sedan (Corolla, Civic, Yaris)'}</option>
            <option value="suv" className="dark:bg-slate-900">{locale === 'ur' ? 'ایس یو وی 4x4 (فارچونر، پراڈو)' : 'SUV 4x4 (Fortuner, Prado)'}</option>
            <option value="hatchback" className="dark:bg-slate-900">{locale === 'ur' ? 'ہیچ بیک (آلٹو، کلٹس)' : 'Hatchback (Alto, Cultus)'}</option>
            <option value="van" className="dark:bg-slate-900">{locale === 'ur' ? 'ہائی ایس گرینڈ کیبن 14 سیٹر' : 'Grand Cabin Van (14 Seater)'}</option>
            <option value="luxury" className="dark:bg-slate-900">{locale === 'ur' ? 'وی آئی پی لگژری فلیٹ' : 'VIP Luxury Fleet'}</option>
          </select>
        </motion.div>

        {/* PUZZLE PIECE 2: Pickup Date */}
        <motion.div
          animate={
            isExploded
              ? {
                  x: -12,
                  y: 24,
                  rotateZ: 5,
                  rotateX: -10,
                  scale: 1.05,
                  transition: { type: 'spring', stiffness: 350, damping: 20 }
                }
              : {
                  x: 0,
                  y: 0,
                  rotateZ: 0,
                  rotateX: 0,
                  scale: 1,
                  transition: { type: 'spring', stiffness: 450, damping: 24 }
                }
          }
          onMouseEnter={() => {
            setActivePiece(2);
            soundFX.playHover();
          }}
          onMouseLeave={() => setActivePiece(null)}
          className={`p-3 rounded-2xl border transition-all duration-300 relative ${
            isExploded
              ? 'border-cyan-400 bg-cyan-400/5 shadow-xl shadow-cyan-500/20'
              : 'border-slate-200/80 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-900/40 hover:border-cyan-400/60'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <Calendar className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>{locale === 'ur' ? 'پک اپ تاریخ' : 'Pickup Date'}</span>
            </label>
            <span className="text-[9px] font-mono font-bold text-cyan-500/80 uppercase">
              Part #02
            </span>
          </div>

          <input
            type="date"
            min={today}
            value={searchDates.pickup}
            onChange={e => setSearchDates({ ...searchDates, pickup: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-cyan-400 transition-all font-mono"
          />
        </motion.div>

        {/* PUZZLE PIECE 3: Return Date */}
        <motion.div
          animate={
            isExploded
              ? {
                  x: 14,
                  y: -20,
                  rotateZ: -4,
                  rotateX: -12,
                  scale: 1.05,
                  transition: { type: 'spring', stiffness: 350, damping: 20 }
                }
              : {
                  x: 0,
                  y: 0,
                  rotateZ: 0,
                  rotateX: 0,
                  scale: 1,
                  transition: { type: 'spring', stiffness: 450, damping: 24 }
                }
          }
          onMouseEnter={() => {
            setActivePiece(3);
            soundFX.playHover();
          }}
          onMouseLeave={() => setActivePiece(null)}
          className={`p-3 rounded-2xl border transition-all duration-300 relative ${
            isExploded
              ? 'border-cyan-400 bg-cyan-400/5 shadow-xl shadow-cyan-500/20'
              : 'border-slate-200/80 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-900/40 hover:border-cyan-400/60'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <Calendar className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>{locale === 'ur' ? 'واپسی تاریخ' : 'Return Date'}</span>
            </label>
            <span className="text-[9px] font-mono font-bold text-cyan-500/80 uppercase">
              Part #03
            </span>
          </div>

          <input
            type="date"
            min={searchDates.pickup || today}
            value={searchDates.returnDate}
            onChange={e => setSearchDates({ ...searchDates, returnDate: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-cyan-400 transition-all font-mono"
          />
        </motion.div>

        {/* PUZZLE PIECE 4: Search Radar Button */}
        <motion.div
          animate={
            isExploded
              ? {
                  x: 30,
                  y: 22,
                  rotateZ: 6,
                  rotateX: 14,
                  scale: 1.05,
                  transition: { type: 'spring', stiffness: 350, damping: 20 }
                }
              : {
                  x: 0,
                  y: 0,
                  rotateZ: 0,
                  rotateX: 0,
                  scale: 1,
                  transition: { type: 'spring', stiffness: 450, damping: 24 }
                }
          }
          className="relative"
        >
          <motion.button
            whileTap={{ scale: 0.94 }}
            whileHover={{ scale: 1.03 }}
            type="submit"
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#F5B301] via-amber-400 to-[#F5B301] hover:from-amber-400 hover:to-amber-300 text-[#0B1F3A] font-extrabold text-sm shadow-xl shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer font-mono tracking-wide relative overflow-hidden group"
          >
            {/* Shimmer sweep */}
            <div className="absolute inset-0 bg-white/25 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
            <Search className="w-4 h-4 stroke-[2.5]" />
            <span>{locale === 'ur' ? 'گاڑیاں تلاش کریں' : 'SCAN FLEET RADAR'}</span>
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
};
