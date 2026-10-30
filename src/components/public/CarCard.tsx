import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Vehicle } from '../../types/index.ts';
import { useApp } from '../../context/AppContext.tsx';
import { soundFX } from '../../utils/soundEffects.ts';
import { CarSpecsModal } from './CarSpecsModal.tsx';
import {
  Users,
  Fuel,
  Gauge,
  Snowflake,
  ShieldCheck,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Eye,
  Zap,
  Navigation
} from 'lucide-react';

interface CarCardProps {
  vehicle: Vehicle;
}

export const CarCard: React.FC<CarCardProps> = ({ vehicle }) => {
  const { locale, dir, navigateToCar, navigateToBooking, settings } = useApp();
  const [specsModalOpen, setSpecsModalOpen] = useState(false);

  const title = vehicle.title[locale] || vehicle.title.en;

  const prefilledWA = encodeURIComponent(
    locale === 'ur'
      ? `السلام علیکم! مجھے رینٹ ٹو گو کی گاڑی ${vehicle.make} ${vehicle.model} (${vehicle.modelYear}) کے کرایہ کی تفصیلات درکار ہیں۔`
      : `Hello Rent2Go! I am interested in renting ${vehicle.make} ${vehicle.model} (${vehicle.modelYear}). Please share current availability and quote.`
  );

  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        whileHover={{ y: -6 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        onMouseEnter={() => soundFX.playHover()}
        className="bg-white dark:bg-[#0B1523] rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-slate-900/10 dark:hover:shadow-cyan-950/30 hover:border-amber-400/50 dark:hover:border-amber-400/50 transition-all duration-300 overflow-hidden flex flex-col group relative"
      >
        {/* Subtle Ambient Top Border Highlight on Hover */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

        {/* Photo Container */}
        <div className="relative aspect-16/10 bg-slate-950 overflow-hidden">
          <img
            src={vehicle.coverImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/cars/corolla-grande.jpg';
            }}
          />

          {/* Subtle reflection sweep */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

          {/* Top Badges */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-10">
            <span className="px-2.5 py-1 rounded-lg bg-[#0B1F3A]/85 dark:bg-black/85 backdrop-blur-md text-cyan-300 border border-cyan-400/30 text-[10px] font-mono font-bold tracking-wide uppercase">
              {vehicle.category}
            </span>

            {vehicle.driverOption === 'with_driver' ? (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-bold">
                {locale === 'ur' ? 'مع ڈرائیور' : 'With Driver'}
              </span>
            ) : vehicle.driverOption === 'self_drive' ? (
              <span className="px-2.5 py-1 rounded-lg bg-indigo-600/90 backdrop-blur-md text-white text-[10px] font-bold">
                {locale === 'ur' ? 'سیلف ڈرائیو' : 'Self-Drive'}
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-[#0B1F3A] text-[10px] font-bold">
                {locale === 'ur' ? 'ڈرائیور یا سیلف' : 'Driver / Self'}
              </span>
            )}
          </div>

          {/* Quick HUD Scan Action Overlay */}
          <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between pointer-events-auto">
            <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[10px] font-mono text-slate-300 border border-white/15">
              {vehicle.customFields?.registrationNumber || 'RYK-2024'}
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                soundFX.playScan();
                setSpecsModalOpen(true);
              }}
              className="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-amber-300 border border-amber-400/40 text-[10px] font-mono font-bold hover:bg-amber-500 hover:text-[#0B1F3A] transition-all flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
            >
              <Eye className="w-3 h-3 text-cyan-300" />
              <span>HUD Specs</span>
            </button>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-baseline justify-between gap-2 mb-1">
              <h3
                onClick={() => {
                  soundFX.playClick();
                  navigateToCar(vehicle.slug);
                }}
                className="text-base sm:text-lg font-black text-[#0B1F3A] dark:text-white hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer transition-colors line-clamp-1"
              >
                {title}
              </h3>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0 font-mono">
                {vehicle.modelYear}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
              {vehicle.description[locale] || vehicle.description.en}
            </p>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-4 gap-1.5 py-2.5 border-y border-slate-100 dark:border-slate-800 mb-3.5 text-slate-600 dark:text-slate-300 text-xs">
              <div className="flex flex-col items-center justify-center p-1.5 bg-slate-50 dark:bg-slate-900/90 border border-transparent dark:border-slate-800/80 rounded-xl text-center">
                <Users className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 mb-0.5" />
                <span className="font-bold text-[11px]">{vehicle.seats} {locale === 'ur' ? 'سیٹیں' : 'Seats'}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-1.5 bg-slate-50 dark:bg-slate-900/90 border border-transparent dark:border-slate-800/80 rounded-xl text-center">
                <Gauge className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 mb-0.5" />
                <span className="font-bold text-[11px] capitalize">{vehicle.transmission}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-1.5 bg-slate-50 dark:bg-slate-900/90 border border-transparent dark:border-slate-800/80 rounded-xl text-center">
                <Snowflake className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 mb-0.5" />
                <span className="font-bold text-[11px] text-blue-700 dark:text-blue-300">{vehicle.hasAC ? (locale === 'ur' ? 'اے سی' : 'Chilled AC') : 'No AC'}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-1.5 bg-slate-50 dark:bg-slate-900/90 border border-transparent dark:border-slate-800/80 rounded-xl text-center">
                <Fuel className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 mb-0.5" />
                <span className="font-bold text-[11px] capitalize">{vehicle.fuelType}</span>
              </div>
            </div>
          </div>

          {/* Pricing & CTA */}
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400 block">
                  {locale === 'ur' ? 'یومیہ کرایہ' : 'Daily Tariff'}
                </span>
                {vehicle.dailyRatePKR ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 font-mono">PKR</span>
                    <span className="text-xl font-black text-[#0B1F3A] dark:text-white font-mono">
                      {vehicle.dailyRatePKR.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">/{locale === 'ur' ? 'دن' : 'day'}</span>
                  </div>
                ) : (
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-md inline-block">
                    {locale === 'ur' ? 'کرایہ معلوم کریں' : 'Contact for quote'}
                  </span>
                )}
              </div>

              <button
                onClick={() => {
                  soundFX.playClick();
                  navigateToCar(vehicle.slug);
                }}
                className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-[#0B1F3A] dark:hover:text-amber-400 inline-flex items-center gap-1 group/link cursor-pointer"
              >
                <span>{locale === 'ur' ? 'تفصیلات' : 'Details'}</span>
                <ArrowIcon className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  soundFX.playClick();
                  navigateToBooking(vehicle.id);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-[#0B1F3A] hover:bg-[#142F57] dark:bg-[#F5B301] dark:hover:bg-amber-400 text-[#F5B301] hover:text-white dark:text-[#0B1F3A] dark:hover:text-[#0B1F3A] text-xs font-bold shadow-sm transition-all text-center flex items-center justify-center gap-1 cursor-pointer active:scale-95"
              >
                {locale === 'ur' ? 'گاڑی بک کریں' : 'Request Booking'}
              </button>

              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=${prefilledWA}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundFX.playClick()}
                className="w-full py-2.5 px-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 dark:bg-[#25D366]/20 dark:hover:bg-[#25D366]/30 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40 text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 active:scale-95"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 fill-emerald-600 dark:fill-emerald-400" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Specs Inspector Modal */}
      {specsModalOpen && (
        <CarSpecsModal
          vehicle={vehicle}
          onClose={() => setSpecsModalOpen(false)}
        />
      )}
    </>
  );
};
