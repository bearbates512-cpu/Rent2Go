import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Vehicle } from '../../types/index.ts';
import { useApp } from '../../context/AppContext.tsx';
import { soundFX } from '../../utils/soundEffects.ts';
import {
  X,
  ShieldCheck,
  Gauge,
  Snowflake,
  Fuel,
  Users,
  Navigation,
  SlidersHorizontal,
  CheckCircle2,
  Calendar,
  MessageSquare,
  ArrowRight,
  Zap,
  Sparkles
} from 'lucide-react';

interface CarSpecsModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
}

export const CarSpecsModal: React.FC<CarSpecsModalProps> = ({ vehicle, onClose }) => {
  const { locale, navigateToBooking, settings } = useApp();
  const [rentalDays, setRentalDays] = useState<number>(3);
  const [withDriver, setWithDriver] = useState<boolean>(true);

  if (!vehicle) return null;

  const title = vehicle.title[locale] || vehicle.title.en;
  const description = vehicle.description[locale] || vehicle.description.en;

  // Real time interactive calculation
  const dailyRate = vehicle.dailyRatePKR || 6000;
  const driverFee = vehicle.driverDailyFeePKR || 1500;
  const totalBase = dailyRate * rentalDays;
  const totalDriver = withDriver ? driverFee * rentalDays : 0;
  const grandTotal = totalBase + totalDriver;

  const prefilledWA = encodeURIComponent(
    locale === 'ur'
      ? `السلام علیکم! مجھے رینٹ ٹو گو کی گاڑی ${vehicle.make} ${vehicle.model} (${vehicle.modelYear}) کے ${rentalDays} دن کے کرایہ کی تصدیق درکار ہے۔`
      : `Hello Rent2Go! I am inquiring about renting ${vehicle.make} ${vehicle.model} (${vehicle.modelYear}) for ${rentalDays} days.`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ duration: 0.24, ease: 'easeOut' }}
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-gradient-to-b from-[#0F223D] via-[#0B1A2E] to-[#07111E] border border-cyan-500/30 rounded-3xl shadow-2xl shadow-cyan-950/80 p-5 sm:p-7 text-white space-y-5"
      >
        {/* Holographic Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-400/40 text-cyan-300">
              <Zap className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase block">
                VEHICLE TELEMETRY HUD · SADIQABAD HUB
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white leading-tight">{title}</h2>
            </div>
          </div>

          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vehicle Showcase Image with HUD badges */}
        <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-slate-950 border border-white/10">
          <img
            src={vehicle.coverImage}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/cars/corolla-grande.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-cyan-400/40 text-cyan-300 font-mono text-[11px] font-bold uppercase">
              {vehicle.category}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-[#0B1F3A] font-mono text-[11px] font-bold">
              {vehicle.modelYear}
            </span>
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
            <span className="font-mono text-cyan-300 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5" />
              <span>REG: {vehicle.customFields?.registrationNumber || 'REGISTERED'}</span>
            </span>
            <span className="font-mono text-amber-400 font-bold">
              ODOMETER: {vehicle.customFields?.odometerKm?.toLocaleString() || '35,000'} KM
            </span>
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] text-slate-400 block uppercase">Transmission</span>
            <div className="flex items-center gap-1.5 font-bold text-white capitalize">
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              <span>{vehicle.transmission}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] text-slate-400 block uppercase">Air Condition</span>
            <div className="flex items-center gap-1.5 font-bold text-emerald-400">
              <Snowflake className="w-3.5 h-3.5 text-blue-400" />
              <span>Chilled Cool</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] text-slate-400 block uppercase">Seating</span>
            <div className="flex items-center gap-1.5 font-bold text-white">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>{vehicle.seats} Passengers</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] text-slate-400 block uppercase">Fuel Type</span>
            <div className="flex items-center gap-1.5 font-bold text-white capitalize">
              <Fuel className="w-3.5 h-3.5 text-purple-400" />
              <span>{vehicle.fuelType}</span>
            </div>
          </div>
        </div>

        {/* Interactive Real-Time Fare Calculator HUD */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-amber-500/30 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Live Fare Estimator</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Daily Base: PKR {dailyRate.toLocaleString()}
            </span>
          </div>

          {/* Days slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Rental Duration:</span>
              <span className="text-amber-300 font-bold">{rentalDays} {rentalDays === 1 ? 'Day' : 'Days'}</span>
            </div>
            <input
              type="range"
              min={1}
              max={15}
              value={rentalDays}
              onChange={e => {
                soundFX.playBeep(500 + Number(e.target.value) * 30, 0.03, 0.02);
                setRentalDays(Number(e.target.value));
              }}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>1 Day</span>
              <span>7 Days</span>
              <span>15 Days</span>
            </div>
          </div>

          {/* Driver Toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-200">
              <input
                type="checkbox"
                checked={withDriver}
                onChange={e => {
                  soundFX.playClick();
                  setWithDriver(e.target.checked);
                }}
                className="w-4 h-4 accent-amber-400"
              />
              <span>Include Professional Chauffeur (+PKR {driverFee.toLocaleString()}/day)</span>
            </label>
          </div>

          {/* Total Output */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between font-mono">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Estimated Total</span>
              <span className="text-xs text-slate-300">
                {rentalDays} days {withDriver ? 'with Chauffeur' : 'self-drive'}
              </span>
            </div>
            <div className="text-end">
              <span className="text-xl sm:text-2xl font-black text-amber-400">
                PKR {grandTotal.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2 border-t border-white/10">
          <a
            href={`https://wa.me/${settings.whatsappNumber}?text=${prefilledWA}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundFX.playClick()}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            <span>Confirm on WhatsApp</span>
          </a>

          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
              navigateToBooking(vehicle.id);
            }}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#F5B301] to-amber-400 hover:from-amber-400 hover:to-amber-300 text-[#0B1F3A] text-xs font-black shadow-lg shadow-amber-500/20 active:scale-95 transition-all text-center flex items-center justify-center gap-1.5"
          >
            <span>Proceed to Online Booking</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
