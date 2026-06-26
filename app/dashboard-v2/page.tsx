'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import {
  Shield, Bell, MessageSquare, Radio, ClipboardList, User, Settings,
  Search, Flag, FlagOff, MapPin, Clock,
  CheckCircle2,
  AlertTriangle, Flame, HeartPulse, Wind, Activity,
  Megaphone, X, Plus
} from 'lucide-react';
import type { EchoSyncScenarioId, EchoSyncSimulationResult } from '@/lib/echosync-simulator';
import { resolveIncidentLocation, toIncidentLocationFields } from '@/lib/verified-node-locations';

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
  priority?: BroadcastPriority;
};

type BroadcastPriority = 'Critical' | 'High' | 'Normal';

type SimulationToastState = {
  caseId: string;
  caseType: string;
  confidence: number;
  riskLevel: Severity;
  recommendedAction: string;
};

const broadcastRecipients = [
  'Dispatchers',
  'SCDF Units',
  'CFR Responders',
  'Caregivers',
  'Operations Supervisors',
] as const;

const simulationControls: { id: EchoSyncScenarioId; label: string }[] = [
  { id: 'critical-no-response', label: 'Critical No Response' },
  { id: 'false-alarm-filtered', label: 'False Alarm Filtered' },
  { id: 'needs-dispatcher-review', label: 'Needs Review' },
];

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
  nodeId?: string;
  block?: string;
  unit?: string;
  postalCode?: string;
  locationSource?: string;
  locationAccuracy?: string;
  description: string;
  evidence: string[];
  opsLog: OpsLogEntry[];
  simulation?: {
    confidence: number;
    immobileTime: string;
    detectionToAlert: string;
    riskLevel: Severity;
    voiceResult: string;
    recommendedAction: string;
    reasoning: string[];
    aiReasoningLine?: string;
    aiSummary?: {
      summary: string;
      source: 'NIM' | 'Fallback';
    };
    detectorEvidence: {
      thermal: string;
      acoustic: string;
      loadMat: string;
      doorFridge: string;
      voice: string;
    };
  };
}

type SensorApiEvent = {
  nodeId?: string;
  resident?: string;
  location?: string;
  eventType?: string;
  riskLevel?: string;
  confidence?: number;
  sensorData?: unknown;
  voiceCheckIn?: unknown;
  aiSummary?: string;
  timestamp?: string;   // Raspberry Pi trigger time
  receivedAt?: string;  // Next.js receive time
  id?: string;
  reason?: string;
  source?: string;
  dashboardPushedAt?: string;
};


// ─────────────────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────────────────

const initialIncidents: Incident[] = [
  {
    id: 'INC-2026-090',
    type: 'False Alarm Filtered',
    ...toIncidentLocationFields(resolveIncidentLocation('INC-2026-090')!),
    elapsedTime: '18 sec',
    severity: 'Low',
    flagged: false,
    status: 'Resolved',
    assignedUnit: 'Monitor Only',
    lastUpdated: '21:05',
    description: 'Impact detected. Resident confirmed they are okay.',
    evidence: ['Impact only', 'Resident okay', 'Movement normal', 'Routine normal'],
    simulation: {
      confidence: 38,
      immobileTime: '18 sec',
      detectionToAlert: '9 sec',
      riskLevel: 'Low',
      voiceResult: 'okay',
      recommendedAction: 'Monitor only. No SCDF escalation.',
      reasoning: ['Impact only + normal movement + resident confirmed okay.'],
      aiReasoningLine: 'Impact only + normal movement + resident confirmed okay.',
      detectorEvidence: {
        thermal: 'PIR + motion sensors show normal movement',
        acoustic: 'sound sensor detected short impact only',
        loadMat: 'normal',
        doorFridge: 'ultrasonic presence stable',
        voice: 'mic + speaker check-in: resident said okay',
      },
    },
    opsLog: [],
  },
  {
    id: 'INC-2026-091',
    type: 'Needs Dispatcher Review',
    ...toIncidentLocationFields(resolveIncidentLocation('INC-2026-091')!),
    elapsedTime: '4 min 6 sec',
    severity: 'High',
    flagged: false,
    status: 'Active',
    assignedUnit: 'Dispatcher Review',
    lastUpdated: '21:05',
    description: 'Weak signals detected. Dispatcher review required.',
    evidence: ['Low PIR/motion activity', 'No movement 4 min 6 sec', 'Load mat no return', 'Ultrasonic routine deviation', 'Mic/speaker response unclear'],
    simulation: {
      confidence: 76,
      immobileTime: '4 min 6 sec',
      detectionToAlert: '14 sec',
      riskLevel: 'High',
      voiceResult: 'unclear',
      recommendedAction: 'Dispatcher review before CFR escalation.',
      reasoning: ['Low PIR/motion activity + no movement for 4 min 6 sec + load mat no return + unclear mic/speaker response.'],
      aiReasoningLine: 'Low PIR/motion activity + no movement for 4 min 6 sec + load mat no return + unclear mic/speaker response.',
      detectorEvidence: {
        thermal: 'PIR + motion sensors show low activity',
        acoustic: 'sound sensor found no major impact',
        loadMat: 'mattress load sensor: no return',
        doorFridge: 'ultrasonic presence routine deviation',
        voice: 'mic + speaker unclear after 2 attempts',
      },
    },
    opsLog: [],
  },
  {
    id: 'INC-2026-089',
    type: 'Possible Fall / Medical Distress',
    elapsedTime: '00:08:22',
    severity: 'Critical',
    flagged: false,
    status: 'Active',
    assignedUnit: 'Emergency operator review',
    lastUpdated: '19:50',
    ...toIncidentLocationFields(resolveIncidentLocation('INC-2026-089')!),
    description: 'Possible fall detected. No response after voice check-in.',
    evidence: [
      'PIR/motion anomaly',
      'No movement 8 min 22 sec',
      'Sound impact detected',
      'Mic/speaker check-in failed',
    ],
    simulation: {
      confidence: 91,
      immobileTime: '8 min 22 sec',
      detectionToAlert: '11 sec',
      riskLevel: 'Critical',
      voiceResult: 'no-response',
      recommendedAction: 'Emergency operator review. Suggest CFR/AED coordination via myResponder-style workflow.',
      reasoning: ['PIR/motion anomaly + no movement for 8 min 22 sec + sound impact detected + mic/speaker check-in failed.'],
      aiReasoningLine: 'PIR/motion anomaly + no movement for 8 min 22 sec + sound impact detected + mic/speaker check-in failed.',
      detectorEvidence: {
        thermal: 'PIR + motion sensors show floor-level presence',
        acoustic: 'sound sensor detected 72dB impact',
        loadMat: 'mattress load sensor: no return detected',
        doorFridge: 'ultrasonic presence indicates routine activity missing',
        voice: 'mic + speaker failed after 2 attempts',
      },
    },
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
    elapsedTime: '00:14:05',
    severity: 'High',
    flagged: false,
    status: 'On Scene',
    assignedUnit: 'ENG-07',
    lastUpdated: '19:48',
    ...toIncidentLocationFields(resolveIncidentLocation('INC-2026-088')!),
    description: 'Kitchen fire reported. Smoke detected near service yard. Neighbours on floors 10-12 have been alerted for precautionary evacuation.',
    evidence: [
      'Smoke pattern detected',
      'Rapid heat/smoke pattern',
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
    elapsedTime: '00:22:10',
    severity: 'Medium',
    flagged: false,
    status: 'En Route',
    assignedUnit: 'AMB-22',
    lastUpdated: '19:41',
    ...toIncidentLocationFields(resolveIncidentLocation('INC-2026-087')!),
    description: 'Fall impact detected in living room. Resident has not responded to voice check-in. EchoSync edge sensors confirmed prolonged immobility.',
    evidence: [
      'Acoustic impact (78dB)',
      'Sustained floor vibration',
      'PIR/motion posture anomaly'
    ],
    opsLog: [
      { time: '19:30', title: 'EchoSync Alert', description: 'Edge AI detected heavy fall — acoustic impact 78dB + sustained floor vibration.', source: 'EchoSync Sensor' },
      { time: '19:31', title: 'AI Confidence Verified', description: '88% confidence score. PIR/motion pattern shows horizontal posture >90s.', source: 'EchoSync Edge' },
      { time: '19:32', title: 'Voice Check-In Failed', description: 'Automated voice check-in attempted. No verbal response from resident.', source: 'EchoSync Gateway' },
      { time: '19:33', title: 'Operator Verified', description: 'Dispatcher confirmed alert. Dispatch initiated as welfare/medical.', source: 'Command Centre' },
      { time: '19:35', title: 'SCDF Unit Dispatched', description: 'AMB-22 dispatched from Jurong Fire Station.', source: 'Dispatch system' },
      { time: '19:41', title: 'Responder En Route', description: 'AMB-22 en route via AYE. ETA 6 min.', source: 'Vehicle update' },
    ],
  },
  {
    id: 'INC-2026-086',
    type: 'Unresponsive Resident',
    elapsedTime: '00:35:00',
    severity: 'Medium',
    flagged: false,
    status: 'Active',
    assignedUnit: 'Unassigned',
    lastUpdated: '19:30',
    ...toIncidentLocationFields(resolveIncidentLocation('INC-2026-086')!),
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
    elapsedTime: '00:05:30',
    severity: 'High',
    flagged: false,
    status: 'Dispatched',
    assignedUnit: 'HAZMAT-02',
    lastUpdated: '19:49',
    ...toIncidentLocationFields(resolveIncidentLocation('INC-2026-085')!),
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

function riskToSeverity(riskLevel: EchoSyncSimulationResult['riskLevel']): Severity {
  return riskLevel;
}

function statusFromRisk(riskLevel: Severity): IncidentStatus {
  if (riskLevel === 'Low') return 'Resolved';
  if (riskLevel === 'Medium') return 'Active';
  if (riskLevel === 'High') return 'Active';
  return 'Active';
}

function assignedUnitFromRisk(riskLevel: Severity) {
  if (riskLevel === 'Critical') return 'Urgent operator review';
  if (riskLevel === 'High') return 'Operator review';
  return 'Unassigned';
}

function normalizeSeverity(value?: string): Severity | null {
  const normalized = value?.toLowerCase();
  if (normalized === 'critical') return 'Critical';
  if (normalized === 'high') return 'High';
  if (normalized === 'medium') return 'Medium';
  if (normalized === 'low') return 'Low';
  return null;
}

function describeUnknown(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).map(([key, item]) => `${key}: ${String(item)}`);
  }
  return value == null ? [] : [String(value)];
}

function voiceResult(value: unknown) {
  if (typeof value === 'string') return value;

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;

    const intent = String(record.intent ?? '').toLowerCase();
    const transcript = String(record.transcript ?? '').trim();
    const responded = record.responded;

    if (intent === 'help') return transcript ? `help request: ${transcript}` : 'help request detected';
    if (intent === 'ok') return transcript ? `resident okay: ${transcript}` : 'resident responded okay';
    if (intent === 'unclear') return transcript ? `unclear: ${transcript}` : 'unclear response';
    if (intent === 'no_response') return 'no response';

    if (responded === false) return 'no response';
    if (responded === true) return transcript ? `response: ${transcript}` : 'response detected';

    return String(record.result ?? record.status ?? record.response ?? 'Not recorded');
  }

  return 'Not recorded';
}
function cleanAiText(value?: string) {
  return String(value || '')
    .replace(/\*\*/g, '')
    .replace(/\r/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
function parseLiveDate(value?: string) {
  if (!value) return null;

  const normalised =
    value.includes(' ') && !value.includes('T')
      ? value.replace(' ', 'T')
      : value;

  const date = new Date(normalised);

  if (Number.isNaN(date.getTime())) return null;

  return date;
}

function makeLiveIncidentId(index: number, piTime: Date) {
  const stamp = piTime
    .toLocaleTimeString('en-SG', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    .replaceAll(':', '');

  return `INC-LIVE-${stamp}-${index + 1}`;
}

function buildLiveOpsLog(
  event: SensorApiEvent,
  severity: Severity,
  confidence: number,
  voice: string,
  received: Date,
): OpsLogEntry[] {
  const baseTime = received.getTime();

  const timeAt = (offsetMs: number) =>
    new Date(baseTime + offsetMs).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });

  const eventType = event.eventType || 'EchoSync sensor alert';
  const location = event.location || 'registered HDB unit';

  const noResponse = /no[- ]?response|not recorded|unresponsive|failed/i.test(voice);
  const help = /help request/i.test(voice);

  const logs: OpsLogEntry[] = [
    {
      time: timeAt(0),
      title: 'EchoSync Detector Event',
      description: `${eventType} signal received at ${location}.`,
      source: 'Raspberry Pi sensor node',
    },
    {
      time: timeAt(15_000),
      title: 'Sensor Evidence Captured',
      description: `Arduino JSON received from sound, PIR, ultrasonic and load-cell sensors. Confidence score ${confidence}%.`,
      source: 'Arduino + edge node',
    },
    {
      time: timeAt(30_000),
      title: 'Voice Check-In Completed',
      description: `${voice}.`,
      source: 'Azure Speech + EchoSync voice check-in',
    },
    {
      time: timeAt(45_000),
      title: 'AI Confidence Fused',
      description: `${confidence}% confidence, ${severity} risk. GB10 generated operator summary.`,
      source: 'GB10 NIM / sensor fusion',
    },
  ];

  if (severity === 'Critical') {
    logs.push(
      {
        time: timeAt(60_000),
        title: 'Emergency Operator Review Queued',
        description: help
          ? 'Resident requested help. Immediate emergency operator review required.'
          : noResponse
            ? 'No resident response. Emergency operator review required.'
            : 'Critical alert requires emergency operator review.',
        source: 'EchoSync triage router',
      },
      {
        time: timeAt(75_000),
        title: 'SCDF Dashboard Received',
        description: 'High-confidence emergency alert is kept on SCDF dashboard for operator-led review only.',
        source: 'SCDF dashboard',
      },
      {
        time: timeAt(90_000),
        title: 'myResponder Coordination Pending',
        description: 'Operator may push to myResponder for CFR/AED coordination after dashboard review.',
        source: 'Command Centre workflow',
      },
    );
  } else if (severity === 'High') {
    logs.push(
      {
        time: timeAt(60_000),
        title: 'Dispatcher Review Needed',
        description: 'High-risk alert routed for operator review before emergency escalation.',
        source: 'EchoSync triage router',
      },
      {
        time: timeAt(75_000),
        title: 'SCDF Dashboard Received',
        description: 'High-risk alert is kept on SCDF dashboard for operator-led review only.',
        source: 'SCDF dashboard',
      },
      {
        time: timeAt(90_000),
        title: 'CFR / AED Coordination Pending',
        description: 'Operator may push to myResponder for CFR/AED coordination if risk is confirmed.',
        source: 'Command Centre workflow',
      },
    );
  }

  return logs;
}

function liveEventToIncident(event: SensorApiEvent, index: number): Incident | null {
  if (isMyResponderCompletion(event)) return null;

  const severity = normalizeSeverity(event.riskLevel);
  if (severity !== 'High' && severity !== 'Critical') return null;

  const resolvedLocation = (event.nodeId ? resolveIncidentLocation(event.nodeId) : null)
    || (event.location ? resolveIncidentLocation(event.location) : null);
  const evidence = describeUnknown(event.sensorData);
  const voice = voiceResult(event.voiceCheckIn);
  const confidence = Math.round(event.confidence ?? 0);
  // Prefer Raspberry Pi timestamp.
  // Fall back to Next.js receivedAt only if Pi timestamp is missing.
  const piTime =
    parseLiveDate(event.timestamp) ||
    parseLiveDate(event.receivedAt) ||
    new Date();

  const liveCaseId = makeLiveIncidentId(index, piTime);
  const liveOpsLog = buildLiveOpsLog(event, severity, confidence, voice, piTime);
  const noResponse = /no[- ]?response|unresponsive|failed/i.test(voice);
  const recommendedAction = noResponse || severity === 'Critical'
    ? 'Urgent operator review. Operator may push to myResponder for CFR/AED coordination if emergency signs are confirmed or there is no response.'
    : 'Operator review. Operator may push to myResponder for CFR/AED coordination if risk is confirmed.';

  return {
    id: liveCaseId,
    type: event.eventType || 'Sensor anomaly',
    ...(resolvedLocation
      ? toIncidentLocationFields(resolvedLocation)
      : {
        location: event.location || 'Registered HDB unit unavailable',
        lat: 1.3521,
        lng: 103.8198,
        locationSource: 'Registered HDB address',
        locationAccuracy: 'Unit registration pending verification',
      }),
    elapsedTime: 'Live',
    severity,
    flagged: false,
    status: 'Active',
    assignedUnit: assignedUnitFromRisk(severity),
    lastUpdated: piTime.toLocaleTimeString('en-SG', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    description: cleanAiText(event.aiSummary) || `${event.eventType || 'Anomaly'} detected for ${event.resident || 'registered resident'}.`,
    evidence: evidence.length ? evidence : ['Sensor trigger received', `AI calculated score: ${confidence}%`],
    opsLog: liveOpsLog,
    nodeId: event.nodeId,
    simulation: {
      confidence,
      immobileTime: 'Not provided',
      detectionToAlert: 'Live',
      riskLevel: severity,
      voiceResult: voice,
      recommendedAction,
      reasoning: evidence,
      aiReasoningLine: [...evidence, `AI calculated score ${confidence}%`].join(' + '),
      aiSummary: event.aiSummary ? { summary: cleanAiText(event.aiSummary), source: 'NIM' } : undefined,
      detectorEvidence: {
        thermal: evidence.join('; ') || 'Trigger details not provided',
        acoustic: 'See trigger evidence',
        loadMat: 'See trigger evidence',
        doorFridge: 'See trigger evidence',
        voice,
      },
    },
  };
}

function getSensorRecord(value: unknown) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return {};
}

function isMyResponderCompletion(event: SensorApiEvent) {
  const sensorRecord = getSensorRecord(event.sensorData);
  const eventText = [
    event.eventType,
    event.source,
    event.reason,
    event.aiSummary,
    sensorRecord.myResponderStatus,
  ]
    .map((item) => String(item || "").toLowerCase())
    .join(" ");

  return (
    eventText.includes("myresponder verification completed") ||
    eventText.includes("myresponder") && eventText.includes("completed")
  );
}

function myResponderCompletionToOpsLog(
  event: SensorApiEvent,
  index: number
): GlobalOpsLogEntry {
  const sensorRecord = getSensorRecord(event.sensorData);

  const eventTime =
    parseLiveDate(event.timestamp) ||
    parseLiveDate(event.receivedAt) ||
    new Date();

  const time = eventTime.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });

  const originalAlertId =
    String(sensorRecord.originalAlertId || "").trim() ||
    event.nodeId ||
    event.id ||
    `MYR-COMPLETE-${index + 1}`;

  const location =
    event.location || "Registered HDB unit";

  return {
    time,
    title: "myResponder Verification Completed",
    description:
      "Community First Responder completed the EchoSync verification task. Update recorded for SCDF operator review.",
    source: "myResponder",
    incidentId: originalAlertId,
    incidentType: "myResponder Verification Completed",
    location,
    priority: "High",
  };
}

function currentDashboardTime() {
  return new Date().toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getOperationalSummary(scenario: EchoSyncScenarioId) {
  switch (scenario) {
    case 'critical-no-response':
      return 'Possible fall detected. No response after voice check-in.';
    case 'false-alarm-filtered':
      return 'Impact detected. Resident confirmed they are okay.';
    case 'needs-dispatcher-review':
      return 'Weak signals detected. Dispatcher review required.';
  }
}

function getAiReasoningLine(scenario: EchoSyncScenarioId, immobileTime: string) {
  switch (scenario) {
    case 'critical-no-response':
      return `PIR/motion anomaly + no movement for ${immobileTime} + sound impact detected + mic/speaker check-in failed.`;
    case 'false-alarm-filtered':
      return 'Impact only + normal movement + resident confirmed okay.';
    case 'needs-dispatcher-review':
      return `Low PIR/motion activity + no movement for ${immobileTime} + load mat no return + unclear mic/speaker response.`;
  }
}

function getEvidenceChips(scenario: EchoSyncScenarioId, immobileTime: string) {
  switch (scenario) {
    case 'critical-no-response':
      return ['PIR/motion anomaly', `No movement ${immobileTime}`, 'Sound impact detected', 'Load mat no return', 'Mic/speaker failed'];
    case 'false-alarm-filtered':
      return ['Impact only', 'Resident okay', 'Movement normal', 'Routine normal'];
    case 'needs-dispatcher-review':
      return ['Low PIR/motion activity', `No movement ${immobileTime}`, 'Load mat no return', 'Ultrasonic routine deviation', 'Mic/speaker unclear'];
  }
}

function getDetectorFindings(alert: EchoSyncSimulationResult, scenario: EchoSyncScenarioId) {
  switch (scenario) {
    case 'critical-no-response':
      return {
        thermal: 'PIR + motion sensors show floor-level presence',
        acoustic: `sound sensor detected ${alert.detectors.acoustic.impactDb}dB impact`,
        loadMat: 'mattress load sensor: no return detected',
        doorFridge: 'ultrasonic presence indicates routine activity missing',
        voice: `mic + speaker failed after ${alert.voiceCheckIn.attempts} attempts`,
      };
    case 'false-alarm-filtered':
      return {
        thermal: 'PIR + motion sensors show normal movement',
        acoustic: 'sound sensor detected short impact only',
        loadMat: 'normal',
        doorFridge: 'ultrasonic presence stable',
        voice: 'mic + speaker check-in: resident said okay',
      };
    case 'needs-dispatcher-review':
      return {
        thermal: 'PIR + motion sensors show low activity',
        acoustic: 'sound sensor found no major impact',
        loadMat: 'mattress load sensor: no return',
        doorFridge: 'ultrasonic presence routine deviation',
        voice: `mic + speaker unclear after ${alert.voiceCheckIn.attempts} attempts`,
      };
  }
}

// ─────────────────────────────────────────────────────────
// Top Navigation Bar (48px)
// ─────────────────────────────────────────────────────────

function TopNav({
  onOpenBroadcast,
  hasUnacknowledgedBroadcast,
}: {
  onOpenBroadcast: () => void;
  hasUnacknowledgedBroadcast: boolean;
}) {
  return (
    <header className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-4 flex-shrink-0 z-30">
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <div className="leading-none">
            <span className="text-[13px] font-bold text-slate-900 tracking-tight">EchoSync</span>
            <span className="text-[9px] text-slate-400 font-medium block -mt-0.5">Triage Dashboard</span>
          </div>
        </div>
        <div className="hidden md:block h-5 w-px bg-slate-200" />
        <h1 className="hidden md:block text-[13px] font-semibold text-slate-500">AI-assisted pre-arrival intelligence</h1>
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
        <button
          onClick={onOpenBroadcast}
          className="relative p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          title="Broadcast"
        >
          <Megaphone className="w-4 h-4" />
          {hasUnacknowledgedBroadcast && (
            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-white" />
          )}
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
  const rawEvidenceLine =
    incident.simulation?.aiReasoningLine ||
    incident.evidence?.join(" + ") ||
    "";

  const evidenceItems = rawEvidenceLine
    .split(" + ")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const [label, ...rest] = item.split(":");
      const value = rest.join(":").trim();

      return {
        label: value ? label.trim() : "Signal",
        value: value || item,
      };
    });

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
      className={`w-full text-left rounded-lg border p-2.5 transition-all duration-150 group cursor-pointer ${isSelected
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
          className={`p-1 rounded-md border transition-colors ${incident.flagged
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
    <div className={`fixed bottom-4 right-4 z-[100] w-[min(380px,calc(100vw-32px))] max-h-[min(220px,calc(100dvh-96px))] rounded-xl border shadow-2xl overflow-hidden transition-all duration-500 2xl:bottom-6 2xl:right-6 2xl:w-[min(420px,calc(100vw-32px))] ${acknowledged ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200'
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
            <span className={`text-[9px] font-bold uppercase tracking-wider ${acknowledged ? 'text-emerald-600' : 'text-red-600'
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

function BroadcastAlertModal({
  onClose,
  onSend,
}: {
  onClose: () => void;
  onSend: (payload: {
    title: string;
    message: string;
    priority: BroadcastPriority;
    recipients: string[];
    requireAcknowledgement: boolean;
  }) => void;
}) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<BroadcastPriority>('Critical');
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([
    'Dispatchers',
    'SCDF Units',
    'CFR Responders',
  ]);
  const [requireAcknowledgement, setRequireAcknowledgement] = useState(true);

  const toggleRecipient = (recipient: string) => {
    setSelectedRecipients((prev) =>
      prev.includes(recipient)
        ? prev.filter((item) => item !== recipient)
        : [...prev, recipient]
    );
  };

  const handleSend = () => {
    if (!message.trim()) return;
    onSend({
      title: title.trim(),
      message: message.trim(),
      priority,
      recipients: selectedRecipients,
      requireAcknowledgement,
    });
  };

  const content = (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/30 px-4">
      <div className="w-[min(520px,calc(100vw-32px))] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h2 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-teal-600" />
            Broadcast Alert
          </h2>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Alert Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Critical update for active incidents"
              className="w-full text-[12px] p-2.5 border border-slate-200 rounded-md focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Message</label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type the broadcast message to all responders and operators..."
              className="w-full text-[12px] p-2.5 border border-slate-200 rounded-md focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as BroadcastPriority)}
              className="w-full text-[12px] p-2.5 border border-slate-200 rounded-md focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white"
            >
              <option>Critical</option>
              <option>High</option>
              <option>Normal</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Recipients</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {broadcastRecipients.map((recipient) => (
                <label key={recipient} className="flex items-center gap-2 text-[12px] font-medium text-slate-700 bg-slate-50 border border-slate-100 rounded-md px-2.5 py-2">
                  <input
                    type="checkbox"
                    checked={selectedRecipients.includes(recipient)}
                    onChange={() => toggleRecipient(recipient)}
                    className="h-3.5 w-3.5 accent-teal-600"
                  />
                  {recipient}
                </label>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 text-[12px] font-medium text-slate-700">
            <input
              type="checkbox"
              checked={requireAcknowledgement}
              onChange={(e) => setRequireAcknowledgement(e.target.checked)}
              className="h-3.5 w-3.5 accent-teal-600"
            />
            Require all recipients to acknowledge this alert
          </label>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-2">
          <button onClick={onClose} className="flex-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-[12px] py-2 rounded-md transition-colors shadow-sm">
            Cancel
          </button>
          <button onClick={handleSend} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-[12px] py-2 rounded-md transition-colors shadow-sm">
            Send Broadcast
          </button>
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(content, document.body);
}

function BroadcastToast({
  acknowledged,
  total,
  complete,
}: {
  acknowledged: number;
  total: number;
  complete: boolean;
}) {
  const content = (
    <div className="fixed bottom-4 right-4 z-[100] w-[min(420px,calc(100vw-32px))] rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
      <div className={`h-0.5 ${complete ? 'bg-emerald-500' : 'bg-teal-500'}`} />
      <div className="p-3.5">
        <div className="flex items-start gap-2">
          {complete ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          ) : (
            <Megaphone className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-semibold text-slate-800 leading-snug">
              {complete
                ? 'Broadcast acknowledged by all recipients.'
                : 'Broadcast alert sent. Awaiting acknowledgements.'}
            </p>
            <p className="text-[10px] font-mono font-bold text-slate-500 mt-1">
              {acknowledged} / {total} acknowledged
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(content, document.body);
}

function SimulationAlertToast({
  toast,
  onDismiss,
}: {
  toast: SimulationToastState;
  onDismiss: () => void;
}) {
  const content = (
    <div className="fixed bottom-4 right-4 z-[100] w-[min(420px,calc(100vw-32px))] rounded-xl border border-red-100 bg-white shadow-2xl overflow-hidden">
      <div className="h-0.5 bg-red-500" />
      <div className="p-3.5">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-bold text-slate-800 leading-snug">
              EchoSync {toast.riskLevel} alert generated.
            </p>
            <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">
              {toast.caseId} · {toast.caseType} · {toast.confidence}% confidence
            </p>
            <p className="mt-1 text-[10px] font-semibold text-slate-500 leading-snug">
              {toast.recommendedAction}
            </p>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss simulation alert"
            className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(content, document.body);
}

function OpsLogPanel({ opsLog, onOpenFullLog }: { opsLog: GlobalOpsLogEntry[]; onOpenFullLog: () => void }) {
  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50">
      {/* Sticky header */}
      <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between flex-shrink-0 bg-white">
        <div className="flex items-center gap-1.5">
          <ClipboardList className="w-3.5 h-3.5 text-teal-600" />
          <h2 className="text-[12px] font-bold text-slate-800">Ops Log</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-slate-400">GLOBAL</span>
          <button
            onClick={onOpenFullLog}
            className="p-1 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded transition-colors"
            title="View Full Log"
          >
            <ClipboardList className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Card-style timeline, matching the enlarged Full Operations Log format */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3">
        {opsLog.map((entry, i) => (
          <div key={`${entry.incidentId}-${entry.time}-${i}`} className="flex gap-2.5 relative group">
            <div className="flex flex-col items-center flex-shrink-0 w-4">
              <div className={`w-2.5 h-2.5 rounded-full border-[2px] flex-shrink-0 z-10 mt-3 ${
                i === 0
                  ? 'bg-teal-500 border-teal-500 ring-4 ring-teal-50'
                  : 'bg-white border-slate-300 group-hover:border-teal-400'
              } transition-colors`} />
              {i < opsLog.length - 1 && (
                <div className="w-px flex-1 bg-slate-200 min-h-[34px] group-hover:bg-slate-300 transition-colors" />
              )}
            </div>

            <div className="flex-1 min-w-0 mb-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md">
              <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-mono font-bold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded">
                      {entry.time}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded break-all">
                      {entry.incidentId}
                    </span>
                  </div>

                  <h3 className="text-[12px] font-bold text-slate-900 leading-snug break-words">
                    {entry.title}
                  </h3>
                </div>
              </div>

              <p className="mt-2 text-[10px] text-slate-600 leading-relaxed break-words">
                {entry.description}
              </p>

              <div className="mt-2 flex flex-col gap-1">
                <div className="w-full min-h-[22px] text-[7px] font-bold text-slate-500 flex items-center gap-1 uppercase tracking-wide bg-slate-50 px-1.5 py-0.5 rounded-md border border-slate-100">
                  <User className="w-2.5 h-2.5 flex-shrink-0" />
                  <span className="flex-1 whitespace-normal break-words leading-snug">{entry.source}</span>
                </div>
                <div className="w-full min-h-[22px] text-[7px] font-bold text-slate-500 flex items-center gap-1 uppercase tracking-wide bg-slate-50 px-1.5 py-0.5 rounded-md border border-slate-100">
                  <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
                  <span className="flex-1 whitespace-normal break-words leading-snug">{entry.location}</span>
                </div>
              </div>
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
function parseSummarySections(text?: string) {
  if (!text) return [];

  const clean = cleanAiText(text);

  const headingRegex =
    /(Alert Summary|Recommendation|Additional Note|Operator Note|Caregiver Note|Safety Note|Risk Assessment)\s*:?\s*/gi;

  const matches = [...clean.matchAll(headingRegex)];

  if (matches.length === 0) {
    return [{ title: 'Summary', body: clean }];
  }

  return matches
    .map((match, index) => {
      const title = match[1];
      const start = (match.index || 0) + match[0].length;
      const end =
        index + 1 < matches.length
          ? matches[index + 1].index || clean.length
          : clean.length;

      return {
        title,
        body: clean.slice(start, end).trim(),
      };
    })
    .filter((section) => section.body.length > 0);
}

function splitSummarySentences(text: string) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function AiSummaryCard({ summary }: { summary: string }) {
  const sections = parseSummarySections(summary);

  return (
    <div className="px-0 py-0">
      <div className="space-y-2">
        {sections.map((section, index) => (
          <div
            key={`${section.title}-${index}`}
            className="rounded-md border border-indigo-100 bg-indigo-50/60 px-2 py-2"
          >
            <p className="text-[8px] font-bold uppercase tracking-wider text-indigo-700 mb-1">
              {section.title}
            </p>

            <div className="space-y-1">
              {splitSummarySentences(section.body).map((sentence, sentenceIndex) => (
                <p
                  key={`${section.title}-${sentenceIndex}`}
                  className="text-[10.5px] font-semibold text-slate-700 leading-relaxed"
                >
                  {sentence}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function IncidentDetailStrip({
  incident,
  onRunSimulation,
  simulationLoading,
  onSendToMyResponder,
  myResponderSending,
  myResponderStatus,
  myResponderSentIncidentIds,
}: {
  incident: Incident | null;
  onRunSimulation: (scenario: EchoSyncScenarioId) => void;
  simulationLoading: EchoSyncScenarioId | null;
  onSendToMyResponder: (incident: Incident) => void;
  myResponderSending: boolean;
  myResponderStatus: string | null;
  myResponderSentIncidentIds: string[];
}) {
  if (!incident) {
    return (
      <div className="bg-white border-t border-slate-200 px-4 py-4 flex items-center justify-center text-slate-500 text-[12px] h-[68px]">
        Select an incident to review detection evidence and pre-arrival actions.
      </div>
    );
  }

  const sev = severityColor(incident.severity);
  const myResponderAlreadySent = myResponderSentIncidentIds.includes(incident.id);

  const alertEvidenceLine =
    incident.simulation?.aiReasoningLine ||
    incident.evidence?.join(' + ') ||
    '';

  const rawEvidenceParts = alertEvidenceLine
    .split(/\s+\+\s+/)
    .map((item) => item.trim())
    .filter(Boolean);

  const sensorEntries = rawEvidenceParts.map((part, index) => {
    const [rawLabel, ...rest] = part.split(':');
    const value = rest.join(':').trim();

    const label = rawLabel
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\s+/g, ' ')
      .trim();

    const key = rawLabel.replace(/\s+/g, '').trim();

    return {
      key,
      label: label || `Evidence ${index + 1}`,
      value: value || part,
      hasValue: Boolean(value),
    };
  });

  const hasStructuredSignals = sensorEntries.some((entry) => entry.hasValue);

  const getSensor = (...keys: string[]) => {
    const found = sensorEntries.find((entry) =>
      keys.some((key) => entry.key.toLowerCase() === key.toLowerCase())
    );

    return found?.value;
  };

  const isPositiveSignal = (value?: string) => {
    const normalised = String(value || '').toLowerCase();

    return (
      normalised === '1' ||
      normalised === 'true' ||
      normalised === 'yes' ||
      normalised.includes('detected') ||
      normalised.includes('failed') ||
      normalised.includes('no response')
    );
  };

  const compactEvidenceText =
    rawEvidenceParts.length > 0
      ? rawEvidenceParts.join(' + ')
      : 'Sensor evidence contributed to this alert.';

  const groupedEvidence = hasStructuredSignals
    ? [
        {
          title: 'Sound / impact',
          badge: isPositiveSignal(getSensor('soundDetected')) ? 'Impact detected' : 'Low signal',
          summary: isPositiveSignal(getSensor('soundDetected'))
            ? 'Impact-related sound signal contributed to this alert.'
            : 'Sound level alone is low, but it is considered with other sensors.',
          details: [
            { label: 'Sound level', value: getSensor('soundLevel') || 'Not provided' },
            { label: 'Sound detected', value: getSensor('soundDetected') || 'Not provided' },
            { label: 'Mic digital', value: getSensor('micDigital') || 'Not provided' },
          ],
        },
        {
          title: 'Motion / presence',
          badge: isPositiveSignal(getSensor('nearDetected')) ? 'Presence anomaly' : 'Movement low',
          summary: 'PIR, near-distance and ultrasonic readings are checked for abnormal presence or no movement.',
          details: [
            { label: 'PIR motion', value: getSensor('pirMotion') || 'Not provided' },
            {
              label: 'Distance',
              value: getSensor('distanceCm') ? `${getSensor('distanceCm')} cm` : 'Not provided',
            },
            { label: 'Near detected', value: getSensor('nearDetected') || 'Not provided' },
          ],
        },
        {
          title: 'Load / fall pattern',
          badge:
            isPositiveSignal(getSensor('possibleFall')) || isPositiveSignal(getSensor('alert'))
              ? 'Fall pattern'
              : 'Load change',
          summary:
            'Mattress/load readings are compared with motion and sound to check if a fall pattern may be present.',
          details: [
            { label: 'Possible fall', value: getSensor('possibleFall') || 'Not provided' },
            { label: 'Alert flag', value: getSensor('alert') || 'Not provided' },
            { label: 'Load net', value: getSensor('loadNet') || 'Not provided' },
          ],
        },
      ]
    : [
        {
          title: 'Trigger pattern',
          badge: incident.severity,
          summary: compactEvidenceText,
          details: rawEvidenceParts.slice(0, 3).map((part, index) => ({
            label: `Evidence ${index + 1}`,
            value: part,
          })),
        },
        {
          title: 'Likely concern',
          badge: incident.severity === 'Critical' ? 'Urgent' : 'Review',
          summary:
            incident.severity === 'Critical'
              ? 'Combined signals suggest possible fall or no resident response.'
              : 'Signals require operator review before responder coordination.',
          details: [
            { label: 'Priority', value: incident.severity },
            { label: 'Status', value: incident.status },
            { label: 'Routing', value: incident.assignedUnit || 'Operator review' },
          ],
        },
        {
          title: 'Next action',
          badge: 'Operator-led',
          summary:
            incident.simulation?.recommendedAction ||
            'Review the case details, then decide whether SCDF escalation or CFR/AED coordination is needed.',
          details: [
            { label: 'Confidence', value: incident.simulation ? `${incident.simulation.confidence}%` : 'Not provided' },
            { label: 'Voice', value: incident.simulation?.voiceResult || 'Not provided' },
          ],
        },
      ];

  const sensorEvidenceRows = incident.simulation
    ? [
        {
          label: 'PIR / motion',
          value: incident.simulation.detectorEvidence.thermal,
        },
        {
          label: 'Sound sensor',
          value: incident.simulation.detectorEvidence.acoustic,
        },
        {
          label: 'Mattress load sensor',
          value: incident.simulation.detectorEvidence.loadMat,
        },
        {
          label: 'Ultrasonic sensor',
          value: incident.simulation.detectorEvidence.doorFridge,
        },
        {
          label: 'Mic + speaker check-in',
          value: incident.simulation.detectorEvidence.voice,
        },
      ]
    : [];

  return (
    <div className="bg-white border-t border-slate-200 px-4 py-3 flex flex-col gap-2 shrink-0 max-h-[38%] overflow-y-auto overflow-x-hidden">
      {/* Top Row: Incident identity */}
      <div className="flex min-w-0 items-center gap-2">
        <div className={`w-7 h-7 rounded-md ${sev.bg} ${sev.text} flex items-center justify-center shadow-sm border border-white/50 flex-shrink-0`}>
          {typeIcon(incident.type)}
        </div>

        <div className="min-w-0 flex flex-col">
          <p className="min-w-0 break-words text-[12px] font-bold text-slate-900 leading-tight">
            {incident.type}{' '}
            <span className="text-slate-400 font-mono font-medium text-[10px] ml-1">
              {incident.id}
            </span>
          </p>
          <p className="min-w-0 break-words text-[10px] font-medium text-slate-500">
            Registered HDB unit: {incident.location}
          </p>
        </div>
      </div>

      {/* Stat Pills */}
      <div className="grid min-w-0 grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-1.5">
        {[
          { label: 'Routing', value: incident.assignedUnit || 'None' },
          { label: 'Priority', value: incident.severity },
          { label: 'Elapsed', value: incident.elapsedTime },
          { label: 'Updated', value: incident.lastUpdated },
          { label: 'Status', value: incident.status },
        ].map((item) => (
          <div key={item.label} className="min-w-0 bg-slate-50 rounded px-2 py-1 border border-slate-100">
            <span className="block text-[8px] font-bold uppercase tracking-wider text-slate-400">
              {item.label}
            </span>
            <span className="block text-[10px] font-bold text-slate-700 leading-tight break-words">
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="inline-grid w-fit max-w-full grid-cols-2 gap-1.5">
        <button
          type="button"
          onClick={() => onSendToMyResponder(incident)}
          disabled={
            myResponderSending ||
            myResponderAlreadySent ||
            (incident.severity !== 'High' && incident.severity !== 'Critical')
          }
          className={`flex h-7 w-[150px] min-w-0 items-center justify-center gap-1 rounded-md border px-2 text-[9.5px] font-bold shadow-sm transition-colors ${
            myResponderAlreadySent
              ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
              : incident.severity === 'High' || incident.severity === 'Critical'
                ? 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
                : 'cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300'
          } disabled:cursor-not-allowed disabled:opacity-80`}
        >
          <Radio className="h-3 w-3 flex-shrink-0 text-slate-500" />
          <span className="truncate">
            {myResponderAlreadySent
              ? 'CFR/AED sent'
              : myResponderSending
                ? 'Sending...'
                : 'CFR/AED coordination'}
          </span>
        </button>

        <button className="flex h-7 w-[130px] min-w-0 items-center justify-center gap-1 rounded-md bg-emerald-600 px-2 text-[9.5px] font-bold text-white shadow-sm transition-colors hover:bg-emerald-700">
          <CheckCircle2 className="h-3 w-3 flex-shrink-0" />
          <span className="whitespace-nowrap">SCDF escalation</span>
        </button>
      </div>

      {myResponderStatus && (
        <p className="text-[10px] font-semibold text-teal-700">
          {myResponderStatus}
        </p>
      )}

      {(incident.severity === 'High' || incident.severity === 'Critical') && (
        <div className="rounded-md border border-teal-100 bg-teal-50/70 px-2.5 py-2">
          <p className="text-[9px] font-bold uppercase tracking-wider text-teal-700">
            Operator-led CFR / AED coordination
          </p>
          <p className="mt-0.5 text-[10.5px] text-slate-700">
            High and Critical alerts remain on the SCDF dashboard for review.
            Use CFR/AED coordination only when an operator decides responder support is needed.
          </p>
        </div>
      )}

      {/* Why alert was raised */}
      {groupedEvidence.length > 0 && (
        <div className="mt-1 rounded-lg border border-amber-200 bg-amber-50/70 p-3 shadow-sm">
          <div className="mb-2 grid grid-cols-[130px_minmax(0,1fr)] items-center gap-2">
            <span className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-wider text-amber-700 leading-tight">
              <AlertTriangle className="h-3 w-3 shrink-0" />
              <span>Why raised</span>
            </span>

            <div className="grid grid-cols-3 gap-1.5 justify-self-end">
              {simulationControls.map((control) => (
                <button
                  key={control.id}
                  type="button"
                  onClick={() => onRunSimulation(control.id)}
                  disabled={simulationLoading === control.id}
                  className="h-7 w-[110px] whitespace-nowrap rounded-md border border-slate-200 bg-white px-2 text-[9px] font-bold leading-none text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60"
                >
                  {simulationLoading === control.id ? 'Loading...' : control.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-2 xl:grid-cols-3">
            {groupedEvidence.map((group) => (
              <div
                key={group.title}
                className="rounded-md border border-amber-100 bg-white px-3 py-2"
              >
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                    {group.title}
                  </p>

                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[8.5px] font-bold text-amber-700">
                    {group.badge}
                  </span>
                </div>

                <p className="text-[10.5px] font-semibold leading-snug text-slate-800">
                  {group.summary}
                </p>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  {group.details.map((detail) => (
                    <span
                      key={`${group.title}-${detail.label}`}
                      className="rounded border border-slate-100 bg-slate-50 px-1.5 py-0.5 text-[9px] font-semibold text-slate-600"
                    >
                      {detail.label}:{' '}
                      <span className="text-slate-900">{detail.value}</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {incident.simulation && (
        <div className="grid gap-2 rounded-md border border-slate-100 bg-slate-50/70 p-2.5">
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-5">
            {[
              { label: 'Confidence', value: `${incident.simulation.confidence}%` },
              { label: 'Immobile', value: incident.simulation.immobileTime },
              { label: 'Detect-to-alert', value: incident.simulation.detectionToAlert },
              { label: 'Risk', value: incident.simulation.riskLevel },
              { label: 'Voice result', value: incident.simulation.voiceResult },
            ].map((metric) => (
              <div key={metric.label} className="min-w-0 rounded bg-white px-2 py-1.5 border border-slate-100">
                <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                  {metric.label}
                </p>
                <p className="break-words text-[10px] font-bold text-slate-800">
                  {metric.value}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-md border border-slate-100 bg-white px-3 py-2">
            <p className="mb-2 text-[8px] font-bold uppercase tracking-wider text-slate-400">
              Sensor evidence summary
            </p>

            <div className="grid gap-x-4 gap-y-2 md:grid-cols-2">
              {sensorEvidenceRows.map((sensor) => (
                <div key={sensor.label} className="flex items-start gap-2">
                  <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-teal-500" />

                  <div className="min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                      {sensor.label}
                    </p>

                    <p className="text-[10.5px] font-semibold leading-snug text-slate-700">
                      {sensor.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded bg-white px-2 py-1.5 border border-slate-100">
            <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
              Recommended action
            </p>
            <p className="text-[10.5px] font-bold text-slate-800">
              {incident.simulation.recommendedAction}
            </p>
          </div>

          <div className="rounded bg-white px-2 py-1.5 border border-slate-100">
            <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
              AI sensor explanation
            </p>
            <p className="text-[10.5px] font-semibold text-slate-700">
              Generated from fused sensor-only triggers: mic/speaker, ultrasonic,
              PIR, motion, sound impact, and mattress load signals.
            </p>
          </div>

          {incident.simulation.aiSummary && (
            <AiSummaryCard
              summary={incident.simulation.aiSummary.summary}
            />
          )}
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
                  <div className={`w-3 h-3 rounded-full border-[2.5px] flex-shrink-0 z-10 mt-1.5 ${i === 0 ? 'bg-teal-500 border-teal-500 ring-4 ring-teal-50' : 'bg-white border-slate-300 group-hover:border-teal-400'
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
  const [broadcastOpsLog, setBroadcastOpsLog] = useState<GlobalOpsLogEntry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>('INC-2026-089');
  const [filter, setFilter] = useState<'All' | 'Critical' | 'Flagged' | 'Unflagged' | 'Active'>('All');
  const [notifAcknowledged, setNotifAcknowledged] = useState(false);
  const [notifDismissed, setNotifDismissed] = useState(false);
  const [isOpsLogOpen, setIsOpsLogOpen] = useState(false);
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [broadcastToast, setBroadcastToast] = useState<{ acknowledged: number; total: number; complete: boolean } | null>(null);
  const [simulationLoading, setSimulationLoading] = useState<EchoSyncScenarioId | null>(null);
  const [simulationToast, setSimulationToast] = useState<SimulationToastState | null>(null);
  const [myResponderSending, setMyResponderSending] = useState(false);
  const [myResponderStatus, setMyResponderStatus] = useState<string | null>(null);
  const [myResponderSentIncidentIds, setMyResponderSentIncidentIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const broadcastTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const liveDataActive = useRef(false);
  const userClosedSelection = useRef(false);

  useEffect(() => {
    const mountedTimer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(mountedTimer);
  }, []);

  useEffect(() => {
    return () => {
      broadcastTimers.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  useEffect(() => {
    let active = true;
    const loadLiveAlerts = async () => {
      try {
        const response = await fetch('/api/sensor-alert', { cache: 'no-store' });
        if (!response.ok) return;
        const payload = await response.json() as { events?: SensorApiEvent[] };
        const liveEvents = payload.events || [];

        const completionLogs = liveEvents
          .filter(isMyResponderCompletion)
          .map(myResponderCompletionToOpsLog);

        if (active && completionLogs.length) {
          setBroadcastOpsLog((prev) => {
            const existing = new Set(
              prev.map((entry) => `${entry.incidentId}-${entry.time}-${entry.title}`)
            );

            const freshLogs = completionLogs.filter(
              (entry) => !existing.has(`${entry.incidentId}-${entry.time}-${entry.title}`)
            );

            return [...freshLogs, ...prev];
          });
        }

        const liveIncidents = liveEvents
          .filter((event) => !isMyResponderCompletion(event))
          .map(liveEventToIncident)
          .filter((incident): incident is Incident => incident !== null);

        if (active && liveIncidents.length) {
        liveDataActive.current = true;

        setIncidents((prev) => {
          const existingFlagState = new Map(
            prev.map((incident) => [incident.id, incident.flagged])
          );

          return liveIncidents.map((incident) => ({
            ...incident,

            // New cases start unflagged.
            // Existing cases keep whatever SCDF manually selected.
            flagged: existingFlagState.get(incident.id) ?? false,
          }));
        });

        setSelectedId((current) => {
          if (userClosedSelection.current) return current;

          return liveIncidents.some((incident) => incident.id === current)
            ? current
            : liveIncidents[0].id;
        });
      } else if (active && liveDataActive.current) {
          liveDataActive.current = false;
          setIncidents(initialIncidents);

          if (!userClosedSelection.current) {
            setSelectedId('INC-2026-089');
          }
        }
      } catch {
        // Existing demo incidents remain visible when the live endpoint is unavailable.
      }
    };
    void loadLiveAlerts();
    const timer = setInterval(loadLiveAlerts, 5000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);


  const filteredIncidents = incidents.filter(inc => {
    if (filter === 'All') return true;
    if (filter === 'Critical') return inc.severity === 'Critical';
    if (filter === 'Flagged') return inc.flagged;
    if (filter === 'Unflagged') return !inc.flagged;
    if (filter === 'Active') return inc.status !== 'Resolved';
    return true;
  });

  const selectedIncident = incidents.find(i => i.id === selectedId) || null;

  const handleSelectIncident = useCallback((id: string | null) => {
    if (id === null) {
      userClosedSelection.current = true;
      setSelectedId(null);
      return;
    }

    userClosedSelection.current = false;
    setSelectedId(id);
  }, []);
  const notifIncident = incidents.find(i => i.severity === 'Critical') || incidents[0];
  const allOpsLogEntries = useMemo<GlobalOpsLogEntry[]>(() => {
    const incidentOpsLog = incidents.flatMap((inc) =>
      inc.opsLog.map((entry) => ({
        ...entry,
        incidentId: inc.id,
        incidentType: inc.type,
        location: inc.location,
      }))
    );

    const getTimeValue = (time: string) => {
      const match = time.match(/(\d{1,2}):(\d{2})/);
      if (!match) return 0;

      const hours = Number(match[1]);
      const minutes = Number(match[2]);

      return hours * 60 + minutes;
    };

    return [...broadcastOpsLog, ...incidentOpsLog].sort(
      (a, b) => getTimeValue(b.time) - getTimeValue(a.time)
    );
  }, [broadcastOpsLog, incidents]);

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

  const handleSendBroadcast = useCallback((payload: {
    title: string;
    message: string;
    priority: BroadcastPriority;
    recipients: string[];
    requireAcknowledgement: boolean;
  }) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

    setBroadcastOpsLog((prev) => [
      {
        time: timeStr,
        title: 'Broadcast Alert Sent',
        description: payload.message,
        source: 'Command Centre Broadcast',
        incidentId: 'GLOBAL',
        incidentType: 'Broadcast Alert',
        location: 'Global Operations',
        priority: payload.priority,
      },
      ...prev,
    ]);

    setIsBroadcastOpen(false);
    setBroadcastToast({ acknowledged: 0, total: 5, complete: false });
    broadcastTimers.current.forEach((timer) => clearTimeout(timer));
    broadcastTimers.current = [
      setTimeout(() => setBroadcastToast({ acknowledged: 2, total: 5, complete: false }), 900),
      setTimeout(() => setBroadcastToast({ acknowledged: 4, total: 5, complete: false }), 1800),
      setTimeout(() => setBroadcastToast({ acknowledged: 5, total: 5, complete: true }), 2900),
    ];
  }, []);

    const handleSendToMyResponder = useCallback(async (incident: Incident) => {
    if (incident.severity !== 'High' && incident.severity !== 'Critical') {
      setMyResponderStatus('Only High/Critical alerts can be sent to myResponder.');
      return;
    }

    if (myResponderSentIncidentIds.includes(incident.id)) {
      setMyResponderStatus('Already sent to myResponder for CFR/AED coordination.');
      return;
    }

    setMyResponderSending(true);
    setMyResponderStatus(null);

    try {
      const payload = {
        id: `MYR-${incident.id}`,
        nodeId: incident.nodeId || incident.id,
        resident: 'Mdm Tan Siew Lan',
        location: incident.location,
        eventType: incident.type,
        riskLevel: incident.severity,
        confidence:
          incident.simulation?.confidence ??
          (incident.severity === 'Critical' ? 95 : 86),
        reason:
          incident.simulation?.aiReasoningLine ||
          incident.description ||
          'SCDF dashboard pushed alert for myResponder CFR/AED coordination.',
        sensorData: {
          evidence: incident.evidence,
          detectorEvidence: incident.simulation?.detectorEvidence,
        },
        voiceCheckIn: {
          result: incident.simulation?.voiceResult || 'Not recorded',
        },
        aiSummary:
          incident.simulation?.aiSummary?.summary ||
          incident.description ||
          'High/Critical alert pushed from SCDF dashboard to myResponder.',
        source: 'SCDF Dashboard',
        timestamp: new Date().toISOString(),
        dashboardPushedAt: new Date().toISOString(),
      };

      const response = await fetch('/api/myresponder-alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || result?.ignored) {
        throw new Error(
          result?.message || 'myResponder rejected this alert.'
        );
      }

      setMyResponderStatus('Sent to myResponder for CFR/AED coordination.');

      setMyResponderSentIncidentIds((prev) =>
        prev.includes(incident.id) ? prev : [...prev, incident.id]
      );

      setBroadcastOpsLog((prev) => [
        {
          time: currentDashboardTime(),
          title: 'myResponder Coordination Suggested',
          description: `${incident.severity} alert pushed from SCDF dashboard to myResponder for CFR/AED coordination.`,
          source: 'SCDF Dashboard',
          incidentId: incident.id,
          incidentType: incident.type,
          location: incident.location,
          priority: incident.severity === 'Critical' ? 'Critical' : 'High',
        },
        ...prev,
      ]);
    } catch (error) {
      setMyResponderStatus(
        error instanceof Error
          ? error.message
          : 'Failed to send alert to myResponder.'
      );
    } finally {
      setMyResponderSending(false);
    }
  }, [myResponderSentIncidentIds]);

  const handleRunSimulation = useCallback(async (scenario: EchoSyncScenarioId) => {
    setSimulationLoading(scenario);

    try {
      const response = await fetch(`/api/simulate-alert?scenario=${scenario}`);
      if (!response.ok) throw new Error('Simulation API failed');

      const alert = await response.json() as EchoSyncSimulationResult;
      const severity = riskToSeverity(alert.riskLevel);
      const resolvedLocation = resolveIncidentLocation(alert.caseId) || resolveIncidentLocation(alert.location);
      const now = currentDashboardTime();
      const evidenceChips = getEvidenceChips(scenario, alert.immobileTime);
      const detectorFindings = getDetectorFindings(alert, scenario);
      const aiReasoningLine = getAiReasoningLine(scenario, alert.immobileTime);
      const simulatedIncident: Incident = {
        id: alert.caseId,
        type: alert.caseType,
        elapsedTime: alert.immobileTime,
        severity,
        flagged: false,
        status: statusFromRisk(severity),
        assignedUnit: assignedUnitFromRisk(severity),
        lastUpdated: now,
        ...(resolvedLocation
          ? toIncidentLocationFields(resolvedLocation)
          : {
            location: alert.location,
            lat: 1.3521,
            lng: 103.8198,
            locationSource: 'Manual address geocode',
            locationAccuracy: 'Address verified, block-level estimate',
          }),
        description: getOperationalSummary(scenario),
        evidence: evidenceChips,
        opsLog: [],
        simulation: {
          confidence: alert.confidence,
          immobileTime: alert.immobileTime,
          detectionToAlert: alert.detectionToAlert,
          riskLevel: severity,
          voiceResult: alert.voiceCheckIn.result,
          recommendedAction: alert.recommendedAction,
          reasoning: alert.reasoning,
          aiReasoningLine,
          detectorEvidence: detectorFindings,
        },
      };

      setIncidents((prev) => {
        const existingIndex = prev.findIndex((inc) => inc.id === alert.caseId);
        if (existingIndex === -1) return [simulatedIncident, ...prev];

        return prev.map((inc) => (
          inc.id === alert.caseId
            ? { ...inc, ...simulatedIncident, flagged: inc.flagged || simulatedIncident.flagged }
            : inc
        ));
      });

      setBroadcastOpsLog((prev) => [
        ...alert.opsLogEvents.map((entry) => ({
          ...entry,
          time: now,
          incidentId: alert.caseId,
          incidentType: alert.caseType,
          location: alert.location,
        })),
        ...prev,
      ]);

      setSelectedId(alert.caseId);
      setIsOpsLogOpen(false);

      if (severity === 'Critical' || severity === 'High') {
        setSimulationToast({
          caseId: alert.caseId,
          caseType: alert.caseType,
          confidence: alert.confidence,
          riskLevel: severity,
          recommendedAction: alert.recommendedAction,
        });
      }

      fetch('/api/nim-alert-summary', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          caseId: alert.caseId,
          caseType: alert.caseType,
          location: simulatedIncident.location,
          confidence: alert.confidence,
          riskLevel: alert.riskLevel,
          detectors: {
            thermal: detectorFindings.thermal,
            acoustic: detectorFindings.acoustic,
            loadMat: detectorFindings.loadMat,
            doorFridge: detectorFindings.doorFridge,
          },
          voiceCheckIn: detectorFindings.voice,
          immobileTime: alert.immobileTime,
          recommendedAction: alert.recommendedAction,
        }),
      })
        .then((summaryResponse) => {
          if (!summaryResponse.ok) throw new Error('NIM summary unavailable');
          return summaryResponse.json() as Promise<{ summary: string; source: 'NIM' | 'Fallback' }>;
        })
        .then((aiSummary) => {
          setIncidents((prev) => prev.map((inc) => (
            inc.id === alert.caseId && inc.simulation
              ? { ...inc, simulation: { ...inc.simulation, aiSummary } }
              : inc
          )));
        })
        .catch(() => {
          // Optional summary layer only; rule-based simulation stays authoritative.
        });

    } catch (error) {
      console.error(error);
    } finally {
      setSimulationLoading(null);
    }
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex h-[100dvh] flex-col overflow-hidden bg-white text-slate-900"
      style={{ fontFamily: 'var(--font-inter, Inter, system-ui, sans-serif)' }}
    >
      {/* Top Nav — 48px */}
      <TopNav
        onOpenBroadcast={() => setIsBroadcastOpen(true)}
        hasUnacknowledgedBroadcast={!broadcastToast || !broadcastToast.complete}
      />

      {/* 3-column grid: Incidents | Map+Detail | OpsLog */}
      <div className={`min-h-0 flex-1 grid overflow-hidden transition-all duration-300 ease-in-out ${isOpsLogOpen ? 'grid-cols-[clamp(300px,21vw,350px)_minmax(0,1fr)]' : 'grid-cols-[clamp(300px,21vw,350px)_minmax(0,1fr)_clamp(285px,19vw,360px)]'}`}>
        {/* ═══ LEFT: Incident List ═══ */}
        <div className="min-h-0 min-w-0 bg-white border-r border-slate-200 flex flex-col overflow-hidden">
          {/* Sticky header */}
          <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
            <h2 className="text-[12px] font-bold text-slate-800 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
              Triage Queue
            </h2>
            <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
              {filteredIncidents.length}
            </span>
          </div>
          {/* Filter tabs */}
          <div className="px-1.5 py-2 border-b border-slate-100 flex items-center gap-0.5 overflow-hidden flex-shrink-0 flex-nowrap justify-start">            {(['All', 'Critical', 'Flagged', 'Unflagged'] as const).map(f => {
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
                  className={`px-1.5 py-1 rounded text-[10px] leading-none whitespace-nowrap font-semibold transition-colors flex items-center gap-0.5 border border-transparent ${filter === f
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
                onSelect={() => handleSelectIncident(inc.id)}
                onToggleFlag={() => handleToggleFlag(inc.id)}
              />
            ))}
          </div>
        </div>

        {/* ═══ CENTER: Map + Detail Strip ═══ */}
        <div className="min-h-0 min-w-0 flex flex-col overflow-hidden">
          {/* Map or Full Ops Log Workspace fills remaining height */}
          <div className="flex-1 min-h-0 min-w-0 bg-slate-100 flex flex-col relative overflow-hidden">
            {isOpsLogOpen ? (
              <FullOpsLogWorkspace
                opsLog={allOpsLogEntries}
                selectedIncident={selectedIncident ?? incidents[0] ?? initialIncidents[0]}
                onClose={() => setIsOpsLogOpen(false)}
                onAddEntry={handleAddOpsLogEntry}
              />
            ) : (
              <IncidentMap
                incidents={incidents}
                selectedId={selectedId}
                onSelectIncident={handleSelectIncident}
              />
            )}
          </div>
          {/* Detail strip attached below map - hidden when full log is open */}
          {!isOpsLogOpen && selectedIncident && (
            <IncidentDetailStrip
              incident={selectedIncident}
              onRunSimulation={handleRunSimulation}
              simulationLoading={simulationLoading}
              onSendToMyResponder={handleSendToMyResponder}
              myResponderSending={myResponderSending}
              myResponderStatus={myResponderStatus}
              myResponderSentIncidentIds={myResponderSentIncidentIds}
            />
          )}
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

      {isBroadcastOpen && (
        <BroadcastAlertModal
          onClose={() => setIsBroadcastOpen(false)}
          onSend={handleSendBroadcast}
        />
      )}

      {broadcastToast && (
        <BroadcastToast
          acknowledged={broadcastToast.acknowledged}
          total={broadcastToast.total}
          complete={broadcastToast.complete}
        />
      )}

      {simulationToast && (
        <SimulationAlertToast
          toast={simulationToast}
          onDismiss={() => setSimulationToast(null)}
        />
      )}

    </div>
  );
}
