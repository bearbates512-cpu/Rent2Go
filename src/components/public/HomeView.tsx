import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext.tsx';
import { QuickSearchBar } from './QuickSearchBar.tsx';
import { CarCard } from './CarCard.tsx';
import { FuturisticTicker } from './FuturisticTicker.tsx';
import { soundFX } from '../../utils/soundEffects.ts';
import {
  ShieldCheck,
  UserCheck,
  Banknote,
  Clock,
  ChevronDown,
  Star,
  ArrowRight,
  ArrowLeft,
  Car,
  MessageSquare,
  Sparkles,
  Zap,
  CheckCircle2,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Drkst Word-by-Word Staggered Text Reveal Component
const EditorialWordsReveal: React.FC<{
  text: string;
  className?: string;
  delay?: number;
}> = ({ text, className = '', delay = 0 }) => {
  const words = text.split(' ');
  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      transition={{ staggerChildren: 0.05, delayChildren: delay }}
      className={`inline-flex flex-wrap gap-x-3 gap-y-1 ${className}`}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden py-0.5">
          <motion.span
            variants={{
              hidden: { y: '110%', opacity: 0, filter: 'blur(3px)' },
              visible: {
                y: '0%',
                opacity: 1,
                filter: 'blur(0px)',
                transition: { duration: 0.65, ease: EASE }
              }
            }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
};

export const HomeView: React.FC = () => {
  const {
    vehicles,
    services,
    reviews,
    locale,
    dir,
    navigateToBooking,
    setCurrentView,
    settings
  } = useApp();

  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0);
  const [fleetCategory, setFleetCategory] = useState<string>('all');

  // Hero 3-Banner Carousel State
  const [currentBannerIndex, setCurrentBannerIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

  const banners = [
    {
      id: 1,
      image: '/assets/aistudio/a_polished_modern_car_rental_website_hero_banner_i_1a91e531.png',
      titleEn: 'Your Journey. Your Ride. Discover Freedom.',
      titleUr: 'آپ کا سفر۔ آپ کی گاڑی۔ آزادی کا آغاز۔',
      badgeEn: 'Executive Fleet · Sadiqabad Hub',
      badgeUr: 'ایگزیکٹو فلیٹ · صادق آباد حب',
      animation: 'fade' // Fade In animation
    },
    {
      id: 2,
      image: '/assets/aistudio/Rent2Go_Family_Travel_Banner_efd52a90.png',
      titleEn: 'Luxury Travel & Memorable Family Trips',
      titleUr: 'پُرسکون فیملی اسفار اور پریمیم لگژری',
      badgeEn: 'Family Comfort · Chilled Dual AC',
      badgeUr: 'فیملی سہولت · ٹھنڈا اے سی',
      animation: 'spin' // 3D Spin / Tilt In animation
    },
    {
      id: 3,
      image: '/assets/aistudio/Premium_Cars__Unforgettable_Journeys_abbb121d.png',
      titleEn: 'Premium SUVs & Verified Highway Chauffeurs',
      titleUr: 'طاقتور 4x4 فارچونر اور موٹروے پروٹوکول',
      badgeEn: 'M-5 Motorway Ready · 24/7 Dispatch',
      badgeUr: 'M-5 موٹروے ریڈی · 24/7 مدد',
      animation: 'jump' // Jump / Elastic Bounce animation
    }
  ];

  // Auto-play timer for hero banners
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, banners.length]);

  const toggleAutoPlay = () => {
    soundFX.playClick();
    setIsAutoPlaying(!isAutoPlaying);
  };

  const handleNextBanner = () => {
    soundFX.playClick();
    setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
  };

  const handlePrevBanner = () => {
    soundFX.playClick();
    setCurrentBannerIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const publishedCars = vehicles.filter(v => v.visibility === 'published');
  const filteredCars = fleetCategory === 'all'
    ? publishedCars
    : publishedCars.filter(v => v.category === fleetCategory);

  // Business statistics
  const stats = [
    { value: '1,500+', labelEn: 'Trips Completed', labelUr: 'کامیاب اسفار' },
    { value: '99.4%', labelEn: 'On-Time Dispatch', labelUr: 'بروقت فراہمی' },
    { value: '4.9 ★', labelEn: 'Customer Rating', labelUr: 'کسٹمر ریٹنگ' },
    { value: '24/7', labelEn: 'Roadside Support', labelUr: 'ہائی وے مدد' }
  ];

  // Drkst-style editorial features
  const features = [
    {
      num: '01',
      titleEn: 'Transparent Fixed Pricing',
      titleUr: 'واضح اور فکسڈ کرایہ',
      descEn: 'Honest daily tariffs in PKR with zero hidden surcharges or surprise airport gate fees.',
      descUr: 'بغیر کسی پوشیدہ اخراجات کے واضح یومیہ ریٹس۔ جو طے ہوا وہی لیا جائے گا۔'
    },
    {
      num: '02',
      titleEn: '100% Chilled AC Guaranteed',
      titleUr: 'ٹھنڈا اے سی اور باقاعدہ معائنہ',
      descEn: 'Every vehicle undergoes rigorous mechanical inspection before departure for peak cooling on southern highways.',
      descUr: 'گرمی کے موسم میں ہر گاڑی کا اے سی اور مکینیکل فٹنس باقاعدہ ٹیسٹ کی جاتی ہے۔'
    },
    {
      num: '03',
      titleEn: 'Polite Local Chauffeurs',
      titleUr: 'مہذب اور بااعتماد ڈرائیورز',
      descEn: 'Background-verified drivers well-versed in M-5 Motorway routes, bypass junctions, and corporate protocols.',
      descUr: 'موٹروے اور قومی شاہراہوں کے راستوں سے مکمل واقف، شائستہ اور تجربہ کار ڈرائیورز۔'
    },
    {
      num: '04',
      titleEn: 'Flexible Self-Drive Freedom',
      titleUr: 'سیلف ڈرائیو کی سہولت',
      descEn: 'Simple CNIC and driving license verification for local professionals and visiting families.',
      descUr: 'شناختی کارڈ اور ڈرائیونگ لائسنس کی تصدیق کے ساتھ اپنی مرضی سے گاڑی چلانے کی آزادی۔'
    },
    {
      num: '05',
      titleEn: 'Rapid WhatsApp Dispatch',
      titleUr: 'فوری واٹس ایپ بکنگ',
      descEn: 'Instant booking confirmation and driver assignment in under 5 minutes right to your doorstep.',
      descUr: 'صرف ایک واٹس ایپ پیغام پر 5 منٹ کے اندر گاڑی اور ڈرائیور کی تصدیق۔'
    },
    {
      num: '06',
      titleEn: 'Wedding & VIP Ceremonial Fleets',
      titleUr: 'بارات اور وی آئی پی پروٹوکول',
      descEn: 'Pristine white Fortuners, Honda Civics, and Camry luxury sedans for weddings and delegations.',
      descUr: 'شادی بیاہ، بارات اور خصوصی مہمانوں کے پروٹوکول کے لیے چمکتی دمکتی پریمیم گاڑیاں۔'
    }
  ];

  // How it works steps
  const steps = [
    {
      num: '01',
      titleEn: 'Choose Your Car',
      titleUr: 'گاڑی کا انتخاب کریں',
      descEn: 'Select from our fleet of Fortuners, Civics, Corollas, Yaris, or Hiace vans.',
      descUr: 'ہماری تصدیق شدہ فارچونر، سیوک، کرولا یا ہائی ایس میں سے پسند کریں۔'
    },
    {
      num: '02',
      titleEn: 'Select Dates & Driver',
      titleUr: 'تاریخ اور ڈرائیور آپشن',
      descEn: 'Pick your travel schedule and choose between self-drive or verified polite chauffeur.',
      descUr: 'اپنی تاریخیں منتخب کریں اور سیلف ڈرائیو یا ڈرائیور کی سہولت چنیں۔'
    },
    {
      num: '03',
      titleEn: 'Confirm Your Booking',
      titleUr: 'بکنگ کی تصدیق',
      descEn: 'Get instant WhatsApp confirmation with transparent fare breakdown and driver contact.',
      descUr: 'فوری واٹس ایپ کنفرمیشن اور ڈرائیور کی تفصیلات حاصل کریں۔'
    },
    {
      num: '04',
      titleEn: 'Enjoy Your Journey',
      titleUr: 'پُرسکون سفر کا آغاز',
      descEn: 'Vehicle delivered to your doorstep in Sadiqabad or dispatch hub on KLP Road.',
      descUr: 'گاڑی آپ کی دہلیز پر پہنچائی جائے گی، سکون اور اعتماد کے ساتھ سفر کریں۔'
    }
  ];

  // FAQ Items
  const faqItems = [
    {
      qEn: 'What documents are required for car rental in Sadiqabad?',
      qUr: 'صادق آباد میں گاڑی کرائے پر لینے کے لیے کن دستاویزات کی ضرورت ہے؟',
      aEn: 'For self-drive: Original CNIC, valid Pakistani driving license, and refundable security deposit. For chauffeur-driven trips, only basic booking details and phone number are required.',
      aUr: 'سیلف ڈرائیو کے لیے: اصل شناختی کارڈ، ڈرائیونگ لائسنس اور سیکیورٹی ڈپازٹ۔ ڈرائیور کے ساتھ بکنگ کے لیے صرف بنیادی تفصیلات اور رابطہ نمبر درکار ہے۔'
    },
    {
      qEn: 'Do you provide cars for M-5 Motorway and long-distance travel?',
      qUr: 'کیا آپ موٹروے M-5 اور لمبے سفر کے لیے گاڑیاں فراہم کرتے ہیں؟',
      aEn: 'Yes! Our entire fleet is inspected for highway endurance, including trips to Multan, Sukkur, Lahore, Islamabad, and Karachi via M-5 corridor.',
      aUr: 'جی بالکل! ہماری تمام گاڑیاں ہائی وے اور M-5 موٹروے کے لمبے سفر کے لیے مکمل فٹ اور باقاعدہ چیک شدہ ہیں۔'
    },
    {
      qEn: 'Can I book a car on WhatsApp without credit card?',
      qUr: 'کیا میں کریڈٹ کارڈ کے بغیر واٹس ایپ پر گاڑی بک کر سکتا ہوں؟',
      aEn: 'Absolutely. Rent2Go specializes in local convenience. You can book via WhatsApp and pay via Cash, JazzCash, EasyPaisa, or Bank Transfer upon vehicle handover.',
      aUr: 'بالکل! آپ بغیر کریڈٹ کارڈ کے واٹس ایپ پر بکنگ کر سکتے ہیں اور کیش، ایزی پیسہ یا بینک ٹرانسفر کے ذریعے ادائیگی کر سکتے ہیں۔'
    },
    {
      qEn: 'What is your fuel and driver allowance policy?',
      qUr: 'ایندھن (فیول) اور ڈرائیور الاؤنس کی کیا پالیسی ہے؟',
      aEn: 'All rentals are provided with full tank or marked level and returned at the same level. Driver daily allowance (Rs. 1,500/day) covers driver meals and local stay on outstation journeys.',
      aUr: 'گاڑی جتنے پیٹرول کے ساتھ ملتی ہے اسی لیول پر واپس ہوتی ہے۔ باہر کے سفر پر ڈرائیور الاؤنس (1500 روپے یومیہ) شامل ہوتا ہے۔'
    }
  ];

  // Reusable bidirectional scroll animation variant
  const bidirectionalScroll = {
    hidden: { opacity: 0, y: 35, filter: 'blur(3px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.7, ease: EASE }
    }
  };

  // Banner dynamic animation variants based on banner index
  const getBannerAnimationVariants = (animType: string) => {
    switch (animType) {
      case 'spin':
        // Banner 2: 3D Spin / Tilt In
        return {
          initial: { opacity: 0, rotateY: 25, scale: 0.94, filter: 'blur(4px)' },
          animate: { opacity: 1, rotateY: 0, scale: 1, filter: 'blur(0px)' },
          exit: { opacity: 0, rotateY: -25, scale: 1.04, filter: 'blur(4px)' },
          transition: { duration: 0.85, ease: EASE }
        };
      case 'jump':
        // Banner 3: Jump / Elastic Scale Bounce In
        return {
          initial: { opacity: 0, y: 50, scale: 0.9, filter: 'blur(4px)' },
          animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
          exit: { opacity: 0, y: -40, scale: 1.05, filter: 'blur(4px)' },
          transition: { type: 'spring' as const, damping: 20, stiffness: 120 }
        };
      case 'fade':
      default:
        // Banner 1: Elegant Smooth Fade In
        return {
          initial: { opacity: 0, scale: 1.05, filter: 'blur(4px)' },
          animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
          exit: { opacity: 0, scale: 0.96, filter: 'blur(4px)' },
          transition: { duration: 0.8, ease: EASE }
        };
    }
  };

  const activeBanner = banners[currentBannerIndex];
  const activeAnimation = getBannerAnimationVariants(activeBanner.animation);

  return (
    <div className="bg-[#FAF9F6] dark:bg-[#070D18] text-slate-900 dark:text-slate-100 transition-colors duration-250 select-none">
      {/* ========================================================
          1. DRKST-INSPIRED HERO SECTION WITH 3-BANNER CAROUSEL
         ======================================================== */}
      <section className="relative pt-10 pb-20 sm:pt-16 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Subtle Background Lighting */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-8">
          {/* Top Brand Tagline */}
          <motion.div
            variants={bidirectionalScroll}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="flex items-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#F5B301] animate-pulse" />
            <span className="tracking-widest uppercase font-bold">
              {locale === 'ur' ? 'صادق آباد پریمیم رینٹل فلیٹ · 2026 ایڈیشن' : 'SADIQABAD CAR RENTAL · VERIFIED LUXURY FLEET'}
            </span>
          </motion.div>

          {/* Drkst Signature Oversized Headline Reveal */}
          <div className="space-y-1">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight leading-[0.9] font-mono text-slate-950 dark:text-white block">
              <EditorialWordsReveal text="YOUR JOURNEY." delay={0.05} />
            </h1>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight leading-[0.9] font-mono text-[#F5B301] block">
              <EditorialWordsReveal text="YOUR RIDE." delay={0.15} />
            </h1>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight leading-[0.9] font-mono text-slate-950 dark:text-white block">
              <EditorialWordsReveal text="YOUR FREEDOM." delay={0.25} />
            </h1>
          </div>

          {/* Supporting Text & CTAs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pt-2">
            <motion.p
              variants={bidirectionalScroll}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className="lg:col-span-7 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-sans"
            >
              {locale === 'ur'
                ? 'رینٹ ٹو گو کے ساتھ آرام، آزادی اور سہولت کا تجربہ کریں۔ ہر یادگار سفر کے لیے بہترین گاڑیاں بااعتماد سروس اور شفاف یومیہ کرایہ کے ساتھ۔'
                : 'Discover comfort, freedom and convenience with Rent2Go. Find the perfect car for every journey across Sadiqabad and nationwide highways.'}
            </motion.p>

            <motion.div
              variants={bidirectionalScroll}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className="lg:col-span-5 flex flex-wrap items-center gap-3"
            >
              <button
                onClick={() => {
                  soundFX.playClick();
                  setCurrentView('cars');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-4 rounded-full bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 active:scale-95 shadow-xl cursor-pointer"
              >
                <span>{locale === 'ur' ? 'گاڑیاں دیکھیں' : 'Explore Fleet'}</span>
                <ArrowIcon className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  soundFX.playClick();
                  navigateToBooking();
                }}
                className="px-6 py-4 rounded-full bg-[#F5B301] hover:bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 active:scale-95 shadow-md cursor-pointer"
              >
                <span>{locale === 'ur' ? 'ابھی بک کریں' : 'Book Your Ride'}</span>
              </button>

              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundFX.playClick()}
                className="p-4 rounded-full bg-[#25D366] text-white hover:bg-[#20bd5a] transition-all flex items-center justify-center active:scale-95 shadow-md"
                title="WhatsApp Us"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
              </a>
            </motion.div>
          </div>

          {/* ========================================================
              CINEMATIC 3-BANNER CAROUSEL WITH DEDICATED ANIMATIONS & PAUSE/PLAY
             ======================================================== */}
          <motion.div
            variants={bidirectionalScroll}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            className="relative aspect-16/9 sm:aspect-21/9 rounded-3xl overflow-hidden bg-slate-950 shadow-2xl border border-black/5 dark:border-white/10 group mt-8 perspective-1000"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeBanner.id}
                initial={activeAnimation.initial}
                animate={activeAnimation.animate}
                exit={activeAnimation.exit}
                transition={activeAnimation.transition}
                className="absolute inset-0 w-full h-full"
              >
                <img
                  src={activeBanner.image}
                  alt={activeBanner.titleEn}
                  className="w-full h-full object-cover object-center"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />

                {/* Banner Caption & Animation Tag */}
                <div className="absolute bottom-6 start-6 z-10 flex flex-col gap-2 text-white">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#F5B301] text-slate-950 text-[10px] font-mono font-black uppercase tracking-wider">
                      {activeBanner.animation === 'fade' && (locale === 'ur' ? 'اینیمیشن: فیڈ ان' : 'Fade In')}
                      {activeBanner.animation === 'spin' && (locale === 'ur' ? 'اینیمیشن: سپن ان' : '3D Spin In')}
                      {activeBanner.animation === 'jump' && (locale === 'ur' ? 'اینیمیشن: جمپ ان' : 'Jump Bounce')}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-mono">
                      {locale === 'ur' ? activeBanner.badgeUr : activeBanner.badgeEn}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-bold font-mono tracking-tight text-white drop-shadow-md">
                    {locale === 'ur' ? activeBanner.titleUr : activeBanner.titleEn}
                  </h3>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Controls Bar: Pause/Play Button & Arrow Navigation */}
            <div className="absolute top-4 end-4 z-20 flex items-center gap-2">
              {/* Visitor Pause / Play control as requested */}
              <button
                onClick={toggleAutoPlay}
                className="px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-white/20 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg active:scale-95"
                title={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
              >
                {isAutoPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-[11px] hidden sm:inline">{locale === 'ur' ? 'روکیں' : 'Pause'}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                    <span className="text-[11px] hidden sm:inline">{locale === 'ur' ? 'چلائیں' : 'Play'}</span>
                  </>
                )}
              </button>

              <button
                onClick={handlePrevBanner}
                aria-label="Previous banner"
                className="p-2 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-lg active:scale-90"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={handleNextBanner}
                aria-label="Next banner"
                className="p-2 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-lg active:scale-90"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Banner Dots Indicators */}
            <div className="absolute bottom-4 end-6 z-20 flex items-center gap-2">
              {banners.map((b, idx) => (
                <button
                  key={b.id}
                  onClick={() => {
                    soundFX.playClick();
                    setCurrentBannerIndex(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    currentBannerIndex === idx
                      ? 'w-8 bg-[#F5B301]'
                      : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to banner ${idx + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================================
          2. QUICK RESERVATION BAR (Drkst Minimalist)
         ======================================================== */}
      <section className="px-4">
        <QuickSearchBar />
      </section>

      {/* ========================================================
          3. MARQUEE / INFINITE BRAND TICKER
         ======================================================== */}
      <div className="mt-20">
        <FuturisticTicker />
      </div>

      {/* ========================================================
          4. THE FLEET COLLECTION (Drkst Portfolio Template)
         ======================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          variants={bidirectionalScroll}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 border-b border-black/5 dark:border-white/10 pb-6"
        >
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold block">
              {locale === 'ur' ? 'ہماری گاڑیاں' : 'THE COLLECTION'}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-mono tracking-tight text-slate-950 dark:text-white">
              <EditorialWordsReveal
                text={locale === 'ur' ? 'پریمیم فلیٹ گیلری' : 'Curated Automotive Fleet'}
              />
            </h2>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', en: 'All Fleet', ur: 'تمام گاڑیاں' },
              { id: 'suv', en: 'SUVs & 4x4', ur: 'ایس یو وی' },
              { id: 'sedan', en: 'Sedans', ur: 'سیڈان' },
              { id: 'hatchback', en: 'Economy', ur: 'اکانومی' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  soundFX.playClick();
                  setFleetCategory(cat.id);
                }}
                className={`px-4 py-2 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                  fleetCategory === cat.id
                    ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                {locale === 'ur' ? cat.ur : cat.en}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Cars Grid with Bidirectional Scroll Animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map((car, idx) => (
            <CarCard key={car.id} vehicle={car} index={idx} />
          ))}
        </div>

        <motion.div
          variants={bidirectionalScroll}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          className="mt-12 text-center"
        >
          <button
            onClick={() => {
              soundFX.playClick();
              setCurrentView('cars');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-8 py-4 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono font-bold tracking-wider uppercase transition-all inline-flex items-center gap-2 cursor-pointer shadow-sm hover:shadow active:scale-95"
          >
            <span>{locale === 'ur' ? 'مکمل فلیٹ کی فہرست دیکھیں' : 'View Complete Fleet Inventory'}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>
        </motion.div>
      </section>

      {/* ========================================================
          5. EDITORIAL ABOUT SECTION (Drkst "Less but more" philosophy)
         ======================================================== */}
      <section className="py-24 bg-white dark:bg-[#0B131F] border-y border-black/5 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Big Philosophy & Editorial Copy */}
            <motion.div
              variants={bidirectionalScroll}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.15 }}
              className="lg:col-span-7 space-y-6"
            >
              <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold block">
                {locale === 'ur' ? 'ہماری سوچ اور معیار' : 'LESS FRICTION. MORE JOURNEY.'}
              </span>

              <h2 className="text-3xl sm:text-5xl font-black font-mono tracking-tight leading-tight text-slate-950 dark:text-white">
                <EditorialWordsReveal
                  text={
                    locale === 'ur'
                      ? 'سفر کی آزادی، بغیر کسی رکاوٹ اور پریشانی کے۔'
                      : 'We embrace the tension between luxury and effortless accessibility.'
                  }
                />
              </h2>

              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
                {locale === 'ur'
                  ? 'رینٹ ٹو گو صرف گاڑیاں کرائے پر نہیں دیتا، بلکہ صادق آباد، رحیم یار خان اور موٹروے پر ہر فیملی اور کارپوریٹ کلائنٹ کو ایک بے فکر، محفوظ اور پرسکون سفری تجربہ فراہم کرتا ہے۔'
                  : "We don't just rent cars; we engineer peace of mind for every family celebration, corporate delegation, and highway trip across Pakistan with immaculate vehicles and verified polite drivers."}
              </p>

              {/* Statistics Grid (Animated on every scroll up/down) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-black/5 dark:border-white/10">
                {stats.map((st, idx) => (
                  <motion.div
                    key={idx}
                    variants={{
                      hidden: { opacity: 0, scale: 0.9, y: 20 },
                      visible: {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        transition: { duration: 0.5, delay: idx * 0.08, ease: EASE }
                      }
                    }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2 }}
                    className="space-y-1"
                  >
                    <span className="text-2xl sm:text-3xl font-black font-mono text-slate-950 dark:text-white block">
                      {st.value}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block font-mono">
                      {locale === 'ur' ? st.labelUr : st.labelEn}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Column: High-Res Supporting Automotive Photo */}
            <motion.div
              variants={bidirectionalScroll}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.15 }}
              className="lg:col-span-5"
            >
              <div className="aspect-4/5 rounded-3xl overflow-hidden bg-slate-950 shadow-2xl border border-black/5 dark:border-white/10 group">
                <img
                  src="/assets/aistudio/Rent2Go_Family_Travel_Banner_efd52a90.png"
                  alt="Rent2Go Family Journeys"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. WHY CHOOSE US (Drkst 6-Card Editorial Template)
         ======================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          variants={bidirectionalScroll}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          className="space-y-3 mb-16"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold block">
            {locale === 'ur' ? 'ہمارا امتیازی معیار' : 'WHAT WE DO, PERFECTLY'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-mono tracking-tight text-slate-950 dark:text-white">
            <EditorialWordsReveal
              text={locale === 'ur' ? 'رینٹ ٹو گو کیوں منتخب کریں؟' : 'Engineering Trust in Every Mile'}
            />
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <motion.div
              key={feat.num}
              variants={{
                hidden: { opacity: 0, y: 35, scale: 0.98, filter: 'blur(2px)' },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  filter: 'blur(0px)',
                  transition: { duration: 0.6, delay: (idx % 3) * 0.1, ease: EASE }
                }
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.15 }}
              className="p-8 rounded-3xl bg-white dark:bg-[#0B131F] border border-black/5 dark:border-white/10 space-y-4 hover:border-amber-400/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <span className="text-2xl font-black font-mono text-amber-500 block">
                {feat.num}
              </span>
              <h3 className="text-lg font-bold text-slate-950 dark:text-white font-mono">
                {locale === 'ur' ? feat.titleUr : feat.titleEn}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                {locale === 'ur' ? feat.descUr : feat.descEn}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========================================================
          7. HOW IT WORKS (Drkst Interactive Process 01 - 04)
         ======================================================== */}
      <section className="py-24 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={bidirectionalScroll}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            className="space-y-3 mb-16"
          >
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold block">
              {locale === 'ur' ? 'آسان بکنگ فلو' : 'THE PROCESS'}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-mono tracking-tight text-white">
              <EditorialWordsReveal
                text={locale === 'ur' ? 'گاڑی بک کرنے کے آسان 4 مراحل' : 'Four Steps to the Open Road'}
              />
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((st, idx) => (
              <motion.div
                key={st.num}
                variants={{
                  hidden: { opacity: 0, y: 35, scale: 0.97, filter: 'blur(2px)' },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: 'blur(0px)',
                    transition: { duration: 0.6, delay: idx * 0.1, ease: EASE }
                  }
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.15 }}
                className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
              >
                <span className="text-3xl font-black font-mono text-[#F5B301] block">
                  {st.num}
                </span>
                <h3 className="text-base font-bold text-white font-mono">
                  {locale === 'ur' ? st.titleUr : st.titleEn}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {locale === 'ur' ? st.descUr : st.descEn}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          8. CUSTOMER REVIEWS (Drkst "Less Fluff, Real Words")
         ======================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          variants={bidirectionalScroll}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          className="space-y-3 mb-16"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold block">
            {locale === 'ur' ? 'صداقت اور اعتماد' : 'TESTIMONIALS'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-mono tracking-tight text-slate-950 dark:text-white">
            <EditorialWordsReveal
              text={locale === 'ur' ? 'ہمارے معزز کسٹمرز کی آراء' : 'Words From Our Drivers & Guests'}
            />
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.filter(r => r.isApproved).slice(0, 3).map((rev, idx) => (
            <motion.div
              key={rev.id}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.98, filter: 'blur(2px)' },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  filter: 'blur(0px)',
                  transition: { duration: 0.6, delay: idx * 0.1, ease: EASE }
                }
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.15 }}
              className="p-8 rounded-3xl bg-white dark:bg-[#0B131F] border border-black/5 dark:border-white/10 flex flex-col justify-between space-y-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic font-sans">
                  "{rev.comment[locale] || rev.comment.en}"
                </p>
              </div>

              <div className="pt-4 border-t border-black/5 dark:border-white/10">
                <span className="font-bold text-sm text-slate-950 dark:text-white block font-mono">
                  {rev.name}
                </span>
                <span className="text-xs text-slate-400 font-mono block">
                  {rev.trip[locale] || rev.trip.en}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========================================================
          9. FAQ SECTION (Drkst "Questions.. Straight Answers.")
         ======================================================== */}
      <section className="py-24 bg-white dark:bg-[#0B131F] border-t border-black/5 dark:border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={bidirectionalScroll}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            className="space-y-3 mb-16 text-center"
          >
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold block">
              {locale === 'ur' ? 'عام سوالات' : 'FREQUENTLY ASKED QUESTIONS'}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-mono tracking-tight text-slate-950 dark:text-white">
              <EditorialWordsReveal
                text={locale === 'ur' ? 'کرایہ نامہ اور پالیسی کی وضاحت' : 'Clear Policies. No Surprises.'}
              />
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqItems.map((item, idx) => {
              const isOpen = activeFaqIndex === idx;
              return (
                <motion.div
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5, delay: idx * 0.05, ease: EASE }
                    }
                  }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.15 }}
                  className="rounded-2xl border border-black/5 dark:border-white/10 overflow-hidden bg-slate-50 dark:bg-slate-900/50"
                >
                  <button
                    onClick={() => {
                      soundFX.playClick();
                      setActiveFaqIndex(isOpen ? null : idx);
                    }}
                    className="w-full text-start p-6 flex items-center justify-between gap-4 text-sm sm:text-base font-bold text-slate-950 dark:text-white cursor-pointer"
                  >
                    <span>{locale === 'ur' ? item.qUr : item.qEn}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-amber-500' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="px-6 pb-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-black/5 dark:border-white/10 pt-4 font-sans"
                      >
                        <p>{locale === 'ur' ? item.aUr : item.aEn}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
