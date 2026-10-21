import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  TrendingUp,
  Download,
  Calendar,
  Banknote,
  Car,
  CheckCircle2,
  Clock,
  XCircle,
  FileSpreadsheet
} from 'lucide-react';

export const AdminReports: React.FC = () => {
  const { bookings, vehicles } = useApp();
  const [dateRange, setDateRange] = useState<'30' | '90' | '365'>('30');

  const confirmed = bookings.filter(b => b.status === 'confirmed');
  const completed = bookings.filter(b => b.status === 'completed');
  const pending = bookings.filter(b => b.status === 'pending');
  const cancelled = bookings.filter(b => b.status === 'cancelled' || b.status === 'rejected');

  const totalRevenue = confirmed.reduce(
    (sum, b) => sum + (b.confirmedTotal || b.estimate?.estimatedTotal || 0),
    0
  );
  const totalDeposits = confirmed.reduce((sum, b) => sum + (b.depositAmount || 0), 0);

  // Popular vehicle counts
  const carUsageCounts: Record<string, number> = {};
  bookings.forEach(b => {
    carUsageCounts[b.vehicleName] = (carUsageCounts[b.vehicleName] || 0) + 1;
  });

  const sortedCars = Object.entries(carUsageCounts).sort((a, b) => b[1] - a[1]);

  // CSV Export logic
  const handleExportCSV = () => {
    const headers = ['Reference', 'Customer Name', 'Phone', 'Vehicle', 'Status', 'Pickup Date', 'Return Date', 'Confirmed Total (PKR)', 'Deposit (PKR)'];
    const rows = bookings.map(b => [
      b.reference,
      `"${b.customerName}"`,
      `"${b.customerPhone}"`,
      `"${b.vehicleName}"`,
      b.status,
      b.pickupDate,
      b.returnDate,
      b.confirmedTotal || b.estimate?.estimatedTotal || 0,
      b.depositAmount || 0
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rent2go-bookings-export-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0B1F3A]">Business Reports & Analytics</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational performance, booking volume, vehicle utilization, and exportable financial reports.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Bookings CSV</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-slate-500 block">Total Requests</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#0B1F3A] font-mono">{bookings.length}</span>
            <span className="text-xs text-slate-400">lifetime</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-bold block">
            {((confirmed.length / (bookings.length || 1)) * 100).toFixed(0)}% conversion rate
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-slate-500 block">Confirmed Revenue Volume</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-slate-700">PKR</span>
            <span className="text-2xl font-black text-[#0B1F3A] font-mono">{totalRevenue.toLocaleString()}</span>
          </div>
          <span className="text-[11px] text-slate-500 block">From confirmed & active trips</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-slate-500 block">Cash Deposits Collected</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-slate-700">PKR</span>
            <span className="text-2xl font-black text-emerald-700 font-mono">{totalDeposits.toLocaleString()}</span>
          </div>
          <span className="text-[11px] text-slate-500 block">Bank transfer & cash receipts</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-slate-500 block">Active Sadiqabad Fleet</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-blue-900 font-mono">{vehicles.length}</span>
            <span className="text-xs text-slate-400">vehicles</span>
          </div>
          <span className="text-[11px] text-slate-500 block">100% inspected and registered</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Status Breakdown (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5">
          <h2 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider">
            Booking Status Distribution
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirmed & Ongoing ({confirmed.length})</span>
                </span>
                <span className="font-mono">{((confirmed.length / (bookings.length || 1)) * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(confirmed.length / (bookings.length || 1)) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-amber-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Pending Review ({pending.length})</span>
                </span>
                <span className="font-mono">{((pending.length / (bookings.length || 1)) * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(pending.length / (bookings.length || 1)) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-teal-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Successfully Completed ({completed.length})</span>
                </span>
                <span className="font-mono">{((completed.length / (bookings.length || 1)) * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full" style={{ width: `${(completed.length / (bookings.length || 1)) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-rose-700 flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Cancelled / Rejected ({cancelled.length})</span>
                </span>
                <span className="font-mono">{((cancelled.length / (bookings.length || 1)) * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-rose-400 rounded-full" style={{ width: `${(cancelled.length / (bookings.length || 1)) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Popular Fleet Demand (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5">
          <h2 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider">
            Fleet Demand & Popularity
          </h2>

          <div className="space-y-3 text-xs">
            {sortedCars.slice(0, 5).map(([carName, count], idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-[#0B1F3A] text-[#F5B301] font-bold text-xs flex items-center justify-center shrink-0">
                    #{idx + 1}
                  </span>
                  <span className="font-bold text-slate-800">{carName}</span>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 font-mono font-bold text-[#0B1F3A]">
                  {count} trips
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
