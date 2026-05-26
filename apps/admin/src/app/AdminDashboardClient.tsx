'use client';

import React, { useState, useMemo } from 'react';
import {
  Users,
  ShieldCheck,
  Activity,
  Search,
  Filter,
  MoreHorizontal,
  ChevronRight,
  UserPlus,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

interface Profile {
  id: string;
  full_name?: string;
  display_name?: string;
  clinician_id?: string;
  role?: string;
  tier?: string;
  onboarding_complete?: boolean;
  created_at: string;
  updated_at?: string;
}

interface Stats {
  totalUsers: number;
  activeSessions: number;
  blockedAttempts: number;
}

interface AdminDashboardClientProps {
  stats: Stats;
  initialProfiles: Profile[];
  initialTotal: number;
  pageSize: number;
  adminEmail: string;
}

export default function AdminDashboardClient({
  stats,
  initialProfiles,
  initialTotal,
  pageSize,
  adminEmail,
}: AdminDashboardClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [profiles] = useState<Profile[]>(initialProfiles);
  const [page] = useState(0);

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return profiles;
    const q = searchTerm.toLowerCase();
    return profiles.filter(
      (p) =>
        p.full_name?.toLowerCase().includes(q) ||
        p.display_name?.toLowerCase().includes(q) ||
        p.clinician_id?.toLowerCase().includes(q) ||
        p.role?.toLowerCase().includes(q)
    );
  }, [profiles, searchTerm]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  return (
    <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
      {/* Auth Badge */}
      <div className="mb-4 flex items-center gap-2 text-xs text-on-surface-variant font-technical">
        <ShieldCheck size={14} className="text-brand-green" />
        <span>Admin session: <strong>{adminEmail}</strong></span>
      </div>

      {/* Header */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-1">
            Platform Oversight
          </h1>
          <p className="text-on-surface-variant font-medium">
            Manage clinicians, monitor clinical sessions, and audit system integrity.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-md font-semibold transition-all shadow-sm">
          <UserPlus size={18} />
          Provision Access
        </button>
      </div>

      {/* Stats row — LIVE DATA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard
          icon={<Users className="text-primary" size={20} />}
          label="Registered Clinicians"
          value={stats.totalUsers.toLocaleString()}
          trend="Live from DB"
        />
        <StatCard
          icon={<Activity className="text-emergency" size={20} />}
          label="Clinical Sessions"
          value={stats.activeSessions.toLocaleString()}
          trend="All-time total"
        />
        <StatCard
          icon={<AlertTriangle className="text-amber-500" size={20} />}
          label="Blocked PII Attempts"
          value={stats.blockedAttempts.toLocaleString()}
          trend="Airlock intercepts"
        />
      </div>

      {/* DCB0129 Banner */}
      <div className="mb-6 flex items-center gap-3 p-4 rounded-md bg-brand-green/5 border border-brand-green/20">
        <ShieldCheck size={18} className="text-brand-green shrink-0" />
        <p className="text-sm text-brand-green font-medium">
          DCB0129 Safety Case Active — All clinical data is PII-free at point of storage. Audit trails are immutable.
        </p>
      </div>

      {/* Clinician Registry */}
      <div className="bg-white rounded-lg border border-outline-variant shadow-telemetry overflow-hidden">
        <div className="p-6 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-lowest">
          <h2 className="text-xl font-headline font-bold flex items-center gap-2">
            Clinician Registry
            <span className="bg-surface-container-high text-on-surface-variant text-xs font-technical px-2 py-0.5 rounded">
              {initialTotal.toLocaleString()} Total
            </span>
          </h2>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
              <input
                type="text"
                placeholder="Search by name, ID or role..."
                className="w-full pl-10 pr-4 py-2 bg-surface text-sm border-none focus:ring-2 focus:ring-primary rounded-md transition-all font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="p-2 bg-surface hover:bg-surface-container-low rounded-md transition-colors text-on-surface-variant">
              <Filter size={18} />
            </button>
            <button
              onClick={() => window.location.reload()}
              className="p-2 bg-surface hover:bg-surface-container-low rounded-md transition-colors text-on-surface-variant"
              title="Refresh data"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                {['Clinician', 'Clinician ID', 'Role & Tier', 'Onboarding', 'Joined', 'Actions'].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-xs font-technical uppercase tracking-wider text-on-surface-variant border-b border-outline-variant"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant font-technical text-sm">
                    {searchTerm ? 'No clinicians match your search.' : 'No clinicians registered yet.'}
                  </td>
                </tr>
              ) : (
                filtered.map((profile) => (
                  <tr
                    key={profile.id}
                    className="hover:bg-surface-container-low/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-on-surface">
                          {profile.display_name || profile.full_name || '—'}
                        </span>
                        <span className="text-xs text-on-surface-variant font-mono opacity-60">
                          {profile.id.slice(0, 8)}…
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-on-surface-variant">
                      {profile.clinician_id || '—'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium capitalize">
                          {profile.role || 'Paramedic'}
                        </span>
                        {profile.tier && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold uppercase tracking-tight">
                            {profile.tier}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          profile.onboarding_complete
                            ? 'bg-brand-green/10 text-brand-green'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            profile.onboarding_complete ? 'bg-brand-green' : 'bg-amber-400'
                          }`}
                        />
                        {profile.onboarding_complete ? 'Complete' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant font-technical">
                      {formatDate(profile.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 hover:bg-surface rounded transition-colors text-on-surface-variant">
                          <MoreHorizontal size={18} />
                        </button>
                        <button className="p-1.5 hover:bg-primary/10 text-primary rounded transition-colors">
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-surface-container-low/50 border-t border-outline-variant flex justify-between items-center px-6">
          <span className="text-xs text-on-surface-variant font-technical">
            Showing {filtered.length} of {initialTotal.toLocaleString()} clinicians (page {page + 1})
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 0}
              className="px-3 py-1 text-xs font-bold border border-outline-variant bg-white rounded hover:bg-surface transition-colors disabled:opacity-50"
            >
              Previous
            </button>
            <button className="px-3 py-1 text-xs font-bold border border-outline-variant bg-white rounded hover:bg-surface transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  trend,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
}) {
  return (
    <div className="bg-white p-6 rounded-lg border border-outline-variant shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-surface rounded-md">{icon}</div>
        <span className="text-xs font-technical font-bold uppercase tracking-wider text-on-surface-variant">
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-headline font-black text-on-surface tracking-tight">
          {value}
        </span>
        <span className="text-xs font-bold text-brand-green">{trend}</span>
      </div>
    </div>
  );
}
