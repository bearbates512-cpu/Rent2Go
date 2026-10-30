import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { CheckCircle2, Copy, Check, MessageSquare, Search, Home } from 'lucide-react';

export const BookingSuccessView: React.FC = () => {
  const { locale, lastCreatedBooking, settings, setCurrentView } = useApp();
  const [copied, setCopied] = useState(false);

  const reference = lastCreatedBooking?.reference || 'R2G-7K3M9QXA';
  const customerName = lastCreatedBooking?.customerName || 'Customer';
  const carName = lastCreatedBooking?.vehicleName || 'Toyota Corolla';

  const handleCopy = () => {
    navigator.clipboard.writeText(reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const prefilledWA = encodeURIComponent(
    locale === 'ur'
      ? `السلام علیکم رینٹ ٹو گو! میں نے آن لائن بکنگ کی درخواست بھیجی ہے جس کا ریفرنس کوڈ ${reference} ہے (${carName})۔ برائے مہربانی تصدیق فرمائیں۔`
      : `Hello Rent2Go! I have submitted an online booking request for ${carName}. My Booking Reference is: ${reference}. Please confirm.`
  );

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#060D17] min-h-screen py-16 px-4 sm:px-6 transition-colors duration-200">
      <div className="max-w-xl mx-auto bg-white dark:bg-[#0B1523] rounded-3xl p-6 sm:p-10 border border-slate-200/90 dark:border-slate-800 shadow-xl text-center space-y-6">
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-9 h-9 stroke-[2.3]" />
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] dark:text-white">
            {locale === 'ur' ? 'بکنگ کی درخواست موصول ہو گئی!' : 'Booking Request Received!'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            {locale === 'ur'
              ? `شکریہ ${customerName}! آپ کی بکنگ کی درخواست کامیابی کے ساتھ درج کر لی گئی ہے۔`
              : `Thank you, ${customerName}! Your request has been recorded in our system.`}
          </p>
        </div>

        {/* Reference Code Box */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border-2 border-dashed border-slate-300 dark:border-slate-700 space-y-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            {locale === 'ur' ? 'آپ کا بکنگ ریفرنس کوڈ' : 'Your Unique Booking Reference'}
          </span>
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl sm:text-3xl font-black font-mono tracking-widest text-[#0B1F3A] dark:text-amber-400">
              {reference}
            </span>
            <button
              onClick={handleCopy}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors shadow-xs cursor-pointer"
              title="Copy Reference"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          {copied && (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block animate-in fade-in">
              {locale === 'ur' ? 'ریفرنس کوڈ کاپی ہو گیا!' : 'Reference code copied to clipboard!'}
            </span>
          )}
        </div>

        {/* Status Notice */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-700/50 text-amber-900 dark:text-amber-200 text-xs sm:text-sm text-start space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping shrink-0" />
            <span>{locale === 'ur' ? 'حالت: پینڈنگ (تصدیق درکار ہے)' : 'Status: PENDING Admin Review'}</span>
          </div>
          <p className="text-xs leading-relaxed text-amber-950 dark:text-amber-200/80">
            {locale === 'ur'
              ? 'یہ ابتدائی درخواست ہے۔ رینٹ ٹو گو کی ٹیم گاڑی کی دستیابی اور حتمی کرایہ چیک کر کے آپ کے فون / واٹس ایپ پر جلد از جلد رابطہ کرے گی۔'
              : 'Our fleet manager in Sadiqabad will verify availability and reach out to you via WhatsApp / phone to confirm the schedule.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <a
            href={`https://wa.me/${settings.whatsappNumber}?text=${prefilledWA}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
          >
            <MessageSquare className="w-5 h-5 fill-white" />
            <span>{locale === 'ur' ? 'واٹس ایپ پر یہ ریفرنس شیئر کریں' : 'Chat on WhatsApp with this Reference'}</span>
          </a>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setCurrentView('status')}
              className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{locale === 'ur' ? 'احوال چیک کریں' : 'Track Status'}</span>
            </button>
            <button
              onClick={() => setCurrentView('home')}
              className="py-2.5 px-3 rounded-xl bg-[#0B1F3A] dark:bg-amber-400 dark:text-slate-950 dark:hover:bg-amber-300 hover:bg-[#142F57] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>{locale === 'ur' ? 'مرکزی صفحہ' : 'Back to Home'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
