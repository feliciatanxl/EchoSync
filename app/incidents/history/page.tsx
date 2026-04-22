'use client';

import { 
  History, 
  FileText, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  Search, 
  Filter, 
  Download,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

const auditLogs = [
  {
    id: 'INC-2026-089',
    type: 'Heavy Fall',
    resident: 'Tan Ah Lian',
    date: '2026-04-22',
    duration: '8m 42s',
    severity: 'critical',
    status: 'Resolved',
    actions: ['Rover Dispatched', 'Volunteer Notified', 'Resident Verified'],
    responseTime: '45s'
  },
  {
    id: 'INC-2026-088',
    type: 'Medical Emergency',
    resident: 'Wong Wei Ming',
    date: '2026-04-22',
    duration: '15m 10s',
    severity: 'critical',
    status: 'Resolved',
    actions: ['SCDF Escalated', 'EchoRover Visual', 'NOK Informed'],
    responseTime: '12s'
  },
  {
    id: 'INC-2026-085',
    type: 'Wellness Check',
    resident: 'Lim Boon Keng',
    date: '2026-04-21',
    duration: '45m 00s',
    severity: 'warning',
    status: 'Resolved',
    actions: ['Caregiver Notified', 'Resolved via Phone'],
    responseTime: '2m 15s'
  },
  {
    id: 'INC-2026-082',
    type: 'Hardware Offline',
    resident: 'Node BLK-124-A',
    date: '2026-04-20',
    duration: '1h 12m',
    severity: 'low',
    status: 'Maintenance',
    actions: ['Technician Dispatched', 'Firmware Updated'],
    responseTime: '15m 30s'
  }
];

export default function IncidentHistoryPage() {
  return (
    <div className="p-8 bg-bg-deep min-h-screen font-sans">
      <div className="max-w-[1200px] mx-auto space-y-8 animate-fade-in">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <History className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary tracking-tight">Resolution Audit Logs</h1>
              <p className="text-[13px] text-text-muted mt-1">Full history of system incidents and response metrics.</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-surface border border-border text-[13px] font-bold text-text-primary hover:bg-bg-hover transition-all">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-bg-surface border border-border/60 rounded-2xl p-5 shadow-sm">
            <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-2 mb-3">
              <TrendingUp className="w-3.5 h-3.5 text-success" />
              Avg Response Time
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-text-primary">58s</span>
              <span className="text-[11px] text-success font-bold">-12% vs last month</span>
            </div>
          </div>
          
          <div className="bg-bg-surface border border-border/60 rounded-2xl p-5 shadow-sm">
            <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-2 mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              Incidents Resolved
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-text-primary">1,242</span>
              <span className="text-[11px] text-text-muted font-bold">Total YTD</span>
            </div>
          </div>

          <div className="bg-bg-surface border border-border/60 rounded-2xl p-5 shadow-sm">
            <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-2 mb-3">
              <Users className="w-3.5 h-3.5 text-accent" />
              Volunteer Saves
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-text-primary">84</span>
              <span className="text-[11px] text-accent font-bold">Kampung Spirit</span>
            </div>
          </div>

          <div className="bg-bg-surface border border-border/60 rounded-2xl p-5 shadow-sm">
            <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-2 mb-3">
              <Clock className="w-3.5 h-3.5 text-alert-high" />
              SCDF Escalations
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-text-primary">12</span>
              <span className="text-[11px] text-text-muted font-bold">This Month</span>
            </div>
          </div>
        </div>

        {/* Audit Table */}
        <div className="bg-bg-surface border border-border/60 rounded-3xl overflow-hidden shadow-sm">
          {/* Filters Bar */}
          <div className="p-6 border-b border-border/40 bg-bg-elevated/20 flex flex-wrap gap-4 items-center justify-between">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input 
                type="text" 
                placeholder="Search by ID, Resident, or Type..." 
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-bg-deep border border-border text-[13px] focus:outline-none focus:border-primary/50"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bg-deep border border-border text-[13px] font-semibold text-text-secondary">
                <Calendar className="w-4 h-4" />
                Date Range
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bg-deep border border-border text-[13px] font-semibold text-text-secondary">
                <Filter className="w-4 h-4" />
                Severity
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-bg-deep/50 text-[11px] font-bold text-text-muted uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Incident Details</th>
                  <th className="px-6 py-4">Resident</th>
                  <th className="px-6 py-4">Response Time</th>
                  <th className="px-6 py-4">Actions Taken</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-bg-elevated/10 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          log.severity === 'critical' ? 'bg-alert-high/10 text-alert-high' : 'bg-primary/10 text-primary'
                        }`}>
                          <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-text-primary">{log.type}</p>
                          <p className="text-[11px] text-text-muted">{log.id} • {log.date}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[13px] font-medium text-text-secondary">{log.resident}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div>
                        <p className="text-[13px] font-bold text-text-primary">{log.responseTime}</p>
                        <p className="text-[11px] text-text-muted">Resolution: {log.duration}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-1">
                        {log.actions.map((action, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-full bg-bg-deep border border-border text-[10px] font-medium text-text-muted">
                            {action}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1.5 text-success font-bold text-[12px]">
                          <CheckCircle2 className="w-4 h-4" />
                          Resolved
                        </div>
                        <button className="text-[11px] text-primary hover:underline font-bold flex items-center gap-1">
                          Full Report
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
