import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
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
  Banknote
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
  onOpenNewBookingModal: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateTab,
  onOpenNewBookingModal
}) => {
  const { bookings, vehicles, enquiries, settings, updateBookingStatus } = useApp();

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const maintenanceCars = vehicles.filter(v => v.opStatus === 'maintenance' || v.maintenanceWindows?.length > 0);
  const newEnquiries = enquiries.filter(e => e.status === 'new');

  // Revenue overview
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.confirmedTotal || b.estimate?.estimatedTotal || 0), 0);
  const totalDeposits = confirmedBookings.reduce((sum, b) => sum + (b.depositAmount || 0), 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0B1F3A]">Business Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time fleet status and booking queue for Sadiqabad Hub.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenNewBookingModal}
            className="px-4 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#142F57] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-[#F5B301]" />
            <span>New Manual Booking</span>
          </button>

          <button
            onClick={() => onNavigateTab('cms')}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <FileEdit className="w-4 h-4 text-slate-500" />
            <span>Edit Home Page</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Requests */}
        <div
          onClick={() => onNavigateTab('bookings')}
          className="bg-white rounded-2xl p-5 border border-amber-200/90 shadow-2xs hover:border-amber-400 cursor-pointer transition-all space-y-2 relative overflow-hidden group"
        >
          <div className="flex items-center justify-between text-xs font-bold text-amber-800">
            <span>Pending Approvals</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-900 font-mono">
              {pendingBookings.length}
            </span>
            <span className="text-xs text-amber-700 font-semibold">requests</span>
          </div>
          <span className="text-[11px] text-slate-500 block">Needs review & quote check</span>
        </div>

        {/* Confirmed Trips */}
        <div
          onClick={() => onNavigateTab('calendar')}
          className="bg-white rounded-2xl p-5 border border-emerald-200/90 shadow-2xs hover:border-emerald-400 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
            <span>Confirmed Trips</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-950 font-mono">
              {confirmedBookings.length}
            </span>
            <span className="text-xs text-emerald-700 font-semibold">scheduled</span>
          </div>
          <span className="text-[11px] text-slate-500 block">Locked on fleet calendar</span>
        </div>

        {/* Maintenance / Out of service */}
        <div
          onClick={() => onNavigateTab('vehicles')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:border-slate-300 cursor-pointer transition-all space-y-2"
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Maintenance Fleet</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 font-mono">
              {maintenanceCars.length}
            </span>
            <span className="text-xs text-slate-500 font-semibold">vehicles</span>
          </div>
          <span className="text-[11px] text-slate-500 block">Blocked from public booking</span>
        </div>

        {/* Revenue Volume */}
        <div
          onClick={() => onNavigateTab('pricing')}
          className="bg-white rounded-2xl p-5 border border-blue-200/90 shadow-2xs hover:border-blue-400 cursor-pointer transition-all space-y-2"
        >
          <div className="flex items-center justify-between text-xs font-bold text-blue-800">
            <span>Agreed Booking Volume</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-blue-700 font-bold">PKR</span>
            <span className="text-2xl font-black text-[#0B1F3A] font-mono">
              {totalRevenue.toLocaleString()}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 block">
            Deposits collected: PKR {totalDeposits.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Setup Checklist Banner (per PRD Section B3 & 5.2) */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-3xl p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-bold text-blue-950">Sadiqabad Launch & Operational Checklist</h2>
          </div>
          <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
            Ready for Operations
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-white/80 border border-blue-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold block">Contact & WhatsApp Desk</span>
              <span className="text-[11px] text-slate-500">{settings.phoneFormatted}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-white/80 border border-blue-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold block">Active Fleet Size</span>
              <span className="text-[11px] text-slate-500">{vehicles.length} verified vehicles configured</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-white/80 border border-blue-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold block">Bilingual Engine</span>
              <span className="text-[11px] text-slate-500">English & Urdu RTL active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings Queue */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#0B1F3A]">Recent Bookings & Inquiries</h2>
            <p className="text-xs text-slate-400">Incoming online requests requiring action.</p>
          </div>
          <button
            onClick={() => onNavigateTab('bookings')}
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>View All ({bookings.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4 text-start">Reference</th>
                <th className="py-3 px-4 text-start">Customer</th>
                <th className="py-3 px-4 text-start">Vehicle</th>
                <th className="py-3 px-4 text-start">Pickup Date</th>
                <th className="py-3 px-4 text-start">Status</th>
                <th className="py-3 px-4 text-end">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.slice(0, 5).map(b => (
                <tr key={b.id} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                    {b.reference}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-800 block">{b.customerName}</span>
                    <span className="text-[11px] text-slate-500 font-mono">{b.customerPhone}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {b.vehicleName}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {b.pickupDate} ({b.pickupTime})
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        b.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : b.status === 'completed'
                          ? 'bg-teal-100 text-teal-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-end space-x-1.5">
                    {b.status === 'pending' && (
                      <button
                        onClick={() => {
                          const res = updateBookingStatus(b.id, 'confirmed');
                          if (!res.success) {
                            alert(res.error);
                          }
                        }}
                        className="px-2.5 py-1 rounded-md bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 transition-colors"
                      >
                        Confirm
                      </button>
                    )}
                    <button
                      onClick={() => onNavigateTab('bookings')}
                      className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-bold text-[11px] hover:bg-slate-200 transition-colors"
                    >
                      Details
                    </button>
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
