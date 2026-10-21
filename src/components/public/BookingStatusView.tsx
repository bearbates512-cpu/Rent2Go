import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Car,
  MapPin,
  Calendar,
  MessageSquare,
  Phone,
  ShieldCheck
} from 'lucide-react';
import { Booking } from '../../types/index.ts';

export const BookingStatusView: React.FC = () => {
  const { locale, bookings, settings } = useApp();

  const [refInput, setRefInput] = useState<string>('');
  const [phoneInput, setPhoneInput] = useState<string>('');
  const [searched, setSearched] = useState<boolean>(false);
  const [foundBooking, setFoundBooking] = useState<Booking | null>(null);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);

    const cleanRef = refInput.trim().toUpperCase();
    const cleanPhone = phoneInput.replace(/\D/g, '');

    const match = bookings.find(b => {
      const bRef = b.reference.toUpperCase();
      const bPhone = b.customerPhone.replace(/\D/g, '');
      const refMatch = bRef === cleanRef || b.id === cleanRef;
      const phoneMatch = !cleanPhone || bPhone.includes(cleanPhone) || cleanPhone.includes(bPhone);
      return refMatch && phoneMatch;
    });

    setFoundBooking(match || null);
  };

  const statusColors = {
    pending: 'bg-amber-100 text-amber-800 border-amber-300',
    need_more_info: 'bg-blue-100 text-blue-800 border-blue-300',
    confirmed: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    rejected: 'bg-rose-100 text-rose-800 border-rose-300',
    cancelled: 'bg-slate-100 text-slate-700 border-slate-300',
    completed: 'bg-teal-100 text-teal-800 border-teal-300',
    no_show: 'bg-rose-100 text-rose-700 border-rose-300'
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider border border-amber-200">
            {locale === 'ur' ? 'آن لائن اسٹیٹس ٹریکر' : 'Live Status Lookup'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A]">
            {locale === 'ur' ? 'اپنی بکنگ کی موجودہ حالت معلوم کریں' : 'Track Your Rental Booking'}
          </h1>
          <p className="text-sm text-slate-500">
            {locale === 'ur'
              ? 'اپنا بکنگ ریفرنس کوڈ اور موبائل نمبر درج کر کے لائیو صورتحال دیکھیں۔'
              : 'Enter your booking reference code to check real-time availability and approval.'}
          </p>
        </div>

        {/* Lookup Form */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
          <form onSubmit={handleLookup} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                {locale === 'ur' ? 'بکنگ ریفرنس کوڈ (مثلاً R2G-7K3M9QXA)' : 'Booking Reference Code (e.g. R2G-7K3M9QXA)'} *
              </label>
              <input
                type="text"
                value={refInput}
                onChange={e => setRefInput(e.target.value)}
                placeholder="R2G-XXXXXXXX"
                className="w-full p-3.5 rounded-xl border border-slate-200 text-sm font-bold uppercase tracking-wider font-mono focus:ring-2 focus:ring-[#0B1F3A]"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                {locale === 'ur' ? 'موبائل نمبر (اختیاری تصدیق)' : 'Phone Number (Optional verification)'}
              </label>
              <input
                type="tel"
                value={phoneInput}
                onChange={e => setPhoneInput(e.target.value)}
                placeholder="0300 1234567"
                className="w-full p-3 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-[#0B1F3A]"
                dir="ltr"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#0B1F3A] hover:bg-[#142F57] text-[#F5B301] text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>{locale === 'ur' ? 'اسٹیٹس چیک کریں' : 'Lookup Booking'}</span>
            </button>
          </form>
        </div>

        {/* Result Container */}
        {searched && (
          <div>
            {foundBooking ? (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-lg space-y-6 animate-in fade-in-50">
                {/* Reference & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs text-slate-400 block font-mono">Reference</span>
                    <span className="text-2xl font-black font-mono text-[#0B1F3A]">
                      {foundBooking.reference}
                    </span>
                  </div>

                  <span
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold border uppercase tracking-wider self-start sm:self-auto ${
                      statusColors[foundBooking.status] || 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    ● {foundBooking.status.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Progress Timeline */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    {locale === 'ur' ? 'بکنگ کا مرحلہ وار احوال' : 'Booking Lifecycle Status'}
                  </span>
                  <div className="flex items-center justify-between text-xs font-semibold relative">
                    <div className="flex flex-col items-center z-10">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="mt-1 text-slate-700">{locale === 'ur' ? 'درخواست وصول' : 'Received'}</span>
                    </div>

                    <div className={`flex flex-col items-center z-10 ${foundBooking.status !== 'pending' ? 'opacity-100' : 'opacity-40'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${foundBooking.status === 'confirmed' || foundBooking.status === 'completed' ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'}`}>
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <span className="mt-1 text-slate-700">{locale === 'ur' ? 'تصدیق شدہ' : 'Confirmed'}</span>
                    </div>

                    <div className={`flex flex-col items-center z-10 ${foundBooking.status === 'completed' ? 'opacity-100' : 'opacity-40'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${foundBooking.status === 'completed' ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'}`}>
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="mt-1 text-slate-700">{locale === 'ur' ? 'سفر مکمل' : 'Completed'}</span>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-slate-400 block">{locale === 'ur' ? 'گاڑی' : 'Assigned Car'}</span>
                    <span className="font-bold text-sm text-slate-800">{foundBooking.vehicleName}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-slate-400 block">{locale === 'ur' ? 'کسٹمر کا نام' : 'Customer Name'}</span>
                    <span className="font-bold text-sm text-slate-800">{foundBooking.customerName}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-slate-400 block">{locale === 'ur' ? 'پک اپ تاریخ و وقت' : 'Pickup Date & Time'}</span>
                    <span className="font-bold text-slate-800">{foundBooking.pickupDate} ({foundBooking.pickupTime})</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-slate-400 block">{locale === 'ur' ? 'واپسی تاریخ' : 'Return Date'}</span>
                    <span className="font-bold text-slate-800">{foundBooking.returnDate} ({foundBooking.returnTime})</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 sm:col-span-2">
                    <span className="text-slate-400 block">{locale === 'ur' ? 'سفر کا راستہ' : 'Route'}</span>
                    <span className="font-bold text-slate-800">
                      {foundBooking.pickupLocation} ➔ {foundBooking.destination}
                    </span>
                  </div>
                </div>

                {/* WhatsApp Quick Direct Message */}
                <div className="pt-2">
                  <a
                    href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(`Hello Rent2Go! Checking status for my booking ${foundBooking.reference}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4 fill-white" />
                    <span>{locale === 'ur' ? 'اس بکنگ پر واٹس ایپ پر بات کریں' : 'Chat with Admin regarding this booking'}</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                <h3 className="font-bold text-slate-800">
                  {locale === 'ur' ? 'کوئی بکنگ نہیں ملی' : 'No matching booking found'}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {locale === 'ur'
                    ? 'براہِ کرم ریفرنس کوڈ چیک کریں یا ہمارے ہیلپ ڈیسک پر رابطہ کریں۔'
                    : 'Please double-check the reference code or contact our office directly on WhatsApp.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
