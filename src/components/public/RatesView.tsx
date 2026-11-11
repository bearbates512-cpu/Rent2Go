import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext.tsx';
import { soundFX } from '../../utils/soundEffects.ts';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export const RatesView: React.FC = () => {
  const { vehicles, locale, dir, navigateToBooking, getVehicleEffectivePrice } = useApp();
  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <div className="bg-[#FAF9F6] dark:bg-[#070D18] text-slate-900 dark:text-slate-100 min-h-screen py-16 transition-colors duration-250 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Editorial Header */}
        <div className="space-y-4 border-b border-black/5 dark:border-white/10 pb-8">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-400">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>{locale === 'ur' ? 'شفاف کرایہ پالیسی' : '100% TRANSPARENT TARIFF'}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-mono tracking-tight text-slate-950 dark:text-white">
            {locale === 'ur' ? 'گاڑیوں کا مکمل کرایہ نامہ' : 'Fleet Rates & Tariffs.'}
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            {locale === 'ur'
              ? 'کوئی چھپے ہوئے چارجز نہیں۔ ہر گاڑی کا روزانہ کا ریٹ اور ڈرائیور فیس واضح طور پر درج ہے۔'
              : 'Zero hidden surprises. Standard daily tariffs for Sadiqabad, Rahim Yar Khan, and all-Pakistan highway routes.'}
          </p>
        </div>

        {/* Rates Table in Drkst Minimalist Style */}
        <div className="bg-white dark:bg-[#0B131F] rounded-3xl border border-black/5 dark:border-white/10 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs sm:text-sm font-mono">
              <thead className="bg-slate-950 text-white uppercase text-[11px] tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-5 px-6 text-start">{locale === 'ur' ? 'گاڑی کا ماڈل' : 'Vehicle Model'}</th>
                  <th className="py-5 px-6 text-start">{locale === 'ur' ? 'کیٹیگری' : 'Category'}</th>
                  <th className="py-5 px-6 text-start">{locale === 'ur' ? 'نشستیں' : 'Seats'}</th>
                  <th className="py-5 px-6 text-start">{locale === 'ur' ? 'یومیہ کرایہ' : 'Daily Base'}</th>
                  <th className="py-5 px-6 text-start">{locale === 'ur' ? 'ڈرائیور الاؤنس' : 'Driver Fee'}</th>
                  <th className="py-5 px-6 text-end">{locale === 'ur' ? 'کارروائی' : 'Book'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/10">
                {vehicles
                  .filter(v => v.visibility === 'published')
                  .map((veh) => {
                    const pricing = getVehicleEffectivePrice(veh);
                    return (
                      <tr
                        key={veh.id}
                        className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                      >
                        <td className="py-5 px-6 font-bold text-slate-950 dark:text-white flex items-center gap-3">
                          <img
                            src={veh.coverImage}
                            alt={veh.make}
                            className="w-12 h-9 rounded-lg object-cover shrink-0 hidden sm:inline-block"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold">{veh.make} {veh.model}</span>
                              {pricing.hasDiscount && (
                                <span className="px-2 py-0.5 rounded-full bg-[#F5B301] text-slate-950 text-[9px] font-black font-mono">
                                  {locale === 'ur' ? (pricing.discountBadgeUr || pricing.discountBadge) : pricing.discountBadge}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 block font-normal">{veh.modelYear} · {veh.transmission}</span>
                          </div>
                        </td>
                        <td className="py-5 px-6 uppercase text-xs text-slate-600 dark:text-slate-400">
                          {veh.category}
                        </td>
                        <td className="py-5 px-6 text-slate-700 dark:text-slate-300">
                          {veh.seats} {locale === 'ur' ? 'افراد' : 'Seats'}
                        </td>
                        <td className="py-5 px-6 font-bold text-slate-950 dark:text-amber-400">
                          {pricing.hasDiscount ? (
                            <div>
                              <span className="text-slate-400 line-through text-[11px] block">
                                Rs. {pricing.originalRate?.toLocaleString()}
                              </span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-black text-sm">
                                Rs. {pricing.discountedRate?.toLocaleString()}
                              </span>
                              <span className="text-[10px] text-slate-400 font-normal">/{locale === 'ur' ? 'دن' : 'day'}</span>
                            </div>
                          ) : veh.dailyRatePKR ? (
                            <span>Rs. {veh.dailyRatePKR.toLocaleString()}</span>
                          ) : (
                            <span className="text-amber-500 font-sans text-xs">
                              {locale === 'ur' ? 'رابطہ کریں' : 'Custom Quote'}
                            </span>
                          )}
                        </td>
                        <td className="py-5 px-6 text-slate-500 dark:text-slate-400">
                          Rs. {veh.driverDailyFeePKR.toLocaleString()}/day
                        </td>
                        <td className="py-5 px-6 text-end">
                          <button
                            onClick={() => {
                              soundFX.playClick();
                              navigateToBooking(veh.id);
                            }}
                            className="px-4 py-2 rounded-full bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
                          >
                            {locale === 'ur' ? 'بک کریں' : 'Book'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
