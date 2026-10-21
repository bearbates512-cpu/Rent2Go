import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { CMSSection, Locale } from '../../types/index.ts';
import {
  FileEdit,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Monitor,
  History,
  Layers,
  Save,
  Globe
} from 'lucide-react';

export const AdminCMS: React.FC = () => {
  const {
    cmsPage,
    updateCMSSections,
    publishCMSRevision,
    restoreCMSRevision,
    locale: appLocale
  } = useApp();

  const [activeSectionId, setActiveSectionId] = useState<string>(
    cmsPage.sections[0]?.id || ''
  );

  const [editLang, setEditLang] = useState<'en' | 'ur'>('en');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [previewRTL, setPreviewRTL] = useState<boolean>(false);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [publishSuccessToast, setPublishSuccessToast] = useState(false);
  const [publishNote, setPublishNote] = useState('');

  const activeSection = cmsPage.sections.find(s => s.id === activeSectionId) || cmsPage.sections[0];

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newSections = [...cmsPage.sections];
    const temp = newSections[index];
    newSections[index] = newSections[index - 1];
    newSections[index - 1] = temp;
    // update sort orders
    newSections.forEach((s, idx) => (s.sortOrder = idx + 1));
    updateCMSSections(newSections);
  };

  const handleMoveDown = (index: number) => {
    if (index === cmsPage.sections.length - 1) return;
    const newSections = [...cmsPage.sections];
    const temp = newSections[index];
    newSections[index] = newSections[index + 1];
    newSections[index + 1] = temp;
    newSections.forEach((s, idx) => (s.sortOrder = idx + 1));
    updateCMSSections(newSections);
  };

  const handleToggleVisibility = (id: string) => {
    const newSections = cmsPage.sections.map(s =>
      s.id === id ? { ...s, isVisible: !s.isVisible } : s
    );
    updateCMSSections(newSections);
  };

  const handleUpdateActiveSectionTitle = (text: string) => {
    if (!activeSection) return;
    const newSections = cmsPage.sections.map(s => {
      if (s.id !== activeSection.id) return s;
      return {
        ...s,
        title: {
          ...s.title,
          [editLang]: text
        }
      };
    });
    updateCMSSections(newSections);
  };

  const handleUpdateActiveSectionSubtitle = (text: string) => {
    if (!activeSection) return;
    const newSections = cmsPage.sections.map(s => {
      if (s.id !== activeSection.id) return s;
      return {
        ...s,
        subtitle: {
          ...(s.subtitle || { en: '', ur: '' }),
          [editLang]: text
        }
      };
    });
    updateCMSSections(newSections);
  };

  const handlePublish = () => {
    publishCMSRevision(publishNote.trim() || 'Updated home sections content');
    setPublishNote('');
    setPublishSuccessToast(true);
    setTimeout(() => setPublishSuccessToast(false), 3000);
  };

  const handleRestore = (ver: number) => {
    if (confirm(`Are you sure you want to rollback to revision version ${ver}?`)) {
      restoreCMSRevision(ver);
      setHistoryDrawerOpen(false);
      alert(`Restored CMS to version ${ver} successfully!`);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-[#0B1F3A]">Visual CMS & Content Manager</h1>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
              Revision v{cmsPage.version}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Reorder home sections, edit bilingual English & Urdu copy, preview live, and publish with 1-click rollback.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setHistoryDrawerOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
          >
            <History className="w-4 h-4 text-slate-500" />
            <span>Version History ({cmsPage.history?.length || 0})</span>
          </button>

          <button
            onClick={handlePublish}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Publish Revision</span>
          </button>
        </div>
      </div>

      {publishSuccessToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>New revision published to live public website!</span>
        </div>
      )}

      {/* Main 3-Column CMS Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Sections List & Reordering (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-500" />
              <span>Page Sections ({cmsPage.sections.length})</span>
            </span>
            <span className="text-[10px] text-slate-400">Order from Top to Bottom</span>
          </div>

          <div className="space-y-2">
            {cmsPage.sections.map((sec, idx) => {
              const isSelected = activeSection?.id === sec.id;
              const title = sec.title.en;

              return (
                <div
                  key={sec.id}
                  onClick={() => setActiveSectionId(sec.id)}
                  className={`p-3 rounded-2xl border-2 transition-all flex items-center justify-between gap-2 cursor-pointer ${
                    isSelected
                      ? 'border-[#0B1F3A] bg-blue-50/40 shadow-xs'
                      : 'border-slate-100 hover:border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-500 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="truncate">
                      <span className="font-bold text-xs text-slate-800 block truncate">{title}</span>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">{sec.blockType}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => handleToggleVisibility(sec.id)}
                      className={`p-1 rounded-md text-xs ${sec.isVisible ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-300'}`}
                      title={sec.isVisible ? 'Visible on site' : 'Hidden from site'}
                    >
                      {sec.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleMoveUp(idx)}
                      disabled={idx === 0}
                      className="p-1 rounded-md text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveDown(idx)}
                      disabled={idx === cmsPage.sections.length - 1}
                      className="p-1 rounded-md text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center/Right Column: Section Settings & Live Bilingual Editor (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {activeSection ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Section Editor ({activeSection.blockType})
                  </span>
                  <h2 className="text-base font-bold text-[#0B1F3A]">
                    {activeSection.title[editLang] || activeSection.title.en}
                  </h2>
                </div>

                {/* Bilingual Tabs EN | UR */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
                  <button
                    onClick={() => setEditLang('en')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      editLang === 'en' ? 'bg-white text-[#0B1F3A] shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    English (LTR)
                  </button>
                  <button
                    onClick={() => setEditLang('ur')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      editLang === 'ur' ? 'bg-[#0B1F3A] text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Urdu (RTL)
                  </button>
                </div>
              </div>

              {/* Form fields */}
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {editLang === 'ur' ? 'سیکشن کی ہیڈنگ (Urdu Nastaliq)' : 'Section Main Headline (English)'}
                  </label>
                  <input
                    type="text"
                    value={activeSection.title[editLang] || ''}
                    onChange={e => handleUpdateActiveSectionTitle(e.target.value)}
                    dir={editLang === 'ur' ? 'rtl' : 'ltr'}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-[#0B1F3A]"
                  />
                </div>

                {activeSection.subtitle && (
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      {editLang === 'ur' ? 'ذیلی عبارت / سب ٹائٹل (Urdu)' : 'Subtitle / Description (English)'}
                    </label>
                    <textarea
                      rows={3}
                      value={activeSection.subtitle[editLang] || ''}
                      onChange={e => handleUpdateActiveSectionSubtitle(e.target.value)}
                      dir={editLang === 'ur' ? 'rtl' : 'ltr'}
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-[#0B1F3A]"
                    />
                  </div>
                )}

                {/* Block specific editable props */}
                {activeSection.blockType === 'hero' && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <span className="font-bold text-slate-700 uppercase tracking-wider block text-[10px]">
                      Hero Banner Configuration
                    </span>
                    <div>
                      <label className="font-bold text-slate-600 block mb-1">Background Banner Image URL</label>
                      <input
                        type="url"
                        value={activeSection.props.bannerImage || ''}
                        onChange={e => {
                          const newSections = cmsPage.sections.map(s => {
                            if (s.id !== activeSection.id) return s;
                            return { ...s, props: { ...s.props, bannerImage: e.target.value } };
                          });
                          updateCMSSections(newSections);
                        }}
                        className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-[11px]"
                      />
                    </div>
                  </div>
                )}

                {/* Section Visibility Status */}
                <div className="p-3.5 rounded-2xl bg-blue-50/40 border border-blue-100 flex items-center justify-between text-xs">
                  <span className="text-slate-700">Display this section on public home page:</span>
                  <button
                    onClick={() => handleToggleVisibility(activeSection.id)}
                    className={`px-3 py-1 rounded-lg font-bold text-[11px] ${
                      activeSection.isVisible
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {activeSection.isVisible ? 'Visible (ON)' : 'Hidden (OFF)'}
                  </button>
                </div>
              </div>

              {/* LIVE PREVIEW BOX */}
              <div className="pt-6 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Real-time Visual Preview</span>
                  </span>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs">
                      <button
                        onClick={() => setPreviewMode('desktop')}
                        className={`p-1.5 rounded-md ${previewMode === 'desktop' ? 'bg-white shadow-2xs' : 'text-slate-500'}`}
                        title="Desktop Preview"
                      >
                        <Monitor className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setPreviewMode('mobile')}
                        className={`p-1.5 rounded-md ${previewMode === 'mobile' ? 'bg-white shadow-2xs' : 'text-slate-500'}`}
                        title="Mobile Preview (390px)"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => setPreviewRTL(!previewRTL)}
                      className={`px-2 py-1 rounded-md text-[11px] font-bold border transition-colors ${
                        previewRTL ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]' : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      RTL: {previewRTL ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>

                {/* Preview Box Frame */}
                <div
                  className={`mx-auto bg-slate-900 text-white rounded-2xl p-6 shadow-inner transition-all ${
                    previewMode === 'mobile' ? 'max-w-xs' : 'w-full'
                  }`}
                  dir={previewRTL || editLang === 'ur' ? 'rtl' : 'ltr'}
                >
                  <span className="text-[10px] font-bold text-[#F5B301] block mb-1">
                    {previewRTL || editLang === 'ur' ? 'صادق آباد کار رینٹل' : 'PREVIEW RENDERING'}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold">
                    {activeSection.title[editLang] || activeSection.title.en}
                  </h3>
                  {activeSection.subtitle && (
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed opacity-90">
                      {activeSection.subtitle[editLang] || activeSection.subtitle.en}
                    </p>
                  )}
                  <div className="mt-3 flex gap-2">
                    <span className="px-3 py-1 rounded-md bg-[#F5B301] text-[#0B1F3A] font-bold text-[10px]">
                      CTA Button
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-400">
              Select a section on the left to edit.
            </div>
          )}
        </div>
      </div>

      {/* VERSION HISTORY DRAWER / MODAL */}
      {historyDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-[#0B1F3A] flex items-center gap-2">
                <History className="w-4 h-4 text-blue-600" />
                <span>Revision History & Rollback</span>
              </h2>
              <button
                onClick={() => setHistoryDrawerOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Each time you publish, an immutable revision snapshot is created. You can restore any past version with 1-click.
            </p>

            <div className="space-y-2.5">
              {cmsPage.history && cmsPage.history.length > 0 ? (
                cmsPage.history.map(h => (
                  <div
                    key={h.version}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">Version {h.version}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(h.savedAt).toLocaleString()}
                        </span>
                      </div>
                      <span className="text-slate-600 text-[11px] block mt-0.5">
                        "{h.note}" by {h.savedBy}
                      </span>
                    </div>

                    <button
                      onClick={() => handleRestore(h.version)}
                      className="px-3 py-1.5 rounded-lg bg-[#0B1F3A] hover:bg-[#142F57] text-[#F5B301] font-bold text-xs shrink-0 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Rollback</span>
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No previous revisions saved yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
