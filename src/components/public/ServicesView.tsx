import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext.tsx';
import { soundFX } from '../../utils/soundEffects.ts';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  MessageSquare
} from 'lucide-react';

export const ServicesView: React.FC = () => {
  const { services, locale, dir, navigateToBooking, settings } = useApp();
  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <div className="bg-[#FAF9F6] dark:bg-[#070D18] text-slate-900 dark:text-slate-100 min-h-screen py-16 transition-colors duration-250 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Editorial Header */}
        <div className="space-y-4 border-b border-black/5 dark:border-white/10 pb-8">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-400">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>{locale === 'ur' ? 'پیشہ ورانہ سروسز کیٹلاگ' : 'TAILORED TRANSIT SOLUTIONS'}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-mono tracking-tight text-slate-950 dark:text-white">
            {locale === 'ur' ? 'رینٹ ٹو گو کی خصوصی سروسز' : 'Our Specialized Services.'}
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            {locale === 'ur'
              ? 'صادق آباد اور موٹروے پر ہر قسم کے نجی، خاندانی، اور کارپوریٹ سفر کے لیے پریشانی سے پاک حل۔'
              : 'Whether transferring executives to Sheikh Zayed Airport or providing immaculate wedding convoys, we execute with precision.'}
          </p>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services
            .filter(s => s.isEnabled)
            .map((service, idx) => {
              const name = service.name[locale] || service.name.en;
              const desc = service.description[locale] || service.description.en;

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.6, delay: (idx % 3) * 0.1, ease: [0.16, 1, 0.3, 1] as const }}
                  className="bg-white dark:bg-[#0B131F] rounded-3xl border border-black/5 dark:border-white/10 overflow-hidden flex flex-col justify-between group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative aspect-16/10 bg-slate-950 overflow-hidden">
                    <img
                      src={service.image}
                      alt={name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    {service.startingPricePKR && (
                      <span className="absolute bottom-4 start-4 px-3 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-950 dark:text-white text-xs font-mono font-bold">
                        {locale === 'ur' ? 'شروع از' : 'From'}: Rs. {service.startingPricePKR.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                    <div>
                      <h3 className="text-xl font-bold font-mono text-slate-950 dark:text-white group-hover:text-amber-500 transition-colors">
                        {name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed line-clamp-3">
                        {desc}
                      </p>

                      {service.inclusions && service.inclusions.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/10 space-y-2">
                          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                            {locale === 'ur' ? 'شامل سہولیات' : 'Included Perks'}
                          </span>
                          {service.inclusions.map((inc, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              <span>{inc[locale] || inc.en}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => {
                          soundFX.playClick();
                          navigateToBooking();
                        }}
                        className="w-full py-3.5 px-4 rounded-2xl bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-sm"
                      >
                        <span>{locale === 'ur' ? 'یہ سروس بک کریں' : 'Book This Service'}</span>
                        <ArrowIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
