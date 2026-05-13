'use client';

import { useState, useEffect } from 'react';
import {
  AlertTriangle, Clock, User, Activity, Shield, Radio, Phone,
  Users, CheckCircle2, ChevronRight, Info, Heart, MapPin,
  Navigation, ArrowLeft, Building, Thermometer, Volume2, Vibrate
} from 'lucide-react';
import Link from 'next/link';
import { incidents, incidentTimeline, cfrResponders, aedUnits, confidenceProgression } from '@/lib/mockData';
import { useElapsedTime } from '@/lib/useSimulation';

export default function IncidentDetailPage() {
  const incident = incidents[0]; // Primary incident
  const { formatted: elapsed } = useElapsedTime(262);
  const [mounted, setMounted] = useState(false);
  const [cprStarted, setCprStarted] = useState(false);
  const [aedApplied, setAedApplied] = useState(false);
  const [operatorNotes, setOperatorNotes] = useState<string[]>([
    '[18:42:35] Operator verified alert — confirmed escalation',
    '[18:43:00] CFR network broadcast initiated',
    '[18:43:30] SCDF dispatch payload sent',
  ]);
  const [noteInput, setNoteInput] = useState('');

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const addNote = () => {
    if (!noteInput.trim()) return;
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    setOperatorNotes(prev => [...prev, `[${time}] ${noteInput.trim()}`]);
    setNoteInput('');
  };

  return (
    <div className="space-y-4">
      {/* Emergency Header */}
      <div className="glass-elevated rounded-xl border border-alert-high/30 p-4 bg-alert-high/5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/scdf" className="p-2 rounded-lg bg-bg-surface border border-border hover:bg-bg-hover transition-colors">
              <ArrowLeft className="w-4 h-4 text-text-muted" />
            </Link>
            <div className="p-2.5 rounded-xl bg-alert-high text-bg-deep animate-status-blink">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[17px] font-bold text-text-primary">{incident.type}</h1>
                <span className="severity-badge-p1 px-2 py-0.5 rounded text-[10px] font-black uppercase">{incident.severity}</span>
              </div>
              <p className="text-[12px] text-text-muted">{incident.id} • {incident.block} {incident.unit}, {incident.estate}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] text-text-muted uppercase tracking-wider">Elapsed</p>
              <p className="text-xl font-mono font-bold text-alert-high">{elapsed}</p>
            </div>
            <button className="px-4 py-2 rounded-lg bg-alert-low text-bg-deep text-[12px] font-bold hover:bg-alert-low/80 transition-colors">
              Mark Resolved
            </button>
          </div>
        </div>
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Left — Resident Info + AI Triage */}
        <div className="space-y-4">

          {/* Resident Profile */}
          <div className="glass-elevated rounded-xl border border-border p-5">
            <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
              <User className="w-3.5 h-3.5" />
              Resident Profile
            </h3>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-cyan/20 flex items-center justify-center text-lg font-bold text-accent border border-accent/20">
                {incident.residentName.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </div>
              <div>
                <p className="text-[15px] font-bold text-text-primary">{incident.residentName}</p>
                <p className="text-[12px] text-text-muted">Age {incident.residentAge} • Unit {incident.unit} • Floor {incident.floor}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-[12px]">
              <div className="p-3 rounded-xl bg-bg-deep border border-border/30">
                <p className="text-text-muted mb-1">Mobility</p>
                <p className="text-text-primary font-bold">Limited (Walker)</p>
              </div>
              <div className="p-3 rounded-xl bg-bg-deep border border-border/30">
                <p className="text-text-muted mb-1">Medical</p>
                <p className="text-text-primary font-bold">Hypertension</p>
              </div>
              <div className="p-3 rounded-xl bg-bg-deep border border-border/30">
                <p className="text-text-muted mb-1">NOK</p>
                <p className="text-text-primary font-bold">Daughter (Notified)</p>
              </div>
              <div className="p-3 rounded-xl bg-bg-deep border border-border/30">
                <p className="text-text-muted mb-1">Participation</p>
                <p className="text-accent font-bold">Opt-In Active</p>
              </div>
            </div>
          </div>

          {/* Building Info */}
          <div className="glass-elevated rounded-xl border border-border p-5">
            <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
              <Building className="w-3.5 h-3.5" />
              Location Detail
            </h3>
            <div className="space-y-3 text-[12px]">
              <div className="flex justify-between"><span className="text-text-muted">Block</span><span className="text-text-primary font-semibold">{incident.block}</span></div>
              <div className="flex justify-between"><span className="text-text-muted">Unit</span><span className="text-text-primary font-semibold">{incident.unit}</span></div>
              <div className="flex justify-between"><span className="text-text-muted">Floor</span><span className="text-text-primary font-semibold">Level {incident.floor}</span></div>
              <div className="flex justify-between"><span className="text-text-muted">Estate</span><span className="text-text-primary font-semibold">{incident.estate}</span></div>
              <div className="flex justify-between"><span className="text-text-muted">Nearest Lift</span><span className="text-text-primary font-semibold">Lobby A (L{incident.floor})</span></div>
              <div className="flex justify-between"><span className="text-text-muted">Nearest AED</span><span className="text-accent font-semibold">{aedUnits[0].location}</span></div>
            </div>
          </div>

          {/* AI Triage */}
          <div className="glass-elevated rounded-xl border border-border p-5">
            <h3 className="text-[11px] font-bold text-accent uppercase tracking-widest mb-4 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5" />
              AI Fusion Analysis
            </h3>
            <div className="p-4 rounded-xl bg-bg-deep border border-border/40 mb-4">
              <p className="text-[12px] text-text-secondary leading-relaxed">
                <span className="text-accent font-bold">Classification:</span> {incident.aiExplanation}
              </p>
            </div>
            <div className="flex items-center justify-between text-[13px] mb-2">
              <span className="text-text-muted">Final Confidence</span>
              <span className="text-alert-high font-bold">{incident.confidence}%</span>
            </div>
            <div className="w-full h-2 bg-bg-surface rounded-full overflow-hidden mb-4">
              <div className="h-full bg-gradient-to-r from-alert-medium to-alert-high animate-confidence-fill" style={{ width: `${incident.confidence}%` }} />
            </div>
            {/* Sensor Sources */}
            <div className="flex flex-wrap gap-2">
              {incident.sensors.map((s) => {
                const SensorIcon = s === 'Acoustic' ? Volume2 : s === 'Thermal' ? Thermometer : Vibrate;
                return (
                  <span key={s} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-bg-surface border border-border text-[11px] text-text-secondary">
                    <SensorIcon className="w-3 h-3 text-accent" />
                    {s}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center — Timeline + ECG */}
        <div className="space-y-4">

          {/* Confidence Progression */}
          <div className="glass-elevated rounded-xl border border-border p-5">
            <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-4">Confidence Progression</h3>
            <div className="flex items-end justify-between gap-2 h-24 px-2">
              {confidenceProgression.map((point, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className={`text-[10px] font-bold ${point.score > 90 ? 'text-alert-high' : point.score > 75 ? 'text-alert-medium' : 'text-accent'}`}>{point.score}%</span>
                  <div className="w-full relative">
                    <div
                      className={`w-full rounded-t animate-confidence-fill ${
                        point.score > 90 ? 'bg-alert-high' : point.score > 75 ? 'bg-alert-medium' : 'bg-accent/70'
                      }`}
                      style={{ height: `${(point.score / 100) * 80}px`, animationDelay: `${i * 400}ms` }}
                    />
                  </div>
                  <span className="text-[8px] text-text-muted text-center leading-tight mt-1">{point.label.split(' ').slice(0, 2).join(' ')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Simulated ECG Telemetry */}
          <div className="glass-elevated rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-alert-high" />
                ECG Relay (Simulated)
              </h3>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-alert-high/10 text-[10px] font-bold text-alert-high animate-pulse-glow">
                <div className="w-1.5 h-1.5 rounded-full bg-alert-high" /> Live
              </span>
            </div>
            {/* CSS ECG Wave */}
            <div className="h-16 bg-bg-deep rounded-lg overflow-hidden relative border border-border/30">
              <svg viewBox="0 0 400 60" className="w-full h-full animate-ecg-sweep" preserveAspectRatio="none">
                <polyline
                  points="0,30 40,30 50,30 60,28 70,32 80,30 100,30 110,30 120,10 130,50 140,5 150,55 160,30 170,30 200,30 240,30 250,30 260,28 270,32 280,30 300,30 310,30 320,10 330,50 340,5 350,55 360,30 370,30 400,30"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="1.5"
                  opacity="0.8"
                />
              </svg>
              <div className="absolute top-2 right-3 text-[11px] font-mono text-alert-high font-bold">♥ 42 BPM</div>
              <div className="absolute bottom-2 left-3 text-[9px] text-text-muted">AED Pad Relay • Via CFR Device</div>
            </div>
          </div>

          {/* Response Timeline */}
          <div className="glass-elevated rounded-xl border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border/50 flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" />
              <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-wider">Incident Chronology</h3>
            </div>
            <div className="p-4 max-h-[450px] overflow-y-auto">
              {incidentTimeline.map((event, i) => (
                <div key={i} className="flex gap-3 relative">
                  {i < incidentTimeline.length - 1 && (
                    <div className={`absolute left-[7px] top-[16px] w-0.5 h-[calc(100%)] ${
                      event.status === 'completed' ? 'bg-accent/30' : 'bg-border/20'
                    }`} />
                  )}
                  <div className={`w-[14px] h-[14px] rounded-full flex-shrink-0 mt-0.5 z-10 ${
                    event.status === 'completed' ? 'bg-accent' :
                    event.status === 'active' ? 'bg-accent/30 border-2 border-accent animate-timeline-pulse' :
                    'bg-bg-surface border border-border'
                  }`} />
                  <div className="pb-3.5 flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-1">
                      <span className={`text-[11px] font-semibold ${event.status === 'active' ? 'text-accent' : 'text-text-primary'}`}>{event.label}</span>
                      <span className="text-[9px] font-mono text-text-muted">{event.time}</span>
                    </div>
                    <p className="text-[10px] text-text-muted mt-0.5">{event.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Responders + Actions */}
        <div className="space-y-4">

          {/* CFR Responders */}
          <div className="glass-elevated rounded-xl border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-accent" />
                <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-wider">CFR Coordination</h3>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {cfrResponders.map((cfr) => (
                <div key={cfr.id} className={`p-3 rounded-xl border transition-all ${
                  cfr.status === 'accepted' || cfr.status === 'en_route' || cfr.status === 'on_scene'
                    ? 'bg-accent/5 border-accent/20' : 'bg-bg-surface/40 border-border/30'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold ${
                        cfr.status === 'accepted' || cfr.status === 'on_scene' ? 'bg-alert-low/15 text-alert-low' :
                        cfr.status === 'en_route' ? 'bg-accent/15 text-accent' :
                        'bg-bg-surface text-text-muted'
                      }`}>
                        {cfr.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-[12px] font-semibold text-text-primary">{cfr.name}</span>
                    </div>
                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      cfr.status === 'accepted' || cfr.status === 'on_scene' ? 'bg-alert-low/15 text-alert-low' :
                      cfr.status === 'en_route' ? 'bg-accent/15 text-accent' :
                      cfr.status === 'notified' ? 'bg-alert-medium/15 text-alert-medium' :
                      'bg-bg-surface text-text-muted'
                    }`}>{cfr.status.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-text-muted">
                    <span>{cfr.distance}</span>
                    <span>ETA {cfr.eta}</span>
                    <span className="ml-auto flex gap-1">
                      {cfr.certified.map(c => (
                        <span key={c} className="px-1 py-0.5 rounded bg-bg-elevated text-text-muted font-bold text-[8px]">{c}</span>
                      ))}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AED Status Tracker */}
          <div className="glass-elevated rounded-xl border border-border p-5">
            <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
              <Heart className="w-3.5 h-3.5 text-alert-low" />
              AED Retrieval Status
            </h3>
            <div className="flex items-center justify-between gap-1 mb-4">
              {['Located', 'Retrieved', 'En Route', 'Delivered'].map((step, i) => (
                <div key={step} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold ${
                    i <= 1 ? 'bg-accent text-bg-deep' : 'bg-bg-surface border border-border text-text-muted'
                  }`}>
                    {i <= 1 ? <CheckCircle2 className="w-3 h-3" /> : i + 1}
                  </div>
                  <span className={`text-[9px] font-medium ${i <= 1 ? 'text-accent' : 'text-text-muted'}`}>{step}</span>
                  {i < 3 && <div className={`hidden sm:block absolute h-0.5 w-4 ${i < 1 ? 'bg-accent' : 'bg-border'}`} />}
                </div>
              ))}
            </div>
            <div className="p-3 rounded-lg bg-bg-deep border border-border/30 text-[11px] text-text-muted">
              <p><span className="text-accent font-semibold">AED-TP-01</span> — {aedUnits[0].location}</p>
              <p className="mt-1">CFR David Lim retrieved AED. En route to unit.</p>
            </div>
          </div>

          {/* Operator Notes */}
          <div className="glass-elevated rounded-xl border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border/50 flex items-center gap-2">
              <Info className="w-4 h-4 text-text-muted" />
              <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-wider">Operator Notes</h3>
            </div>
            <div className="p-4 max-h-48 overflow-y-auto space-y-1.5">
              {operatorNotes.map((note, i) => (
                <p key={i} className="text-[11px] text-text-secondary font-mono leading-relaxed">{note}</p>
              ))}
            </div>
            <div className="p-3 border-t border-border/40 flex gap-2">
              <input
                type="text"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addNote()}
                placeholder="Add operator note..."
                className="flex-1 px-3 py-2 rounded-lg bg-bg-deep border border-border text-[12px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50"
              />
              <button
                onClick={addNote}
                className="px-3 py-2 rounded-lg bg-accent text-bg-deep text-[12px] font-bold hover:bg-accent-bright transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
