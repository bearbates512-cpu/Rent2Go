import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { AdminRole } from '../../types/index.ts';
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
  User
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
    enquiries
  } = useApp();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const newEnquiriesCount = enquiries.filter(e => e.status === 'new').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bookings', label: 'Bookings & Orders', icon: FileEdit, badge: pendingCount },
    { id: 'calendar', label: 'Fleet Calendar', icon: Calendar },
    { id: 'vehicles', label: 'Vehicles & Fleet', icon: Car },
    { id: 'cms', label: 'Website CMS (Visual)', icon: FileEdit },
    { id: 'navigation', label: 'Navigation & Menus', icon: Layers },
    { id: 'pricing', label: 'Pricing & Fare Engine', icon: Banknote },
    { id: 'enquiries', label: 'Enquiries & CRM', icon: MessageSquare, badge: newEnquiriesCount },
    { id: 'reviews', label: 'Reviews Moderation', icon: Star },
    { id: 'media', label: 'Media Library', icon: Palette },
    { id: 'translations', label: 'Translations (EN/UR)', icon: Globe },
    { id: 'formbuilder', label: 'Form Builder', icon: FileEdit },
    { id: 'reports', label: 'Reports & Analytics', icon: History },
    { id: 'theme', label: 'Theme & Branding', icon: Palette },
    { id: 'team', label: 'Team & Permissions', icon: Shield },
    { id: 'settings', label: 'Settings & Modules', icon: Settings },
    { id: 'audit', label: 'Audit Log', icon: History }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col antialiased text-slate-800" dir="ltr">
      {/* Top Navbar */}
      <header className="bg-[#0B1F3A] text-white sticky top-0 z-40 border-b border-slate-800 shadow-md">
        <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/10 p-1 flex items-center justify-center shrink-0">
                <img
                  src="/assets/aistudio/Rent2Go_icon_transparent.png"
                  alt="Rent2Go"
                  className="w-full h-full object-contain brightness-125"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white">Rent<span className="text-[#F5B301]">2Go</span></span>
                <span className="text-[10px] font-bold text-amber-400 uppercase px-1.5 py-0.5 rounded bg-white/10">
                  Admin Mini-CMS
                </span>
              </div>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* User identity */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 text-xs">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono text-[11px] font-semibold">{adminUser?.email || 'bearbates512@gmail.com'}</span>
            </div>

            {/* Role Switcher */}
            <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg text-xs">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-300 hidden sm:inline">Role:</span>
              <select
                value={adminRole}
                onChange={e => setAdminRole(e.target.value as AdminRole)}
                className="bg-transparent text-white font-bold text-xs focus:outline-hidden capitalize cursor-pointer"
              >
                <option value="owner" className="text-slate-900">Owner (Super Admin)</option>
                <option value="manager" className="text-slate-900">Manager</option>
                <option value="staff" className="text-slate-900">Staff</option>
                <option value="content_editor" className="text-slate-900">Content Editor</option>
              </select>
            </div>

            {/* Public Website Button */}
            <button
              onClick={() => {
                window.history.pushState(null, '', '/');
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden md:inline">View Public Site</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={() => {
                logoutAdmin();
                window.history.pushState(null, '', '/');
                setCurrentView('home');
              }}
              className="px-2.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 hover:text-white text-xs font-bold transition-colors flex items-center gap-1.5"
              title="Sign Out of Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 start-0 z-30 w-64 bg-white border-e border-slate-200 flex flex-col justify-between transition-transform duration-200 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="p-4 space-y-1 overflow-y-auto">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 block">
              Management Modules
            </span>

            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#0B1F3A] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#F5B301]' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        isActive ? 'bg-[#F5B301] text-[#0B1F3A]' : 'bg-rose-500 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sadiqabad Hub Info Bottom & Logout */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/70 text-[11px] text-slate-500 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700">Hub: Sadiqabad Bypass</span>
              <span className="text-emerald-600 font-bold">● Active</span>
            </div>
            <p className="text-[10px] text-slate-400">Rent2Go Fleet Operating Engine</p>

            <button
              onClick={() => {
                logoutAdmin();
              }}
              className="w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span>Sign Out & Lock Panel</span>
            </button>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 z-20 lg:hidden"
          />
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
