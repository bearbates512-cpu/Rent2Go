import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { calculateQuote } from '../../utils/pricing.ts';
import { Banknote, Calculator, CheckCircle2, Info, ArrowRight } from 'lucide-react';

export const AdminPricing: React.FC = () => {
  const { vehicles } = useApp();

  // Fare Preview Interactive Sandbox State
  const [testVehicleId, setTestVehicleId] = useState<string>(vehicles[0]?.id || '');
  const [testDriverOption, setTestDriverOption] = useState<'with_driver' | 'self_drive'>('with_driver');
  const [testPickup, setTestPickup] = useState('2026-11-01');
  const [testReturn, setTestReturn] = useState('2026-11-04');
  const [testPickupTime, setTestPickupTime] = useState('09:00');
  const [testReturnTime, setTestReturnTime] = useState('18:00');

  const targetVehicle = vehicles.find(v => v.id === testVehicleId) || vehicles[0];

  const calculatedQuote = calculateQuote({
    dailyRatePKR: targetVehicle?.dailyRatePKR ?? null,
    driverDailyFeePKR: targetVehicle?.driverDailyFeePKR ?? 1500,
    driverOption: testDriverOption,
    pickupDate: testPickup,
    pickupTime: testPickupTime,
    returnDate: testReturn,
    returnTime: testReturnTime,
    customDeposit: targetVehicle?.customFields?.securityDeposit
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-[#0B1F3A]">Pricing Rules & Fare Engine</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Standard vehicle base tariffs, driver allowances, overtime rates, and interactive fare simulator.
        </p>
      </div>

      {/* Fare Preview Interactive Simulator */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-[#0B1F3A]">Fare Preview & Quote Simulator</h2>
          </div>
          <span className="text-xs font-mono text-slate-400">Pure Calculation Engine</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs Column (6 cols) */}
          <div className="lg:col-span-6 space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Select Vehicle</label>
              <select
                value={testVehicleId}
                onChange={e => setTestVehicleId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
              >
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.make} {v.model} ({v.dailyRatePKR ? `Rs. ${v.dailyRatePKR.toLocaleString()}/day` : 'Contact for quote'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Driver Mode</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTestDriverOption('with_driver')}
                  className={`p-2.5 rounded-xl border text-center font-bold ${
                    testDriverOption === 'with_driver'
                      ? 'border-[#0B1F3A] bg-[#0B1F3A] text-white'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  With Driver
                </button>
                <button
                  type="button"
                  onClick={() => setTestDriverOption('self_drive')}
                  className={`p-2.5 rounded-xl border text-center font-bold ${
                    testDriverOption === 'self_drive'
                      ? 'border-[#0B1F3A] bg-[#0B1F3A] text-white'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  Self-Drive
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Pickup Date & Time</label>
                <input
                  type="date"
                  value={testPickup}
                  onChange={e => setTestPickup(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 mb-1"
                />
                <input
                  type="time"
                  value={testPickupTime}
                  onChange={e => setTestPickupTime(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Return Date & Time</label>
                <input
                  type="date"
                  value={testReturn}
                  onChange={e => setTestReturn(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 mb-1"
                />
                <input
                  type="time"
                  value={testReturnTime}
                  onChange={e => setTestReturnTime(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Results Output Column (6 cols) */}
          <div className="lg:col-span-6 bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Real-time Output Breakdown
            </span>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">Calculated Duration:</span>
                <span className="font-bold text-slate-900 font-mono">{calculatedQuote.rentalDays} Day(s)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Base Rate per Day:</span>
                <span className="font-bold text-slate-900 font-mono">
                  {calculatedQuote.baseRatePerDay ? `Rs. ${calculatedQuote.baseRatePerDay.toLocaleString()}` : 'Custom quote'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Vehicle Base Total:</span>
                <span className="font-bold text-slate-900 font-mono">
                  {calculatedQuote.baseTotal ? `Rs. ${calculatedQuote.baseTotal.toLocaleString()}` : 'Quote required'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Driver Allowance Total:</span>
                <span className="font-bold text-slate-900 font-mono">Rs. {calculatedQuote.driverTotal.toLocaleString()}</span>
              </div>
              {calculatedQuote.securityDeposit > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Security Deposit:</span>
                  <span className="font-bold text-slate-900 font-mono">Rs. {calculatedQuote.securityDeposit.toLocaleString()}</span>
                </div>
              )}

              <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                <span className="font-extrabold text-sm text-[#0B1F3A]">Estimated Total:</span>
                <span className="text-2xl font-black text-[#0B1F3A] font-mono">
                  {calculatedQuote.estimatedTotal ? `PKR ${calculatedQuote.estimatedTotal.toLocaleString()}` : 'Quote on request'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50 text-blue-900 text-[11px] leading-relaxed">
              <strong>Rules Applied:</strong> Base rates scale per 24-hour cycle with 2-hour grace period. Driver fee is calculated per calendar day. Overtime beyond grace period counts as extra day.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
