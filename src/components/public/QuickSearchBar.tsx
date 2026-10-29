import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext.tsx';
import { soundFX } from '../../utils/soundEffects.ts';
import { Calendar, Search, Car, Navigation, Sparkles } from 'lucide-react';

export const QuickSearchBar: React.FC = () => {
  const {
    locale,
    setCurrentView,
    searchDates,
    setSearchDates,
    setFilterCategory
  } = useApp();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playScan();
    setCurrentView('cars');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 sm:p-7 shadow-2xl shadow-slate-900/10 border border-slate-200/90 -mt-10 relative z-30 max-w-5xl mx-auto"
    >
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100 text-xs">
        <div className="flex items-center gap-2 font-mono font-bold text-[#0B1F3A]">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>{locale === 'ur' ? 'گاڑی کی فوری دستیابی تلاش کریں' : 'QUICK RADAR FLEET SEARCH'}</span>
        </div>
        <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
          Sadiqabad & M-5 Motorway Corridor
        </span>
      </div>

      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* Category */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 font-mono">
            <Car className="w-3.5 h-3.5 text-amber-500" />
            <span>{locale === 'ur' ? 'گاڑی کی قسم' : 'Vehicle Class'}</span>
          </label>
          <select
            onChange={e => {
              soundFX.playClick();
              setFilterCategory(e.target.value || null);
            }}
            className="w-full px-3.5 py-3 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-white focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-400 transition-all cursor-pointer"
          >
            <option value="">{locale === 'ur' ? 'تمام کیٹیگریز (سیڈان، ایس یو وی وغیرہ)' : 'All Categories (Sedan, SUV, etc.)'}</option>
            <option value="sedan">{locale === 'ur' ? 'سیڈان (کرولا، سیوک، یارس)' : 'Sedan (Corolla, Civic, Yaris)'}</option>
            <option value="suv">{locale === 'ur' ? 'ایس یو وی 4x4 (فارچونر، پراڈو)' : 'SUV 4x4 (Fortuner, Prado)'}</option>
            <option value="hatchback">{locale === 'ur' ? 'ہیچ بیک (آلٹو، کلٹس)' : 'Hatchback (Alto, Cultus)'}</option>
            <option value="van">{locale === 'ur' ? 'ہائی ایس 14 سیٹر گرینڈ کیبن' : 'Grand Cabin Van (14 Seater)'}</option>
            <option value="luxury">{locale === 'ur' ? 'وی آئی پی لگژری (پراڈو ٹی ایکس)' : 'VIP Luxury (Prado TX)'}</option>
          </select>
        </div>

        {/* Pickup Date */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 font-mono">
            <Calendar className="w-3.5 h-3.5 text-cyan-600" />
            <span>{locale === 'ur' ? 'پک اپ تاریخ' : 'Pickup Date'}</span>
          </label>
          <input
            type="date"
            min={today}
            value={searchDates.pickup}
            onChange={e => setSearchDates({ ...searchDates, pickup: e.target.value })}
            className="w-full px-3.5 py-3 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-400 transition-all font-mono"
          />
        </div>

        {/* Return Date */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 font-mono">
            <Calendar className="w-3.5 h-3.5 text-cyan-600" />
            <span>{locale === 'ur' ? 'واپسی تاریخ' : 'Return Date'}</span>
          </label>
          <input
            type="date"
            min={searchDates.pickup || today}
            value={searchDates.returnDate}
            onChange={e => setSearchDates({ ...searchDates, returnDate: e.target.value })}
            className="w-full px-3.5 py-3 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-400 transition-all font-mono"
          />
        </div>

        {/* Submit Search */}
        <div>
          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            type="submit"
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#0B1F3A] to-[#142F57] hover:from-[#142F57] hover:to-[#0B1F3A] text-[#F5B301] text-xs font-black shadow-lg shadow-slate-900/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Search className="w-4 h-4 text-cyan-400" />
            <span>{locale === 'ur' ? 'گاڑیاں تلاش کریں' : 'FIND AVAILABLE FLEET'}</span>
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};
