import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Calendar, Search, Car, Layers } from 'lucide-react';

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
    setCurrentView('cars');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl shadow-slate-900/5 border border-slate-200/80 -mt-8 relative z-20 max-w-5xl mx-auto">
      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* Category */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Car className="w-3.5 h-3.5 text-amber-500" />
            <span>{locale === 'ur' ? 'گاڑی کی قسم' : 'Vehicle Type'}</span>
          </label>
          <select
            onChange={e => setFilterCategory(e.target.value || null)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0B1F3A]"
          >
            <option value="">{locale === 'ur' ? 'تمام کیٹیگریز (سیڈان، ایس یو وی وغیرہ)' : 'All Categories (Sedan, SUV, etc.)'}</option>
            <option value="sedan">{locale === 'ur' ? 'سیڈان (کرولا، سیوک، یارس)' : 'Sedan (Corolla, Civic, Yaris)'}</option>
            <option value="suv">{locale === 'ur' ? 'ایس یو وی 4x4 (فارچونر، پراڈو)' : 'SUV 4x4 (Fortuner, Prado)'}</option>
            <option value="hatchback">{locale === 'ur' ? 'ہیچ بیک (آلٹو، ویگن آر)' : 'Hatchback (Alto, WagonR)'}</option>
            <option value="van">{locale === 'ur' ? 'ہائی ایس 14 سیٹر وین' : 'Passenger Van (14 Seater Hiace)'}</option>
            <option value="luxury">{locale === 'ur' ? 'وی آئی پی لگژری (مرسڈیز وغیرہ)' : 'VIP Luxury (Mercedes, etc.)'}</option>
          </select>
        </div>

        {/* Pickup Date */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-500" />
            <span>{locale === 'ur' ? 'پک اپ کی تاریخ' : 'Pickup Date'}</span>
          </label>
          <input
            type="date"
            min={today}
            value={searchDates.pickup}
            onChange={e => setSearchDates({ ...searchDates, pickup: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0B1F3A]"
          />
        </div>

        {/* Return Date */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-500" />
            <span>{locale === 'ur' ? 'واپسی کی تاریخ' : 'Return Date'}</span>
          </label>
          <input
            type="date"
            min={searchDates.pickup || today}
            value={searchDates.returnDate}
            onChange={e => setSearchDates({ ...searchDates, returnDate: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0B1F3A]"
          />
        </div>

        {/* Submit Search */}
        <div>
          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-[#0B1F3A] hover:bg-[#142F57] text-[#F5B301] text-sm font-bold shadow-md shadow-slate-900/10 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Search className="w-4 h-4" />
            <span>{locale === 'ur' ? 'گاڑیاں تلاش کریں' : 'Find Available Cars'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
