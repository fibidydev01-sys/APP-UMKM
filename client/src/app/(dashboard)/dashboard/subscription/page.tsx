'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  Rocket,
  Crown,
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

import {
  subscriptionApi,
  type SubscriptionInfo,
  type PaymentHistory,
} from '@/lib/api/subscription';
import { useSnapPayment } from '@/hooks/use-snap-payment';

const PLAN_FEATURES = [
  { feature: 'Produk/Layanan', starter: 'Max 50', business: 'Unlimited' },
  { feature: 'Pelanggan/Klien', starter: 'Max 200', business: 'Unlimited' },
  { feature: 'Landing Page', starter: 'Subdomain gratis', business: 'Subdomain gratis' },
  { feature: 'Component Blocks', starter: '10 variants', business: '50+ variants + update' },
  { feature: 'Order Management', starter: 'Basic', business: 'Advanced' },
  { feature: 'WhatsApp Integration', starter: 'Connect', business: 'Connect + Auto-reply' },
] as const;

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
      subscriptionApi.getMyPlan().then(setPlanInfo);
      subscriptionApi.getPaymentHistory().then(setPayments);
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
  const isExpired = isBusiness && planInfo?.subscription.status === 'EXPIRED';

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
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
                  {isStarter
                    ? 'Gratis selamanya'
                    : `Rp ${planInfo?.subscription.priceAmount.toLocaleString('id-ID')}/bulan`}
                </CardDescription>
              </div>
            </div>
            <Badge variant={isBusiness && !isExpired ? 'default' : 'secondary'}>
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
                  {planInfo?.limits.maxProducts === Infinity
                    ? 'Unlimited'
                    : planInfo?.limits.maxProducts}
                </span>
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-sm text-muted-foreground">Pelanggan</p>
              <p className="text-lg font-bold">
                {planInfo?.usage.customers}
                <span className="text-sm font-normal text-muted-foreground">
                  {' / '}
                  {planInfo?.limits.maxCustomers === Infinity
                    ? 'Unlimited'
                    : planInfo?.limits.maxCustomers}
                </span>
              </p>
            </div>
          </div>

          {/* Business Period */}
          {isBusiness && planInfo?.subscription.currentPeriodEnd && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Aktif sampai:{' '}
                {new Date(planInfo.subscription.currentPeriodEnd).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          )}

          {/* Upgrade Button */}
          {isStarter && (
            <Button onClick={handleUpgrade} disabled={upgrading} className="w-full" size="lg">
              {upgrading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Crown className="mr-2 h-4 w-4" />
              Upgrade ke Business - Rp 100.000/bulan
            </Button>
          )}

          {/* Renew Button (kalau expired) */}
          {isExpired && (
            <Button onClick={handleUpgrade} disabled={upgrading} className="w-full" size="lg">
              {upgrading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Perpanjang Business Plan
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Plan Comparison */}
      {(isStarter || isExpired) && (
        <Card>
          <CardHeader>
            <CardTitle>Kenapa Upgrade?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {/* Header */}
              <div className="grid grid-cols-3 gap-4 pb-3 border-b font-medium text-sm">
                <span>Fitur</span>
                <span className="text-center text-muted-foreground">Starter</span>
                <span className="text-center text-primary">Business</span>
              </div>

              {PLAN_FEATURES.map((row) => (
                <div
                  key={row.feature}
                  className="grid grid-cols-3 gap-4 py-3 border-b last:border-0 text-sm"
                >
                  <span>{row.feature}</span>
                  <div className="flex justify-center">
                    {typeof row.starter === 'boolean' ? (
                      row.starter ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-400" />
                      )
                    ) : (
                      <span className="text-muted-foreground">{row.starter}</span>
                    )}
                  </div>
                  <div className="flex justify-center">
                    {typeof row.business === 'boolean' ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <span className="font-medium text-primary">{row.business}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Methods Info */}
      {(isStarter || isExpired) && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
          <ShieldCheck className="h-4 w-4 text-green-500" />
          <span>
            Bank Transfer, GoPay, ShopeePay, QRIS, Kartu Kredit - diproses aman oleh Midtrans
          </span>
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
                <div
                  key={payment.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">
                      Business Plan -{' '}
                      {new Date(payment.periodStart).toLocaleDateString('id-ID', {
                        month: 'short',
                        year: 'numeric',
                      })}
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
                    <Badge
                      variant={payment.paymentStatus === 'settlement' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
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
