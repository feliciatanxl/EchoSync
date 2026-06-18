import { NextResponse } from "next/server";

type MyResponderAlert = {
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

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const riskLevel = String(body.riskLevel || "").toLowerCase();

    // myResponder should only receive low/medium verification alerts
    if (!["low", "medium"].includes(riskLevel)) {
      return NextResponse.json(
        {
          ok: false,
          ignored: true,
          message: "Only Low/Medium alerts are accepted by myResponder route",
        },
        { status: 202 }
      );
    }

    const alert: MyResponderAlert = {
      ...body,
      receivedAt: new Date().toISOString(),
    };

    globalStore.__echosyncMyResponderLatest = alert;
    globalStore.__echosyncMyResponderAlerts =
      globalStore.__echosyncMyResponderAlerts || [];

    globalStore.__echosyncMyResponderAlerts.unshift(alert);
    globalStore.__echosyncMyResponderAlerts =
      globalStore.__echosyncMyResponderAlerts.slice(0, 20);

    console.log("EchoSync myResponder alert received:", alert);

    return NextResponse.json({
      ok: true,
      message: "myResponder alert received",
      latest: alert,
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
  return NextResponse.json({
    ok: true,
    latest: globalStore.__echosyncMyResponderLatest || null,
    alerts: globalStore.__echosyncMyResponderAlerts || [],
  });
}