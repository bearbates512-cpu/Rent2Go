import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext.tsx';
import { soundFX } from '../../utils/soundEffects.ts';
import { normalizePkPhone } from '../../utils/phone.ts';
import {
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  ArrowUp,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  Send,
  Sparkles
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { locale, settings, setCurrentView, submitEnquiry } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Drkst Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSent, setNewsletterSent] = useState(false);

  const handleLink = (view: string) => {
    soundFX.playClick();
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    soundFX.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickContact = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg(locale === 'ur' ? 'براہِ کرم نام درج کریں۔' : 'Please provide your name.');
      return;
    }

    const norm = normalizePkPhone(phone);
    if (!norm.isValid) {
      setErrorMsg(norm.error || 'Please enter a valid Pakistani mobile number.');
      return;
    }

    submitEnquiry({
      name: name.trim(),
      phone: norm.formatted,
      service: 'Footer Quick Request',
      message: message.trim() || 'Inquiring about car availability and rental quote'
    });

    setSent(true);
    setName('');
    setPhone('');
    setMessage('');
    setTimeout(() => setSent(false), 5000);
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    soundFX.playClick();
    setNewsletterSent(true);
    setNewsletterEmail('');
    setTimeout(() => setNewsletterSent(false), 4000);
  };

  const navLinks = [
    { id: 'home', en: 'Home', ur: 'مرکزی صفحہ' },
    { id: 'cars', en: 'Fleet Collection', ur: 'گاڑیاں اور فلیٹ' },
    { id: 'about', en: 'About Jam Rent A Car', ur: 'ہمارے متعلق' },
    { id: 'services', en: 'Services', ur: 'سروسز' },
    { id: 'rates', en: 'Tariff & Rates', ur: 'کرایہ نامہ' },
    { id: 'contact', en: 'Contact Desk', ur: 'رابطہ' },
    { id: 'status', en: 'Track Booking', ur: 'بکنگ کا احوال' },
    { id: 'legal', en: 'Rental Policies', ur: 'پالیسی و شرائط' }
  ];

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 35, filter: 'blur(3px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  return (
    <footer className="bg-slate-950 text-white border-t border-white/10 relative overflow-hidden select-none">
      {/* Drkst Signature Editorial CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Massive Editorial Heading */}
          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-amber-400">
                {locale === 'ur' ? '7 دن 24 گھنٹے سروس · رحیم یار خان' : '7 DAYS 24 HOURS SERVICE · RAHIM YAR KHAN'}
              </span>
            </div>

            <h2 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight leading-[0.95] font-mono text-white">
              {locale === 'ur' ? (
                <>
                  جام رینٹ اے کار。<br />
                  <span className="text-[#F5B301]">رحیم یار خان۔</span>
                </>
              ) : (
                <>
                  JAM RENT A CAR<br />
                  RAHIM YAR KHAN.<br />
                  <span className="text-[#F5B301]">7 DAYS 24 HOURS.</span>
                </>
              )}
            </h2>

            <p className="text-slate-400 text-sm sm:text-base max-w-xl leading-relaxed">
              {locale === 'ur'
                ? 'جام رینٹ اے کار رحیم یار خان: 7 دن 24 گھنٹے معیاری لگژری اور فیملی گاڑیاں، بااخلاق ڈرائیورز، سیلف ڈرائیو اور فوری بکنگ۔'
                : 'Jam Rent A Car Rahim Yar Khan: Premium verified fleet, professional chauffeurs, transparent rates, and round-the-clock 24/7 service on call 03006756054.'}
            </p>

            {/* Direct Contact Links */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-sm font-mono">
              <a
                href={`tel:${settings.phone || '03006756054'}`}
                className="flex items-center gap-2 text-white hover:text-amber-400 transition-colors"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span className="font-bold">{settings.phone || '03006756054'}</span>
              </a>

              <a
                href={`https://wa.me/${settings.whatsappNumber || '923006756054'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span className="font-bold">WhatsApp 03006756054</span>
              </a>

              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span className="truncate">Rahim Yar Khan, Punjab</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Sleek Editorial Quick Inquiry Box */}
          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            className="lg:col-span-5 bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl"
          >
            <h3 className="text-lg font-bold text-white mb-2 font-mono">
              {locale === 'ur' ? 'فوری پیغام بھیجیں' : 'Direct Inquiry'}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              {locale === 'ur'
                ? 'نام اور فون درج کریں، ہماری ٹیم 5 منٹ میں رابطہ کرے گی۔'
                : 'Fill out this quick form and our fleet dispatch will respond immediately.'}
            </p>

            {sent ? (
              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{locale === 'ur' ? 'شکریہ! آپ کی درخواست موصول ہو گئی۔' : 'Inquiry sent! We will reach out shortly.'}</span>
              </div>
            ) : (
              <form onSubmit={handleQuickContact} className="space-y-4 text-xs font-mono">
                {errorMsg && (
                  <p className="text-rose-400 text-xs font-bold">{errorMsg}</p>
                )}

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1">
                    {locale === 'ur' ? 'مکمل نام *' : 'Your Name *'}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={locale === 'ur' ? 'مثال: محمد احمد' : 'e.g. Tariq Malik'}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-slate-500 focus:outline-hidden focus:border-amber-400"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1">
                    {locale === 'ur' ? 'موبائل نمبر *' : 'Mobile / WhatsApp *'}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="03001234567"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-slate-500 focus:outline-hidden focus:border-amber-400"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1">
                    {locale === 'ur' ? 'گاڑی یا سفر کی تفصیل' : 'Vehicle or Journey Notes'}
                  </label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={locale === 'ur' ? 'مطلوبہ گاڑی، تاریخ اور منزل...' : 'Interested in Fortuner / Civic, dates, destination...'}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-slate-500 focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-[#F5B301] hover:bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{locale === 'ur' ? 'پیغام ارسال کریں' : 'Send Inquiry'}</span>
                </button>
              </form>
            )}
          </motion.div>
        </div>

        {/* Drkst Signature Template: Weekly Newsletter & Highway Travel Deals */}
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          className="mt-16 pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 bg-white/[0.02] p-8 rounded-3xl border border-white/5"
        >
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold font-mono text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>{locale === 'ur' ? 'ہفتہ وار رعایت اور نئی گاڑیوں کے اپڈیٹس' : 'Join Our Weekly Fleet Dispatch!'}</span>
            </h3>
            <p className="text-xs text-slate-400">
              {locale === 'ur'
                ? 'موٹروے ڈیلز اور نئی گاڑیوں کی آمد کی بروقت اطلاع اپنے ان باکس میں پائیں۔'
                : 'Receive exclusive M-5 highway tariffs, wedding season specials, and instant fleet alerts.'}
            </p>
          </div>

          {newsletterSent ? (
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold px-5 py-3 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" />
              <span>{locale === 'ur' ? 'شکریہ! آپ شامل ہو چکے ہیں۔' : 'Subscribed successfully!'}</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletter} className="flex items-center gap-2 w-full md:w-auto">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={locale === 'ur' ? 'ای میل درج کریں' : 'Enter your email'}
                className="px-4 py-3 rounded-full bg-white/10 border border-white/15 text-white text-xs font-mono placeholder:text-slate-500 focus:outline-hidden focus:border-amber-400 w-full sm:w-64"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-white text-slate-950 hover:bg-amber-400 font-mono text-xs font-bold uppercase transition-all shrink-0 cursor-pointer shadow-md active:scale-95"
              >
                {locale === 'ur' ? 'سبسکرائب' : 'Subscribe'}
              </button>
            </form>
          )}
        </motion.div>

        {/* Drkst Signature Vertical Lines Grid / Rhythm Barcode Pattern */}
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          className="mt-16 pt-12 flex items-center justify-between gap-1 overflow-hidden opacity-30 select-none pointer-events-none"
        >
          {Array.from({ length: 64 }).map((_, idx) => (
            <div
              key={idx}
              className={`w-[1px] bg-white transition-all duration-500 ${
                idx % 4 === 0 ? 'h-8 opacity-90' : idx % 2 === 0 ? 'h-5 opacity-50' : 'h-3 opacity-25'
              }`}
            />
          ))}
        </motion.div>

        {/* Drkst Brand Statement Columns */}
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-mono text-slate-400 border-b border-white/10 pb-12"
        >
          <p className="leading-relaxed">
            {locale === 'ur'
              ? 'ہم ایسا سفر تشکیل دیتے ہیں جہاں آرام، اعتماد اور معیار ہر کلومیٹر پر نمایاں ہو۔'
              : 'We craft automotive journeys where comfort, mechanical perfection, and peace of mind resonate on every journey.'}
          </p>
          <p className="leading-relaxed">
            {locale === 'ur'
              ? 'ہمارا فلیٹ لگژری اور عام رسائی کے درمیان ایک پُراعتماد توازن قائم کرتا ہے۔'
              : 'Our fleet exists in the effortless balance between executive prestige and transparent, family-friendly accessibility.'}
          </p>
        </motion.div>

        {/* Middle Navigation & Information Links */}
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          className="pt-12 grid grid-cols-2 sm:grid-cols-4 gap-8 text-xs font-mono"
        >
          <div>
            <span className="text-slate-400 uppercase tracking-widest block mb-4">
              {locale === 'ur' ? 'نیویگیشن' : 'NAVIGATION'}
            </span>
            <ul className="space-y-2">
              {navLinks.slice(0, 4).map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleLink(link.id)}
                    className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {locale === 'ur' ? link.ur : link.en}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="text-slate-400 uppercase tracking-widest block mb-4">
              {locale === 'ur' ? 'سروسز' : 'SERVICES'}
            </span>
            <ul className="space-y-2">
              {navLinks.slice(4).map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleLink(link.id)}
                    className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {locale === 'ur' ? link.ur : link.en}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="text-slate-400 uppercase tracking-widest block mb-4">
              {locale === 'ur' ? 'مشہور روٹس' : 'POPULAR ROUTES'}
            </span>
            <ul className="space-y-2 text-slate-400">
              <li>Rahim Yar Khan · City & Airport</li>
              <li>M-5 Motorway Corridor</li>
              <li>Sadiqabad & Daharki Highway</li>
              <li>Multan & Sukkur Inter-City</li>
            </ul>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <span className="text-slate-400 uppercase tracking-widest block mb-4">
                {locale === 'ur' ? 'مرکزی دفتر' : 'HQ OFFICE'}
              </span>
              <p className="text-slate-400 leading-relaxed font-sans">
                Jam Rent A Car, Rahim Yar Khan, Punjab, Pakistan.<br />
                <span className="text-amber-400 font-mono text-[11px]">7 Days 24 Hours Service (24/7)</span>
              </p>
            </div>

            {/* Back to Top Button (Drkst style) */}
            <button
              onClick={scrollToTop}
              className="mt-6 inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-bold transition-colors cursor-pointer self-start"
            >
              <span>{locale === 'ur' ? 'اوپر جائیں' : 'Back to top'}</span>
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Drkst Signature Watermark Logo */}
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          className="pt-16 pb-4 flex justify-center overflow-hidden pointer-events-none select-none opacity-20 hover:opacity-30 transition-opacity"
        >
          <h1 className="text-4xl sm:text-7xl md:text-8xl lg:text-[110px] font-black tracking-tighter text-white font-mono whitespace-nowrap text-center">
            Jam Rent A Car®
          </h1>
        </motion.div>

        {/* Bottom Bar: Copyright & Stealth Admin */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <p>© {new Date().getFullYear()} Jam Rent A Car Rahim Yar Khan. 7 Days 24 Hours Service. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => handleLink('legal')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Privacy & Terms
            </button>
            <span>·</span>
            <button
              onClick={() => {
                window.history.pushState(null, '', '/admin/panel');
                setCurrentView('admin');
              }}
              className="text-amber-400/80 hover:text-amber-400 transition-colors inline-flex items-center gap-1 cursor-pointer font-bold"
            >
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Admin Access</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
