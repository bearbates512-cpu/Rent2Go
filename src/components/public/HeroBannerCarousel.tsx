import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { soundFX } from '../../utils/soundEffects.ts';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  MessageSquare
} from 'lucide-react';

export interface HeroBannerItem {
  id: number;
  image: string;
  badge: { en: string; ur: string };
  title: { en: string; ur: string };
  subtitle: { en: string; ur: string };
  accentColor: string;
}

export const HERO_BANNERS: HeroBannerItem[] = [
  {
    id: 1,
    image: '/assets/aistudio/a_polished_modern_car_rental_website_hero_banner_i_1a91e531.png',
    badge: { en: 'RENT-A-CAR · SADIQABAD', ur: 'رینٹ اے کار · صادق آباد' },
    title: { en: 'Your Journey. Your Ride.', ur: 'آپ کا سفر۔ آپ کی گاڑی۔' },
    subtitle: {
      en: 'Discover a better way to travel with Rent2Go verified fleet in Sadiqabad & M-5 Motorway.',
      ur: 'صادق آباد اور ایم-5 موٹروے پر رینٹ ٹو گو کی تصدیق شدہ گاڑیوں کے ساتھ پُروقار سفر کا آغاز کریں۔'
    },
    accentColor: '#F5B301'
  },
  {
    id: 2,
    image: '/assets/aistudio/Rent2Go_Family_Travel_Banner_efd52a90.png',
    badge: { en: 'PLAN YOUR TRIP THE EASY WAY', ur: 'آسان اور بے فکر فیملی ٹرپ' },
    title: { en: 'Luxury Travel & Family Trips', ur: 'لگژری ٹریول اور فیملی ٹورز' },
    subtitle: {
      en: 'Rent the perfect car for every journey — business, family, wedding or weekend adventure!',
      ur: 'ہر یادگار سفر کے لیے بہترین گاڑی — بزنس ٹرپ، بارات، یا فیملی ٹور!'
    },
    accentColor: '#38BDF8'
  },
  {
    id: 3,
    image: '/assets/aistudio/Premium_Cars__Unforgettable_Journeys_abbb121d.png',
    badge: { en: 'SADIQABAD VIP FLEET', ur: 'صادق آباد وی آئی پی فلیٹ' },
    title: { en: 'Premium Cars, Unforgettable Journeys', ur: 'پریمیم گاڑیاں، ناقابلِ فراموش یادیں' },
    subtitle: {
      en: 'Drive More. Pay Less. Brand new Fortuner, Civic & Camry with professional polite drivers.',
      ur: 'کم کرایہ، شاندار معیار۔ فارچونر، سیوک اور کیمری بااخلاق اور بااعتماد ڈرائیورز کے ساتھ۔'
    },
    accentColor: '#10B981'
  }
];

export const HeroBannerCarousel: React.FC = () => {
  const { locale, setCurrentView, settings } = useApp();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const SLIDE_DURATION = 6000;
  const TICK_INTERVAL = 100;

  const currentBanner = HERO_BANNERS[currentIndex];

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setCurrentIndex(idx => (idx + 1) % HERO_BANNERS.length);
          return 0;
        }
        return prev + (TICK_INTERVAL / SLIDE_DURATION) * 100;
      });
    }, TICK_INTERVAL);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused]);

  const goToNext = () => {
    setProgress(0);
    setCurrentIndex(prev => (prev + 1) % HERO_BANNERS.length);
    soundFX.playScan();
  };

  const goToPrev = () => {
    setProgress(0);
    setCurrentIndex(prev => (prev - 1 + HERO_BANNERS.length) % HERO_BANNERS.length);
    soundFX.playScan();
  };

  const selectBanner = (index: number) => {
    if (index === currentIndex) return;
    setProgress(0);
    setCurrentIndex(index);
    soundFX.playClick();
  };

  const togglePause = () => {
    soundFX.playClick();
    setIsPaused(prev => !prev);
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto my-6 px-2 sm:px-4">
      {/* Outer Shell with Clean Luxury Frame */}
      <div className="relative rounded-3xl bg-slate-950 p-2 sm:p-3 border border-slate-800 shadow-xl overflow-hidden group">
        {/* Top Control Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 mb-2 border-b border-white/10 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-400/40 text-[#F5B301] font-mono text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentBanner.badge[locale] || currentBanner.badge.en}</span>
            </span>
          </div>

          {/* Pause/Play Button & Nav Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={togglePause}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold font-mono active:scale-95 cursor-pointer shadow-sm ${
                isPaused
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
              title={isPaused ? 'Resume auto-sliding' : 'Pause on this banner'}
            >
              {isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{locale === 'ur' ? 'چلائیں' : 'PLAY'}</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>{locale === 'ur' ? 'روکیں' : 'PAUSE'}</span>
                </>
              )}
            </button>

            {/* Prev / Next Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={goToPrev}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                title="Previous Banner"
                aria-label="Previous Banner"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={goToNext}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                title="Next Banner"
                aria-label="Next Banner"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Stage (Clean, static banner display - NO spin, jump, or fade animations) */}
        <div className="relative aspect-16/9 sm:aspect-21/9 max-h-[500px] w-full rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center">
          <div className="absolute inset-0 w-full h-full flex items-center justify-center">
            <img
              src={currentBanner.image}
              alt={currentBanner.title.en}
              className="w-full h-full object-cover object-center"
              loading="eager"
            />

            {/* Subtle Gradient Overlays for High-contrast Depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-75 pointer-events-none" />

            {/* Clickable Quick Action Trigger Overlay */}
            <div className="absolute bottom-4 start-4 sm:bottom-6 sm:start-6 z-20 flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => {
                  soundFX.playClick();
                  setCurrentView('cars');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-[#F5B301] hover:bg-amber-400 text-[#0B1F3A] font-black text-xs sm:text-sm shadow-xl active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <span>{locale === 'ur' ? 'گاڑیاں دیکھیں' : 'Explore Fleet'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundFX.playClick()}
                className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm shadow-xl active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>{locale === 'ur' ? 'واٹس ایپ بکنگ' : 'WhatsApp Us'}</span>
              </a>
            </div>
          </div>

          {/* Running Progress Bar (Bottom of Banner) */}
          <div className="absolute bottom-0 inset-x-0 h-1 bg-white/15 z-30">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-cyan-400 to-amber-400"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 3 Clickable Banner Tabs */}
        <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-white/10">
          {HERO_BANNERS.map((banner, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={banner.id}
                onClick={() => selectBanner(idx)}
                className={`p-2 sm:p-2.5 rounded-xl border text-start cursor-pointer relative overflow-hidden ${
                  isActive
                    ? 'bg-white/15 border-amber-400 text-white shadow-md'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {isActive && (
                  <span className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-amber-400 to-cyan-400" />
                )}

                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] sm:text-xs font-mono font-bold truncate">
                    0{banner.id}. {banner.badge.en}
                  </span>
                  {isActive && (
                    <span className="text-[9px] font-mono text-amber-400 font-bold">
                      {isPaused ? 'PAUSED' : 'ACTIVE'}
                    </span>
                  )}
                </div>

                <span className="text-[11px] font-bold block truncate text-slate-200 mt-0.5">
                  {banner.title[locale] || banner.title.en}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
