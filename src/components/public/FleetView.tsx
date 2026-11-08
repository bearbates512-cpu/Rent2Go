import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext.tsx';
import { soundFX } from '../../utils/soundEffects.ts';
import { CarCard } from './CarCard.tsx';
import { Search, X, SlidersHorizontal, ArrowLeft, ArrowRight } from 'lucide-react';
import { VehicleCategory } from '../../types/index.ts';

export const FleetView: React.FC = () => {
  const {
    vehicles,
    locale,
    dir,
    filterCategory,
    setFilterCategory,
    setCurrentView
  } = useApp();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTransmission, setSelectedTransmission] = useState<string>('all');
  const [selectedDriverOption, setSelectedDriverOption] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(45000);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  const categories: { id: VehicleCategory | 'all'; en: string; ur: string }[] = [
    { id: 'all', en: 'All Fleet', ur: 'تمام گاڑیاں' },
    { id: 'suv', en: 'SUVs & 4x4', ur: 'ایس یو وی' },
    { id: 'sedan', en: 'Executive Sedans', ur: 'سیڈان' },
    { id: 'luxury', en: 'Luxury VIP', ur: 'وی آئی پی' },
    { id: 'hatchback', en: 'Economy & City', ur: 'اکانومی' },
    { id: 'van', en: 'Passenger Vans', ur: 'ہائی ایس وین' }
  ];

  // Filtering logic
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter(v => {
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
        return (a.featuredOrder || 99) - (b.featuredOrder || 99);
      });
  }, [vehicles, filterCategory, selectedTransmission, selectedDriverOption, maxPrice, searchTerm, sortBy]);

  const clearAllFilters = () => {
    setFilterCategory(null);
    setSearchTerm('');
    setSelectedTransmission('all');
    setSelectedDriverOption('all');
    setMaxPrice(45000);
    setSortBy('featured');
  };

  const hasActiveFilters =
    Boolean(filterCategory && filterCategory !== 'all') ||
    Boolean(searchTerm) ||
    selectedTransmission !== 'all' ||
    selectedDriverOption !== 'all' ||
    maxPrice < 45000;

  return (
    <div className="bg-[#FAF9F6] dark:bg-[#070D18] text-slate-900 dark:text-slate-100 min-h-screen py-16 transition-colors duration-250 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Header with Drkst Editorial Typography */}
        <div className="space-y-4 mb-12 border-b border-black/5 dark:border-white/10 pb-8">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-400">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>{locale === 'ur' ? 'صادق آباد پریمیم فلیٹ گیلری' : 'SADIQABAD VERIFIED FLEET'}</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl sm:text-6xl font-black font-mono tracking-tight text-slate-950 dark:text-white">
                {locale === 'ur' ? 'گاڑیاں اور روزانہ کا کرایہ نامہ' : 'The Fleet Collection.'}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
                {locale === 'ur'
                  ? 'صادق آباد، رحیم یار خان اور موٹروے کے لیے مکمل جانچ شدہ گاڑیاں شفاف یومیہ ریٹس کے ساتھ۔'
                  : 'Engineered for highway endurance and executive travel. Transparent daily tariffs with zero hidden surcharges.'}
              </p>
            </div>

            {/* Search Input with Stealth Admin Route Detection */}
            <div className="flex items-center gap-2 w-full lg:w-72">
              <div className="relative w-full">
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
                  placeholder={locale === 'ur' ? 'گاڑی تلاش کریں (کرولا، فارچونر...)' : 'Search by model name...'}
                  className="w-full ps-10 pe-4 py-3 rounded-2xl border border-black/10 dark:border-white/10 text-xs font-bold bg-white dark:bg-[#0C121E] text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-slate-950 dark:focus:ring-white"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden p-3 rounded-2xl bg-white dark:bg-[#0C121E] border border-black/10 dark:border-white/10 text-slate-700 dark:text-slate-300"
                aria-label="Filter"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 no-scrollbar">
            {categories.map(cat => {
              const isActive = (filterCategory === cat.id) || (cat.id === 'all' && (!filterCategory || filterCategory === 'all'));
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    soundFX.playClick();
                    setFilterCategory(cat.id === 'all' ? null : cat.id);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-md'
                      : 'bg-white dark:bg-[#0C121E] border border-black/5 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  {locale === 'ur' ? cat.ur : cat.en}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cars Grid & Results count */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-6">
          <span>{filteredVehicles.length} {locale === 'ur' ? 'گاڑیاں دستیاب' : 'Vehicles Available'}</span>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-amber-500 hover:underline font-bold"
            >
              {locale === 'ur' ? 'فلٹرز ری سیٹ کریں' : 'Reset Filters'}
            </button>
          )}
        </div>

        {filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVehicles.map((car, idx) => (
              <CarCard key={car.id} vehicle={car} index={idx} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-4">
            <p className="text-base text-slate-500 font-mono">
              {locale === 'ur' ? 'مطلوبہ معیار کے مطابق کوئی گاڑی نہیں ملی۔' : 'No vehicles matched your search filter.'}
            </p>
            <button
              onClick={clearAllFilters}
              className="px-6 py-2.5 rounded-full bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-xs font-mono font-bold"
            >
              {locale === 'ur' ? 'تمام گاڑیاں دیکھیں' : 'Show All Fleet'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
