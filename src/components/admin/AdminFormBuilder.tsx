import React, { useState } from 'react';
import { FormFieldConfig } from '../../types/index.ts';
import { INITIAL_FORM_FIELDS } from '../../data/initialData.ts';
import { FileEdit, Lock, Eye, EyeOff, Save, CheckCircle2, AlertCircle } from 'lucide-react';

export const AdminFormBuilder: React.FC = () => {
  const [fields, setFields] = useState<FormFieldConfig[]>(() => {
    const saved = localStorage.getItem('rent2go_form_fields');
    return saved ? JSON.parse(saved) : INITIAL_FORM_FIELDS;
  });

  const [toast, setToast] = useState(false);

  const toggleRequired = (id: string) => {
    setFields(prev =>
      prev.map(f => {
        if (f.id === id) {
          if (f.isCore) return f; // Core fields are permanently required
          return { ...f, isRequired: !f.isRequired };
        }
        return f;
      })
    );
  };

  const toggleVisible = (id: string) => {
    setFields(prev =>
      prev.map(f => {
        if (f.id === id) {
          if (f.isCore) return f; // Core fields cannot be hidden
          return { ...f, isVisible: !f.isVisible };
        }
        return f;
      })
    );
  };

  const updateLabel = (id: string, lang: 'en' | 'ur', val: string) => {
    setFields(prev =>
      prev.map(f => {
        if (f.id === id) {
          return { ...f, label: { ...f.label, [lang]: val } };
        }
        return f;
      })
    );
  };

  const handleSave = () => {
    localStorage.setItem('rent2go_form_fields', JSON.stringify(fields));
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0B1F3A]">Form Builder & Field Manager</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Customize Booking Request and Enquiry form fields, bilingual labels, and required flags.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#142F57] text-[#F5B301] text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save Form Rules</span>
        </button>
      </div>

      {toast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold animate-in fade-in">
          Form field configurations saved successfully!
        </div>
      )}

      {/* Rules Notice */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2.5">
        <Lock className="w-4 h-4 text-amber-700 shrink-0" />
        <span>
          <strong>Locked Core Fields:</strong> Name, Pakistani Phone, Dates, and Locations are essential for booking validity and cannot be disabled.
        </span>
      </div>

      {/* Fields List */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-[#0B1F3A] text-white uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4 text-start">Field Key</th>
                <th className="py-3 px-4 text-start">Type</th>
                <th className="py-3 px-4 text-start">English Label</th>
                <th className="py-3 px-4 text-start">Urdu Label</th>
                <th className="py-3 px-4 text-center">Required</th>
                <th className="py-3 px-4 text-center">Visible</th>
                <th className="py-3 px-4 text-center">Core</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fields.map(f => (
                <tr key={f.id} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                    {f.fieldKey}
                  </td>
                  <td className="py-3.5 px-4 uppercase text-[10px] text-slate-500 font-mono">
                    {f.fieldType}
                  </td>
                  <td className="py-3.5 px-4">
                    <input
                      type="text"
                      value={f.label.en}
                      onChange={e => updateLabel(f.id, 'en', e.target.value)}
                      className="w-full p-1.5 rounded-lg border border-slate-200 text-xs font-medium"
                    />
                  </td>
                  <td className="py-3.5 px-4">
                    <input
                      type="text"
                      value={f.label.ur}
                      onChange={e => updateLabel(f.id, 'ur', e.target.value)}
                      className="w-full p-1.5 rounded-lg border border-slate-200 text-xs font-urdu font-medium text-end"
                      dir="rtl"
                    />
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => toggleRequired(f.id)}
                      disabled={f.isCore}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        f.isRequired ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'
                      } ${f.isCore ? 'opacity-80 cursor-not-allowed' : ''}`}
                    >
                      {f.isRequired ? 'Yes' : 'No'}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => toggleVisible(f.id)}
                      disabled={f.isCore}
                      className={`p-1 rounded-md text-xs ${
                        f.isVisible ? 'text-emerald-700 bg-emerald-50' : 'text-slate-400 bg-slate-100'
                      } ${f.isCore ? 'opacity-80 cursor-not-allowed' : ''}`}
                    >
                      {f.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {f.isCore ? (
                      <span className="p-1 text-amber-600" title="Core field">
                        <Lock className="w-3.5 h-3.5 mx-auto" />
                      </span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
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
