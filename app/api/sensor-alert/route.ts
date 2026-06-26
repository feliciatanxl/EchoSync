import { NextResponse } from "next/server";

type SensorAlert = {
  id?: string;
  nodeId?: string;
  resident?: string;
  location?: string;
  eventType?: string;
  riskLevel?: string;
  confidence?: number;
  reason?: string;
  sensorData?: unknown;
  voiceCheckIn?: unknown;
  aiSummary?: string;
  source?: string;
  timestamp?: string;
  receivedAt?: string;
};

const globalStore = globalThis as typeof globalThis & {
  __echosyncSensorLatest?: SensorAlert;
  __echosyncSensorEvents?: SensorAlert[];
};

function normaliseRiskLevel(value: unknown) {
  const risk = String(value || "High").toLowerCase();

  if (risk === "critical") return "Critical";
  if (risk === "high") return "High";
  if (risk === "medium") return "Medium";
  if (risk === "low") return "Low";

  return "High";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const receivedAt = new Date().toISOString();

    const alert: SensorAlert = {
      ...body,
      id: body.id || `LIVE-${Date.now()}`,
      riskLevel: normaliseRiskLevel(body.riskLevel),
      receivedAt,
    };

    globalStore.__echosyncSensorLatest = alert;
    globalStore.__echosyncSensorEvents =
      globalStore.__echosyncSensorEvents || [];

    globalStore.__echosyncSensorEvents.unshift(alert);

    // Keep latest 50 dashboard alerts for demo.
    globalStore.__echosyncSensorEvents =
      globalStore.__echosyncSensorEvents.slice(0, 50);

    console.log("EchoSync SCDF dashboard alert received:", alert);

    return NextResponse.json({
      ok: true,
      status: "received",
      message: "SCDF dashboard alert received",
      latest: alert,
      events: globalStore.__echosyncSensorEvents,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid sensor alert payload",
      },
      { status: 400 }
    );
  }
}

export async function GET() {
  const events = globalStore.__echosyncSensorEvents || [];

  return NextResponse.json({
    ok: true,
    latest: globalStore.__echosyncSensorLatest || null,
    events,
  });
}