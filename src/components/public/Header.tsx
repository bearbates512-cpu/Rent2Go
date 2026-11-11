import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext.tsx';
import { soundFX } from '../../utils/soundEffects.ts';
import {
  Car,
  Globe,
  Menu,
  X,
  Phone,
  ShieldCheck,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Lock,
  Clock,
  ExternalLink
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    locale,
    setLocale,
    currentView,
    setCurrentView,
    settings,
    navigateToBooking,
    themeMode,
    toggleThemeMode,
    isAdminAuthenticated
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(() => soundFX.getMuted());
  const [currentTime, setCurrentTime] = useState('');

  // Live Sadiqabad / Pakistan Time (Drkst signature feature)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format to Pakistan Standard Time (PKT)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Karachi',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };
      setCurrentTime(new Intl.DateTimeFormat('en-US', options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    const muted = soundFX.toggleMute();
    setIsAudioMuted(muted);
  };

  const handleThemeToggle = () => {
    soundFX.playClick();
    toggleThemeMode();
  };

  const navLinks = [
    { id: 'home', labelEn: 'Home', labelUr: 'مرکزی صفحہ' },
    { id: 'cars', labelEn: 'Fleet', labelUr: 'گاڑیاں' },
    { id: 'about', labelEn: 'About', labelUr: 'ہمارے متعلق' },
    { id: 'services', labelEn: 'Services', labelUr: 'سروسز' },
    { id: 'rates', labelEn: 'Tariff', labelUr: 'کرایہ نامہ' },
    { id: 'contact', labelEn: 'Contact', labelUr: 'رابطہ' },
    { id: 'status', labelEn: 'Track', labelUr: 'احوال' }
  ];

  const handleNavClick = (viewId: string) => {
    soundFX.playClick();
    setCurrentView(viewId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isDark = themeMode === 'dark';

  return (
    <header className="sticky top-0 z-40 bg-white/85 dark:bg-[#070D18]/85 backdrop-blur-xl border-b border-black/5 dark:border-white/10 transition-colors duration-250">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo with Drkst minimalist typography */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-800 flex items-center justify-center p-1.5 shadow-sm group-hover:scale-105 transition-transform">
              <img
                key={settings.logoUrl}
                src={settings.logoUrl || "/assets/aistudio/Rent2Go_icon_transparent.png"}
                alt="Jam Rent A Car Rahim Yar Khan"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/aistudio/Rent2Go_icon_transparent.png';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-black tracking-tight text-slate-950 dark:text-white font-mono">
                Jam Rent A Car<span className="text-xs font-normal text-slate-400">®</span>
              </span>
              <span className="text-[10px] font-mono tracking-widest text-slate-500 dark:text-slate-400 uppercase">
                {locale === 'ur' ? 'رحیم یار خان · 7 دن 24 گھنٹے سروس' : 'Rahim Yar Khan · 24/7 Service'}
              </span>
            </div>
          </div>

          {/* Desktop Nav Links (Drkst editorial text style with animated underline) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium">
            {navLinks.map(link => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative py-2 text-sm tracking-tight transition-colors cursor-pointer group ${
                    isActive
                      ? 'text-slate-950 dark:text-white font-bold'
                      : 'text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  <span>{locale === 'ur' ? link.labelUr : link.labelEn}</span>
                  {/* Subtle animated underline */}
                  <span
                    className={`absolute bottom-0 inset-x-0 h-[2px] bg-slate-950 dark:bg-amber-400 transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Live Time (Drkst signature), Theme, Language, CTA */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Live Time Clock (Drkst Signature) */}
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-black/5 dark:border-white/10 text-xs font-mono text-slate-600 dark:text-slate-300 select-none">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>{currentTime || 'PKT 05:45 PM'}</span>
            </div>

            {/* Day / Night Mode Switcher Toggle */}
            <button
              onClick={handleThemeToggle}
              className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-amber-400 transition-all cursor-pointer active:scale-95"
              title={isDark ? 'Day Mode' : 'Night Mode'}
              aria-label="Toggle theme mode"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-slate-800" />}
            </button>

            {/* Sound FX Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2.5 rounded-full transition-all cursor-pointer active:scale-95 ${
                !isAudioMuted
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-400'
              }`}
              title={isAudioMuted ? 'Turn Sound FX On' : 'Mute Sound FX'}
              aria-label="Toggle sound FX"
            >
              {!isAudioMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Language Switch */}
            <button
              onClick={() => {
                soundFX.playClick();
                setLocale(locale === 'en' ? 'ur' : 'en');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-amber-500" />
              <span>{locale === 'en' ? 'اردو' : 'EN'}</span>
            </button>

            {/* Stealth Admin Button */}
            <button
              onClick={() => {
                soundFX.playClick();
                window.history.pushState(null, '', '/admin/panel');
                setCurrentView('admin');
              }}
              className={`p-2.5 rounded-full transition-all cursor-pointer active:scale-95 ${
                isAdminAuthenticated
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/40'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 text-slate-500 dark:text-slate-400'
              }`}
              title={isAdminAuthenticated ? 'Admin Panel (Unlocked)' : 'Admin Access'}
              aria-label="Admin Portal"
            >
              {isAdminAuthenticated ? <ShieldCheck className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </button>

            {/* Social & Verified App Icons Group (Facebook & Rental Sawari App side-by-side) */}
            <div className="flex items-center gap-1.5">
              {/* Facebook Quick Link */}
              <a
                href={settings.socialLinks?.facebook || "https://www.facebook.com/p/Jam-Brothers-Rent-A-Car-100065165124538/"}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-slate-100 hover:bg-[#1877F2]/15 dark:bg-slate-900 text-slate-600 hover:text-[#1877F2] dark:text-slate-300 dark:hover:text-[#1877F2] transition-all cursor-pointer active:scale-95"
                title="Official Facebook Page (Jam Brothers Rent A Car)"
                aria-label="Facebook Page"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* Rental Sawari App Icon (Side-by-side with Facebook) */}
              <a
                href={settings.socialLinks?.rentalSawari || "https://rentalsawari.com/compare/jam-rent-a-car-rahim-yar-khan-vs-ali-rent-a-car-ryk"}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-amber-500/10 hover:bg-amber-500/25 text-amber-600 hover:text-amber-500 dark:text-amber-400 dark:hover:text-amber-300 border border-amber-500/30 transition-all cursor-pointer active:scale-95 flex items-center justify-center relative group"
                title="Rental Sawari App — Verified Fleet Profile"
                aria-label="Rental Sawari App"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="3" />
                  <path d="M9 18h6" />
                  <path d="M8 8l2.5-3h3L16 8v3a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V8z" />
                </svg>
                <span className="hidden 2xl:inline-block ms-1.5 text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400">RS App</span>
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
              </a>
            </div>

            {/* Direct Call Button */}
            <a
              href={`tel:${settings.phone || '03006756054'}`}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold tracking-tight shadow-sm transition-all active:scale-95 cursor-pointer"
              title="Call Jam Rent A Car Rahim Yar Khan"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{settings.phone || '03006756054'}</span>
            </a>

            {/* Primary Editorial "Book Now" CTA */}
            <button
              onClick={() => navigateToBooking()}
              className="px-5 py-2.5 rounded-full bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-xs font-bold tracking-tight shadow-md transition-all active:scale-95 cursor-pointer"
            >
              {locale === 'ur' ? 'گاڑی بک کریں' : 'Book a Car'}
            </button>
          </div>

          {/* Mobile Right Bar (Theme toggle + Facebook + App + Call + Menu toggle) */}
          <div className="flex lg:hidden items-center gap-1.5 sm:gap-2">
            {/* Mobile Facebook Icon */}
            <a
              href={settings.socialLinks?.facebook || "https://www.facebook.com/p/Jam-Brothers-Rent-A-Car-100065165124538/"}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-[#1877F2]/10 text-[#1877F2] dark:bg-slate-900 dark:text-blue-400 active:scale-95"
              title="Official Facebook Page"
              aria-label="Facebook Page"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>

            {/* Mobile Rental Sawari App Icon (Side-by-side with Facebook) */}
            <a
              href={settings.socialLinks?.rentalSawari || "https://rentalsawari.com/compare/jam-rent-a-car-rahim-yar-khan-vs-ali-rent-a-car-ryk"}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-amber-500/10 text-amber-600 dark:bg-slate-900 dark:text-amber-400 border border-amber-500/30 active:scale-95"
              title="Rental Sawari App"
              aria-label="Rental Sawari App"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="3" />
                <path d="M9 18h6" />
                <path d="M8 8l2.5-3h3L16 8v3a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V8z" />
              </svg>
            </a>

            <a
              href={`tel:${settings.phone || '03006756054'}`}
              className="p-2 rounded-full bg-emerald-600 text-white active:scale-95"
              title="Call Now"
              aria-label="Call Now"
            >
              <Phone className="w-4 h-4" />
            </a>

            <button
              onClick={handleThemeToggle}
              className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-amber-400 cursor-pointer active:scale-95"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-full bg-slate-950 text-white dark:bg-white dark:text-slate-950 cursor-pointer active:scale-95"
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Drkst Minimalist Full-Width) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden border-t border-black/5 dark:border-white/10 bg-white/95 dark:bg-[#070D18]/95 backdrop-blur-2xl px-6 py-6 space-y-4 shadow-2xl"
          >
            <div className="flex flex-col space-y-3">
              {navLinks.map((link, idx) => (
                <motion.button
                  key={link.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-start py-2 text-base font-bold tracking-tight transition-colors ${
                    currentView === link.id
                      ? 'text-[#F5B301]'
                      : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {locale === 'ur' ? link.labelUr : link.labelEn}
                </motion.button>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-black/5 dark:border-white/10 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">7 Days 24 Hours Service</p>
                <p className="text-[11px] text-slate-500 font-mono">03006756054 · Rahim Yar Khan</p>
              </div>
              <a
                href={`tel:${settings.phone || '03006756054'}`}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5" /> Call
              </a>
            </div>

            {/* Mobile Verified Social & App Links */}
            <div className="grid grid-cols-2 gap-2">
              <a
                href={settings.socialLinks?.rentalSawari || "https://rentalsawari.com/compare/jam-rent-a-car-rahim-yar-khan-vs-ali-rent-a-car-ryk"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-300 text-xs font-bold font-mono text-center"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Rental Sawari App</span>
              </a>

              <a
                href={settings.socialLinks?.facebook || "https://www.facebook.com/p/Jam-Brothers-Rent-A-Car-100065165124538/"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#1877F2]/10 border border-[#1877F2]/25 text-[#1877F2] dark:text-blue-400 text-xs font-bold font-mono text-center"
              >
                <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook Page</span>
              </a>
            </div>

            <div className="pt-2 border-t border-black/5 dark:border-white/10 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  soundFX.playClick();
                  setLocale(locale === 'en' ? 'ur' : 'en');
                }}
                className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-200"
              >
                {locale === 'en' ? 'اردو زبان' : 'English'}
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigateToBooking();
                }}
                className="flex-1 px-5 py-3 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-xs font-bold text-center tracking-tight"
              >
                {locale === 'ur' ? 'گاڑی بک کریں' : 'Book a Ride'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
