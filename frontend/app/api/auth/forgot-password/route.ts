import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Call backend - it handles token generation AND email sending
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const backendResponse = await fetch(`${backendUrl}/api/v1/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await backendResponse.json();

    // Return backend response
    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    console.error('Forgot password error:', error);
    // Still return success for security (prevent email enumeration)
    return NextResponse.json({
      message: 'If that email exists, a reset link has been sent',
    });
  }
}

