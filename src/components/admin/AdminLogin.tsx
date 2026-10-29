import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { AUTHORIZED_ADMIN_EMAIL, getSupabaseClient, setCustomSupabaseConfig } from '../../utils/supabase.ts';
import {
  Lock,
  Mail,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  Database,
  Sparkles,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { loginAdmin, setCurrentView, locale, dir } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSupabaseSettings, setShowSupabaseSettings] = useState(false);

  // Clear inputs on mount to enforce locked state
  React.useEffect(() => {
    setEmail('');
    setPassword('');
    setErrorMsg('');
  }, []);

  // Supabase manual config fields if user wants to link their project
  const [supabaseUrl, setSupabaseUrl] = useState(
    () => (typeof window !== 'undefined' ? localStorage.getItem('rent2go_supabase_url') || '' : '')
  );
  const [supabaseKey, setSupabaseKey] = useState(
    () => (typeof window !== 'undefined' ? localStorage.getItem('rent2go_supabase_key') || '' : '')
  );
  const [supabaseSavedNote, setSupabaseSavedNote] = useState('');

  const isSupabaseConfigured = Boolean(getSupabaseClient());

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setErrorMsg(
        locale === 'ur'
          ? 'برائے مہربانی ایڈمن جی میل اور پاس ورڈ دونوں درج کریں۔'
          : 'Please enter both administrator Gmail and password.'
      );
      return;
    }

    setLoading(true);

    try {
      const result = await loginAdmin(cleanEmail, cleanPassword);
      if (!result.success) {
        setErrorMsg(
          locale === 'ur'
            ? 'ایڈمن رسائی مسترد: غلط جی میل یا پاس ورڈ! ایڈمن پینل مقفل ہے۔'
            : (result.error || 'Invalid administrator credentials. Admin panel is locked.')
        );
        setPassword('');
      } else {
        setEmail('');
        setPassword('');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check credentials.');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomSupabaseConfig(supabaseUrl, supabaseKey);
    setSupabaseSavedNote('Supabase configuration saved successfully.');
    setTimeout(() => setSupabaseSavedNote(''), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 start-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 end-1/4 w-96 h-96 bg-[#F5B301]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back to Site Button */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between">
        <button
          onClick={() => {
            window.history.pushState(null, '', '/');
            setCurrentView('home');
          }}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          {dir === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{locale === 'ur' ? 'مرکزی ویب سائٹ پر واپس جائیں' : 'Back to Public Website'}</span>
        </button>

        <span className="text-[10px] font-mono text-slate-500 uppercase">
          Sadiqabad Fleet Portal
        </span>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-800/20 p-6 sm:p-8 space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 rounded-2xl bg-[#0B1F3A] shadow-md shadow-slate-900/20">
            <img
              src="/assets/aistudio/Rent2Go_icon_transparent.png"
              alt="Rent2Go"
              className="w-10 h-10 object-contain brightness-125"
            />
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0B1F3A] tracking-tight">
              Rent<span className="text-[#F5B301]">2Go</span> Admin Portal
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {locale === 'ur'
                ? 'محفوظ ایڈمن پینل - صرف تصدیق شدہ ایڈمن رسائی'
                : 'Secured Management Console & Fleet CMS'}
            </p>
          </div>
        </div>

        {/* Security Banner with Lock indicator */}
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-start flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-xs text-amber-950 block">
                {locale === 'ur' ? 'ایڈمن پینل مقفل ہے' : 'Admin Panel Locked'}
              </span>
              <span className="text-[10px] text-amber-800">
                {locale === 'ur'
                  ? 'لاگ ان کرنے کے لیے جی میل اور پاس ورڈ درج کریں'
                  : 'Enter authorized Gmail & password to unlock'}
              </span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 font-bold text-[9px] uppercase tracking-wider">
            Protected
          </span>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} autoComplete="off" className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">
              {locale === 'ur' ? 'ایڈمن جی میل (Admin Gmail)' : 'Administrator Email'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="bearbates512@gmail.com"
                required
                autoComplete="off"
                className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#0B1F3A] text-slate-900 font-medium"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-slate-700">
                {locale === 'ur' ? 'پاس ورڈ (Password)' : 'Password'}
              </label>
              <span className="text-[10px] text-slate-400">Master Secret</span>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="new-password"
                className="w-full ps-10 pe-10 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#0B1F3A] text-slate-900 font-medium font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#0B1F3A] hover:bg-[#142F57] text-[#F5B301] text-xs font-extrabold tracking-wide uppercase transition-all shadow-md shadow-slate-900/10 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{loading ? 'Authenticating...' : locale === 'ur' ? 'ایڈمن لاگ ان کریں' : 'Secure Admin Sign In'}</span>
          </button>
        </form>

        {/* Supabase Status / Optional Settings Toggle */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-500">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {isSupabaseConfigured
                  ? 'Supabase Cloud Auth: Active'
                  : 'Supabase Direct Admin Mode: Active'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowSupabaseSettings(!showSupabaseSettings)}
              className="text-blue-600 hover:underline font-semibold"
            >
              {showSupabaseSettings ? 'Close' : 'Supabase Keys'}
            </button>
          </div>

          {showSupabaseSettings && (
            <form onSubmit={handleSaveSupabaseConfig} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs animate-in fade-in duration-200">
              <span className="font-bold text-slate-700 block">Supabase Connection Credentials</span>
              <p className="text-[10px] text-slate-500">
                If you have created a Supabase project for <code>{AUTHORIZED_ADMIN_EMAIL}</code>, paste your Project URL and Anon Public Key below:
              </p>
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Project URL</label>
                <input
                  type="url"
                  value={supabaseUrl}
                  onChange={e => setSupabaseUrl(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Anon Public Key</label>
                <input
                  type="text"
                  value={supabaseKey}
                  onChange={e => setSupabaseKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs font-mono"
                />
              </div>
              {supabaseSavedNote && (
                <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{supabaseSavedNote}</span>
                </div>
              )}
              <button
                type="submit"
                className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
              >
                Save Supabase Credentials
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
