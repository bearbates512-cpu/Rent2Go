import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext.tsx';
import { checkVehicleAvailability } from '../../utils/availability.ts';
import { soundFX } from '../../utils/soundEffects.ts';
import { CarSpecsModal } from './CarSpecsModal.tsx';
import { triggerLiquidGasSplash, LiquidGasAura } from '../effects/LiquidGasCanvas.tsx';
import { SpinInHeading, SpinInText, LiquidGasBadge } from '../effects/SpinInTypography.tsx';
import {
  Users,
  Gauge,
  Snowflake,
  Fuel,
  ShieldCheck,
  Calendar,
  MessageSquare,
  Phone,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ArrowRight,
  Info,
  Car,
  Zap,
  Eye,
  Radio
} from 'lucide-react';

export const CarDetailView: React.FC = () => {
  const {
    vehicles,
    bookings,
    selectedCarSlug,
    locale,
    dir,
    setCurrentView,
    navigateToBooking,
    settings
  } = useApp();

  const vehicle = vehicles.find(v => v.slug === selectedCarSlug) || vehicles[0];

  const [activePhoto, setActivePhoto] = useState<string>(vehicle?.coverImage || '');
  const [specsModalOpen, setSpecsModalOpen] = useState<boolean>(false);
  const [checkStart, setCheckStart] = useState<string>('');
  const [checkEnd, setCheckEnd] = useState<string>('');
  const [availResult, setAvailResult] = useState<{ checked: boolean; isAvailable: boolean; message: string }>({
    checked: false,
    isAvailable: false,
    message: ''
  });

  // Trigger liquid gas splash immediately whenever car detail view opens or vehicle changes
  useEffect(() => {
    triggerLiquidGasSplash(window.innerWidth / 2, 220, 1.35);
  }, [vehicle?.id]);

  if (!vehicle) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Car not found</h2>
        <button
          onClick={() => setCurrentView('cars')}
          className="mt-4 px-4 py-2 rounded-lg bg-[#0B1F3A] text-white"
        >
          View all fleet
        </button>
      </div>
    );
  }

  const title = vehicle.title[locale] || vehicle.title.en;
  const description = vehicle.description[locale] || vehicle.description.en;

  const handleCheckAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playScan();
    if (!checkStart || !checkEnd) {
      setAvailResult({
        checked: true,
        isAvailable: false,
        message: locale === 'ur' ? 'براہِ کرم تاریخ منتخب کریں۔' : 'Please select both pickup and return dates.'
      });
      return;
    }

    const res = checkVehicleAvailability(
      vehicle,
      bookings,
      `${checkStart}T09:00:00Z`,
      `${checkEnd}T09:00:00Z`
    );

    if (res.isAvailable) {
      soundFX.playBeep(880, 0.1, 0.05);
      setAvailResult({
        checked: true,
        isAvailable: true,
        message: locale === 'ur' ? 'گاڑی ان تاریخوں کے لیے دستیاب ہے! ابھی بکنگ کی درخواست بھیجیں۔' : 'Vehicle is AVAILABLE for these dates! You can proceed to book.'
      });
    } else {
      soundFX.playBeep(320, 0.12, 0.05);
      setAvailResult({
        checked: true,
        isAvailable: false,
        message: res.reason || (locale === 'ur' ? 'گاڑی ان تاریخوں پر بک ہے، متبادل گاڑی دیکھیں۔' : 'Vehicle is unavailable during this period.')
      });
    }
  };

  const prefilledWA = encodeURIComponent(
    locale === 'ur'
      ? `السلام علیکم! میں رینٹ ٹو گو کی گاڑی ${vehicle.make} ${vehicle.model} (${vehicle.modelYear}) کے بارے میں رابطہ کر رہا ہوں۔`
      : `Hello Rent2Go! I am inquiring about the availability of ${vehicle.make} ${vehicle.model} (${vehicle.modelYear}).`
  );

  const similarCars = vehicles.filter(v => v.id !== vehicle.id && v.category === vehicle.category).slice(0, 3);
  const ArrowBack = dir === 'rtl' ? ArrowRight : ArrowLeft;

  const allPhotos = [vehicle.coverImage, ...(vehicle.galleryImages || [])];

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#060D17] text-slate-800 dark:text-slate-100 min-h-screen py-8 pb-24 md:pb-16 transition-colors duration-250">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Back */}
        <div className="flex items-center gap-2 mb-6 text-sm text-slate-500 dark:text-slate-400">
          <button
            onClick={() => setCurrentView('cars')}
            className="flex items-center gap-1 font-semibold text-[#0B1F3A] dark:text-amber-400 hover:underline cursor-pointer"
          >
            <ArrowBack className="w-4 h-4" />
            <span>{locale === 'ur' ? 'گاڑیوں کی فہرست' : 'Back to Fleet'}</span>
          </button>
          <span>/</span>
          <span className="text-slate-400 capitalize">{vehicle.category}</span>
          <span>/</span>
          <SpinInText as="span" className="text-slate-800 dark:text-white font-bold truncate">
            {title}
          </SpinInText>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* Left Column: Photos Gallery & Overview (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Stage Image with Liquid Gas Aura */}
            <div className="relative bg-white dark:bg-[#0B1523] rounded-3xl p-2 border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden group">
              <LiquidGasAura className="opacity-70" />
              <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-slate-900 z-10">
                <img
                  src={activePhoto || vehicle.coverImage}
                  alt={title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/cars/corolla-grande.jpg';
                  }}
                />
                <div className="absolute top-4 start-4 flex items-center gap-2 z-20">
                  <LiquidGasBadge className="bg-[#0B1F3A]/90 text-white">
                    {vehicle.category}
                  </LiquidGasBadge>
                  <span className="px-3 py-1 rounded-md bg-amber-500 text-[#0B1F3A] text-xs font-bold">
                    {vehicle.modelYear}
                  </span>
                </div>
              </div>

              {/* Thumbnails */}
              {allPhotos.length > 1 && (
                <div className="relative z-10 flex items-center gap-2.5 p-3 overflow-x-auto">
                  {allPhotos.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        soundFX.playClick();
                        setActivePhoto(img);
                        triggerLiquidGasSplash(window.innerWidth / 3, 260, 0.9);
                      }}
                      className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                        (activePhoto || vehicle.coverImage) === img
                          ? 'border-[#0B1F3A] dark:border-amber-400 scale-105 shadow-sm ring-2 ring-cyan-400/30'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/cars/corolla-grande.jpg';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description Card with Liquid Gas Glow */}
            <div className="relative bg-white dark:bg-[#0B1523] rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4 overflow-hidden">
              <LiquidGasAura className="opacity-35" />
              <div className="relative z-10 space-y-3">
                <SpinInHeading as="h2" className="text-xl font-bold text-[#0B1F3A] dark:text-white" splitWords>
                  {locale === 'ur' ? 'گاڑی کا تفصیلی جائزہ' : 'Vehicle Overview'}
                </SpinInHeading>
                <SpinInText className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {description}
                </SpinInText>

                {/* Features Chips */}
                <div className="pt-2">
                  <SpinInText as="span" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2.5">
                    {locale === 'ur' ? 'نمایاں خصوصیات' : 'Key Specifications & Features'}
                  </SpinInText>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.features.map((feat, i) => (
                      <LiquidGasBadge
                        key={i}
                        delay={i * 0.04}
                        className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold py-1 px-3 normal-case"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </LiquidGasBadge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Inclusions & Policies */}
            <div className="relative bg-white dark:bg-[#0B1523] rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4 overflow-hidden">
              <LiquidGasAura className="opacity-25" />
              <div className="relative z-10 space-y-4">
                <SpinInHeading as="h2" className="text-lg font-bold text-[#0B1F3A] dark:text-white" splitWords>
                  {locale === 'ur' ? 'کرایہ میں کیا شامل ہے؟' : 'Tariff Inclusions & Exclusions'}
                </SpinInHeading>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/40 space-y-2">
                    <SpinInText as="span" className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>{locale === 'ur' ? 'شامل سہولیات' : 'Included in Base Rent'}</span>
                    </SpinInText>
                    <ul className="space-y-1.5 text-slate-600 dark:text-slate-300 ps-5 list-disc">
                      <li><SpinInText as="span">{locale === 'ur' ? 'گاڑی کی فل مکینیکل فٹنس اور صفائی' : 'Full mechanical inspection & sanitised vehicle'}</SpinInText></li>
                      <li><SpinInText as="span">{locale === 'ur' ? 'صادق آباد بائی پاس پر 24 گھنٹے روڈ سائیڈ ہیلپ' : '24/7 Roadside breakdown assistance in Punjab'}</SpinInText></li>
                      <li><SpinInText as="span">{locale === 'ur' ? 'ٹریکر اور جی پی ایس سیفٹی مانیٹرنگ' : 'Live tracker & speed monitoring'}</SpinInText></li>
                      {vehicle.driverOption !== 'self_drive' && (
                        <li><SpinInText as="span">{locale === 'ur' ? 'تربیت یافتہ تصدیق شدہ ڈرائیور' : 'Verified polite local driver'}</SpinInText></li>
                      )}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-800/40 space-y-2">
                    <SpinInText as="span" className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 text-sm">
                      <Info className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>{locale === 'ur' ? 'اضافی اخراجات (کسٹمر کے ذمے)' : 'Excluded (Customer Responsibility)'}</span>
                    </SpinInText>
                    <ul className="space-y-1.5 text-slate-600 dark:text-slate-300 ps-5 list-disc">
                      <li><SpinInText as="span">{locale === 'ur' ? 'پیٹرول / ڈیزل (جتنے ایندھن پر گاڑی دی جائے گی اتنے پر واپسی)' : 'Fuel costs (tank-to-tank policy)'}</SpinInText></li>
                      <li><SpinInText as="span">{locale === 'ur' ? 'موٹروے ایم 5 اور ہائی وے ٹول ٹیکس' : 'Motorway tolls & city parking fees'}</SpinInText></li>
                      <li><SpinInText as="span">{locale === 'ur' ? 'اگر گاڑی صادق آباد سے باہر رات رکے تو ڈرائیور الاؤنس' : 'Driver night allowance (Rs. 1,000/night if outside Sadiqabad)'}</SpinInText></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Availability Checker & Booking CTA (5 cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            {/* Pricing Box with Liquid Gas Aura */}
            <div className="relative bg-white dark:bg-[#0B1523] rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-5 overflow-hidden">
              <LiquidGasAura className="opacity-40" />

              <div className="relative z-10 flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <SpinInText as="span" className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5">
                    {locale === 'ur' ? 'یومیہ کرایہ کا تخمینہ' : 'Daily Tariff (Base Rate)'}
                  </SpinInText>
                  {vehicle.dailyRatePKR ? (
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">PKR</span>
                      <SpinInHeading as="h3" className="text-3xl font-black text-[#0B1F3A] dark:text-white font-mono inline-block">
                        {vehicle.dailyRatePKR.toLocaleString()}
                      </SpinInHeading>
                      <span className="text-xs text-slate-500 dark:text-slate-400">/{locale === 'ur' ? 'دن' : 'day'}</span>
                    </div>
                  ) : (
                    <LiquidGasBadge className="text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10">
                      {locale === 'ur' ? 'خصوصی کوٹیشن کے لیے رابطہ کریں' : 'Custom Quote on Request'}
                    </LiquidGasBadge>
                  )}
                </div>

                <div className="text-end">
                  <span className="text-[11px] text-slate-400 block">{locale === 'ur' ? 'اسٹاک کوڈ' : 'Stock Code'}</span>
                  <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                    {vehicle.stockCode}
                  </span>
                </div>
              </div>

              {/* Specs Table */}
              <div className="relative z-10 grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <Users className="w-4 h-4 text-slate-600 dark:text-slate-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">{locale === 'ur' ? 'نشستیں' : 'Seating'}</span>
                    <SpinInText as="span" className="font-bold text-slate-800 dark:text-white">
                      {vehicle.seats} {locale === 'ur' ? 'افراد' : 'Passengers'}
                    </SpinInText>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <Gauge className="w-4 h-4 text-slate-600 dark:text-slate-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">{locale === 'ur' ? 'ٹرانسمیشن' : 'Gearbox'}</span>
                    <SpinInText as="span" className="font-bold text-slate-800 dark:text-white capitalize">
                      {vehicle.transmission}
                    </SpinInText>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <Snowflake className="w-4 h-4 text-blue-500 shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">{locale === 'ur' ? 'ایئر کنڈیشنر' : 'Air Con'}</span>
                    <SpinInText as="span" className="font-bold text-slate-800 dark:text-white">
                      {vehicle.hasAC ? 'Dual Chilled AC' : 'None'}
                    </SpinInText>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <Fuel className="w-4 h-4 text-slate-600 dark:text-slate-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">{locale === 'ur' ? 'ایندھن' : 'Fuel'}</span>
                    <SpinInText as="span" className="font-bold text-slate-800 dark:text-white capitalize">
                      {vehicle.fuelType}
                    </SpinInText>
                  </div>
                </div>
              </div>

              {/* Custom specs */}
              {vehicle.customFields && Object.keys(vehicle.customFields).length > 0 && (
                <div className="relative z-10 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                  {vehicle.customFields.mileageLimitPerDay && (
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>{locale === 'ur' ? 'روزانہ مائلیج لمٹ' : 'Daily Mileage Limit'}:</span>
                      <span className="font-bold text-slate-800 dark:text-white">{vehicle.customFields.mileageLimitPerDay}</span>
                    </div>
                  )}
                  {vehicle.customFields.extraKmRate && (
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>{locale === 'ur' ? 'اضافی کلومیٹر ریٹ' : 'Extra KM Rate'}:</span>
                      <span className="font-bold text-slate-800 dark:text-white">Rs. {vehicle.customFields.extraKmRate} / KM</span>
                    </div>
                  )}
                  {vehicle.customFields.securityDeposit ? (
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>{locale === 'ur' ? 'سیکیورٹی ڈپازٹ (سیلف ڈرائیو)' : 'Security Deposit (Self-Drive)'}:</span>
                      <span className="font-bold text-slate-800 dark:text-white font-mono">Rs. {vehicle.customFields.securityDeposit.toLocaleString()}</span>
                    </div>
                  ) : null}
                </div>
              )}

              {/* Live Availability Checker Box */}
              <div className="relative z-10 p-4 rounded-2xl bg-blue-50/50 dark:bg-slate-900/80 border border-blue-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0B1F3A] dark:text-white">
                  <Calendar className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                  <SpinInHeading as="h4" className="text-xs font-bold inline-block">
                    {locale === 'ur' ? 'دستیابی چیک کریں (لائیو)' : 'Live Availability Checker'}
                  </SpinInHeading>
                </div>

                <form onSubmit={handleCheckAvailability} className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-0.5">{locale === 'ur' ? 'شروع' : 'From'}</span>
                      <input
                        type="date"
                        value={checkStart}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={e => setCheckStart(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-0.5">{locale === 'ur' ? 'واپسی' : 'Until'}</span>
                      <input
                        type="date"
                        value={checkEnd}
                        min={checkStart || new Date().toISOString().split('T')[0]}
                        onChange={e => setCheckEnd(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    {locale === 'ur' ? 'دستیابی معلوم کریں' : 'Check Dates'}
                  </button>
                </form>

                {availResult.checked && (
                  <div
                    className={`p-2.5 rounded-xl text-xs flex items-start gap-2 ${
                      availResult.isAvailable
                        ? 'bg-emerald-100/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-rose-100/70 dark:bg-rose-950/40 text-rose-900 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                    }`}
                  >
                    {availResult.isAvailable ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <span className="font-medium leading-tight">{availResult.message}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="relative z-10 space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playScan();
                    triggerLiquidGasSplash(window.innerWidth / 2, window.innerHeight / 2, 1.4);
                    setSpecsModalOpen(true);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-slate-900 to-[#0B1F3A] border border-cyan-400/40 hover:border-cyan-400 text-cyan-300 text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>{locale === 'ur' ? 'گاڑی کا لائیو فئیر اور سپیکس سمولیٹر' : 'INTERACTIVE HUD & FARE ESTIMATOR'}</span>
                </button>

                <button
                  onClick={() => {
                    soundFX.playClick();
                    triggerLiquidGasSplash(window.innerWidth / 2, 240, 1.3);
                    navigateToBooking(vehicle.id);
                  }}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#0B1F3A] hover:bg-[#142F57] dark:bg-[#F5B301] dark:hover:bg-amber-400 text-[#F5B301] hover:text-white dark:text-[#0B1F3A] dark:hover:text-[#0B1F3A] text-sm font-bold shadow-md shadow-slate-900/10 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                >
                  <Car className="w-4 h-4" />
                  <span>{locale === 'ur' ? 'گاڑی بک کرنے کی درخواست بھیجیں' : 'Request Booking for this Car'}</span>
                </button>

                <a
                  href={`https://wa.me/${settings.whatsappNumber}?text=${prefilledWA}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>{locale === 'ur' ? 'واٹس ایپ پر فوری رابطہ کریں' : 'Instant WhatsApp Inquiry'}</span>
                </a>

                <a
                  href={`tel:${settings.phone}`}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-2 text-center"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>{locale === 'ur' ? 'فون پر بات کریں' : 'Call Booking Desk'}: {settings.phoneFormatted}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Cars Section */}
        {similarCars.length > 0 && (
          <div className="border-t border-slate-200 dark:border-slate-800 pt-10">
            <SpinInHeading as="h3" className="text-xl font-bold text-[#0B1F3A] dark:text-white mb-6">
              {locale === 'ur' ? 'اسی کیٹیگری کی دیگر گاڑیاں' : 'Similar Vehicles You May Like'}
            </SpinInHeading>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarCars.map(sim => (
                <div
                  key={sim.id}
                  onClick={() => {
                    soundFX.playClick();
                    triggerLiquidGasSplash(window.innerWidth / 2, 220, 1.2);
                    setCurrentView('car-detail');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="relative group bg-white dark:bg-[#0B1523] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 hover:shadow-lg cursor-pointer transition-all flex items-center gap-4 overflow-hidden"
                >
                  <LiquidGasAura className="opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
                  <img
                    src={sim.coverImage}
                    alt={sim.make}
                    className="w-24 h-16 rounded-xl object-cover shrink-0 relative z-10"
                  />
                  <div className="relative z-10">
                    <SpinInHeading as="h4" className="font-bold text-sm text-[#0B1F3A] dark:text-white">
                      {sim.make} {sim.model}
                    </SpinInHeading>
                    <SpinInText as="span" className="text-xs text-slate-500 dark:text-slate-400 block">
                      PKR {sim.dailyRatePKR?.toLocaleString() || 'Quote'}/day
                    </SpinInText>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Action Bar on Mobile (with Safe Area and High Contrast) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 dark:bg-[#0B1523]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-3 pb-safe z-40 shadow-2xl flex items-center justify-between gap-3">
        <div className="shrink-0">
          <span className="text-[10px] text-slate-400 dark:text-slate-400 block font-medium">{locale === 'ur' ? 'روزانہ کرایہ' : 'Tariff'}</span>
          <span className="text-sm font-extrabold text-[#0B1F3A] dark:text-[#F5B301] font-mono">
            {vehicle.dailyRatePKR ? `Rs. ${vehicle.dailyRatePKR.toLocaleString()}` : 'Quote'}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-1 justify-end">
          <a
            href={`https://wa.me/${settings.whatsappNumber}?text=${prefilledWA}`}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-[#25D366] text-white shrink-0 shadow-sm active:scale-95 transition-transform"
            title="WhatsApp"
            aria-label="WhatsApp"
          >
            <MessageSquare className="w-5 h-5 fill-current" />
          </a>
          <button
            onClick={() => navigateToBooking(vehicle.id)}
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#142F57] dark:bg-[#F5B301] dark:hover:bg-amber-400 text-white dark:text-[#0B1F3A] text-xs font-extrabold shrink-0 flex-1 text-center truncate shadow-sm active:scale-98 transition-all cursor-pointer"
          >
            {locale === 'ur' ? 'گاڑی بک کریں' : 'Request Booking'}
          </button>
        </div>
      </div>

      {/* Futuristic Specs Telemetry Modal */}
      {specsModalOpen && (
        <CarSpecsModal
          vehicle={vehicle}
          onClose={() => setSpecsModalOpen(false)}
        />
      )}
    </div>
  );
};
