import { NextResponse } from 'next/server';
import { getEchoSyncSimulation, type EchoSyncScenarioId } from '@/lib/echosync-simulator';

const validScenarios: EchoSyncScenarioId[] = [
  'critical-no-response',
  'false-alarm-filtered',
  'needs-dispatcher-review',
];

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedScenario = searchParams.get('scenario') as EchoSyncScenarioId | null;
  const scenario = requestedScenario && validScenarios.includes(requestedScenario)
    ? requestedScenario
    : 'critical-no-response';

  return NextResponse.json(getEchoSyncSimulation(scenario));
}
