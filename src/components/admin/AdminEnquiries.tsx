import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { MessageSquare, Phone, CheckCircle2, ArrowRight, User, Calendar, Trash2 } from 'lucide-react';

export const AdminEnquiries: React.FC = () => {
  const { enquiries, convertEnquiryToBooking, setCurrentView } = useApp();
  const [filter, setFilter] = useState<string>('all');

  const filtered = enquiries.filter(e => {
    if (filter === 'all') return true;
    return e.status === filter;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-[#0B1F3A]">Customer Enquiries & Inbox</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Inquiries submitted via contact form or direct website leads.
        </p>
      </div>

      <div className="flex gap-2">
        {['all', 'new', 'contacted', 'converted'].map(st => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
              filter === st
                ? 'bg-[#0B1F3A] text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {st} ({st === 'all' ? enquiries.length : enquiries.filter(e => e.status === st).length})
          </button>
        ))}
      </div>

      <div className="space-y-3.5">
        {filtered.map(enq => (
          <div
            key={enq.id}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-3 hover:shadow-xs transition-shadow"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{enq.name}</h3>
                  <span className="text-xs font-mono text-slate-500">{enq.phone}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    enq.status === 'new'
                      ? 'bg-amber-100 text-amber-800'
                      : enq.status === 'converted'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {enq.status}
                </span>
                <span className="text-[11px] text-slate-400">
                  {new Date(enq.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-700 space-y-1">
              {enq.service && (
                <span className="text-xs font-semibold text-[#0B1F3A] block">
                  Service of Interest: {enq.service}
                </span>
              )}
              <p className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-700 leading-relaxed">
                "{enq.message}"
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-3">
                <a
                  href={`tel:${enq.phone}`}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  <span>Call Customer</span>
                </a>
                <a
                  href={`https://wa.me/${enq.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Assalam-o-Alaikum ${enq.name}! Regarding your inquiry with Rent2Go Sadiqabad...`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                  <span>Reply on WhatsApp</span>
                </a>
              </div>

              {enq.status !== 'converted' && (
                <button
                  onClick={() => convertEnquiryToBooking(enq.id)}
                  className="px-4 py-1.5 rounded-xl bg-[#0B1F3A] hover:bg-[#142F57] text-[#F5B301] text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Convert to Booking</span>
                </button>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="p-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
            No enquiries in this status.
          </div>
        )}
      </div>
    </div>
  );
};
