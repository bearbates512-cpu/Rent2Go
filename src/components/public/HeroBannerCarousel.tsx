import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext.tsx';
import { soundFX } from '../../utils/soundEffects.ts';
import { triggerThunderBlast } from '../effects/ThunderBlastSystem.tsx';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  ArrowRight,
  MessageSquare,
  ShieldCheck,
  Eye,
  RefreshCw
} from 'lucide-react';

export interface HeroBannerItem {
  id: number;
  image: string;
  badge: { en: string; ur: string };
  title: { en: string; ur: string };
  subtitle: { en: string; ur: string };
  animationType: 'fade' | 'spin' | 'jump';
  animationName: { en: string; ur: string };
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
    animationType: 'fade',
    animationName: { en: 'Fade In Effect', ur: 'فیڈ اِن اینیمیشن' },
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
    animationType: 'spin',
    animationName: { en: '3D Spin In Effect', ur: '3D اسپن اِن اینیمیشن' },
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
    animationType: 'jump',
    animationName: { en: '3D Jump In Effect', ur: '3D جمپ اِن اینیمیشن' },
    accentColor: '#10B981'
  }
];

export const HeroBannerCarousel: React.FC = () => {
  const { locale, dir, setCurrentView, settings } = useApp();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const SLIDE_DURATION = 5500; // 5.5s per banner
  const TICK_INTERVAL = 50;

  const currentBanner = HERO_BANNERS[currentIndex];

  // Auto-play timer with progress indicator
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          goToNext();
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

  // Specific animation variants per user requirement:
  // Banner 1: Fade In
  // Banner 2: Spin In
  // Banner 3: Jump In
  const getBannerAnimationVariants = (type: 'fade' | 'spin' | 'jump'): any => {
    switch (type) {
      case 'fade':
        return {
          initial: { opacity: 0, scale: 0.94, filter: 'blur(6px)' },
          animate: {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            transition: { duration: 0.75, ease: 'easeOut' }
          },
          exit: {
            opacity: 0,
            scale: 1.04,
            filter: 'blur(4px)',
            transition: { duration: 0.45 }
          }
        };
      case 'spin':
        return {
          initial: { opacity: 0, rotateY: 85, scale: 0.82, filter: 'blur(4px)' },
          animate: {
            opacity: 1,
            rotateY: 0,
            scale: 1,
            filter: 'blur(0px)',
            transition: { duration: 0.85, ease: 'easeOut' }
          },
          exit: {
            opacity: 0,
            rotateY: -85,
            scale: 0.88,
            transition: { duration: 0.45 }
          }
        };
      case 'jump':
        return {
          initial: { opacity: 0, y: 100, scale: 0.8 },
          animate: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
              y: { type: 'spring', stiffness: 180, damping: 13, mass: 0.8 },
              scale: { type: 'spring', stiffness: 220, damping: 12 },
              opacity: { duration: 0.45, ease: 'easeOut' }
            }
          },
          exit: {
            opacity: 0,
            y: -60,
            scale: 0.9,
            transition: { duration: 0.4, ease: 'easeIn' }
          }
        };
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 }
        };
    }
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto my-6 px-2 sm:px-4 perspective-1200">
      {/* Outer Shell with Cyber Neon Frame */}
      <div className="relative rounded-3xl bg-slate-950/80 p-2 sm:p-3 border border-amber-500/30 dark:border-cyan-500/30 shadow-2xl shadow-black/80 overflow-hidden group">
        {/* Holographic Glowing Corners */}
        <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-amber-400 z-30 pointer-events-none" />
        <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-amber-400 z-30 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-amber-400 z-30 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-amber-400 z-30 pointer-events-none" />

        {/* Dynamic Top Control Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 mb-2 border-b border-white/10 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-400/40 text-[#F5B301] font-mono text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentBanner.badge[locale] || currentBanner.badge.en}</span>
            </span>

            {/* Active Animation Indicator Badge */}
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 font-mono text-[11px] font-bold">
              <Zap className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span>{currentBanner.animationName[locale] || currentBanner.animationName.en}</span>
            </span>
          </div>

          {/* User Requested Pause/Play Button & Nav Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={togglePause}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold font-mono transition-all duration-200 active:scale-95 cursor-pointer shadow-md ${
                isPaused
                  ? 'bg-amber-400 text-slate-950 border-amber-300 ring-2 ring-amber-400/50'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
              title={isPaused ? 'Resume auto-sliding' : 'Pause on this banner'}
            >
              {isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{locale === 'ur' ? 'چلائیں (Play)' : 'PLAY'}</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>{locale === 'ur' ? 'روکیں (Pause)' : 'PAUSE'}</span>
                </>
              )}
            </button>

            {/* Prev / Next Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={goToPrev}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                title="Previous Banner"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={goToNext}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                title="Next Banner"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Stage with 3D Banner Animation */}
        <div className="relative aspect-16/9 sm:aspect-21/9 max-h-[500px] w-full rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBanner.id}
              variants={getBannerAnimationVariants(currentBanner.animationType)}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute inset-0 w-full h-full flex items-center justify-center will-change-transform"
            >
              <img
                src={currentBanner.image}
                alt={currentBanner.title.en}
                className="w-full h-full object-cover object-center filter drop-shadow-2xl"
                loading="eager"
              />

              {/* Subtle Gradient Overlays for High-contrast Depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-75 pointer-events-none" />

              {/* Clickable Quick Action Trigger Overlay */}
              <div className="absolute bottom-4 start-4 sm:bottom-6 sm:start-6 z-20 flex flex-wrap items-center gap-2.5">
                <button
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    triggerThunderBlast(rect.left + rect.width / 2, rect.top);
                    soundFX.playClick();
                    setCurrentView('cars');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-[#F5B301] hover:bg-amber-400 text-[#0B1F3A] font-black text-xs sm:text-sm shadow-xl shadow-amber-500/25 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{locale === 'ur' ? 'گاڑیاں دیکھیں' : 'Explore Fleet'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={`https://wa.me/${settings.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundFX.playClick()}
                  className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-600/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>{locale === 'ur' ? 'واٹس ایپ بکنگ' : 'WhatsApp Us'}</span>
                </a>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Running Progress Bar (Bottom of Banner) */}
          <div className="absolute bottom-0 inset-x-0 h-1 bg-white/15 z-30">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-400 via-cyan-400 to-amber-400"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>
        </div>

        {/* 3 Clickable Banner Tabs with Live Animation Labels */}
        <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-white/10">
          {HERO_BANNERS.map((banner, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={banner.id}
                onClick={() => selectBanner(idx)}
                className={`p-2 sm:p-2.5 rounded-xl border text-start transition-all cursor-pointer relative overflow-hidden group ${
                  isActive
                    ? 'bg-white/15 border-amber-400/90 text-white shadow-lg ring-1 ring-amber-400/50'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {/* Active Indicator Top Glow */}
                {isActive && (
                  <span className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-amber-400 to-cyan-400" />
                )}

                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] sm:text-xs font-mono font-bold truncate">
                    0{banner.id}. {banner.animationType.toUpperCase()}
                  </span>
                  {isActive && !isPaused && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  )}
                  {isActive && isPaused && (
                    <span className="text-[9px] font-mono text-amber-400 font-bold">PAUSED</span>
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
