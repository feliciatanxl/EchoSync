import { NextResponse } from "next/server";

type RiskLevel = "Low" | "Medium" | "High" | "Critical" | string;

type CaregiverAlert = {
  id?: string;
  nodeId?: string;
  resident?: string;
  location?: string;
  eventType?: string;
  riskLevel?: RiskLevel;
  confidence?: number;
  reason?: string;
  sensorData?: unknown;
  voiceCheckIn?: unknown;
  aiSummary?: string;
  source?: string;
  timestamp?: string;
  receivedAt?: string;
  historyCategory?: "verified" | "escalated" | "device" | "all";
};

const globalStore = globalThis as typeof globalThis & {
  __echosyncCaregiverLatest?: CaregiverAlert;
  __echosyncCaregiverAlerts?: CaregiverAlert[];
};

function normaliseRiskLevel(value: unknown): RiskLevel {
  const risk = String(value || "Low").toLowerCase();

  if (risk === "critical") return "Critical";
  if (risk === "high") return "High";
  if (risk === "medium") return "Medium";
  if (risk === "low") return "Low";

  return "Low";
}

function getHistoryCategory(alert: CaregiverAlert): CaregiverAlert["historyCategory"] {
  const risk = String(alert.riskLevel || "").toLowerCase();
  const eventType = String(alert.eventType || "").toLowerCase();
  const reason = String(alert.reason || "").toLowerCase();
  const voiceCheckIn = alert.voiceCheckIn as { intent?: string } | undefined;
  const intent = String(voiceCheckIn?.intent || "").toLowerCase();

  if (
    eventType.includes("offline") ||
    eventType.includes("device") ||
    reason.includes("wi-fi") ||
    reason.includes("wifi")
  ) {
    return "device";
  }

  if (
    risk === "high" ||
    risk === "critical" ||
    eventType.includes("no response") ||
    eventType.includes("emergency")
  ) {
    return "escalated";
  }

  if (
    intent === "ok" ||
    eventType.includes("verified") ||
    eventType.includes("okay") ||
    reason.includes("okay")
  ) {
    return "verified";
  }

  return "all";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const receivedAt = new Date().toISOString();

    const alert: CaregiverAlert = {
      ...body,
      id: body.id || `CARE-${Date.now()}`,
      riskLevel: normaliseRiskLevel(body.riskLevel),
      receivedAt,
    };

    alert.historyCategory = getHistoryCategory(alert);

    globalStore.__echosyncCaregiverLatest = alert;
    globalStore.__echosyncCaregiverAlerts =
      globalStore.__echosyncCaregiverAlerts || [];

    globalStore.__echosyncCaregiverAlerts.unshift(alert);

    // Keep latest 50 real caregiver alerts for demo history.
    globalStore.__echosyncCaregiverAlerts =
      globalStore.__echosyncCaregiverAlerts.slice(0, 50);

    console.log("EchoSync caregiver alert received:", alert);

    return NextResponse.json({
      ok: true,
      message: "Caregiver alert received",
      latest: alert,
      alerts: globalStore.__echosyncCaregiverAlerts,
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
  const alerts = globalStore.__echosyncCaregiverAlerts || [];

  return NextResponse.json({
    ok: true,
    latest: globalStore.__echosyncCaregiverLatest || null,
    alerts,
  });
}