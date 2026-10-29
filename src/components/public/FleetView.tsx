import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext.tsx';
import { soundFX } from '../../utils/soundEffects.ts';
import { CarCard } from './CarCard.tsx';
import { Search, Filter, X, SlidersHorizontal, Car, Radio, Sparkles } from 'lucide-react';
import { VehicleCategory } from '../../types/index.ts';

export const FleetView: React.FC = () => {
  const {
    vehicles,
    locale,
    filterCategory,
    setFilterCategory,
    setCurrentView,
    navigateToBooking
  } = useApp();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTransmission, setSelectedTransmission] = useState<string>('all');
  const [selectedDriverOption, setSelectedDriverOption] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(40000);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  const categories: { id: VehicleCategory | 'all'; en: string; ur: string }[] = [
    { id: 'all', en: 'All Vehicles', ur: 'تمام گاڑیاں' },
    { id: 'sedan', en: 'Sedan', ur: 'سیڈان' },
    { id: 'suv', en: 'SUV 4x4', ur: 'ایس یو وی 4x4' },
    { id: 'hatchback', en: 'Hatchback', ur: 'ہیچ بیک' },
    { id: 'van', en: 'Passenger Van', ur: 'وین / ہائی ایس' },
    { id: 'luxury', en: 'Luxury VIP', ur: 'وی آئی پی لگژری' }
  ];

  // Filtering logic
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter(v => {
        // Public only sees published non-maintenance
        if (v.visibility !== 'published') return false;

        if (filterCategory && filterCategory !== 'all' && v.category !== filterCategory) {
          return false;
        }

        if (selectedTransmission !== 'all' && v.transmission !== selectedTransmission) {
          return false;
        }

        if (selectedDriverOption !== 'all') {
          if (selectedDriverOption === 'with_driver' && v.driverOption === 'self_drive') return false;
          if (selectedDriverOption === 'self_drive' && v.driverOption === 'with_driver') return false;
        }

        if (v.dailyRatePKR && v.dailyRatePKR > maxPrice) {
          return false;
        }

        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchName = `${v.make} ${v.model} ${v.variant || ''}`.toLowerCase().includes(q);
          const matchTitleEn = v.title.en.toLowerCase().includes(q);
          const matchTitleUr = v.title.ur.toLowerCase().includes(q);
          if (!matchName && !matchTitleEn && !matchTitleUr) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') {
          return (a.dailyRatePKR || 999999) - (b.dailyRatePKR || 999999);
        }
        if (sortBy === 'price-high') {
          return (b.dailyRatePKR || 0) - (a.dailyRatePKR || 0);
        }
        if (sortBy === 'capacity') {
          return b.seats - a.seats;
        }
        if (sortBy === 'newest') {
          return b.modelYear - a.modelYear;
        }
        // Default: featured
        return (a.featuredOrder || 99) - (b.featuredOrder || 99);
      });
  }, [vehicles, filterCategory, selectedTransmission, selectedDriverOption, maxPrice, searchTerm, sortBy]);

  const clearAllFilters = () => {
    setFilterCategory(null);
    setSearchTerm('');
    setSelectedTransmission('all');
    setSelectedDriverOption('all');
    setMaxPrice(40000);
    setSortBy('featured');
  };

  const hasActiveFilters =
    Boolean(filterCategory && filterCategory !== 'all') ||
    Boolean(searchTerm) ||
    selectedTransmission !== 'all' ||
    selectedDriverOption !== 'all' ||
    maxPrice < 40000;

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider border border-amber-200">
              {locale === 'ur' ? 'صادق آباد کا مکمل فلیٹ' : 'Verified Fleet in Sadiqabad'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] mt-2">
              {locale === 'ur' ? 'گاڑیاں اور روزانہ کا کرایہ نامہ' : 'Our Fleet & Rental Rates'}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {locale === 'ur'
                ? 'تمام گاڑیاں مکمل جانچ شدہ، صاف ستھری اور بااخلاق ڈرائیورز کے ساتھ دستیاب ہیں۔'
                : 'Browse inspected sedans, SUVs, and vans with transparent pricing and instant booking.'}
            </p>
          </div>

          {/* Search Input Desktop */}
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => {
                  const val = e.target.value;
                  setSearchTerm(val);
                  const clean = val.trim().toLowerCase().replace(/\/+$/, '');
                  if (clean === '/admin/panel' || clean === '/admin' || clean === 'admin/panel') {
                    window.history.pushState(null, '', '/admin/panel');
                    setCurrentView('admin');
                  }
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    const clean = searchTerm.trim().toLowerCase().replace(/\/+$/, '');
                    if (clean === '/admin/panel' || clean === '/admin' || clean === 'admin/panel') {
                      e.preventDefault();
                      window.history.pushState(null, '', '/admin/panel');
                      setCurrentView('admin');
                    }
                  }
                }}
                placeholder={locale === 'ur' ? 'گاڑی تلاش کریں (کرولا، فارچونر...)' : 'Search car by name...'}
                className="w-full ps-10 pe-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0B1F3A]"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shrink-0"
              title="Filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Pills Header */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {categories.map(cat => {
            const isSelected = (!filterCategory && cat.id === 'all') || filterCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  soundFX.playClick();
                  setFilterCategory(cat.id === 'all' ? null : cat.id);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0B1F3A] text-white shadow-md shadow-slate-900/10'
                    : 'bg-white border border-slate-200/90 text-slate-700 hover:border-slate-300'
                }`}
              >
                {locale === 'ur' ? cat.ur : cat.en}
              </motion.button>
            );
          })}
        </div>

        {/* Content Layout: Sidebar + Car Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className={`lg:block ${mobileFilterOpen ? 'block' : 'hidden'} bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-6`}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-[#0B1F3A] flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-500" />
                <span>{locale === 'ur' ? 'فلٹرز' : 'Filter Options'}</span>
              </h2>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-semibold text-rose-600 hover:underline"
                >
                  {locale === 'ur' ? 'تمام ختم کریں' : 'Clear All'}
                </button>
              )}
            </div>

            {/* Driver Option */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                {locale === 'ur' ? 'ڈرائیور آپشن' : 'Driver Preference'}
              </label>
              <div className="space-y-1.5 text-xs">
                {[
                  { id: 'all', en: 'All Options', ur: 'تمام آپشنز' },
                  { id: 'with_driver', en: 'With Driver', ur: 'ڈرائیور کے ساتھ' },
                  { id: 'self_drive', en: 'Self-Drive', ur: 'سیلف ڈرائیو' }
                ].map(opt => (
                  <label key={opt.id} className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50">
                    <input
                      type="radio"
                      name="driverOption"
                      checked={selectedDriverOption === opt.id}
                      onChange={() => setSelectedDriverOption(opt.id)}
                      className="accent-[#0B1F3A]"
                    />
                    <span className="text-slate-700">{locale === 'ur' ? opt.ur : opt.en}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Transmission */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                {locale === 'ur' ? 'ٹرانسمیشن' : 'Transmission'}
              </label>
              <div className="space-y-1.5 text-xs">
                {[
                  { id: 'all', en: 'All Gears', ur: 'تمام' },
                  { id: 'automatic', en: 'Automatic', ur: 'آٹومیٹک' },
                  { id: 'manual', en: 'Manual', ur: 'مینول' }
                ].map(opt => (
                  <label key={opt.id} className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50">
                    <input
                      type="radio"
                      name="transmission"
                      checked={selectedTransmission === opt.id}
                      onChange={() => setSelectedTransmission(opt.id)}
                      className="accent-[#0B1F3A]"
                    />
                    <span className="text-slate-700">{locale === 'ur' ? opt.ur : opt.en}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Max Daily Budget */}
            <div>
              <div className="flex justify-between items-center mb-1.5 text-xs font-bold">
                <span className="text-slate-700 uppercase tracking-wider">
                  {locale === 'ur' ? 'زیادہ سے زیادہ یومیہ بجٹ' : 'Max Daily Rate'}
                </span>
                <span className="text-[#0B1F3A] font-mono">
                  PKR {maxPrice.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={3000}
                max={40000}
                step={1000}
                value={maxPrice}
                onChange={e => setMaxPrice(parseInt(e.target.value))}
                className="w-full accent-[#0B1F3A]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Rs. 3,000</span>
                <span>Rs. 40,000+</span>
              </div>
            </div>
          </aside>

          {/* Cars Grid (3 cols) */}
          <main className="lg:col-span-3 space-y-6">
            {/* Sort & Count Header */}
            <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs text-xs">
              <span className="font-bold text-slate-700">
                {filteredVehicles.length} {locale === 'ur' ? 'گاڑیاں دستیاب' : 'Vehicles Found'}
              </span>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 hidden sm:inline">{locale === 'ur' ? 'ترتیب:' : 'Sort by:'}</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-semibold text-slate-700 focus:outline-hidden"
                >
                  <option value="featured">{locale === 'ur' ? 'نمایاں (تجویز کردہ)' : 'Featured First'}</option>
                  <option value="price-low">{locale === 'ur' ? 'کرایہ کم سے زیادہ' : 'Price: Low to High'}</option>
                  <option value="price-high">{locale === 'ur' ? 'کرایہ زیادہ سے کم' : 'Price: High to Low'}</option>
                  <option value="capacity">{locale === 'ur' ? 'نشستوں کی گنجائش' : 'Seating Capacity'}</option>
                  <option value="newest">{locale === 'ur' ? 'جدید ترین ماڈل' : 'Newest Model Year'}</option>
                </select>
              </div>
            </div>

            {/* Cards Grid */}
            {filteredVehicles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredVehicles.map(vehicle => (
                  <CarCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
                <Car className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-lg font-bold text-slate-800">
                  {locale === 'ur' ? 'کوئی گاڑی نہیں ملی' : 'No vehicles match your criteria'}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {locale === 'ur'
                    ? 'براہِ کرم فلٹرز میں ردوبدل کریں یا ہمارے مینیجر سے براہِ راست رابطہ کریں۔'
                    : 'Try clearing your filters or contact our 24/7 Sadiqabad booking desk directly.'}
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-5 py-2.5 rounded-xl bg-[#0B1F3A] text-white text-xs font-bold"
                >
                  {locale === 'ur' ? 'تمام فلٹرز ری سیٹ کریں' : 'Reset All Filters'}
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
