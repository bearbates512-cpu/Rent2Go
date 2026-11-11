import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext.tsx';
import { soundFX } from '../../utils/soundEffects.ts';
import { ShieldCheck, MapPin, Users, Phone, Car, Clock, Award, ArrowRight, MessageSquare } from 'lucide-react';

export const AboutView: React.FC = () => {
  const { locale, settings, navigateToBooking, setCurrentView } = useApp();

  return (
    <div className="bg-[#FAF9F6] dark:bg-[#070D18] text-slate-900 dark:text-slate-100 min-h-screen py-16 transition-colors duration-250 select-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Editorial Header */}
        <div className="space-y-4 border-b border-black/5 dark:border-white/10 pb-10">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-500 font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>{locale === 'ur' ? 'ہمارے متعلق · صادق آباد' : 'ABOUT RENT2GO® · SADIQABAD'}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-mono tracking-tight leading-[0.95] text-slate-950 dark:text-white">
            {locale === 'ur' ? (
              <>
                سفر کا پُرسکون تجربہ。<br />
                <span className="text-[#F5B301]">اعتماد، تحفظ اور وقار۔</span>
              </>
            ) : (
              <>
                CRAFTING JOURNEYS.<br />
                <span className="text-[#F5B301]">LESS FRICTION. MORE PEACE.</span>
              </>
            )}
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-3xl leading-relaxed">
            {locale === 'ur'
              ? 'جام رینٹ اے کار رحیم یار خان میں 7 دن 24 گھنٹے معیاری سروس فراہم کرتا ہے، جہاں ہر گاڑی کا مکینیکل معیار، بااخلاق ڈرائیور اور ایمانداری پر مبنی کرایہ نامہ اولین ترجیح ہے۔'
              : 'Jam Rent A Car Rahim Yar Khan operates 7 Days 24 Hours (24/7). Providing inspected company-managed fleet, vetted polite chauffeurs, and upfront honest PKR quotes.'}
          </p>
        </div>

        {/* Visual Storytelling Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
            <h2 className="text-2xl sm:text-3xl font-black font-mono text-slate-950 dark:text-white">
              {locale === 'ur' ? 'ہماری کہانی اور بنیاد' : 'The Rahim Yar Khan Transit Standard'}
            </h2>
            <p>
              {locale === 'ur'
                ? 'جام رینٹ اے کار رحیم یار خان کا قیام اس مقصد کے تحت عمل میں آیا کہ ضلع رحیم یار خان کے شہریوں کو معیاری، صاف ستھری اور محفوظ گاڑیاں 7 دن 24 گھنٹے مناسب اور شفاف کرائے پر مہیا کی جائیں۔'
                : 'Jam Rent A Car was founded in Rahim Yar Khan with a singular objective: to provide 7 Days 24 Hours reliable transit with an inspected, company-managed fleet, vetted polite chauffeurs, and honest upfront rates.'}
            </p>
            <p>
              {locale === 'ur'
                ? 'چاہے آپ کو شیخ زید ائیرپورٹ رحیم یار خان یا سکھر ائیرپورٹ جانا ہو، موٹروے ایم 5 کے ذریعے لاہور یا کراچی کا سفر ہو، یا فیملی فنکشن اور شادی کے لیے وی آئی پی پروٹوکول درکار ہو، جام رینٹ اے کار ہمیشہ حاضر ہے۔'
                : 'Whether transferring travelers to Sheikh Zayed International Airport (RYK) or Sukkur, navigating the M-5 motorway corridor, or serving corporate and wedding convoys, our 24/7 standards remain uncompromised.'}
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  soundFX.playClick();
                  navigateToBooking();
                }}
                className="px-6 py-3.5 rounded-full bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-md active:scale-95 cursor-pointer"
              >
                {locale === 'ur' ? 'گاڑی بک کریں' : 'Book a Vehicle'}
              </button>

              <a
                href={`tel:${settings.phone || '03006756054'}`}
                onClick={() => soundFX.playClick()}
                className="px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-md flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Call 03006756054</span>
              </a>

              <a
                href={`https://wa.me/${settings.whatsappNumber || '923006756054'}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundFX.playClick()}
                className="px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-md flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>WhatsApp HQ</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(3px)' }}
              whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
              className="aspect-4/5 rounded-3xl overflow-hidden bg-slate-950 shadow-2xl border border-black/5 dark:border-white/10"
            >
              <img
                src="/assets/aistudio/Premium_Cars__Unforgettable_Journeys_abbb121d.png"
                alt="Rent2Go Fleet Sadiqabad"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>

        {/* 3 Core Editorial Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-black/5 dark:border-white/10">
          <div className="p-8 rounded-3xl bg-white dark:bg-[#0B131F] border border-black/5 dark:border-white/10 space-y-4">
            <span className="text-2xl font-black font-mono text-amber-500">01</span>
            <h3 className="text-lg font-bold text-slate-950 dark:text-white font-mono">
              {locale === 'ur' ? 'حفاظت اور مکینیکل جانچ' : 'Vehicle Roadworthiness'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {locale === 'ur'
                ? 'ہر سفر سے قبل بریکس، ٹائرز اور اے سی کی تفصیلی جانچ کی جاتی ہے۔'
                : 'Rigorous pre-trip mechanical checks on braking, high-speed tire pressure, and dual AC cooling.'}
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-[#0B131F] border border-black/5 dark:border-white/10 space-y-4">
            <span className="text-2xl font-black font-mono text-amber-500">02</span>
            <h3 className="text-lg font-bold text-slate-950 dark:text-white font-mono">
              {locale === 'ur' ? 'تصدیق شدہ بااخلاق ڈرائیورز' : 'Verified Polite Chauffeurs'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {locale === 'ur'
                ? 'فیملی سفر کے آداب سے واقف، باکردار اور روٹس کے ماہر ڈرائیورز۔'
                : 'Background-verified drivers trained in highway safety, customer courtesy, and family travel.'}
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-[#0B131F] border border-black/5 dark:border-white/10 space-y-4">
            <span className="text-2xl font-black font-mono text-amber-500">03</span>
            <h3 className="text-lg font-bold text-slate-950 dark:text-white font-mono">
              {locale === 'ur' ? 'وقت کی مکمل پابندی' : 'Punctuality Guarantee'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {locale === 'ur'
                ? 'گاڑی ہمیشہ طے شدہ وقت سے 15 سے 30 منٹ پہلے آپ کے پتے پر پہنچتی ہے۔'
                : 'Our vehicles arrive at least 15-30 minutes prior to scheduled departure time.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
