import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Settings, Save, Check, RefreshCw, ToggleLeft, ToggleRight, MessageSquare, AlertCircle } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, updateSiteSettings, resetAllData } = useApp();

  const [phone, setPhone] = useState(settings.phone);
  const [phoneFormatted, setPhoneFormatted] = useState(settings.phoneFormatted);
  const [whatsapp, setWhatsapp] = useState(settings.whatsappNumber);
  const [email, setEmail] = useState(settings.email);
  const [addressEn, setAddressEn] = useState(settings.address.en);
  const [addressUr, setAddressUr] = useState(settings.address.ur);
  const [hoursEn, setHoursEn] = useState(settings.businessHours.en);
  const [hoursUr, setHoursUr] = useState(settings.businessHours.ur);
  const [waTemplate, setWaTemplate] = useState(settings.whatsappMessageTemplate);

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
      phone,
      phoneFormatted,
      whatsappNumber: whatsapp,
      email,
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
      }
    });

    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
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
              <label className="font-bold text-slate-700 block mb-1">WhatsApp Number (e.g. 923007865432)</label>
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

        {/* Danger Zone: Reset Data */}
        <div className="p-6 rounded-3xl border border-rose-200 bg-rose-50/50 space-y-3">
          <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block">
            Danger Zone
          </span>
          <p className="text-xs text-rose-700">
            Reset all vehicles, bookings, CMS content, and reviews to pristine default Sadiqabad seed data.
          </p>
          <button
            type="button"
            onClick={() => {
              if (confirm('Are you sure you want to reset all data to initial defaults?')) {
                resetAllData();
                alert('All data reset to initial seed state.');
              }
            }}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors"
          >
            Reset All Application Data
          </button>
        </div>
      </form>
    </div>
  );
};
