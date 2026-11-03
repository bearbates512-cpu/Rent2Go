import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext.tsx';
import { QuickSearchBar } from './QuickSearchBar.tsx';
import { CarCard } from './CarCard.tsx';
import { FuturisticShowcase } from './FuturisticShowcase.tsx';
import { FuturisticTicker } from './FuturisticTicker.tsx';
import { HeroBannerCarousel } from './HeroBannerCarousel.tsx';
import { CarSpecsModal } from './CarSpecsModal.tsx';
import { Premium3DBusinessCard } from './Premium3DBusinessCard.tsx';
import { triggerThunderBlast } from '../effects/ThunderBlastSystem.tsx';
import { soundFX } from '../../utils/soundEffects.ts';
import { Vehicle } from '../../types/index.ts';
import { SpinInHeading, SpinInText, LiquidGasBadge } from '../effects/SpinInTypography.tsx';
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
    ShieldCheck: <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-cyan-400" />,
    UserCheck: <UserCheck className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
    Banknote: <Banknote className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
    Clock: <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
  };

  // Render sections based on cmsPage.sections sorted by sortOrder
  const sortedSections = [...cmsPage.sections]
    .filter(s => s.isVisible)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#060D17] text-[#0B1F3A] dark:text-slate-100 transition-colors duration-250 relative overflow-hidden">
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
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="relative bg-[#071324] text-white pt-10 pb-16 overflow-hidden perspective-1000"
              >
                {/* Clean Subtle Lighting Glows */}
                <div className="absolute inset-0 bg-radial from-blue-900/30 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-0 end-0 w-96 h-96 bg-[#F5B301]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
                  {/* Top Intro Header with 3D Spin-In */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <motion.div
                      initial={{ opacity: 0, x: -40, rotateY: 25 }}
                      whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                      viewport={{ once: false, amount: 0.2 }}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      className="lg:col-span-8 space-y-4 text-center lg:text-start"
                    >
                      {badgeText && (
                        <LiquidGasBadge className="text-[#F5B301]">
                          <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                          <span>{badgeText}</span>
                        </LiquidGasBadge>
                      )}

                      <SpinInHeading
                        as="h1"
                        splitWords
                        axis="x"
                        className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight"
                      >
                        {secTitle}
                      </SpinInHeading>

                      <SpinInText
                        as="p"
                        axis="y"
                        className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0"
                      >
                        {secSubtitle}
                      </SpinInText>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 40, rotateY: -25 }}
                      whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                      viewport={{ once: false, amount: 0.2 }}
                      transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                      className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center"
                    >
                      <button
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          triggerThunderBlast(rect.left + rect.width / 2, rect.top);
                          soundFX.playClick();
                          setCurrentView('cars');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#F5B301] to-amber-400 hover:from-amber-400 hover:to-amber-300 text-[#0B1F3A] font-black text-sm shadow-xl shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer group"
                      >
                        <Car className="w-4 h-4 group-hover:scale-110 transition-transform" />
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
                    </motion.div>
                  </div>

                  {/* Dynamic 3D Animated Hero Banners (Fade In, Spin In, Jump In with Auto-Slide & Pause/Play) */}
                  <HeroBannerCarousel />
                </div>
              </motion.section>

              {/* Real-time Cyber Telemetry Marquee */}
              <FuturisticTicker />
            </React.Fragment>
          );
        }

        // 2. QUICK SEARCH BAR (Includes 3D Puzzle Explode & Assemble)
        if (sec.blockType === 'quick_search') {
          return (
            <section key={sec.id} className="px-4">
              <QuickSearchBar />
            </section>
          );
        }

        // 3. FEATURED CARS (With 3D Spin-In & Recurring Scroll Trigger)
        if (sec.blockType === 'featured_cars') {
          return (
            <motion.section
              key={sec.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.12 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto perspective-1000"
            >
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                <motion.div
                  initial={{ opacity: 0, x: -30, rotateY: 20 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.55 }}
                >
                  <LiquidGasBadge className="text-amber-600 dark:text-amber-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>{locale === 'ur' ? 'بہترین انتخاب' : 'Top Recommendations'}</span>
                  </LiquidGasBadge>
                  <SpinInHeading
                    as="h2"
                    splitWords
                    axis="x"
                    className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] dark:text-white mt-2"
                  >
                    {secTitle}
                  </SpinInHeading>
                  {secSubtitle && (
                    <SpinInText as="p" className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                      {secSubtitle}
                    </SpinInText>
                  )}
                </motion.div>

                <button
                  onClick={() => {
                    soundFX.playClick();
                    setCurrentView('cars');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B1F3A] dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 transition-colors group self-start sm:self-auto cursor-pointer"
                >
                  <span>{locale === 'ur' ? 'تمام گاڑیاں دیکھیں' : 'View All Fleet'}</span>
                  <ArrowIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* 3D Spin-in Car Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredCars.map((car, idx) => (
                  <CarCard key={car.id} vehicle={car} />
                ))}
              </div>
            </motion.section>
          );
        }

        // 4. SERVICES LIST (With 3D Spin-In Cards)
        if (sec.blockType === 'services_list') {
          return (
            <motion.section
              key={sec.id}
              initial={{ opacity: 0, y: 45 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.12 }}
              transition={{ duration: 0.6 }}
              className="py-16 bg-white dark:bg-[#081220] border-y border-slate-200/80 dark:border-slate-800 transition-colors perspective-1000"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <LiquidGasBadge className="text-amber-600 dark:text-amber-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>{locale === 'ur' ? 'ہماری سہولیات' : 'What We Offer'}</span>
                  </LiquidGasBadge>
                  <SpinInHeading
                    as="h2"
                    splitWords
                    axis="x"
                    className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] dark:text-white mt-2"
                  >
                    {secTitle}
                  </SpinInHeading>
                  {secSubtitle && (
                    <SpinInText as="p" className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                      {secSubtitle}
                    </SpinInText>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {services.slice(0, 3).map((srv, idx) => (
                    <motion.div
                      key={srv.id}
                      initial={{ opacity: 0, y: 40, rotateY: idx % 2 === 0 ? 35 : -35, scale: 0.92 }}
                      whileInView={{ opacity: 1, y: 0, rotateY: 0, scale: 1 }}
                      viewport={{ once: false, amount: 0.15 }}
                      whileHover={{ y: -6, rotateY: 0 }}
                      transition={{ duration: 0.55, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                      className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1523] p-6 hover:shadow-xl dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 will-change-transform"
                    >
                      <div className="space-y-3">
                        <img
                          src={srv.image}
                          alt={srv.name.en}
                          className="w-full h-44 rounded-2xl object-cover"
                        />
                        <SpinInHeading as="h3" axis="y" className="font-bold text-base text-[#0B1F3A] dark:text-white">
                          {srv.name[locale] || srv.name.en}
                        </SpinInHeading>
                        <SpinInText as="p" className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                          {srv.shortDesc[locale] || srv.shortDesc.en}
                        </SpinInText>
                      </div>

                      <button
                        onClick={() => {
                          soundFX.playClick();
                          navigateToBooking();
                        }}
                        className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#0B1F3A] dark:hover:bg-[#F5B301] hover:text-white dark:hover:text-[#0B1F3A] text-slate-800 dark:text-slate-200 text-xs font-bold transition-all text-center cursor-pointer"
                      >
                        {locale === 'ur' ? 'سروس حاصل کریں' : 'Book this Service'}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>
          );
        }

        // 5. WHY US (With 3D Spin-In Cards)
        if (sec.blockType === 'why_us') {
          const points = sec.props.points || [];
          return (
            <motion.section
              key={sec.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.12 }}
              transition={{ duration: 0.6 }}
              className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto perspective-1000"
            >
              <div className="text-center max-w-2xl mx-auto mb-12">
                <LiquidGasBadge className="text-amber-600 dark:text-amber-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{locale === 'ur' ? 'ہمارا امتیازی معیار' : 'Customer First'}</span>
                </LiquidGasBadge>
                <SpinInHeading
                  as="h2"
                  splitWords
                  axis="x"
                  className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] dark:text-white mt-2"
                >
                  {secTitle}
                </SpinInHeading>
                {secSubtitle && (
                  <SpinInText as="p" className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                    {secSubtitle}
                  </SpinInText>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {points.map((pt: any, i: number) => {
                  const pTitle = pt.title[locale] || pt.title.en;
                  const pDesc = pt.desc[locale] || pt.desc.en;

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 35, rotateY: 45, scale: 0.9 }}
                      whileInView={{ opacity: 1, y: 0, rotateY: 0, scale: 1 }}
                      viewport={{ once: false, amount: 0.15 }}
                      whileHover={{ y: -6, rotateY: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                      className="bg-white dark:bg-[#0B1523] rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-amber-400/60 dark:hover:border-amber-400/60 hover:shadow-xl transition-all space-y-3 will-change-transform"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-transparent dark:border-slate-800 flex items-center justify-center">
                        {iconMap[pt.icon] || <ShieldCheck className="w-6 h-6 text-blue-600" />}
                      </div>
                      <SpinInHeading as="h3" axis="y" className="font-bold text-sm text-[#0B1F3A] dark:text-white">
                        {pTitle}
                      </SpinInHeading>
                      <SpinInText as="p" className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {pDesc}
                      </SpinInText>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
          );
        }

        // 6. HOW IT WORKS (With 3D Spin-In Numbered Steps)
        if (sec.blockType === 'how_it_works') {
          const steps = sec.props.steps || [];
          return (
            <motion.section
              key={sec.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.12 }}
              transition={{ duration: 0.6 }}
              className="py-16 bg-[#0B1F3A] text-white perspective-1000"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <LiquidGasBadge className="text-[#F5B301]">
                    <Sparkles className="w-3.5 h-3.5 text-[#F5B301]" />
                    <span>{locale === 'ur' ? 'آسان 4 مراحل' : 'Simple Flow'}</span>
                  </LiquidGasBadge>
                  <SpinInHeading
                    as="h2"
                    splitWords
                    axis="x"
                    className="text-2xl sm:text-3xl font-extrabold text-white mt-1"
                  >
                    {secTitle}
                  </SpinInHeading>
                  {secSubtitle && (
                    <SpinInText as="p" className="text-slate-300 text-sm mt-1">
                      {secSubtitle}
                    </SpinInText>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {steps.map((st: any, i: number) => {
                    const stTitle = st.title[locale] || st.title.en;
                    const stDesc = st.desc[locale] || st.desc.en;

                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 40, rotateY: 50, scale: 0.88 }}
                        whileInView={{ opacity: 1, y: 0, rotateY: 0, scale: 1 }}
                        viewport={{ once: false, amount: 0.15 }}
                        whileHover={{ y: -6, rotateY: 0 }}
                        transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="bg-white/5 rounded-3xl p-6 border border-white/10 space-y-3 relative group hover:bg-white/10 hover:border-amber-400/50 transition-all will-change-transform"
                      >
                        <span className="text-3xl font-black font-mono text-[#F5B301] group-hover:scale-110 inline-block transition-transform">
                          {st.num}
                        </span>
                        <SpinInHeading as="h3" axis="y" className="font-bold text-base text-white">
                          {stTitle}
                        </SpinInHeading>
                        <SpinInText as="p" className="text-xs text-slate-300 leading-relaxed">
                          {stDesc}
                        </SpinInText>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.section>
          );
        }

        // 7. REVIEWS (With 3D Spin-In Feedback Cards)
        if (sec.blockType === 'reviews') {
          const approvedReviews = reviews.filter(r => r.isApproved);
          if (approvedReviews.length === 0) return null;

          return (
            <motion.section
              key={sec.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.12 }}
              transition={{ duration: 0.6 }}
              className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto perspective-1000"
            >
              <div className="text-center max-w-2xl mx-auto mb-12">
                <LiquidGasBadge className="text-amber-600 dark:text-amber-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{locale === 'ur' ? 'صداقت اور اعتماد' : 'Genuine Feedback'}</span>
                </LiquidGasBadge>
                <SpinInHeading
                  as="h2"
                  splitWords
                  axis="x"
                  className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] dark:text-white mt-2"
                >
                  {secTitle}
                </SpinInHeading>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {approvedReviews.map((rev, idx) => (
                  <motion.div
                    key={rev.id}
                    initial={{ opacity: 0, y: 35, rotateY: idx % 2 === 0 ? 30 : -30, scale: 0.92 }}
                    whileInView={{ opacity: 1, y: 0, rotateY: 0, scale: 1 }}
                    viewport={{ once: false, amount: 0.15 }}
                    whileHover={{ y: -6, rotateY: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="bg-white dark:bg-[#0B1523] rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-4 will-change-transform"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, idx) => (
                          <Star key={idx} className="w-4 h-4 fill-amber-400" />
                        ))}
                      </div>
                      <SpinInText as="p" className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                        "{rev.comment[locale] || rev.comment.en}"
                      </SpinInText>
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
                  </motion.div>
                ))}
              </div>
            </motion.section>
          );
        }

        // 8. FAQ (With Expandable Accordion & Recurring Entrance)
        if (sec.blockType === 'faq') {
          const faqItems = sec.props.items || [];
          return (
            <motion.section
              key={sec.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.12 }}
              transition={{ duration: 0.6 }}
              className="py-16 bg-slate-50 dark:bg-[#081220] border-t border-slate-200/80 dark:border-slate-800 transition-colors"
            >
              <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-10">
                  <LiquidGasBadge className="text-amber-600 dark:text-amber-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>{locale === 'ur' ? 'سوال و جواب' : 'Got Questions?'}</span>
                  </LiquidGasBadge>
                  <SpinInHeading
                    as="h2"
                    splitWords
                    axis="x"
                    className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] dark:text-white mt-2"
                  >
                    {secTitle}
                  </SpinInHeading>
                </div>

                <div className="space-y-3">
                  {faqItems.map((item: any, idx: number) => {
                    const q = item.q[locale] || item.q.en;
                    const a = item.a[locale] || item.a.en;
                    const isOpen = activeFaqIndex === idx;

                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.15 }}
                        transition={{ duration: 0.45, delay: idx * 0.06 }}
                        className="bg-white dark:bg-[#0B1523] rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-2xs"
                      >
                        <button
                          onClick={() => {
                            soundFX.playClick();
                            setActiveFaqIndex(isOpen ? null : idx);
                          }}
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
                            <SpinInText as="p">{a}</SpinInText>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.section>
          );
        }

        // 9. CTA BANNER (With 3D Business Card & Thunder Blast Trigger)
        if (sec.blockType === 'cta_banner') {
          const primaryText = sec.props.primaryBtn ? sec.props.primaryBtn[locale] || sec.props.primaryBtn.en : 'Book Online';
          const waText = sec.props.whatsappBtn ? sec.props.whatsappBtn[locale] || sec.props.whatsappBtn.en : 'Chat on WhatsApp';

          return (
            <React.Fragment key={sec.id}>
              {/* Executive 3D Business Card Showcase */}
              <motion.section
                initial={{ opacity: 0, y: 40, scale: 0.94 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto perspective-1000"
              >
                <div className="bg-[#0B1523] rounded-3xl p-6 sm:p-10 border border-[#d4af68]/20 shadow-2xl relative overflow-hidden text-center">
                  <div className="max-w-xl mx-auto space-y-2 mb-6">
                    <LiquidGasBadge className="text-[#e8cb91]">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{locale === 'ur' ? 'ڈائریکٹر کا مصدقہ 3D بزنس کارڈ' : 'DIRECTOR VERIFIED 3D CARD'}</span>
                    </LiquidGasBadge>
                    <SpinInHeading as="h2" splitWords axis="x" className="text-xl sm:text-2xl font-extrabold text-white">
                      {locale === 'ur' ? 'ایگزیکٹو ڈائریکٹر سے براہِ راست رابطہ' : 'Direct Executive Connection'}
                    </SpinInHeading>
                    <SpinInText as="p" className="text-slate-400 text-xs sm:text-sm">
                      {locale === 'ur'
                        ? 'کارڈ پر ماؤس گھمائیں اور تھری ڈی لائیو اینیمیشن کا تجربہ کریں۔ وی آئی پی پروٹوکول اور بکنگ کے لیے رابطہ کریں۔'
                        : 'Hover and tilt the card in 3D perspective. Contact our Managing Director directly for VIP protocols & high-profile bookings.'}
                    </SpinInText>
                  </div>

                  <Premium3DBusinessCard
                    name="Muhammad Tariq Gondal"
                    titleRole="MANAGING DIRECTOR & FOUNDER"
                  />
                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.6 }}
                className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
              >
                <div className="bg-[#0B1F3A] rounded-3xl p-8 sm:p-12 text-center text-white space-y-5 shadow-xl relative overflow-hidden">
                  <div className="max-w-2xl mx-auto space-y-3 relative z-10">
                    <SpinInHeading
                      as="h2"
                      splitWords
                      axis="x"
                      className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white"
                    >
                      {secTitle}
                    </SpinInHeading>
                    {secSubtitle && (
                      <SpinInText as="p" className="text-slate-300 text-sm leading-relaxed">
                        {secSubtitle}
                      </SpinInText>
                    )}
                    <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
                      <button
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          triggerThunderBlast(rect.left + rect.width / 2, rect.top);
                          navigateToBooking();
                        }}
                        className="px-6 py-3.5 rounded-xl bg-[#F5B301] hover:bg-amber-400 text-[#0B1F3A] font-extrabold text-sm shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                      >
                        <Car className="w-4 h-4" />
                        <span>{primaryText}</span>
                      </button>
                      <a
                        href={`https://wa.me/${settings.whatsappNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => soundFX.playClick()}
                        className="px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4 fill-white" />
                        <span>{waText}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.section>
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
