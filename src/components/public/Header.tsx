import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { soundFX } from '../../utils/soundEffects.ts';
import { Car, Globe, Menu, X, Phone, ShieldCheck, Search, Volume2, VolumeX } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    locale,
    setLocale,
    currentView,
    setCurrentView,
    settings,
    navigateToBooking
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(() => soundFX.getMuted());

  const toggleSound = () => {
    const muted = soundFX.toggleMute();
    setIsAudioMuted(muted);
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

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 cursor-pointer select-none group py-1"
          >
            <div className="w-10 h-10 rounded-xl bg-[#0B1F3A] flex items-center justify-center p-1.5 shadow-md shadow-slate-900/10 group-hover:scale-105 transition-transform">
              <img
                src="/assets/aistudio/Rent2Go_icon_transparent.png"
                alt="Rent2Go Logo"
                className="w-full h-full object-contain brightness-110"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1 leading-none">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0B1F3A]">Rent<span className="text-[#F5B301]">2Go</span></span>
              </div>
              <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase mt-0.5">
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
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-[#0B1F3A] bg-slate-100 font-bold'
                      : 'text-slate-600 hover:text-[#0B1F3A] hover:bg-slate-50'
                  }`}
                >
                  {locale === 'ur' ? link.labelUr : link.labelEn}
                </button>
              );
            })}
          </nav>

          {/* Actions Right */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Futuristic Sound FX Toggle */}
            <button
              onClick={toggleSound}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer ${
                !isAudioMuted
                  ? 'bg-amber-500/10 text-amber-600 border-amber-300'
                  : 'bg-slate-100 text-slate-400 border-slate-200 hover:text-slate-600'
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#0B1F3A]" />
              <span className="font-semibold">{locale === 'en' ? 'Urdu' : 'English'}</span>
            </button>

            {/* Direct Call Quick Link */}
            <a
              href={`tel:${settings.phone}`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-700 hover:text-[#0B1F3A] hover:bg-slate-50 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-mono">{settings.phoneFormatted}</span>
            </a>

            {/* Primary Book CTA */}
            <button
              onClick={() => navigateToBooking()}
              className="px-4 py-2 rounded-lg bg-[#0B1F3A] hover:bg-[#142F57] text-white text-sm font-bold shadow-sm shadow-slate-900/10 hover:shadow-md transition-all active:scale-95"
            >
              {locale === 'ur' ? 'گاڑی بک کریں' : 'Book a Car'}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setLocale(locale === 'en' ? 'ur' : 'en')}
              className="px-2.5 py-1.5 rounded-md border border-slate-200 text-xs font-bold text-slate-700"
            >
              {locale === 'en' ? 'Urdu' : 'EN'}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="mb-3">
            <button
              onClick={() => {
                navigateToBooking();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-lg bg-[#0B1F3A] text-white text-sm font-bold shadow-sm text-center"
            >
              {locale === 'ur' ? 'گاڑی بک کریں' : 'Book a Car'}
            </button>
          </div>

          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`w-full text-start px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-between ${
                currentView === link.id
                  ? 'bg-slate-100 text-[#0B1F3A] font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{locale === 'ur' ? link.labelUr : link.labelEn}</span>
              {currentView === link.id && (
                <span className="w-2 h-2 rounded-full bg-[#F5B301]" />
              )}
            </button>
          ))}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>{settings.phoneFormatted}</span>
            </div>
            <span>{settings.city}, Punjab</span>
          </div>
        </div>
      )}
    </header>
  );
};
