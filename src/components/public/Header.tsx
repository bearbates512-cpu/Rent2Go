import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { soundFX } from '../../utils/soundEffects.ts';
import {
  Car,
  Globe,
  Menu,
  X,
  Phone,
  ShieldCheck,
  Search,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Lock
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
    isAdminAuthenticated,
    adminUser
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(() => soundFX.getMuted());

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
    { id: 'cars', labelEn: 'Fleet & Cars', labelUr: 'ہماری گاڑیاں' },
    { id: 'services', labelEn: 'Services', labelUr: 'سروسز' },
    { id: 'rates', labelEn: 'Rates', labelUr: 'کرایہ نامہ' },
    { id: 'about', labelEn: 'About Us', labelUr: 'ہمارے متعلق' },
    { id: 'contact', labelEn: 'Contact', labelUr: 'رابطہ کریں' },
    { id: 'status', labelEn: 'Track Booking', labelUr: 'بکنگ کا احوال' }
  ];

  const handleNavClick = (viewId: string) => {
    soundFX.playClick();
    setCurrentView(viewId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isDark = themeMode === 'dark';

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#071324]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/90 shadow-xs transition-colors duration-250">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 cursor-pointer select-none group py-1"
          >
            <div className="w-10 h-10 rounded-xl bg-[#0B1F3A] dark:bg-slate-800 border border-transparent dark:border-slate-700 flex items-center justify-center p-1.5 shadow-md shadow-slate-900/10 group-hover:scale-105 transition-all">
              <img
                src="/assets/aistudio/Rent2Go_icon_transparent.png"
                alt="Rent2Go Logo"
                className="w-full h-full object-contain brightness-110"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1 leading-none">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0B1F3A] dark:text-white">
                  Rent<span className="text-[#F5B301]">2Go</span>
                </span>
              </div>
              <span className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase mt-0.5">
                {locale === 'ur' ? 'صادق آباد کار رینٹل' : 'Sadiqabad Rental'}
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
            {navLinks.map(link => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'text-[#0B1F3A] dark:text-white bg-slate-100 dark:bg-slate-800/90 font-bold shadow-2xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-[#0B1F3A] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {locale === 'ur' ? link.labelUr : link.labelEn}
                </button>
              );
            })}
          </nav>

          {/* Actions Right */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Day / Night Mode Switcher Toggle */}
            <button
              onClick={handleThemeToggle}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 ${
                isDark
                  ? 'bg-amber-500/15 border-amber-400/40 text-amber-300 hover:bg-amber-500/25'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
              title={isDark ? (locale === 'ur' ? 'ڈے موڈ آن کریں' : 'Switch to Day Mode') : (locale === 'ur' ? 'نائٹ موڈ آن کریں' : 'Switch to Night Mode')}
              aria-label="Toggle theme mode"
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                  <span className="font-mono text-[11px] uppercase tracking-wide">{locale === 'ur' ? 'دن' : 'Day'}</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600/10" />
                  <span className="font-mono text-[11px] uppercase tracking-wide">{locale === 'ur' ? 'رات' : 'Night'}</span>
                </>
              )}
            </button>

            {/* Futuristic Sound FX Toggle */}
            <button
              onClick={toggleSound}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer ${
                !isAudioMuted
                  ? 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-300 dark:border-amber-400/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title={isAudioMuted ? 'Turn Sound FX On' : 'Mute Sound FX'}
            >
              {!isAudioMuted ? <Volume2 className="w-3.5 h-3.5 text-amber-500" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="text-[10px] uppercase">{!isAudioMuted ? 'FX' : 'Muted'}</span>
            </button>

            {/* Language Switch */}
            <button
              onClick={() => {
                soundFX.playClick();
                setLocale(locale === 'en' ? 'ur' : 'en');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#0B1F3A] dark:text-amber-400" />
              <span className="font-semibold">{locale === 'en' ? 'Urdu' : 'English'}</span>
            </button>

            {/* Direct Call Quick Link */}
            <a
              href={`tel:${settings.phone}`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-[#0B1F3A] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-mono">{settings.phoneFormatted}</span>
            </a>

            {/* Admin Panel Button (Secured for Admin) */}
            <button
              onClick={() => {
                soundFX.playClick();
                window.history.pushState(null, '', '/admin/panel');
                setCurrentView('admin');
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer active:scale-95 ${
                isAdminAuthenticated
                  ? 'bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/25'
                  : 'bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400'
              }`}
              title={
                isAdminAuthenticated
                  ? (locale === 'ur' ? 'ایڈمن پینل لاگ ان ہے' : 'Admin Panel (Logged In)')
                  : (locale === 'ur' ? 'ایڈمن پینل لاگ ان کریں' : 'Admin Panel Login')
              }
            >
              {isAdminAuthenticated ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{locale === 'ur' ? 'ایڈمن پینل' : 'Admin Panel'}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-amber-500" />
                  <span>{locale === 'ur' ? 'ایڈمن پینل' : 'Admin Panel'}</span>
                </>
              )}
            </button>

            {/* Primary Book CTA */}
            <button
              onClick={() => navigateToBooking()}
              className="px-4 py-2 rounded-lg bg-[#0B1F3A] hover:bg-[#142F57] dark:bg-[#F5B301] dark:hover:bg-amber-400 text-white dark:text-[#0B1F3A] text-sm font-bold shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
            >
              {locale === 'ur' ? 'گاڑی بک کریں' : 'Book a Car'}
            </button>
          </div>

          {/* Mobile Right Bar (Theme toggle + Menu) */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={handleThemeToggle}
              className={`p-2 rounded-lg border text-xs font-bold transition-all ${
                isDark
                  ? 'bg-amber-500/15 border-amber-400/40 text-amber-300'
                  : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
              aria-label="Toggle theme mode"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600 fill-indigo-600/10" />
              )}
            </button>

            <button
              onClick={() => setLocale(locale === 'en' ? 'ur' : 'en')}
              className="px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800"
            >
              {locale === 'en' ? 'اردو' : 'EN'}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1523] px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="mb-3 space-y-2">
            <button
              onClick={() => {
                navigateToBooking();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-lg bg-[#0B1F3A] dark:bg-[#F5B301] text-white dark:text-[#0B1F3A] text-sm font-bold shadow-sm text-center cursor-pointer"
            >
              {locale === 'ur' ? 'گاڑی بک کریں' : 'Book a Car'}
            </button>

            {/* Admin Panel button for Mobile */}
            <button
              onClick={() => {
                soundFX.playClick();
                setMobileMenuOpen(false);
                window.history.pushState(null, '', '/admin/panel');
                setCurrentView('admin');
              }}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-between border transition-all cursor-pointer ${
                isAdminAuthenticated
                  ? 'bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                {isAdminAuthenticated ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Lock className="w-4 h-4 text-amber-500" />
                )}
                <span>
                  {isAdminAuthenticated
                    ? (locale === 'ur' ? 'ایڈمن کنٹرول پینل (فعال)' : 'Admin Control Panel (Active)')
                    : (locale === 'ur' ? 'ایڈمن پینل لاگ ان' : 'Admin Panel (Sign In)')}
                </span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                isAdminAuthenticated
                  ? 'bg-emerald-200/80 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                {isAdminAuthenticated ? 'UNLOCKED' : 'PROTECTED'}
              </span>
            </button>
          </div>

          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`w-full text-start px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-between ${
                currentView === link.id
                  ? 'bg-slate-100 dark:bg-slate-800 text-[#0B1F3A] dark:text-white font-bold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <span>{locale === 'ur' ? link.labelUr : link.labelEn}</span>
              {currentView === link.id && (
                <span className="w-2 h-2 rounded-full bg-[#F5B301]" />
              )}
            </button>
          ))}

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{settings.phoneFormatted}</span>
            </div>
            <span>{settings.city}, Punjab</span>
          </div>
        </div>
      )}
    </header>
  );
};
