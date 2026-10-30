import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Banknote, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';

export const RatesView: React.FC = () => {
  const { vehicles, locale, dir, navigateToBooking } = useApp();

  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#060D17] text-slate-800 dark:text-slate-100 min-h-screen py-12 transition-colors duration-250">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 px-3 py-1 rounded-full uppercase tracking-wider border border-amber-200 dark:border-amber-400/30">
            {locale === 'ur' ? 'شفاف کرایہ پالیسی' : '100% Transparent Tariffs'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] dark:text-white mt-2">
            {locale === 'ur' ? 'گاڑیوں کا مکمل کرایہ نامہ' : 'Fleet Rates & Pricing Packages'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 leading-relaxed">
            {locale === 'ur'
              ? 'کوئی چھپے ہوئے چارجز نہیں۔ ہر گاڑی کا روزانہ کا ریٹ اور ڈرائیور فیس واضح طور پر درج ہے۔'
              : 'Zero hidden surprises. Standard daily tariffs for Sadiqabad, Rahim Yar Khan, and all-Pakistan highway routes.'}
          </p>
        </div>

        {/* Rates Table Card */}
        <div className="bg-white dark:bg-[#0B1523] rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden mb-12 transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs sm:text-sm">
              <thead className="bg-[#0B1F3A] dark:bg-slate-900 text-white font-bold uppercase text-[11px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-4 px-4 sm:px-6 text-start">{locale === 'ur' ? 'گاڑی کا ماڈل' : 'Vehicle Model'}</th>
                  <th className="py-4 px-4 sm:px-6 text-start">{locale === 'ur' ? 'کیٹیگری' : 'Category'}</th>
                  <th className="py-4 px-4 sm:px-6 text-start">{locale === 'ur' ? 'نشستیں' : 'Capacity'}</th>
                  <th className="py-4 px-4 sm:px-6 text-start">{locale === 'ur' ? 'یومیہ کرایہ (بغیر ڈرائیور)' : 'Daily Rate (Base)'}</th>
                  <th className="py-4 px-4 sm:px-6 text-start">{locale === 'ur' ? 'ڈرائیور الاؤنس' : 'Driver Allowance'}</th>
                  <th className="py-4 px-4 sm:px-6 text-end">{locale === 'ur' ? 'بکنگ' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {vehicles
                  .filter(v => v.visibility === 'published')
                  .map((veh, i) => (
                    <tr key={veh.id} className={i % 2 === 0 ? 'bg-white dark:bg-[#0B1523]' : 'bg-slate-50/50 dark:bg-[#0E1B2D]/50'}>
                      <td className="py-4 px-4 sm:px-6 font-bold text-slate-800 dark:text-white flex items-center gap-3">
                        <img
                          src={veh.coverImage}
                          alt={veh.make}
                          className="w-12 h-9 rounded-lg object-cover shrink-0 hidden sm:inline-block"
                        />
                        <div>
                          <span>{veh.make} {veh.model}</span>
                          <span className="text-xs text-slate-400 block font-normal">{veh.modelYear} • {veh.transmission}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 sm:px-6 uppercase text-xs font-semibold text-slate-600 dark:text-slate-300">
                        {veh.category}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-slate-700 dark:text-slate-300">
                        {veh.seats} {locale === 'ur' ? 'افراد' : 'Seats'}
                      </td>
                      <td className="py-4 px-4 sm:px-6 font-mono font-bold text-[#0B1F3A] dark:text-[#F5B301]">
                        {veh.dailyRatePKR ? `PKR ${veh.dailyRatePKR.toLocaleString()}` : (
                          <span className="text-amber-700 dark:text-amber-300 font-sans font-semibold text-xs">
                            {locale === 'ur' ? 'رابطہ کریں' : 'Custom Quote'}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-slate-600 dark:text-slate-400 font-mono">
                        PKR {veh.driverDailyFeePKR.toLocaleString()}/day
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-end">
                        <button
                          onClick={() => navigateToBooking(veh.id)}
                          className="px-3.5 py-1.5 rounded-lg bg-[#0B1F3A] hover:bg-[#142F57] dark:bg-[#F5B301] dark:hover:bg-amber-400 text-[#F5B301] hover:text-white dark:text-[#0B1F3A] text-xs font-bold transition-all cursor-pointer"
                        >
                          {locale === 'ur' ? 'بک کریں' : 'Book'}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pricing Policies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-[#0B1523] rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-cyan-400 flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">
              {locale === 'ur' ? 'پیٹرول پالیسی (ٹینکی سے ٹینکی)' : 'Fuel Policy (Tank-to-Tank)'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {locale === 'ur'
                ? 'گاڑی جتنے پیٹرول کی مقدار کے ساتھ دی جائے گی، واپسی پر اتنی ہی پیٹرول کی مقدار پر واپس لی جائے گی۔'
                : 'Vehicles are dispatched with a verified fuel level and must be returned with the same quantity.'}
            </p>
          </div>

          <div className="bg-white dark:bg-[#0B1523] rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">
              {locale === 'ur' ? 'اوور ٹائم اور تاخیر کی فیس' : 'Overtime & Late Returns'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {locale === 'ur'
                ? '2 گھنٹے سے زیادہ تاخیر پر فی گھنٹہ معیاری چارجز لاگو ہوں گے۔ کسٹمر سروس کو قبل از وقت آگاہ کریں۔'
                : 'A grace period of up to 1 hour is permitted. Further delays incur standard hourly overtime billing.'}
            </p>
          </div>

          <div className="bg-white dark:bg-[#0B1523] rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">
              {locale === 'ur' ? 'سیکیورٹی ڈپازٹ واپسی' : 'Refundable Security Deposit'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {locale === 'ur'
                ? 'سیلف ڈرائیو پر لیا جانے والا سیکیورٹی ڈپازٹ گاڑی کے محفوظ معائنے کے فوری بعد واپس کر دیا جاتا ہے۔'
                : 'Refundable security deposits for self-drive rentals are returned instantly upon vehicle inspection.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
