import { NextResponse } from "next/server";

type MyResponderAlert = {
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
  __echosyncMyResponderLatest?: MyResponderAlert;
  __echosyncMyResponderAlerts?: MyResponderAlert[];
};

function normaliseRiskLevel(value: unknown) {
  const risk = String(value || "Medium").toLowerCase();

  if (risk === "medium") return "Medium";
  if (risk === "low") return "Low";
  if (risk === "high") return "High";
  if (risk === "critical") return "Critical";

  return "Medium";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const riskLevel = String(body.riskLevel || "").toLowerCase();

    // Pi should only send Medium here.
    // Low goes caregiver only. High/Critical goes SCDF dashboard.
    if (riskLevel !== "medium") {
      return NextResponse.json(
        {
          ok: true,
          ignored: true,
          message: "Only Medium alerts are accepted by myResponder route",
        },
        { status: 202 }
      );
    }

    const receivedAt = new Date().toISOString();

    const alert: MyResponderAlert = {
      ...body,
      id: body.id || `MYR-${Date.now()}`,
      riskLevel: normaliseRiskLevel(body.riskLevel),
      receivedAt,
    };

    globalStore.__echosyncMyResponderLatest = alert;
    globalStore.__echosyncMyResponderAlerts =
      globalStore.__echosyncMyResponderAlerts || [];

    globalStore.__echosyncMyResponderAlerts.unshift(alert);
    globalStore.__echosyncMyResponderAlerts =
      globalStore.__echosyncMyResponderAlerts.slice(0, 50);

    console.log("EchoSync myResponder alert received:", alert);

    return NextResponse.json({
      ok: true,
      message: "myResponder alert received",
      latest: alert,
      alerts: globalStore.__echosyncMyResponderAlerts,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid myResponder alert payload",
      },
      { status: 400 }
    );
  }
}

export async function GET() {
  const alerts = globalStore.__echosyncMyResponderAlerts || [];

  return NextResponse.json({
    ok: true,
    latest: globalStore.__echosyncMyResponderLatest || null,
    alerts,
  });
}