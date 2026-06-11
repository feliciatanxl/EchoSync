import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, otp } = body;

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, error: 'Phone and OTP are required' },
        { status: 400 }
      );
    }

    if (otp.length !== 6) {
      return NextResponse.json(
        { success: false, error: 'Invalid OTP format' },
        { status: 400 }
      );
    }

    // Mock: always succeed
    return NextResponse.json({
      success: true,
      token: 'mock_token_' + Date.now(),
      user: {
        phone,
        verified: true,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    );
  }
}
