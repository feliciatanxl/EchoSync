'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import {
  Shield, Bell, MessageSquare, Radio, ClipboardList, User, Settings,
  Search, Flag, FlagOff, MapPin, Clock,
  Send, CheckCircle2,
  AlertTriangle, Flame, HeartPulse, Wind, Activity,
  Megaphone, X, Plus
} from 'lucide-react';

// Dynamic import of Leaflet map (SSR-safe)
const IncidentMap = dynamic(() => import('./IncidentMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-400 font-medium">Loading Map...</p>
      </div>
    </div>
  ),
});

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

type Severity = 'Critical' | 'High' | 'Medium' | 'Low';
type IncidentStatus = 'Active' | 'Dispatched' | 'En Route' | 'On Scene' | 'Resolved';

interface OpsLogEntry {
  time: string;
  title: string;
  description: string;
  source: string;
}

type GlobalOpsLogEntry = OpsLogEntry & {
  incidentId: string;
  incidentType: string;
  location: string;
};

interface Incident {
  id: string;
  type: string;
  location: string;
  elapsedTime: string;
  severity: Severity;
  flagged: boolean;
  status: IncidentStatus;
  assignedUnit: string;
  lastUpdated: string;
  lat: number;
  lng: number;
  description: string;
  evidence: string[];
  opsLog: OpsLogEntry[];
}

// ─────────────────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────────────────

const initialIncidents: Incident[] = [
  {
    id: 'INC-2026-089',
    type: 'Medical',
    location: 'Blk 124 Tampines Ave 4, #04-12',
    elapsedTime: '00:08:22',
    severity: 'Critical',
    flagged: true,
    status: 'Dispatched',
    assignedUnit: 'AMB-14',
    lastUpdated: '19:50',
    lat: 1.3521,
    lng: 103.9448,
    description: 'Suspected heart attack. Elderly resident collapsed in kitchen. AI audio check-in detected distress sounds and no verbal response.',
    evidence: [
      'Impact sound detected (72dB)',
      'No movement for 8 min',
      'Voice check-in failed'
    ],
    opsLog: [
      { time: '19:42', title: '995 Call Received', description: 'Caller reports elderly male collapsed in kitchen. No pulse detected by neighbour.', source: '995 call record' },
      { time: '19:43', title: 'Dispatcher Assigned', description: 'Dispatcher Tan W.L. handling case. Priority 1 classification confirmed.', source: 'Command Centre' },
      { time: '19:44', title: 'SCDF Unit Dispatched', description: 'AMB-14 dispatched from Tampines Fire Station.', source: 'Dispatch system' },
      { time: '19:47', title: 'Responder En Route', description: 'AMB-14 en route via Tampines Expressway. ETA updated to 4 min.', source: 'Vehicle update' },
      { time: '19:48', title: 'CFR Alerted', description: '3 nearby Community First Responders notified via myResponder-style workflow.', source: 'CFR network' },
      { time: '19:50', title: 'CFR Accepted', description: 'David Lim accepted. CPR/AED certified. 120m from incident. ETA 2 min.', source: 'CFR app' },
    ],
  },
  {
    id: 'INC-2026-088',
    type: 'Fire',
    location: 'Blk 302 Ang Mo Kio Ave 3, #11-08',
    elapsedTime: '00:14:05',
    severity: 'High',
    flagged: false,
    status: 'On Scene',
    assignedUnit: 'ENG-07',
    lastUpdated: '19:48',
    lat: 1.3691,
    lng: 103.8454,
    description: 'Kitchen fire reported. Smoke detected near service yard. Neighbours on floors 10-12 have been alerted for precautionary evacuation.',
    evidence: [
      'Smoke pattern detected',
      'Rapid thermal increase',
      'Multiple 995 cross-reports'
    ],
    opsLog: [
      { time: '19:38', title: '995 Call Received', description: 'Multiple callers report smoke from kitchen unit on 11th floor, Blk 302.', source: '995 call record' },
      { time: '19:39', title: 'Dispatcher Assigned', description: 'Dispatcher Lee K.H. handling case. Classified as structural fire.', source: 'Command Centre' },
      { time: '19:40', title: 'SCDF Units Dispatched', description: 'ENG-07 and LDR-03 dispatched from Ang Mo Kio Fire Station.', source: 'Dispatch system' },
      { time: '19:44', title: 'Units En Route', description: 'Both units en route. Police notified for crowd control.', source: 'Vehicle update' },
      { time: '19:45', title: 'On Scene', description: 'ENG-07 arrived. Kitchen fire confirmed, contained to single unit.', source: 'Unit update' },
      { time: '19:48', title: 'Fire Extinguished', description: 'Fire extinguished. Ventilation in progress. No casualties reported.', source: 'Commander log' },
    ],
  },
  {
    id: 'INC-2026-087',
    type: 'Fall Detection',
    location: 'Blk 518 Jurong West St 52, #03-44',
    elapsedTime: '00:22:10',
    severity: 'Medium',
    flagged: false,
    status: 'En Route',
    assignedUnit: 'AMB-22',
    lastUpdated: '19:41',
    lat: 1.3404,
    lng: 103.7058,
    description: 'Fall impact detected in living room. Resident has not responded to voice check-in. EchoSync edge sensors confirmed prolonged immobility.',
    evidence: [
      'Acoustic impact (78dB)',
      'Sustained floor vibration',
      'Thermal posture anomaly'
    ],
    opsLog: [
      { time: '19:30', title: 'EchoSync Alert', description: 'Edge AI detected heavy fall — acoustic impact 78dB + sustained floor vibration.', source: 'EchoSync Sensor' },
      { time: '19:31', title: 'AI Confidence Verified', description: '88% confidence score. Thermal signature shows horizontal posture >90s.', source: 'EchoSync Edge' },
      { time: '19:32', title: 'Voice Check-In Failed', description: 'Automated voice check-in attempted. No verbal response from resident.', source: 'EchoSync Gateway' },
      { time: '19:33', title: 'Operator Verified', description: 'Dispatcher confirmed alert. Dispatch initiated as welfare/medical.', source: 'Command Centre' },
      { time: '19:35', title: 'SCDF Unit Dispatched', description: 'AMB-22 dispatched from Jurong Fire Station.', source: 'Dispatch system' },
      { time: '19:41', title: 'Responder En Route', description: 'AMB-22 en route via AYE. ETA 6 min.', source: 'Vehicle update' },
    ],
  },
  {
    id: 'INC-2026-086',
    type: 'Unresponsive Resident',
    location: 'Blk 411 Bedok North Ave 2, #08-15',
    elapsedTime: '00:35:00',
    severity: 'Medium',
    flagged: true,
    status: 'Active',
    assignedUnit: 'Unassigned',
    lastUpdated: '19:30',
    lat: 1.3236,
    lng: 103.9273,
    description: 'No movement detected after repeated audio check-ins. Caregiver unable to reach resident by phone. Last known activity was 4 hours ago.',
    evidence: [
      '0 movement for 4 hours',
      'Normal routine deviation',
      '3 check-ins failed'
    ],
    opsLog: [
      { time: '19:17', title: 'EchoSync Alert', description: 'No movement detected for 4 hours during expected active period (1500–1900).', source: 'EchoSync Sensor' },
      { time: '19:20', title: 'Check-In Attempts', description: '3 automated voice check-ins attempted. No response received.', source: 'EchoSync Gateway' },
      { time: '19:22', title: 'Caregiver Notified', description: 'Registered caregiver contacted. Unable to reach resident by phone.', source: 'Automated SMS' },
      { time: '19:25', title: 'Neighbour Contacted', description: 'Community volunteer checked. No response at door. Lights appear off.', source: 'Volunteer app' },
      { time: '19:28', title: 'Escalated to SCDF', description: 'Case escalated for forced entry assessment and welfare check.', source: 'Command Centre' },
      { time: '19:30', title: 'Pending Assignment', description: 'Awaiting available unit. Priority queued behind active P1 cases.', source: 'Dispatch system' },
    ],
  },
  {
    id: 'INC-2026-085',
    type: 'Gas Leak',
    location: 'Blk 789 Woodlands Crescent, #06-22',
    elapsedTime: '00:05:30',
    severity: 'High',
    flagged: false,
    status: 'Dispatched',
    assignedUnit: 'HAZMAT-02',
    lastUpdated: '19:49',
    lat: 1.4360,
    lng: 103.7860,
    description: 'Possible gas leak reported. Strong smell detected by multiple residents on floors 5-7. Residents advised to evacuate while SCDF unit is dispatched.',
    evidence: [
      'Multiple public reports',
      'Corridor VOC elevation',
      'Pattern matches leak'
    ],
    opsLog: [
      { time: '19:46', title: '995 Call Received', description: 'Resident reports strong gas smell in corridor. 3 additional calls from same block.', source: '995 call record' },
      { time: '19:47', title: 'Dispatcher Assigned', description: 'Dispatcher Ahmad R. handling case. HAZMAT protocol activated.', source: 'Command Centre' },
      { time: '19:47', title: 'Evacuation Advisory', description: 'Residents on floors 5-7 advised to evacuate to void deck assembly point.', source: 'Command Centre' },
      { time: '19:48', title: 'HAZMAT Dispatched', description: 'HAZMAT-02 dispatched from Woodlands Fire Station. ETA 5 min.', source: 'Dispatch system' },
      { time: '19:49', title: 'SP Group Notified', description: 'SP Group gas supply team alerted for upstream isolation if needed.', source: 'Inter-agency link' },
    ],
  },
];

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────

function severityColor(s: Severity) {
  switch (s) {
    case 'Critical': return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', dot: 'bg-red-500', ring: 'ring-red-200' };
    case 'High': return { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300', dot: 'bg-orange-500', ring: 'ring-orange-200' };
    case 'Medium': return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300', dot: 'bg-amber-500', ring: 'ring-amber-200' };
    case 'Low': return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', dot: 'bg-green-500', ring: 'ring-green-200' };
  }
}

function statusColor(s: IncidentStatus) {
  switch (s) {
    case 'Active': return 'text-red-600 bg-red-50';
    case 'Dispatched': return 'text-blue-600 bg-blue-50';
    case 'En Route': return 'text-cyan-600 bg-cyan-50';
    case 'On Scene': return 'text-emerald-600 bg-emerald-50';
    case 'Resolved': return 'text-slate-500 bg-slate-100';
  }
}

function typeIcon(type: string) {
  switch (type) {
    case 'Medical': return <HeartPulse className="w-4 h-4" />;
    case 'Fire': return <Flame className="w-4 h-4" />;
    case 'Fall Detection': return <Activity className="w-4 h-4" />;
    case 'Unresponsive Resident': return <AlertTriangle className="w-4 h-4" />;
    case 'Gas Leak': return <Wind className="w-4 h-4" />;
    default: return <AlertTriangle className="w-4 h-4" />;
  }
}

// ─────────────────────────────────────────────────────────
// Top Navigation Bar (48px)
// ─────────────────────────────────────────────────────────

function TopNav() {
  return (
    <header className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-4 flex-shrink-0 z-30">
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <div className="leading-none">
            <span className="text-[13px] font-bold text-slate-900 tracking-tight">EchoSync</span>
            <span className="text-[9px] text-slate-400 font-medium block -mt-0.5">Command Center</span>
          </div>
        </div>
        <div className="hidden md:block h-5 w-px bg-slate-200" />
        <h1 className="hidden md:block text-[13px] font-semibold text-slate-500">Emergency Operations Dashboard</h1>
      </div>
      <div className="flex items-center gap-0.5">
        <button className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors" title="Search">
          <Search className="w-4 h-4" />
        </button>
        <button className="relative p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors" title="Notifications">
          <Bell className="w-4 h-4" />
          <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-white" />
        </button>
        <button className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors" title="Chats">
          <MessageSquare className="w-4 h-4" />
        </button>
        <button className="relative p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors" title="Broadcast">
          <Megaphone className="w-4 h-4" />
          <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-white" />
        </button>
        <button className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors" title="Ops Log">
          <ClipboardList className="w-4 h-4" />
        </button>
        <div className="h-5 w-px bg-slate-200 mx-1" />
        <button className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors" title="Profile">
          <User className="w-4 h-4" />
        </button>
        <button className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors" title="Settings">
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────
// Incident Card
// ─────────────────────────────────────────────────────────

function IncidentCard({
  incident,
  isSelected,
  onSelect,
  onToggleFlag,
}: {
  incident: Incident;
  isSelected: boolean;
  onSelect: () => void;
  onToggleFlag: () => void;
}) {
  const sev = severityColor(incident.severity);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`w-full text-left rounded-lg border p-2.5 transition-all duration-150 group cursor-pointer ${
        isSelected
          ? `${sev.bg} bg-opacity-30 ${sev.border} ring-1 ${sev.ring}`
          : 'bg-white border-slate-150 hover:bg-slate-50 hover:border-slate-300'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-md ${sev.bg} ${sev.text} flex items-center justify-center flex-shrink-0 shadow-sm border border-white/50`}>
            {typeIcon(incident.type)}
          </div>
          <div>
            <p className="text-[13px] font-bold text-slate-900 leading-tight tracking-tight">{incident.type}</p>
            <p className="text-[10px] font-mono font-medium text-slate-400">{incident.id}</p>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFlag(); }}
          className={`p-1 rounded-md border transition-colors ${
            incident.flagged
              ? 'text-red-600 bg-red-50 border-red-200 hover:bg-red-100'
              : 'text-red-300 bg-red-50/40 border-red-100 hover:bg-red-50'
          }`}
          title={incident.flagged ? 'Unflag' : 'Flag'}
        >
          {incident.flagged ? <Flag className="w-3 h-3" /> : <FlagOff className="w-3 h-3" />}
        </button>
      </div>
      <div className="flex items-center gap-1.5 mb-2.5 bg-slate-50/50 p-1.5 rounded-md border border-slate-100">
        <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
        <p className="text-[10.5px] font-medium text-slate-600 truncate">{incident.location}</p>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-slate-400" />
          <div className="flex items-baseline gap-1">
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Elapsed</span>
            <span className="text-[10.5px] font-mono font-bold text-slate-700">{incident.elapsedTime}</span>
          </div>
        </div>
        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border border-white shadow-sm ${sev.bg} ${sev.text}`}>
          {incident.severity}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Floating Notification Toast
// ─────────────────────────────────────────────────────────

function NotificationToast({
  incident,
  acknowledged,
  onAcknowledge,
  onDismiss,
}: {
  incident: Incident;
  acknowledged: boolean;
  onAcknowledge: () => void;
  onDismiss: () => void;
}) {
  const sev = severityColor(incident.severity);

  const content = (
    <div className={`fixed bottom-4 right-4 z-[100] w-[min(380px,calc(100vw-32px))] max-h-[min(220px,calc(100dvh-96px))] rounded-xl border shadow-2xl overflow-hidden transition-all duration-500 2xl:bottom-6 2xl:right-6 2xl:w-[min(420px,calc(100vw-32px))] ${
      acknowledged ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200'
    }`}>
      <div className={`h-0.5 ${acknowledged ? 'bg-emerald-500' : sev.dot}`} />
      <div className="p-3.5">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-1.5">
            {acknowledged ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            ) : (
              <div className="relative flex-shrink-0">
                <Bell className="w-3.5 h-3.5 text-red-500" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
              </div>
            )}
            <span className={`text-[9px] font-bold uppercase tracking-wider ${
              acknowledged ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {acknowledged ? 'Acknowledged' : `${incident.severity} Alert`}
            </span>
          </div>
          <button
            onClick={onDismiss}
            className="p-0.5 rounded text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
        <p className="text-[11px] font-medium text-slate-700 leading-snug mb-2.5">
          {acknowledged
            ? `Alert acknowledged for ${incident.id}.`
            : `${incident.type} case reported at ${incident.location.split(',')[0]}.`
          }
        </p>
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-slate-400">{incident.lastUpdated} • {incident.id}</span>
          {!acknowledged && (
            <button
              onClick={onAcknowledge}
              className="px-3 py-1 rounded-md bg-teal-600 text-white text-[10px] font-semibold hover:bg-teal-700 transition-colors shadow-sm active:scale-95"
            >
              Acknowledge
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(content, document.body);
}

// ─────────────────────────────────────────────────────────
// Ops Log Panel (headerless container — header rendered inline)
// ─────────────────────────────────────────────────────────

function OpsLogPanel({ opsLog, onOpenFullLog }: { opsLog: GlobalOpsLogEntry[]; onOpenFullLog: () => void }) {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Sticky header */}
      <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between flex-shrink-0 bg-white">
        <div className="flex items-center gap-1.5">
          <ClipboardList className="w-3.5 h-3.5 text-teal-600" />
          <h2 className="text-[12px] font-bold text-slate-800">Ops Log</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-slate-400">GLOBAL</span>
          <button onClick={onOpenFullLog} className="p-1 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded transition-colors" title="View Full Log">
            <ClipboardList className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      {/* Scrollable timeline */}
      <div className="flex-1 overflow-y-auto px-3 py-2 flex flex-col">
        {opsLog.map((entry, i) => (
            <div key={`${entry.incidentId}-${entry.time}-${i}`} className="flex gap-2.5 relative">
              <div className="flex flex-col items-center flex-shrink-0">
                <div className={`w-2 h-2 rounded-full border-[1.5px] flex-shrink-0 z-10 mt-0.5 ${
                  i === 0 ? 'bg-teal-500 border-teal-500' : 'bg-white border-slate-300'
                }`} />
                {i < opsLog.length - 1 && (
                  <div className="w-px flex-1 bg-slate-200 min-h-[24px]" />
                )}
              </div>
              <div className="pb-3 -mt-0.5 flex-1 min-w-0">
                <div className="flex items-baseline gap-1.5 mb-0.5">
                  <span className="text-[9px] font-mono font-bold text-slate-400">{entry.time}</span>
                  <span className="text-[9px] font-mono font-bold text-teal-600 bg-teal-50 px-1 py-0.5 rounded">{entry.incidentId}</span>
                  <span className="text-[11px] font-semibold text-slate-700">{entry.title}</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">{entry.description}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Incident Detail Strip (compact, attached below map)
// ─────────────────────────────────────────────────────────

function IncidentDetailStrip({ incident }: { incident: Incident | null }) {
  if (!incident) {
    return (
      <div className="bg-white border-t border-slate-200 px-4 py-4 flex items-center justify-center text-slate-500 text-[12px] h-[68px]">
        Select an incident from the list to view dispatch details and actions.
      </div>
    );
  }

  const sev = severityColor(incident.severity);

  return (
    <div className="bg-white border-t border-slate-200 px-4 py-3 flex flex-col gap-2 shrink-0 max-h-[38%] overflow-y-auto overflow-x-hidden">
      {/* Top Row: Info + Actions */}
      <div className="flex items-start md:items-center justify-between gap-3 flex-col md:flex-row">
        {/* Info area */}
        <div className="min-w-0 flex-1 flex flex-wrap items-center gap-2">
          {/* Identity */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className={`w-7 h-7 rounded-md ${sev.bg} ${sev.text} flex items-center justify-center shadow-sm border border-white/50`}>
              {typeIcon(incident.type)}
            </div>
            <div className="min-w-0 flex flex-col">
              <p className="text-[12px] font-bold text-slate-900 leading-tight">{incident.type} <span className="text-slate-400 font-mono font-medium text-[10px] ml-1">{incident.id}</span></p>
              <p className="text-[10px] font-medium text-slate-500">{incident.location}</p>
            </div>
          </div>

          <div className="w-px h-5 bg-slate-200 flex-shrink-0 mx-1 hidden sm:block" />

          {/* Stat Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { label: 'Unit', value: incident.assignedUnit || 'None' },
              { label: 'Priority', value: incident.severity },
              { label: 'Elapsed', value: incident.elapsedTime },
              { label: 'Updated', value: incident.lastUpdated },
              { label: 'Status', value: incident.status },
            ].map((item) => (
              <div key={item.label} className="bg-slate-50 rounded px-2 py-0.5 border border-slate-100 flex items-baseline gap-1.5">
                <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">{item.label}</span>
                <span className="text-[10px] font-bold text-slate-700">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="shrink-0 flex items-center gap-1.5 self-end md:self-auto">
          <button className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-semibold transition-colors shadow-sm">
            <Send className="w-3.5 h-3.5" /> Dispatch
          </button>
          <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold transition-colors border border-slate-200 shadow-sm">
            <MessageSquare className="w-3.5 h-3.5 text-slate-500" /> Chat
          </button>
          <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold transition-colors border border-slate-200 shadow-sm">
            <Radio className="w-3.5 h-3.5 text-slate-500" /> Broadcast
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-semibold transition-colors shadow-sm ml-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Resolve
          </button>
        </div>
      </div>

      {/* Bottom Row: Evidence Summary */}
      {incident.evidence && incident.evidence.length > 0 && (
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs bg-amber-50/50 p-2.5 rounded-md border border-amber-100 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 flex-shrink-0 flex items-center gap-1.5">
             <AlertTriangle className="w-3.5 h-3.5" /> AI Alert Reasoning:
          </span>
          <span className="text-[11.5px] font-semibold text-slate-800 leading-snug">
            {incident.evidence.join(' + ')}
          </span>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Full Ops Log Workspace (replaces Map in Center Panel)
// ─────────────────────────────────────────────────────────

function FullOpsLogWorkspace({
  opsLog,
  selectedIncident,
  onClose,
  onAddEntry,
}: {
  opsLog: GlobalOpsLogEntry[];
  selectedIncident: Incident;
  onClose: () => void;
  onAddEntry: (incidentId: string, entry: OpsLogEntry) => void;
}) {
  const [activePanel, setActivePanel] = useState<'none' | 'form' | 'entry'>('none');
  const [selectedEntry, setSelectedEntry] = useState<GlobalOpsLogEntry | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [source, setSource] = useState('Manual Operator Note');
  const [status, setStatus] = useState('Recorded');

  const handleSubmit = () => {
    if (!title.trim() && !description.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    onAddEntry(selectedIncident.id, {
      time: timeStr,
      title: title.trim() || 'Manual Update',
      description: description.trim(),
      source: source,
    });
    // Reset form
    setTitle('');
    setDescription('');
    setSource('Manual Operator Note');
    setStatus('Recorded');
    setActivePanel('none');
  };

  const openForm = () => {
    setActivePanel('form');
    setSelectedEntry(null);
  };

  const openEntry = (entry: GlobalOpsLogEntry) => {
    setSelectedEntry(entry);
    setActivePanel('entry');
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col animate-in fade-in duration-300">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 bg-white flex items-center justify-between flex-shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="bg-teal-50 p-1.5 rounded-md text-teal-600">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-slate-800 leading-tight">Full Operations Log</h2>
            <p className="text-[11px] font-mono font-medium text-slate-500">Global real-time event stream</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={openForm}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-semibold transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Add Log Entry
          </button>
          <button 
            onClick={onClose} 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors border border-slate-200 shadow-sm"
          >
            <MapPin className="w-3.5 h-3.5" /> Back to Map
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 overflow-hidden flex">
        {/* LEFT: Timeline */}
        <div className="flex-1 overflow-y-auto bg-slate-50 flex flex-col p-6">
          <div className="flex-1">
            {opsLog.map((entry, i) => (
              <div 
                key={`${entry.incidentId}-${entry.time}-${i}`} 
                className="flex gap-4 relative mb-6 cursor-pointer group"
                onClick={() => openEntry(entry)}
              >
                <div className="flex flex-col items-center flex-shrink-0 w-8">
                  <div className={`w-3 h-3 rounded-full border-[2.5px] flex-shrink-0 z-10 mt-1.5 ${
                    i === 0 ? 'bg-teal-500 border-teal-500 ring-4 ring-teal-50' : 'bg-white border-slate-300 group-hover:border-teal-400'
                  } transition-colors`} />
                  {i < opsLog.length - 1 && (
                    <div className="w-px flex-1 bg-slate-200 min-h-[40px] group-hover:bg-slate-300 transition-colors" />
                  )}
                </div>
                <div className={`pb-2 -mt-1 flex-1 min-w-0 bg-white border p-4 rounded-xl shadow-sm transition-all duration-200 ${selectedEntry === entry ? 'border-teal-400 ring-1 ring-teal-400' : 'border-slate-200 hover:shadow-md hover:border-slate-300'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-[11px] font-mono font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">{entry.time}</span>
                      <span className="text-[11px] font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">{entry.incidentId}</span>
                      <span className="text-[14px] font-bold text-slate-900">{entry.title}</span>
                    </div>
                  </div>
                  <p className="text-[13px] text-slate-600 leading-relaxed mb-3 line-clamp-2">{entry.description}</p>
                  <div className="flex items-center gap-3">
                    <div className="text-[10px] font-bold text-slate-500 flex items-center gap-1 uppercase tracking-wider bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                      <User className="w-3 h-3" /> {entry.source}
                    </div>
                    <div className="text-[10px] font-bold text-slate-500 flex items-center gap-1 uppercase tracking-wider bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                      <MapPin className="w-3 h-3" /> {entry.incidentType}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Dynamic Context Panel */}
        {activePanel !== 'none' && (
          <div className="w-[360px] bg-white border-l border-slate-200 flex flex-col overflow-y-auto animate-in slide-in-from-right-8 duration-300 shadow-xl z-20">
            {activePanel === 'form' && (
              <div className="flex flex-col h-full">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50 shadow-sm">
                  <h3 className="text-[13px] font-bold text-slate-800 flex items-center gap-1.5">
                    <ClipboardList className="w-4 h-4 text-teal-600" /> New Log Entry
                  </h3>
                  <button onClick={() => setActivePanel('none')} className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-5 space-y-4 flex-1">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Title</label>
                    <input 
                      type="text" 
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="e.g. CFR arrived on scene"
                      className="w-full text-[12px] p-2.5 border border-slate-200 rounded-md focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Source</label>
                    <select 
                      value={source}
                      onChange={e => setSource(e.target.value)}
                      className="w-full text-[12px] p-2.5 border border-slate-200 rounded-md focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white"
                    >
                      <option>995 Call Record</option>
                      <option>Command Centre</option>
                      <option>Dispatch System</option>
                      <option>CFR Network</option>
                      <option>Vehicle Update</option>
                      <option>Manual Operator Note</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Status Update</label>
                    <select 
                      value={status}
                      onChange={e => setStatus(e.target.value)}
                      className="w-full text-[12px] p-2.5 border border-slate-200 rounded-md focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white"
                    >
                      <option>Recorded</option>
                      <option>Verified</option>
                      <option>Dispatched</option>
                      <option>En Route</option>
                      <option>On Scene</option>
                      <option>Resolved</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Description</label>
                    <textarea
                      rows={4}
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Enter details from 995 call, dispatch update, or case note..."
                      className="w-full text-[12px] p-2.5 border border-slate-200 rounded-md focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-none"
                    />
                  </div>
                </div>
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-2 shrink-0">
                   <button onClick={() => setActivePanel('none')} className="flex-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-[12px] py-2 rounded-md transition-colors shadow-sm">
                     Cancel
                   </button>
                   <button onClick={handleSubmit} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-[12px] py-2 rounded-md transition-colors shadow-sm">
                     Save Log Entry
                   </button>
                </div>
              </div>
            )}
            
            {activePanel === 'entry' && selectedEntry && (
              <div className="flex flex-col h-full">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50 shadow-sm">
                  <h3 className="text-[13px] font-bold text-slate-800 flex items-center gap-1.5">
                    <ClipboardList className="w-4 h-4 text-slate-400" /> Log Entry Details
                  </h3>
                  <button onClick={() => setActivePanel('none')} className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-5 space-y-6 flex-1">
                   <div>
                     <div className="text-[11px] font-mono font-bold text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded inline-block mb-2">{selectedEntry.time}</div>
                     <h4 className="text-[16px] font-bold text-slate-900 leading-tight">{selectedEntry.title}</h4>
                   </div>
                   
                   <div>
                     <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Description</label>
                     <p className="text-[13px] text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-100">{selectedEntry.description}</p>
                   </div>
                   
                   <div>
                     <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Source</label>
                     <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-700">
                       <User className="w-4 h-4 text-slate-400" /> {selectedEntry.source}
                     </div>
                   </div>

                   <div className="pt-5 border-t border-slate-100">
                     <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Related Context</label>
                     <div className="space-y-2.5 bg-white border border-slate-100 rounded-lg p-3">
                       <div className="flex justify-between items-center">
                         <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Case ID</span>
                         <span className="text-[12px] font-mono font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">{selectedEntry.incidentId}</span>
                       </div>
                       <div className="flex justify-between items-center">
                         <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Location</span>
                         <span className="text-[12px] font-medium text-slate-800">{selectedEntry.location}</span>
                       </div>
                     </div>
                   </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Main Dashboard Page
// ─────────────────────────────────────────────────────────

export default function DashboardV2() {
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'All' | 'Critical' | 'Flagged' | 'Unflagged' | 'Active'>('All');
  const [notifAcknowledged, setNotifAcknowledged] = useState(false);
  const [notifDismissed, setNotifDismissed] = useState(false);
  const [isOpsLogOpen, setIsOpsLogOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const filteredIncidents = incidents.filter(inc => {
    if (filter === 'All') return true;
    if (filter === 'Critical') return inc.severity === 'Critical';
    if (filter === 'Flagged') return inc.flagged;
    if (filter === 'Unflagged') return !inc.flagged;
    if (filter === 'Active') return inc.status !== 'Resolved';
    return true;
  });

  const selectedIncident = incidents.find(i => i.id === selectedId) || incidents[0];
  const notifIncident = incidents.find(i => i.severity === 'Critical') || incidents[0];
  const allOpsLogEntries = useMemo<GlobalOpsLogEntry[]>(() => {
    return incidents
      .flatMap((inc) =>
        inc.opsLog.map((entry) => ({
          ...entry,
          incidentId: inc.id,
          incidentType: inc.type,
          location: inc.location,
        }))
      )
      .reverse();
  }, [incidents]);

  const handleToggleFlag = useCallback((id: string) => {
    setIncidents(prev => prev.map(inc =>
      inc.id === id ? { ...inc, flagged: !inc.flagged } : inc
    ));
  }, []);

  const handleAddOpsLogEntry = useCallback((incidentId: string, entry: OpsLogEntry) => {
    setIncidents(prev => prev.map(inc => 
      inc.id === incidentId 
        ? { ...inc, opsLog: [...inc.opsLog, entry] }
        : inc
    ));
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex h-[100dvh] flex-col overflow-hidden bg-white text-slate-900"
      style={{ fontFamily: 'var(--font-inter, Inter, system-ui, sans-serif)' }}
    >
      {/* Top Nav — 48px */}
      <TopNav />

      {/* 3-column grid: Incidents | Map+Detail | OpsLog */}
      <div className={`min-h-0 flex-1 grid overflow-hidden transition-all duration-300 ease-in-out ${isOpsLogOpen ? 'grid-cols-[clamp(320px,30vw,430px)_minmax(0,1fr)]' : 'grid-cols-[clamp(320px,30vw,430px)_minmax(0,1fr)_clamp(300px,24vw,420px)]'}`}>

        {/* ═══ LEFT: Incident List ═══ */}
        <div className="min-h-0 min-w-0 bg-white border-r border-slate-200 flex flex-col overflow-hidden">
          {/* Sticky header */}
          <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
            <h2 className="text-[12px] font-bold text-slate-800 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
              Incidents
            </h2>
            <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
              {filteredIncidents.length}
            </span>
          </div>
          {/* Filter tabs */}
          <div className="px-2 py-2 border-b border-slate-100 flex items-center gap-1 overflow-visible flex-shrink-0 flex-nowrap justify-between">
            {(['All', 'Critical', 'Flagged', 'Unflagged', 'Active'] as const).map(f => {
              const count = incidents.filter(inc => {
                if (f === 'All') return true;
                if (f === 'Critical') return inc.severity === 'Critical';
                if (f === 'Flagged') return inc.flagged;
                if (f === 'Unflagged') return !inc.flagged;
                if (f === 'Active') return inc.status !== 'Resolved';
                return true;
              }).length;
              
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-2 py-1 rounded text-xs whitespace-nowrap font-semibold transition-colors flex items-center gap-1 border border-transparent ${
                    filter === f
                      ? (f === 'Critical' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-teal-50 text-teal-700 border-teal-100')
                      : 'text-slate-500 hover:bg-slate-50 border-slate-100'
                  }`}
                >
                  {f} <span className="text-[10px] opacity-60 font-mono">{count}</span>
                </button>
              );
            })}
          </div>
          {/* Scrollable cards */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {filteredIncidents.map(inc => (
              <IncidentCard
                key={inc.id}
                incident={inc}
                isSelected={inc.id === selectedId}
                onSelect={() => setSelectedId(inc.id)}
                onToggleFlag={() => handleToggleFlag(inc.id)}
              />
            ))}
          </div>
        </div>

        {/* ═══ CENTER: Map + Detail Strip ═══ */}
        <div className="min-h-0 min-w-0 flex flex-col overflow-hidden">
          {/* Map or Full Ops Log Workspace fills remaining height */}
          <div className="flex-1 min-h-0 min-w-0 bg-slate-100 flex flex-col relative overflow-hidden">
            {isOpsLogOpen && selectedIncident ? (
              <FullOpsLogWorkspace
                opsLog={allOpsLogEntries}
                selectedIncident={selectedIncident}
                onClose={() => setIsOpsLogOpen(false)}
                onAddEntry={handleAddOpsLogEntry}
              />
            ) : (
              <IncidentMap
                incidents={incidents}
                selectedId={selectedId}
                onSelectIncident={setSelectedId}
              />
            )}
          </div>
          {/* Detail strip attached below map - hidden when full log is open */}
          {!isOpsLogOpen && <IncidentDetailStrip incident={selectedIncident} />}
        </div>

        {/* ═══ RIGHT: Ops Log ═══ */}
        {!isOpsLogOpen && (
          <div className="min-h-0 min-w-0 flex flex-col overflow-hidden bg-white border-l border-slate-200">
            <OpsLogPanel
              opsLog={allOpsLogEntries}
              onOpenFullLog={() => setIsOpsLogOpen(true)}
            />
          </div>
        )}
      </div>

      {/* Floating Notification Toast */}
      {!notifDismissed && (
        <NotificationToast
          incident={notifIncident}
          acknowledged={notifAcknowledged}
          onAcknowledge={() => setNotifAcknowledged(true)}
          onDismiss={() => setNotifDismissed(true)}
        />
      )}

    </div>
  );
}
