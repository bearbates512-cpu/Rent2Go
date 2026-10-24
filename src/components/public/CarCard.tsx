import React from 'react';
import { Vehicle } from '../../types/index.ts';
import { useApp } from '../../context/AppContext.tsx';
import { Users, Fuel, Gauge, Snowflake, ShieldCheck, MessageSquare, ArrowRight, ArrowLeft } from 'lucide-react';

interface CarCardProps {
  vehicle: Vehicle;
}

export const CarCard: React.FC<CarCardProps> = ({ vehicle }) => {
  const { locale, dir, navigateToCar, navigateToBooking, settings } = useApp();

  const title = vehicle.title[locale] || vehicle.title.en;

  const prefilledWA = encodeURIComponent(
    locale === 'ur'
      ? `السلام علیکم! مجھے رینٹ ٹو گو کی گاڑی ${vehicle.make} ${vehicle.model} (${vehicle.modelYear}) کے کرایہ کی تفصیلات درکار ہیں۔`
      : `Hello Rent2Go! I am interested in renting ${vehicle.make} ${vehicle.model} (${vehicle.modelYear}). Please share current availability and quote.`
  );

  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 overflow-hidden flex flex-col group">
      {/* Photo Container */}
      <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
        <img
          src={vehicle.coverImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/cars/corolla-grande.jpg';
          }}
        />

        {/* Badges Top */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-1 rounded-md bg-[#0B1F3A]/90 backdrop-blur-xs text-white text-[11px] font-bold tracking-wide uppercase">
            {vehicle.category}
          </span>
          {vehicle.driverOption === 'with_driver' ? (
            <span className="px-2.5 py-1 rounded-md bg-emerald-600/90 backdrop-blur-xs text-white text-[11px] font-bold">
              {locale === 'ur' ? 'مع ڈرائیور' : 'With Driver'}
            </span>
          ) : vehicle.driverOption === 'self_drive' ? (
            <span className="px-2.5 py-1 rounded-md bg-indigo-600/90 backdrop-blur-xs text-white text-[11px] font-bold">
              {locale === 'ur' ? 'سیلف ڈرائیو' : 'Self-Drive'}
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-md bg-amber-500 text-[#0B1F3A] text-[11px] font-bold">
              {locale === 'ur' ? 'ڈرائیور یا سیلف' : 'Driver / Self'}
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline justify-between gap-2 mb-1.5">
            <h3
              onClick={() => navigateToCar(vehicle.slug)}
              className="text-lg font-bold text-[#0B1F3A] hover:text-amber-600 cursor-pointer transition-colors line-clamp-1"
            >
              {title}
            </h3>
            <span className="text-xs font-semibold text-slate-500 shrink-0 font-mono">
              {vehicle.modelYear}
            </span>
          </div>

          <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
            {vehicle.description[locale] || vehicle.description.en}
          </p>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-4 gap-1.5 py-2.5 border-y border-slate-100 mb-4 text-slate-600 text-xs">
            <div className="flex flex-col items-center justify-center p-1 bg-slate-50 rounded-lg text-center" title="Seats">
              <Users className="w-3.5 h-3.5 text-slate-500 mb-0.5" />
              <span className="font-semibold text-[11px]">{vehicle.seats} {locale === 'ur' ? 'سیٹ' : 'Seats'}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-1 bg-slate-50 rounded-lg text-center" title="Transmission">
              <Gauge className="w-3.5 h-3.5 text-slate-500 mb-0.5" />
              <span className="font-semibold text-[11px] capitalize">{vehicle.transmission}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-1 bg-slate-50 rounded-lg text-center" title="Air Conditioning">
              <Snowflake className="w-3.5 h-3.5 text-blue-500 mb-0.5" />
              <span className="font-semibold text-[11px]">{vehicle.hasAC ? (locale === 'ur' ? 'اے سی' : 'Chilled AC') : 'No AC'}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-1 bg-slate-50 rounded-lg text-center" title="Fuel Type">
              <Fuel className="w-3.5 h-3.5 text-slate-500 mb-0.5" />
              <span className="font-semibold text-[11px] capitalize">{vehicle.fuelType}</span>
            </div>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <div>
              <span className="text-[11px] text-slate-500 block">
                {locale === 'ur' ? 'یومیہ کرایہ' : 'Daily Tariff'}
              </span>
              {vehicle.dailyRatePKR ? (
                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-semibold text-slate-700">PKR</span>
                  <span className="text-xl font-extrabold text-[#0B1F3A] font-mono">
                    {vehicle.dailyRatePKR.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500">/{locale === 'ur' ? 'دن' : 'day'}</span>
                </div>
              ) : (
                <span className="text-sm font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md inline-block">
                  {locale === 'ur' ? 'کرایہ معلوم کریں' : 'Contact for quote'}
                </span>
              )}
            </div>

            <button
              onClick={() => navigateToCar(vehicle.slug)}
              className="text-xs font-bold text-slate-600 hover:text-[#0B1F3A] inline-flex items-center gap-1 group/link"
            >
              <span>{locale === 'ur' ? 'تفصیلات' : 'Details'}</span>
              <ArrowIcon className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => navigateToBooking(vehicle.id)}
              className="w-full py-2.5 px-3 rounded-xl bg-[#0B1F3A] hover:bg-[#142F57] text-white text-xs font-bold shadow-sm transition-all text-center flex items-center justify-center gap-1"
            >
              {locale === 'ur' ? 'گاڑی بک کریں' : 'Request Booking'}
            </button>

            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${prefilledWA}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
