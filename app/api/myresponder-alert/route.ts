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
  caregiverContext?: {
    submittedBy?: string;
    role?: string;
    selectedContext?: string[];
    note?: string;
    originalRiskLevel?: string;
    originalConfidence?: number;
    submittedAt?: string;
  };
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

    const source = String(body.source || "").toLowerCase();
    const eventType = String(body.eventType || "").toLowerCase();
    const hasCaregiverContext = Boolean(body.caregiverContext);

    // EchoSync flow:
    // - High / Critical alerts can be pushed by SCDF dashboard.
    // - Medium alerts are accepted only when SCDF dashboard pushes a caregiver-unverified case.
    // - Low/normal caregiver-only alerts are still ignored.
    const isHighOrCritical = riskLevel === "high" || riskLevel === "critical";
    const isCaregiverUnverifiedMedium =
      riskLevel === "medium" &&
      source.includes("scdf dashboard") &&
      (
        hasCaregiverContext ||
        eventType.includes("caregiver unable") ||
        eventType.includes("unable to verify")
      );

    if (!isHighOrCritical && !isCaregiverUnverifiedMedium) {
      return NextResponse.json(
        {
          ok: true,
          ignored: true,
          message:
            "Only High/Critical alerts or SCDF-pushed caregiver-unverified Medium cases are accepted by myResponder.",
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
      message: "Alert received by myResponder",
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