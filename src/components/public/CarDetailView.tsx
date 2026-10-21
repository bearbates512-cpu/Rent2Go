import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { checkVehicleAvailability } from '../../utils/availability.ts';
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
  Car
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
  const [checkStart, setCheckStart] = useState<string>('');
  const [checkEnd, setCheckEnd] = useState<string>('');
  const [availResult, setAvailResult] = useState<{ checked: boolean; isAvailable: boolean; message: string }>({
    checked: false,
    isAvailable: false,
    message: ''
  });

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
      setAvailResult({
        checked: true,
        isAvailable: true,
        message: locale === 'ur' ? 'گاڑی ان تاریخوں کے لیے دستیاب ہے! ابھی بکنگ کی درخواست بھیجیں۔' : 'Vehicle is AVAILABLE for these dates! You can proceed to book.'
      });
    } else {
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
    <div className="bg-[#F8FAFC] min-h-screen py-8 pb-24 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Back */}
        <div className="flex items-center gap-2 mb-6 text-sm text-slate-500">
          <button
            onClick={() => setCurrentView('cars')}
            className="flex items-center gap-1 font-semibold text-[#0B1F3A] hover:underline"
          >
            <ArrowBack className="w-4 h-4" />
            <span>{locale === 'ur' ? 'گاڑیوں کی فہرست' : 'Back to Fleet'}</span>
          </button>
          <span>/</span>
          <span className="text-slate-400 capitalize">{vehicle.category}</span>
          <span>/</span>
          <span className="text-slate-800 font-bold truncate">{title}</span>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* Left Column: Photos Gallery & Overview (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Stage Image */}
            <div className="bg-white rounded-3xl p-2 border border-slate-200/90 shadow-sm overflow-hidden">
              <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-slate-900">
                <img
                  src={activePhoto || vehicle.coverImage}
                  alt={title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 start-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-md bg-[#0B1F3A]/90 text-white text-xs font-bold uppercase tracking-wider">
                    {vehicle.category}
                  </span>
                  <span className="px-3 py-1 rounded-md bg-amber-500 text-[#0B1F3A] text-xs font-bold">
                    {vehicle.modelYear}
                  </span>
                </div>
              </div>

              {/* Thumbnails */}
              {allPhotos.length > 1 && (
                <div className="flex items-center gap-2.5 p-3 overflow-x-auto">
                  {allPhotos.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhoto(img)}
                      className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                        (activePhoto || vehicle.coverImage) === img
                          ? 'border-[#0B1F3A] scale-105 shadow-sm'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-[#0B1F3A]">
                {locale === 'ur' ? 'گاڑی کا تفصیلی جائزہ' : 'Vehicle Overview'}
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                {description}
              </p>

              {/* Features Chips */}
              <div className="pt-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  {locale === 'ur' ? 'نمایاں خصوصیات' : 'Key Specifications & Features'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {vehicle.features.map((feat, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{feat}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Inclusions & Policies */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-[#0B1F3A]">
                {locale === 'ur' ? 'کرایہ میں کیا شامل ہے؟' : 'Tariff Inclusions & Exclusions'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
                  <span className="font-bold text-emerald-800 flex items-center gap-1.5 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{locale === 'ur' ? 'شامل سہولیات' : 'Included in Base Rent'}</span>
                  </span>
                  <ul className="space-y-1.5 text-slate-600 ps-5 list-disc">
                    <li>{locale === 'ur' ? 'گاڑی کی فل مکینیکل فٹنس اور صفائی' : 'Full mechanical inspection & sanitised vehicle'}</li>
                    <li>{locale === 'ur' ? 'صادق آباد بائی پاس پر 24 گھنٹے روڈ سائیڈ ہیلپ' : '24/7 Roadside breakdown assistance in Punjab'}</li>
                    <li>{locale === 'ur' ? 'ٹریکر اور جی پی ایس سیفٹی مانیٹرنگ' : 'Live tracker & speed monitoring'}</li>
                    {vehicle.driverOption !== 'self_drive' && (
                      <li>{locale === 'ur' ? 'تربیت یافتہ تصدیق شدہ ڈرائیور' : 'Verified polite local driver'}</li>
                    )}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-2">
                  <span className="font-bold text-amber-800 flex items-center gap-1.5 text-sm">
                    <Info className="w-4 h-4 text-amber-600" />
                    <span>{locale === 'ur' ? 'اضافی اخراجات (کسٹمر کے ذمے)' : 'Excluded (Customer Responsibility)'}</span>
                  </span>
                  <ul className="space-y-1.5 text-slate-600 ps-5 list-disc">
                    <li>{locale === 'ur' ? 'پیٹرول / ڈیزل (جتنے ایندھن پر گاڑی دی جائے گی اتنے پر واپسی)' : 'Fuel costs (tank-to-tank policy)'}</li>
                    <li>{locale === 'ur' ? 'موٹروے ایم 5 اور ہائی وے ٹول ٹیکس' : 'Motorway tolls & city parking fees'}</li>
                    <li>{locale === 'ur' ? 'اگر گاڑی صادق آباد سے باہر رات رکے تو ڈرائیور الاؤنس' : 'Driver night allowance (Rs. 1,000/night if outside Sadiqabad)'}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Availability Checker & Booking CTA (5 cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            {/* Pricing Box */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5">
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs text-slate-500 block mb-0.5">
                    {locale === 'ur' ? 'یومیہ کرایہ کا تخمینہ' : 'Daily Tariff (Base Rate)'}
                  </span>
                  {vehicle.dailyRatePKR ? (
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-bold text-slate-700">PKR</span>
                      <span className="text-3xl font-black text-[#0B1F3A] font-mono">
                        {vehicle.dailyRatePKR.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-500">/{locale === 'ur' ? 'دن' : 'day'}</span>
                    </div>
                  ) : (
                    <span className="text-lg font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-lg inline-block">
                      {locale === 'ur' ? 'خصوصی کوٹیشن کے لیے رابطہ کریں' : 'Custom Quote on Request'}
                    </span>
                  )}
                </div>

                <div className="text-end">
                  <span className="text-[11px] text-slate-400 block">{locale === 'ur' ? 'اسٹاک کوڈ' : 'Stock Code'}</span>
                  <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                    {vehicle.stockCode}
                  </span>
                </div>
              </div>

              {/* Specs Table */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <Users className="w-4 h-4 text-slate-600 shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">{locale === 'ur' ? 'نشستیں' : 'Seating'}</span>
                    <span className="font-bold text-slate-800">{vehicle.seats} {locale === 'ur' ? 'افراد' : 'Passengers'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <Gauge className="w-4 h-4 text-slate-600 shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">{locale === 'ur' ? 'ٹرانسمیشن' : 'Gearbox'}</span>
                    <span className="font-bold text-slate-800 capitalize">{vehicle.transmission}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <Snowflake className="w-4 h-4 text-blue-500 shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">{locale === 'ur' ? 'ایئر کنڈیشنر' : 'Air Con'}</span>
                    <span className="font-bold text-slate-800">{vehicle.hasAC ? 'Dual Chilled AC' : 'None'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <Fuel className="w-4 h-4 text-slate-600 shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">{locale === 'ur' ? 'ایندھن' : 'Fuel'}</span>
                    <span className="font-bold text-slate-800 capitalize">{vehicle.fuelType}</span>
                  </div>
                </div>
              </div>

              {/* Custom specs */}
              {vehicle.customFields && Object.keys(vehicle.customFields).length > 0 && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                  {vehicle.customFields.mileageLimitPerDay && (
                    <div className="flex justify-between text-slate-600">
                      <span>{locale === 'ur' ? 'روزانہ مائلیج لمٹ' : 'Daily Mileage Limit'}:</span>
                      <span className="font-bold text-slate-800">{vehicle.customFields.mileageLimitPerDay}</span>
                    </div>
                  )}
                  {vehicle.customFields.extraKmRate && (
                    <div className="flex justify-between text-slate-600">
                      <span>{locale === 'ur' ? 'اضافی کلومیٹر ریٹ' : 'Extra KM Rate'}:</span>
                      <span className="font-bold text-slate-800">Rs. {vehicle.customFields.extraKmRate} / KM</span>
                    </div>
                  )}
                  {vehicle.customFields.securityDeposit ? (
                    <div className="flex justify-between text-slate-600">
                      <span>{locale === 'ur' ? 'سیکیورٹی ڈپازٹ (سیلف ڈرائیو)' : 'Security Deposit (Self-Drive)'}:</span>
                      <span className="font-bold text-slate-800 font-mono">Rs. {vehicle.customFields.securityDeposit.toLocaleString()}</span>
                    </div>
                  ) : null}
                </div>
              )}

              {/* Live Availability Checker Box */}
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0B1F3A]">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>{locale === 'ur' ? 'دستیابی چیک کریں (لائیو)' : 'Live Availability Checker'}</span>
                </div>

                <form onSubmit={handleCheckAvailability} className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-500 block mb-0.5">{locale === 'ur' ? 'شروع' : 'From'}</span>
                      <input
                        type="date"
                        value={checkStart}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={e => setCheckStart(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block mb-0.5">{locale === 'ur' ? 'واپسی' : 'Until'}</span>
                      <input
                        type="date"
                        value={checkEnd}
                        min={checkStart || new Date().toISOString().split('T')[0]}
                        onChange={e => setCheckEnd(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
                  >
                    {locale === 'ur' ? 'دستیابی معلوم کریں' : 'Check Dates'}
                  </button>
                </form>

                {availResult.checked && (
                  <div
                    className={`p-2.5 rounded-xl text-xs flex items-start gap-2 ${
                      availResult.isAvailable
                        ? 'bg-emerald-100/70 text-emerald-900 border border-emerald-200'
                        : 'bg-rose-100/70 text-rose-900 border border-rose-200'
                    }`}
                  >
                    {availResult.isAvailable ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <span className="font-medium leading-tight">{availResult.message}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => navigateToBooking(vehicle.id)}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#0B1F3A] hover:bg-[#142F57] text-[#F5B301] text-sm font-bold shadow-md shadow-slate-900/10 transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <Car className="w-4 h-4" />
                  <span>{locale === 'ur' ? 'گاڑی بک کرنے کی درخواست بھیجیں' : 'Request Booking for this Car'}</span>
                </button>

                <a
                  href={`https://wa.me/${settings.whatsappNumber}?text=${prefilledWA}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-bold transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>{locale === 'ur' ? 'واٹس ایپ پر فوری رابطہ کریں' : 'Instant WhatsApp Inquiry'}</span>
                </a>

                <a
                  href={`tel:${settings.phone}`}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-2 text-center"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{locale === 'ur' ? 'فون پر بات کریں' : 'Call Booking Desk'}: {settings.phoneFormatted}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Cars Section */}
        {similarCars.length > 0 && (
          <div className="border-t border-slate-200 pt-10">
            <h3 className="text-xl font-bold text-[#0B1F3A] mb-6">
              {locale === 'ur' ? 'اسی کیٹیگری کی دیگر گاڑیاں' : 'Similar Vehicles You May Like'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarCars.map(sim => (
                <div
                  key={sim.id}
                  onClick={() => {
                    setCurrentView('car-detail');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-md cursor-pointer transition-all flex items-center gap-4"
                >
                  <img
                    src={sim.coverImage}
                    alt={sim.make}
                    className="w-24 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-[#0B1F3A]">
                      {sim.make} {sim.model}
                    </h4>
                    <span className="text-xs text-slate-500 block">
                      PKR {sim.dailyRatePKR?.toLocaleString() || 'Quote'}/day
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Action Bar on Mobile (per Design Brief Section 3 & 5.3) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 z-40 shadow-xl flex items-center justify-between gap-2">
        <div className="shrink-0">
          <span className="text-[10px] text-slate-400 block">{locale === 'ur' ? 'کرایہ' : 'Tariff'}</span>
          <span className="text-sm font-extrabold text-[#0B1F3A] font-mono">
            {vehicle.dailyRatePKR ? `Rs. ${vehicle.dailyRatePKR.toLocaleString()}` : 'Quote'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-1 justify-end">
          <a
            href={`https://wa.me/${settings.whatsappNumber}?text=${prefilledWA}`}
            className="p-2.5 rounded-xl bg-[#25D366] text-white shrink-0"
            title="WhatsApp"
          >
            <MessageSquare className="w-5 h-5 fill-current" />
          </a>
          <button
            onClick={() => navigateToBooking(vehicle.id)}
            className="px-4 py-2.5 rounded-xl bg-[#0B1F3A] text-white text-xs font-bold shrink-0 flex-1 text-center truncate"
          >
            {locale === 'ur' ? 'گاڑی بک کریں' : 'Request Booking'}
          </button>
        </div>
      </div>
    </div>
  );
};
