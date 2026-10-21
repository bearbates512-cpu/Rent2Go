import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { NavigationItem } from '../../types/index.ts';
import { INITIAL_NAV_ITEMS } from '../../data/initialData.ts';
import { Layers, PlusCircle, Eye, EyeOff, ArrowUp, ArrowDown, Save, Trash2, X, Globe } from 'lucide-react';

export const AdminNavigation: React.FC = () => {
  const [navItems, setNavItems] = useState<NavigationItem[]>(() => {
    const saved = localStorage.getItem('rent2go_nav_items');
    return saved ? JSON.parse(saved) : INITIAL_NAV_ITEMS;
  });

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newLabelEn, setNewLabelEn] = useState('');
  const [newLabelUr, setNewLabelUr] = useState('');
  const [newTarget, setNewTarget] = useState('home');
  const [toast, setToast] = useState(false);

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const items = [...navItems];
    const temp = items[index];
    items[index] = items[index - 1];
    items[index - 1] = temp;
    setNavItems(items);
  };

  const handleMoveDown = (index: number) => {
    if (index === navItems.length - 1) return;
    const items = [...navItems];
    const temp = items[index];
    items[index] = items[index + 1];
    items[index + 1] = temp;
    setNavItems(items);
  };

  const handleToggleVisible = (id: string) => {
    setNavItems(prev => prev.map(item => item.id === id ? { ...item, isVisible: !item.isVisible } : item));
  };

  const handleDelete = (id: string) => {
    setNavItems(prev => prev.filter(item => item.id !== id));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabelEn.trim()) return;

    const newItem: NavigationItem = {
      id: `nav-${Date.now()}`,
      menu: 'header',
      label: {
        en: newLabelEn.trim(),
        ur: newLabelUr.trim() || newLabelEn.trim()
      },
      targetView: newTarget,
      isVisible: true,
      sortOrder: navItems.length + 1
    };

    setNavItems([...navItems, newItem]);
    setAddModalOpen(false);
    setNewLabelEn('');
    setNewLabelUr('');
  };

  const handleSave = () => {
    localStorage.setItem('rent2go_nav_items', JSON.stringify(navItems));
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0B1F3A]">Navigation & Menus Manager</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure header and footer links, reorder menu items, and define bilingual labels.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAddModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-amber-500" />
            <span>Add Menu Link</span>
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-[#0B1F3A] hover:bg-[#142F57] text-[#F5B301] text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Navigation</span>
          </button>
        </div>
      </div>

      {toast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold animate-in fade-in">
          Navigation menu links saved successfully!
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block border-b border-slate-100 pb-3">
          Header Navigation Links
        </span>

        <div className="space-y-2.5">
          {navItems.map((item, idx) => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-slate-200 text-slate-700 font-bold font-mono flex items-center justify-center text-[10px]">
                  {idx + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{item.label.en}</span>
                    <span className="text-slate-400 font-urdu" dir="rtl">({item.label.ur})</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Target: {item.targetView}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleToggleVisible(item.id)}
                  className={`p-1.5 rounded-lg text-xs ${item.isVisible ? 'text-slate-600 hover:bg-slate-200' : 'text-slate-300'}`}
                  title={item.isVisible ? 'Visible' : 'Hidden'}
                >
                  {item.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleMoveUp(idx)}
                  disabled={idx === 0}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 disabled:opacity-30"
                  title="Move Up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleMoveDown(idx)}
                  disabled={idx === navItems.length - 1}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 disabled:opacity-30"
                  title="Move Down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Link Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-[#0B1F3A]">Add Navigation Menu Link</h2>
              <button
                onClick={() => setAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Label (English) *</label>
                <input
                  type="text"
                  value={newLabelEn}
                  onChange={e => setNewLabelEn(e.target.value)}
                  placeholder="e.g. Wedding Packages"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Label (Urdu)</label>
                <input
                  type="text"
                  value={newLabelUr}
                  onChange={e => setNewLabelUr(e.target.value)}
                  placeholder="e.g. شادی پیکیجز"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-urdu"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Page / View</label>
                <select
                  value={newTarget}
                  onChange={e => setNewTarget(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                >
                  <option value="home">Home Page (home)</option>
                  <option value="cars">Fleet & Cars (cars)</option>
                  <option value="services">Services Catalogue (services)</option>
                  <option value="rates">Rates & Packages (rates)</option>
                  <option value="about">About Us (about)</option>
                  <option value="contact">Contact Us (contact)</option>
                  <option value="status">Track Booking (status)</option>
                  <option value="custom">Custom CMS Page (/p/slug)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0B1F3A] text-white font-bold"
                >
                  Add Menu Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
