import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { ShieldCheck, MapPin, Users, Phone, Car, Clock, Award } from 'lucide-react';

export const AboutView: React.FC = () => {
  const { locale, settings, navigateToBooking } = useApp();

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Hero Banner */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider border border-amber-200">
            {locale === 'ur' ? 'صادق آباد کار رینٹل کا قابلِ اعتماد نام' : 'Trusted Local Transport'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A]">
            {locale === 'ur' ? 'رینٹ ٹو گو صادق آباد کے متعلق' : 'About Rent2Go Sadiqabad'}
          </h1>
          <p className="text-slate-500 text-sm max-w-2xl mx-auto leading-relaxed">
            {locale === 'ur'
              ? 'صادق آباد بائی پاس پر قائم، جہاں معیار، حفاظت اور بااخلاق سروس اولین ترجیح ہے۔'
              : 'Established on Main KLP Road near Sadiqabad Bypass, dedicated to providing dependable family, wedding, and executive car rentals.'}
          </p>
        </div>

        {/* Story Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-sm space-y-6">
          <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed space-y-4">
            <p>
              {locale === 'ur'
                ? 'رینٹ ٹو گو صادق آباد کا قیام اس مقصد کے تحت عمل میں آیا کہ ضلع رحیم یار خان اور صادق آباد کے شہریوں کو معیاری، صاف ستھری اور محفوظ گاڑیاں مناسب اور شفاف کرائے پر مہیا کی جائیں۔ اکثر صارفین کو غیر معیاری ڈرائیورز یا غیر واضح اخراجات کا سامنا ہوتا تھا، جسے ہم نے ایک مکمل منظم نظام میں تبدیل کیا ہے۔'
                : 'Rent2Go was founded in Sadiqabad with a singular objective: to eliminate the common headaches of vehicle renting in Southern Punjab. We replace unorganized brokers with an inspected, company-managed fleet, vetted polite chauffeurs, and upfront honest quotes.'}
            </p>
            <p>
              {locale === 'ur'
                ? 'چاہے آپ کو شیخ زید ائیرپورٹ رحیم یار خان یا سکھر ائیرپورٹ جانا ہو، موٹروے ایم 5 کے ذریعے لاہور یا کراچی کا سفر ہو، یا فیکٹریز (FFC گوٹھ مچھی، فاطمہ فرٹیلائزر) کے لیے کارپوریٹ پروٹوکول چاہیے ہو، رینٹ ٹو گو ہمیشہ آپ کی خدمت کے لیے تیار ہے۔'
                : 'Whether transferring travelers to Sheikh Zayed Airport (RYK) or Sukkur Airport, navigating the M-5 motorway to Multan and Lahore, or serving corporate executives at Fauji Fertilizer (FFC) Goth Machi and local ginning factories, our standards remain uncompromised.'}
            </p>
          </div>

          {/* Core Values Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0B1F3A] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">
                {locale === 'ur' ? 'حفاظت اور مکینیکل جانچ' : 'Vehicle Roadworthiness'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {locale === 'ur' ? 'ہر سفر سے قبل بریکس، ٹائرز اور اے سی کی تفصیلی جانچ کی جاتی ہے۔' : 'Rigorous pre-trip mechanical checks on brakes, tires, suspension, and AC cooling.'}
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Users className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">
                {locale === 'ur' ? 'تصدیق شدہ بااخلاق ڈرائیورز' : 'Verified Polite Chauffeurs'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {locale === 'ur' ? 'فیملی سفر کے آداب سے واقف، باکردار اور روٹس کے ماہر ڈرائیورز۔' : 'Background-verified drivers trained in highway safety, customer courtesy, and family travel.'}
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Clock className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">
                {locale === 'ur' ? 'وقت کی مکمل پابندی' : 'Punctuality Guarantee'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {locale === 'ur' ? 'گاڑی ہمیشہ طے شدہ وقت سے 15 سے 30 منٹ پہلے آپ کے پتے پر پہنچتی ہے۔' : 'Our vehicles arrive at least 15-30 minutes prior to scheduled pickup time.'}
              </p>
            </div>
          </div>
        </div>

        {/* Office location card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>{locale === 'ur' ? 'مرکزی دفتر' : 'Head Office'}</span>
            </div>
            <h3 className="text-lg font-bold text-[#0B1F3A]">
              {settings.address[locale] || settings.address.en}
            </h3>
            <p className="text-xs text-slate-500">
              {settings.businessHours[locale] || settings.businessHours.en}
            </p>
          </div>

          <button
            onClick={() => navigateToBooking()}
            className="px-6 py-3 rounded-xl bg-[#0B1F3A] hover:bg-[#142F57] text-[#F5B301] text-xs font-bold shrink-0 shadow-md transition-all"
          >
            {locale === 'ur' ? 'گاڑی بک کریں' : 'Book a Car Now'}
          </button>
        </div>
      </div>
    </div>
  );
};
