import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  Wrench,
  Car,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

export const AdminCalendar: React.FC = () => {
  const { vehicles, bookings, addMaintenanceBlock } = useApp();

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('all');
  const [maintModalOpen, setMaintModalOpen] = useState(false);
  const [mVehId, setMVehId] = useState(vehicles[0]?.id || '');
  const [mStart, setMStart] = useState(new Date().toISOString().split('T')[0]);
  const [mEnd, setMEnd] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [mReason, setMReason] = useState('Routine 5,000 KM Mobil Oil & Filter Service');
  const [maintError, setMaintError] = useState('');

  // 14-day window for visual schedule
  const [startOffsetDays, setStartOffsetDays] = useState(0);

  const daysToDisplay = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + startOffsetDays + i);
    return d.toISOString().split('T')[0];
  });

  const filteredVehicles =
    selectedVehicleId === 'all'
      ? vehicles
      : vehicles.filter(v => v.id === selectedVehicleId);

  const handleAddMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    setMaintError('');

    const res = addMaintenanceBlock(
      mVehId,
      `${mStart}T00:00:00Z`,
      `${mEnd}T23:59:59Z`,
      mReason
    );

    if (res.success) {
      setMaintModalOpen(false);
      setMReason('');
    } else {
      setMaintError(res.error || 'Conflict detected! Could not schedule maintenance.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0B1F3A]">Fleet Schedule & Calendar</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Visual vehicle timeline: confirmed reservations, pending inquiries, and maintenance blocks.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setMaintModalOpen(true);
              setMaintError('');
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Wrench className="w-3.5 h-3.5 text-amber-400" />
            <span>Schedule Maintenance</span>
          </button>
        </div>
      </div>

      {/* Filter and Date Navigation */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        {/* Vehicle Select */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Car className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="font-bold text-slate-700">Filter Vehicle:</span>
          <select
            value={selectedVehicleId}
            onChange={e => setSelectedVehicleId(e.target.value)}
            className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 font-medium"
          >
            <option value="all">All Fleet ({vehicles.length} Vehicles)</option>
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>
                {v.make} {v.model} ({v.modelYear})
              </option>
            ))}
          </select>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-emerald-500" />
            <span>Confirmed Booking</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-amber-400 border border-amber-600" />
            <span>Pending Request</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-slate-400" />
            <span>Maintenance</span>
          </div>
        </div>

        {/* Timeline pager */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStartOffsetDays(prev => prev - 7)}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700"
            title="Previous Week"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setStartOffsetDays(0)}
            className="px-2.5 py-1 rounded-lg border border-slate-200 font-bold hover:bg-slate-50"
          >
            Today
          </button>
          <button
            onClick={() => setStartOffsetDays(prev => prev + 7)}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700"
            title="Next Week"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Visual Timeline Grid */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs border-collapse">
            <thead>
              <tr className="bg-[#0B1F3A] text-white">
                <th className="py-3 px-4 text-start font-bold uppercase text-[10px] min-w-[180px] sticky start-0 bg-[#0B1F3A] z-10 border-e border-slate-800">
                  Vehicle
                </th>
                {daysToDisplay.map(dStr => {
                  const d = new Date(dStr);
                  const isToday = dStr === new Date().toISOString().split('T')[0];
                  return (
                    <th
                      key={dStr}
                      className={`py-2 px-1 text-center font-mono min-w-[75px] border-e border-slate-800 ${
                        isToday ? 'bg-amber-500/20 text-[#F5B301]' : ''
                      }`}
                    >
                      <div className="text-[10px] text-slate-300 font-sans">
                        {d.toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div className="font-bold text-xs">{d.getDate()}</div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVehicles.map(veh => {
                return (
                  <tr key={veh.id} className="hover:bg-slate-50/50">
                    {/* Vehicle column */}
                    <td className="py-3 px-4 font-bold text-slate-800 sticky start-0 bg-white border-e border-slate-200 z-10">
                      <div className="flex items-center gap-2">
                        <img
                          src={veh.coverImage}
                          alt=""
                          className="w-10 h-7 rounded-md object-cover shrink-0"
                        />
                        <div className="truncate max-w-[130px]">
                          <span className="block truncate">{veh.make} {veh.model}</span>
                          <span className="text-[10px] text-slate-400 font-normal">{veh.stockCode}</span>
                        </div>
                      </div>
                    </td>

                    {/* Day cells */}
                    {daysToDisplay.map(dStr => {
                      // Find bookings on this date for this vehicle
                      const dayBookings = bookings.filter(b => {
                        if (b.vehicleId !== veh.id) return false;
                        if (b.status === 'cancelled' || b.status === 'rejected') return false;
                        return dStr >= b.pickupDate && dStr <= b.returnDate;
                      });

                      // Find maintenance
                      const inMaint = veh.maintenanceWindows?.some(m => {
                        const mS = m.start.split('T')[0];
                        const mE = m.end.split('T')[0];
                        return dStr >= mS && dStr <= mE;
                      });

                      return (
                        <td key={dStr} className="p-1 border-e border-slate-100 text-center align-middle">
                          {inMaint ? (
                            <div
                              className="p-1 rounded-md bg-slate-500 text-white text-[9px] font-bold truncate flex items-center justify-center gap-0.5"
                              title="Scheduled Maintenance"
                            >
                              <Wrench className="w-2.5 h-2.5 shrink-0" />
                              <span className="truncate">Maint</span>
                            </div>
                          ) : dayBookings.length > 0 ? (
                            <div className="space-y-0.5">
                              {dayBookings.map(b => (
                                <div
                                  key={b.id}
                                  className={`p-1 rounded-md text-[9px] font-bold truncate ${
                                    b.status === 'confirmed'
                                      ? 'bg-emerald-500 text-white shadow-2xs'
                                      : 'bg-amber-100 text-amber-900 border border-amber-400'
                                  }`}
                                  title={`${b.reference} - ${b.customerName} (${b.status})`}
                                >
                                  {b.reference.replace('R2G-', '')}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-200">•</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SCHEDULE MAINTENANCE MODAL */}
      {maintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-[#0B1F3A] flex items-center gap-2">
                <Wrench className="w-4 h-4 text-amber-500" />
                <span>Schedule Maintenance Window</span>
              </h2>
              <button
                onClick={() => setMaintModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {maintError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
                {maintError}
              </div>
            )}

            <form onSubmit={handleAddMaintenance} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Vehicle *</label>
                <select
                  value={mVehId}
                  onChange={e => setMVehId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                >
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.make} {v.model} ({v.stockCode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={mStart}
                    onChange={e => setMStart(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">End Date</label>
                  <input
                    type="date"
                    value={mEnd}
                    onChange={e => setMEnd(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Maintenance Reason / Service Details</label>
                <textarea
                  rows={2}
                  value={mReason}
                  onChange={e => setMReason(e.target.value)}
                  placeholder="e.g. Brake pad replacement, AC compressor servicing"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setMaintModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0B1F3A] text-white font-bold"
                >
                  Block Calendar Window
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
