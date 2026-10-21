import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Settings, Save, Check, RefreshCw, ToggleLeft, ToggleRight, MessageSquare, AlertCircle, Download, Upload, Trash2, Database, ShieldCheck, RotateCcw } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, updateSiteSettings, resetAllData, clearDemoFleet, clearDemoBookings, exportAllData, importAllData } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string>('');

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
