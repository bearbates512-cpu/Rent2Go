import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Star, CheckCircle2, EyeOff, PlusCircle, Trash2, X } from 'lucide-react';

export const AdminReviews: React.FC = () => {
  const { reviews, moderateReview, addReview } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [commentEn, setCommentEn] = useState('');
  const [commentUr, setCommentUr] = useState('');
  const [trip, setTrip] = useState('Trip in Sadiqabad');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !commentEn.trim()) return;

    addReview({
      name: name.trim(),
      rating,
      comment: {
        en: commentEn.trim(),
        ur: commentUr.trim() || commentEn.trim()
      },
      trip: {
        en: trip.trim(),
        ur: trip.trim()
      },
      source: 'Verified Customer'
    });

    setModalOpen(false);
    setName('');
    setCommentEn('');
    setCommentUr('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0B1F3A]">Reviews & Testimonials Moderation</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Only approved genuine reviews appear on the public website.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#142F57] text-[#F5B301] text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Verified Review</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map(rev => (
          <div
            key={rev.id}
            className={`bg-white rounded-3xl p-6 border-2 transition-all flex flex-col justify-between space-y-4 ${
              rev.isApproved ? 'border-slate-200/90 shadow-2xs' : 'border-dashed border-amber-300 bg-amber-50/20'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    rev.isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {rev.isApproved ? 'Published' : 'Hidden'}
                </span>
              </div>

              <p className="text-xs text-slate-700 italic leading-relaxed">
                "{rev.comment.en}"
              </p>
              {rev.comment.ur && (
                <p className="text-xs text-slate-500 font-urdu leading-relaxed">
                  "{rev.comment.ur}"
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900 block">{rev.name}</span>
                <span className="text-[10px] text-slate-400">{rev.trip.en} • {rev.date}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => moderateReview(rev.id, !rev.isApproved)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    rev.isApproved
                      ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {rev.isApproved ? 'Hide' : 'Approve'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Review Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-[#0B1F3A]">Add Verified Review</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Customer Display Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Haji Bashir Ahmad"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Star Rating (1-5)</label>
                  <select
                    value={rating}
                    onChange={e => setRating(parseInt(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value={5}>5 Stars (Excellent)</option>
                    <option value={4}>4 Stars (Good)</option>
                    <option value={3}>3 Stars (Average)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Trip Reference</label>
                  <input
                    type="text"
                    value={trip}
                    onChange={e => setTrip(e.target.value)}
                    placeholder="e.g. Wedding Fortuner Hire"
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Review Comment (English) *</label>
                <textarea
                  rows={2}
                  value={commentEn}
                  onChange={e => setCommentEn(e.target.value)}
                  placeholder="Customer feedback..."
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Review Comment (Urdu)</label>
                <textarea
                  rows={2}
                  value={commentUr}
                  onChange={e => setCommentUr(e.target.value)}
                  placeholder="اردو میں تاثرات..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-urdu"
                  dir="rtl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0B1F3A] text-white font-bold"
                >
                  Publish Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
