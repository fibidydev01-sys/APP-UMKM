'use client';

import { useRouter, usePathname } from 'next/navigation';
import { MessageSquare, Key, ShoppingCart, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// ══════════════════════════════════════════════════════════════
// AUTO-REPLY PAGE - Sticky Tabs Navigation (like Dashboard)
// Tabs navigate to individual routes
// ══════════════════════════════════════════════════════════════

const TABS = [
  {
    id: 'welcome' as const,
    label: 'Welcome',
    icon: MessageSquare,
    href: '/dashboard/auto-reply/welcome',
    description: 'Pesan sambutan otomatis untuk customer baru'
  },
  {
    id: 'keywords' as const,
    label: 'Keywords',
    icon: Key,
    href: '/dashboard/auto-reply/keywords',
    description: 'Auto-reply berdasarkan kata kunci tertentu'
  },
  {
    id: 'order-status' as const,
    label: 'Order Status',
    icon: ShoppingCart,
    href: '/dashboard/auto-reply/order-status',
    description: 'Notifikasi otomatis saat status order berubah'
  },
  {
    id: 'payment' as const,
    label: 'Payment',
    icon: DollarSign,
    href: '/dashboard/auto-reply/payment',
    description: 'Notifikasi otomatis saat status pembayaran berubah'
  },
];

export default function AutoReplyPage() {
  const router = useRouter();

  return (
    <div>
      {/* ════════════════════════════════════════════════════════ */}
      {/* STICKY TABS - Navigate to individual routes             */}
      {/* ════════════════════════════════════════════════════════ */}
      <div className="sticky top-0 z-20 bg-background border-b -mx-4 md:-mx-6 lg:-mx-8 -mt-4 md:-mt-6 lg:-mt-8 mb-6">
        <div className="px-4 md:px-6 lg:px-8">
          <div className="flex overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => router.push(tab.href)}
                className={cn(
                  'flex items-center justify-center gap-2 flex-1 sm:flex-none px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                  'border-transparent text-muted-foreground hover:text-foreground hover:border-foreground/50'
                )}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════ */}
      {/* CONTENT - Overview Cards                                */}
      {/* ════════════════════════════════════════════════════════ */}
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Auto-Reply System</h1>
          <p className="text-muted-foreground">
            Kirim pesan WhatsApp otomatis berdasarkan berbagai trigger. Pilih jenis auto-reply di bawah untuk mulai.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {TABS.map((tab) => (
            <Card
              key={tab.id}
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => router.push(tab.href)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <tab.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{tab.label}</h3>
                    <p className="text-sm text-muted-foreground">
                      {tab.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Box */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Cara Kerja Auto-Reply
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                ✅ <strong>Welcome:</strong> Dikirim saat customer kontak pertama kali
              </p>
              <p>
                ✅ <strong>Keywords:</strong> Dikirim saat customer mengirim kata kunci tertentu
              </p>
              <p>
                ✅ <strong>Order Status:</strong> Dikirim otomatis saat status order berubah
              </p>
              <p>
                ✅ <strong>Payment:</strong> Dikirim otomatis saat status pembayaran berubah
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
