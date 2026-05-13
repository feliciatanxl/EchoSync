'use client';

import { useState, useEffect } from 'react';
import {
  Radio, AlertTriangle, Shield, Clock, MapPin, Users, Heart,
  ChevronRight, Activity, Zap, CheckCircle2, XCircle,
  ArrowUpRight, Phone, Info, Server, Signal
} from 'lucide-react';
import Link from 'next/link';
import {
  incidents, cfrResponders, aedUnits, incidentTimeline,
  hdbBlocks, edgeNodes, systemStatus, confidenceProgression
} from '@/lib/mockData';
import { useLiveAlertFeed, useElapsedTime } from '@/lib/useSimulation';

export default function SCDFDashboardPage() {
  const [selectedIncident, setSelectedIncident] = useState(incidents[0]);
  const [mounted, setMounted] = useState(false);
  const alerts = useLiveAlertFeed(6000);
  const { formatted: elapsed } = useElapsedTime(262);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="space-y-4">
      {/* Emergency Status Banner */}
      <div className="glass-elevated rounded-xl border border-alert-high/30 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-alert-high/5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-alert-high text-bg-deep animate-status-blink">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[15px] font-bold text-text-primary">{selectedIncident.type}</h2>
              <span className="severity-badge-p1 px-2 py-0.5 rounded text-[10px] font-black uppercase">{selectedIncident.severity}</span>
            </div>
            <p className="text-[12px] text-text-muted">{selectedIncident.block} {selectedIncident.unit} • {selectedIncident.estate} • Elapsed: <span className="text-alert-high font-bold font-mono">{elapsed}</span></p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/incidents/${selectedIncident.id}`} className="px-4 py-2 rounded-lg bg-alert-high text-white text-[12px] font-bold hover:bg-alert-high/90 transition-colors">
            Open Incident
          </Link>
          <button className="px-4 py-2 rounded-lg bg-bg-surface border border-border text-[12px] font-bold text-text-primary hover:bg-bg-hover transition-colors">
            Escalate
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Left Column — Incident Queue */}
        <div className="lg:col-span-2 space-y-4">

          {/* Incident Queue */}
          <div className="glass-elevated rounded-xl border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-alert-high" />
                <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-wider">Live Incident Queue</h3>
              </div>
              <span className="text-[11px] text-text-muted">{incidents.length} active</span>
            </div>
            <div className="divide-y divide-border/30">
              {incidents.map((inc) => (
                <button
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`w-full text-left p-4 flex items-center gap-4 transition-all hover:bg-bg-surface/40 cursor-pointer ${
                    selectedIncident.id === inc.id ? 'bg-accent/5 border-l-2 border-l-accent' : ''
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    inc.severity === 'P1' ? 'bg-alert-high/10 text-alert-high' :
                    inc.severity === 'P2' ? 'bg-alert-medium/10 text-alert-medium' :
                    'bg-bg-surface text-text-muted'
                  }`}>
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[13px] font-bold text-text-primary truncate">{inc.type}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase severity-badge-${inc.severity.toLowerCase()}`}>{inc.severity}</span>
                    </div>
                    <p className="text-[11px] text-text-muted truncate">{inc.block} {inc.unit} • {inc.residentName}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-12 h-1 bg-bg-surface rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${inc.confidence > 90 ? 'bg-alert-high' : inc.confidence > 70 ? 'bg-alert-medium' : 'bg-text-muted'}`} style={{ width: `${inc.confidence}%` }} />
                      </div>
                      <span className="text-[10px] font-mono text-text-secondary">{inc.confidence}%</span>
                    </div>
                    <span className={`text-[10px] font-mono ${inc.severity === 'P1' ? 'text-alert-high' : 'text-text-muted'}`}>{inc.timeElapsed}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* AI Explainability Panel */}
          <div className="glass-elevated rounded-xl border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border/50 flex items-center gap-2">
              <Info className="w-4 h-4 text-accent" />
              <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-wider">Alert Explainability</h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="p-4 rounded-xl bg-bg-deep border border-border/40">
                <p className="text-[12px] text-text-secondary leading-relaxed">
                  <span className="text-accent font-bold">AI Classification:</span> {selectedIncident.aiExplanation}
                </p>
              </div>
              {/* Confidence Progression */}
              <div>
                <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-3">Confidence Progression</p>
                <div className="flex items-end gap-1 h-20">
                  {confidenceProgression.map((point, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[9px] font-mono text-text-muted">{point.score}%</span>
                      <div
                        className="w-full rounded-t bg-accent/70 animate-confidence-fill transition-all"
                        style={{ height: `${(point.score / 100) * 100}%`, animationDelay: `${i * 300}ms` }}
                      />
                      <span className="text-[8px] text-text-muted text-center leading-tight">{point.time.slice(-5)}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Sensor Fusion */}
              <div className="flex flex-wrap gap-2">
                {selectedIncident.sensors.map((s) => (
                  <span key={s} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-bg-surface border border-border text-[11px] text-text-secondary">
                    <Activity className="w-3 h-3 text-accent" />
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* HDB Block Map */}
          <div className="glass-elevated rounded-xl border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan" />
                <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-wider">HDB Block Map</h3>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-text-muted">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-alert-high animate-status-blink" /> Incident</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent" /> CFR</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-alert-low" /> AED</span>
              </div>
            </div>
            <div className="p-5 dot-grid-pattern min-h-[200px]">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {hdbBlocks.filter(b => b.pilotActive).map((block) => {
                  const hasIncident = incidents.some(i => i.block === block.name);
                  const hasAED = aedUnits.some(a => a.block === block.name);
                  return (
                    <div key={block.id} className={`p-3 rounded-xl border transition-all ${
                      hasIncident ? 'bg-alert-high/10 border-alert-high/40' : 'bg-bg-surface/30 border-border/40'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[12px] font-bold ${hasIncident ? 'text-alert-high' : 'text-text-primary'}`}>{block.name}</span>
                        {hasIncident && <div className="w-2 h-2 rounded-full bg-alert-high animate-status-blink" />}
                      </div>
                      <p className="text-[10px] text-text-muted">{block.estate}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[9px] text-text-muted"><Signal className="w-2.5 h-2.5 inline mr-0.5" />{block.nodesOnline}/{block.nodesDeployed}</span>
                        {hasAED && <span className="text-[9px] text-alert-low"><Heart className="w-2.5 h-2.5 inline mr-0.5" />AED</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">

          {/* Incident Timeline */}
          <div className="glass-elevated rounded-xl border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border/50 flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" />
              <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-wider">Response Timeline</h3>
            </div>
            <div className="p-4 max-h-[400px] overflow-y-auto">
              <div className="space-y-0">
                {incidentTimeline.map((event, i) => (
                  <div key={i} className="flex gap-3 relative">
                    {i < incidentTimeline.length - 1 && (
                      <div className={`absolute left-[7px] top-[18px] w-0.5 h-[calc(100%)] ${
                        event.status === 'completed' ? 'bg-accent/30' : 'bg-border/30'
                      }`} />
                    )}
                    <div className={`w-[14px] h-[14px] rounded-full flex-shrink-0 mt-0.5 z-10 ${
                      event.status === 'completed' ? 'bg-accent' :
                      event.status === 'active' ? 'bg-accent/30 border-2 border-accent animate-timeline-pulse' :
                      'bg-bg-surface border border-border'
                    }`} />
                    <div className="pb-4 flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className={`text-[12px] font-semibold ${
                          event.status === 'active' ? 'text-accent' : 'text-text-primary'
                        }`}>{event.label}</span>
                        <span className="text-[9px] font-mono text-text-muted flex-shrink-0">{event.time}</span>
                      </div>
                      <p className="text-[11px] text-text-muted mt-0.5 leading-snug">{event.detail}</p>
                      <span className={`inline-block mt-1 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        event.type === 'scdf' ? 'bg-alert-high/10 text-alert-high' :
                        event.type === 'cfr' ? 'bg-accent/10 text-accent' :
                        event.type === 'ai' ? 'bg-cyan/10 text-cyan' :
                        event.type === 'operator' ? 'bg-alert-medium/10 text-alert-medium' :
                        'bg-bg-surface text-text-muted'
                      }`}>{event.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CFR Responder Status */}
          <div className="glass-elevated rounded-xl border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-accent" />
                <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-wider">CFR Status</h3>
              </div>
              <span className="text-[10px] text-text-muted">{cfrResponders.filter(r => r.status !== 'standby').length} activated</span>
            </div>
            <div className="p-4 space-y-2.5">
              {cfrResponders.map((cfr) => (
                <div key={cfr.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-bg-surface/40 border border-border/30">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                    cfr.status === 'accepted' || cfr.status === 'on_scene' ? 'bg-alert-low/15 text-alert-low border border-alert-low/30' :
                    cfr.status === 'en_route' ? 'bg-accent/15 text-accent border border-accent/30' :
                    'bg-bg-surface text-text-muted border border-border'
                  }`}>
                    {cfr.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-text-primary truncate">{cfr.name}</p>
                    <p className="text-[10px] text-text-muted">{cfr.distance} • ETA {cfr.eta}</p>
                  </div>
                  <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                    cfr.status === 'accepted' || cfr.status === 'on_scene' ? 'bg-alert-low/15 text-alert-low' :
                    cfr.status === 'en_route' ? 'bg-accent/15 text-accent' :
                    cfr.status === 'notified' ? 'bg-alert-medium/15 text-alert-medium' :
                    'bg-bg-surface text-text-muted'
                  }`}>{cfr.status.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AED Coordination */}
          <div className="glass-elevated rounded-xl border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border/50 flex items-center gap-2">
              <Heart className="w-4 h-4 text-alert-low" />
              <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-wider">AED Units</h3>
            </div>
            <div className="p-4 space-y-2.5">
              {aedUnits.map((aed) => (
                <div key={aed.id} className="flex items-center justify-between p-2.5 rounded-lg bg-bg-surface/40 border border-border/30">
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold text-text-primary truncate">{aed.location}</p>
                    <p className="text-[10px] text-text-muted">{aed.distance} away • Checked {aed.lastChecked}</p>
                  </div>
                  <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded flex-shrink-0 ${
                    aed.status === 'available' ? 'bg-alert-low/15 text-alert-low' :
                    aed.status === 'assigned' ? 'bg-accent/15 text-accent' :
                    'bg-alert-medium/15 text-alert-medium'
                  }`}>{aed.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Operator Controls */}
          <div className="glass-elevated rounded-xl border border-border p-5 space-y-3">
            <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-wider mb-4">Escalation Controls</h3>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-alert-high hover:bg-alert-high/90 text-white text-[13px] font-bold transition-colors">
              <Phone className="w-4 h-4" />
              Dispatch SCDF Ambulance
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-bg-surface border border-border hover:bg-bg-hover text-text-primary text-[13px] font-semibold transition-colors">
              <Users className="w-4 h-4 text-text-muted" />
              Broadcast to CFR Network
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-bg-surface border border-border hover:bg-bg-hover text-text-primary text-[13px] font-semibold transition-colors">
              <XCircle className="w-4 h-4 text-text-muted" />
              Dismiss as False Alarm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
