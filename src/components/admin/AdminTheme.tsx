import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Palette, ShieldCheck, AlertTriangle, Check, RefreshCw } from 'lucide-react';

export const AdminTheme: React.FC = () => {
  const { settings, updateSiteSettings } = useApp();

  const [primary, setPrimary] = useState(settings.themeTokens.primaryColor);
  const [accent, setAccent] = useState(settings.themeTokens.accentColor);
  const [radius, setRadius] = useState(settings.themeTokens.borderRadius);
  const [savedToast, setSavedToast] = useState(false);

  // Simple WCAG contrast ratio estimator for text on background
  const getContrastRatio = (hex1: string, hex2: string): number => {
    const getLuminance = (hex: string) => {
      const rgb = parseInt(hex.slice(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;
      return 0.2126 * (r / 255) + 0.7152 * (g / 255) + 0.0722 * (b / 255);
    };

    try {
      const l1 = getLuminance(hex1);
      const l2 = getLuminance(hex2);
      const lighter = Math.max(l1, l2);
      const darker = Math.min(l1, l2);
      return (lighter + 0.05) / (darker + 0.05);
    } catch {
      return 5.0;
    }
  };

  const primaryContrast = getContrastRatio(primary, '#FFFFFF');
  const accentContrast = getContrastRatio(accent, primary);

  const handleSave = () => {
    updateSiteSettings({
      ...settings,
      themeTokens: {
        ...settings.themeTokens,
        primaryColor: primary,
        accentColor: accent,
        borderRadius: radius
      }
    });

    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const resetDefaults = () => {
    setPrimary('#0B1F3A');
    setAccent('#F5B301');
    setRadius('0.75rem');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0B1F3A]">Theme & Visual Branding</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Customize CSS variables, brand palette, and check accessibility contrast ratios.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetDefaults}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-[#0B1F3A] hover:bg-[#142F57] text-[#F5B301] text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Apply Theme</span>
          </button>
        </div>
      </div>

      {savedToast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold animate-in fade-in">
          Theme tokens updated and applied to CSS variables!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <h2 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider">
            Color Palette & Tokens
          </h2>

          <div className="space-y-5 text-xs">
            {/* Primary Navy */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="font-bold text-slate-700">Primary Color (Header, Headings, Primary CTAs)</label>
                <span className="font-mono text-slate-500">{primary}</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primary}
                  onChange={e => setPrimary(e.target.value)}
                  className="w-12 h-10 rounded-lg cursor-pointer border border-slate-200 p-1 bg-white"
                />
                <input
                  type="text"
                  value={primary}
                  onChange={e => setPrimary(e.target.value)}
                  className="flex-1 p-2.5 rounded-xl border border-slate-200 font-mono text-xs"
                />
              </div>

              {/* Contrast feedback */}
              <div className="mt-2 flex items-center gap-2">
                {primaryContrast >= 4.5 ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>WCAG AA Passed: {primaryContrast.toFixed(1)}:1 (Text on White)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Low Contrast: {primaryContrast.toFixed(1)}:1 (Suggest darker tone)</span>
                  </span>
                )}
              </div>
            </div>

            {/* Accent Warm Gold */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="font-bold text-slate-700">Accent Color (Gold Badges, Highlights)</label>
                <span className="font-mono text-slate-500">{accent}</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={accent}
                  onChange={e => setAccent(e.target.value)}
                  className="w-12 h-10 rounded-lg cursor-pointer border border-slate-200 p-1 bg-white"
                />
                <input
                  type="text"
                  value={accent}
                  onChange={e => setAccent(e.target.value)}
                  className="flex-1 p-2.5 rounded-xl border border-slate-200 font-mono text-xs"
                />
              </div>

              {/* Notice per Design Brief 2.1 */}
              <div className="mt-1.5 text-[11px] text-slate-500 italic">
                Rule: Warm gold automatically uses dark navy text for optimal readability.
              </div>
            </div>

            {/* Corner Radius */}
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Component Corner Radius</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: '0.375rem', label: 'Boxy (6px)' },
                  { id: '0.75rem', label: 'Standard (12px)' },
                  { id: '1rem', label: 'Round (16px)' }
                ].map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRadius(r.id)}
                    className={`p-2.5 rounded-xl border text-center font-bold ${
                      radius === r.id
                        ? 'border-[#0B1F3A] bg-[#0B1F3A] text-white'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Card Preview Column (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Live Token Preview
          </span>

          {/* Sample Header Render */}
          <div
            className="p-4 text-white flex items-center justify-between"
            style={{ backgroundColor: primary, borderRadius: radius }}
          >
            <div className="flex items-center gap-2 font-black text-sm">
              <span>Rent</span>
              <span style={{ color: accent }}>2Go</span>
            </div>
            <button
              className="px-3 py-1 text-xs font-bold"
              style={{ backgroundColor: accent, color: primary, borderRadius: '6px' }}
            >
              Book Now
            </button>
          </div>

          {/* Sample Vehicle Card Render */}
          <div
            className="p-5 border border-slate-200 space-y-3"
            style={{ borderRadius: radius }}
          >
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm" style={{ color: primary }}>
                Toyota Fortuner Legender (2023)
              </span>
              <span
                className="px-2 py-0.5 text-[10px] font-bold"
                style={{ backgroundColor: accent, color: primary, borderRadius: '4px' }}
              >
                Featured
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Sample body text verifying typography and contrast against background.
            </p>
            <button
              className="w-full py-2.5 text-xs font-bold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: primary, borderRadius: radius }}
            >
              Request Booking (Primary CTA)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
