'use client';

import { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Calendar, 
  Download, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight,
  Clock,
  ArrowUpRight
} from 'lucide-react';

const auditLogs = [
  { id: 'LOG-9921', type: 'Heavy Fall', resident: 'Ho Teck Ghee', responseTime: '4m 12s', status: 'Resolved', severity: 'critical', action: 'SCDF Dispatched', date: 'Oct 24, 2026' },
  { id: 'LOG-9920', type: 'Prolonged Immobility', resident: 'Tan Ah Lian', responseTime: '12m 45s', status: 'Resolved', severity: 'medium', action: 'Volunteer Verified', date: 'Oct 24, 2026' },
  { id: 'LOG-9919', type: 'Node Offline', resident: 'System', responseTime: '1m 02s', status: 'Auto-Resolved', severity: 'low', action: 'Self-Healed', date: 'Oct 23, 2026' },
  { id: 'LOG-9918', type: 'Acoustic Anomaly', resident: 'Lim Boon Keng', responseTime: '3m 22s', status: 'False Alarm', severity: 'medium', action: 'Caregiver Notified', date: 'Oct 23, 2026' },
];

export default function IncidentHistoryPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!mounted) return null;

  return (
    <div className="p-4 sm:p-8 bg-bg-deep min-h-screen font-sans">
      <div className="max-w-[1200px] mx-auto space-y-6 sm:space-y-8 animate-fade-in">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <History className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary tracking-tight">Resolution Audit Logs</h1>
              <p className="text-sm text-text-muted mt-0.5">Full history of system incidents and response metrics.</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-bg-surface border border-border text-[13px] font-bold text-text-primary hover:bg-bg-hover transition-all self-start sm:self-auto">
            <Download className="w-4 h-4" />
            Export Archive
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-elevated rounded-2xl p-6 border border-border/60 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Avg Response Time</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-text-primary">4m 32s</span>
              <span className="text-[11px] text-alert-low font-bold">-12% vs last month</span>
            </div>
          </div>
          <div className="glass-elevated rounded-2xl p-6 border border-border/60">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Incidents Resolved</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-text-primary">142</span>
              <span className="text-[11px] text-text-muted font-bold">Total YTD</span>
            </div>
          </div>
          <div className="glass-elevated rounded-2xl p-6 border border-border/60">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Volunteer Saves</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-accent">28</span>
              <span className="text-[11px] text-accent/60 font-bold italic">Kampung Spirit</span>
            </div>
          </div>
          <div className="glass-elevated rounded-2xl p-6 border border-border/60">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">SCDF Escalations</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-text-primary">12</span>
              <span className="text-[11px] text-text-muted font-bold">This Month</span>
            </div>
          </div>
        </div>

        {/* Audit Data Display */}
        <div className="bg-bg-surface border border-border/60 rounded-3xl overflow-hidden shadow-sm">
          {/* Filters Bar */}
          <div className="p-4 sm:p-6 border-b border-border/40 bg-bg-elevated/20 flex flex-wrap gap-4 items-center justify-between">
            <div className="relative flex-1 w-full sm:min-w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input 
                type="text" 
                placeholder="Search by ID, Resident, or Type..." 
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-bg-deep border border-border text-[13px] focus:outline-none focus:border-primary/50 text-text-primary"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
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

          {/* Conditional Rendering based on isMobile */}
          {isMobile ? (
            <div className="p-4 space-y-4">
              {auditLogs.map((log) => (
                <div key={log.id} className="glass-elevated rounded-2xl p-5 border border-border/60 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        log.severity === 'critical' ? 'bg-alert-high/10 text-alert-high' : 'bg-primary/10 text-primary'
                      }`}>
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-[14px] font-bold text-text-primary">{log.type}</h3>
                        <p className="text-[11px] text-text-muted">{log.id}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.status === 'Resolved' ? 'bg-alert-low/10 text-alert-low' : 'bg-alert-medium/10 text-alert-medium'
                    }`}>
                      {log.status}
                    </span>
                  </div>

                  <div className="space-y-2 py-3 border-y border-border/40">
                    <div className="flex justify-between text-[13px]">
                      <span className="text-text-muted">Resident:</span>
                      <span className="text-text-primary font-medium">{log.resident}</span>
                    </div>
                    <div className="flex justify-between text-[13px]">
                      <span className="text-text-muted">Response Time:</span>
                      <span className="text-text-primary font-medium">{log.responseTime}</span>
                    </div>
                    <div className="flex justify-between text-[13px]">
                      <span className="text-text-muted">Date:</span>
                      <span className="text-text-primary font-medium">{log.date}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <p className="text-[11px] text-text-muted uppercase font-bold">Action Taken</p>
                    <p className="text-[12px] text-text-secondary leading-relaxed">{log.action}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto w-full max-w-full">
              <table className="w-full text-left min-w-[800px]">
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
                            <div className="text-[13px] font-bold text-text-primary">{log.type}</div>
                            <div className="text-[11px] text-text-muted">{log.id} • {log.date}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-[13px] text-text-primary font-medium">{log.resident}</div>
                        <div className="text-[11px] text-text-muted tracking-tight">Zone 4 (Blk 213)</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-accent" />
                          <span className="text-[13px] text-text-primary font-mono">{log.responseTime}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-[13px] text-text-secondary">{log.action}</div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                          log.status === 'Resolved' ? 'bg-alert-low/10 text-alert-low' : 'bg-alert-medium/10 text-alert-medium'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
