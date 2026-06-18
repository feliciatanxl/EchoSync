import { NextResponse } from "next/server";

type CaregiverAlert = {
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
  __echosyncCaregiverLatest?: CaregiverAlert;
  __echosyncCaregiverAlerts?: CaregiverAlert[];
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const alert: CaregiverAlert = {
      ...body,
      receivedAt: new Date().toISOString(),
    };

    globalStore.__echosyncCaregiverLatest = alert;
    globalStore.__echosyncCaregiverAlerts =
      globalStore.__echosyncCaregiverAlerts || [];

    globalStore.__echosyncCaregiverAlerts.unshift(alert);
    globalStore.__echosyncCaregiverAlerts =
      globalStore.__echosyncCaregiverAlerts.slice(0, 20);

    console.log("EchoSync caregiver alert received:", alert);

    return NextResponse.json({
      ok: true,
      message: "Caregiver alert received",
      latest: alert,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid caregiver alert payload",
      },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    latest: globalStore.__echosyncCaregiverLatest || null,
    alerts: globalStore.__echosyncCaregiverAlerts || [],
  });
}