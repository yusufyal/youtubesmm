import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const gatewayUrl =
      process.env.NEXT_PUBLIC_PAYMENT_GATEWAY_URL || 'https://hnh-media.com';

    const response = await fetch(`${gatewayUrl}/api/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Payment gateway error:', error);
    return NextResponse.json(
      { error: error.message || 'Payment gateway request failed' },
      { status: 500 }
    );
  }
}
