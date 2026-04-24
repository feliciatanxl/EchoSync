import { LayoutDashboard, Activity, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';



export default function Home() {
  return (
    <div className="p-4 sm:p-6">
      {/* Welcome Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-8 rounded-full bg-gradient-to-b from-accent to-cyan" />
          <div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
              Good Evening, Dispatcher
            </h1>
            <p className="text-sm text-text-secondary mt-0.5">
              Real-time monitoring across{' '}
              <span className="text-accent font-semibold">12 HDB estates</span>{' '}
              •{' '}
              <span className="text-text-primary font-medium">1,247 active nodes</span>{' '}
              •{' '}
              <span className="text-alert-low font-medium">All systems nominal</span>
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Nodes', value: '1,247', change: '+12 today', color: 'accent' },
          { label: 'Open Incidents', value: '3', change: '2 critical', color: 'alert-high' },
          { label: 'Response Time', value: '<42s', change: 'Avg. today', color: 'cyan' },
          { label: 'Uptime', value: '99.97%', change: 'Last 30 days', color: 'alert-low' },
        ].map((stat, index) => (
          <div
            key={stat.label}
            className="glass-elevated rounded-xl p-4 animate-fade-in group hover:border-accent/20 transition-all duration-300 cursor-default"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <p className="text-[11px] font-medium text-text-muted uppercase tracking-wider">
              {stat.label}
            </p>
            <p className={`text-2xl font-bold mt-1 text-${stat.color}`}>
              {stat.value}
            </p>
            <p className="text-[11px] text-text-muted mt-1">
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* Dashboard Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        
        {/* Live Alert Feed (col-span-2) */}
        <div className="col-span-1 lg:col-span-2 h-72 glass-elevated rounded-xl border border-border flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent" />
              <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-wider">Live Alert Feed</h3>
            </div>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-accent/10 text-[10px] font-bold text-accent animate-pulse-glow">
              <div className="w-1.5 h-1.5 rounded-full bg-accent" /> Live
            </span>
          </div>
          <div className="p-4 flex-1 overflow-y-auto space-y-3">
            {[
              { time: '18:42:05', type: 'Thermal Posture Drop', loc: 'Blk 124 #04-12', level: 'high' },
              { time: '18:38:22', type: 'Acoustic Spike (78dB)', loc: 'Blk 124 #04-12', level: 'high' },
              { time: '18:15:10', type: 'Utility Zero Usage (24h)', loc: 'Blk 126 #11-30', level: 'medium' },
              { time: '17:55:01', type: 'Node Offline', loc: 'Blk 128 #02-44', level: 'low' },
              { time: '17:30:45', type: 'Routine Vitals Normal', loc: 'Blk 125 #08-15', level: 'normal' },
            ].map((alert, i) => (
              <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-bg-surface/50 transition-colors border border-transparent hover:border-border/50">
                <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                  alert.level === 'high' ? 'bg-alert-high shadow-[0_0_8px_rgba(239,68,68,0.6)]' :
                  alert.level === 'medium' ? 'bg-alert-medium' :
                  alert.level === 'low' ? 'bg-text-muted' : 'bg-alert-low'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <p className={`text-[13px] font-semibold truncate ${alert.level === 'high' ? 'text-alert-high' : 'text-text-primary'}`}>
                      {alert.type}
                    </p>
                    <span className="text-[10px] text-text-muted font-mono">{alert.time}</span>
                  </div>
                  <p className="text-[11px] text-text-secondary truncate">{alert.loc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Estate Heatmap (col-span-2) */}
        <div className="col-span-1 lg:col-span-2 h-72 glass-elevated rounded-xl border border-border flex flex-col overflow-hidden relative">
          <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between z-10 bg-bg-elevated/80 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4 text-cyan" />
              <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-wider">Estate Heatmap</h3>
            </div>
            <select className="bg-bg-surface border border-border rounded px-2 py-1 text-[11px] text-text-primary outline-none">
              <option>Toa Payoh Silver Zone</option>
              <option>Marine Parade</option>
            </select>
          </div>
          <div className="flex-1 p-4 relative flex items-center justify-center dot-grid-pattern">
            {/* Abstract Heatmap Grid */}
            <div className="grid grid-cols-6 gap-2 w-full h-full max-w-sm">
              {Array.from({ length: 24 }).map((_, i) => {
                // Generate some mock hotspots
                const isHot = i === 14;
                const isWarm = i === 8 || i === 15 || i === 20;
                return (
                  <div 
                    key={i} 
                    className={`rounded-md border border-white/5 transition-all duration-500 hover:scale-105 cursor-pointer ${
                      isHot ? 'bg-alert-high/80 shadow-[0_0_15px_rgba(239,68,68,0.4)]' :
                      isWarm ? 'bg-alert-medium/60' :
                      'bg-accent/10 hover:bg-accent/20'
                    }`}
                  />
                )
              })}
            </div>
            {/* Overlay Tooltip Mockup */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-bg-deep border border-alert-high/50 p-3 rounded-lg shadow-xl z-20 pointer-events-none">
              <p className="text-[11px] font-bold text-white mb-1">Blk 124 (High Activity)</p>
              <p className="text-[10px] text-text-muted">2 Critical Alerts • 15 Nodes</p>
            </div>
          </div>
        </div>

        {/* Incident Triage Queue (col-span-3) */}
        <div className="col-span-1 lg:col-span-3 h-56 glass-elevated rounded-xl border border-border flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-alert-high" />
              <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-wider">Priority Triage Queue</h3>
            </div>
            <button className="text-[11px] text-accent hover:text-accent-bright font-medium">View All</button>
          </div>
          <div className="p-4 flex-1 overflow-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] text-text-muted uppercase tracking-wider border-b border-border/40">
                  <th className="pb-2 font-medium">Incident ID</th>
                  <th className="pb-2 font-medium">Type</th>
                  <th className="pb-2 font-medium">Location</th>
                  <th className="pb-2 font-medium">Time Elapsed</th>
                  <th className="pb-2 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                <tr className="hover:bg-bg-surface/30">
                  <td className="py-2.5 text-[12px] font-mono text-text-secondary">INC-089</td>
                  <td className="py-2.5 text-[13px] font-semibold text-alert-high">Heavy Fall Detected</td>
                  <td className="py-2.5 text-[12px] text-text-primary">Blk 124 #04-12</td>
                  <td className="py-2.5 text-[12px] font-bold text-alert-high animate-pulse">00:42</td>
                  <td className="py-2.5 text-right">
                    <Link href="/incidents/triage" className="px-3 py-1 rounded bg-alert-high/10 text-alert-high text-[11px] font-bold hover:bg-alert-high hover:text-white transition-colors">
                      Dispatch
                    </Link>
                  </td>
                </tr>
                <tr className="hover:bg-bg-surface/30">
                  <td className="py-2.5 text-[12px] font-mono text-text-secondary">INC-088</td>
                  <td className="py-2.5 text-[13px] font-semibold text-alert-medium">Prolonged Immobility</td>
                  <td className="py-2.5 text-[12px] text-text-primary">Blk 126 #11-30</td>
                  <td className="py-2.5 text-[12px] font-medium text-alert-medium">03:15</td>
                  <td className="py-2.5 text-right">
                    <Link href="/incidents/triage" className="px-3 py-1 rounded bg-bg-surface border border-border text-text-primary text-[11px] font-medium hover:bg-bg-hover transition-colors">
                      Review
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* System Health Monitor (col-span-1) */}
        <div className="col-span-1 h-56 glass-elevated rounded-xl border border-border flex flex-col overflow-hidden">
          <div className="px-4 py-4 border-b border-border/50 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-alert-low" />
            <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-wider">System Health</h3>
          </div>
          <div className="p-4 flex-1 flex flex-col justify-center space-y-4">
            
            {/* Metric 1 */}
            <div>
              <div className="flex justify-between text-[11px] mb-1.5">
                <span className="text-text-muted font-medium uppercase tracking-wider">Gateway Load</span>
                <span className="text-text-primary font-bold">42%</span>
              </div>
              <div className="w-full h-1.5 bg-bg-surface rounded-full overflow-hidden">
                <div className="h-full bg-cyan w-[42%]" />
              </div>
            </div>

            {/* Metric 2 */}
            <div>
              <div className="flex justify-between text-[11px] mb-1.5">
                <span className="text-text-muted font-medium uppercase tracking-wider">Cloud Sync</span>
                <span className="text-alert-low font-bold">99.8%</span>
              </div>
              <div className="w-full h-1.5 bg-bg-surface rounded-full overflow-hidden">
                <div className="h-full bg-alert-low w-[99.8%]" />
              </div>
            </div>

            {/* Metric 3 */}
            <div>
              <div className="flex justify-between text-[11px] mb-1.5">
                <span className="text-text-muted font-medium uppercase tracking-wider">Edge Nodes</span>
                <span className="text-alert-medium font-bold">3 Offline</span>
              </div>
              <div className="w-full h-1.5 bg-bg-surface rounded-full overflow-hidden flex gap-0.5">
                <div className="h-full bg-alert-low flex-1" />
                <div className="h-full bg-alert-medium w-4" />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-8 text-center py-4 border-t border-border/40">
        <p className="text-[11px] text-text-muted">
          EchoSync B2G Portal v1.0 • PDPA Compliant • Encrypted End-to-End •{' '}
          <span className="text-accent/60">Singapore Smart Nation Initiative</span>
        </p>
      </div>
    </div>
  );
}
