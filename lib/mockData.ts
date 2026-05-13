// ============================================
// EchoSync — Centralized Mock Data & Types
// Singapore SCDF Emergency Response Context
// ============================================

// ---- Type Definitions ----

export type SeverityLevel = 'P1' | 'P2' | 'P3';
export type IncidentStatus = 'detected' | 'verifying' | 'confirmed' | 'dispatched' | 'responding' | 'resolved';
export type CFRStatus = 'standby' | 'notified' | 'accepted' | 'en_route' | 'on_scene' | 'completed';
export type AEDStatus = 'available' | 'assigned' | 'retrieved' | 'en_route' | 'delivered' | 'applied';
export type NodeStatus = 'online' | 'offline' | 'degraded';
export type NodeType = 'acoustic' | 'thermal' | 'vibration' | 'relay';

export interface HDBBlock {
  id: string;
  name: string;
  estate: string;
  address: string;
  floors: number;
  units: number;
  nodesDeployed: number;
  nodesOnline: number;
  pilotActive: boolean;
}

export interface EdgeNode {
  id: string;
  type: NodeType;
  blockId: string;
  location: string;
  status: NodeStatus;
  battery: number;       // 0-100
  connectivity: 'wifi' | 'lte' | 'mesh';
  lastPing: string;
  firmware: string;
  encrypted: boolean;
}

export interface Incident {
  id: string;
  type: string;
  description: string;
  severity: SeverityLevel;
  status: IncidentStatus;
  confidence: number;     // 0-100
  block: string;
  unit: string;
  floor: number;
  estate: string;
  residentName: string;
  residentAge: number;
  detectedAt: string;
  sensors: string[];
  aiExplanation: string;
  timeElapsed: string;
}

export interface CFRResponder {
  id: string;
  name: string;
  status: CFRStatus;
  distance: string;
  eta: string;
  certified: string[];   // e.g. ['CPR', 'AED', 'First Aid']
  phone: string;
  acceptedAt?: string;
}

export interface AEDUnit {
  id: string;
  location: string;
  block: string;
  floor: string;
  status: AEDStatus;
  distance: string;
  lastChecked: string;
}

export interface TimelineEvent {
  time: string;
  label: string;
  detail: string;
  type: 'system' | 'ai' | 'operator' | 'cfr' | 'scdf';
  status?: 'active' | 'completed' | 'pending';
}

// ---- HDB Blocks ----

export const hdbBlocks: HDBBlock[] = [
  { id: 'BLK-124', name: 'Blk 124', estate: 'Toa Payoh', address: 'Lor 1 Toa Payoh', floors: 16, units: 120, nodesDeployed: 32, nodesOnline: 31, pilotActive: true },
  { id: 'BLK-125', name: 'Blk 125', estate: 'Toa Payoh', address: 'Lor 1 Toa Payoh', floors: 16, units: 112, nodesDeployed: 28, nodesOnline: 28, pilotActive: true },
  { id: 'BLK-126', name: 'Blk 126', estate: 'Toa Payoh', address: 'Lor 2 Toa Payoh', floors: 12, units: 96, nodesDeployed: 24, nodesOnline: 22, pilotActive: true },
  { id: 'BLK-128', name: 'Blk 128', estate: 'Toa Payoh', address: 'Lor 2 Toa Payoh', floors: 14, units: 108, nodesDeployed: 26, nodesOnline: 24, pilotActive: true },
  { id: 'BLK-213', name: 'Blk 213', estate: 'Ang Mo Kio', address: 'Ang Mo Kio Ave 3', floors: 18, units: 144, nodesDeployed: 36, nodesOnline: 35, pilotActive: true },
  { id: 'BLK-215', name: 'Blk 215', estate: 'Ang Mo Kio', address: 'Ang Mo Kio Ave 3', floors: 16, units: 128, nodesDeployed: 30, nodesOnline: 30, pilotActive: true },
  { id: 'BLK-52', name: 'Blk 52', estate: 'Marine Parade', address: 'Marine Crescent', floors: 12, units: 80, nodesDeployed: 20, nodesOnline: 19, pilotActive: false },
  { id: 'BLK-55', name: 'Blk 55', estate: 'Marine Parade', address: 'Marine Terrace', floors: 14, units: 98, nodesDeployed: 22, nodesOnline: 21, pilotActive: false },
];

// ---- Edge Nodes ----

export const edgeNodes: EdgeNode[] = [
  { id: 'NODE-001', type: 'acoustic', blockId: 'BLK-124', location: '#04-12 Corridor', status: 'online', battery: 94, connectivity: 'wifi', lastPing: '2s ago', firmware: 'v2.4.1', encrypted: true },
  { id: 'NODE-002', type: 'thermal', blockId: 'BLK-124', location: '#04-12 Ceiling', status: 'online', battery: 87, connectivity: 'wifi', lastPing: '1s ago', firmware: 'v2.4.1', encrypted: true },
  { id: 'NODE-003', type: 'vibration', blockId: 'BLK-124', location: '#04-12 Floor', status: 'online', battery: 91, connectivity: 'wifi', lastPing: '3s ago', firmware: 'v2.4.1', encrypted: true },
  { id: 'NODE-004', type: 'relay', blockId: 'BLK-124', location: 'Lift Lobby L4', status: 'online', battery: 100, connectivity: 'lte', lastPing: '1s ago', firmware: 'v2.4.1', encrypted: true },
  { id: 'NODE-005', type: 'acoustic', blockId: 'BLK-126', location: '#11-30 Corridor', status: 'online', battery: 72, connectivity: 'wifi', lastPing: '5s ago', firmware: 'v2.3.8', encrypted: true },
  { id: 'NODE-006', type: 'thermal', blockId: 'BLK-126', location: '#11-30 Ceiling', status: 'degraded', battery: 38, connectivity: 'lte', lastPing: '45s ago', firmware: 'v2.3.8', encrypted: true },
  { id: 'NODE-007', type: 'relay', blockId: 'BLK-128', location: 'Lift Lobby L2', status: 'offline', battery: 0, connectivity: 'wifi', lastPing: '14h ago', firmware: 'v2.3.5', encrypted: true },
  { id: 'NODE-008', type: 'acoustic', blockId: 'BLK-213', location: '#12-441 Corridor', status: 'online', battery: 96, connectivity: 'wifi', lastPing: '1s ago', firmware: 'v2.4.1', encrypted: true },
  { id: 'NODE-009', type: 'thermal', blockId: 'BLK-213', location: '#12-441 Ceiling', status: 'online', battery: 89, connectivity: 'wifi', lastPing: '2s ago', firmware: 'v2.4.1', encrypted: true },
  { id: 'NODE-010', type: 'vibration', blockId: 'BLK-215', location: '#08-15 Floor', status: 'online', battery: 95, connectivity: 'mesh', lastPing: '1s ago', firmware: 'v2.4.1', encrypted: true },
];

// ---- Active Incidents ----

export const incidents: Incident[] = [
  {
    id: 'INC-2026-089',
    type: 'Heavy Fall Detected',
    description: 'Impact anomaly (82dB) combined with prolonged horizontal thermal signature (>90s)',
    severity: 'P1',
    status: 'dispatched',
    confidence: 94.2,
    block: 'Blk 124',
    unit: '#04-12',
    floor: 4,
    estate: 'Toa Payoh',
    residentName: 'Tan Ah Lian',
    residentAge: 78,
    detectedAt: '18:42:05',
    sensors: ['Acoustic', 'Thermal', 'Vibration'],
    aiExplanation: 'Impact anomaly (82dB) + sustained horizontal posture (>90s) + no subsequent movement detected → High-confidence collapse classification',
    timeElapsed: '00:04:22',
  },
  {
    id: 'INC-2026-088',
    type: 'Prolonged Immobility',
    description: 'No movement detected for 3+ hours during expected active period',
    severity: 'P2',
    status: 'verifying',
    confidence: 71.8,
    block: 'Blk 126',
    unit: '#11-30',
    floor: 11,
    estate: 'Toa Payoh',
    residentName: 'Wong Wei Ming',
    residentAge: 82,
    detectedAt: '15:30:00',
    sensors: ['Thermal'],
    aiExplanation: 'Extended immobility (3h 15m) during 1500–1830 active window + no utility usage detected → Moderate-confidence welfare concern',
    timeElapsed: '03:15:00',
  },
  {
    id: 'INC-2026-087',
    type: 'Utility Anomaly',
    description: 'Zero water/electricity usage for 24+ hours — welfare check recommended',
    severity: 'P3',
    status: 'detected',
    confidence: 58.4,
    block: 'Blk 124',
    unit: '#08-45',
    floor: 8,
    estate: 'Toa Payoh',
    residentName: 'Lim Boon Keng',
    residentAge: 75,
    detectedAt: '06:00:00',
    sensors: [],
    aiExplanation: 'Zero utility consumption (24h) during weekday period + no motion baseline deviation → Low-confidence welfare flag for manual verification',
    timeElapsed: '12:00:00',
  },
];

// ---- CFR Responders ----

export const cfrResponders: CFRResponder[] = [
  { id: 'CFR-001', name: 'David Lim', status: 'accepted', distance: '120m', eta: '2 min', certified: ['CPR', 'AED', 'First Aid'], phone: '+65 •••• 4521', acceptedAt: '18:43:12' },
  { id: 'CFR-002', name: 'Sarah Tan', status: 'en_route', distance: '350m', eta: '4 min', certified: ['CPR', 'AED'], phone: '+65 •••• 8833', acceptedAt: '18:43:28' },
  { id: 'CFR-003', name: 'Raj Kumar', status: 'notified', distance: '500m', eta: '6 min', certified: ['CPR'], phone: '+65 •••• 7712' },
  { id: 'CFR-004', name: 'Michelle Wong', status: 'standby', distance: '800m', eta: '8 min', certified: ['CPR', 'AED', 'First Aid'], phone: '+65 •••• 2290' },
];

// ---- AED Units ----

export const aedUnits: AEDUnit[] = [
  { id: 'AED-TP-01', location: 'Blk 124 Void Deck', block: 'Blk 124', floor: 'L1', status: 'assigned', distance: '40m', lastChecked: '2 days ago' },
  { id: 'AED-TP-02', location: 'Blk 125 CC Office', block: 'Blk 125', floor: 'L1', status: 'available', distance: '180m', lastChecked: '5 days ago' },
  { id: 'AED-TP-03', location: 'Toa Payoh Sports Hall', block: 'N/A', floor: 'L1', status: 'available', distance: '450m', lastChecked: '1 day ago' },
  { id: 'AED-AMK-01', location: 'Blk 213 Lift Lobby', block: 'Blk 213', floor: 'L1', status: 'available', distance: '15m', lastChecked: '3 days ago' },
];

// ---- Incident Timeline (for INC-2026-089) ----

export const incidentTimeline: TimelineEvent[] = [
  { time: '18:42:05', label: 'Anomaly Detected', detail: 'Acoustic sensor triggered — impact signature 82dB in #04-12', type: 'system', status: 'completed' },
  { time: '18:42:06', label: 'Multi-Sensor Fusion', detail: 'Thermal sensor confirms horizontal posture anomaly', type: 'ai', status: 'completed' },
  { time: '18:42:08', label: 'Confidence Scored', detail: 'AI classification: Heavy Fall — 94.2% confidence', type: 'ai', status: 'completed' },
  { time: '18:42:10', label: 'Operator Alert', detail: 'P1 alert pushed to Command Center dispatcher', type: 'system', status: 'completed' },
  { time: '18:42:35', label: 'Operator Verified', detail: 'Dispatcher confirmed — escalating to response', type: 'operator', status: 'completed' },
  { time: '18:43:00', label: 'CFR Activation', detail: '4 nearby CFRs notified via myResponder integration', type: 'system', status: 'completed' },
  { time: '18:43:12', label: 'CFR Accepted', detail: 'David Lim accepted — 120m away, ETA 2 min', type: 'cfr', status: 'completed' },
  { time: '18:43:15', label: 'AED Assigned', detail: 'Nearest AED: Blk 124 Void Deck (40m) — retrieval guidance sent', type: 'system', status: 'completed' },
  { time: '18:43:30', label: 'SCDF Notified', detail: 'Automated dispatch payload sent — Case #AMB-SG-8812', type: 'scdf', status: 'active' },
  { time: '18:44:00', label: 'SCDF En Route', detail: 'Ambulance dispatched from Fire Station 14 — ETA 8 min', type: 'scdf', status: 'active' },
  { time: '18:45:15', label: 'CFR On Scene', detail: 'David Lim arrived at unit #04-12 with AED', type: 'cfr', status: 'pending' },
  { time: '18:46:00', label: 'CPR Initiated', detail: 'CFR reports CPR started, AED pads applied', type: 'cfr', status: 'pending' },
];

// ---- Confidence Progression Data ----

export const confidenceProgression = [
  { time: '18:42:05', score: 62, label: 'Initial acoustic trigger' },
  { time: '18:42:06', score: 78, label: 'Thermal posture anomaly fused' },
  { time: '18:42:07', score: 85, label: 'Vibration impact correlation' },
  { time: '18:42:08', score: 94.2, label: 'Multi-sensor classification complete' },
];

// ---- System Status Summary ----

export const systemStatus = {
  totalNodes: 248,
  nodesOnline: 242,
  nodesOffline: 3,
  nodesDegraded: 3,
  pilotBlocks: 6,
  totalBlocks: 8,
  activeIncidents: 3,
  resolvedToday: 14,
  avgResponseTime: '4m 12s',
  uptime: 99.97,
  lteBackup: true,
  encryptedTransmission: true,
  edgeProcessingActive: true,
  activeCFRs: 12,
  aedUnitsAvailable: 4,
  lastSystemCheck: '2 min ago',
};

// ---- Resolved Incident History ----

export const resolvedIncidents = [
  { id: 'LOG-9921', type: 'Heavy Fall', resident: 'Ho Teck Ghee', responseTime: '4m 12s', status: 'Resolved', severity: 'P1' as SeverityLevel, action: 'SCDF Dispatched + CFR CPR', date: 'May 13, 2026', block: 'Blk 213' },
  { id: 'LOG-9920', type: 'Prolonged Immobility', resident: 'Tan Ah Lian', responseTime: '12m 45s', status: 'Resolved', severity: 'P2' as SeverityLevel, action: 'CFR Welfare Check', date: 'May 13, 2026', block: 'Blk 124' },
  { id: 'LOG-9919', type: 'Node Offline', resident: 'System', responseTime: '1m 02s', status: 'Auto-Resolved', severity: 'P3' as SeverityLevel, action: 'Self-Healed', date: 'May 12, 2026', block: 'Blk 128' },
  { id: 'LOG-9918', type: 'Acoustic Anomaly', resident: 'Lim Boon Keng', responseTime: '3m 22s', status: 'False Alarm', severity: 'P2' as SeverityLevel, action: 'Operator Dismissed', date: 'May 12, 2026', block: 'Blk 124' },
  { id: 'LOG-9917', type: 'Utility Anomaly', resident: 'Fatimah Binte Hassan', responseTime: '18m 05s', status: 'Resolved', severity: 'P3' as SeverityLevel, action: 'Neighbour Verified Safe', date: 'May 11, 2026', block: 'Blk 125' },
];
