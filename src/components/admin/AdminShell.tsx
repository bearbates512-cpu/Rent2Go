import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext.tsx';
import { AdminRole } from '../../types/index.ts';
import { soundFX } from '../../utils/soundEffects.ts';
import { triggerThunderBlast } from '../effects/ThunderBlastSystem.tsx';
import { SpinInHeading, SpinInText, LiquidGasBadge } from '../effects/SpinInTypography.tsx';
import { LiquidGasCanvas } from '../effects/LiquidGasCanvas.tsx';
import {
  LayoutDashboard,
  Calendar,
  Car,
  FileEdit,
  Banknote,
  MessageSquare,
  Star,
  Settings,
  History,
  Palette,
  ExternalLink,
  Shield,
  Bell,
  Menu,
  X,
  Search,
  CheckCircle2,
  Layers,
  Globe,
  LogOut,
  User,
  Zap,
  Sparkles,
  Sun,
  Moon,
  Clock,
  MapPin,
  TrendingUp,
  SlidersHorizontal
} from 'lucide-react';

interface AdminShellProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  children: React.ReactNode;
}

export const AdminShell: React.FC<AdminShellProps> = ({
  currentTab,
  setCurrentTab,
  children
}) => {
  const {
    adminRole,
    setAdminRole,
    adminUser,
    logoutAdmin,
    setCurrentView,
    bookings,
    enquiries,
    themeMode,
    toggleThemeMode
  } = useApp();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const newEnquiriesCount = enquiries.filter(e => e.status === 'new').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'bookings', label: 'Bookings & Rental Orders', icon: FileEdit, badge: pendingCount },
    { id: 'calendar', label: 'Fleet Calendar & Slots', icon: Calendar },
    { id: 'vehicles', label: 'Vehicles & Fleet Inventory', icon: Car },
    { id: 'cms', label: 'Website CMS & Banners', icon: Layers },
    { id: 'navigation', label: 'Navigation & Menus', icon: SlidersHorizontal },
    { id: 'pricing', label: 'Pricing & Fare Engine', icon: Banknote },
    { id: 'enquiries', label: 'Enquiries & CRM Leads', icon: MessageSquare, badge: newEnquiriesCount },
    { id: 'reviews', label: 'Reviews Moderation', icon: Star },
    { id: 'media', label: 'Media Library & Assets', icon: Palette },
    { id: 'translations', label: 'Translations (EN / UR)', icon: Globe },
    { id: 'formbuilder', label: 'Form Builder', icon: FileEdit },
    { id: 'reports', label: 'Reports & Revenue Analytics', icon: TrendingUp },
    { id: 'theme', label: 'Theme & Brand Styling', icon: Palette },
    { id: 'team', label: 'Team & Role Access', icon: Shield },
    { id: 'settings', label: 'Settings & Modules', icon: Settings },
    { id: 'audit', label: 'Audit Security Log', icon: History }
  ];

  const handleNavClick = (tabId: string) => {
    soundFX.playClick();
    setCurrentTab(tabId);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen relative flex flex-col bg-[#F8FAFC] dark:bg-[#060D17] text-slate-800 dark:text-slate-100 transition-colors duration-250 antialiased overflow-x-hidden" dir="ltr">
      {/* Liquid Gas Plasma Canvas in Admin Panel */}
      <LiquidGasCanvas />

      {/* Top Navbar with Website Gold & Navy Theme */}
      <header className="relative z-40 bg-[#0B1F3A] dark:bg-[#07101E] text-white sticky top-0 border-b border-slate-800 shadow-xl backdrop-blur-md">
        {/* Top Gold Line */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#F5B301] via-cyan-400 to-transparent" />

        <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundFX.playClick();
                setSidebarOpen(!sidebarOpen);
              }}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Brand Logo with 3D Spin */}
            <motion.div
              initial={{ opacity: 0, rotateY: 45 }}
              animate={{ opacity: 1, rotateY: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2.5"
            >
              <div className="w-9 h-9 rounded-xl bg-white/10 p-1.5 flex items-center justify-center shrink-0 border border-white/15 shadow-inner">
                <img
                  src="/assets/aistudio/Rent2Go_icon_transparent.png"
                  alt="Rent2Go"
                  className="w-full h-full object-contain brightness-125"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-tight text-white font-mono">
                  Rent<span className="text-[#F5B301]">2Go</span>
                </span>
                <span className="text-[10px] font-mono font-bold text-amber-300 uppercase px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5 text-amber-400 animate-pulse" />
                  <span>HQ ADMIN</span>
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle (Day / Night Mode) */}
            <button
              onClick={() => {
                soundFX.playClick();
                toggleThemeMode();
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 border border-white/15 transition-all cursor-pointer"
              title="Toggle Day / Night Mode"
            >
              {themeMode === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
              ) : (
                <Moon className="w-4 h-4 text-cyan-300" />
              )}
            </button>

            {/* User identity with Liquid Gas Glow */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs shadow-xs">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono text-[11px] font-bold">{adminUser?.email || 'bearbates512@gmail.com'}</span>
            </div>

            {/* Role Switcher */}
            <div className="flex items-center gap-1.5 bg-white/10 border border-white/15 px-3 py-1.5 rounded-xl text-xs">
              <Shield className="w-3.5 h-3.5 text-[#F5B301]" />
              <span className="text-slate-300 hidden sm:inline font-mono">Role:</span>
              <select
                value={adminRole}
                onChange={e => {
                  soundFX.playClick();
                  setAdminRole(e.target.value as AdminRole);
                }}
                className="bg-transparent text-white font-bold text-xs focus:outline-hidden capitalize cursor-pointer font-mono"
              >
                <option value="owner" className="bg-[#0B1F3A] text-white">Owner (Super Admin)</option>
                <option value="manager" className="bg-[#0B1F3A] text-white">Fleet Manager</option>
                <option value="staff" className="bg-[#0B1F3A] text-white">Support Staff</option>
                <option value="content_editor" className="bg-[#0B1F3A] text-white">Content Editor</option>
              </select>
            </div>

            {/* Public Website Button */}
            <button
              onClick={() => {
                soundFX.playClick();
                window.history.pushState(null, '', '/');
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-white/15"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#F5B301]" />
              <span className="hidden md:inline">Public Site</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                triggerThunderBlast(rect.left + rect.width / 2, rect.top);
                soundFX.playClick();
                logoutAdmin();
                window.history.pushState(null, '', '/');
                setCurrentView('home');
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-md shadow-rose-950/20"
              title="Sign Out and Lock Panel"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body Layout with 3D Perspective */}
      <div className="relative z-10 flex-1 flex overflow-hidden perspective-1000">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 start-0 z-30 w-72 bg-white/95 dark:bg-[#0B1523]/95 backdrop-blur-xl border-e border-slate-200/90 dark:border-slate-800 flex flex-col justify-between transition-all duration-300 shadow-2xl lg:shadow-none ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-140px)]">
            <div className="px-3 py-2 flex items-center justify-between">
              <span className="text-[10px] font-mono font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block">
                ADMINISTRATION MODULES
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            {navItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20, rotateY: 25 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.02 }}
                  whileHover={{ x: 4, scale: 1.01 }}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#0B1F3A] to-[#142F57] dark:from-[#F5B301] dark:to-amber-400 text-white dark:text-[#0B1F3A] shadow-md shadow-slate-900/10 dark:shadow-amber-500/20 ring-1 ring-white/10 dark:ring-amber-400'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#F5B301] dark:text-[#0B1F3A]' : 'text-slate-400 dark:text-slate-400'}`} />
                    <span className="tracking-tight">{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black ${
                        isActive
                          ? 'bg-[#F5B301] text-[#0B1F3A] dark:bg-[#0B1F3A] dark:text-white'
                          : 'bg-rose-500 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Sadiqabad Hub Status Footer & Lock */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 text-[11px] text-slate-500 dark:text-slate-400 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#F5B301]" />
                <span className="font-bold text-slate-700 dark:text-slate-200 font-mono">Sadiqabad Hub</span>
              </div>
              <span className="text-emerald-500 dark:text-emerald-400 font-bold font-mono text-[10px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE
              </span>
            </div>

            <button
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                triggerThunderBlast(rect.left + rect.width / 2, rect.top);
                soundFX.playClick();
                logoutAdmin();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-500" />
              <span>Lock Admin Session</span>
            </button>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-20 lg:hidden"
          />
        )}

        {/* Content Area with 3D Spin-In container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 20, rotateX: -6 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -20, rotateX: 6 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="will-change-transform"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
