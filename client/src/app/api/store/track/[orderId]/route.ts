import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/store/track/:orderId
 * Proxy to backend NestJS API for order tracking
 * This allows client-side fetch to use relative URLs
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/api/store/track/${params.orderId}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: 'Pesanan tidak ditemukan' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying request to backend:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat mengambil data pesanan' },
      { status: 500 }
    );
  }
}
