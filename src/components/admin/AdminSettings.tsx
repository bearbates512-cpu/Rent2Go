import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Settings, Save, Check, RefreshCw, ToggleLeft, ToggleRight, MessageSquare, AlertCircle, Download, Upload, Trash2, Database, ShieldCheck, RotateCcw, Lock, KeyRound, Sparkles, Image as ImageIcon, ExternalLink, Globe } from 'lucide-react';
import { AUTHORIZED_ADMIN_EMAIL, setCustomSupabaseConfig, getSupabaseClient } from '../../utils/supabase.ts';
import { soundFX } from '../../utils/soundEffects.ts';
import { compressImageToDataUrl } from '../../utils/imageCompression.ts';

export const AdminSettings: React.FC = () => {
  const { settings, updateSiteSettings, resetAllData, clearDemoFleet, clearDemoBookings, exportAllData, importAllData, updateSiteLogo } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string>('');
  const [supabaseUrl, setSupabaseUrl] = useState(
    () => (typeof window !== 'undefined' ? localStorage.getItem('rent2go_supabase_url') || '' : '')
  );
  const [supabaseKey, setSupabaseKey] = useState(
    () => (typeof window !== 'undefined' ? localStorage.getItem('rent2go_supabase_key') || '' : '')
  );
  const [supabaseSaveMsg, setSupabaseSaveMsg] = useState('');

  const [logoUrl, setLogoUrl] = useState(settings.logoUrl || '/assets/aistudio/Rent2Go_icon_transparent.png');
  const [logoFeedback, setLogoFeedback] = useState<string>('');

  // Keep local logoUrl synced with settings in real-time
  useEffect(() => {
    if (settings.logoUrl) {
      setLogoUrl(settings.logoUrl);
    }
  }, [settings.logoUrl]);

  const applyLogoImmediately = (newUrl: string, feedbackMsg?: string) => {
    setLogoUrl(newUrl);
    updateSiteLogo(newUrl);
    soundFX.playSuccess();
    setLogoFeedback(feedbackMsg || '✅ لوگو فوری تبدیل ہو گیا اور ویب سائٹ پر لائیو ہے! (Logo updated & live!)');
    setTimeout(() => setLogoFeedback(''), 4000);
  };
  const [phone, setPhone] = useState(settings.phone);
  const [phoneFormatted, setPhoneFormatted] = useState(settings.phoneFormatted);
  const [whatsapp, setWhatsapp] = useState(settings.whatsappNumber);
  const [email, setEmail] = useState(settings.email);
  const [addressEn, setAddressEn] = useState(settings.address.en);
  const [addressUr, setAddressUr] = useState(settings.address.ur);
  const [hoursEn, setHoursEn] = useState(settings.businessHours.en);
  const [hoursUr, setHoursUr] = useState(settings.businessHours.ur);
  const [waTemplate, setWaTemplate] = useState(settings.whatsappMessageTemplate);
  const [facebookUrl, setFacebookUrl] = useState(
    settings.socialLinks?.facebook || 'https://www.facebook.com/p/Jam-Brothers-Rent-A-Car-100065165124538/'
  );
  const [rentalSawariUrl, setRentalSawariUrl] = useState(
    settings.socialLinks?.rentalSawari || 'https://rentalsawari.com/compare/jam-rent-a-car-rahim-yar-khan-vs-ali-rent-a-car-ryk'
  );
  const [mapEmbedUrl, setMapEmbedUrl] = useState(
    settings.mapEmbedUrl ||
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3508.934851576573!2d70.29789199999999!3d28.4212226!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39375b25208c5229%3A0x257a12c964fc043c!2sJam%20Rent%20A%20Car%20Rahim%20Yar%20Khan!5e0!3m2!1sen!2s!4v1794412836229!5m2!1sen!2s'
  );

  // Features
  const [selfDrive, setSelfDrive] = useState(settings.features.selfDriveEnabled);
  const [hourly, setHourly] = useState(settings.features.hourlyRentalEnabled);
  const [floatingWA, setFloatingWA] = useState(settings.features.floatingWhatsAppEnabled);
  const [announcementEnabled, setAnnouncementEnabled] = useState(settings.announcementBar.enabled);
  const [announcementEn, setAnnouncementEn] = useState(settings.announcementBar.text.en);
  const [announcementUr, setAnnouncementUr] = useState(settings.announcementBar.text.ur);

  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    updateSiteSettings({
      ...settings,
      logoUrl: logoUrl.trim() || settings.logoUrl,
      phone,
      phoneFormatted,
      whatsappNumber: whatsapp,
      email,
      mapEmbedUrl: (mapEmbedUrl.match(/src=["'](.*?)["']/) ? mapEmbedUrl.match(/src=["'](.*?)["']/)![1] : mapEmbedUrl).trim(),
      address: {
        en: addressEn,
        ur: addressUr
      },
      businessHours: {
        en: hoursEn,
        ur: hoursUr
      },
      whatsappMessageTemplate: waTemplate,
      announcementBar: {
        enabled: announcementEnabled,
        text: {
          en: announcementEn,
          ur: announcementUr
        }
      },
      features: {
        selfDriveEnabled: selfDrive,
        hourlyRentalEnabled: hourly,
        floatingWhatsAppEnabled: floatingWA,
        reviewsSectionEnabled: true
      },
      socialLinks: {
        facebook: facebookUrl.trim(),
        rentalSawari: rentalSawariUrl.trim()
      }
    });

    soundFX.playSuccess();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0B1F3A]">Settings & Feature Modules</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure Sadiqabad business coordinates, WhatsApp templates, and toggle website modules.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#142F57] text-[#F5B301] text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save All Settings</span>
        </button>
      </div>

      {savedToast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold animate-in fade-in">
          Settings updated successfully! Public website and templates refreshed.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Website Logo & Brand Emblem */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Website Logo & Brand Emblem (ویب سائٹ کا لوگو)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload or link a custom logo image for Jam Rent A Car. Updates everywhere on the website in real-time.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const defaultLogo = '/assets/aistudio/Rent2Go_icon_transparent.png';
                  applyLogoImmediately(defaultLogo, '✅ اصل ڈیفالٹ لوگو بحال ہو گیا (Default logo restored)!');
                }}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold font-mono flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Default</span>
              </button>

              <button
                type="button"
                onClick={() => logoFileInputRef.current?.click()}
                className="px-4 py-1.5 rounded-xl bg-[#0B1F3A] text-white hover:bg-[#142F57] text-xs font-bold font-mono flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Logo File (تصویر منتخب کریں)</span>
              </button>
              <input
                ref={logoFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async e => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  try {
                    setLogoFeedback('لوگو پروسیس ہو رہا ہے... (Compressing logo...)');
                    const dataUrl = await compressImageToDataUrl(file, 400, 400, 0.88);
                    applyLogoImmediately(dataUrl, '✅ لوگو کامیابی سے اپلوڈ ہو گیا اور ویب سائٹ پر لائیو ہے! (Logo uploaded & live!)');
                  } catch (err) {
                    console.error('Logo compression failed:', err);
                    alert('تصویر لوڈ کرنے میں مسئلہ ہوا، براہ کرم دوسری تصویر منتخب کریں۔');
                  } finally {
                    if (e.target) e.target.value = '';
                  }
                }}
              />
            </div>
          </div>

          {/* Instant Real-Time Success Feedback Toast */}
          {logoFeedback && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold font-mono flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{logoFeedback}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
            {/* Live Preview Dark Box */}
            <div className="p-4 rounded-2xl bg-[#0B1F3A] border border-amber-500/20 flex items-center gap-3 shadow-inner">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/30 flex items-center justify-center p-2 shrink-0">
                <img
                  key={logoUrl}
                  src={logoUrl || '/assets/aistudio/Rent2Go_icon_transparent.png'}
                  alt="Current Logo"
                  className="w-full h-full object-contain"
                  onError={e => {
                    (e.currentTarget as HTMLImageElement).src = '/assets/aistudio/Rent2Go_icon_transparent.png';
                  }}
                />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-amber-400 font-mono font-bold uppercase tracking-wider">Active Site Logo</p>
                <p className="text-xs font-black text-white font-mono truncate">Jam Rent A Car</p>
                <p className="text-[10px] text-slate-300">Rahim Yar Khan · 24/7</p>
              </div>
            </div>

            {/* URL Input */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block font-mono">
                Logo Image URL or Local Path (تصویر کا لنک درج کریں)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={logoUrl}
                  onChange={e => setLogoUrl(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (logoUrl.trim()) {
                        applyLogoImmediately(logoUrl.trim(), '✅ نیا لوگو لنک کامیابی سے لاگو ہو گیا! (Logo link applied!)');
                      }
                    }
                  }}
                  placeholder="/assets/aistudio/... or https://example.com/logo.png"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (logoUrl.trim()) {
                      applyLogoImmediately(logoUrl.trim(), '✅ نیا لوگو لنک کامیابی سے لاگو ہو گیا! (Logo link applied!)');
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-900 font-bold text-xs font-mono hover:bg-amber-400 cursor-pointer shrink-0 shadow-sm active:scale-95 transition-all"
                >
                  Apply Logo
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                You can upload a file, paste an image link, or pick one of the verified luxury emblems below.
              </p>
            </div>
          </div>

          {/* Quick 1-Click Automotive Emblem Presets */}
          <div className="pt-3 border-t border-slate-100">
            <span className="text-[11px] font-mono font-bold text-slate-600 uppercase tracking-wider block mb-2.5">
              Quick 1-Click Emblem Presets (فوری ریڈی میڈ ڈیزائنز):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  id: 'gold-crest',
                  name: 'Gold Emblem',
                  url: '/assets/aistudio/Rent2Go_icon_transparent.png',
                  badge: 'Standard'
                },
                {
                  id: 'full-brand',
                  name: 'Signature Logo',
                  url: '/assets/aistudio/Rent2Go_Logo_transparent.png',
                  badge: 'Signature'
                },
                {
                  id: 'motion-edition',
                  name: 'Motion Gold',
                  url: '/assets/aistudio/Rent2Go_Home___Motion_Logo_4f24b879.png',
                  badge: 'Executive'
                },
                {
                  id: 'vip-falcon',
                  name: 'VIP Falcon Shield',
                  url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none'%3E%3Ccircle cx='50' cy='50' r='46' stroke='%23F5B301' stroke-width='3' fill='%230B1F3A'/%3E%3Cpath d='M20 50 C32 30, 45 42, 50 32 C55 42, 68 30, 80 50 C68 46, 56 62, 50 72 C44 62, 32 46, 20 50 Z' fill='%23F5B301'/%3E%3Cpolygon points='50,22 45,30 55,30' fill='%23FFFFFF'/%3E%3Ctext x='50' y='86' font-size='9' font-weight='bold' fill='%23FFFFFF' text-anchor='middle' font-family='sans-serif'%3EJAM RENT%3C/text%3E%3C/svg%3E",
                  badge: 'Protocol'
                }
              ].map(preset => {
                const isSelected = settings.logoUrl === preset.url;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      applyLogoImmediately(preset.url, `✅ ${preset.name} لوگو کامیابی سے سیٹ ہو گیا!`);
                    }}
                    className={`p-3 rounded-2xl border text-start transition-all cursor-pointer flex items-center gap-2.5 ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/10 shadow-sm ring-2 ring-amber-500/30'
                        : 'border-slate-200 hover:border-amber-300 bg-slate-50/60'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center p-1 shrink-0">
                      <img src={preset.url} alt={preset.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] font-bold text-slate-800 block truncate font-mono">{preset.name}</span>
                      <span className="text-[10px] text-amber-600 font-bold block">{isSelected ? '✓ Active' : preset.badge}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Business Profile */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5">
          <h2 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider border-b border-slate-100 pb-3">
            Business Contact & Location (Sadiqabad Hub)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Phone Number (Calling)</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Formatted Display Phone</label>
              <input
                type="text"
                value={phoneFormatted}
                onChange={e => setPhoneFormatted(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">WhatsApp Number (e.g. 923271126457)</label>
              <input
                type="text"
                value={whatsapp}
                onChange={e => setWhatsapp(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Official Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Physical Address (English)</label>
              <textarea
                rows={2}
                value={addressEn}
                onChange={e => setAddressEn(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Physical Address (Urdu)</label>
              <textarea
                rows={2}
                value={addressUr}
                onChange={e => setAddressUr(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-urdu"
                dir="rtl"
              />
            </div>
          </div>

          {/* Google Maps Embed Field */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 block text-xs font-mono">
                Google Maps Embed URL or &lt;iframe&gt; Code (گوگل میپس لائیو لوکیشن)
              </label>
              <a
                href="https://maps.google.com/?q=Jam+Rent+A+Car+Rahim+Yar+Khan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1 font-mono"
              >
                <span>Open Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <textarea
              rows={2}
              value={mapEmbedUrl}
              onChange={e => {
                const val = e.target.value;
                const match = val.match(/src=["'](.*?)["']/);
                setMapEmbedUrl(match ? match[1] : val);
              }}
              placeholder="https://www.google.com/maps/embed?pb=... or paste full <iframe> code"
              className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-xs text-slate-800"
            />
            <p className="text-[11px] text-slate-400">
              Paste either the raw embed URL or the full Google Maps &lt;iframe&gt; snippet. The system will automatically extract the clean URL.
            </p>
          </div>
        </div>

        {/* Verified Social & Platform Integrations */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600" />
                <span>Official Profiles & App Links (سوشل میڈیا اور ایپ لنکس)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage your official Rental Sawari app comparison page and Facebook company page links.
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active on Site & Footer
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
            {/* Rental Sawari App */}
            <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-800 uppercase text-[11px] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Rental Sawari App Link</span>
                </span>
                {rentalSawariUrl && (
                  <a
                    href={rentalSawariUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-700 hover:text-amber-900 inline-flex items-center gap-1 text-[11px] font-bold"
                  >
                    <span>Test URL</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-sans">
                کار موازنہ اور تصدیق شدہ فلیٹ ریٹنگز کے لیے رینٹل سواری ایپ کا لنک۔
              </p>
              <input
                type="url"
                value={rentalSawariUrl}
                onChange={e => setRentalSawariUrl(e.target.value)}
                placeholder="https://rentalsawari.com/compare/..."
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-mono text-slate-900 focus:outline-hidden focus:border-amber-500"
              />
            </div>

            {/* Facebook Official Page */}
            <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-800 uppercase text-[11px] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span>Facebook Official Page</span>
                </span>
                {facebookUrl && (
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:text-blue-900 inline-flex items-center gap-1 text-[11px] font-bold"
                  >
                    <span>Test URL</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-sans">
                جام برادرز رینٹ اے کار کا آفیشل فیس بک پیج (تصاویر، ویڈیوز اور ریویوز)۔
              </p>
              <input
                type="url"
                value={facebookUrl}
                onChange={e => setFacebookUrl(e.target.value)}
                placeholder="https://www.facebook.com/..."
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-mono text-slate-900 focus:outline-hidden focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* WhatsApp Message Template */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider">
              WhatsApp Pre-filled Chat Template
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Available placeholders: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">{"{car}"}</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">{"{pickup}"}</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">{"{return}"}</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">{"{ref}"}</code>
          </p>
          <textarea
            rows={3}
            value={waTemplate}
            onChange={e => setWaTemplate(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 font-mono"
          />
        </div>

        {/* Feature Toggles & Announcement Bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <h2 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider border-b border-slate-100 pb-3">
            Module Toggles & Announcements
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Self-Drive Mode</span>
                <span className="text-[11px] text-slate-500">Allow self-drive option</span>
              </div>
              <input
                type="checkbox"
                checked={selfDrive}
                onChange={e => setSelfDrive(e.target.checked)}
                className="w-5 h-5 accent-[#0B1F3A]"
              />
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Hourly Rental</span>
                <span className="text-[11px] text-slate-500">Enable short city runs</span>
              </div>
              <input
                type="checkbox"
                checked={hourly}
                onChange={e => setHourly(e.target.checked)}
                className="w-5 h-5 accent-[#0B1F3A]"
              />
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Floating WhatsApp</span>
                <span className="text-[11px] text-slate-500">Fixed button on bottom</span>
              </div>
              <input
                type="checkbox"
                checked={floatingWA}
                onChange={e => setFloatingWA(e.target.checked)}
                className="w-5 h-5 accent-[#0B1F3A]"
              />
            </div>
          </div>

          {/* Announcement Bar text */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">Top Header Announcement Bar</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={announcementEnabled}
                  onChange={e => setAnnouncementEnabled(e.target.checked)}
                  className="accent-[#0B1F3A]"
                />
                <span className="font-semibold">{announcementEnabled ? 'Enabled' : 'Disabled'}</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-600 block mb-1">English Announcement Notice</label>
                <input
                  type="text"
                  value={announcementEn}
                  onChange={e => setAnnouncementEn(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Urdu Announcement Notice</label>
                <input
                  type="text"
                  value={announcementUr}
                  onChange={e => setAnnouncementUr(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white font-urdu"
                  dir="rtl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Supabase Security & Master Administrator */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" />
              <div>
                <h2 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider">
                  Supabase Security & Master Administrator
                </h2>
                <p className="text-[11px] text-slate-500">
                  Secured admin access for <strong>{AUTHORIZED_ADMIN_EMAIL}</strong>
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
              Active Security Guard
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-1 text-xs text-blue-950">
            <span className="font-bold block">Super Administrator Email:</span>
            <p className="font-mono text-blue-900 font-bold">{AUTHORIZED_ADMIN_EMAIL}</p>
            <p className="text-[11px] text-blue-800 mt-1">
              Only this email address with valid password can access the Rent2Go Admin Panel.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Supabase Cloud Connection Credentials</span>
              <span className="text-[10px] text-slate-400">Optional for direct Supabase Auth</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Supabase Project URL</label>
                <input
                  type="url"
                  value={supabaseUrl}
                  onChange={e => setSupabaseUrl(e.target.value)}
                  placeholder="https://your-project.supabase.co"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Supabase Anon Public Key</label>
                <input
                  type="text"
                  value={supabaseKey}
                  onChange={e => setSupabaseKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-xs"
                />
              </div>
            </div>

            {supabaseSaveMsg && (
              <p className="text-xs font-bold text-emerald-700">{supabaseSaveMsg}</p>
            )}

            <button
              type="button"
              onClick={() => {
                setCustomSupabaseConfig(supabaseUrl, supabaseKey);
                setSupabaseSaveMsg('Supabase credentials saved successfully!');
                setTimeout(() => setSupabaseSaveMsg(''), 3000);
              }}
              className="px-4 py-2 rounded-xl bg-[#0B1F3A] hover:bg-[#142F57] text-[#F5B301] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Save Supabase Configuration</span>
            </button>
          </div>
        </div>

        {/* Advanced Data Management, Backup & Demo Hub */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-500" />
                <span>Data Management & Backup Hub</span>
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Full export/import, real fleet entry controls, and demo data wiping.
              </p>
            </div>
          </div>

          {importStatus && (
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold">
              {importStatus}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Export System Backup */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-xs text-slate-800 block">Export Full System Backup (JSON)</span>
              <p className="text-[11px] text-slate-500">
                Downloads an encrypted-ready JSON backup of all vehicles, rates, bookings, website CMS, and customer reviews.
              </p>
              <button
                type="button"
                onClick={() => {
                  const json = exportAllData();
                  const blob = new Blob([json], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `rent2go-backup-${new Date().toISOString().split('T')[0]}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-4 py-2 rounded-xl bg-[#0B1F3A] hover:bg-[#142F57] text-[#F5B301] text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download System Backup</span>
              </button>
            </div>

            {/* Import Backup */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-xs text-slate-800 block">Restore System Backup (JSON)</span>
              <p className="text-[11px] text-slate-500">
                Upload a previous Rent2Go JSON backup to restore all business data and fleet inventory.
              </p>
              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = ev => {
                    const content = ev.target?.result as string;
                    const res = importAllData(content);
                    if (res.success) {
                      setImportStatus('Backup restored successfully! All data loaded.');
                      setTimeout(() => setImportStatus(''), 3000);
                    } else {
                      setImportStatus(`Import failed: ${res.error}`);
                    }
                  };
                  reader.readAsText(file);
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5 text-slate-600" />
                <span>Upload & Restore Backup</span>
              </button>
            </div>
          </div>

          {/* Quick Demo Cleaners for Admin Real Data Entry */}
          <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/50 space-y-3">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
              Real Data Onboarding & Demo Cleaning
            </span>
            <p className="text-xs text-amber-800">
              When ready to enter your actual showroom cars and real customer bookings, use these one-click tools:
            </p>
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  if (confirm('Clear all demo fleet vehicles? You can then add your actual cars one by one.')) {
                    clearDemoFleet();
                    alert('Demo fleet cleared! Go to Fleet & Vehicles tab to add your real cars.');
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Demo Fleet (Start Fresh)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Wipe demo booking history?')) {
                    clearDemoBookings();
                    alert('Booking history cleared.');
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Demo Bookings</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Reset everything back to initial Sadiqabad demo seed state?')) {
                    resetAllData();
                    alert('All data restored to default demo state.');
                  }
                }}
                className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-white text-slate-800 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reload Sample Demo Fleet</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
