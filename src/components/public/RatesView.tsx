import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Banknote, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';

export const RatesView: React.FC = () => {
  const { vehicles, locale, dir, navigateToBooking } = useApp();

  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider border border-amber-200">
            {locale === 'ur' ? 'شفاف کرایہ پالیسی' : '100% Transparent Tariffs'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] mt-2">
            {locale === 'ur' ? 'گاڑیوں کا مکمل کرایہ نامہ' : 'Fleet Rates & Pricing Packages'}
          </h1>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed">
            {locale === 'ur'
              ? 'کوئی چھپے ہوئے چارجز نہیں۔ ہر گاڑی کا روزانہ کا ریٹ اور ڈرائیور فیس واضح طور پر درج ہے۔'
              : 'Zero hidden surprises. Standard daily tariffs for Sadiqabad, Rahim Yar Khan, and all-Pakistan highway routes.'}
          </p>
        </div>

        {/* Rates Table Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden mb-12">
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs sm:text-sm">
              <thead className="bg-[#0B1F3A] text-white font-bold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-4 px-4 sm:px-6 text-start">{locale === 'ur' ? 'گاڑی کا ماڈل' : 'Vehicle Model'}</th>
                  <th className="py-4 px-4 sm:px-6 text-start">{locale === 'ur' ? 'کیٹیگری' : 'Category'}</th>
                  <th className="py-4 px-4 sm:px-6 text-start">{locale === 'ur' ? 'نشستیں' : 'Capacity'}</th>
                  <th className="py-4 px-4 sm:px-6 text-start">{locale === 'ur' ? 'یومیہ کرایہ (بغیر ڈرائیور)' : 'Daily Rate (Base)'}</th>
                  <th className="py-4 px-4 sm:px-6 text-start">{locale === 'ur' ? 'ڈرائیور الاؤنس' : 'Driver Allowance'}</th>
                  <th className="py-4 px-4 sm:px-6 text-end">{locale === 'ur' ? 'بکنگ' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vehicles
                  .filter(v => v.visibility === 'published')
                  .map((veh, i) => (
                    <tr key={veh.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                      <td className="py-4 px-4 sm:px-6 font-bold text-slate-800 flex items-center gap-3">
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
                      <td className="py-4 px-4 sm:px-6 uppercase text-xs font-semibold text-slate-600">
                        {veh.category}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-slate-700">
                        {veh.seats} {locale === 'ur' ? 'افراد' : 'Seats'}
                      </td>
                      <td className="py-4 px-4 sm:px-6 font-mono font-bold text-[#0B1F3A]">
                        {veh.dailyRatePKR ? `PKR ${veh.dailyRatePKR.toLocaleString()}` : (
                          <span className="text-amber-700 font-sans font-semibold text-xs">
                            {locale === 'ur' ? 'رابطہ کریں' : 'Custom Quote'}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-slate-600 font-mono">
                        PKR {veh.driverDailyFeePKR.toLocaleString()}/day
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-end">
                        <button
                          onClick={() => navigateToBooking(veh.id)}
                          className="px-3.5 py-1.5 rounded-lg bg-[#0B1F3A] hover:bg-[#142F57] text-[#F5B301] text-xs font-bold transition-colors"
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
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-bold text-slate-800 text-sm">
              {locale === 'ur' ? 'پیٹرول پالیسی (ٹینکی سے ٹینکی)' : 'Fuel Policy (Tank-to-Tank)'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {locale === 'ur'
                ? 'گاڑی جتنے پیٹرول کی مقدار کے ساتھ دی جائے گی، واپسی پر اتنی ہی پیٹرول کی مقدار پر واپس لی جائے گی۔'
                : 'Vehicle is handed over with verified fuel gauge reading and returned at the same level.'}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-bold text-slate-800 text-sm">
              {locale === 'ur' ? 'موٹروے اور ٹول ٹیکس' : 'Motorway Tolls & Parking'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {locale === 'ur'
                ? 'موٹروے ایم 5 اور ہائی وے کے تمام ٹول ٹیکس اور ائیرپورٹ پارکنگ فیس کسٹمر براہِ راست ادا کرے گا۔'
                : 'All motorway M-5 toll taxes, city entry passes, and airport parking fees are borne by the customer.'}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-bold text-slate-800 text-sm">
              {locale === 'ur' ? 'ڈرائیور نائٹ الاؤنس' : 'Driver Night Stay Allowance'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {locale === 'ur'
                ? 'اگر گاڑی صادق آباد سے باہر رات کو رکتی ہے تو ڈرائیور کا کھانا اور قیام الاؤنس (1,000 روپے فی رات) کسٹمر کے ذمہ ہوگا۔'
                : 'If traveling outside Sadiqabad overnight, driver lodging & meal allowance is PKR 1,000/night.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
