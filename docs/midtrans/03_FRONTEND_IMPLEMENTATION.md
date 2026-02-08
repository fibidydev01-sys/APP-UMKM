# Midtrans Frontend Implementation - Step by Step

> Disesuaikan dengan infrastruktur Next.js + Zustand + custom ApiClient existing.
> Guide asli pakai axios, semua diadaptasi ke `api` client dari `lib/api/client.ts`.

---

## STEP 1: Tambah Environment Variable

### File: `client/.env.local`

```env
# Midtrans
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxxx
NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=false
```

Hanya `CLIENT_KEY` yang di-expose ke frontend. `SERVER_KEY` tetap hanya di backend.

---

## STEP 2: Buat Snap.js Type Declaration

### File: `client/src/types/midtrans-snap.d.ts` (BARU)

```typescript
/**
 * Midtrans Snap.js Type Declarations
 * Snap.js di-load via CDN <Script> tag
 */

interface SnapResult {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: string;
  fraud_status?: string;
  pdf_url?: string;
  finish_redirect_url?: string;
}

interface SnapOptions {
  onSuccess?: (result: SnapResult) => void;
  onPending?: (result: SnapResult) => void;
  onError?: (result: SnapResult) => void;
  onClose?: () => void;
}

interface Snap {
  pay: (snapToken: string, options?: SnapOptions) => void;
  hide: () => void;
  show: () => void;
}

interface Window {
  snap?: Snap;
}
```

---

## STEP 3: Buat Payment API Service

### File: `client/src/lib/api/payment.ts` (BARU)

Mengikuti pattern existing (`lib/api/orders.ts`, `lib/api/products.ts`, dll):

```typescript
import { api } from './client';

// ==========================================
// TYPES
// ==========================================

export interface CreatePaymentData {
  orderId: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

export interface CreatePaymentResponse {
  token: string;
  redirect_url: string;
  transaction_id: string;
  order_id: string;
}

export interface MidtransClientKeyResponse {
  clientKey: string;
}

// ==========================================
// PAYMENT API
// ==========================================

export const paymentApi = {
  /**
   * Get Midtrans client key dari backend
   * GET /api/payment/client-key
   */
  getClientKey: () =>
    api.get<MidtransClientKeyResponse>('/payment/client-key'),

  /**
   * Create Midtrans payment transaction (PUBLIC)
   * POST /api/store/:slug/pay
   */
  createPayment: (slug: string, data: CreatePaymentData) =>
    api.post<CreatePaymentResponse>(`/store/${slug}/pay`, data),

  /**
   * Get transaction status (PROTECTED)
   * GET /api/payment/status/:orderId
   */
  getTransactionStatus: (orderId: string) =>
    api.get<any>(`/payment/status/${orderId}`),

  /**
   * Cancel transaction (PROTECTED)
   * POST /api/payment/cancel/:orderId
   */
  cancelTransaction: (orderId: string) =>
    api.post<any>(`/payment/cancel/${orderId}`),
};
```

---

## STEP 4: Buat useSnapPayment Hook

### File: `client/src/hooks/use-snap-payment.ts` (BARU)

```typescript
'use client';

import { useEffect, useState, useCallback } from 'react';

const SNAP_URL_SANDBOX = 'https://app.sandbox.midtrans.com/snap/snap.js';
const SNAP_URL_PRODUCTION = 'https://app.midtrans.com/snap/snap.js';

interface UseSnapPaymentOptions {
  clientKey: string;
  isProduction?: boolean;
}

interface UseSnapPaymentReturn {
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  pay: (snapToken: string, options?: SnapOptions) => void;
}

/**
 * Hook untuk load Midtrans Snap.js dan trigger payment
 *
 * Usage:
 * ```
 * const { isLoaded, pay } = useSnapPayment({ clientKey: 'SB-Mid-client-xxx' });
 * pay(snapToken, { onSuccess, onPending, onError, onClose });
 * ```
 */
export function useSnapPayment({
  clientKey,
  isProduction = false,
}: UseSnapPaymentOptions): UseSnapPaymentReturn {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Skip di server-side
    if (typeof window === 'undefined') return;

    // Sudah loaded
    if (window.snap) {
      setIsLoaded(true);
      return;
    }

    // Cek apakah script sudah ada di DOM
    const existingScript = document.querySelector(
      'script[src*="snap.js"]',
    ) as HTMLScriptElement;

    if (existingScript) {
      // Script ada tapi belum loaded
      const onLoad = () => setIsLoaded(true);
      const onError = () => setError('Gagal memuat sistem pembayaran');

      existingScript.addEventListener('load', onLoad);
      existingScript.addEventListener('error', onError);

      return () => {
        existingScript.removeEventListener('load', onLoad);
        existingScript.removeEventListener('error', onError);
      };
    }

    // Load script baru
    setIsLoading(true);
    const script = document.createElement('script');
    script.src = isProduction ? SNAP_URL_PRODUCTION : SNAP_URL_SANDBOX;
    script.setAttribute('data-client-key', clientKey);
    script.async = true;

    script.onload = () => {
      setIsLoaded(true);
      setIsLoading(false);
    };

    script.onerror = () => {
      setError('Gagal memuat sistem pembayaran');
      setIsLoading(false);
    };

    document.head.appendChild(script);

    // Cleanup: jangan remove script karena bisa dipakai component lain
  }, [clientKey, isProduction]);

  const pay = useCallback(
    (snapToken: string, options?: SnapOptions) => {
      if (!isLoaded || !window.snap) {
        console.error('Snap.js belum siap');
        return;
      }

      window.snap.pay(snapToken, {
        onSuccess: (result) => {
          console.log('Payment success:', result);
          options?.onSuccess?.(result);
        },
        onPending: (result) => {
          console.log('Payment pending:', result);
          options?.onPending?.(result);
        },
        onError: (result) => {
          console.error('Payment error:', result);
          options?.onError?.(result);
        },
        onClose: () => {
          console.log('Payment popup closed');
          options?.onClose?.();
        },
      });
    },
    [isLoaded],
  );

  return { isLoaded, isLoading, error, pay };
}
```

---

## STEP 5: Buat Midtrans Payment Dialog Component

### File: `client/src/components/store/midtrans-payment-dialog.tsx` (BARU)

Ini component dialog yang muncul ketika customer pilih "Bayar Online".
Mengikuti pattern dari `whatsapp-checkout-dialog.tsx`.

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, CreditCard, ShieldCheck } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import { useSnapPayment } from '@/hooks/use-snap-payment';
import { paymentApi } from '@/lib/api/payment';
import { useCartStore } from '@/stores/cart-store';

interface MidtransPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slug: string;
  orderId: string;
  orderTotal: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

export function MidtransPaymentDialog({
  open,
  onOpenChange,
  slug,
  orderId,
  orderTotal,
  customerName,
  customerEmail,
  customerPhone,
}: MidtransPaymentDialogProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const clearCart = useCartStore((state) => state.clearCart);

  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '';
  const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true';

  const { isLoaded, isLoading: snapLoading, pay } = useSnapPayment({
    clientKey,
    isProduction,
  });

  const handlePayment = async () => {
    if (!isLoaded) {
      toast.error('Sistem pembayaran sedang dimuat, coba lagi');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Create Midtrans transaction via backend
      const response = await paymentApi.createPayment(slug, {
        orderId,
        customerName,
        customerEmail,
        customerPhone,
      });

      // 2. Buka Snap popup
      pay(response.token, {
        onSuccess: (result) => {
          toast.success('Pembayaran berhasil!');
          clearCart();
          onOpenChange(false);
          router.push(`/store/${slug}/track/${orderId}?payment=success`);
        },
        onPending: (result) => {
          toast.info('Silakan selesaikan pembayaran Anda');
          clearCart();
          onOpenChange(false);
          router.push(`/store/${slug}/track/${orderId}?payment=pending`);
        },
        onError: (result) => {
          toast.error('Pembayaran gagal. Silakan coba lagi.');
          setIsProcessing(false);
        },
        onClose: () => {
          // Customer menutup popup tanpa bayar
          setIsProcessing(false);
          toast.info('Pembayaran dibatalkan. Anda bisa bayar nanti melalui halaman tracking.');
        },
      });
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Gagal memproses pembayaran');
      setIsProcessing(false);
    }
  };

  const formattedTotal = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(orderTotal);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Bayar Online
          </DialogTitle>
          <DialogDescription>
            Bayar dengan Bank Transfer, E-Wallet, QRIS, atau Kartu Kredit
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Order Summary */}
          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Pembayaran</span>
              <span className="font-bold text-lg">{formattedTotal}</span>
            </div>
            {customerName && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Nama</span>
                <span>{customerName}</span>
              </div>
            )}
          </div>

          {/* Payment Methods Info */}
          <div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">Metode pembayaran tersedia:</p>
            <p>Bank Transfer (BCA, BNI, BRI, Mandiri)</p>
            <p>E-Wallet (GoPay, ShopeePay)</p>
            <p>QRIS, Kartu Kredit/Debit</p>
            <p>Minimarket (Indomaret, Alfamart)</p>
          </div>

          {/* Security Badge */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-green-500" />
            <span>Pembayaran aman diproses oleh Midtrans</span>
          </div>

          {/* Pay Button */}
          <Button
            onClick={handlePayment}
            disabled={isProcessing || snapLoading || !isLoaded}
            className="w-full"
            size="lg"
          >
            {(isProcessing || snapLoading) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {snapLoading
              ? 'Memuat sistem pembayaran...'
              : isProcessing
                ? 'Memproses...'
                : `Bayar ${formattedTotal}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

---

## STEP 6: Modifikasi Checkout Flow

Sekarang checkout dialog perlu support 2 path:
1. **WhatsApp** (existing) - kirim detail order via WA
2. **Bayar Online** (new) - buka Midtrans Snap

### Opsi A: Tambah Tombol di Checkout Dialog Existing

Modifikasi `whatsapp-checkout-dialog.tsx` untuk menambahkan tombol "Bayar Online" setelah checkout.

**Konsep flow:**

```
[Checkout Form] -> Customer isi nama, phone, alamat
                -> Customer pilih:
                   [Kirim via WhatsApp]  -> flow existing
                   [Bayar Online]        -> create order -> open Midtrans
```

### Perubahan di `whatsapp-checkout-dialog.tsx`:

Setelah `createOrder` berhasil, tampilkan 2 pilihan:

```tsx
// State baru
const [orderCreated, setOrderCreated] = useState<{
  orderId: string;
  total: number;
} | null>(null);
const [showMidtrans, setShowMidtrans] = useState(false);

// Setelah checkout berhasil, simpan orderId
const handleCheckout = async () => {
  // ... existing checkout logic ...
  const result = await storeApi.checkout(slug, checkoutData);

  // Simpan untuk Midtrans
  setOrderCreated({
    orderId: result.order.id,
    total: result.order.total,
  });

  // Tampilkan pilihan: WhatsApp atau Bayar Online
};

// Di render, setelah order dibuat:
{orderCreated && (
  <div className="space-y-3">
    <p className="text-sm text-center">Pesanan berhasil dibuat! Pilih cara pembayaran:</p>

    {/* Existing: Kirim via WhatsApp */}
    <Button onClick={handleWhatsAppSend} className="w-full" variant="outline">
      Kirim via WhatsApp
    </Button>

    {/* New: Bayar Online */}
    <Button onClick={() => setShowMidtrans(true)} className="w-full">
      <CreditCard className="mr-2 h-4 w-4" />
      Bayar Online (Transfer/E-Wallet/QRIS)
    </Button>
  </div>
)}

{/* Midtrans Payment Dialog */}
{orderCreated && (
  <MidtransPaymentDialog
    open={showMidtrans}
    onOpenChange={setShowMidtrans}
    slug={slug}
    orderId={orderCreated.orderId}
    orderTotal={orderCreated.total}
    customerName={formData.name}
    customerEmail={formData.email}
    customerPhone={formData.phone}
  />
)}
```

### Opsi B: Buat Checkout Step Terpisah (Recommended)

Jika ingin UX yang lebih clean, buat step-based checkout:

```
Step 1: Isi Data Customer (nama, phone, alamat)
Step 2: Pilih Metode Pembayaran
        - [Manual Transfer / COD] -> WhatsApp flow (existing)
        - [Bayar Online] -> Midtrans Snap
Step 3: Konfirmasi / Tracking
```

Ini bisa diimplementasikan dengan menambahkan state management di checkout dialog.

---

## STEP 7: Payment Status di Tracking Page

### File: `client/src/app/store/[slug]/track/[orderId]/page.tsx` (UPDATE)

Tracking page sudah ada. Tambahkan handling untuk query params `?payment=success|pending|error`:

```tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

// Di dalam component:
const searchParams = useSearchParams();
const paymentStatus = searchParams.get('payment');

useEffect(() => {
  if (paymentStatus === 'success') {
    toast.success('Pembayaran berhasil! Pesanan Anda sedang diproses.');
  } else if (paymentStatus === 'pending') {
    toast.info('Silakan selesaikan pembayaran Anda. Status akan diupdate otomatis.');
  } else if (paymentStatus === 'error') {
    toast.error('Pembayaran gagal. Anda bisa mencoba lagi.');
  }
}, [paymentStatus]);

// Tambahkan tombol "Bayar Ulang" jika payment masih pending:
{order.paymentStatus === 'PENDING' && order.paymentMethod === 'midtrans' && (
  <Button onClick={() => setShowMidtrans(true)}>
    Bayar Sekarang
  </Button>
)}
```

---

## STEP 8: Testing Frontend

### A. Jalankan Aplikasi

```bash
# Terminal 1: Backend
cd server && npm run start:dev

# Terminal 2: Frontend
cd client && pnpm dev
```

### B. Test Flow Lengkap

1. Buka store: `http://localhost:3000/store/{slug}`
2. Tambah produk ke cart
3. Buka checkout dialog
4. Isi data customer
5. Klik "Bayar Online"
6. Snap popup muncul
7. Pilih payment method (Bank Transfer / GoPay / dll)
8. Bayar (sandbox mode)
9. Redirect ke tracking page
10. Status order berubah otomatis (via webhook)

### C. Test Cards (Sandbox)

```
Berhasil:   4811 1111 1111 1114 | CVV: 123 | Exp: 01/28
GoPay:      Klik Bayar -> Otomatis success di sandbox
QRIS:       Scan QR -> Otomatis success di sandbox
Bank Transfer: Generate VA -> Otomatis settle dalam 10 menit
```

---

## RINGKASAN FILE CHANGES

### File BARU:
```
client/src/types/midtrans-snap.d.ts              <- Type declarations
client/src/hooks/use-snap-payment.ts              <- Hook load & trigger Snap
client/src/lib/api/payment.ts                     <- Payment API service
client/src/components/store/midtrans-payment-dialog.tsx <- Payment dialog
```

### File UPDATE:
```
client/.env.local                                          <- Tambah NEXT_PUBLIC_MIDTRANS_*
client/src/components/store/whatsapp-checkout-dialog.tsx    <- Tambah pilihan "Bayar Online"
client/src/app/store/[slug]/track/[orderId]/page.tsx        <- Handle payment query params
```

### Package:
```
Tidak ada package tambahan (Snap.js di-load via CDN)
```

---

## FLOW DIAGRAM: CUSTOMER JOURNEY

```
┌─────────────────────────────────────────────┐
│ Customer browsing store                      │
│ /store/{slug}                                │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│ Add to Cart                                  │
│ (Zustand cart-store, localStorage)           │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│ Checkout Dialog                              │
│ - Isi: Nama, Phone, Alamat, Email           │
│ - Pilih Kurir (jika ada)                    │
│ - POST /api/store/{slug}/checkout           │
│ -> Order created (PENDING)                  │
└──────────────┬──────────────────────────────┘
               │
        ┌──────┴──────┐
        │             │
        ▼             ▼
┌──────────────┐ ┌──────────────────────────┐
│ WhatsApp     │ │ Bayar Online              │
│ (existing)   │ │ POST /api/store/{slug}/pay│
│ -> WA msg    │ │ -> snapToken              │
│ -> tracking  │ │ -> Snap popup             │
└──────────────┘ └────────────┬─────────────┘
                              │
                      ┌───────┴───────┐
                      │               │
                      ▼               ▼
               ┌────────────┐  ┌────────────┐
               │ Bayar di   │  │ Close popup│
               │ Snap UI    │  │ (cancel)   │
               └─────┬──────┘  └─────┬──────┘
                     │               │
                     ▼               ▼
               ┌────────────┐  ┌────────────────┐
               │ Webhook    │  │ Tracking page   │
               │ update     │  │ + "Bayar Ulang" │
               │ status     │  │ button          │
               └─────┬──────┘  └────────────────┘
                     │
                     ▼
               ┌────────────────────────────┐
               │ Tracking Page               │
               │ /store/{slug}/track/{id}    │
               │ Status: PAID               │
               │ + WA notification (auto)    │
               └────────────────────────────┘
```

---

## INTEGRASI DENGAN EXISTING FEATURES

### 1. Auto-Reply WhatsApp (Existing)
Saat webhook update Order.paymentStatus -> PAID:
- Auto-reply rule `PAYMENT_STATUS` = `PAID` otomatis trigger
- Customer dapat WhatsApp notification: "Pembayaran Anda untuk order ORD-xxx berhasil!"
- **Tidak perlu code tambahan** - sudah terintegrasi via `OrdersService.updatePaymentStatus()`

### 2. Order Tracking (Existing)
- Customer redirect ke `/store/{slug}/track/{orderId}` setelah bayar
- Status otomatis update karena webhook
- **Tidak perlu code tambahan** - tracking page sudah bisa show payment status

### 3. Dashboard Owner (Existing)
- Order muncul di dashboard owner
- Owner bisa lihat `paymentStatus: PAID`
- Stats dashboard otomatis update (revenue, dll)
- **Tidak perlu code tambahan** - existing dashboard sudah show order data

### 4. Cart System (Existing)
- Cart di-clear setelah payment success/pending
- **Tidak perlu modifikasi** cart-store.ts

---

## CATATAN PENTING

### Client Key Security
```
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY -> OK, ini memang untuk frontend
MIDTRANS_SERVER_KEY -> HANYA di backend .env, JANGAN PERNAH di frontend
```

### Snap.js Loading
- Snap.js di-load via CDN, bukan npm package
- Hook `useSnapPayment` handle loading secara lazy
- Script hanya di-load 1x meskipun multiple component pakai hook

### Error Handling
- Jika Snap popup gagal load -> tampilkan pesan error
- Jika create payment gagal -> tampilkan toast error
- Jika customer close popup tanpa bayar -> bisa bayar ulang dari tracking page
- Jika webhook tidak datang -> customer bisa check status manual

### Mobile Support
- Midtrans Snap popup responsive
- GoPay deeplink otomatis ke app di mobile
- ShopeePay deeplink otomatis ke app di mobile
- QRIS bisa di-scan dari device lain
