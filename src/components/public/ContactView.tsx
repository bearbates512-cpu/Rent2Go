import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext.tsx';
import { normalizePkPhone } from '../../utils/phone.ts';
import { soundFX } from '../../utils/soundEffects.ts';
import { Phone, MessageSquare, Mail, MapPin, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';

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
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-400">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>{locale === 'ur' ? 'براہِ راست رابطہ' : 'DIRECT DISPATCH DESK'}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-mono tracking-tight text-slate-950 dark:text-white">
            {locale === 'ur' ? 'رینٹ ٹو گو ڈیسک، صادق آباد' : 'Let’s Talk. Reach Out.'}
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            {locale === 'ur'
              ? 'ہماری ٹیم آپ کی رہنمائی اور فوری گاڑی فراہم کرنے کے لیے 24 گھنٹے دستیاب ہے۔'
              : 'Have a question about rates, fleet availability, or corporate packages? Call, WhatsApp, or drop a direct message.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Channels & Information */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-[#0B131F] rounded-3xl p-8 border border-black/5 dark:border-white/10 shadow-xl space-y-6">
              <h2 className="text-xl font-bold font-mono text-slate-950 dark:text-white">
                {locale === 'ur' ? 'رابطے کے ذرائع' : 'Direct Channels'}
              </h2>

              <div className="space-y-4 text-xs font-mono">
                {/* Phone */}
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-black/5 dark:border-white/10 hover:border-amber-400 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <span className="text-slate-400 block">{locale === 'ur' ? 'ہیلپ لائن اور کال' : 'Direct Phone'}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{settings.phoneFormatted}</span>
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${settings.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <span className="text-emerald-700 dark:text-emerald-300 block font-semibold">{locale === 'ur' ? 'واٹس ایپ بکنگ' : 'WhatsApp Desk'}</span>
                    <span className="font-bold text-emerald-950 dark:text-white">+{settings.whatsappNumber}</span>
                  </div>
                </a>

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

                {/* Address */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-black/5 dark:border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <span className="text-slate-400 block">{locale === 'ur' ? 'دفتر کا پتہ' : 'HQ Location'}</span>
                    <span className="text-slate-700 dark:text-slate-300 font-sans">
                      {settings.address[locale] || settings.address.en}
                    </span>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-black/5 dark:border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <span className="text-slate-400 block">{locale === 'ur' ? 'اوقاتِ کار' : 'Working Hours'}</span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {settings.businessHours[locale] || settings.businessHours.en}
                    </span>
                  </div>
                </div>
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
      </div>
    </div>
  );
};
