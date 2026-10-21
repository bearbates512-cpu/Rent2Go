import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { History, Shield, Search } from 'lucide-react';

export const AdminAudit: React.FC = () => {
  const { auditLogs } = useApp();
  const [filterModule, setFilterModule] = useState('all');

  const filteredLogs = auditLogs.filter(log => {
    if (filterModule !== 'all' && log.module !== filterModule) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-[#0B1F3A]">System & Admin Audit Log</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Immutable event record: tracking vehicle CRUD, booking confirmations, CMS revisions, and settings changes.
        </p>
      </div>

      <div className="flex gap-2">
        {['all', 'Bookings', 'Vehicles', 'CMS Engine', 'Settings', 'Reviews', 'Enquiries'].map(mod => (
          <button
            key={mod}
            onClick={() => setFilterModule(mod)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterModule === mod
                ? 'bg-[#0B1F3A] text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {mod}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-[#0B1F3A] text-white uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4 text-start">Timestamp</th>
                <th className="py-3 px-4 text-start">Actor & Role</th>
                <th className="py-3 px-4 text-start">Module</th>
                <th className="py-3 px-4 text-start">Action</th>
                <th className="py-3 px-4 text-start">Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-800 block">{log.actor}</span>
                    <span className="text-[10px] uppercase font-mono text-slate-400">{log.role}</span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#0B1F3A]">
                    {log.module}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-md truncate">
                    {log.details}
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
