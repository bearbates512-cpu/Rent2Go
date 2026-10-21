import React, { useState } from 'react';
import { TeamMember, AdminRole } from '../../types/index.ts';
import { INITIAL_TEAM } from '../../data/initialData.ts';
import { Shield, PlusCircle, CheckCircle2, XCircle, UserPlus, X } from 'lucide-react';

export const AdminTeam: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('rent2go_team');
    return saved ? JSON.parse(saved) : INITIAL_TEAM;
  });

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [invName, setInvName] = useState('');
  const [invEmail, setInvEmail] = useState('');
  const [invRole, setInvRole] = useState<AdminRole>('staff');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invName.trim() || !invEmail.trim()) return;

    const newM: TeamMember = {
      id: `usr-${Date.now()}`,
      name: invName.trim(),
      email: invEmail.trim(),
      role: invRole,
      isActive: true,
      lastLogin: 'Never'
    };

    const updated = [...members, newM];
    setMembers(updated);
    localStorage.setItem('rent2go_team', JSON.stringify(updated));
    setInviteModalOpen(false);
    setInvName('');
    setInvEmail('');
  };

  const handleToggleActive = (id: string) => {
    setMembers(prev =>
      prev.map(m => (m.id === id ? { ...m, isActive: !m.isActive } : m))
    );
  };

  // Matrix definition per PRD 5.1 & Schema 4
  const permissionModules = [
    { module: 'Dashboard', owner: true, manager: true, staff: true, editor: false },
    { module: 'Bookings (View & Edit)', owner: true, manager: true, staff: true, editor: false },
    { module: 'Bookings (Confirm / Reject)', owner: true, manager: true, staff: false, editor: false },
    { module: 'Vehicles Fleet (CRUD)', owner: true, manager: true, staff: false, editor: false },
    { module: 'Website CMS & Block Builder', owner: true, manager: false, staff: false, editor: true },
    { module: 'Pricing Rules & Fare Engine', owner: true, manager: true, staff: false, editor: false },
    { module: 'Enquiries & CRM', owner: true, manager: true, staff: true, editor: false },
    { module: 'Reports & CSV Export', owner: true, manager: true, staff: false, editor: false },
    { module: 'Settings & Danger Zone', owner: true, manager: false, staff: false, editor: false }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0B1F3A]">Team, Staff & Permissions</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Role-Based Access Control (RBAC): Owner, Manager, Staff, and Content Editor profiles.
          </p>
        </div>

        <button
          onClick={() => setInviteModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#142F57] text-[#F5B301] text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Team Member</span>
        </button>
      </div>

      {/* Team Accounts Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-[#0B1F3A] text-white uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4 text-start">Staff Member</th>
                <th className="py-3 px-4 text-start">Assigned Role</th>
                <th className="py-3 px-4 text-start">Last Login</th>
                <th className="py-3 px-4 text-start">Status</th>
                <th className="py-3 px-4 text-end">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {members.map(m => (
                <tr key={m.id} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block">{m.name}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{m.email}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold uppercase text-[10px] text-slate-700">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100">
                      {m.role.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                    {m.lastLogin !== 'Never' ? new Date(m.lastLogin).toLocaleString() : 'Never'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        m.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {m.isActive ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-end">
                    {m.role !== 'owner' && (
                      <button
                        onClick={() => handleToggleActive(m.id)}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900 hover:underline"
                      >
                        {m.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Permission Matrix */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Shield className="w-5 h-5 text-amber-500" />
          <h2 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider">
            RBAC Permission Matrix (Enforced at Server & UI Level)
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4 text-start">Module / Action</th>
                <th className="py-3 px-4 text-center">Owner (Super Admin)</th>
                <th className="py-3 px-4 text-center">Manager</th>
                <th className="py-3 px-4 text-center">Staff</th>
                <th className="py-3 px-4 text-center">Content Editor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissionModules.map((pm, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-bold text-slate-800">{pm.module}</td>
                  <td className="py-3 px-4 text-center">
                    {pm.owner ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {pm.manager ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {pm.staff ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {pm.editor ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-[#0B1F3A]">Invite Team Member</h2>
              <button
                onClick={() => setInviteModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  value={invName}
                  onChange={e => setInvName(e.target.value)}
                  placeholder="e.g. Aslam Khan"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address *</label>
                <input
                  type="email"
                  value={invEmail}
                  onChange={e => setInvEmail(e.target.value)}
                  placeholder="aslam@rent2go-sadiqabad.pk"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Role Assignment</label>
                <select
                  value={invRole}
                  onChange={e => setInvRole(e.target.value as AdminRole)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 capitalize"
                >
                  <option value="manager">Manager (Bookings, Fleet, Pricing)</option>
                  <option value="staff">Staff (Bookings & Enquiries)</option>
                  <option value="content_editor">Content Editor (CMS, Media, Translations)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0B1F3A] text-white font-bold"
                >
                  Add Team Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
