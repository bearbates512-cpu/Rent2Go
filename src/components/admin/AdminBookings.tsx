import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Booking, BookingStatus } from '../../types/index.ts';
import { checkVehicleAvailability } from '../../utils/availability.ts';
import { normalizePkPhone } from '../../utils/phone.ts';
import {
  Search,
  Filter,
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Phone,
  MessageSquare,
  Car,
  Calendar,
  MapPin,
  Banknote,
  History,
  X,
  ShieldCheck,
  User
} from 'lucide-react';

export const AdminBookings: React.FC = () => {
  const {
    bookings,
    vehicles,
    updateBookingStatus,
    updateBookingPayment,
    createManualBooking,
    settings
  } = useApp();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);

  // Manual booking modal state
  const [manualModalOpen, setManualModalOpen] = useState<boolean>(false);
  const [mName, setMName] = useState('');
  const [mPhone, setMPhone] = useState('');
  const [mVehicleId, setMVehicleId] = useState(vehicles[0]?.id || '');
  const [mPickupDate, setMPickupDate] = useState(new Date().toISOString().split('T')[0]);
  const [mReturnDate, setMReturnDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [mPickupLoc, setMPickupLoc] = useState('Sadiqabad');
  const [mDest, setMDest] = useState('Rahim Yar Khan');
  const [mTotal, setMTotal] = useState<number>(6000);
  const [mDeposit, setMDeposit] = useState<number>(0);
  const [mSource, setMSource] = useState<'phone' | 'whatsapp' | 'walk_in'>('phone');
  const [manualError, setManualError] = useState('');

  // Editable quote state inside detail drawer
  const [editTotal, setEditTotal] = useState<number | ''>('');
  const [editDeposit, setEditDeposit] = useState<number | ''>('');
  const [editPaymentStatus, setEditPaymentStatus] = useState<Booking['paymentStatus']>('unpaid');
  const [statusActionError, setStatusActionError] = useState<string>('');

  const filteredBookings = bookings.filter(b => {
    if (selectedStatus !== 'all' && b.status !== selectedStatus) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchRef = b.reference.toLowerCase().includes(q);
      const matchName = b.customerName.toLowerCase().includes(q);
      const matchPhone = b.customerPhone.toLowerCase().includes(q);
      const matchCar = b.vehicleName.toLowerCase().includes(q);
      return matchRef || matchName || matchPhone || matchCar;
    }
    return true;
  });

  const openDetailDrawer = (b: Booking) => {
    setActiveBooking(b);
    setEditTotal(b.confirmedTotal ?? b.estimate?.estimatedTotal ?? '');
    setEditDeposit(b.depositAmount ?? '');
    setEditPaymentStatus(b.paymentStatus || 'unpaid');
    setStatusActionError('');
  };

  const handleStatusChange = (newStatus: BookingStatus, reason?: string) => {
    if (!activeBooking) return;
    setStatusActionError('');

    const res = updateBookingStatus(activeBooking.id, newStatus, reason);
    if (!res.success) {
      setStatusActionError(res.error || 'Conflict detected! Could not update status.');
    } else {
      // Refresh current active booking
      const updated = bookings.find(item => item.id === activeBooking.id);
      if (updated) {
        setActiveBooking({ ...updated, status: newStatus });
      }
    }
  };

  const handleSavePaymentDetails = () => {
    if (!activeBooking) return;
    updateBookingPayment(activeBooking.id, {
      confirmedTotal: editTotal === '' ? undefined : Number(editTotal),
      depositAmount: editDeposit === '' ? 0 : Number(editDeposit),
      paymentStatus: editPaymentStatus
    });
    alert('Payment details and agreed quote updated successfully!');
  };

  // Check potential conflict for active booking vehicle
  const currentVehicle = vehicles.find(v => v.id === activeBooking?.vehicleId);
  const conflictCheck =
    activeBooking && currentVehicle
      ? checkVehicleAvailability(
          currentVehicle,
          bookings,
          `${activeBooking.pickupDate}T${activeBooking.pickupTime || '09:00'}:00Z`,
          `${activeBooking.returnDate}T${activeBooking.returnTime || '09:00'}:00Z`,
          activeBooking.id
        )
      : { isAvailable: true };

  const handleCreateManualBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setManualError('');

    if (!mName.trim()) {
      setManualError('Customer name is required');
      return;
    }

    const norm = normalizePkPhone(mPhone);
    if (!norm.isValid) {
      setManualError(norm.error || 'Valid phone number required');
      return;
    }

    const targetVeh = vehicles.find(v => v.id === mVehicleId);

    const res = createManualBooking({
      customerName: mName.trim(),
      customerPhone: norm.formatted,
      vehicleId: mVehicleId,
      vehicleName: targetVeh ? `${targetVeh.make} ${targetVeh.model}` : 'Vehicle',
      pickupDate: mPickupDate,
      pickupTime: '10:00',
      returnDate: mReturnDate,
      returnTime: '18:00',
      pickupLocation: mPickupLoc,
      destination: mDest,
      passengers: 3,
      confirmedTotal: mTotal,
      depositAmount: mDeposit,
      paymentStatus: mDeposit > 0 ? 'deposit_received' : 'unpaid',
      status: 'confirmed',
      source: mSource
    });

    if (res.success) {
      setManualModalOpen(false);
      setMName('');
      setMPhone('');
    } else {
      setManualError(res.error || 'Failed to create booking');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0B1F3A]">Bookings Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Process requests, verify calendar conflicts, freeze final quotes, and track trip status.
          </p>
        </div>

        <button
          onClick={() => {
            setManualModalOpen(true);
            setManualError('');
          }}
          className="px-4 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#142F57] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-[#F5B301]" />
          <span>New Manual Booking</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
            {[
              { id: 'all', label: 'All' },
              { id: 'pending', label: 'Pending' },
              { id: 'confirmed', label: 'Confirmed' },
              { id: 'completed', label: 'Completed' },
              { id: 'cancelled', label: 'Cancelled' },
              { id: 'need_more_info', label: 'Need Info' }
            ].map(tab => {
              const count = tab.id === 'all' ? bookings.length : bookings.filter(b => b.status === tab.id).length;
              const isSelected = selectedStatus === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedStatus(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#0B1F3A] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search ref, customer, car..."
              className="w-full ps-9 pe-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#0B1F3A]"
            />
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-[#0B1F3A] text-white uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-4 text-start">Ref & Date</th>
                <th className="py-3.5 px-4 text-start">Customer Details</th>
                <th className="py-3.5 px-4 text-start">Vehicle</th>
                <th className="py-3.5 px-4 text-start">Trip Window</th>
                <th className="py-3.5 px-4 text-start">Quote (PKR)</th>
                <th className="py-3.5 px-4 text-start">Status</th>
                <th className="py-3.5 px-4 text-end">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.map(b => (
                <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono">
                    <span className="font-bold text-slate-800 block">{b.reference}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-800 block">{b.customerName}</span>
                    <span className="text-[11px] text-slate-500 font-mono block">{b.customerPhone}</span>
                    <span className="text-[10px] text-slate-400 capitalize">Source: {b.source}</span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{b.vehicleName}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block capitalize">{b.rentalType.replace(/_/g, ' ')} • {b.driverOption}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    <span className="font-medium block">{b.pickupDate} ➔ {b.returnDate}</span>
                    <span className="text-[11px] text-slate-400 block truncate max-w-xs">{b.destination}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <span className="font-bold text-[#0B1F3A] block">
                      {b.confirmedTotal ? `Rs. ${b.confirmedTotal.toLocaleString()}` : b.estimate?.estimatedTotal ? `Rs. ${b.estimate.estimatedTotal.toLocaleString()} (Est)` : 'Contact'}
                    </span>
                    <span className="text-[10px] text-slate-500 capitalize">{b.paymentStatus}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block ${
                        b.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : b.status === 'completed'
                          ? 'bg-teal-100 text-teal-800'
                          : b.status === 'rejected' || b.status === 'cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {b.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-end">
                    <button
                      onClick={() => openDetailDrawer(b)}
                      className="px-3 py-1.5 rounded-lg bg-[#0B1F3A] hover:bg-[#142F57] text-white text-xs font-bold transition-colors"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}

              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No bookings found in this view.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL / DRAWER */}
      {activeBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Booking Details</span>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xl font-black font-mono text-[#0B1F3A]">{activeBooking.reference}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                    {activeBooking.status}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveBooking(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conflict Detection Indicator (Per PRD B4 & Schema Section 8) */}
            {!conflictCheck.isAvailable ? (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">DOUBLE-BOOKING CONFLICT WARNING:</strong>
                  <span>{conflictCheck.reason}</span>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Vehicle is available with NO calendar conflicts for this period.</span>
              </div>
            )}

            {statusActionError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
                {statusActionError}
              </div>
            )}

            {/* Trip Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 block font-semibold">Customer</span>
                <span className="font-bold text-sm text-slate-800 block">{activeBooking.customerName}</span>
                <div className="flex items-center gap-3 pt-1">
                  <a
                    href={`tel:${activeBooking.customerPhone}`}
                    className="flex items-center gap-1 text-blue-600 hover:underline font-mono"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{activeBooking.customerPhone}</span>
                  </a>
                  <a
                    href={`https://wa.me/${activeBooking.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Assalam-o-Alaikum ${activeBooking.customerName}! Regarding your Rent2Go booking ${activeBooking.reference}...`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-emerald-600 hover:underline"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 block font-semibold">Assigned Vehicle</span>
                <span className="font-bold text-sm text-slate-800 block">{activeBooking.vehicleName}</span>
                <span className="text-slate-500 block">Driver Option: {activeBooking.driverOption}</span>
                <span className="text-slate-500 block">Passengers: {activeBooking.passengers}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 block font-semibold">Pickup Time & Location</span>
                <span className="font-bold text-slate-800 block">{activeBooking.pickupDate} at {activeBooking.pickupTime}</span>
                <span className="text-slate-600 block">{activeBooking.pickupLocation}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 block font-semibold">Return Time & Destination</span>
                <span className="font-bold text-slate-800 block">{activeBooking.returnDate} at {activeBooking.returnTime}</span>
                <span className="text-slate-600 block">{activeBooking.destination}</span>
              </div>
            </div>

            {activeBooking.customerNotes && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <span className="text-slate-400 block font-semibold mb-0.5">Customer Special Requests:</span>
                <p className="text-slate-700 italic">"{activeBooking.customerNotes}"</p>
              </div>
            )}

            {/* Editable Quote and Payment Box */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Agreed Quote & Payment Management
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Final Agreed Total (PKR)</label>
                  <input
                    type="number"
                    value={editTotal}
                    onChange={e => setEditTotal(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 15000"
                    className="w-full p-2.5 rounded-lg border border-slate-200 text-xs font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Deposit Received (PKR)</label>
                  <input
                    type="number"
                    value={editDeposit}
                    onChange={e => setEditDeposit(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 5000"
                    className="w-full p-2.5 rounded-lg border border-slate-200 text-xs font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Payment Status</label>
                  <select
                    value={editPaymentStatus}
                    onChange={e => setEditPaymentStatus(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 text-xs font-bold"
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="deposit_requested">Deposit Requested</option>
                    <option value="deposit_received">Deposit Received</option>
                    <option value="paid">Fully Paid</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div className="text-end">
                <button
                  type="button"
                  onClick={handleSavePaymentDetails}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-white text-xs font-bold hover:bg-slate-900 transition-colors"
                >
                  Save Agreed Quote & Payment
                </button>
              </div>
            </div>

            {/* Lifecycle Status Action Buttons */}
            <div className="border-t border-slate-100 pt-4 space-y-2">
              <span className="text-xs font-bold text-slate-700 block mb-2">Change Booking Status:</span>
              <div className="flex flex-wrap gap-2">
                {activeBooking.status !== 'confirmed' && (
                  <button
                    onClick={() => handleStatusChange('confirmed')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Booking</span>
                  </button>
                )}

                {activeBooking.status !== 'need_more_info' && (
                  <button
                    onClick={() => handleStatusChange('need_more_info', 'Asked customer for CNIC and exact timings')}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
                  >
                    Need More Info
                  </button>
                )}

                {activeBooking.status !== 'completed' && activeBooking.status === 'confirmed' && (
                  <button
                    onClick={() => handleStatusChange('completed', 'Trip completed successfully')}
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors"
                  >
                    Mark Completed
                  </button>
                )}

                {activeBooking.status !== 'cancelled' && (
                  <button
                    onClick={() => {
                      const reason = prompt('Please enter cancellation reason:', 'Customer requested cancellation');
                      if (reason) handleStatusChange('cancelled', reason);
                    }}
                    className="px-4 py-2 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>

            {/* History timeline */}
            {activeBooking.statusHistory && activeBooking.statusHistory.length > 0 && (
              <div className="border-t border-slate-100 pt-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Status Audit Trail</span>
                <div className="space-y-1.5 text-xs text-slate-600">
                  {activeBooking.statusHistory.map((h, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-800 uppercase text-[10px]">{h.toStatus}</span>
                      <span>by {h.changedBy}</span>
                      <span className="text-slate-400 text-[10px]">({new Date(h.changedAt).toLocaleString()})</span>
                      {h.reason && <span className="text-slate-500 italic">"{h.reason}"</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* NEW MANUAL BOOKING MODAL */}
      {manualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-[#0B1F3A]">Create Manual Booking (Phone / Walk-in)</h2>
              <button
                onClick={() => setManualModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {manualError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
                {manualError}
              </div>
            )}

            <form onSubmit={handleCreateManualBooking} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  value={mName}
                  onChange={e => setMName(e.target.value)}
                  placeholder="e.g. Asad Ullah"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mobile Number (Pakistan) *</label>
                <input
                  type="tel"
                  value={mPhone}
                  onChange={e => setMPhone(e.target.value)}
                  placeholder="0300 1234567"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium font-mono"
                  dir="ltr"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Vehicle *</label>
                  <select
                    value={mVehicleId}
                    onChange={e => setMVehicleId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                  >
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.make} {v.model} ({v.modelYear})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Source</label>
                  <select
                    value={mSource}
                    onChange={e => setMSource(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                  >
                    <option value="phone">Direct Phone Call</option>
                    <option value="whatsapp">WhatsApp Inquiry</option>
                    <option value="walk_in">Office Walk-in</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Pickup Date</label>
                  <input
                    type="date"
                    value={mPickupDate}
                    onChange={e => setMPickupDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Return Date</label>
                  <input
                    type="date"
                    value={mReturnDate}
                    onChange={e => setMReturnDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Pickup Location</label>
                  <input
                    type="text"
                    value={mPickupLoc}
                    onChange={e => setMPickupLoc(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Destination</label>
                  <input
                    type="text"
                    value={mDest}
                    onChange={e => setMDest(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Agreed Fare (PKR)</label>
                  <input
                    type="number"
                    value={mTotal}
                    onChange={e => setMTotal(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Deposit (PKR)</label>
                  <input
                    type="number"
                    value={mDeposit}
                    onChange={e => setMDeposit(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setManualModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0B1F3A] hover:bg-[#142F57] text-[#F5B301] font-bold shadow-sm"
                >
                  Create & Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
