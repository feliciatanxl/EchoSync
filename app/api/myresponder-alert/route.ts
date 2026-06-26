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
  dashboardPushedAt?: string;
};

const globalStore = globalThis as typeof globalThis & {
  __echosyncMyResponderLatest?: MyResponderAlert;
  __echosyncMyResponderAlerts?: MyResponderAlert[];
};

function normaliseRiskLevel(value: unknown) {
  const risk = String(value || "").toLowerCase();

  if (risk === "critical") return "Critical";
  if (risk === "high") return "High";
  if (risk === "medium") return "Medium";
  if (risk === "low") return "Low";

  return "Medium";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const riskLevel = String(body.riskLevel || "").toLowerCase();

    // Latest EchoSync flow:
    // Low / Medium stay in caregiver app.
    // myResponder only receives High / Critical when SCDF dashboard/operator pushes it.
    if (riskLevel !== "high" && riskLevel !== "critical") {
      return NextResponse.json(
        {
          ok: true,
          ignored: true,
          message:
            "Only High/Critical alerts pushed by SCDF dashboard are accepted by myResponder.",
        },
        { status: 202 }
      );
    }

    const receivedAt = new Date().toISOString();

    const alert: MyResponderAlert = {
      ...body,
      id: body.id || `MYR-${Date.now()}`,
      riskLevel: normaliseRiskLevel(body.riskLevel),
      source: body.source || "SCDF Dashboard",
      dashboardPushedAt: receivedAt,
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
      message: "High/Critical alert received by myResponder",
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