import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { normalizePkPhone } from '../../utils/phone.ts';
import { Phone, MessageSquare, Mail, MapPin, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { Premium3DBusinessCard } from './Premium3DBusinessCard.tsx';

export const ContactView: React.FC = () => {
  const { locale, settings, submitEnquiry } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg(locale === 'ur' ? 'براہِ کرم اپنا نام درج کریں۔' : 'Please provide your full name.');
      return;
    }

    const norm = normalizePkPhone(phone);
    if (!norm.isValid) {
      setErrorMsg(norm.error || 'Please enter a valid Pakistani mobile number.');
      return;
    }

    if (!message.trim()) {
      setErrorMsg(locale === 'ur' ? 'براہِ کرم اپنا پیغام یا مطلوبہ گاڑی لکھیں۔' : 'Please write your message or requirements.');
      return;
    }

    submitEnquiry({
      name: name.trim(),
      phone: norm.formatted,
      email: email.trim() || undefined,
      service,
      message: message.trim()
    });

    setSubmitted(true);
    setName('');
    setPhone('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#060D17] text-slate-800 dark:text-slate-100 min-h-screen py-12 transition-colors duration-250">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 px-3 py-1 rounded-full uppercase tracking-wider border border-amber-200 dark:border-amber-400/30">
            {locale === 'ur' ? 'ہم سے رابطہ کریں' : 'Get in Touch'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] dark:text-white mt-2">
            {locale === 'ur' ? 'رینٹ ٹو گو ڈیسک، صادق آباد' : 'Contact Rent2Go Desk'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 leading-relaxed">
            {locale === 'ur'
              ? 'ہماری ٹیم آپ کی رہنمائی اور فوری گاڑی فراہم کرنے کے لیے 24 گھنٹے دستیاب ہے۔'
              : 'Have a question about rates, fleet availability, or corporate packages? Call, WhatsApp, or drop a message.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Cards & Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-[#0B1523] rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
              <h2 className="text-lg font-bold text-[#0B1F3A] dark:text-white">
                {locale === 'ur' ? 'براہِ راست رابطے کے ذرائع' : 'Direct Channels'}
              </h2>

              <div className="space-y-4 text-sm">
                {/* Phone */}
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">{locale === 'ur' ? 'ہیلپ لائن اور کال' : 'Direct Phone'}</span>
                    <span className="font-bold font-mono text-slate-800 dark:text-white">{settings.phoneFormatted}</span>
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${settings.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/40 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <MessageSquare className="w-5 h-5 fill-white" />
                  </div>
                  <div>
                    <span className="text-xs text-emerald-700 dark:text-emerald-300 block font-semibold">{locale === 'ur' ? 'واٹس ایپ بکنگ' : 'WhatsApp Desk'}</span>
                    <span className="font-bold font-mono text-emerald-950 dark:text-emerald-100">+{settings.whatsappNumber}</span>
                  </div>
                </a>

                {/* Email */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">{locale === 'ur' ? 'ای میل ایڈریس' : 'Email Address'}</span>
                    <span className="font-medium text-slate-800 dark:text-white">{settings.email}</span>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">{locale === 'ur' ? 'دفتر کا پتہ' : 'Office Location'}</span>
                    <span className="font-medium text-slate-800 dark:text-white leading-snug">
                      {settings.address[locale] || settings.address.en}
                    </span>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">{locale === 'ur' ? 'اوقاتِ کار' : 'Working Hours'}</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {settings.businessHours[locale] || settings.businessHours.en}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Executive 3D Business Card */}
            <div className="bg-slate-900 dark:bg-[#071324] rounded-3xl p-4 sm:p-6 border border-slate-800 dark:border-slate-800 shadow-xl overflow-hidden text-center">
              <div className="mb-3">
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#d4af68] font-bold">
                  {locale === 'ur' ? 'ایگزیکٹو ڈائریکٹر ڈیجیٹل کارڈ' : 'EXECUTIVE DIGITAL CARD'}
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">
                  {locale === 'ur' ? 'ڈائریکٹر محمد طارق گوندل' : 'Muhammad Tariq Gondal'}
                </h3>
              </div>
              <Premium3DBusinessCard
                name="Muhammad Tariq Gondal"
                titleRole="MANAGING DIRECTOR & FOUNDER"
              />
            </div>
          </div>

          {/* Right Column: Interactive Enquiry Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-[#0B1523] rounded-3xl p-6 sm:p-10 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
              <div>
                <h2 className="text-xl font-bold text-[#0B1F3A] dark:text-white">
                  {locale === 'ur' ? 'ہمیں پیغام بھیجیں' : 'Send an Enquiry'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {locale === 'ur'
                    ? 'فارم پُر کریں، ہمارا نمائندہ جلد از جلد آپ سے فون یا واٹس ایپ پر رابطہ کرے گا۔'
                    : 'Fill out this form and our booking team will reach back out promptly.'}
                </p>
              </div>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-in fade-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-emerald-950 text-base">
                    {locale === 'ur' ? 'پیغام کامیابی سے موصول ہو گیا!' : 'Enquiry Sent Successfully!'}
                  </h3>
                  <p className="text-xs text-emerald-800 max-w-sm mx-auto leading-relaxed">
                    {locale === 'ur'
                      ? 'آپ کا پیغام ہمارے ایڈمن ڈیسک پر درج ہو چکا ہے۔ ہم جلد رابطہ کریں گے۔'
                      : 'Thank you! Your message has been logged in our enquiries inbox. Our manager will reply shortly.'}
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-colors"
                  >
                    {locale === 'ur' ? 'نیا پیغام بھیجیں' : 'Send Another Message'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        {locale === 'ur' ? 'آپ کا نام' : 'Your Name'} *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Tariq Mehmood"
                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-xs font-medium focus:ring-2 focus:ring-[#0B1F3A] dark:focus:ring-amber-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        {locale === 'ur' ? 'موبائل نمبر (پاکستان)' : 'Mobile Number'} *
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="0300 1234567"
                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-xs font-medium font-mono focus:ring-2 focus:ring-[#0B1F3A] dark:focus:ring-amber-400"
                        dir="ltr"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        {locale === 'ur' ? 'ای میل ایڈریس (اختیاری)' : 'Email (Optional)'}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-xs font-medium focus:ring-2 focus:ring-[#0B1F3A] dark:focus:ring-amber-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        {locale === 'ur' ? 'مطلوبہ سروس' : 'Service of Interest'}
                      </label>
                      <select
                        value={service}
                        onChange={e => setService(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-xs font-medium focus:ring-2 focus:ring-[#0B1F3A] dark:focus:ring-amber-400"
                      >
                        <option value="Car Rental with Driver" className="dark:bg-slate-900">Car Rental with Driver</option>
                        <option value="Self-Drive Rental" className="dark:bg-slate-900">Self-Drive Rental</option>
                        <option value="Airport Transfer" className="dark:bg-slate-900">Airport Transfer (Sukkur/RYK)</option>
                        <option value="Wedding / Event Fleet" className="dark:bg-slate-900">Wedding / Event Fleet</option>
                        <option value="Corporate Monthly Contract" className="dark:bg-slate-900">Corporate Monthly Contract</option>
                        <option value="Intercity Highway Travel" className="dark:bg-slate-900">Intercity Highway Travel</option>
                        <option value="General Inquiry" className="dark:bg-slate-900">General Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {locale === 'ur' ? 'آپ کا پیغام یا تفصیلات' : 'Message / Details'} *
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder={locale === 'ur' ? 'گاڑی کی تاریخ، سفر کا راستہ یا دیگر ضروری معلومات لکھیں...' : 'Specify dates, destination, number of days, or special questions...'}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-xs font-medium focus:ring-2 focus:ring-[#0B1F3A] dark:focus:ring-amber-400"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#0B1F3A] hover:bg-[#142F57] dark:bg-[#F5B301] dark:hover:bg-amber-400 text-[#F5B301] hover:text-white dark:text-[#0B1F3A] text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{locale === 'ur' ? 'پیغام ارسال کریں' : 'Send Message to Desk'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
