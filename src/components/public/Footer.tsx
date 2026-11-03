import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext.tsx';
import { Car, Phone, MessageSquare, MapPin, Clock, ShieldCheck, Mail, Lock, Sparkles } from 'lucide-react';
import { SpinInHeading, SpinInText } from '../effects/SpinInTypography.tsx';

export const Footer: React.FC = () => {
  const { locale, settings, setCurrentView } = useApp();

  const handleLink = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { id: 'cars', ur: 'گاڑیاں اور فلیٹ', en: 'Our Fleet & Cars' },
    { id: 'services', ur: 'ہماری سروسز', en: 'Services Catalogue' },
    { id: 'rates', ur: 'کرایہ نامہ اور پیکیجز', en: 'Rates & Packages' },
    { id: 'status', ur: 'آن لائن بکنگ کا احوال', en: 'Track Booking Status' },
    { id: 'about', ur: 'ہمارے متعلق', en: 'About Rent2Go Sadiqabad' }
  ];

  const popularRoutes = [
    { ur: 'صادق آباد تا سکھر ائیرپورٹ', en: 'Sadiqabad to Sukkur Airport' },
    { ur: 'شادی بیاہ اور بارات کے لیے فارچونر', en: 'Wedding Luxury Fleet (Fortuner & Civic)' },
    { ur: 'صادق آباد تا ملتان موٹروے M-5', en: 'Sadiqabad to Multan via M-5' },
    { ur: 'ایف ایف سی اور فاطمہ فرٹیلائزر کارپوریٹ', en: 'Corporate Rental (FFC & Machi Goth)' },
    { ur: '14 سیٹر ہائی ایس فیملی ٹور', en: '14-Seater Hiace Family Tours' }
  ];

  return (
    <footer className="bg-[#0B1F3A] text-slate-300 pt-14 pb-8 border-t border-slate-800 relative overflow-hidden perspective-1000">
      {/* Subtle Liquid Gas glow aura inside footer */}
      <div className="absolute inset-0 bg-radial from-amber-500/5 via-cyan-500/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20, rotateY: 25 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.55 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 p-1.5 flex items-center justify-center shrink-0">
                <img
                  src="/assets/aistudio/Rent2Go_icon_transparent.png"
                  alt="Rent2Go Logo"
                  className="w-full h-full object-contain brightness-125"
                />
              </div>
              <div className="flex flex-col">
                <SpinInHeading as="h4" axis="y" className="flex items-center gap-1 text-xl font-extrabold text-white">
                  <span>Rent</span>
                  <span className="text-[#F5B301]">2Go</span>
                </SpinInHeading>
                <SpinInText as="span" className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  {locale === 'ur' ? 'صادق آباد کار رینٹل' : 'Sadiqabad Rental'}
                </SpinInText>
              </div>
            </motion.div>

            <SpinInText as="p" className="text-sm text-slate-400 leading-relaxed">
              {settings.tagline[locale] || settings.tagline.en}
            </SpinInText>

            <motion.div
              initial={{ opacity: 0, scale: 0.85, rotateY: 30 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{locale === 'ur' ? 'حکومت سے تصدیق شدہ فلیٹ' : 'Verified & Insured Local Fleet'}</span>
            </motion.div>
          </div>

          {/* Quick Links */}
          <div>
            <SpinInHeading as="h3" splitWords axis="x" className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              {locale === 'ur' ? 'اہم لنکس' : 'Explore'}
            </SpinInHeading>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((item, idx) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -18, rotateY: 35 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.45, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                >
                  <button
                    onClick={() => handleLink(item.id)}
                    className="hover:text-amber-400 dark:hover:text-amber-300 transition-colors hover:translate-x-1 inline-flex items-center gap-1.5 cursor-pointer text-slate-300"
                  >
                    <span className="text-[#F5B301] text-xs">›</span>
                    <span>{locale === 'ur' ? item.ur : item.en}</span>
                  </button>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Popular Services */}
          <div>
            <SpinInHeading as="h3" splitWords axis="x" className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              {locale === 'ur' ? 'مشہور سروسز' : 'Popular Routes'}
            </SpinInHeading>
            <ul className="space-y-2.5 text-sm">
              {popularRoutes.map((route, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -18, rotateY: 35 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.45, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className="text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <span className="text-cyan-400 text-xs">›</span>
                  <span>{locale === 'ur' ? route.ur : route.en}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <SpinInHeading as="h3" splitWords axis="x" className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              {locale === 'ur' ? 'رابطہ اور پتہ' : 'Contact & Office'}
            </SpinInHeading>
            <div className="space-y-3 text-sm">
              <motion.div
                initial={{ opacity: 0, y: 15, rotateX: -25 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.45 }}
                className="flex items-start gap-2.5"
              >
                <MapPin className="w-4 h-4 text-[#F5B301] shrink-0 mt-1" />
                <span className="text-slate-300">
                  {settings.address[locale] || settings.address.en}
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15, rotateX: -25 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.45, delay: 0.05 }}
                className="flex items-center gap-2.5"
              >
                <Phone className="w-4 h-4 text-[#F5B301] shrink-0" />
                <a href={`tel:${settings.phone}`} className="font-mono text-white hover:text-amber-400 transition-colors">
                  {settings.phoneFormatted}
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15, rotateX: -25 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.45, delay: 0.1 }}
                className="flex items-center gap-2.5"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${settings.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-emerald-400 hover:text-emerald-300 hover:underline"
                >
                  +{settings.whatsappNumber} (WhatsApp)
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15, rotateX: -25 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.45, delay: 0.15 }}
                className="flex items-center gap-2.5"
              >
                <Clock className="w-4 h-4 text-[#F5B301] shrink-0" />
                <span className="text-slate-400 text-xs">
                  {settings.businessHours[locale] || settings.businessHours.en}
                </span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.55 }}
          className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500"
        >
          <SpinInText as="p">
            © {new Date().getFullYear()} Rent2Go. {locale === 'ur' ? 'جملہ حقوق محفوظ ہیں۔' : 'All rights reserved.'} Sadiqabad, Punjab.
          </SpinInText>
          <div className="flex flex-wrap items-center gap-4">
            <button onClick={() => handleLink('legal')} className="hover:text-slate-300 hover:underline cursor-pointer">
              {locale === 'ur' ? 'شرائط و ضوابط' : 'Terms & Conditions'}
            </button>
            <span>•</span>
            <button onClick={() => handleLink('legal')} className="hover:text-slate-300 hover:underline cursor-pointer">
              {locale === 'ur' ? 'پرائیویسی پالیسی' : 'Privacy Policy'}
            </button>
            <span>•</span>
            <button onClick={() => handleLink('legal')} className="hover:text-slate-300 hover:underline cursor-pointer">
              {locale === 'ur' ? 'منسوخی کی پالیسی' : 'Cancellation Policy'}
            </button>
            <span>•</span>
            <button
              onClick={() => {
                window.history.pushState(null, '', '/admin/panel');
                setCurrentView('admin');
              }}
              className="text-amber-400/90 hover:text-amber-300 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
            >
              <Lock className="w-3 h-3 text-amber-400" />
              <span>{locale === 'ur' ? 'ایڈمن پینل' : 'Admin Panel'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
