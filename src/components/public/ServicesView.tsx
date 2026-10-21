import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  UserCheck,
  Key,
  Plane,
  Sparkles,
  Navigation,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  PhoneCall
} from 'lucide-react';

export const ServicesView: React.FC = () => {
  const { services, locale, dir, navigateToBooking, settings } = useApp();

  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider border border-amber-200">
            {locale === 'ur' ? 'ہماری خصوصی سہولیات' : 'Tailored Travel Solutions'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] mt-2">
            {locale === 'ur' ? 'رینٹ ٹو گو کی پیشہ ورانہ رینٹل سروسز' : 'Our Car Rental Services in Sadiqabad'}
          </h1>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed">
            {locale === 'ur'
              ? 'ہم صادق آباد اور ملحقہ اضلاع میں ہر قسم کے نجی، خاندانی، کاروباری اور تقریبات کے سفر کے لیے اعلیٰ معیار کی گاڑیاں مہیا کرتے ہیں۔'
              : 'Whether you need a luxury chauffeur car for a wedding, reliable airport pickup, or a month-long corporate contract, we deliver perfection.'}
          </p>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services
            .filter(s => s.isEnabled)
            .map(service => {
              const name = service.name[locale] || service.name.en;
              const shortDesc = service.shortDesc[locale] || service.shortDesc.en;
              const desc = service.description[locale] || service.description.en;

              return (
                <div
                  key={service.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
                >
                  <div className="relative aspect-16/10 bg-slate-900 overflow-hidden">
                    <img
                      src={service.image}
                      alt={name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/80 via-transparent to-transparent" />
                    {service.startingPricePKR && (
                      <span className="absolute bottom-3 start-3 px-3 py-1 rounded-lg bg-[#F5B301] text-[#0B1F3A] text-xs font-extrabold shadow-sm font-mono">
                        {locale === 'ur' ? 'شروع از' : 'Starting'}: PKR {service.startingPricePKR.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#0B1F3A] group-hover:text-amber-600 transition-colors">
                        {name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-3">
                        {desc}
                      </p>

                      {/* Inclusions */}
                      {service.inclusions && service.inclusions.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            {locale === 'ur' ? 'شامل سہولیات' : 'Service Inclusions'}
                          </span>
                          {service.inclusions.map((inc, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-xs text-slate-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{inc[locale] || inc.en}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => navigateToBooking()}
                        className="w-full py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#142F57] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>{locale === 'ur' ? 'یہ سروس بک کریں' : 'Book this Service'}</span>
                        <ArrowIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Custom inquiry CTA */}
        <div className="bg-[#0B1F3A] rounded-3xl p-8 sm:p-12 text-white text-center space-y-4 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            {locale === 'ur' ? 'کیا آپ کو مخصوص روٹ یا طویل مدتی کرایہ درکار ہے؟' : 'Need a Custom Route or Long-term Fleet?'}
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
            {locale === 'ur'
              ? 'ہم کمپنیوں، ملز اور فیکٹریوں کے لیے خصوصی رعایت کے ساتھ ماہانہ پیکیجز بھی بناتے ہیں۔'
              : 'Contact our Sadiqabad operations manager directly to discuss customized corporate or wedding convoy tariffs.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={`https://wa.me/${settings.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold transition-all flex items-center gap-2"
            >
              <span>{locale === 'ur' ? 'واٹس ایپ پر کوٹیشن لیں' : 'Get Custom Quote on WhatsApp'}</span>
            </a>
            <a
              href={`tel:${settings.phone}`}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-2 border border-white/20"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{settings.phoneFormatted}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
