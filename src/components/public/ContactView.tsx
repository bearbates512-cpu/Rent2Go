import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext.tsx';
import { normalizePkPhone } from '../../utils/phone.ts';
import { soundFX } from '../../utils/soundEffects.ts';
import { Phone, MessageSquare, Mail, MapPin, Clock, Send, CheckCircle2, AlertCircle, ExternalLink, Sparkles } from 'lucide-react';

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

    soundFX.playClick();
    setSubmitted(true);
    setName('');
    setPhone('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="bg-[#FAF9F6] dark:bg-[#070D18] text-slate-900 dark:text-slate-100 min-h-screen py-16 transition-colors duration-250 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Editorial Header */}
        <div className="space-y-4 border-b border-black/5 dark:border-white/10 pb-8">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-500 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{locale === 'ur' ? '7 دن 24 گھنٹے سروس · رحیم یار خان' : '7 DAYS 24 HOURS SERVICE · RAHIM YAR KHAN'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-mono tracking-tight text-slate-950 dark:text-white">
            {locale === 'ur' ? 'جام رینٹ اے کار رحیم یار خان' : 'Jam Rent A Car Rahim Yar Khan'}
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            {locale === 'ur'
              ? 'جام رینٹ اے کار رحیم یار خان میں 7 دن 24 گھنٹے معیاری سروس فراہم کرتا ہے۔ کسی بھی وقت فوری گاڑی کے لیے کال یا واٹس ایپ کریں۔'
              : 'Jam Rent A Car Rahim Yar Khan operates 7 Days 24 Hours (24/7). Call or WhatsApp 03006756054 for verified luxury and family cars anytime.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Channels & Information */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-[#0B131F] rounded-3xl p-8 border border-black/5 dark:border-white/10 shadow-xl space-y-6">
              <h2 className="text-xl font-bold font-mono text-slate-950 dark:text-white flex items-center justify-between">
                <span>{locale === 'ur' ? 'رابطے کے ذرائع' : 'Direct Channels'}</span>
                <span className="text-[11px] font-normal px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono">
                  24/7 Open
                </span>
              </h2>

              <div className="space-y-4 text-xs font-mono">
                {/* Phone */}
                <a
                  href={`tel:${settings.phone || '03006756054'}`}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-black/5 dark:border-white/10 hover:border-amber-400 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="text-slate-400 block">{locale === 'ur' ? 'ہیلپ لائن اور کال' : 'Direct Call (24 Hours)'}</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{settings.phoneFormatted || '+92 300 6756054'}</span>
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${settings.whatsappNumber || '923006756054'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <MessageSquare className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <span className="text-emerald-700 dark:text-emerald-300 block font-semibold">{locale === 'ur' ? 'واٹس ایپ بکنگ' : 'WhatsApp 24/7 Desk'}</span>
                    <span className="font-bold text-emerald-950 dark:text-white text-sm">03006756054</span>
                  </div>
                </a>

                {/* Service Hours Highlight */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-bold">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-amber-800 dark:text-amber-300 block font-semibold">{locale === 'ur' ? 'اوقاتِ کار' : 'Service Schedule'}</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {locale === 'ur' ? '7 دن 24 گھنٹے سروس (24/7 Open)' : '7 Days 24 Hours Service'}
                    </span>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-black/5 dark:border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <span className="text-slate-400 block">{locale === 'ur' ? 'دفتر کا پتہ' : 'Office Location'}</span>
                    <span className="text-slate-700 dark:text-slate-300 font-sans font-medium">
                      Jam Rent A Car, Rahim Yar Khan, Punjab, Pakistan
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-black/5 dark:border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-400 block">{locale === 'ur' ? 'ای میل ایڈریس' : 'Email Address'}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{settings.email}</span>
                  </div>
                </div>

                {/* Rental Sawari App Comparison Link */}
                <a
                  href={settings.socialLinks?.rentalSawari || "https://rentalsawari.com/compare/jam-rent-a-car-rahim-yar-khan-vs-ali-rent-a-car-ryk"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundFX.playClick()}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 hover:border-amber-400 transition-all group cursor-pointer shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                    RS
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-amber-800 dark:text-amber-300 block font-semibold text-[11px] uppercase tracking-wider">
                      {locale === 'ur' ? 'رینٹل سواری ایپ کمپیریژن' : 'Verified App Profile'}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm truncate flex items-center gap-1.5">
                      <span>Rental Sawari App</span>
                      <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate mt-0.5">
                      {locale === 'ur' ? 'رحیم یار خان میں فلیٹ و ریٹنگز کا موازنہ کریں' : 'Compare rates & verified fleet on Rental Sawari'}
                    </span>
                  </div>
                </a>

                {/* Facebook Official Page */}
                <a
                  href={settings.socialLinks?.facebook || "https://www.facebook.com/p/Jam-Brothers-Rent-A-Car-100065165124538/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundFX.playClick()}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-[#1877F2]/10 border border-[#1877F2]/25 hover:border-[#1877F2] transition-all group cursor-pointer shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#1877F2] text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-blue-700 dark:text-blue-300 block font-semibold text-[11px] uppercase tracking-wider">
                      {locale === 'ur' ? 'آفیشل فیس بک پیج' : 'Official Facebook Page'}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm truncate flex items-center gap-1.5">
                      <span>Jam Brothers Rent A Car</span>
                      <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate mt-0.5">
                      {locale === 'ur' ? 'فیس بک پر کسٹمر ریویوز اور ویڈیوز دیکھیں' : 'Follow for fleet photos & daily updates'}
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Sleek Editorial Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-[#0B131F] rounded-3xl p-8 sm:p-10 border border-black/5 dark:border-white/10 shadow-xl space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-mono text-slate-950 dark:text-white">
                  {locale === 'ur' ? 'ہمیں پیغام بھیجیں' : 'Send a Message'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {locale === 'ur'
                    ? 'فارم پُر کریں، ہمارا نمائندہ جلد از جلد آپ سے فون یا واٹس ایپ پر رابطہ کرے گا۔'
                    : 'Fill out this form and our booking team will reach back out promptly.'}
                </p>
              </div>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-slate-950 dark:text-white text-base font-mono">
                    {locale === 'ur' ? 'پیغام کامیابی سے موصول ہو گیا!' : 'Enquiry Sent Successfully!'}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                    {locale === 'ur'
                      ? 'آپ کا پیغام ہمارے ایڈمن ڈیسک پر درج ہو چکا ہے۔ ہم جلد رابطہ کریں گے۔'
                      : 'Thank you! Your message has been logged in our enquiries inbox. Our dispatch manager will reply shortly.'}
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-5 py-2.5 rounded-full bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-xs font-mono font-bold"
                  >
                    {locale === 'ur' ? 'نیا پیغام بھیجیں' : 'Send Another Message'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
                  {errorMsg && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-500 dark:text-slate-400 block mb-1 uppercase tracking-wider">
                        {locale === 'ur' ? 'آپ کا نام' : 'Your Name'} *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Tariq Mehmood"
                        className="w-full p-3.5 rounded-2xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-slate-950 dark:focus:ring-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-slate-500 dark:text-slate-400 block mb-1 uppercase tracking-wider">
                        {locale === 'ur' ? 'موبائل نمبر (پاکستان)' : 'Mobile Number'} *
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="0300 1234567"
                        className="w-full p-3.5 rounded-2xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-slate-950 dark:focus:ring-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-500 dark:text-slate-400 block mb-1 uppercase tracking-wider">
                        {locale === 'ur' ? 'ای میل ایڈریس (اختیاری)' : 'Email (Optional)'}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full p-3.5 rounded-2xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-slate-950 dark:focus:ring-white"
                      />
                    </div>

                    <div>
                      <label className="text-slate-500 dark:text-slate-400 block mb-1 uppercase tracking-wider">
                        {locale === 'ur' ? 'مطلوبہ سروس' : 'Service of Interest'}
                      </label>
                      <select
                        value={service}
                        onChange={e => setService(e.target.value)}
                        className="w-full p-3.5 rounded-2xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-slate-950 dark:focus:ring-white cursor-pointer"
                      >
                        <option value="General Inquiry">General Fleet Inquiry</option>
                        <option value="Chauffeur Car">Chauffeur-Driven Trip</option>
                        <option value="Self Drive">Self-Drive Rental</option>
                        <option value="Airport Transfer">Sukkur / RYK Airport Transfer</option>
                        <option value="Wedding Fleet">Wedding & Event Convoy</option>
                        <option value="Corporate Fleet">Corporate Monthly Contract</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-500 dark:text-slate-400 block mb-1 uppercase tracking-wider">
                      {locale === 'ur' ? 'آپ کا پیغام یا سفر کی تفصیل' : 'Your Requirements'} *
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="e.g. Need Toyota Fortuner for 3 days to Multan on M-5 Motorway..."
                      className="w-full p-3.5 rounded-2xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-slate-950 dark:focus:ring-white font-sans"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 px-6 rounded-2xl bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-xs font-mono font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    <span>{locale === 'ur' ? 'پیغام ارسال کریں' : 'Submit Message'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Google Maps Embed Section - Jam Rent A Car Rahim Yar Khan */}
        <div className="bg-white dark:bg-[#0B131F] rounded-3xl p-6 sm:p-8 border border-black/5 dark:border-white/10 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/5 dark:border-white/10">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-500 uppercase tracking-widest font-bold">
                <MapPin className="w-4 h-4 text-rose-500" />
                <span>{locale === 'ur' ? 'گوگل میپس لوکیشن' : 'LIVE LOCATION ON GOOGLE MAPS'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-slate-950 dark:text-white mt-1">
                Jam Rent A Car Rahim Yar Khan
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                {locale === 'ur' ? '7 دن 24 گھنٹے سروس · کال اور واٹس ایپ 03006756054' : '7 Days 24 Hours Service · Call & WhatsApp 03006756054'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="https://maps.google.com/?q=Jam+Rent+A+Car+Rahim+Yar+Khan"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-xs font-mono font-bold tracking-tight inline-flex items-center gap-2 transition-all shadow-sm active:scale-95"
              >
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>{locale === 'ur' ? 'گوگل میپس پر کھولیں' : 'Open in Google Maps'}</span>
              </a>
              <a
                href={`tel:${settings.phone || '03006756054'}`}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold tracking-tight inline-flex items-center gap-2 transition-all shadow-sm active:scale-95"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>03006756054</span>
              </a>
            </div>
          </div>

          {/* Interactive Google Map Iframe */}
          <div className="w-full h-[400px] sm:h-[480px] rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 shadow-inner bg-slate-100 dark:bg-slate-900">
            <iframe
              src={settings.mapEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3508.934851576573!2d70.29789199999999!3d28.4212226!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39375b25208c5229%3A0x257a12c964fc043c!2sJam%20Rent%20A%20Car%20Rahim%20Yar%20Khan!5e0!3m2!1sen!2s!4v1794412836229!5m2!1sen!2s"}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Jam Rent A Car Rahim Yar Khan Location"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
