import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext.tsx';
import { QuickSearchBar } from './QuickSearchBar.tsx';
import { CarCard } from './CarCard.tsx';
import { FuturisticShowcase } from './FuturisticShowcase.tsx';
import { FuturisticTicker } from './FuturisticTicker.tsx';
import { CarSpecsModal } from './CarSpecsModal.tsx';
import { Premium3DBusinessCard } from './Premium3DBusinessCard.tsx';
import { soundFX } from '../../utils/soundEffects.ts';
import { Vehicle } from '../../types/index.ts';
import {
  ShieldCheck,
  UserCheck,
  Banknote,
  Clock,
  ChevronDown,
  Star,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Car,
  MessageSquare,
  PhoneCall,
  Zap
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    cmsPage,
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
  const [selectedHudCar, setSelectedHudCar] = useState<Vehicle | null>(null);

  const featuredCars = vehicles
    .filter(v => v.visibility === 'published' && v.isFeatured)
    .slice(0, 6);

  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const iconMap: Record<string, React.ReactNode> = {
    ShieldCheck: <ShieldCheck className="w-6 h-6 text-blue-600" />,
    UserCheck: <UserCheck className="w-6 h-6 text-amber-600" />,
    Banknote: <Banknote className="w-6 h-6 text-emerald-600" />,
    Clock: <Clock className="w-6 h-6 text-purple-600" />
  };

  // Render sections based on cmsPage.sections sorted by sortOrder
  const sortedSections = [...cmsPage.sections]
    .filter(s => s.isVisible)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#060D17] text-[#0B1F3A] dark:text-slate-100 transition-colors duration-250">
      {sortedSections.map(sec => {
        const secTitle = sec.title[locale] || sec.title.en;
        const secSubtitle = sec.subtitle ? sec.subtitle[locale] || sec.subtitle.en : '';

        // 1. HERO BLOCK
        if (sec.blockType === 'hero') {
          const badgeText = sec.props.badgeText ? sec.props.badgeText[locale] || sec.props.badgeText.en : '';
          const primaryBtn = sec.props.primaryBtnText ? sec.props.primaryBtnText[locale] || sec.props.primaryBtnText.en : 'Explore Fleet';
          const secondaryBtn = sec.props.secondaryBtnText ? sec.props.secondaryBtnText[locale] || sec.props.secondaryBtnText.en : 'WhatsApp Us';

          return (
            <React.Fragment key={sec.id}>
              <section className="relative bg-[#071324] text-white pt-10 pb-16 overflow-hidden">
                {/* Clean Subtle Lighting Glows */}
                <div className="absolute inset-0 bg-radial from-blue-900/30 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-0 end-0 w-96 h-96 bg-[#F5B301]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
                  {/* Top Intro Header */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-8 space-y-4 text-center lg:text-start">
                      {badgeText && (
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-[#F5B301] text-xs font-bold tracking-wide">
                          <Zap className="w-3.5 h-3.5 text-amber-400" />
                          <span>{badgeText}</span>
                        </div>
                      )}

                      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                        {secTitle}
                      </h1>

                      <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0">
                        {secSubtitle}
                      </p>
                    </div>

                    <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
                      <button
                        onClick={() => {
                          soundFX.playClick();
                          setCurrentView('cars');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#F5B301] to-amber-400 hover:from-amber-400 hover:to-amber-300 text-[#0B1F3A] font-black text-sm shadow-xl shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Car className="w-4 h-4" />
                        <span>{primaryBtn}</span>
                      </button>

                      <a
                        href={`https://wa.me/${settings.whatsappNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => soundFX.playClick()}
                        className="w-full px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-xl shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4 fill-white" />
                        <span>{secondaryBtn}</span>
                      </a>
                    </div>
                  </div>

                  {/* 3D Holographic Cyber Showcase with interactive tilt & vehicle selector */}
                  <FuturisticShowcase
                    onOpenSpecsModal={(car) => setSelectedHudCar(car)}
                  />
                </div>
              </section>

              {/* Real-time Cyber Telemetry Marquee */}
              <FuturisticTicker />
            </React.Fragment>
          );
        }

        // 2. QUICK SEARCH BAR
        if (sec.blockType === 'quick_search') {
          return (
            <section key={sec.id} className="px-4">
              <QuickSearchBar />
            </section>
          );
        }

        // 3. FEATURED CARS
        if (sec.blockType === 'featured_cars') {
          return (
            <section key={sec.id} className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                <div>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 px-3 py-1 rounded-full uppercase tracking-wider border border-amber-200 dark:border-amber-400/30">
                    {locale === 'ur' ? 'بہترین انتخاب' : 'Top Recommendations'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] dark:text-white mt-2">
                    {secTitle}
                  </h2>
                  {secSubtitle && <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{secSubtitle}</p>}
                </div>

                <button
                  onClick={() => {
                    setCurrentView('cars');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B1F3A] dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 transition-colors group self-start sm:self-auto cursor-pointer"
                >
                  <span>{locale === 'ur' ? 'تمام گاڑیاں دیکھیں' : 'View All Fleet'}</span>
                  <ArrowIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredCars.map(car => (
                  <CarCard key={car.id} vehicle={car} />
                ))}
              </div>
            </section>
          );
        }

        // 4. SERVICES LIST
        if (sec.blockType === 'services_list') {
          return (
            <section key={sec.id} className="py-16 bg-white dark:bg-[#081220] border-y border-slate-200/80 dark:border-slate-800 transition-colors">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 px-3 py-1 rounded-full uppercase tracking-wider border border-amber-200 dark:border-amber-400/30">
                    {locale === 'ur' ? 'ہماری سہولیات' : 'What We Offer'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] dark:text-white mt-2">
                    {secTitle}
                  </h2>
                  {secSubtitle && <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{secSubtitle}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {services.slice(0, 3).map(srv => (
                    <div
                      key={srv.id}
                      className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1523] p-6 hover:shadow-md dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <img
                          src={srv.image}
                          alt={srv.name.en}
                          className="w-full h-44 rounded-2xl object-cover"
                        />
                        <h3 className="font-bold text-base text-[#0B1F3A] dark:text-white">
                          {srv.name[locale] || srv.name.en}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                          {srv.shortDesc[locale] || srv.shortDesc.en}
                        </p>
                      </div>

                      <button
                        onClick={() => navigateToBooking()}
                        className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#0B1F3A] dark:hover:bg-[#F5B301] hover:text-white dark:hover:text-[#0B1F3A] text-slate-800 dark:text-slate-200 text-xs font-bold transition-all text-center cursor-pointer"
                      >
                        {locale === 'ur' ? 'سروس حاصل کریں' : 'Book this Service'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        // 5. WHY US
        if (sec.blockType === 'why_us') {
          const points = sec.props.points || [];
          return (
            <section key={sec.id} className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 px-3 py-1 rounded-full uppercase tracking-wider border border-amber-200 dark:border-amber-400/30">
                  {locale === 'ur' ? 'ہمارا امتیازی معیار' : 'Customer First'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] dark:text-white mt-2">
                  {secTitle}
                </h2>
                {secSubtitle && <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{secSubtitle}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {points.map((pt: any, i: number) => {
                  const pTitle = pt.title[locale] || pt.title.en;
                  const pDesc = pt.desc[locale] || pt.desc.en;

                  return (
                    <div
                      key={i}
                      className="bg-white dark:bg-[#0B1523] rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-3"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-transparent dark:border-slate-800 flex items-center justify-center">
                        {iconMap[pt.icon] || <ShieldCheck className="w-6 h-6 text-blue-600" />}
                      </div>
                      <h3 className="font-bold text-sm text-[#0B1F3A] dark:text-white">{pTitle}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{pDesc}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        }

        // 6. HOW IT WORKS
        if (sec.blockType === 'how_it_works') {
          const steps = sec.props.steps || [];
          return (
            <section key={sec.id} className="py-16 bg-[#0B1F3A] text-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-xs font-bold text-[#F5B301] uppercase tracking-wider">
                    {locale === 'ur' ? 'آسان 4 مراحل' : 'Simple Flow'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                    {secTitle}
                  </h2>
                  {secSubtitle && <p className="text-slate-300 text-sm mt-1">{secSubtitle}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {steps.map((st: any, i: number) => {
                    const stTitle = st.title[locale] || st.title.en;
                    const stDesc = st.desc[locale] || st.desc.en;

                    return (
                      <div
                        key={i}
                        className="bg-white/5 rounded-3xl p-6 border border-white/10 space-y-3 relative group hover:bg-white/10 transition-colors"
                      >
                        <span className="text-3xl font-black font-mono text-[#F5B301]">
                          {st.num}
                        </span>
                        <h3 className="font-bold text-base text-white">{stTitle}</h3>
                        <p className="text-xs text-slate-300 leading-relaxed">{stDesc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        }

        // 7. REVIEWS
        if (sec.blockType === 'reviews') {
          const approvedReviews = reviews.filter(r => r.isApproved);
          if (approvedReviews.length === 0) return null;

          return (
            <section key={sec.id} className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 px-3 py-1 rounded-full uppercase tracking-wider border border-amber-200 dark:border-amber-400/30">
                  {locale === 'ur' ? 'صداقت اور اعتماد' : 'Genuine Feedback'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] dark:text-white mt-2">
                  {secTitle}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {approvedReviews.map(rev => (
                  <div
                    key={rev.id}
                    className="bg-white dark:bg-[#0B1523] rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, idx) => (
                          <Star key={idx} className="w-4 h-4 fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                        "{rev.comment[locale] || rev.comment.en}"
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-white block">{rev.name}</span>
                        <span className="text-slate-400 text-[11px] block">{rev.trip[locale] || rev.trip.en}</span>
                      </div>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md border border-transparent dark:border-emerald-500/20">
                        {rev.source}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        // 8. FAQ
        if (sec.blockType === 'faq') {
          const faqItems = sec.props.items || [];
          return (
            <section key={sec.id} className="py-16 bg-slate-50 dark:bg-[#081220] border-t border-slate-200/80 dark:border-slate-800 transition-colors">
              <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-10">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 px-3 py-1 rounded-full uppercase tracking-wider border border-amber-200 dark:border-amber-400/30">
                    {locale === 'ur' ? 'سوال و جواب' : 'Got Questions?'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] dark:text-white mt-2">
                    {secTitle}
                  </h2>
                </div>

                <div className="space-y-3">
                  {faqItems.map((item: any, idx: number) => {
                    const q = item.q[locale] || item.q.en;
                    const a = item.a[locale] || item.a.en;
                    const isOpen = activeFaqIndex === idx;

                    return (
                      <div
                        key={idx}
                        className="bg-white dark:bg-[#0B1523] rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-2xs"
                      >
                        <button
                          onClick={() => setActiveFaqIndex(isOpen ? null : idx)}
                          className="w-full text-start p-4 sm:p-5 flex items-center justify-between gap-3 text-sm font-bold text-[#0B1F3A] dark:text-white hover:bg-slate-50/50 dark:hover:bg-slate-800/40 cursor-pointer"
                        >
                          <span>{q}</span>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-400 transition-transform ${
                              isOpen ? 'rotate-180 text-[#0B1F3A] dark:text-amber-400' : ''
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-5 sm:px-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                            {a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        }

        // 9. CTA BANNER
        if (sec.blockType === 'cta_banner') {
          const primaryText = sec.props.primaryBtn ? sec.props.primaryBtn[locale] || sec.props.primaryBtn.en : 'Book Online';
          const waText = sec.props.whatsappBtn ? sec.props.whatsappBtn[locale] || sec.props.whatsappBtn.en : 'Chat on WhatsApp';

          return (
            <React.Fragment key={sec.id}>
              {/* Executive 3D Business Card Showcase */}
              <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
                <div className="bg-[#0B1523] rounded-3xl p-6 sm:p-10 border border-[#d4af68]/20 shadow-2xl relative overflow-hidden text-center">
                  <div className="max-w-xl mx-auto space-y-2 mb-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af68]/10 border border-[#d4af68]/30 text-[#e8cb91] text-xs font-mono font-bold uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      {locale === 'ur' ? 'ڈائریکٹر کا مصدقہ 3D بزنس کارڈ' : 'DIRECTOR VERIFIED 3D CARD'}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                      {locale === 'ur' ? 'ایگزیکٹو ڈائریکٹر سے براہِ راست رابطہ' : 'Direct Executive Connection'}
                    </h2>
                    <p className="text-slate-400 text-xs sm:text-sm">
                      {locale === 'ur'
                        ? 'کارڈ پر ماؤس گھمائیں اور تھری ڈی لائیو اینیمیشن کا تجربہ کریں۔ وی آئی پی پروٹوکول اور بکنگ کے لیے رابطہ کریں۔'
                        : 'Hover and tilt the card in 3D perspective. Contact our Managing Director directly for VIP protocols & high-profile bookings.'}
                    </p>
                  </div>

                  <Premium3DBusinessCard
                    name="Muhammad Tariq Gondal"
                    titleRole="MANAGING DIRECTOR & FOUNDER"
                  />
                </div>
              </section>
            <section key={sec.id} className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              <div className="bg-[#0B1F3A] rounded-3xl p-8 sm:p-12 text-center text-white space-y-5 shadow-xl relative overflow-hidden">
                <div className="max-w-2xl mx-auto space-y-3 relative z-10">
                  <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                    {secTitle}
                  </h2>
                  {secSubtitle && (
                    <p className="text-slate-300 text-sm leading-relaxed">{secSubtitle}</p>
                  )}
                  <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
                    <button
                      onClick={() => navigateToBooking()}
                      className="px-6 py-3.5 rounded-xl bg-[#F5B301] hover:bg-amber-400 text-[#0B1F3A] font-extrabold text-sm shadow-md transition-all active:scale-95 flex items-center gap-2"
                    >
                      <Car className="w-4 h-4" />
                      <span>{primaryText}</span>
                    </button>
                    <a
                      href={`https://wa.me/${settings.whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4 fill-white" />
                      <span>{waText}</span>
                    </a>
                  </div>
                </div>
              </div>
            </section>
            </React.Fragment>
          );
        }

        return null;
      })}

      {/* Futuristic Telemetry Specs HUD Modal */}
      {selectedHudCar && (
        <CarSpecsModal
          vehicle={selectedHudCar}
          onClose={() => setSelectedHudCar(null)}
        />
      )}
    </div>
  );
};
