import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Booking, BookingStatus } from '../../types/index.ts';
import { checkVehicleAvailability } from '../../utils/availability.ts';
import { normalizePkPhone } from '../../utils/phone.ts';
import { calculateRentalBilling, getDefaultHourlyOvertimeRate, OvertimeCalculation } from '../../utils/rentalBilling.ts';
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
  User,
  Printer,
  Send,
  Timer,
  Wallet,
  ArrowRight,
  Check,
  RotateCcw
} from 'lucide-react';
import { RentalAgreementModal } from './RentalAgreementModal.tsx';

export const AdminBookings: React.FC = () => {
  const {
    bookings,
    vehicles,
    updateBookingStatus,
    updateBookingPayment,
    createManualBooking,
    settings,
    locale
  } = useApp();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);

  // Settlement Desk State
  const [settleBooking, setSettleBooking] = useState<Booking | null>(null);
  const [customHourlyRate, setCustomHourlyRate] = useState<number | ''>('');
  const [customOvertimeAmt, setCustomOvertimeAmt] = useState<number | ''>('');
  const [actualReturnInput, setActualReturnInput] = useState<string>('');
  const [paidUpdateInput, setPaidUpdateInput] = useState<number | ''>('');
  const [settlementSuccessMsg, setSettlementSuccessMsg] = useState<string>('');

  // Manual booking modal state
  const [manualModalOpen, setManualModalOpen] = useState<boolean>(false);
  const [mName, setMName] = useState('');
  const [mPhone, setMPhone] = useState('');
  const [mVehicleId, setMVehicleId] = useState(vehicles[0]?.id || '');
  const [mPickupDate, setMPickupDate] = useState(new Date().toISOString().split('T')[0]);
  const [mPickupTime, setMPickupTime] = useState('09:00');
  const [mReturnDate, setMReturnDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [mReturnTime, setMReturnTime] = useState('18:00');
  const [mPickupLoc, setMPickupLoc] = useState('Main KLP Road Hub, Sadiqabad');
  const [mDest, setMDest] = useState('Rahim Yar Khan');
  const [mTotal, setMTotal] = useState<number>(6000);
  const [mDeposit, setMDeposit] = useState<number>(2000);
  const [mSource, setMSource] = useState<'phone' | 'whatsapp' | 'walk_in'>('phone');
  const [mDriverOption, setMDriverOption] = useState<'with_driver' | 'self_drive'>('with_driver');
  const [manualError, setManualError] = useState('');

  // Agreement Modal State
  const [agreementBooking, setAgreementBooking] = useState<Booking | null>(null);

  // Standard details drawer state
  const [editTotal, setEditTotal] = useState<number | ''>('');
  const [editDeposit, setEditDeposit] = useState<number | ''>('');
  const [editPaymentStatus, setEditPaymentStatus] = useState<Booking['paymentStatus']>('unpaid');
  const [statusActionError, setStatusActionError] = useState<string>('');

  // Helper to compute billing for any booking
  const getBookingBilling = (b: Booking): OvertimeCalculation => {
    const veh = vehicles.find(v => v.id === b.vehicleId);
    return calculateRentalBilling({
      pickupDate: b.pickupDate,
      pickupTime: b.pickupTime,
      returnDate: b.returnDate,
      returnTime: b.returnTime,
      confirmedTotal: b.confirmedTotal,
      estimatedTotal: b.estimate?.estimatedTotal,
      depositAmount: b.depositAmount,
      totalPaidAmount: b.totalPaidAmount,
      dailyRate: veh?.dailyRatePKR,
      overtimeHourlyRate: b.overtimeHourlyRate,
      customOvertimeCharges: b.overtimeCharges,
      actualReturnedAt: b.actualReturnedAt,
      tripStatus: b.tripStatus,
      status: b.status
    });
  };

  // Top level operational metrics
  const activeTripsList = bookings.filter(b => b.tripStatus === 'on_trip' || (b.status === 'confirmed' && !b.actualReturnedAt && b.tripStatus !== 'returned'));
  const overdueTripsList = bookings.filter(b => {
    const bill = getBookingBilling(b);
    return bill.isOverdue;
  });

  const totalAdvanceCollected = bookings.reduce((sum, b) => {
    const bill = getBookingBilling(b);
    return sum + bill.paidAmount;
  }, 0);

  const totalOutstandingToCollect = bookings
    .filter(b => b.status === 'confirmed' || b.tripStatus === 'on_trip')
    .reduce((sum, b) => {
      const bill = getBookingBilling(b);
      return sum + bill.finalRemainingDue;
    }, 0);

  // Open Settle Desk
  const openSettlementDesk = (b: Booking) => {
    setSettleBooking(b);
    const bill = getBookingBilling(b);
    setCustomHourlyRate(b.overtimeHourlyRate || bill.hourlyRate);
    setCustomOvertimeAmt(b.overtimeCharges ?? bill.overtimeCharges);
    setPaidUpdateInput(bill.paidAmount);
    setActualReturnInput(
      b.actualReturnedAt
        ? new Date(b.actualReturnedAt).toISOString().slice(0, 16)
        : new Date().toISOString().slice(0, 16)
    );
    setSettlementSuccessMsg('');
  };

  const handleSaveSettlement = (markReturned: boolean = false) => {
    if (!settleBooking) return;
    const hourly = customHourlyRate === '' ? undefined : Number(customHourlyRate);
    const overtimeChg = customOvertimeAmt === '' ? undefined : Number(customOvertimeAmt);
    const paid = paidUpdateInput === '' ? 0 : Number(paidUpdateInput);

    const baseTotal = settleBooking.confirmedTotal ?? settleBooking.estimate?.estimatedTotal ?? 0;
    const finalBill = baseTotal + (overtimeChg || 0);
    const remaining = Math.max(0, finalBill - paid);

    const updatePayload: any = {
      overtimeHourlyRate: hourly,
      overtimeCharges: overtimeChg,
      totalPaidAmount: paid,
      depositAmount: paid,
      remainingBalance: remaining,
      paymentStatus: remaining === 0 ? 'paid' : paid > 0 ? 'deposit_received' : 'unpaid'
    };

    if (markReturned) {
      updatePayload.tripStatus = 'returned';
      updatePayload.actualReturnedAt = actualReturnInput ? new Date(actualReturnInput).toISOString() : new Date().toISOString();
      updateBookingStatus(settleBooking.id, 'completed', 'Vehicle returned and settlement finalized at Return Desk');
    }

    updateBookingPayment(settleBooking.id, updatePayload);

    // Update active state
    const refreshed = { ...settleBooking, ...updatePayload };
    setSettleBooking(refreshed);
    setSettlementSuccessMsg(markReturned ? 'Vehicle marked as RETURNED and balance settled successfully!' : 'Settlement & overtime details updated successfully!');
    setTimeout(() => setSettlementSuccessMsg(''), 4000);
  };

  const handleDispatchTrip = (bookingId: string) => {
    const now = new Date().toISOString();
    updateBookingPayment(bookingId, {
      tripStatus: 'on_trip',
      dispatchedAt: now
    });
    updateBookingStatus(bookingId, 'confirmed', 'Dispatched on active trip');
    if (activeBooking && activeBooking.id === bookingId) {
      setActiveBooking({ ...activeBooking, tripStatus: 'on_trip', dispatchedAt: now });
    }
    if (settleBooking && settleBooking.id === bookingId) {
      setSettleBooking({ ...settleBooking, tripStatus: 'on_trip', dispatchedAt: now });
    }
  };

  const handleSendSettlementWhatsApp = (b: Booking) => {
    const bill = getBookingBilling(b);
    const cleanDigits = b.customerPhone.replace(/\D/g, '');
    let target = cleanDigits;
    if (target.startsWith('0')) target = '92' + target.slice(1);
    else if (!target.startsWith('92')) target = '92' + target;

    const text = encodeURIComponent(
      `*Rent2Go Rent-a-Car Sadiqabad - Trip Settlement & Bill Statement*\n` +
      `Assalam-o-Alaikum ${b.customerName}!\n\n` +
      `Aapki car rental booking ki mukammal tafseel aur hisaab yeh hai:\n` +
      `📋 *Booking Reference:* ${b.reference}\n` +
      `🚗 *Vehicle:* ${b.vehicleName}\n` +
      `🛫 *Car Departure / Pickup:* ${b.pickupDate} (${b.pickupTime || '09:00'})\n` +
      `🛬 *Scheduled Return:* ${b.returnDate} (${b.returnTime || '18:00'})\n` +
      (b.actualReturnedAt ? `⏱️ *Actual Return:* ${new Date(b.actualReturnedAt).toLocaleString()}\n` : '') +
      (bill.overdueHours > 0 || bill.overdueMinutes > 0
        ? `⚠️ *Overtime Time:* ${bill.overdueHours} Hours ${bill.overdueMinutes} Mins\n` +
          `⚡ *Overtime Charges:* ${bill.chargeableHours} hrs @ PKR ${bill.hourlyRate}/hr = PKR ${bill.overtimeCharges.toLocaleString()}\n`
        : `⏱️ *Schedule:* Within regular booked time (No Overtime)\n`) +
      `💰 *Agreed Base Rent:* PKR ${bill.baseTotal.toLocaleString()}\n` +
      (bill.overtimeCharges > 0 ? `➕ *Overtime Amount:* PKR ${bill.overtimeCharges.toLocaleString()}\n` : '') +
      `🧾 *Total Final Bill:* PKR ${bill.finalTotalAmount.toLocaleString()}\n` +
      `💵 *Advance / Payment Paid:* PKR ${bill.paidAmount.toLocaleString()}\n` +
      `🔴 *Remaining Balance (باقی رقم):* PKR ${bill.finalRemainingDue.toLocaleString()}\n\n` +
      `Status: ${b.tripStatus === 'returned' || b.status === 'completed' ? 'Car Returned & Cleared' : 'Active / In Progress'}\n` +
      `Kisi bhi sawal ke liye rabta karein:\n` +
      `📞 Helpline: ${settings.phoneFormatted}\n` +
      `Shukriya!`
    );
    window.open(`https://wa.me/${target}?text=${text}`, '_blank');
  };

  const filteredBookings = bookings.filter(b => {
    if (selectedFilter === 'on_trip') {
      if (b.tripStatus !== 'on_trip' && (b.status !== 'confirmed' || b.actualReturnedAt || b.tripStatus === 'returned')) return false;
    } else if (selectedFilter === 'overdue') {
      const bill = getBookingBilling(b);
      if (!bill.isOverdue) return false;
    } else if (selectedFilter !== 'all') {
      if (b.status !== selectedFilter) return false;
    }

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
      const updated = bookings.find(item => item.id === activeBooking.id);
      if (updated) {
        setActiveBooking({ ...updated, status: newStatus });
      }
    }
  };

  const handleCreateManual = (e: React.FormEvent) => {
    e.preventDefault();
    setManualError('');

    if (!mName.trim()) {
      setManualError('Please provide customer name');
      return;
    }

    const norm = normalizePkPhone(mPhone);
    if (!norm.isValid) {
      setManualError(norm.error || 'Please enter valid phone number');
      return;
    }

    const selVeh = vehicles.find(v => v.id === mVehicleId);
    if (!selVeh) {
      setManualError('Please select a valid vehicle');
      return;
    }

    const res = createManualBooking({
      customerName: mName.trim(),
      customerPhone: norm.formatted,
      vehicleId: selVeh.id,
      vehicleName: `${selVeh.make} ${selVeh.model}`,
      rentalType: 'daily',
      driverOption: mDriverOption,
      pickupDate: mPickupDate,
      pickupTime: mPickupTime,
      returnDate: mReturnDate,
      returnTime: mReturnTime,
      pickupLocation: mPickupLoc,
      destination: mDest,
      passengers: 4,
      confirmedTotal: mTotal,
      depositAmount: mDeposit,
      totalPaidAmount: mDeposit,
      remainingBalance: Math.max(0, mTotal - mDeposit),
      paymentStatus: mDeposit >= mTotal ? 'paid' : mDeposit > 0 ? 'deposit_received' : 'unpaid',
      tripStatus: 'scheduled',
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
      {/* Title & Quick Add */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0B1F3A]">
            Fleet Bookings, Overtime & Client Accounts
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            ریئل ٹائم کرایہ ٹریکر: گاڑی کب گئی، کب واپس آئی، کتنا ٹائم اوپر ہوا، گھنٹے کے حساب سے چارجز اور بقایا رقم۔
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

      {/* Real-time Fleet Trip & Balance Operational Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* On-Trip */}
        <div
          onClick={() => setSelectedFilter('on_trip')}
          className="bg-white rounded-2xl p-4 border border-blue-200/90 shadow-2xs cursor-pointer hover:border-blue-400 transition-all space-y-1.5"
        >
          <div className="flex items-center justify-between text-xs font-bold text-blue-900">
            <span>Cars Out On Rent (کرائے پر روانہ)</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-blue-950 font-mono">
              {activeTripsList.length}
            </span>
            <span className="text-[11px] text-blue-700 font-semibold">active on road</span>
          </div>
          <span className="text-[10px] text-slate-500 block">Currently dispatched with clients</span>
        </div>

        {/* Overdue Alert */}
        <div
          onClick={() => setSelectedFilter('overdue')}
          className={`bg-white rounded-2xl p-4 border shadow-2xs cursor-pointer transition-all space-y-1.5 ${
            overdueTripsList.length > 0
              ? 'border-rose-300 bg-rose-50/40 hover:border-rose-500'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-rose-800">
            <span>Overdue Trips (وقت اوپر ہو گیا)</span>
            <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <Timer className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-rose-950 font-mono">
              {overdueTripsList.length}
            </span>
            <span className="text-[11px] text-rose-700 font-semibold">exceeded booking</span>
          </div>
          <span className="text-[10px] text-rose-600 font-bold block">
            {overdueTripsList.length > 0 ? '⚠️ Accruing hourly overtime charges' : 'All returns on schedule'}
          </span>
        </div>

        {/* Collected Advance */}
        <div className="bg-white rounded-2xl p-4 border border-emerald-200/90 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
            <span>Total Payments Received (موصولہ رقم)</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[11px] text-emerald-700 font-bold">PKR</span>
            <span className="text-2xl font-black text-[#0B1F3A] font-mono">
              {totalAdvanceCollected.toLocaleString()}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 block">Deposits & cleared payments</span>
        </div>

        {/* Outstanding Balance */}
        <div className="bg-white rounded-2xl p-4 border border-amber-200/90 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-amber-800">
            <span>Outstanding Balance Due (کل بقایا رقم)</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[11px] text-amber-700 font-bold">PKR</span>
            <span className="text-2xl font-black text-amber-950 font-mono">
              {totalOutstandingToCollect.toLocaleString()}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 block">Remaining to collect on car return</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
            {[
              { id: 'all', label: 'All Bookings' },
              { id: 'on_trip', label: '🚗 On Trip (سفر پر ہے)' },
              { id: 'overdue', label: '⚠️ Overdue (وقت اوپر ہوا)' },
              { id: 'pending', label: 'Pending' },
              { id: 'confirmed', label: 'Confirmed' },
              { id: 'completed', label: 'Returned / Settled' }
            ].map(tab => {
              const isSelected = selectedFilter === tab.id;
              let count = bookings.length;
              if (tab.id === 'on_trip') count = activeTripsList.length;
              else if (tab.id === 'overdue') count = overdueTripsList.length;
              else if (tab.id !== 'all') count = bookings.filter(b => b.status === tab.id).length;

              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[#0B1F3A] text-white shadow-xs'
                      : tab.id === 'overdue' && overdueTripsList.length > 0
                      ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : tab.id === 'overdue' && overdueTripsList.length > 0
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
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
              placeholder="Search ref, customer, phone, car..."
              className="w-full ps-9 pe-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#0B1F3A]"
            />
          </div>
        </div>
      </div>

      {/* Bookings Table with Detailed Overtime and Payment Tracking */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-[#0B1F3A] text-white uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-4 text-start">Ref & Customer</th>
                <th className="py-3.5 px-4 text-start">Assigned Car</th>
                <th className="py-3.5 px-4 text-start">Departure & Return Schedule (روانگی و واپسی)</th>
                <th className="py-3.5 px-4 text-start">Live Trip Status & Overtime (گاڑی کا وقت)</th>
                <th className="py-3.5 px-4 text-start">Payment Breakdown (رقم و بقایا)</th>
                <th className="py-3.5 px-4 text-end">Action & Settlement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.map(b => {
                const bill = getBookingBilling(b);

                return (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Ref & Customer */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800 block text-xs">{b.customerName}</span>
                      <a
                        href={`https://wa.me/${b.customerPhone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-blue-600 font-mono hover:underline block"
                      >
                        {b.customerPhone}
                      </a>
                      <span className="font-mono text-[10px] text-slate-400 block mt-0.5">{b.reference}</span>
                    </td>

                    {/* Assigned Car */}
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Car className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-bold">{b.vehicleName}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 block capitalize">
                        {b.rentalType.replace(/_/g, ' ')} • {b.driverOption === 'with_driver' ? 'With Driver' : 'Self Drive'}
                      </span>
                    </td>

                    {/* Departure & Return Schedule */}
                    <td className="py-3.5 px-4 text-slate-700">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                          <span className="text-[10px] font-bold text-blue-700 uppercase">Out:</span>
                          <span>{b.pickupDate} ({b.pickupTime || '09:00'})</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                          <span className="text-[10px] font-bold text-emerald-700 uppercase">Due:</span>
                          <span>{b.returnDate} ({b.returnTime || '18:00'})</span>
                        </div>
                        {b.actualReturnedAt && (
                          <span className="text-[10px] text-slate-400 block">
                            Returned: {new Date(b.actualReturnedAt).toLocaleDateString()} {new Date(b.actualReturnedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Live Trip Status & Overtime Hours */}
                    <td className="py-3.5 px-4">
                      {bill.isOverdue ? (
                        <div className="space-y-1">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 inline-flex items-center gap-1 animate-pulse">
                            <Timer className="w-3 h-3" />
                            <span>⚠️ {bill.overdueHours}h {bill.overdueMinutes}m Overdue</span>
                          </span>
                          <span className="text-[10px] font-mono text-rose-700 block font-bold">
                            Extra: +Rs. {bill.overtimeCharges.toLocaleString()} ({bill.chargeableHours}h @ {bill.hourlyRate}/h)
                          </span>
                        </div>
                      ) : b.tripStatus === 'returned' || b.status === 'completed' ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Returned & Cleared</span>
                        </span>
                      ) : b.tripStatus === 'on_trip' ? (
                        <div className="space-y-0.5">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 inline-flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                            <span>Active On Road (Rent pe hai)</span>
                          </span>
                          <span className="text-[10px] text-slate-400 block">Within booked return time</span>
                        </div>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 inline-block">
                          📅 Scheduled Trip
                        </span>
                      )}
                    </td>

                    {/* Payment Breakdown (Paid vs Remaining) */}
                    <td className="py-3.5 px-4 font-mono">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1 text-[11px]">
                          <span className="text-slate-400 font-sans text-[10px]">Agreed Total:</span>
                          <span className="font-bold text-slate-800">Rs. {bill.baseTotal.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-emerald-700">
                          <span className="text-slate-400 font-sans text-[10px]">Paid / Advance:</span>
                          <span className="font-bold">Rs. {bill.paidAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px]">
                          <span className="text-slate-500 font-sans text-[10px] font-bold">Remaining Due:</span>
                          <span className={`font-black ${bill.finalRemainingDue > 0 ? 'text-amber-700' : 'text-slate-500'}`}>
                            Rs. {bill.finalRemainingDue.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-end">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Open Return & Billing Settlement Desk */}
                        <button
                          onClick={() => openSettlementDesk(b)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#0B1F3A] hover:bg-[#142F57] text-[#F5B301] text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                          title="Open Return & Payment Settlement Desk"
                        >
                          <Wallet className="w-3 h-3" />
                          <span>حساب و واپسی</span>
                        </button>

                        <button
                          onClick={() => openDetailDrawer(b)}
                          className="px-2 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold"
                          title="Manage Details"
                        >
                          Details
                        </button>

                        <button
                          onClick={() => setAgreementBooking(b)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-[#0B1F3A] transition-colors"
                          title="Print Rental Agreement & Voucher"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleSendSettlementWhatsApp(b)}
                          className="p-1.5 rounded-lg border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                          title="Send WhatsApp Bill Receipt"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No bookings found matching current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RETURN & BILLING SETTLEMENT DESK MODAL (گاڑی واپسی و فائنل حساب کتاب ڈیسک) */}
      {settleBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
                  Return Desk & Overtime Billing
                </span>
                <h2 className="text-xl font-black text-[#0B1F3A] flex items-center gap-2 mt-0.5">
                  <span>گاڑی واپسی اور فائنل حساب کتاب</span>
                  <span className="text-sm font-mono text-slate-500 font-normal">({settleBooking.reference})</span>
                </h2>
              </div>

              <button
                onClick={() => setSettleBooking(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {settlementSuccessMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{settlementSuccessMsg}</span>
              </div>
            )}

            {/* Client & Car Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 block font-bold text-[10px] uppercase">Customer Information</span>
                <span className="font-bold text-slate-900 text-sm block">{settleBooking.customerName}</span>
                <span className="font-mono text-slate-600 block">{settleBooking.customerPhone}</span>
                <span className="text-slate-500 block">Route: {settleBooking.pickupLocation} ➔ {settleBooking.destination}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 block font-bold text-[10px] uppercase">Assigned Vehicle</span>
                <span className="font-bold text-slate-900 text-sm block">{settleBooking.vehicleName}</span>
                <span className="text-slate-600 block capitalize">
                  Driver: {settleBooking.driverOption.replace('_', ' ')} • Passengers: {settleBooking.passengers}
                </span>
                <div className="pt-1 flex items-center gap-2">
                  <span className="text-[10px] text-slate-500">Trip Status:</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
                    {settleBooking.tripStatus || 'scheduled'}
                  </span>
                </div>
              </div>
            </div>

            {/* Trip Timings (روانگی و واپسی کا وقت) */}
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-3 text-xs">
              <span className="font-bold text-blue-950 uppercase text-[10px] tracking-wider block">
                Trip Timings (روانگی و متوقع واپسی کا وقت)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                <div className="p-2.5 rounded-xl bg-white border border-blue-200">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">1. Departure (روانگی)</span>
                  <span className="font-bold text-slate-900 block mt-0.5">{settleBooking.pickupDate}</span>
                  <span className="text-slate-600 text-[11px] block">{settleBooking.pickupTime || '09:00 AM'}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-blue-200">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">2. Scheduled Return (واپسی)</span>
                  <span className="font-bold text-slate-900 block mt-0.5">{settleBooking.returnDate}</span>
                  <span className="text-slate-600 text-[11px] block">{settleBooking.returnTime || '18:00 PM'}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-blue-200">
                  <span className="text-[10px] font-bold text-emerald-700 block uppercase">3. Actual Return (اصل واپسی)</span>
                  <input
                    type="datetime-local"
                    value={actualReturnInput}
                    onChange={e => setActualReturnInput(e.target.value)}
                    className="w-full mt-1 p-1 rounded border border-slate-200 text-xs font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Live Overtime & Hourly Charges Calculator (اوور ٹائم چارجز کا حساب) */}
            {(() => {
              const bill = getBookingBilling(settleBooking);
              const customRate = customHourlyRate === '' ? bill.hourlyRate : Number(customHourlyRate);
              const calculatedOvertime = customOvertimeAmt === '' ? bill.chargeableHours * customRate : Number(customOvertimeAmt);
              const baseTotal = settleBooking.confirmedTotal ?? settleBooking.estimate?.estimatedTotal ?? 0;
              const finalTotal = baseTotal + calculatedOvertime;
              const paid = paidUpdateInput === '' ? bill.paidAmount : Number(paidUpdateInput);
              const finalRemaining = Math.max(0, finalTotal - paid);

              return (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Timer className="w-4 h-4 text-amber-700" />
                        <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                          Overtime & Hourly Rate Calculator (اوور ٹائم چارجز کا خودکار حساب)
                        </h3>
                      </div>
                      <span className="text-[10px] text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded-full">
                        30 Mins Grace Period Allowed
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-white border border-amber-200">
                        <span className="text-[10px] font-bold text-slate-500 block uppercase">Time Overdue (اوپر کا وقت)</span>
                        <span className="text-base font-black text-amber-900 font-mono block mt-0.5">
                          {bill.overdueHours} Hours {bill.overdueMinutes} Mins
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          Chargeable: <strong>{bill.chargeableHours} hours</strong>
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-amber-200">
                        <label className="text-[10px] font-bold text-slate-500 block uppercase mb-1">
                          Hourly Rate (فی گھنٹہ چارجز)
                        </label>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-mono font-bold text-slate-500">PKR</span>
                          <input
                            type="number"
                            value={customHourlyRate}
                            onChange={e => {
                              const val = e.target.value === '' ? '' : Number(e.target.value);
                              setCustomHourlyRate(val);
                              if (val !== '') {
                                setCustomOvertimeAmt(bill.chargeableHours * Number(val));
                              }
                            }}
                            className="w-full p-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold"
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Calculated from daily rent (Day / 12)
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-amber-200">
                        <label className="text-[10px] font-bold text-slate-500 block uppercase mb-1">
                          Total Overtime Charges (کل اوور ٹائم)
                        </label>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-mono font-bold text-slate-500">PKR</span>
                          <input
                            type="number"
                            value={customOvertimeAmt}
                            onChange={e => setCustomOvertimeAmt(e.target.value === '' ? '' : Number(e.target.value))}
                            className="w-full p-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold text-rose-700"
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {bill.chargeableHours} hrs × PKR {customRate}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Reconciliation Box (ادائیگی اور بقایا کا فائنل گوشوارہ) */}
                  <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4">
                    <span className="text-xs font-bold text-[#F5B301] uppercase tracking-wider block">
                      Financial Settlement Summary (فائنل حساب کتاب گوشوارہ)
                    </span>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                      <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                        <span className="text-[10px] text-slate-400 block uppercase">1. Base Rent (اصل کرایہ)</span>
                        <span className="text-base font-bold text-white block mt-0.5">
                          Rs. {baseTotal.toLocaleString()}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                        <span className="text-[10px] text-amber-400 block uppercase">2. Overtime (+اوور ٹائم)</span>
                        <span className="text-base font-bold text-amber-300 block mt-0.5">
                          +Rs. {calculatedOvertime.toLocaleString()}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                        <span className="text-[10px] text-emerald-400 block uppercase">3. Paid Advance (ادا شدہ)</span>
                        <input
                          type="number"
                          value={paidUpdateInput}
                          onChange={e => setPaidUpdateInput(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="Paid PKR"
                          className="w-full mt-1 p-1 rounded bg-white/15 border border-white/20 text-white text-xs font-mono font-bold focus:outline-hidden"
                        />
                      </div>

                      <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40">
                        <span className="text-[10px] text-amber-300 block uppercase font-bold">4. Remaining Due (صافی بقایا)</span>
                        <span className="text-lg font-black text-[#F5B301] block mt-0.5">
                          Rs. {finalRemaining.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Quick Settlement Actions */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        {settleBooking.tripStatus !== 'on_trip' && (
                          <button
                            type="button"
                            onClick={() => handleDispatchTrip(settleBooking.id)}
                            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Car className="w-3.5 h-3.5" />
                            <span>Mark as On-Trip (گاڑی روانہ کریں)</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleSaveSettlement(false)}
                          className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all cursor-pointer"
                        >
                          Save Changes (محفوظ کریں)
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSendSettlementWhatsApp(settleBooking)}
                          className="px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Send WhatsApp Receipt</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setPaidUpdateInput(finalTotal);
                            handleSaveSettlement(true);
                          }}
                          className="px-4 py-2 rounded-xl bg-[#F5B301] hover:bg-amber-400 text-[#0B1F3A] text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <Check className="w-4 h-4" />
                          <span>Mark Returned & Settle (گاڑی موصول و کلیئر)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* STANDARD DETAILS DRAWER */}
      {activeBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Booking Record</span>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xl font-black font-mono text-[#0B1F3A]">{activeBooking.reference}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                    {activeBooking.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openSettlementDesk(activeBooking)}
                  className="px-3 py-1.5 rounded-xl bg-[#0B1F3A] text-[#F5B301] text-xs font-bold flex items-center gap-1.5"
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span>Return & Billing Desk</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAgreementBooking(activeBooking)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5"
                  title="Print official rental voucher"
                >
                  <Printer className="w-3.5 h-3.5 text-[#0B1F3A]" />
                  <span className="hidden sm:inline">Print Voucher</span>
                </button>

                <button
                  onClick={() => setActiveBooking(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

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
                    href={`https://wa.me/${activeBooking.customerPhone.replace(/\D/g, '')}`}
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
                <span className="text-slate-400 block font-semibold">Departure (روانگی)</span>
                <span className="font-bold text-slate-800 block">{activeBooking.pickupDate} at {activeBooking.pickupTime || '09:00'}</span>
                <span className="text-slate-600 block">{activeBooking.pickupLocation}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 block font-semibold">Return Target (واپسی)</span>
                <span className="font-bold text-slate-800 block">{activeBooking.returnDate} at {activeBooking.returnTime || '18:00'}</span>
                <span className="text-slate-600 block">{activeBooking.destination}</span>
              </div>
            </div>

            {/* Status Change Buttons */}
            <div className="border-t border-slate-100 pt-4 space-y-2">
              <span className="text-xs font-bold text-slate-700 block mb-2">Change Status:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleStatusChange('confirmed')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                >
                  Confirm Booking
                </button>
                <button
                  type="button"
                  onClick={() => handleDispatchTrip(activeBooking.id)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                >
                  Mark On-Trip (گاڑی روانہ کریں)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveBooking(null);
                    openSettlementDesk(activeBooking);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#0B1F3A] hover:bg-[#142F57] text-[#F5B301] text-xs font-bold"
                >
                  Return & Settle Desk
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange('completed')}
                  className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold"
                >
                  Mark Completed
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange('cancelled', 'Customer requested cancellation')}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEW MANUAL BOOKING MODAL */}
      {manualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-lg font-black text-[#0B1F3A]">Create Manual Booking</h2>
                <p className="text-xs text-slate-500">Walk-in, phone, or WhatsApp direct customer booking.</p>
              </div>
              <button
                onClick={() => setManualModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {manualError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
                {manualError}
              </div>
            )}

            <form onSubmit={handleCreateManual} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Customer Full Name *</label>
                  <input
                    type="text"
                    value={mName}
                    onChange={e => setMName(e.target.value)}
                    placeholder="e.g. Haji Asif"
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Customer Mobile *</label>
                  <input
                    type="text"
                    value={mPhone}
                    onChange={e => setMPhone(e.target.value)}
                    placeholder="0327 1126457"
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Fleet Vehicle *</label>
                <select
                  value={mVehicleId}
                  onChange={e => {
                    setMVehicleId(e.target.value);
                    const v = vehicles.find(item => item.id === e.target.value);
                    if (v && v.dailyRatePKR) {
                      setMTotal(v.dailyRatePKR);
                    }
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold"
                >
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.make} {v.model} ({v.modelYear}) - Rs. {v.dailyRatePKR ? v.dailyRatePKR.toLocaleString() : 'Quote'}/day
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Departure Date & Time</label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={mPickupDate}
                      onChange={e => setMPickupDate(e.target.value)}
                      className="w-2/3 p-2.5 rounded-xl border border-slate-200"
                    />
                    <input
                      type="time"
                      value={mPickupTime}
                      onChange={e => setMPickupTime(e.target.value)}
                      className="w-1/3 p-2.5 rounded-xl border border-slate-200 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Return Date & Time</label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={mReturnDate}
                      onChange={e => setMReturnDate(e.target.value)}
                      className="w-2/3 p-2.5 rounded-xl border border-slate-200"
                    />
                    <input
                      type="time"
                      value={mReturnTime}
                      onChange={e => setMReturnTime(e.target.value)}
                      className="w-1/3 p-2.5 rounded-xl border border-slate-200 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Total Agreed Fare (PKR)</label>
                  <input
                    type="number"
                    value={mTotal}
                    onChange={e => setMTotal(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Deposit / Advance Received (PKR)</label>
                  <input
                    type="number"
                    value={mDeposit}
                    onChange={e => setMDeposit(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Driver Option</label>
                  <select
                    value={mDriverOption}
                    onChange={e => setMDriverOption(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="with_driver">With Professional Driver</option>
                    <option value="self_drive">Self-Drive</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Booking Source</label>
                  <select
                    value={mSource}
                    onChange={e => setMSource(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="phone">Direct Phone Call</option>
                    <option value="whatsapp">WhatsApp Inbound</option>
                    <option value="walk_in">Walk-in Office Client</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#0B1F3A] hover:bg-[#142F57] text-[#F5B301] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md"
                >
                  Create & Lock Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AGREEMENT PRINT MODAL */}
      {agreementBooking && (
        <RentalAgreementModal
          booking={agreementBooking}
          onClose={() => setAgreementBooking(null)}
        />
      )}
    </div>
  );
};
