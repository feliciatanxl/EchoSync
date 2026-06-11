import { NextResponse } from 'next/server';
import {
  generateNimAlertSummary,
  type NimAlertSummaryInput,
  type NimSummaryRiskLevel,
} from '@/lib/nim-alert-summary';

const riskLevels: NimSummaryRiskLevel[] = ['Critical', 'High', 'Medium', 'Low'];

export async function POST(request: Request) {
  try {
    const body = await request.json() as Partial<NimAlertSummaryInput>;
    const validationError = validateInput(body);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const result = await generateNimAlertSummary(body as NimAlertSummaryInput);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

function validateInput(input: Partial<NimAlertSummaryInput>) {
  if (!input.caseId || !input.caseType || !input.location) return 'Missing case details';
  if (typeof input.confidence !== 'number') return 'Missing confidence';
  if (!input.riskLevel || !riskLevels.includes(input.riskLevel)) return 'Invalid risk level';
  if (!input.detectors?.thermal || !input.detectors.acoustic || !input.detectors.loadMat || !input.detectors.doorFridge) {
    return 'Missing detector evidence';
  }
  if (!input.voiceCheckIn || !input.immobileTime || !input.recommendedAction) {
    return 'Missing voice check-in, immobile time, or recommended action';
  }
  return null;
}
