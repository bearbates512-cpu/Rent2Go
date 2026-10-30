import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext.tsx';
import { soundFX } from '../../utils/soundEffects.ts';
import { calculateQuote } from '../../utils/pricing.ts';
import { normalizePkPhone } from '../../utils/phone.ts';
import { RentalType } from '../../types/index.ts';
import {
  Car,
  Calendar,
  MapPin,
  Clock,
  User,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Banknote,
  Info
} from 'lucide-react';

export const BookingWizard: React.FC = () => {
  const {
    locale,
    dir,
    vehicles,
    services,
    selectedCarForBooking,
    createBookingRequest,
    setCurrentView
  } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 7;

  // Form State
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(
    selectedCarForBooking?.id || vehicles[0]?.id || ''
  );
  const [rentalType, setRentalType] = useState<RentalType>('daily');
  const [driverOption, setDriverOption] = useState<'with_driver' | 'self_drive'>(
    selectedCarForBooking?.driverOption === 'self_drive' ? 'self_drive' : 'with_driver'
  );

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [pickupDate, setPickupDate] = useState<string>(today);
  const [pickupTime, setPickupTime] = useState<string>('10:00');
  const [returnDate, setReturnDate] = useState<string>(tomorrow);
  const [returnTime, setReturnTime] = useState<string>('18:00');

  const [pickupLocation, setPickupLocation] = useState<string>('Near Sadiqabad Bypass, KLP Road');
  const [destination, setDestination] = useState<string>('Rahim Yar Khan');
  const [dropoffLocation, setDropoffLocation] = useState<string>('');
  const [passengers, setPassengers] = useState<number>(2);

  const [fullName, setFullName] = useState<string>('');
  const [rawPhone, setRawPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [preferredContact, setPreferredContact] = useState<'whatsapp' | 'call'>('whatsapp');
  const [customerNotes, setCustomerNotes] = useState<string>('');
  const [consentAccepted, setConsentAccepted] = useState<boolean>(false);

  // Errors
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];

  // Dynamic live quote calculation
  const quote = calculateQuote({
    dailyRatePKR: selectedVehicle?.dailyRatePKR ?? null,
    driverDailyFeePKR: selectedVehicle?.driverDailyFeePKR ?? 1500,
    driverOption,
    pickupDate,
    pickupTime,
    returnDate,
    returnTime,
    rentalType,
    customDeposit: selectedVehicle?.customFields?.securityDeposit
  });

  const validateStep = (step: number): boolean => {
    setErrorMsg('');

    if (step === 1) {
      if (!selectedVehicleId) {
        setErrorMsg(locale === 'ur' ? 'براہِ کرم گاڑی کا انتخاب کریں۔' : 'Please select a vehicle.');
        return false;
      }
    }

    if (step === 2) {
      if (!pickupDate || !returnDate) {
        setErrorMsg(locale === 'ur' ? 'پک اپ اور واپسی کی تاریخ درکار ہے۔' : 'Pickup and return dates are required.');
        return false;
      }
      const pDate = new Date(`${pickupDate}T${pickupTime || '09:00'}:00`);
      const rDate = new Date(`${returnDate}T${returnTime || '09:00'}:00`);
      if (rDate <= pDate) {
        setErrorMsg(locale === 'ur' ? 'واپسی کا وقت پک اپ کے بعد ہونا چاہیے۔' : 'Return date/time must be after pickup date/time.');
        return false;
      }
    }

    if (step === 3) {
      if (!pickupLocation.trim() || !destination.trim()) {
        setErrorMsg(locale === 'ur' ? 'پک اپ کا پتہ اور منزل درج کریں۔' : 'Please provide both pickup address and destination.');
        return false;
      }
    }

    if (step === 4) {
      if (passengers < 1) {
        setErrorMsg(locale === 'ur' ? 'مسافروں کی تعداد درج کریں۔' : 'Passengers must be at least 1.');
        return false;
      }
      if (selectedVehicle && passengers > selectedVehicle.seats) {
        setErrorMsg(
          locale === 'ur'
            ? `مسافر گاڑی کی گنجائش (${selectedVehicle.seats} سیٹیں) سے زیادہ نہیں ہو سکتے۔`
            : `Passenger count cannot exceed vehicle capacity (${selectedVehicle.seats} seats).`
        );
        return false;
      }
    }

    if (step === 5) {
      if (!fullName.trim()) {
        setErrorMsg(locale === 'ur' ? 'اپنا مکمل نام درج کریں۔' : 'Please enter your full name.');
        return false;
      }
      const phoneNorm = normalizePkPhone(rawPhone);
      if (!phoneNorm.isValid) {
        setErrorMsg(phoneNorm.error || 'Please enter a valid Pakistani mobile number.');
        return false;
      }
    }

    if (step === 7) {
      if (!consentAccepted) {
        setErrorMsg(
          locale === 'ur'
            ? 'بکنگ بھیجنے کے لیے شرائط اور پرائیویسی پر رضامندی لازمی ہے۔'
            : 'You must agree to the Terms & Privacy terms to submit your booking request.'
        );
        return false;
      }
    }

    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      soundFX.playClick();
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    soundFX.playClick();
    setErrorMsg('');
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(7)) return;

    setIsSubmitting(true);
    const phoneNorm = normalizePkPhone(rawPhone);

    const result = createBookingRequest({
      customerName: fullName.trim(),
      customerPhone: phoneNorm.formatted,
      customerEmail: email.trim() || undefined,
      preferredContact,
      vehicleId: selectedVehicle?.id,
      vehicleName: `${selectedVehicle?.make} ${selectedVehicle?.model} (${selectedVehicle?.modelYear})`,
      rentalType,
      driverOption,
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
      pickupLocation: pickupLocation.trim(),
      destination: destination.trim(),
      dropoffLocation: dropoffLocation.trim() || undefined,
      passengers,
      customerNotes: customerNotes.trim(),
      estimate: quote,
      source: 'website'
    });

    setIsSubmitting(false);

    if (result.success && result.booking) {
      setCurrentView('booking-success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setErrorMsg(result.error || 'Unable to submit booking. Please try again.');
    }
  };

  const ArrowNext = dir === 'rtl' ? ArrowLeft : ArrowRight;
  const ArrowPrev = dir === 'rtl' ? ArrowRight : ArrowLeft;

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#060D17] min-h-screen py-10 transition-colors duration-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header Title */}
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-3 py-1 rounded-full uppercase tracking-wider border border-amber-200 dark:border-amber-500/20">
            {locale === 'ur' ? 'آن لائن بکنگ فارم' : 'Online Booking Request'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] dark:text-white mt-2">
            {locale === 'ur' ? 'آسان اور شفاف کار رینٹل بکنگ' : 'Book Your Vehicle in Sadiqabad'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {locale === 'ur'
              ? 'مرحلہ وار تفصیلات درج کریں، فوری تخمینہ دیکھیں اور درخواست بھیجیں۔'
              : 'Complete the steps below. We verify every request and confirm with you personally.'}
          </p>
        </div>

        {/* Stepper Indicator */}
        <div className="bg-white dark:bg-[#0B1523] rounded-2xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm mb-6">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-2.5">
            <span>
              {locale === 'ur' ? `مرحلہ ${currentStep} از ${totalSteps}` : `Step ${currentStep} of ${totalSteps}`}
            </span>
            <span className="text-[#0B1F3A] dark:text-amber-400">
              {currentStep === 1 && (locale === 'ur' ? 'گاڑی کا انتخاب' : 'Select Vehicle')}
              {currentStep === 2 && (locale === 'ur' ? 'تاریخ اور وقت' : 'Dates & Time')}
              {currentStep === 3 && (locale === 'ur' ? 'پک اپ اور منزل' : 'Locations')}
              {currentStep === 4 && (locale === 'ur' ? 'کرایہ کی قسم اور ڈرائیور' : 'Rental Mode')}
              {currentStep === 5 && (locale === 'ur' ? 'رابطہ کی تفصیلات' : 'Contact Details')}
              {currentStep === 6 && (locale === 'ur' ? 'کرایہ کا تخمینہ' : 'Fare Breakdown')}
              {currentStep === 7 && (locale === 'ur' ? 'تصدیق و ارسال' : 'Review & Submit')}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-[#0B1F3A] dark:bg-amber-400 transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <span className="font-semibold">{errorMsg}</span>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white dark:bg-[#0B1523] rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {/* STEP 1: Select Vehicle */}
              {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-[#0B1F3A] dark:text-white">
                {locale === 'ur' ? 'مرحلہ 1: مطلوبہ گاڑی منتخب کریں' : 'Step 1: Choose Your Preferred Vehicle'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {vehicles
                  .filter(v => v.visibility === 'published')
                  .map(veh => {
                    const isSelected = selectedVehicleId === veh.id;
                    return (
                      <div
                        key={veh.id}
                        onClick={() => setSelectedVehicleId(veh.id)}
                        className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3.5 ${
                          isSelected
                            ? 'border-[#0B1F3A] dark:border-amber-400 bg-blue-50/30 dark:bg-amber-400/10 shadow-xs'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/60'
                        }`}
                      >
                        <img
                          src={veh.coverImage}
                          alt={veh.make}
                          className="w-20 h-14 rounded-xl object-cover shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/cars/corolla-grande.jpg';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm text-[#0B1F3A] dark:text-white truncate">
                            {veh.make} {veh.model}
                          </h4>
                          <span className="text-xs text-slate-500 dark:text-slate-400 block">
                            {veh.seats} {locale === 'ur' ? 'نشستیں' : 'Seats'} • {veh.transmission}
                          </span>
                          <span className="text-xs font-bold text-slate-800 dark:text-amber-400 font-mono mt-0.5 block">
                            {veh.dailyRatePKR ? `Rs. ${veh.dailyRatePKR.toLocaleString()}/day` : 'Contact for quote'}
                          </span>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-[#0B1F3A] dark:text-amber-400 shrink-0" />
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* STEP 2: Dates & Times */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-[#0B1F3A] dark:text-white">
                {locale === 'ur' ? 'مرحلہ 2: سفر کی تاریخ اور وقت' : 'Step 2: Travel Dates & Times'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                    <span>{locale === 'ur' ? 'پک اپ تاریخ' : 'Pickup Date'}</span>
                  </label>
                  <input
                    type="date"
                    min={today}
                    value={pickupDate}
                    onChange={e => setPickupDate(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-[#0B1F3A] dark:focus:ring-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                    <span>{locale === 'ur' ? 'پک اپ وقت' : 'Pickup Time (PST)'}</span>
                  </label>
                  <input
                    type="time"
                    value={pickupTime}
                    onChange={e => setPickupTime(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-[#0B1F3A] dark:focus:ring-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{locale === 'ur' ? 'واپسی تاریخ' : 'Return Date'}</span>
                  </label>
                  <input
                    type="date"
                    min={pickupDate || today}
                    value={returnDate}
                    onChange={e => setReturnDate(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-[#0B1F3A] dark:focus:ring-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{locale === 'ur' ? 'واپسی وقت' : 'Return Time (PST)'}</span>
                  </label>
                  <input
                    type="time"
                    value={returnTime}
                    onChange={e => setReturnTime(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-[#0B1F3A] dark:focus:ring-amber-400"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 text-xs text-blue-900 dark:text-blue-300 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0" />
                <span>
                  {locale === 'ur'
                    ? `کل متوقع مدت: ${quote.rentalDays} دن (${quote.rentalDays * 24} گھنٹے)`
                    : `Calculated Duration: ${quote.rentalDays} Day(s) (${quote.rentalDays * 24} hours cycle)`}
                </span>
              </div>
            </div>
          )}

          {/* STEP 3: Locations */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-[#0B1F3A] dark:text-white">
                {locale === 'ur' ? 'مرحلہ 3: پک اپ کا پتہ اور منزل' : 'Step 3: Pickup & Destination Locations'}
              </h2>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span>{locale === 'ur' ? 'پک اپ کا پتہ (صادق آباد میں مقام)' : 'Pickup Address (Sadiqabad Location)'}</span>
                </label>
                <input
                  type="text"
                  value={pickupLocation}
                  onChange={e => setPickupLocation(e.target.value)}
                  placeholder="e.g. Model Town, KLP Road, Near Railway Station"
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-[#0B1F3A] dark:focus:ring-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{locale === 'ur' ? 'منزل (شہر یا مقام)' : 'Destination / Target City'}</span>
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                  placeholder="e.g. Rahim Yar Khan, Sukkur, Multan, Lahore, Karachi"
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-[#0B1F3A] dark:focus:ring-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {locale === 'ur' ? 'مخصوص ڈراپ آف ایڈریس (اختیاری)' : 'Specific Drop-off Address (Optional)'}
                </label>
                <input
                  type="text"
                  value={dropoffLocation}
                  onChange={e => setDropoffLocation(e.target.value)}
                  placeholder="e.g. Sheikh Zayed Hospital, RYK Airport, Hotel"
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-[#0B1F3A] dark:focus:ring-amber-400"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Rental Type & Driver */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-[#0B1F3A] dark:text-white">
                {locale === 'ur' ? 'مرحلہ 4: کرایہ کی قسم اور ڈرائیور کا انتخاب' : 'Step 4: Rental Option & Passengers'}
              </h2>

              {/* Driver Option */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  {locale === 'ur' ? 'ڈرائیور کی سہولت' : 'Driver Preference'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setDriverOption('with_driver')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      driverOption === 'with_driver'
                        ? 'border-[#0B1F3A] dark:border-amber-400 bg-blue-50/30 dark:bg-amber-400/10'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60'
                    }`}
                  >
                    <span className="font-bold text-sm text-[#0B1F3A] dark:text-white block">
                      {locale === 'ur' ? 'ڈرائیور کے ساتھ (تجویز کردہ)' : 'With Driver (Recommended)'}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1">
                      {locale === 'ur' ? 'بااخلاق تجربہ کار ڈرائیور' : 'Verified local chauffeur included'}
                    </span>
                  </div>

                  <div
                    onClick={() => setDriverOption('self_drive')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      driverOption === 'self_drive'
                        ? 'border-[#0B1F3A] dark:border-amber-400 bg-blue-50/30 dark:bg-amber-400/10'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60'
                    }`}
                  >
                    <span className="font-bold text-sm text-[#0B1F3A] dark:text-white block">
                      {locale === 'ur' ? 'سیلف ڈرائیو (خود چلائیں)' : 'Self-Drive'}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1">
                      {locale === 'ur' ? 'اصل شناختی کارڈ اور ڈپازٹ درکار' : 'Valid CNIC & deposit required'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rental Type */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  {locale === 'ur' ? 'سفر کی نوعیت' : 'Trip / Rental Type'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'daily', en: 'Daily Rental', ur: 'یومیہ کرایہ' },
                    { id: 'round_trip', en: 'Round Trip (Return)', ur: 'راؤنڈ ٹرپ (واپسی)' },
                    { id: 'one_way', en: 'One-Way Drop', ur: 'ایک طرفہ ڈراپ' },
                    { id: 'wedding_event', en: 'Wedding / Event', ur: 'شادی / تقریب' },
                    { id: 'hourly', en: 'Hourly City Run', ur: 'شہر کے اندر چند گھنٹے' }
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setRentalType(t.id as RentalType)}
                      className={`p-3 rounded-xl border text-center font-semibold transition-all cursor-pointer ${
                        rentalType === t.id
                          ? 'border-[#0B1F3A] bg-[#0B1F3A] dark:border-amber-400 dark:bg-amber-400 dark:text-slate-950 text-white shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {locale === 'ur' ? t.ur : t.en}
                    </button>
                  ))}
                </div>
              </div>

              {/* Passengers Count */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  {locale === 'ur' ? 'مسافروں کی تعداد' : 'Number of Passengers'}
                </label>
                <input
                  type="number"
                  min={1}
                  max={selectedVehicle?.seats || 14}
                  value={passengers}
                  onChange={e => setPassengers(parseInt(e.target.value) || 1)}
                  className="w-full sm:w-48 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-medium"
                />
                <span className="text-xs text-slate-400 dark:text-slate-500 block mt-1">
                  Max capacity for {selectedVehicle?.make}: {selectedVehicle?.seats} seats
                </span>
              </div>
            </div>
          )}

          {/* STEP 5: Contact Details */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-[#0B1F3A] dark:text-white">
                {locale === 'ur' ? 'مرحلہ 5: آپ کے رابطہ کی معلومات' : 'Step 5: Your Contact Information'}
              </h2>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <span>{locale === 'ur' ? 'مکمل نام' : 'Full Name'} *</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Muhammad Usman"
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-medium"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <span>{locale === 'ur' ? 'موبائل نمبر (پاکستان)' : 'Pakistani Mobile Number'} *</span>
                </label>
                <input
                  type="tel"
                  value={rawPhone}
                  onChange={e => setRawPhone(e.target.value)}
                  placeholder="0300 1234567 or +923001234567"
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-medium font-mono"
                  dir="ltr"
                  required
                />
                <span className="text-[11px] text-slate-400 dark:text-slate-500 block">
                  {locale === 'ur' ? 'بکنگ تصدیق اور واٹس ایپ کے لیے فعال نمبر درج کریں۔' : 'Active number for booking confirmation and WhatsApp updates.'}
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <span>{locale === 'ur' ? 'ای میل ایڈریس (اختیاری)' : 'Email Address (Optional)'}</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  {locale === 'ur' ? 'رابطہ کا ترجیحی ذریعہ' : 'Preferred Contact Channel'}
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-800 dark:text-slate-200">
                    <input
                      type="radio"
                      name="preferredContact"
                      checked={preferredContact === 'whatsapp'}
                      onChange={() => setPreferredContact('whatsapp')}
                      className="accent-[#0B1F3A] dark:accent-amber-400"
                    />
                    <span>WhatsApp</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-800 dark:text-slate-200">
                    <input
                      type="radio"
                      name="preferredContact"
                      checked={preferredContact === 'call'}
                      onChange={() => setPreferredContact('call')}
                      className="accent-[#0B1F3A] dark:accent-amber-400"
                    />
                    <span>{locale === 'ur' ? 'فون کال' : 'Phone Call'}</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  {locale === 'ur' ? 'اضافی ہدایات یا کمنٹس (اختیاری)' : 'Special Requests / Notes (Optional)'}
                </label>
                <textarea
                  rows={2}
                  value={customerNotes}
                  onChange={e => setCustomerNotes(e.target.value)}
                  placeholder="e.g. Baby seat required, AC must be chilled, flight number..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-medium"
                />
              </div>
            </div>
          )}

          {/* STEP 6: Live Estimate Breakdown */}
          {currentStep === 6 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h2 className="text-lg font-bold text-[#0B1F3A] dark:text-white">
                  {locale === 'ur' ? 'مرحلہ 6: شفاف تخمینہ کرایہ' : 'Step 6: Estimated Fare Breakdown'}
                </h2>
                <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-500/20">
                  {locale === 'ur' ? 'تخمینہ — ایڈمن تصدیق مشروط' : 'Estimated — Subject to Confirmation'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 space-y-3 text-sm">
                <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                  <span>
                    {selectedVehicle?.make} {selectedVehicle?.model} ({quote.rentalDays} {locale === 'ur' ? 'دن' : 'days'})
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {quote.baseTotal ? `PKR ${quote.baseTotal.toLocaleString()}` : 'Quote required'}
                  </span>
                </div>

                {driverOption === 'with_driver' && (
                  <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                    <span>{locale === 'ur' ? 'ڈرائیور الاؤنس' : 'Chauffeur Allowance'} ({quote.rentalDays} {locale === 'ur' ? 'دن' : 'days'})</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">PKR {quote.driverTotal.toLocaleString()}</span>
                  </div>
                )}

                {quote.securityDeposit > 0 && (
                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 text-xs">
                    <span>{locale === 'ur' ? 'واپسی کے قابل سیکیورٹی ڈپازٹ' : 'Refundable Security Deposit (Self-Drive)'}</span>
                    <span className="font-mono text-slate-800 dark:text-slate-300">PKR {quote.securityDeposit.toLocaleString()}</span>
                  </div>
                )}

                <div className="border-t border-slate-200 dark:border-slate-800 pt-3 flex justify-between items-baseline">
                  <span className="font-extrabold text-base text-[#0B1F3A] dark:text-white">
                    {locale === 'ur' ? 'کل متوقع کرایہ' : 'Total Estimated Fare'}
                  </span>
                  <div className="text-end">
                    {quote.estimatedTotal ? (
                      <span className="text-2xl font-black text-[#0B1F3A] dark:text-amber-400 font-mono">
                        PKR {quote.estimatedTotal.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
                        {locale === 'ur' ? 'ایڈمن خصوصی ریٹ بتائے گا' : 'Special Quote on Confirmation'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-700/50 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                <strong className="block font-bold mb-1">
                  {locale === 'ur' ? 'اہم وضاحت:' : 'Important Note:'}
                </strong>
                {locale === 'ur'
                  ? 'یہ صرف تخمینہ ہے۔ پیٹرول اور موٹروے ٹول ٹیکس اس میں شامل نہیں۔ بکنگ کی درخواست بھیجنے پر ہمارا مینیجر فوری آپ کو حتمی کوٹیشن فراہم کرے گا۔'
                  : 'This is an estimate. Fuel costs and motorway tolls are separate. Our booking desk will contact you to confirm final quote.'}
              </div>
            </div>
          )}

          {/* STEP 7: Consent & Final Submit */}
          {currentStep === 7 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-[#0B1F3A] dark:text-white">
                {locale === 'ur' ? 'مرحلہ 7: بکنگ کی شرائط اور تصدیق' : 'Step 7: Terms Consent & Submission'}
              </h2>

              {/* Summary snapshot */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">{locale === 'ur' ? 'گاڑی:' : 'Vehicle:'}</span>
                  <span className="font-bold text-slate-800 dark:text-white">{selectedVehicle?.make} {selectedVehicle?.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">{locale === 'ur' ? 'سفر:' : 'Route:'}</span>
                  <span className="font-bold text-slate-800 dark:text-white">{pickupLocation} ➔ {destination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">{locale === 'ur' ? 'تاریخیں:' : 'Dates:'}</span>
                  <span className="font-bold text-slate-800 dark:text-white">{pickupDate} ({pickupTime}) تا {returnDate} ({returnTime})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">{locale === 'ur' ? 'کسٹمر نام و نمبر:' : 'Customer:'}</span>
                  <span className="font-bold text-slate-800 dark:text-white">{fullName} ({rawPhone})</span>
                </div>
              </div>

              {/* Consent checkbox */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentAccepted}
                    onChange={e => setConsentAccepted(e.target.checked)}
                    className="w-5 h-5 rounded-md accent-[#0B1F3A] dark:accent-amber-400 mt-0.5 shrink-0"
                    required
                  />
                  <span className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {locale === 'ur'
                      ? 'میں تصدیق کرتا ہوں کہ فراہم کردہ تمام معلومات درست ہیں اور میں رینٹ ٹو گو کی رینٹل شرائط، منسوخی پالیسی اور کسٹمر کے فرائض سے متفق ہوں۔'
                      : 'I acknowledge that the information provided is correct and I accept Rent2Go’s rental rules, cancellation policies, and standard terms of travel.'}
                  </span>
                </label>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-xs text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                <span>
                  {locale === 'ur'
                    ? 'درخواست جمع کروانے کے بعد آپ کو ایک منفرد ریفرنس کوڈ موصول ہوگا جس سے آپ اپنی بکنگ ٹریک کر سکیں گے۔'
                    : 'Upon submitting, you will receive a unique booking reference code to track status anytime.'}
                </span>
              </div>
            </div>
          )}
          </motion.div>
        </AnimatePresence>

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between gap-3 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowPrev className="w-4 h-4" />
                <span>{locale === 'ur' ? 'پیچھے' : 'Back'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCurrentView('cars')}
                className="px-5 py-2.5 rounded-xl text-slate-500 dark:text-slate-400 text-xs font-bold hover:underline cursor-pointer"
              >
                {locale === 'ur' ? 'منسوخ کریں' : 'Cancel'}
              </button>
            )}

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2.5 rounded-xl bg-[#0B1F3A] dark:bg-amber-400 dark:text-slate-950 dark:hover:bg-amber-300 hover:bg-[#142F57] text-white text-xs font-bold shadow-md shadow-slate-900/10 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <span>{locale === 'ur' ? 'آگے بڑھیں' : 'Next Step'}</span>
                <ArrowNext className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-700/20 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? (locale === 'ur' ? 'ارسال ہو رہا ہے...' : 'Submitting...') : (locale === 'ur' ? 'درخواست ارسال کریں' : 'Submit Booking Request')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
