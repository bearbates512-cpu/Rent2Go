import React from 'react';
import { motion } from 'motion/react';
import { Vehicle } from '../../types/index.ts';
import { useApp } from '../../context/AppContext.tsx';
import { soundFX } from '../../utils/soundEffects.ts';
import {
  Users,
  Fuel,
  Gauge,
  Snowflake,
  ArrowRight,
  ArrowLeft,
  MessageSquare,
  Zap,
  Sparkles
} from 'lucide-react';

interface CarCardProps {
  vehicle: Vehicle;
  index?: number;
}

export const CarCard: React.FC<CarCardProps> = ({ vehicle, index = 0 }) => {
  const { locale, dir, navigateToCar, navigateToBooking, settings, getVehicleEffectivePrice } = useApp();

  const title = vehicle.title[locale] || vehicle.title.en;

  const {
    originalRate,
    discountedRate,
    hasDiscount,
    discountBadge,
    discountBadgeUr,
    discountPercent,
    savingsPerDay
  } = getVehicleEffectivePrice(vehicle);

  const prefilledWA = encodeURIComponent(
    locale === 'ur'
      ? `السلام علیکم! مجھے رینٹ ٹو گو کی گاڑی ${vehicle.make} ${vehicle.model} (${vehicle.modelYear}) کے کرایہ کی تفصیلات درکار ہیں۔${hasDiscount ? ` (خصوصی آفر: ${discountedRate} روپے یومیہ - بچت ${savingsPerDay} روپے)` : ''}`
      : `Hello Jam Rent A Car! I am interested in renting ${vehicle.make} ${vehicle.model} (${vehicle.modelYear}).${hasDiscount ? ` Special Offer: Rs. ${discountedRate?.toLocaleString()}/day (Save Rs. ${savingsPerDay.toLocaleString()})!` : ''} Please share availability.`
  );

  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98, filter: 'blur(2px)' },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.6,
        delay: (index % 3) * 0.08,
        ease: [0.16, 1, 0.3, 1] as const
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.12 }}
      onMouseEnter={() => soundFX.playHover()}
      className="group bg-white dark:bg-[#0B131F] rounded-3xl border border-black/5 dark:border-white/10 overflow-hidden flex flex-col transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
    >
      {/* Automotive Photography with Hover Zoom */}
      <div
        onClick={() => {
          soundFX.playClick();
          navigateToCar(vehicle.slug);
        }}
        className="relative aspect-16/10 bg-slate-950 overflow-hidden cursor-pointer"
      >
        <img
          src={vehicle.coverImage}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/cars/corolla-grande.jpg';
          }}
        />

        {/* Category & Chauffeur Overlay (Clean Minimalist Text) */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none z-10">
          <span className="px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-white text-[11px] font-mono tracking-wider uppercase">
            {vehicle.category}
          </span>
          <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-950 text-[11px] font-bold">
            {vehicle.driverOption === 'with_driver'
              ? (locale === 'ur' ? 'مع ڈرائیور' : 'With Driver')
              : (locale === 'ur' ? 'سیلف ڈرائیو' : 'Self Drive')}
          </span>
        </div>

        {/* Special Promotional Discount Badge */}
        {hasDiscount && (
          <div className="absolute bottom-3 start-3 z-10 pointer-events-none">
            <span className="px-3 py-1 rounded-full bg-[#F5B301] text-slate-950 text-[11px] font-black font-mono shadow-xl flex items-center gap-1 border border-black/10">
              <Zap className="w-3 h-3 fill-current" />
              <span>{locale === 'ur' ? (discountBadgeUr || discountBadge) : discountBadge}</span>
            </span>
          </div>
        )}
      </div>

      {/* Editorial Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-baseline justify-between gap-2 mb-1.5">
            <h3
              onClick={() => {
                soundFX.playClick();
                navigateToCar(vehicle.slug);
              }}
              className="text-lg sm:text-xl font-bold tracking-tight text-slate-950 dark:text-white hover:text-amber-500 transition-colors cursor-pointer"
            >
              {title}
            </h3>
            <span className="text-xs font-mono font-bold text-slate-400">
              {vehicle.modelYear}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {vehicle.description[locale] || vehicle.description.en}
          </p>

          {/* Clean Unboxed Metadata (Zero-Pill discipline from frontend-design) */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 pt-3 border-t border-black/5 dark:border-white/10 mt-3">
            <span>{vehicle.seats} {locale === 'ur' ? 'سیٹیں' : 'Seats'}</span>
            <span aria-hidden="true">·</span>
            <span className="capitalize">{vehicle.transmission}</span>
            <span aria-hidden="true">·</span>
            <span className="capitalize">{vehicle.fuelType}</span>
            <span aria-hidden="true">·</span>
            <span>{vehicle.hasAC ? (locale === 'ur' ? 'اے سی' : 'AC') : 'Non-AC'}</span>
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-3 border-t border-black/5 dark:border-white/10 space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                {locale === 'ur' ? 'یومیہ کرایہ' : 'Tariff'}
              </span>
              {hasDiscount ? (
                <div>
                  <span className="text-[11px] font-mono line-through text-slate-400 block">
                    Rs. {originalRate?.toLocaleString()}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-amber-500 font-mono">Rs.</span>
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-tight">
                      {discountedRate?.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">/{locale === 'ur' ? 'دن' : 'day'}</span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 font-mono block">
                    {locale === 'ur' ? `بچت: ${savingsPerDay.toLocaleString()} روپے / دن` : `Save Rs. ${savingsPerDay.toLocaleString()}/day`}
                  </span>
                </div>
              ) : vehicle.dailyRatePKR ? (
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-bold text-slate-400 font-mono">Rs.</span>
                  <span className="text-2xl font-black text-slate-950 dark:text-white font-mono tracking-tight">
                    {vehicle.dailyRatePKR.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">/{locale === 'ur' ? 'دن' : 'day'}</span>
                </div>
              ) : (
                <span className="text-xs font-bold text-amber-500">
                  {locale === 'ur' ? 'کرایہ معلوم کریں' : 'Custom Quote'}
                </span>
              )}
            </div>

            <button
              onClick={() => {
                soundFX.playClick();
                navigateToCar(vehicle.slug);
              }}
              className="text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-amber-500 inline-flex items-center gap-1 group/btn cursor-pointer"
            >
              <span>{locale === 'ur' ? 'تفصیلات' : 'Details'}</span>
              <ArrowIcon className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                soundFX.playClick();
                navigateToBooking(vehicle.id);
              }}
              className="w-full py-3 px-4 rounded-2xl bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-xs font-bold transition-all text-center flex items-center justify-center cursor-pointer active:scale-95 shadow-sm"
            >
              {locale === 'ur' ? 'گاڑی بک کریں' : 'Book Now'}
            </button>

            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${prefilledWA}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFX.playClick()}
              className="w-full py-3 px-4 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 active:scale-95"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
