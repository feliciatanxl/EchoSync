import { FileText, AlertTriangle, ShieldAlert, Bot, PhoneCall, ArrowRight, Thermometer, Volume2, Users } from 'lucide-react';

const mockIncidents = [
  {
    id: 'INC-2026-089',
    type: 'Heavy Fall Detected',
    resident: 'Tan Ah Lian',
    location: 'Blk 124, #04-12',
    severity: 'critical',
    timeElapsed: '00:42',
    sensors: [{ icon: Thermometer, label: 'Thermal' }, { icon: Volume2, label: 'Acoustic' }],
    status: 'EchoRover Dispatched',
  },
  {
    id: 'INC-2026-088',
    type: 'Prolonged Immobility',
    resident: 'Wong Wei Ming',
    location: 'Blk 126, #11-30',
    severity: 'critical',
    timeElapsed: '03:15',
    sensors: [{ icon: Thermometer, label: 'Thermal' }],
    status: 'Unassigned',
  },
  {
    id: 'INC-2026-087',
    type: 'Utility Drop (24h)',
    resident: 'Lim Boon Keng',
    location: 'Blk 124, #08-45',
    severity: 'warning',
    timeElapsed: '12:00:00',
    sensors: [],
    status: 'Wellness Check Pending',
  }
];

export default function IncidentsPage() {
  return (
    <div className="p-6">
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-alert-high to-alert-medium" />
            <div>
              <h1 className="text-2xl font-bold text-text-primary tracking-tight">
                Incident Reports Queue
              </h1>
              <p className="text-sm text-text-secondary mt-0.5">
                Live triage of active alerts. Critical incidents require immediate action.
              </p>
            </div>
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="glass-elevated rounded-xl p-4 border border-alert-high/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-alert-high" />
            <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Active Critical</p>
            <p className="text-3xl font-bold text-alert-high mt-1">2</p>
          </div>
          <div className="glass-elevated rounded-xl p-4 border border-border">
            <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Unassigned</p>
            <p className="text-3xl font-bold text-text-primary mt-1">1</p>
          </div>
          <div className="glass-elevated rounded-xl p-4 border border-border">
            <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Resolved Today</p>
            <p className="text-3xl font-bold text-text-primary mt-1">14</p>
          </div>
        </div>

        {/* Triage Queue */}
        <div className="space-y-4">
          {mockIncidents.map((inc) => (
            <div key={inc.id} className={`glass-elevated rounded-xl p-5 border ${inc.severity === 'critical' ? 'border-alert-high/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-border'} flex flex-col md:flex-row gap-6 justify-between transition-all hover:border-accent/30`}>
              {/* Info section */}
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${inc.severity === 'critical' ? 'bg-alert-high/10 text-alert-high' : 'bg-alert-medium/10 text-alert-medium'}`}>
                  {inc.severity === 'critical' ? <ShieldAlert className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[15px] font-bold text-text-primary">{inc.type}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${inc.severity === 'critical' ? 'bg-alert-high text-white' : 'bg-alert-medium text-bg-deep'}`}>
                      {inc.severity}
                    </span>
                  </div>
                  <p className="text-[13px] text-text-secondary mb-2">
                    <span className="font-semibold text-text-primary">{inc.resident}</span> • {inc.location}
                  </p>
                  
                  {/* Sensor Pills */}
                  <div className="flex items-center gap-2">
                    {inc.sensors.length > 0 && <span className="text-[11px] text-text-muted mr-1">Fused Data:</span>}
                    {inc.sensors.map((s, i) => {
                      const SIcon = s.icon;
                      return (
                        <div key={i} className="flex items-center gap-1.5 px-2 py-1 rounded bg-bg-surface border border-border text-[10px] text-text-secondary">
                          <SIcon className="w-3 h-3 text-accent" />
                          {s.label}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex flex-col md:items-end justify-between border-t md:border-t-0 md:border-l border-border/50 pt-4 md:pt-0 md:pl-6 min-w-[240px]">
                <div className="flex items-center gap-2 mb-4 md:mb-0">
                  <div className={`w-2 h-2 rounded-full ${inc.severity === 'critical' ? 'bg-alert-high animate-pulse' : 'bg-alert-medium'}`} />
                  <span className="text-[12px] font-medium text-text-secondary">Elapsed: <span className="text-text-primary font-bold">{inc.timeElapsed}</span></span>
                </div>
                
                <div className="flex flex-col gap-2 w-full">
                  {inc.severity === 'critical' ? (
                    <>
                      <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-alert-high hover:bg-alert-high/90 text-white text-[12px] font-bold transition-colors">
                        <Bot className="w-4 h-4" />
                        Dispatch EchoRover
                      </button>
                      <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-bg-surface border border-border hover:bg-bg-hover text-text-primary text-[12px] font-semibold transition-colors">
                        <PhoneCall className="w-4 h-4 text-text-muted" />
                        Escalate to SCDF
                      </button>
                    </>
                  ) : (
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-accent hover:bg-accent-bright text-bg-deep text-[12px] font-bold transition-colors">
                      <Users className="w-4 h-4" />
                      Alert Kampung Network
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
