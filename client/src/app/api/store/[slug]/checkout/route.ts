import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/store/:slug/checkout
 * Proxy to backend NestJS API for order creation from checkout
 * This allows client-side fetch to use relative URLs
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json();
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    const response = await fetch(`${backendUrl}/api/store/${params.slug}/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        data,
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error proxying checkout request to backend:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat membuat pesanan' },
      { status: 500 }
    );
  }
}
