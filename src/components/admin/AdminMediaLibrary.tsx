import React, { useState } from 'react';
import { MediaAsset } from '../../types/index.ts';
import { INITIAL_MEDIA } from '../../data/initialData.ts';
import { Image, PlusCircle, Copy, Check, Trash2, X, Tag } from 'lucide-react';

export const AdminMediaLibrary: React.FC = () => {
  const [assets, setAssets] = useState<MediaAsset[]>(() => {
    const saved = localStorage.getItem('rent2go_media');
    return saved ? JSON.parse(saved) : INITIAL_MEDIA;
  });

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newAltEn, setNewAltEn] = useState('');
  const [newAltUr, setNewAltUr] = useState('');
  const [newCategory, setNewCategory] = useState<'cars' | 'banners' | 'drivers' | 'general'>('cars');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this media asset?')) {
      const updated = assets.filter(a => a.id !== id);
      setAssets(updated);
      localStorage.setItem('rent2go_media', JSON.stringify(updated));
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    const newAsset: MediaAsset = {
      id: `med-${Date.now()}`,
      title: newTitle.trim(),
      url: newUrl.trim(),
      altText: {
        en: newAltEn.trim() || newTitle.trim(),
        ur: newAltUr.trim() || newTitle.trim()
      },
      category: newCategory,
      sizeKB: 250,
      uploadedAt: new Date().toISOString()
    };

    const updated = [newAsset, ...assets];
    setAssets(updated);
    localStorage.setItem('rent2go_media', JSON.stringify(updated));
    setAddModalOpen(false);
    setNewTitle('');
    setNewUrl('');
  };

  const filtered = assets.filter(a => categoryFilter === 'all' || a.category === categoryFilter);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0B1F3A]">Media Library & Fleet Assets</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Store and manage high-resolution vehicle photos, marketing banners, and alt tags.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#142F57] text-[#F5B301] text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Media Asset</span>
        </button>
      </div>

      {/* Filter Category */}
      <div className="flex gap-2">
        {['all', 'cars', 'banners', 'drivers', 'general'].map(c => (
          <button
            key={c}
            onClick={() => setCategoryFilter(c)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
              categoryFilter === c
                ? 'bg-[#0B1F3A] text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map(asset => (
          <div
            key={asset.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col justify-between group"
          >
            <div className="relative aspect-16/10 bg-slate-900 overflow-hidden">
              <img
                src={asset.url}
                alt={asset.altText.en}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-2 start-2 px-2 py-0.5 rounded-md bg-black/60 text-white font-mono text-[9px] uppercase">
                {asset.category}
              </span>
            </div>

            <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-xs text-slate-800 truncate" title={asset.title}>
                  {asset.title}
                </h4>
                <span className="text-[10px] text-slate-400 block truncate font-mono">
                  {asset.sizeKB} KB • {new Date(asset.uploadedAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleCopy(asset.id, asset.url)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center gap-1 transition-colors"
                >
                  {copiedId === asset.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId === asset.id ? 'Copied' : 'Copy URL'}</span>
                </button>

                <button
                  onClick={() => handleDelete(asset.id)}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-[#0B1F3A]">Add Media Image Asset</h2>
              <button
                onClick={() => setAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Asset Title *</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Toyota Prado Black VIP"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Image URL *</label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-[11px]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 capitalize"
                >
                  <option value="cars">Cars & Fleet</option>
                  <option value="banners">Banners & Hero</option>
                  <option value="drivers">Drivers</option>
                  <option value="general">General</option>
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
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
