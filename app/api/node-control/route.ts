import { NextResponse } from "next/server";

type NodeControlState = {
  pauseLowRiskMonitoring: boolean;
  reason: string | null;
  durationMinutes: number | null;
  updatedAt: string | null;
};

const globalStore = globalThis as typeof globalThis & {
  __echosyncNodeControl?: NodeControlState;
};

function getDefaultState(): NodeControlState {
  return {
    pauseLowRiskMonitoring: false,
    reason: null,
    durationMinutes: null,
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

    const state: NodeControlState = {
      pauseLowRiskMonitoring: Boolean(body.pauseLowRiskMonitoring),
      reason: body.reason || null,
      durationMinutes: body.durationMinutes || null,
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