import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext.tsx';
import { soundFX } from '../../utils/soundEffects.ts';
import { triggerThunderBlast } from '../effects/ThunderBlastSystem.tsx';
import { SpinInHeading, SpinInText, LiquidGasBadge } from '../effects/SpinInTypography.tsx';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Car,
  MessageSquare,
  PlusCircle,
  FileEdit,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  Banknote,
  Timer,
  Wallet,
  Zap,
  Sparkles,
  Phone,
  Globe,
  Check,
  ArrowRight
} from 'lucide-react';
import { calculateRentalBilling } from '../../utils/rentalBilling.ts';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
  onOpenNewBookingModal: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateTab,
  onOpenNewBookingModal
}) => {
  const { bookings, vehicles, enquiries, settings, updateBookingStatus, locale } = useApp();

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const maintenanceCars = vehicles.filter(v => v.opStatus === 'maintenance' || v.maintenanceWindows?.length > 0);
  const newEnquiries = enquiries.filter(e => e.status === 'new');

  // Revenue overview
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.confirmedTotal || b.estimate?.estimatedTotal || 0), 0);
  const totalDeposits = confirmedBookings.reduce((sum, b) => sum + (b.depositAmount || 0), 0);

  // Live trip & overtime calculations
  const onTripBookings = bookings.filter(b => b.tripStatus === 'on_trip');
  const overdueBookings = bookings.filter(b => {
    const veh = vehicles.find(v => v.id === b.vehicleId);
    const bill = calculateRentalBilling({
      pickupDate: b.pickupDate,
      pickupTime: b.pickupTime,
      returnDate: b.returnDate,
      returnTime: b.returnTime,
      confirmedTotal: b.confirmedTotal,
      estimatedTotal: b.estimate?.estimatedTotal,
      depositAmount: b.depositAmount,
      dailyRate: veh?.dailyRatePKR,
      overtimeHourlyRate: b.overtimeHourlyRate,
      customOvertimeCharges: b.overtimeCharges,
      actualReturnedAt: b.actualReturnedAt,
      tripStatus: b.tripStatus,
      status: b.status
    });
    return bill.isOverdue;
  });

  const totalOutstanding = bookings
    .filter(b => b.status === 'confirmed' || b.tripStatus === 'on_trip')
    .reduce((sum, b) => {
      const veh = vehicles.find(v => v.id === b.vehicleId);
      const bill = calculateRentalBilling({
        pickupDate: b.pickupDate,
        pickupTime: b.pickupTime,
        returnDate: b.returnDate,
        returnTime: b.returnTime,
        confirmedTotal: b.confirmedTotal,
        estimatedTotal: b.estimate?.estimatedTotal,
        depositAmount: b.depositAmount,
        dailyRate: veh?.dailyRatePKR,
        overtimeHourlyRate: b.overtimeHourlyRate,
        customOvertimeCharges: b.overtimeCharges,
        actualReturnedAt: b.actualReturnedAt,
        tripStatus: b.tripStatus,
        status: b.status
      });
      return sum + bill.finalRemainingDue;
    }, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto perspective-1000">
      {/* Top Welcome Header with 3D Spin-In */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/90 dark:bg-[#0B1523]/90 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-md">
        <div>
          <LiquidGasBadge className="text-[#F5B301] mb-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Sadiqabad Fleet Headquarters</span>
          </LiquidGasBadge>
          <SpinInHeading as="h1" splitWords axis="x" className="text-2xl sm:text-3xl font-black text-[#0B1F3A] dark:text-white">
            Operational Hub Dashboard
          </SpinInHeading>
          <SpinInText as="p" className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Live fleet availability, overtime trackers, and automated booking dispatch for Sadiqabad & M-5 Motorway.
          </SpinInText>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => {
              soundFX.playClick();
              onOpenNewBookingModal();
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0B1F3A] to-[#142F57] dark:from-[#F5B301] dark:to-amber-400 hover:opacity-95 text-white dark:text-[#0B1F3A] text-xs font-black transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-[#F5B301] dark:text-[#0B1F3A]" />
            <span>New Booking Order</span>
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              onNavigateTab('cms');
            }}
            className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <FileEdit className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>Visual CMS Editor</span>
          </button>
        </div>
      </div>

      {/* Overdue Trips Alert Banner */}
      {overdueBookings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          onClick={() => {
            soundFX.playClick();
            onNavigateTab('bookings');
          }}
          className="p-4 sm:p-5 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 shadow-md flex items-center justify-between cursor-pointer hover:bg-rose-100/80 dark:hover:bg-rose-900/60 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-600/30">
              <Timer className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-rose-900 dark:text-rose-200 uppercase tracking-wide">
                  ⚠️ Alert: {overdueBookings.length} Vehicle(s) are currently OVERDUE (گاڑی واپسی کا وقت اوپر ہو گیا ہے)
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-200 dark:bg-rose-800 text-rose-900 dark:text-rose-100">
                  Overtime Accruing
                </span>
              </div>
              <p className="text-xs text-rose-700 dark:text-rose-300 mt-1">
                گاڑی واپسی کا وقت گزر چکا ہے۔ اوور ٹائم کے گھنٹے، فی گھنٹہ چارجز اور کلائنٹ کا بقایا دیکھنے کے لیے کلک کریں۔
              </p>
            </div>
          </div>
          <button className="px-4 py-2 rounded-xl bg-rose-600 group-hover:bg-rose-700 text-white text-xs font-bold transition-all shrink-0 shadow-sm">
            Open Return Desk
          </button>
        </motion.div>
      )}

      {/* KPI Cards Grid with 3D Spin-In */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Requests */}
        <motion.div
          initial={{ opacity: 0, y: 30, rotateY: 25 }}
          whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          onClick={() => {
            soundFX.playClick();
            onNavigateTab('bookings');
          }}
          className="bg-white dark:bg-[#0B1523] rounded-3xl p-5 border border-amber-300/80 dark:border-amber-400/30 shadow-xs hover:border-amber-500 hover:shadow-xl cursor-pointer transition-all space-y-2 relative overflow-hidden group will-change-transform"
        >
          <div className="flex items-center justify-between text-xs font-bold text-amber-800 dark:text-amber-400">
            <span>Pending Approvals</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#0B1F3A] dark:text-white font-mono">
              {pendingBookings.length}
            </span>
            <span className="text-xs text-amber-700 dark:text-amber-400 font-bold">requests</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
            Requires quote review & vehicle lock
          </span>
        </motion.div>

        {/* Cars Out On Trip */}
        <motion.div
          initial={{ opacity: 0, y: 30, rotateY: 25 }}
          whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          onClick={() => {
            soundFX.playClick();
            onNavigateTab('bookings');
          }}
          className="bg-white dark:bg-[#0B1523] rounded-3xl p-5 border border-cyan-300/80 dark:border-cyan-400/30 shadow-xs hover:border-cyan-500 hover:shadow-xl cursor-pointer transition-all space-y-2 group will-change-transform"
        >
          <div className="flex items-center justify-between text-xs font-bold text-cyan-800 dark:text-cyan-400">
            <span>Active Trips (سفر پر روانہ)</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#0B1F3A] dark:text-white font-mono">
              {onTripBookings.length}
            </span>
            <span className="text-xs text-cyan-700 dark:text-cyan-300 font-bold">on road</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
            Dispatched vehicles with drivers
          </span>
        </motion.div>

        {/* Overdue Trips Alert */}
        <motion.div
          initial={{ opacity: 0, y: 30, rotateY: -25 }}
          whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          onClick={() => {
            soundFX.playClick();
            onNavigateTab('bookings');
          }}
          className={`rounded-3xl p-5 border shadow-xs cursor-pointer transition-all space-y-2 group will-change-transform ${
            overdueBookings.length > 0
              ? 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 hover:border-rose-500'
              : 'bg-white dark:bg-[#0B1523] border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-rose-800 dark:text-rose-400">
            <span>Overdue Trips (وقت اوپر ہوا)</span>
            <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 flex items-center justify-center">
              <Timer className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-900 dark:text-rose-100 font-mono">
              {overdueBookings.length}
            </span>
            <span className="text-xs text-rose-700 dark:text-rose-300 font-bold">cars late</span>
          </div>
          <span className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold block">
            {overdueBookings.length > 0 ? 'Accruing hourly overtime charges' : 'All returns strictly on time'}
          </span>
        </motion.div>

        {/* Revenue & Outstanding Balance */}
        <motion.div
          initial={{ opacity: 0, y: 30, rotateY: -25 }}
          whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.24 }}
          onClick={() => {
            soundFX.playClick();
            onNavigateTab('bookings');
          }}
          className="bg-white dark:bg-[#0B1523] rounded-3xl p-5 border border-emerald-300/80 dark:border-emerald-500/30 shadow-xs hover:border-emerald-500 hover:shadow-xl cursor-pointer transition-all space-y-2 will-change-transform"
        >
          <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-400">
            <span>Confirmed Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold font-mono">PKR</span>
            <span className="text-2xl font-black text-[#0B1F3A] dark:text-white font-mono">
              {totalRevenue.toLocaleString()}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
            Deposits: PKR {totalDeposits.toLocaleString()} • Due: <strong className="text-amber-600 dark:text-amber-400">PKR {totalOutstanding.toLocaleString()}</strong>
          </span>
        </motion.div>
      </div>

      {/* Sadiqabad Launch & Operational Checklist Banner */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-900/10 via-amber-500/10 to-indigo-900/10 dark:from-blue-950/40 dark:via-amber-950/20 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-900/50 rounded-3xl p-6 space-y-3 shadow-xs"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
            <h2 className="text-sm font-bold text-[#0B1F3A] dark:text-white">Sadiqabad Launch & Fleet Readiness</h2>
          </div>
          <span className="text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            100% OPERATIONAL
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-white/90 dark:bg-[#0B1523]/90 border border-slate-200 dark:border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">WhatsApp & Voice Desk</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{settings.phoneFormatted}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-white/90 dark:bg-[#0B1523]/90 border border-slate-200 dark:border-slate-800">
            <Car className="w-4 h-4 text-[#F5B301] shrink-0" />
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">Active Sadiqabad Fleet</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{vehicles.length} verified vehicles configured</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-white/90 dark:bg-[#0B1523]/90 border border-slate-200 dark:border-slate-800">
            <Globe className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0" />
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">Bilingual Engine</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">English (LTR) & Urdu (RTL) Active</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Bookings Queue with 3D Entrance */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.55 }}
        className="bg-white dark:bg-[#0B1523] rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden"
      >
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#0B1F3A] dark:text-white flex items-center gap-2">
              <FileEdit className="w-4 h-4 text-[#F5B301]" />
              <span>Recent Bookings & Order Queue</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Incoming online client bookings requiring confirmation or assignment.</p>
          </div>
          <button
            onClick={() => {
              soundFX.playClick();
              onNavigateTab('bookings');
            }}
            className="text-xs font-bold text-blue-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({bookings.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4 text-start font-mono">Reference</th>
                <th className="py-3.5 px-4 text-start">Customer</th>
                <th className="py-3.5 px-4 text-start">Vehicle</th>
                <th className="py-3.5 px-4 text-start">Pickup Date</th>
                <th className="py-3.5 px-4 text-start">Status</th>
                <th className="py-3.5 px-4 text-end">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {bookings.slice(0, 6).map((b, idx) => (
                <tr key={b.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0B1F3A] dark:text-amber-300">
                    {b.reference}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-800 dark:text-white block">{b.customerName}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{b.customerPhone}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-semibold">
                    {b.vehicleName}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-mono">
                    {b.pickupDate} ({b.pickupTime})
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono ${
                        b.status === 'confirmed'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                          : b.status === 'pending'
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                          : b.status === 'completed'
                          ? 'bg-cyan-100 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-end space-x-1.5">
                    {b.status === 'pending' && (
                      <button
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          triggerThunderBlast(rect.left + rect.width / 2, rect.top);
                          soundFX.playClick();
                          const res = updateBookingStatus(b.id, 'confirmed');
                          if (!res.success && res.error) {
                            alert(res.error);
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-all cursor-pointer shadow-xs active:scale-95 inline-flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Confirm</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        soundFX.playClick();
                        onNavigateTab('bookings');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[11px] transition-colors cursor-pointer"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};
