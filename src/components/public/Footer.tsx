import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Car, Phone, MessageSquare, MapPin, Clock, ShieldCheck, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const { locale, settings, setCurrentView } = useApp();

  const handleLink = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0B1F3A] text-slate-300 pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 p-1.5 flex items-center justify-center shrink-0">
                <img
                  src="/assets/aistudio/Rent2Go_icon_transparent.png"
                  alt="Rent2Go Logo"
                  className="w-full h-full object-contain brightness-125"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-xl font-extrabold text-white">
                  <span>Rent</span>
                  <span className="text-[#F5B301]">2Go</span>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  {locale === 'ur' ? 'صادق آباد کار رینٹل' : 'Sadiqabad Rental'}
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {settings.tagline[locale] || settings.tagline.en}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>{locale === 'ur' ? 'حکومت سے تصدیق شدہ فلیٹ' : 'Verified & Insured Local Fleet'}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              {locale === 'ur' ? 'اہم لنکس' : 'Explore'}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => handleLink('cars')}
                  className="hover:text-white transition-colors hover:underline"
                >
                  {locale === 'ur' ? 'گاڑیاں اور فلیٹ' : 'Our Fleet & Cars'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('services')}
                  className="hover:text-white transition-colors hover:underline"
                >
                  {locale === 'ur' ? 'ہماری سروسز' : 'Services Catalogue'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('rates')}
                  className="hover:text-white transition-colors hover:underline"
                >
                  {locale === 'ur' ? 'کرایہ نامہ اور پیکیجز' : 'Rates & Packages'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('status')}
                  className="hover:text-white transition-colors hover:underline"
                >
                  {locale === 'ur' ? 'آن لائن بکنگ کا احوال' : 'Track Booking Status'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('about')}
                  className="hover:text-white transition-colors hover:underline"
                >
                  {locale === 'ur' ? 'ہمارے متعلق' : 'About Rent2Go Sadiqabad'}
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Services */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              {locale === 'ur' ? 'مشہور سروسز' : 'Popular Routes'}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li className="text-slate-400">
                {locale === 'ur' ? 'صادق آباد تا سکھر ائیرپورٹ' : 'Sadiqabad to Sukkur Airport'}
              </li>
              <li className="text-slate-400">
                {locale === 'ur' ? 'شادی بیاہ اور بارات کے لیے فارچونر' : 'Wedding Luxury Fleet (Fortuner & Civic)'}
              </li>
              <li className="text-slate-400">
                {locale === 'ur' ? 'صادق آباد تا ملتان موٹروے M-5' : 'Sadiqabad to Multan via M-5'}
              </li>
              <li className="text-slate-400">
                {locale === 'ur' ? 'ایف ایف سی اور فاطمہ فرٹیلائزر کارپوریٹ' : 'Corporate Rental (FFC & Machi Goth)'}
              </li>
              <li className="text-slate-400">
                {locale === 'ur' ? '14 سیٹر ہائی ایس فیملی ٹور' : '14-Seater Hiace Family Tours'}
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              {locale === 'ur' ? 'رابطہ اور پتہ' : 'Contact & Office'}
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#F5B301] shrink-0 mt-1" />
                <span className="text-slate-300">
                  {settings.address[locale] || settings.address.en}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#F5B301] shrink-0" />
                <a href={`tel:${settings.phone}`} className="font-mono text-white hover:underline">
                  {settings.phoneFormatted}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${settings.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-emerald-400 hover:underline"
                >
                  +{settings.whatsappNumber} (WhatsApp)
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#F5B301] shrink-0" />
                <span className="text-slate-400 text-xs">
                  {settings.businessHours[locale] || settings.businessHours.en}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} Rent2Go. {locale === 'ur' ? 'جملہ حقوق محفوظ ہیں۔' : 'All rights reserved.'} Sadiqabad, Punjab.
          </p>
          <div className="flex items-center gap-4">
            <button onClick={() => handleLink('legal')} className="hover:text-slate-300 hover:underline">
              {locale === 'ur' ? 'شرائط و ضوابط' : 'Terms & Conditions'}
            </button>
            <span>•</span>
            <button onClick={() => handleLink('legal')} className="hover:text-slate-300 hover:underline">
              {locale === 'ur' ? 'پرائیویسی پالیسی' : 'Privacy Policy'}
            </button>
            <span>•</span>
            <button onClick={() => handleLink('legal')} className="hover:text-slate-300 hover:underline">
              {locale === 'ur' ? 'منسوخی کی پالیسی' : 'Cancellation Policy'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
