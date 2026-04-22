'use client';

import { 
  User, 
  Activity, 
  TrendingUp, 
  AlertCircle, 
  Clock, 
  MapPin, 
  Phone, 
  Heart, 
  Footprints, 
  Moon, 
  ChevronLeft,
  Calendar,
  MoreVertical,
  ShieldCheck,
  History
} from 'lucide-react';
import Link from 'next/link';

export default function ResidentDetailPage() {
  return (
    <div className="flex flex-col h-full bg-bg-deep font-sans">
      {/* Header */}
      <div className="p-6 border-b border-border/40 bg-bg-surface/50 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/residents" className="p-2 rounded-xl bg-bg-surface border border-border text-text-muted hover:text-text-primary transition-all">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-accent to-cyan flex items-center justify-center text-2xl font-black text-bg-deep shadow-lg shadow-accent/20">
              HT
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-text-primary tracking-tight">Mdm. Ho Teck Ghee</h1>
                <span className="px-2 py-1 rounded bg-alert-high/10 text-alert-high text-[10px] font-black uppercase tracking-widest border border-alert-high/20">High Risk</span>
              </div>
              <div className="flex items-center gap-4 mt-1 text-[13px] text-text-muted">
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Blk 213, #12-441</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> 82 Years Old</span>
                <span className="flex items-center gap-1.5 text-success"><ShieldCheck className="w-3.5 h-3.5" /> System Active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 rounded-xl bg-bg-surface border border-border text-[13px] font-bold text-text-primary hover:bg-bg-hover transition-all flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Contact Next-of-Kin
          </button>
          <button className="p-2.5 rounded-xl bg-bg-surface border border-border text-text-muted hover:text-text-primary">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Top Row: Vitals & Mobility Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Mobility Card */}
            <div className="bg-bg-surface border border-border/60 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="p-2.5 rounded-2xl bg-accent/10 text-accent">
                  <Footprints className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-accent uppercase tracking-widest">Mobility Summary</span>
              </div>
              <div className="space-y-4 relative z-10">
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-text-primary">Stable</span>
                  <span className="text-[12px] text-success font-bold mb-1.5 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +12% vs LW
                  </span>
                </div>
                <p className="text-[13px] text-text-muted leading-relaxed">
                  Average walking speed: <span className="text-text-primary font-bold">0.85 m/s</span>. Slight increase in nocturnal movement detected over the last 3 days.
                </p>
              </div>
            </div>

            {/* Vitals Baseline */}
            <div className="bg-bg-surface border border-border/60 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent pointer-events-none" />
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="p-2.5 rounded-2xl bg-secondary/10 text-secondary">
                  <Heart className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-secondary uppercase tracking-widest">Health Baseline</span>
              </div>
              <div className="grid grid-cols-2 gap-4 relative z-10">
                <div>
                  <p className="text-[11px] text-text-muted uppercase font-bold tracking-wider mb-1">Resting HR</p>
                  <p className="text-2xl font-bold text-text-primary">72 <span className="text-sm font-normal text-text-muted">BPM</span></p>
                </div>
                <div>
                  <p className="text-[11px] text-text-muted uppercase font-bold tracking-wider mb-1">Resp. Rate</p>
                  <p className="text-2xl font-bold text-text-primary">16 <span className="text-sm font-normal text-text-muted">BRM</span></p>
                </div>
              </div>
            </div>

            {/* Sleep Pattern */}
            <div className="bg-bg-surface border border-border/60 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400">
                  <Moon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest">Sleep Efficiency</span>
              </div>
              <div className="space-y-4 relative z-10">
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-text-primary">82%</span>
                </div>
                <div className="w-full h-1.5 bg-bg-deep rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: '82%' }} />
                </div>
                <p className="text-[12px] text-text-muted italic">Within normal range for last 30 days.</p>
              </div>
            </div>
          </div>

          {/* Activity Patterns & Historical Baselines */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Activity Map (Placeholder Visual) */}
              <div className="bg-bg-surface border border-border/60 rounded-3xl p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-bold text-text-primary flex items-center gap-3">
                    <Activity className="w-5 h-5 text-accent" />
                    Routine Activity Baseline
                  </h3>
                  <div className="flex gap-2">
                    {['7D', '30D', '90D'].map(p => (
                      <button key={p} className={`px-3 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                        p === '30D' ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-bg-deep border-border text-text-muted hover:bg-bg-hover'
                      }`}>{p}</button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Mock Chart Visualization */}
                  <div className="relative h-64 bg-bg-deep/30 rounded-2xl border border-border/20 p-6 flex items-end justify-between gap-2 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                      <div className="w-full h-[1px] bg-accent" />
                    </div>
                    {[45, 62, 58, 81, 75, 42, 38, 51, 68, 72, 85, 92, 88, 76, 62, 55, 48, 52, 60, 65, 70, 78, 82, 74].map((h, i) => (
                      <div key={i} className="flex-1 group relative">
                        <div className={`w-full rounded-t-md transition-all duration-500 group-hover:bg-accent/50 ${
                          i === 11 ? 'bg-accent animate-pulse shadow-[0_0_15px_rgba(0,212,170,0.4)]' : 'bg-accent/20'
                        }`} style={{ height: `${h}%` }} />
                        <div className="absolute bottom-[-24px] left-1/2 -translate-x-1/2 text-[8px] font-bold text-text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                          {i}:00
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-[13px] text-text-muted px-2">
                    <span>Morning</span>
                    <span>Noon</span>
                    <span>Evening</span>
                    <span>Night</span>
                  </div>
                </div>
              </div>

              {/* Routine Anomalies Log */}
              <div className="bg-bg-surface border border-border/60 rounded-3xl p-8">
                <h3 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-alert-medium" />
                  Routine Anomalies Log
                </h3>
                <div className="space-y-4">
                  {[
                    { date: 'Yesterday', time: '03:12 AM', event: 'Extended Bathroom Duration', detail: '15m beyond baseline (12m)', status: 'Auto-Resolved' },
                    { date: '21 Oct', time: '11:45 PM', event: 'Restless Sleep Pattern', detail: 'Elevated mobility detection', status: 'Logged' },
                    { date: '19 Oct', time: '07:22 PM', event: 'Delayed Meal Time Anomaly', detail: 'Activity shifted from Kitchen to Bedroom', status: 'Checked' }
                  ].map((log, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-bg-deep border border-border/40 hover:border-border/80 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-xl bg-bg-surface border border-border/40 text-text-muted">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-text-primary">{log.event}</p>
                          <p className="text-[11px] text-text-muted">{log.date} • {log.time} • {log.detail}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        log.status === 'Auto-Resolved' ? 'bg-success/5 border-success/20 text-success' : 'bg-bg-surface border-border/40 text-text-muted'
                      }`}>{log.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Columns: Recent Incidents & Files */}
            <div className="space-y-8">
              {/* Recent Active Incidents */}
              <div className="bg-bg-surface border border-border/60 rounded-3xl p-6 shadow-xl">
                <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-6">Recent Incidents</h3>
                <div className="space-y-4">
                  <Link href="/incidents/triage" className="block p-4 rounded-2xl bg-alert-high/5 border border-alert-high/20 hover:bg-alert-high/10 transition-all group">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-black text-alert-high uppercase">Critical Fall</span>
                      <span className="text-[10px] text-text-muted">Today</span>
                    </div>
                    <p className="text-[13px] font-bold text-text-primary group-hover:text-alert-high transition-colors">Incident #FALL-9921</p>
                    <p className="text-[11px] text-text-muted mt-1">Resolution: Emergency Dispatch</p>
                  </Link>
                  <div className="p-4 rounded-2xl bg-bg-deep border border-border/40 opacity-70">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-black text-success uppercase">Minor Trip</span>
                      <span className="text-[10px] text-text-muted">14 Oct</span>
                    </div>
                    <p className="text-[13px] font-bold text-text-primary">Incident #TRIP-8812</p>
                    <p className="text-[11px] text-text-muted mt-1">Resolution: Auto-Resolved</p>
                  </div>
                </div>
                <button className="w-full mt-6 py-2 text-[12px] font-bold text-accent hover:underline flex items-center justify-center gap-2">
                  <History className="w-3.5 h-3.5" />
                  View Full History
                </button>
              </div>

              {/* Secure Notes */}
              <div className="bg-bg-surface border border-border/60 rounded-3xl p-6 shadow-xl">
                <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-4">Internal Staff Notes</h3>
                <div className="space-y-3">
                  <textarea 
                    placeholder="Add a secure note..." 
                    rows={3}
                    className="w-full p-3 rounded-xl bg-bg-deep border border-border/40 text-[12px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/40 transition-all resize-none"
                  />
                  <button className="w-full py-2.5 rounded-xl bg-accent text-bg-deep text-[12px] font-bold hover:shadow-lg transition-all">Save Note</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
