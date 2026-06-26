import { NextResponse } from "next/server";

type PreferredLanguage = "en" | "zh" | "ms" | "ta";

type NodeControlState = {
  pauseLowRiskMonitoring: boolean;
  sensorMonitoringEnabled: boolean;
  reason: string | null;
  durationMinutes: number | null;
  preferredLanguage: PreferredLanguage;
  updatedAt: string | null;
};

const globalStore = globalThis as typeof globalThis & {
  __echosyncNodeControl?: NodeControlState;
};

function normaliseLanguage(value: unknown): PreferredLanguage {
  if (value === "zh" || value === "ms" || value === "ta" || value === "en") {
    return value;
  }

  return "en";
}

function getDefaultState(): NodeControlState {
  return {
    pauseLowRiskMonitoring: false,
    sensorMonitoringEnabled: true,
    reason: null,
    durationMinutes: null,
    preferredLanguage: "en",
    updatedAt: null,
  };
}

export async function GET() {
  const state = globalStore.__echosyncNodeControl || getDefaultState();

  return NextResponse.json({
    ok: true,
    ...state,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const current = globalStore.__echosyncNodeControl || getDefaultState();

    const state: NodeControlState = {
      pauseLowRiskMonitoring:
        typeof body.pauseLowRiskMonitoring === "boolean"
          ? body.pauseLowRiskMonitoring
          : current.pauseLowRiskMonitoring,

      sensorMonitoringEnabled:
        typeof body.sensorMonitoringEnabled === "boolean"
          ? body.sensorMonitoringEnabled
          : current.sensorMonitoringEnabled,

      reason:
        Object.prototype.hasOwnProperty.call(body, "reason")
          ? body.reason || null
          : current.reason,

      durationMinutes:
        Object.prototype.hasOwnProperty.call(body, "durationMinutes")
          ? body.durationMinutes || null
          : current.durationMinutes,

      preferredLanguage: normaliseLanguage(
        body.preferredLanguage ?? current.preferredLanguage
      ),

      updatedAt: new Date().toISOString(),
    };

    globalStore.__echosyncNodeControl = state;

    console.log("EchoSync node control updated:", state);

    return NextResponse.json({
      ok: true,
      message: "Node control updated",
      ...state,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid node control payload",
      },
      { status: 400 }
    );
  }
}