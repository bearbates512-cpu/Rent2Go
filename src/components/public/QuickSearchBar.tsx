import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext.tsx';
import { soundFX } from '../../utils/soundEffects.ts';
import { Calendar, Search, Car, UserCheck, ArrowRight } from 'lucide-react';

export const QuickSearchBar: React.FC = () => {
  const {
    locale,
    setCurrentView,
    searchDates,
    setSearchDates,
    setFilterCategory
  } = useApp();

  const [category, setCategory] = useState<string>('all');
  const [driverOption, setDriverOption] = useState<'with_driver' | 'self_drive'>('with_driver');

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playClick();

    if (category !== 'all') {
      setFilterCategory(category);
    } else {
      setFilterCategory(null);
    }

    setCurrentView('cars');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 35, scale: 0.98, filter: 'blur(3px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] as const }}
      className="bg-white dark:bg-[#0C121E] rounded-3xl p-6 sm:p-8 shadow-2xl border border-black/5 dark:border-white/10 -mt-12 relative z-30 max-w-5xl mx-auto transition-colors duration-250"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-black/5 dark:border-white/10 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="font-mono font-bold tracking-wider uppercase text-slate-900 dark:text-white">
            {locale === 'ur' ? 'گاڑی تلاش اور ریٹس چیک کریں' : 'QUICK FLEET DISPATCH & RATES'}
          </span>
        </div>
        <span className="text-slate-400 font-mono text-[11px]">
          Sadiqabad · KLP Road · M-5 Motorway
        </span>
      </div>

      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* Field 1: Category */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            {locale === 'ur' ? 'گاڑی کی کیٹیگری' : 'Vehicle Type'}
          </label>
          <div className="relative">
            <Car className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full ps-10 pe-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-slate-950 dark:focus:ring-white cursor-pointer"
            >
              <option value="all">{locale === 'ur' ? 'تمام گاڑیاں (All Fleet)' : 'All Vehicles'}</option>
              <option value="suv">{locale === 'ur' ? 'ایس یو وی / فارچونر / پراڈو' : 'Luxury SUVs & 4x4'}</option>
              <option value="sedan">{locale === 'ur' ? 'سیڈان (سیوک / گرینڈی)' : 'Executive Sedans'}</option>
              <option value="economy">{locale === 'ur' ? 'سٹی و فیملی کارز' : 'Economy & City'}</option>
            </select>
          </div>
        </div>

        {/* Field 2: Pickup Date */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            {locale === 'ur' ? 'روانگی کی تاریخ' : 'Pickup Date'}
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="date"
              value={searchDates.pickup || today}
              min={today}
              onChange={(e) => setSearchDates({ ...searchDates, pickup: e.target.value })}
              className="w-full ps-10 pe-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-slate-950 dark:focus:ring-white cursor-pointer"
            />
          </div>
        </div>

        {/* Field 3: Return Date */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            {locale === 'ur' ? 'واپسی کی تاریخ' : 'Return Date'}
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="date"
              value={searchDates.returnDate || tomorrow}
              min={searchDates.pickup || today}
              onChange={(e) => setSearchDates({ ...searchDates, returnDate: e.target.value })}
              className="w-full ps-10 pe-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-slate-950 dark:focus:ring-white cursor-pointer"
            />
          </div>
        </div>

        {/* Action Button */}
        <div>
          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-2xl bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95"
          >
            <Search className="w-4 h-4" />
            <span>{locale === 'ur' ? 'گاڑیاں دیکھیں' : 'Search Fleet'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </motion.div>
  );
};
