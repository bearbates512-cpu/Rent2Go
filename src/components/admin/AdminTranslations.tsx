import React, { useState } from 'react';
import { TranslationItem } from '../../types/index.ts';
import { INITIAL_TRANSLATIONS } from '../../data/initialData.ts';
import { Globe, Search, Save, CheckCircle2, AlertCircle } from 'lucide-react';

export const AdminTranslations: React.FC = () => {
  const [translations, setTranslations] = useState<TranslationItem[]>(() => {
    const saved = localStorage.getItem('rent2go_translations');
    return saved ? JSON.parse(saved) : INITIAL_TRANSLATIONS;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [onlyMissing, setOnlyMissing] = useState(false);
  const [toast, setToast] = useState(false);

  const handleUpdate = (id: string, field: 'en' | 'ur', val: string) => {
    setTranslations(prev =>
      prev.map(t => (t.id === id ? { ...t, [field]: val } : t))
    );
  };

  const handleSave = () => {
    localStorage.setItem('rent2go_translations', JSON.stringify(translations));
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  const filtered = translations.filter(t => {
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
    if (onlyMissing && t.ur.trim() !== '') return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return t.key.toLowerCase().includes(q) || t.en.toLowerCase().includes(q) || t.ur.toLowerCase().includes(q);
    }
    return true;
  });

  const categories = ['all', 'Navigation', 'Buttons', 'Badges', 'Status'];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0B1F3A]">Translations Dictionary (EN / UR)</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage UI string localizations for English (LTR) and Urdu (RTL) scripts.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#142F57] text-[#F5B301] text-xs font-bold transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save All Translations</span>
        </button>
      </div>

      {toast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold animate-in fade-in">
          Translations updated and saved!
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                categoryFilter === c
                  ? 'bg-[#0B1F3A] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
          <label className="flex items-center gap-1.5 ms-2 cursor-pointer text-slate-700 font-semibold shrink-0">
            <input
              type="checkbox"
              checked={onlyMissing}
              onChange={e => setOnlyMissing(e.target.checked)}
              className="accent-[#0B1F3A]"
            />
            <span>Missing Urdu Only</span>
          </label>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search key or text..."
            className="w-full ps-9 pe-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium"
          />
        </div>
      </div>

      {/* Translations Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-[#0B1F3A] text-white uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4 text-start">Key</th>
                <th className="py-3 px-4 text-start">Category</th>
                <th className="py-3 px-4 text-start">English (LTR)</th>
                <th className="py-3 px-4 text-start">Urdu (RTL)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(t => (
                <tr key={t.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-mono font-bold text-slate-700">
                    {t.key}
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-semibold">
                    {t.category}
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={t.en}
                      onChange={e => handleUpdate(t.id, 'en', e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#0B1F3A]"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={t.ur}
                      onChange={e => handleUpdate(t.id, 'ur', e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs font-urdu font-medium text-end focus:ring-2 focus:ring-[#0B1F3A]"
                      dir="rtl"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
