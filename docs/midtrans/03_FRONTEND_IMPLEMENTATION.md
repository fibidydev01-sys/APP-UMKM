# Midtrans Frontend Implementation - Step by Step

## Konteks: UMKM Upgrade Plan via Dashboard

> UMKM login ke dashboard -> buka halaman "Langganan" -> klik "Upgrade ke Business" -> Snap popup -> bayar -> plan aktif.
> Diadaptasi ke: Next.js App Router, Zustand, custom ApiClient (fetch), Radix UI, Sonner toast.

---

## STEP 1: Tambah Environment Variable

### File: `client/.env.local`

```env
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxxx
NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=false
```

Hanya `CLIENT_KEY`. Server key tetap hanya di backend.

---

## STEP 2: Buat Snap.js Type Declaration

### File: `client/src/types/midtrans-snap.d.ts` (BARU)

```typescript
/**
 * Midtrans Snap.js type declarations
 * Snap.js di-load via CDN, bukan npm package
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

## STEP 3: Buat Subscription API Service

### File: `client/src/lib/api/subscription.ts` (BARU)

Mengikuti pattern existing (`lib/api/orders.ts`, `lib/api/products.ts`):

```typescript
import { api } from './client';

// ==========================================
// TYPES
// ==========================================

export interface PlanLimits {
  maxProducts: number;
  maxCustomers: number;
  customDomain: boolean;
  removeBranding: boolean;
  advancedReports: boolean;
  exportData: boolean;
  customReceipt: boolean;
  prioritySupport: boolean;
}

export interface SubscriptionInfo {
  subscription: {
    id: string;
    tenantId: string;
    plan: 'STARTER' | 'BUSINESS';
    status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PAST_DUE';
    currentPeriodStart: string | null;
    currentPeriodEnd: string | null;
    priceAmount: number;
    currency: string;
  };
  limits: PlanLimits;
  usage: {
    products: number;
    customers: number;
  };
  isAtLimit: {
    products: boolean;
    customers: boolean;
  };
}

export interface CreatePaymentResponse {
  token: string;
  redirect_url: string;
  payment_id: string;
  order_id: string;
}

export interface PaymentHistory {
  id: string;
  midtransOrderId: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  paymentType: string | null;
  periodStart: string;
  periodEnd: string;
  paidAt: string | null;
  createdAt: string;
}

// ==========================================
// API
// ==========================================

export const subscriptionApi = {
  /**
   * Get plan info + usage
   * GET /api/subscription/me
   */
  getMyPlan: () =>
    api.get<SubscriptionInfo>('/subscription/me'),

  /**
   * Get payment history
   * GET /api/subscription/payments
   */
  getPaymentHistory: () =>
    api.get<PaymentHistory[]>('/subscription/payments'),

  /**
   * Create payment for upgrade (trigger Midtrans Snap)
   * POST /api/payment/subscribe
   */
  createUpgradePayment: () =>
    api.post<CreatePaymentResponse>('/payment/subscribe'),

  /**
   * Get Midtrans client key
   * GET /api/payment/client-key
   */
  getClientKey: () =>
    api.get<{ clientKey: string }>('/payment/client-key'),
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

/**
 * Hook untuk load Midtrans Snap.js dan trigger payment popup
 *
 * ```tsx
 * const { isLoaded, pay } = useSnapPayment({ clientKey: '...' });
 * pay(token, { onSuccess, onPending, onError, onClose });
 * ```
 */
export function useSnapPayment({ clientKey, isProduction = false }: UseSnapPaymentOptions) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Sudah loaded
    if (window.snap) {
      setIsLoaded(true);
      return;
    }

    // Script sudah ada di DOM tapi belum loaded
    const existingScript = document.querySelector('script[src*="snap.js"]') as HTMLScriptElement;
    if (existingScript) {
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
  }, [clientKey, isProduction]);

  const pay = useCallback(
    (snapToken: string, options?: SnapOptions) => {
      if (!isLoaded || !window.snap) {
        console.error('Snap.js belum siap');
        return;
      }
      window.snap.pay(snapToken, {
        onSuccess: (result) => options?.onSuccess?.(result),
        onPending: (result) => options?.onPending?.(result),
        onError: (result) => options?.onError?.(result),
        onClose: () => options?.onClose?.(),
      });
    },
    [isLoaded],
  );

  return { isLoaded, isLoading, error, pay };
}
```

---

## STEP 5: Buat Halaman Subscription di Dashboard

### File: `client/src/app/(dashboard)/dashboard/subscription/page.tsx` (BARU)

Halaman utama dimana UMKM lihat plan, upgrade, dan riwayat pembayaran.

```tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  Rocket,
  Crown,
  CreditCard,
  Check,
  X,
  Loader2,
  ShieldCheck,
  Calendar,
  Receipt,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import { subscriptionApi, SubscriptionInfo, PaymentHistory } from '@/lib/api/subscription';
import { useSnapPayment } from '@/hooks/use-snap-payment';

export default function SubscriptionPage() {
  const searchParams = useSearchParams();
  const [planInfo, setPlanInfo] = useState<SubscriptionInfo | null>(null);
  const [payments, setPayments] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '';
  const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true';
  const { isLoaded, pay } = useSnapPayment({ clientKey, isProduction });

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plan, history] = await Promise.all([
          subscriptionApi.getMyPlan(),
          subscriptionApi.getPaymentHistory(),
        ]);
        setPlanInfo(plan);
        setPayments(history);
      } catch (error) {
        console.error('Failed to fetch subscription info:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle redirect dari Midtrans
  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    if (paymentStatus === 'finish') {
      toast.success('Pembayaran berhasil! Plan Business aktif.');
      // Refetch plan info
      subscriptionApi.getMyPlan().then(setPlanInfo);
    } else if (paymentStatus === 'unfinish') {
      toast.info('Pembayaran belum selesai. Anda bisa melanjutkan kapan saja.');
    } else if (paymentStatus === 'error') {
      toast.error('Pembayaran gagal. Silakan coba lagi.');
    }
  }, [searchParams]);

  // Handle upgrade
  const handleUpgrade = async () => {
    if (!isLoaded) {
      toast.error('Sistem pembayaran sedang dimuat...');
      return;
    }

    setUpgrading(true);
    try {
      const response = await subscriptionApi.createUpgradePayment();

      pay(response.token, {
        onSuccess: () => {
          toast.success('Pembayaran berhasil! Plan Business aktif.');
          subscriptionApi.getMyPlan().then(setPlanInfo);
          subscriptionApi.getPaymentHistory().then(setPayments);
          setUpgrading(false);
        },
        onPending: () => {
          toast.info('Silakan selesaikan pembayaran Anda.');
          setUpgrading(false);
        },
        onError: () => {
          toast.error('Pembayaran gagal.');
          setUpgrading(false);
        },
        onClose: () => {
          setUpgrading(false);
        },
      });
    } catch (error: any) {
      toast.error(error.message || 'Gagal memproses pembayaran');
      setUpgrading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const isStarter = planInfo?.subscription.plan === 'STARTER';
  const isBusiness = planInfo?.subscription.plan === 'BUSINESS';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Langganan</h1>
        <p className="text-muted-foreground">Kelola plan dan pembayaran Anda</p>
      </div>

      {/* Current Plan Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isStarter ? (
                <Rocket className="h-6 w-6 text-muted-foreground" />
              ) : (
                <Crown className="h-6 w-6 text-primary" />
              )}
              <div>
                <CardTitle>Plan {planInfo?.subscription.plan}</CardTitle>
                <CardDescription>
                  {isStarter ? 'Gratis selamanya' : `Rp ${planInfo?.subscription.priceAmount.toLocaleString('id-ID')}/bulan`}
                </CardDescription>
              </div>
            </div>
            <Badge variant={isBusiness ? 'default' : 'secondary'}>
              {planInfo?.subscription.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Usage Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-3">
              <p className="text-sm text-muted-foreground">Produk</p>
              <p className="text-lg font-bold">
                {planInfo?.usage.products}
                <span className="text-sm font-normal text-muted-foreground">
                  {' / '}
                  {planInfo?.limits.maxProducts === Infinity ? 'Unlimited' : planInfo?.limits.maxProducts}
                </span>
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-sm text-muted-foreground">Pelanggan</p>
              <p className="text-lg font-bold">
                {planInfo?.usage.customers}
                <span className="text-sm font-normal text-muted-foreground">
                  {' / '}
                  {planInfo?.limits.maxCustomers === Infinity ? 'Unlimited' : planInfo?.limits.maxCustomers}
                </span>
              </p>
            </div>
          </div>

          {/* Business Period */}
          {isBusiness && planInfo?.subscription.currentPeriodEnd && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Aktif sampai: {new Date(planInfo.subscription.currentPeriodEnd).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
          )}

          {/* Upgrade Button */}
          {isStarter && (
            <Button onClick={handleUpgrade} disabled={upgrading} className="w-full" size="lg">
              {upgrading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Crown className="mr-2 h-4 w-4" />
              Upgrade ke Business - Rp 149.000/bulan
            </Button>
          )}

          {/* Renew Button (kalau expired) */}
          {isBusiness && planInfo?.subscription.status === 'EXPIRED' && (
            <Button onClick={handleUpgrade} disabled={upgrading} className="w-full" size="lg">
              {upgrading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Perpanjang Business Plan
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Plan Comparison */}
      {isStarter && (
        <Card>
          <CardHeader>
            <CardTitle>Kenapa Upgrade?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
              {[
                { feature: 'Produk/Layanan', starter: 'Max 50', business: 'Unlimited' },
                { feature: 'Pelanggan/Klien', starter: 'Max 200', business: 'Unlimited' },
                { feature: 'Custom Domain', starter: false, business: true },
                { feature: 'Hapus Branding Fibidy', starter: false, business: true },
                { feature: 'Laporan Lengkap', starter: false, business: true },
                { feature: 'Export Data', starter: false, business: true },
                { feature: 'Struk Custom + Logo', starter: false, business: true },
                { feature: 'Support Prioritas', starter: false, business: true },
              ].map((row) => (
                <div key={row.feature} className="contents">
                  <div className="py-2 border-b flex items-center gap-2">
                    {typeof row.starter === 'boolean' ? (
                      row.starter ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-400" />
                    ) : (
                      <span className="text-muted-foreground">{row.starter}</span>
                    )}
                    <span>{row.feature}</span>
                  </div>
                  <div className="py-2 border-b flex items-center gap-2 font-medium">
                    {typeof row.business === 'boolean' ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <span className="text-primary">{row.business}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Methods Info */}
      {isStarter && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
          <ShieldCheck className="h-4 w-4 text-green-500" />
          <span>Bank Transfer, GoPay, ShopeePay, QRIS, Kartu Kredit - diproses aman oleh Midtrans</span>
        </div>
      )}

      {/* Payment History */}
      {payments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Riwayat Pembayaran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div>
                    <p className="text-sm font-medium">
                      Business Plan - {new Date(payment.periodStart).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(payment.createdAt).toLocaleDateString('id-ID')}
                      {payment.paymentType && ` - ${payment.paymentType}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      Rp {payment.amount.toLocaleString('id-ID')}
                    </p>
                    <Badge variant={payment.paymentStatus === 'settlement' ? 'default' : 'secondary'} className="text-xs">
                      {payment.paymentStatus === 'settlement' ? 'Lunas' : payment.paymentStatus}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

---

## STEP 6: Tambah Menu Subscription di Dashboard Sidebar

### Lokasi: Component sidebar/navigation dashboard

Tambahkan menu item baru:

```tsx
{
  label: 'Langganan',
  href: '/dashboard/subscription',
  icon: CreditCard, // dari lucide-react
}
```

Letakkan di area settings/account section di sidebar.

---

## STEP 7: Update Pricing Section di Landing Page

### File: `client-web/src/components/platform-landing/pricing-section.tsx` (UPDATE)

Ubah Business plan dari "Coming Soon" menjadi aktif:

```typescript
// Ubah data plan Business:
{
  name: 'Business',
  // ...
  comingSoon: false,           // Ubah dari true
  badge: 'Populer',            // Ubah dari 'Segera Hadir'
  cta: 'Upgrade Sekarang',     // Ubah dari 'Daftar Waiting List'
  href: '/register',           // atau '/dashboard/subscription' kalau sudah login
}
```

---

## STEP 8: Handle Limit di Frontend

Ketika UMKM Starter mencoba create produk ke-51, backend return 403. Frontend perlu handle ini.

### Di page/component create product:

```tsx
try {
  await productsApi.create(data);
  toast.success('Produk berhasil ditambahkan');
} catch (error) {
  if (error.statusCode === 403) {
    // Limit tercapai - tampilkan upgrade prompt
    toast.error(error.message, {
      action: {
        label: 'Upgrade',
        onClick: () => router.push('/dashboard/subscription'),
      },
    });
  } else {
    toast.error(error.message);
  }
}
```

Sama untuk create customer.

---

## FILE CHANGES SUMMARY

### BARU:
```
client/src/types/midtrans-snap.d.ts                          <- Type declarations
client/src/hooks/use-snap-payment.ts                          <- Hook Snap.js
client/src/lib/api/subscription.ts                            <- Subscription API
client/src/app/(dashboard)/dashboard/subscription/page.tsx    <- Halaman subscription
```

### UPDATE:
```
client/.env.local                                              <- NEXT_PUBLIC_MIDTRANS_*
client-web/src/components/platform-landing/pricing-section.tsx <- Business plan aktif
Dashboard sidebar component                                    <- Tambah menu "Langganan"
Product create form/page                                       <- Handle 403 limit error
Customer create form/page                                      <- Handle 403 limit error
```

### PACKAGE:
```
Tidak ada (Snap.js via CDN)
```

---

## FLOW DIAGRAM: UMKM UPGRADE

```
┌──────────────────────────────────────┐
│ UMKM login ke Dashboard              │
│ Plan: STARTER (Free)                  │
│ Produk: 45/50 | Customer: 180/200    │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│ Sidebar: klik "Langganan"             │
│ /dashboard/subscription               │
│                                       │
│ Lihat info plan, usage, perbandingan  │
│ Klik: "Upgrade ke Business"           │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│ Frontend:                             │
│ POST /api/payment/subscribe           │
│ -> Backend buat SubscriptionPayment   │
│ -> Midtrans return snapToken          │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│ Snap Popup muncul                     │
│ "Fibidy Business Plan (30 hari)"      │
│ Rp 149.000                            │
│                                       │
│ Pilih: Bank Transfer / GoPay / QRIS   │
└──────────────┬───────────────────────┘
               │
        ┌──────┴──────┐
        │             │
        ▼             ▼
  ┌──────────┐  ┌──────────────┐
  │ Bayar    │  │ Tutup popup  │
  │ sukses   │  │ -> bisa nanti│
  └────┬─────┘  └──────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ Webhook ke backend                    │
│ -> SubscriptionPayment status = PAID  │
│ -> Subscription plan = BUSINESS       │
│ -> Subscription aktif 30 hari         │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│ Dashboard refresh:                    │
│ Plan: BUSINESS (Active)               │
│ Produk: 45/Unlimited                  │
│ Customer: 180/Unlimited               │
│ Aktif sampai: 10 Maret 2026           │
│                                       │
│ Fitur unlocked:                       │
│ - Custom domain                       │
│ - Hapus branding Fibidy               │
│ - Laporan lengkap                     │
│ - Export data                         │
│ - Struk custom + logo                 │
│ - Support prioritas                   │
└──────────────────────────────────────┘
```

---

## INTEGRASI DENGAN EXISTING FEATURES

| Feature Existing | Dampak Subscription | Perlu Modifikasi? |
|---|---|---|
| Product CRUD | Limit 50 (Starter) / Unlimited (Business) | Ya - handle 403 di frontend |
| Customer CRUD | Limit 200 / Unlimited | Ya - handle 403 di frontend |
| WhatsApp Chat | Semua plan | Tidak |
| Auto-Reply | Semua plan | Tidak |
| Order Management | Semua plan | Tidak |
| Landing Builder | Semua plan | Tidak |
| Explore Feed | Semua plan | Tidak |
| SEO Settings | Semua plan | Tidak |
| Custom Domain | Business only | Ya - cek plan di settings |
| Remove Branding | Business only | Ya - conditional render |
| Export Data | Business only | Ya - cek plan di endpoint |
| Advanced Reports | Business only | Ya - conditional di stats page |

---

## CATATAN PENTING

### Snap.js Loading
- Di-load via CDN saat masuk halaman subscription
- Hook `useSnapPayment` handle lazy loading
- Script di-load 1x, reuse di semua component

### Expired Handling
- Kalau Business expired, UMKM kembali ke limit Starter
- Tapi data yang sudah dibuat TIDAK dihapus
- UMKM hanya tidak bisa create produk/customer baru melebihi limit
- UMKM bisa perpanjang kapan saja

### Grace Period (Optional, future)
- Bisa tambah status `PAST_DUE` dengan grace period 3-7 hari
- Selama grace period, fitur masih aktif tapi ada warning banner

### Mobile
- Snap popup responsive di mobile
- GoPay/ShopeePay deeplink otomatis ke app
- QRIS bisa scan dari device lain
