import { NextResponse } from "next/server";

let latestAlert: any = {
  message: "No sensor data received yet",
};

export async function POST(req: Request) {
  try {
    const data = await req.json();

    latestAlert = {
      ...data,
      received_at: new Date().toISOString(),
    };

    return NextResponse.json({
      status: "received",
      data: latestAlert,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json(latestAlert);
}