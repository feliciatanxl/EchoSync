'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Shield, Radio, Wifi, Activity, AlertTriangle, CheckCircle2,
  Clock, MapPin, Users, Heart, Zap, ChevronRight, Send,
  CircleDot, Brain, Siren, Navigation, BatteryFull,
  Volume2, Thermometer, Move, Eye, Phone, Route, HeartPulse
} from 'lucide-react';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

type AlertSeverity = 'critical' | 'low';
type DispatchPhase = 'standby' | 'dispatched';

interface IncidentAlert {
  id: string;
  location: string;
  unit: string;
  estate: string;
  confidence: number;
  severity: AlertSeverity;
  status: string;
  tags: string[];
  detectedAt: string;
  residentAge: number;
}

interface TimelineStep {
  time: string;
  label: string;
  detail: string;
  status: 'completed' | 'active' | 'pending';
}

interface CFRResponder {
  id: string;
  name: string;
  distance: string;
  eta: string;
  certifications: string[];
  status: 'alerted' | 'accepted' | 'en_route' | 'on_scene';
}

// ──────────────────────────────────────────────
// Mock Data
// ──────────────────────────────────────────────

const incidentAlerts: IncidentAlert[] = [
  {
    id: 'INC-2026-089',
    location: 'Blk 124 Toa Payoh Silver Zone',
    unit: '#04-12',
    estate: 'Toa Payoh',
    confidence: 94,
    severity: 'critical',
    status: 'Active — Awaiting Dispatch',
    tags: ['Acoustic Impact Detected', 'Prolonged Immobility', 'Thermal Anomaly'],
    detectedAt: '18:42:05',
    residentAge: 78,
  },
  {
    id: 'INC-2026-087',
    location: 'Blk 213 Ang Mo Kio Ave 3',
    unit: '#12-441',
    estate: 'Ang Mo Kio',
    confidence: 42,
    severity: 'low',
    status: 'Resolved — Wellness Check',
    tags: ['Routine Baseline Deviation'],
    detectedAt: '14:20:00',
    residentAge: 82,
  },
  {
    id: 'INC-2026-085',
    location: 'Blk 126 Toa Payoh Lor 2',
    unit: '#11-30',
    estate: 'Toa Payoh',
    confidence: 38,
    severity: 'low',
    status: 'Resolved — Wellness Check',
    tags: ['Utility Anomaly'],
    detectedAt: '08:15:00',
    residentAge: 75,
  },
  {
    id: 'INC-2026-083',
    location: 'Blk 125 Toa Payoh Lor 1',
    unit: '#08-15',
    estate: 'Toa Payoh',
    confidence: 31,
    severity: 'low',
    status: 'Resolved — False Alarm',
    tags: ['Acoustic Noise'],
    detectedAt: '06:45:00',
    residentAge: 70,
  },
];

const baseTimeline: TimelineStep[] = [
  { time: 'T+00s', label: 'Anomaly Detected', detail: 'Acoustic impact 82dB + Thermal signature drop detected at unit #04-12', status: 'completed' },
  { time: 'T+45s', label: 'AI Confidence Verified', detail: '94% — Multi-sensor fusion: acoustic + thermal + vibration correlation', status: 'completed' },
  { time: 'T+50s', label: 'SCDF Dashboard Alerted', detail: 'P1 alert pushed to Command Center. Operator verification pending.', status: 'active' },
  { time: 'T+90s', label: 'AED Coordination Initiated', detail: 'Nearest AED located at Blk 124 Void Deck (40m). Retrieval guidance queued.', status: 'pending' },
];

const dispatchedTimeline: TimelineStep[] = [
  { time: 'T+00s', label: 'Anomaly Detected', detail: 'Acoustic impact 82dB + Thermal signature drop detected at unit #04-12', status: 'completed' },
  { time: 'T+45s', label: 'AI Confidence Verified', detail: '94% — Multi-sensor fusion: acoustic + thermal + vibration correlation', status: 'completed' },
  { time: 'T+50s', label: 'SCDF Dashboard Alerted', detail: 'P1 alert pushed to Command Center. Operator verified.', status: 'completed' },
  { time: 'T+90s', label: 'AED Coordination Initiated', detail: 'Nearest AED located at Blk 124 Void Deck (40m). CFR retrieval en route.', status: 'completed' },
  { time: 'T+120s', label: 'SCDF Dispatched & CFR Routed', detail: 'Ambulance dispatched from Fire Station 14. 2 CFRs routed via myResponder.', status: 'completed' },
  { time: 'T+180s', label: 'CFR-Assisted CPR Initiated', detail: 'David Lim arrived on scene. CPR started, AED pads applied.', status: 'active' },
];

const baseCFRs: CFRResponder[] = [
  { id: 'CFR-001', name: 'David Lim', distance: '120m', eta: '2 min', certifications: ['CPR', 'AED', 'First Aid'], status: 'alerted' },
  { id: 'CFR-002', name: 'Sarah Tan', distance: '350m', eta: '4 min', certifications: ['CPR', 'AED'], status: 'alerted' },
  { id: 'CFR-003', name: 'Raj Kumar', distance: '500m', eta: '6 min', certifications: ['CPR'], status: 'alerted' },
];

const dispatchedCFRs: CFRResponder[] = [
  { id: 'CFR-001', name: 'David Lim', distance: '120m', eta: 'On Scene', certifications: ['CPR', 'AED', 'First Aid'], status: 'on_scene' },
  { id: 'CFR-002', name: 'Sarah Tan', distance: '350m', eta: '2 min', certifications: ['CPR', 'AED'], status: 'en_route' },
  { id: 'CFR-003', name: 'Raj Kumar', distance: '500m', eta: '—', certifications: ['CPR'], status: 'alerted' },
];

// ──────────────────────────────────────────────
// Component: System Health Header
// ──────────────────────────────────────────────

function SystemHealthHeader() {
  const [nodeCount, setNodeCount] = useState(1247);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 600);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      id="system-health-header"
      className="flex items-center justify-between px-5 py-3 border-b border-border"
      style={{
        background: 'linear-gradient(90deg, rgba(10,14,26,0.95) 0%, rgba(6,10,20,0.9) 50%, rgba(10,14,26,0.95) 100%)',
      }}
    >
      {/* Left: Title */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #00d4aa 0%, #06b6d4 100%)',
            boxShadow: '0 0 20px rgba(0, 212, 170, 0.3)',
          }}
        >
          <Shield className="w-5 h-5 text-[#060a14]" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-text-primary flex items-center gap-2">
            EchoSync Command Center
            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-accent/10 text-accent tracking-widest">
              LIVE
            </span>
          </h1>
          <p className="text-[11px] text-text-muted">
            Pre-Arrival Intelligence System • Singapore Civil Defence Force
          </p>
        </div>
      </div>

      {/* Right: Node Health */}
      <div className="hidden md:flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-alert-low/8 border border-alert-low/20">
          <div className="relative">
            <div className={`w-2 h-2 rounded-full bg-alert-low transition-all duration-300 ${pulse ? 'scale-150 opacity-60' : 'scale-100 opacity-100'}`} />
          </div>
          <span className="text-[12px] font-semibold text-alert-low">
            {nodeCount.toLocaleString()} Edge Nodes Active
          </span>
          <span className="text-[10px] text-text-muted">—</span>
          <span className="text-[11px] font-bold text-alert-low">100% Connectivity</span>
        </div>

        <div className="flex items-center gap-3 text-[10px] text-text-muted">
          <span className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-accent" />
            Primary
          </span>
          <span className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-cyan" />
            LTE Backup
          </span>
          <span className="flex items-center gap-1.5">
            <BatteryFull className="w-3.5 h-3.5 text-alert-low" />
            87% Avg
          </span>
        </div>
      </div>
    </header>
  );
}

// ──────────────────────────────────────────────
// Component: Confidence Badge
// ──────────────────────────────────────────────

function ConfidenceBadge({ score, severity }: { score: number; severity: AlertSeverity }) {
  const label = score >= 80 ? 'High Confidence' : score >= 50 ? 'Medium' : 'Low';
  const colorClass =
    severity === 'critical'
      ? 'text-alert-high bg-alert-high/12 border-alert-high/30'
      : 'text-text-muted bg-bg-surface/60 border-border/40';

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] font-bold ${colorClass}`}>
      {score}% {label}
    </span>
  );
}

// ──────────────────────────────────────────────
// Component: XAI Tag
// ──────────────────────────────────────────────

function XaiTag({ label }: { label: string }) {
  const iconMap: Record<string, React.ReactNode> = {
    'Acoustic Impact Detected': <Volume2 className="w-3 h-3" />,
    'Prolonged Immobility': <Move className="w-3 h-3" />,
    'Thermal Anomaly': <Thermometer className="w-3 h-3" />,
    'Routine Baseline Deviation': <Activity className="w-3 h-3" />,
    'Utility Anomaly': <Zap className="w-3 h-3" />,
    'Acoustic Noise': <Volume2 className="w-3 h-3" />,
  };

  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-bg-surface/80 border border-border/40 text-[10px] font-medium text-text-secondary">
      {iconMap[label] || <Brain className="w-3 h-3" />}
      {label}
    </span>
  );
}

// ──────────────────────────────────────────────
// Component: Incident Feed (Left Sidebar)
// ──────────────────────────────────────────────

function IncidentFeed({
  alerts,
  selectedId,
  onSelect,
}: {
  alerts: IncidentAlert[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <aside
      id="incident-feed-sidebar"
      className="w-full h-full flex flex-col border-r border-border/60 bg-bg-primary/50"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-alert-high" />
          <h2 className="text-[13px] font-bold text-text-primary uppercase tracking-wider">
            Incident Feed
          </h2>
        </div>
        <span className="text-[10px] font-bold text-alert-high bg-alert-high/10 px-2 py-0.5 rounded-full animate-pulse-glow">
          {alerts.filter(a => a.severity === 'critical').length} ACTIVE
        </span>
      </div>

      {/* Scrollable Alert List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
        {alerts.map((alert, i) => {
          const isSelected = alert.id === selectedId;
          const isCritical = alert.severity === 'critical';

          return (
            <button
              key={alert.id}
              id={`incident-card-${alert.id}`}
              onClick={() => onSelect(alert.id)}
              className={`w-full text-left rounded-xl p-3 transition-all duration-300 cursor-pointer group relative overflow-hidden animate-fade-in ${
                isSelected
                  ? isCritical
                    ? 'bg-alert-high/10 border border-alert-high/40 shadow-[0_0_16px_rgba(239,68,68,0.12)]'
                    : 'bg-accent/8 border border-accent/30'
                  : 'bg-bg-elevated/40 border border-border/30 hover:bg-bg-elevated/70 hover:border-border/60'
              }`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Critical pulse glow */}
              {isCritical && isSelected && (
                <div className="absolute inset-0 bg-gradient-to-r from-alert-high/5 to-transparent pointer-events-none" />
              )}

              <div className="relative z-10">
                {/* Top row: Severity + ID */}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      isCritical ? 'bg-alert-high shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-status-blink' : 'bg-alert-low/60'
                    }`} />
                    <span className={`text-[10px] font-black uppercase tracking-wider ${
                      isCritical ? 'text-alert-high' : 'text-text-muted'
                    }`}>
                      {isCritical ? 'CRITICAL' : 'LOW'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-text-muted">{alert.id}</span>
                </div>

                {/* Location */}
                <p className={`text-[12px] font-semibold mb-0.5 ${isCritical ? 'text-text-primary' : 'text-text-secondary'}`}>
                  {alert.location}, Unit {alert.unit}
                </p>

                {/* Confidence */}
                <div className="mb-2">
                  <ConfidenceBadge score={alert.confidence} severity={alert.severity} />
                </div>

                {/* XAI Tags */}
                <div className="flex flex-wrap gap-1">
                  {alert.tags.map(tag => (
                    <XaiTag key={tag} label={tag} />
                  ))}
                </div>

                {/* Status line */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/30">
                  <span className="text-[10px] text-text-muted flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {alert.detectedAt}
                  </span>
                  <span className={`text-[10px] font-medium ${
                    isCritical ? 'text-alert-high' : 'text-alert-low'
                  }`}>
                    {alert.status}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

// ──────────────────────────────────────────────
// Component: Timeline Step
// ──────────────────────────────────────────────

function TimelineStepItem({ step, isLast, index }: { step: TimelineStep; isLast: boolean; index: number }) {
  return (
    <div
      className="flex items-start gap-3 relative animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Vertical connector */}
      {!isLast && (
        <div className={`absolute left-[11px] top-[24px] w-0.5 h-[calc(100%-4px)] transition-colors duration-500 ${
          step.status === 'completed' ? 'bg-accent/40' : 'bg-border/30'
        }`} />
      )}

      {/* Node dot */}
      <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 z-10 ${
        step.status === 'completed'
          ? 'bg-accent text-bg-deep'
          : step.status === 'active'
          ? 'bg-accent/20 border-2 border-accent animate-timeline-pulse'
          : 'bg-bg-surface border border-border/60'
      }`}>
        {step.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
        {step.status === 'active' && <div className="w-2 h-2 rounded-full bg-accent" />}
      </div>

      {/* Content */}
      <div className={`pb-5 transition-opacity duration-500 flex-1 ${step.status === 'pending' ? 'opacity-30' : 'opacity-100'}`}>
        <div className="flex items-baseline gap-2 mb-0.5">
          <span className="text-[10px] font-mono font-bold text-text-muted tracking-wider">{step.time}</span>
          <span className={`text-[13px] font-semibold ${
            step.status === 'active' ? 'text-accent' : 'text-text-primary'
          }`}>
            {step.label}
          </span>
        </div>
        <p className="text-[11px] text-text-secondary leading-relaxed">{step.detail}</p>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Component: Center Panel (Incident Details)
// ──────────────────────────────────────────────

function IncidentDetailPanel({
  alert,
  phase,
  onDispatch,
  timeline,
}: {
  alert: IncidentAlert;
  phase: DispatchPhase;
  onDispatch: () => void;
  timeline: TimelineStep[];
}) {
  const isCritical = alert.severity === 'critical';

  return (
    <section
      id="incident-detail-panel"
      className="w-full h-full flex flex-col overflow-hidden"
    >
      {/* Panel Header */}
      <div className="px-5 py-3 border-b border-border/50 flex items-center justify-between flex-shrink-0 bg-bg-primary/30">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-accent" />
          <h2 className="text-[13px] font-bold text-text-primary uppercase tracking-wider">
            Active Incident Details
          </h2>
        </div>
        {isCritical && (
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-alert-high/10 text-[10px] font-bold text-alert-high animate-pulse-glow">
            <div className="w-1.5 h-1.5 rounded-full bg-alert-high" />
            {phase === 'dispatched' ? 'RESPONSE ACTIVE' : 'AWAITING DISPATCH'}
          </span>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {isCritical ? (
          <div className="p-5 space-y-5">
            {/* Incident Summary Card */}
            <div className="glass-elevated rounded-xl p-4 border border-alert-high/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-alert-high/5 to-transparent pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-1.5 py-0.5 rounded bg-alert-high/15 text-alert-high text-[10px] font-black uppercase">
                        P1 Critical
                      </span>
                      <span className="text-[11px] font-mono text-text-muted">{alert.id}</span>
                    </div>
                    <h3 className="text-[16px] font-bold text-text-primary">Heavy Fall Detected</h3>
                    <p className="text-[12px] text-text-secondary mt-0.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-text-muted" />
                      {alert.location}, Unit {alert.unit}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[24px] font-black text-alert-high leading-none">{alert.confidence}%</p>
                    <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wider mt-0.5">
                      AI Confidence
                    </p>
                  </div>
                </div>

                {/* Sensor Fusion Breakdown */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { icon: Volume2, label: 'Acoustic', value: '82dB Impact', color: 'text-alert-high' },
                    { icon: Thermometer, label: 'Thermal', value: 'Horizontal Posture', color: 'text-alert-medium' },
                    { icon: Move, label: 'Vibration', value: 'Floor Impact', color: 'text-cyan' },
                  ].map(sensor => {
                    const Icon = sensor.icon;
                    return (
                      <div key={sensor.label} className="bg-bg-surface/50 rounded-lg p-2.5 border border-border/30">
                        <Icon className={`w-4 h-4 ${sensor.color} mb-1`} />
                        <p className="text-[10px] text-text-muted font-semibold uppercase">{sensor.label}</p>
                        <p className="text-[11px] text-text-primary font-medium">{sensor.value}</p>
                      </div>
                    );
                  })}
                </div>

                {/* XAI Reasoning */}
                <div className="bg-bg-surface/40 rounded-lg p-3 border border-border/20">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Brain className="w-3.5 h-3.5 text-accent" />
                    <span className="text-[10px] font-bold text-accent uppercase tracking-wider">Explainable AI Reasoning</span>
                  </div>
                  <p className="text-[11px] text-text-secondary leading-relaxed">
                    Impact anomaly (<span className="text-text-primary font-semibold">82dB</span>) combined with sustained horizontal thermal
                    signature ({'>'}<span className="text-text-primary font-semibold">90s</span>) and no subsequent movement detected.
                    Multi-sensor fusion classifies as <span className="text-alert-high font-semibold">Heavy Fall — High Confidence</span>.
                  </p>
                </div>
              </div>
            </div>

            {/* Incident Timeline */}
            <div className="glass-elevated rounded-xl border border-border overflow-hidden">
              <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2">
                <Activity className="w-4 h-4 text-accent" />
                <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-wider">
                  Incident Timeline
                </h3>
              </div>
              <div className="p-4">
                {timeline.map((step, i) => (
                  <TimelineStepItem
                    key={`${step.time}-${step.label}`}
                    step={step}
                    isLast={i === timeline.length - 1}
                    index={i}
                  />
                ))}
              </div>
            </div>

            {/* Dispatch Action Button */}
            <div className="flex items-center justify-center pt-2">
              {phase === 'standby' ? (
                <button
                  id="dispatch-button"
                  onClick={onDispatch}
                  className="group relative w-full max-w-md px-6 py-4 rounded-xl font-bold text-[14px] text-white cursor-pointer overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(239,68,68,0.3)] active:scale-[0.98]"
                  style={{
                    background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%)',
                    boxShadow: '0 4px 24px rgba(239, 68, 68, 0.25), inset 0 1px 0 rgba(255,255,255,0.15)',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <div className="flex items-center justify-center gap-3 relative z-10">
                    <Siren className="w-5 h-5" />
                    <span>Dispatch SCDF & Route CFR via myResponder</span>
                    <Send className="w-4 h-4" />
                  </div>
                </button>
              ) : (
                <div className="w-full max-w-md px-6 py-4 rounded-xl border border-alert-low/30 bg-alert-low/8 text-center animate-fade-in">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <CheckCircle2 className="w-5 h-5 text-alert-low" />
                    <span className="text-[14px] font-bold text-alert-low">Dispatch Confirmed</span>
                  </div>
                  <p className="text-[11px] text-text-muted">
                    SCDF Ambulance en route • CFR David Lim on scene — CPR in progress
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Non-critical selected: simpler view */
          <div className="p-5 space-y-4">
            <div className="glass-elevated rounded-xl p-4 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-1.5 py-0.5 rounded bg-bg-surface/60 text-text-muted text-[10px] font-black uppercase">
                  LOW
                </span>
                <span className="text-[11px] font-mono text-text-muted">{alert.id}</span>
              </div>
              <h3 className="text-[15px] font-bold text-text-primary mb-1">Wellness Check</h3>
              <p className="text-[12px] text-text-secondary flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-text-muted" />
                {alert.location}, Unit {alert.unit}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <ConfidenceBadge score={alert.confidence} severity={alert.severity} />
                <span className="text-[11px] text-alert-low font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Resolved
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {alert.tags.map(tag => <XaiTag key={tag} label={tag} />)}
              </div>
            </div>
            <div className="text-center text-[12px] text-text-muted pt-4">
              <p>This incident has been resolved. No further action required.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────
// Component: CFR Status Card
// ──────────────────────────────────────────────

function CFRStatusCard({ cfr }: { cfr: CFRResponder }) {
  const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
    alerted: { label: 'Alerted', color: 'text-alert-medium', bgColor: 'bg-alert-medium/12' },
    accepted: { label: 'Accepted', color: 'text-accent', bgColor: 'bg-accent/12' },
    en_route: { label: 'En Route', color: 'text-cyan', bgColor: 'bg-cyan/12' },
    on_scene: { label: 'On Scene', color: 'text-alert-low', bgColor: 'bg-alert-low/12' },
  };

  const config = statusConfig[cfr.status] || statusConfig.alerted;

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-bg-elevated/50 border border-border/30 transition-all duration-300 hover:border-border/60">
      {/* Avatar */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border ${
        cfr.status === 'on_scene'
          ? 'bg-gradient-to-br from-alert-low/20 to-accent/20 border-alert-low/30'
          : cfr.status === 'en_route'
          ? 'bg-gradient-to-br from-cyan/20 to-accent/20 border-cyan/30'
          : 'bg-gradient-to-br from-accent/15 to-cyan/15 border-accent/20'
      }`}>
        {cfr.status === 'on_scene' ? (
          <HeartPulse className="w-4 h-4 text-alert-low animate-pulse" />
        ) : cfr.status === 'en_route' ? (
          <Navigation className="w-4 h-4 text-cyan" />
        ) : (
          <span className="text-[10px] font-bold text-accent">
            {cfr.name.split(' ').map(n => n[0]).join('')}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-semibold text-text-primary truncate">{cfr.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${config.bgColor} ${config.color}`}>
            {config.label}
          </span>
          <span className="text-[10px] text-text-muted">
            {cfr.status === 'on_scene' ? 'CPR Active' : `ETA ${cfr.eta}`}
          </span>
        </div>
      </div>

      {/* Certs */}
      <div className="flex gap-1 flex-shrink-0">
        {cfr.certifications.map(cert => (
          <span key={cert} className="text-[8px] px-1 py-0.5 rounded bg-bg-surface border border-border/40 text-text-muted font-bold uppercase">
            {cert}
          </span>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Component: Responder & AED Sidebar (Right)
// ──────────────────────────────────────────────

function ResponderSidebar({
  cfrs,
  phase,
}: {
  cfrs: CFRResponder[];
  phase: DispatchPhase;
}) {
  return (
    <aside
      id="responder-sidebar"
      className="w-full h-full flex flex-col border-l border-border/60 bg-bg-primary/50"
    >
      {/* CFR Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-accent" />
            <h2 className="text-[13px] font-bold text-text-primary uppercase tracking-wider">
              CFR Status
            </h2>
          </div>
          <span className="text-[10px] text-text-muted font-semibold">
            {cfrs.filter(c => c.status === 'accepted' || c.status === 'en_route' || c.status === 'on_scene').length} Responding
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
          {/* Summary Bar */}
          <div className="rounded-lg bg-bg-surface/40 border border-border/30 p-3 mb-1">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-3.5 h-3.5 text-accent" />
              <span className="text-[11px] font-bold text-text-primary">Community First Responders</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-[16px] font-bold text-accent">{cfrs.filter(c => c.status === 'alerted').length}</p>
                <p className="text-[9px] text-text-muted uppercase font-semibold">Alerted</p>
              </div>
              <div>
                <p className="text-[16px] font-bold text-cyan">
                  {cfrs.filter(c => c.status === 'en_route' || c.status === 'accepted').length}
                </p>
                <p className="text-[9px] text-text-muted uppercase font-semibold">En Route</p>
              </div>
              <div>
                <p className="text-[16px] font-bold text-alert-low">
                  {cfrs.filter(c => c.status === 'on_scene').length}
                </p>
                <p className="text-[9px] text-text-muted uppercase font-semibold">On Scene</p>
              </div>
            </div>
          </div>

          {/* Individual CFR cards */}
          {cfrs.map(cfr => (
            <CFRStatusCard key={cfr.id} cfr={cfr} />
          ))}
        </div>
      </div>

      {/* AED Section */}
      <div className="border-t border-border/50 flex-shrink-0">
        <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2">
          <Zap className="w-4 h-4 text-alert-medium" />
          <h2 className="text-[13px] font-bold text-text-primary uppercase tracking-wider">
            AED Staging
          </h2>
        </div>
        <div className="px-3 py-3">
          <div className="rounded-xl bg-bg-elevated/50 border border-border/30 p-3 relative overflow-hidden">
            {phase === 'dispatched' && (
              <div className="absolute inset-0 bg-gradient-to-r from-alert-low/5 to-transparent pointer-events-none" />
            )}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase text-text-muted tracking-wider">
                  Nearest AED
                </span>
                <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                  phase === 'dispatched'
                    ? 'bg-alert-low/12 text-alert-low'
                    : 'bg-accent/12 text-accent'
                }`}>
                  {phase === 'dispatched' ? 'Retrieved' : 'Available'}
                </span>
              </div>
              <p className="text-[12px] font-semibold text-text-primary">Blk 124 Void Deck</p>
              <p className="text-[11px] text-text-secondary mt-0.5">HDB Corridor AED Station</p>
              <div className="flex items-center gap-3 mt-2 text-[10px] text-text-muted">
                <span className="flex items-center gap-1">
                  <Route className="w-3 h-3" />
                  40m from unit
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Checked 2 days ago
                </span>
              </div>
              {phase === 'dispatched' && (
                <div className="mt-2 pt-2 border-t border-border/30">
                  <p className="text-[10px] text-alert-low font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    AED retrieved by CFR David Lim — pads applied
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Secondary AED */}
          <div className="rounded-xl bg-bg-surface/30 border border-border/20 p-3 mt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase text-text-muted tracking-wider">
                Backup AED
              </span>
              <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-bg-surface text-text-muted">
                Available
              </span>
            </div>
            <p className="text-[12px] font-semibold text-text-secondary">Blk 125 CC Office</p>
            <span className="text-[10px] text-text-muted flex items-center gap-1 mt-1">
              <Route className="w-3 h-3" />
              180m from unit
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ──────────────────────────────────────────────
// Main Dashboard Page
// ──────────────────────────────────────────────

export default function CommandCenterDashboard() {
  const [selectedAlertId, setSelectedAlertId] = useState<string>('INC-2026-089');
  const [phase, setPhase] = useState<DispatchPhase>('standby');
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleDispatch = useCallback(() => {
    setPhase('dispatched');
  }, []);

  const selectedAlert = incidentAlerts.find(a => a.id === selectedAlertId) || incidentAlerts[0];
  const currentTimeline = phase === 'dispatched' ? dispatchedTimeline : baseTimeline;
  const currentCFRs = phase === 'dispatched' ? dispatchedCFRs : baseCFRs;

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -m-4 sm:-m-8 animate-fade-in">
      {/* Top System Health Header */}
      <SystemHealthHeader />

      {/* 3-Column Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Incident Feed */}
        <div className="hidden lg:flex w-[340px] flex-shrink-0">
          <IncidentFeed
            alerts={incidentAlerts}
            selectedId={selectedAlertId}
            onSelect={setSelectedAlertId}
          />
        </div>

        {/* Center: Active Incident Details */}
        <div className="flex-1 min-w-0 border-x border-border/30">
          <IncidentDetailPanel
            alert={selectedAlert}
            phase={selectedAlert.severity === 'critical' ? phase : 'standby'}
            onDispatch={handleDispatch}
            timeline={currentTimeline}
          />
        </div>

        {/* Right: Responder & AED Status */}
        <div className="hidden xl:flex w-[320px] flex-shrink-0">
          <ResponderSidebar cfrs={currentCFRs} phase={phase} />
        </div>
      </div>

      {/* Mobile: Collapsible panels (responsive fallback) */}
      <div className="lg:hidden border-t border-border/50">
        <details className="group">
          <summary className="px-4 py-3 flex items-center justify-between cursor-pointer bg-bg-elevated/40">
            <span className="text-[12px] font-bold text-text-primary flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-alert-high" />
              Incident Feed ({incidentAlerts.length})
            </span>
            <ChevronRight className="w-4 h-4 text-text-muted group-open:rotate-90 transition-transform" />
          </summary>
          <div className="max-h-80 overflow-y-auto">
            <IncidentFeed
              alerts={incidentAlerts}
              selectedId={selectedAlertId}
              onSelect={setSelectedAlertId}
            />
          </div>
        </details>
      </div>

      <div className="xl:hidden border-t border-border/50">
        <details className="group">
          <summary className="px-4 py-3 flex items-center justify-between cursor-pointer bg-bg-elevated/40">
            <span className="text-[12px] font-bold text-text-primary flex items-center gap-2">
              <Heart className="w-4 h-4 text-accent" />
              Responders & AED
            </span>
            <ChevronRight className="w-4 h-4 text-text-muted group-open:rotate-90 transition-transform" />
          </summary>
          <div className="max-h-96 overflow-y-auto">
            <ResponderSidebar cfrs={currentCFRs} phase={phase} />
          </div>
        </details>
      </div>
    </div>
  );
}
