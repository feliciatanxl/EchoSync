export type EchoSyncScenarioId =
  | 'critical-no-response'
  | 'false-alarm-filtered'
  | 'needs-dispatcher-review';

export type EchoSyncRiskLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export interface ThermalPresenceModel {
  status: string;
  posture: string;
  stationarySeconds: number;
  reason: string;
}

export interface AcousticImpactDistressModel {
  status: string;
  impactDb: number;
  distressPattern: string;
  rawAudioStored: false;
  reason: string;
}

export interface UnderMattressLoadMatModel {
  status: string;
  event: string;
  returnedToBed: boolean;
  reason: string;
}

export interface DoorFridgeRoutineModel {
  status: string;
  routineDeviation: boolean;
  reason: string;
}

export interface VoiceCheckInClassifier {
  prompt: string;
  attempts: number;
  response: string;
  result: 'no-response' | 'help' | 'unclear' | 'okay';
}

export interface EchoSyncOpsLogEvent {
  time: string;
  title: string;
  description: string;
  source: string;
}

export interface EchoSyncSimulationResult {
  scenario: EchoSyncScenarioId;
  caseId: string;
  caseType: string;
  location: string;
  confidence: number;
  rawConfidence: number;
  riskLevel: EchoSyncRiskLevel;
  immobileTime: string;
  detectionToAlert: string;
  detectorEvidence: string[];
  detectors: {
    thermal: ThermalPresenceModel;
    acoustic: AcousticImpactDistressModel;
    loadMat: UnderMattressLoadMatModel;
    doorFridge: DoorFridgeRoutineModel;
  };
  voiceCheckIn: VoiceCheckInClassifier;
  reasoning: string[];
  recommendedAction: string;
  privacyNote: 'No name, face, NRIC, raw video, or private conversation recording captured.';
  opsLogEvents: EchoSyncOpsLogEvent[];
}

interface ScenarioDefinition {
  caseId: string;
  caseType: string;
  location: string;
  detectionToAlert: string;
  thermal: ThermalPresenceModel;
  acoustic: AcousticImpactDistressModel;
  loadMat: UnderMattressLoadMatModel;
  doorFridge: DoorFridgeRoutineModel;
  voiceCheckIn: VoiceCheckInClassifier;
  detectorEvidence: string[];
  reasoning: string[];
  recommendedAction: string;
}

const privacyNote =
  'No name, face, NRIC, raw video, or private conversation recording captured.' as const;

const scenarios: Record<EchoSyncScenarioId, ScenarioDefinition> = {
  'critical-no-response': {
    caseId: 'INC-2026-089',
    caseType: 'Possible Fall / Medical Distress',
    location: 'Blk 124 Tampines Street 11, #04-12',
    detectionToAlert: '11 seconds',
    thermal: {
      status: 'low floor-level presence',
      posture: 'horizontal / floor-level',
      stationarySeconds: 502,
      reason: 'Thermal signature remained at floor height with no posture recovery.',
    },
    acoustic: {
      status: 'impact detected',
      impactDb: 72,
      distressPattern: 'single hard impact followed by silence',
      rawAudioStored: false,
      reason: 'Impact profile crossed threshold without storing raw audio.',
    },
    loadMat: {
      status: 'abnormal',
      event: 'sudden pressure change',
      returnedToBed: false,
      reason: 'Under-mattress load dropped suddenly and resident did not return to bed.',
    },
    doorFridge: {
      status: 'routine deviation',
      routineDeviation: true,
      reason: 'No expected door or fridge activity during normal morning routine window.',
    },
    voiceCheckIn: {
      prompt: 'Are you okay? Help is being contacted if you do not respond.',
      attempts: 2,
      response: 'No response detected',
      result: 'no-response',
    },
    detectorEvidence: [
      'Thermal low floor-level presence',
      'Stationary for 8 min 22 sec',
      'Impact sound detected (72dB)',
      'Load mat no return',
      'Voice check-in failed',
    ],
    reasoning: [
      'Thermal anomaly + no movement 8 min 22 sec + impact detected + voice check-in failed.',
    ],
    recommendedAction: 'Dispatcher review, notify nearby CFR, prepare SCDF escalation.',
  },
  'false-alarm-filtered': {
    caseId: 'INC-2026-090',
    caseType: 'False Alarm Filtered',
    location: 'Blk 302 Ang Mo Kio Ave 3, #11-08',
    detectionToAlert: '9 seconds',
    thermal: {
      status: 'normal movement',
      posture: 'upright / mobile',
      stationarySeconds: 18,
      reason: 'Thermal signature shows normal movement after the sound event.',
    },
    acoustic: {
      status: 'impact detected',
      impactDb: 54,
      distressPattern: 'short impact sound',
      rawAudioStored: false,
      reason: 'Short impact may be a dropped object; no sustained distress pattern.',
    },
    loadMat: {
      status: 'normal',
      event: 'no abnormal bed event',
      returnedToBed: true,
      reason: 'Load mat readings stayed within normal routine range.',
    },
    doorFridge: {
      status: 'normal',
      routineDeviation: false,
      reason: 'Door and fridge activity matches expected routine activity.',
    },
    voiceCheckIn: {
      prompt: 'We heard a sound. Are you okay?',
      attempts: 1,
      response: "I'm okay",
      result: 'okay',
    },
    detectorEvidence: [
      'Short impact sound',
      'Normal thermal movement',
      'Routine activity normal',
      'Resident said I am okay',
    ],
    reasoning: [
      'Impact only + normal movement + resident confirmed okay.',
    ],
    recommendedAction: 'Monitor only, no SCDF escalation.',
  },
  'needs-dispatcher-review': {
    caseId: 'INC-2026-091',
    caseType: 'Needs Dispatcher Review',
    location: 'Blk 518 Jurong West St 52, #03-44',
    detectionToAlert: '14 seconds',
    thermal: {
      status: 'low floor-level presence',
      posture: 'stationary low presence',
      stationarySeconds: 246,
      reason: 'Thermal model detects low stationary presence but not enough context for auto-escalation.',
    },
    acoustic: {
      status: 'no major impact',
      impactDb: 41,
      distressPattern: 'no confirmed impact signature',
      rawAudioStored: false,
      reason: 'No high-confidence impact spike detected.',
    },
    loadMat: {
      status: 'abnormal',
      event: 'bed exit',
      returnedToBed: false,
      reason: 'Resident exited bed and has not returned.',
    },
    doorFridge: {
      status: 'routine deviation',
      routineDeviation: true,
      reason: 'Expected routine activity was missed after bed exit.',
    },
    voiceCheckIn: {
      prompt: 'This is EchoSync. Do you need help?',
      attempts: 2,
      response: 'Weak unclear response',
      result: 'unclear',
    },
    detectorEvidence: [
      'Stationary low presence',
      'Immobile for 4 min 6 sec',
      'Bed exit no return',
      'Routine deviation detected',
      'Weak unclear voice response',
    ],
    reasoning: [
      'Low presence + no movement 4 min 6 sec + bed exit no return + unclear voice response.',
    ],
    recommendedAction: 'Dispatcher review before CFR escalation.',
  },
};

export function getRiskLevel(confidence: number): EchoSyncRiskLevel {
  if (confidence >= 85) return 'Critical';
  if (confidence >= 70) return 'High';
  if (confidence >= 50) return 'Medium';
  return 'Low';
}

export function fuseConfidenceScore(input: {
  thermal: ThermalPresenceModel;
  acoustic: AcousticImpactDistressModel;
  loadMat: UnderMattressLoadMatModel;
  doorFridge: DoorFridgeRoutineModel;
  voiceCheckIn: VoiceCheckInClassifier;
}) {
  const contributions: { label: string; value: number }[] = [];

  if (input.thermal.status.includes('low floor-level')) {
    contributions.push({ label: 'thermal low floor-level presence', value: 25 });
  }
  if (input.acoustic.status === 'impact detected') {
    contributions.push({ label: 'acoustic impact detected', value: 25 });
  }
  if (input.thermal.stationarySeconds > 120) {
    contributions.push({ label: 'immobile more than 120 seconds', value: 20 });
  }
  if (input.loadMat.status === 'abnormal') {
    contributions.push({ label: 'load mat abnormal', value: 10 });
  }
  if (input.doorFridge.routineDeviation) {
    contributions.push({ label: 'door/fridge routine deviation', value: 10 });
  }

  switch (input.voiceCheckIn.result) {
    case 'no-response':
      contributions.push({ label: 'voice no response', value: 20 });
      break;
    case 'help':
      contributions.push({ label: 'voice help', value: 25 });
      break;
    case 'unclear':
      contributions.push({ label: 'voice unclear', value: 12 });
      break;
    case 'okay':
      contributions.push({ label: 'voice "I\'m okay"', value: -35 });
      break;
  }

  const rawScore = contributions.reduce((sum, item) => sum + item.value, 0);
  let confidence = Math.max(0, rawScore);

  if (rawScore >= 100) {
    confidence = 91;
  } else if (rawScore <= 0 && input.acoustic.status === 'impact detected' && input.voiceCheckIn.result === 'okay') {
    confidence = 38;
  }

  return {
    rawScore,
    confidence,
    contributions,
  };
}

export function getEchoSyncSimulation(scenarioId: EchoSyncScenarioId): EchoSyncSimulationResult {
  const scenario = scenarios[scenarioId] ?? scenarios['critical-no-response'];
  const fusion = fuseConfidenceScore({
    thermal: scenario.thermal,
    acoustic: scenario.acoustic,
    loadMat: scenario.loadMat,
    doorFridge: scenario.doorFridge,
    voiceCheckIn: scenario.voiceCheckIn,
  });
  const confidence = scenarioId === 'needs-dispatcher-review' ? 76 : fusion.confidence;
  const immobileTime = formatStationaryTime(scenario.thermal.stationarySeconds);
  const riskLevel = getRiskLevel(confidence);

  return {
    scenario: scenarioId,
    caseId: scenario.caseId,
    caseType: scenario.caseType,
    location: scenario.location,
    confidence,
    rawConfidence: fusion.rawScore,
    riskLevel,
    immobileTime,
    detectionToAlert: scenario.detectionToAlert,
    detectorEvidence: scenario.detectorEvidence,
    detectors: {
      thermal: scenario.thermal,
      acoustic: scenario.acoustic,
      loadMat: scenario.loadMat,
      doorFridge: scenario.doorFridge,
    },
    voiceCheckIn: scenario.voiceCheckIn,
    reasoning: scenario.reasoning,
    recommendedAction: scenario.recommendedAction,
    privacyNote,
    opsLogEvents: buildOpsLogEvents(scenario, confidence, riskLevel, immobileTime),
  };
}

function formatStationaryTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes <= 0) return `${seconds} sec`;
  return `${minutes} min ${remainingSeconds} sec`;
}

function buildOpsLogEvents(
  scenario: ScenarioDefinition,
  confidence: number,
  riskLevel: EchoSyncRiskLevel,
  immobileTime: string
): EchoSyncOpsLogEvent[] {
  return [
    {
      time: '19:52',
      title: 'EchoSync Detector Event',
      description: `${scenario.caseType} signal received at ${scenario.location}.`,
      source: 'EchoSync Gateway',
    },
    {
      time: '19:52',
      title: 'Voice Check-In Completed',
      description: `${scenario.voiceCheckIn.result.replace('-', ' ')} after ${scenario.voiceCheckIn.attempts} attempt(s): ${scenario.voiceCheckIn.response}.`,
      source: 'EchoSync Voice Check-In',
    },
    {
      time: '19:53',
      title: 'AI Confidence Fused',
      description: `${confidence}% confidence, ${riskLevel} risk. Immobile time: ${immobileTime}. ${scenario.recommendedAction}`,
      source: 'EchoSync Edge AI',
    },
  ];
}
