import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { QuickSearchBar } from './QuickSearchBar.tsx';
import { CarCard } from './CarCard.tsx';
import { AnimatedEarthBackground } from './AnimatedEarthBackground.tsx';
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
  PhoneCall
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
    <div className="bg-[#F8FAFC]">
      {sortedSections.map(sec => {
        const secTitle = sec.title[locale] || sec.title.en;
        const secSubtitle = sec.subtitle ? sec.subtitle[locale] || sec.subtitle.en : '';

        // 1. HERO BLOCK
        if (sec.blockType === 'hero') {
          const badgeText = sec.props.badgeText ? sec.props.badgeText[locale] || sec.props.badgeText.en : '';
          const primaryBtn = sec.props.primaryBtnText ? sec.props.primaryBtnText[locale] || sec.props.primaryBtnText.en : 'Explore Fleet';
          const secondaryBtn = sec.props.secondaryBtnText ? sec.props.secondaryBtnText[locale] || sec.props.secondaryBtnText.en : 'WhatsApp Us';
          const bannerImg = sec.props.bannerImage || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80';

          return (
            <section key={sec.id} className="relative bg-[#0B1F3A] text-white pt-16 pb-24 overflow-hidden min-h-[580px] flex items-center">
              {/* Unique 3D Animated Earth Background with Live Mobility Flight Arcs */}
              <AnimatedEarthBackground variant="hero" showControls={true} />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-7 space-y-6 text-center lg:text-start">
                    {badgeText && (
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-[#F5B301] text-xs font-bold tracking-wide">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{badgeText}</span>
                      </div>
                    )}

                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                      {secTitle}
                    </h1>

                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
                      {secSubtitle}
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                      <button
                        onClick={() => {
                          setCurrentView('cars');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-6 py-3.5 rounded-xl bg-[#F5B301] hover:bg-amber-400 text-[#0B1F3A] font-extrabold text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-2"
                      >
                        <Car className="w-4 h-4" />
                        <span>{primaryBtn}</span>
                      </button>

                      <a
                        href={`https://wa.me/${settings.whatsappNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-lg shadow-emerald-600/20 active:scale-95 transition-all flex items-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4 fill-white" />
                        <span>{secondaryBtn}</span>
                      </a>
                    </div>

                    {/* Trust indicators */}
                    <div className="pt-6 border-t border-slate-700/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-300 font-medium">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#F5B301]" />
                        <span>{locale === 'ur' ? '100% تصدیق شدہ فلیٹ' : 'Verified & Insured'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-[#F5B301]" />
                        <span>{locale === 'ur' ? 'پیشہ ور بااخلاق ڈرائیورز' : 'Verified Chauffeurs'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#F5B301]" />
                        <span>{locale === 'ur' ? '24 گھنٹے روڈ سائیڈ ہیلپ' : '24/7 Road Support'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Hero Right Visual: 3D Orbit Showcase & Glass Fleet Telemetry */}
                  <div className="lg:col-span-5 relative flex flex-col justify-end min-h-[360px] lg:min-h-[440px] pointer-events-none">
                    {/* Floating Glass Telemetry Card */}
                    <div className="pointer-events-auto p-5 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl shadow-black/50 text-white space-y-3.5 transition-all hover:bg-white/15">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#F5B301] animate-ping" />
                          <span className="text-xs font-mono font-bold text-[#F5B301] tracking-wide uppercase">
                            {locale === 'ur' ? 'لائیو روٹس و نیویگیشن' : 'Live Fleet Radar'}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/80 text-white border border-emerald-400/30">
                          ● 24/7 Available
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
                          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                            {locale === 'ur' ? 'مین برانچ' : 'Main Hub'}
                          </span>
                          <span className="text-xs font-bold text-white block mt-0.5">
                            {settings.city}, KLP Road
                          </span>
                        </div>
                        <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
                          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                            {locale === 'ur' ? 'رابطہ نیٹ ورک' : 'Corridors'}
                          </span>
                          <span className="text-xs font-bold text-[#F5B301] block mt-0.5">
                            Motorway N-5 / M-5
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-300 pt-1 border-t border-white/10">
                        <span className="text-[11px]">
                          {locale === 'ur' ? 'زمین کو گھمائیں اور روٹس دیکھیں' : 'Interactive 3D Earth • Drag to rotate'}
                        </span>
                        <button
                          onClick={() => {
                            setCurrentView('cars');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="text-[#F5B301] hover:text-amber-300 font-bold text-xs flex items-center gap-1 transition-colors"
                        >
                          <span>{locale === 'ur' ? 'تمام گاڑیاں دیکھیں' : 'View Cars'}</span>
                          <ArrowIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
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
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider border border-amber-200">
                    {locale === 'ur' ? 'بہترین انتخاب' : 'Top Recommendations'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] mt-2">
                    {secTitle}
                  </h2>
                  {secSubtitle && <p className="text-slate-500 text-sm mt-1">{secSubtitle}</p>}
                </div>

                <button
                  onClick={() => {
                    setCurrentView('cars');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B1F3A] hover:text-amber-600 transition-colors group self-start sm:self-auto"
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
            <section key={sec.id} className="py-16 bg-white border-y border-slate-200/80">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider border border-amber-200">
                    {locale === 'ur' ? 'ہماری سہولیات' : 'What We Offer'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] mt-2">
                    {secTitle}
                  </h2>
                  {secSubtitle && <p className="text-slate-500 text-sm mt-1">{secSubtitle}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {services.slice(0, 3).map(srv => (
                    <div
                      key={srv.id}
                      className="rounded-3xl border border-slate-200 p-6 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <img
                          src={srv.image}
                          alt={srv.name.en}
                          className="w-full h-44 rounded-2xl object-cover"
                        />
                        <h3 className="font-bold text-base text-[#0B1F3A]">
                          {srv.name[locale] || srv.name.en}
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                          {srv.shortDesc[locale] || srv.shortDesc.en}
                        </p>
                      </div>

                      <button
                        onClick={() => navigateToBooking()}
                        className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-[#0B1F3A] hover:text-white text-slate-800 text-xs font-bold transition-all text-center"
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
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider border border-amber-200">
                  {locale === 'ur' ? 'ہمارا امتیازی معیار' : 'Customer First'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] mt-2">
                  {secTitle}
                </h2>
                {secSubtitle && <p className="text-slate-500 text-sm mt-1">{secSubtitle}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {points.map((pt: any, i: number) => {
                  const pTitle = pt.title[locale] || pt.title.en;
                  const pDesc = pt.desc[locale] || pt.desc.en;

                  return (
                    <div
                      key={i}
                      className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all space-y-3"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                        {iconMap[pt.icon] || <ShieldCheck className="w-6 h-6 text-blue-600" />}
                      </div>
                      <h3 className="font-bold text-sm text-[#0B1F3A]">{pTitle}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">{pDesc}</p>
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
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider border border-amber-200">
                  {locale === 'ur' ? 'صداقت اور اعتماد' : 'Genuine Feedback'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] mt-2">
                  {secTitle}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {approvedReviews.map(rev => (
                  <div
                    key={rev.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, idx) => (
                          <Star key={idx} className="w-4 h-4 fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-xs text-slate-600 italic leading-relaxed">
                        "{rev.comment[locale] || rev.comment.en}"
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-800 block">{rev.name}</span>
                        <span className="text-slate-400 text-[11px] block">{rev.trip[locale] || rev.trip.en}</span>
                      </div>
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
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
            <section key={sec.id} className="py-16 bg-slate-50 border-t border-slate-200/80">
              <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-10">
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider border border-amber-200">
                    {locale === 'ur' ? 'سوال و جواب' : 'Got Questions?'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] mt-2">
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
                        className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs"
                      >
                        <button
                          onClick={() => setActiveFaqIndex(isOpen ? null : idx)}
                          className="w-full text-start p-4 sm:p-5 flex items-center justify-between gap-3 text-sm font-bold text-[#0B1F3A] hover:bg-slate-50/50"
                        >
                          <span>{q}</span>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-400 transition-transform ${
                              isOpen ? 'rotate-180 text-[#0B1F3A]' : ''
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-5 sm:px-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
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
          );
        }

        return null;
      })}
    </div>
  );
};
