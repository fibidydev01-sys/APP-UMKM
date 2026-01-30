'use client';

import { useRouter } from 'next/navigation';
import { MessageSquare, Key, ShoppingCart, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// ══════════════════════════════════════════════════════════════
// AUTO-REPLY CLIENT - Overview Content (NO TABS - layout provides them)
// Pattern: page.tsx (server/metadata) + client.tsx (client/UI)
// Tabs are in layout.tsx (shared across all auto-reply pages)
// ══════════════════════════════════════════════════════════════

const CARDS = [
  {
    id: 'welcome',
    label: 'Welcome',
    icon: MessageSquare,
    href: '/dashboard/auto-reply/welcome',
    description: 'Pesan sambutan otomatis untuk customer baru',
  },
  {
    id: 'keywords',
    label: 'Keywords',
    icon: Key,
    href: '/dashboard/auto-reply/keywords',
    description: 'Auto-reply berdasarkan kata kunci tertentu',
  },
  {
    id: 'order-status',
    label: 'Order Status',
    icon: ShoppingCart,
    href: '/dashboard/auto-reply/order-status',
    description: 'Notifikasi otomatis saat status order berubah',
  },
  {
    id: 'payment',
    label: 'Payment',
    icon: DollarSign,
    href: '/dashboard/auto-reply/payment',
    description: 'Notifikasi otomatis saat status pembayaran berubah',
  },
];

export function AutoReplyClient() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* ════════════════════════════════════════════════════════ */}
      {/* HEADER                                                  */}
      {/* ════════════════════════════════════════════════════════ */}
      <div>
        <h1 className="text-2xl font-bold mb-2">Auto-Reply System</h1>
        <p className="text-muted-foreground">
          Kirim pesan WhatsApp otomatis berdasarkan berbagai trigger. Pilih jenis auto-reply di
          bawah untuk mulai.
        </p>
      </div>

      {/* ════════════════════════════════════════════════════════ */}
      {/* OVERVIEW CARDS                                          */}
      {/* ════════════════════════════════════════════════════════ */}
      <div className="grid gap-4 md:grid-cols-2">
        {CARDS.map((card) => (
          <Card
            key={card.id}
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => router.push(card.href)}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <card.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{card.label}</h3>
                  <p className="text-sm text-muted-foreground">{card.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════ */}
      {/* INFO BOX                                                */}
      {/* ════════════════════════════════════════════════════════ */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Cara Kerja Auto-Reply
          </h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong>Welcome:</strong> Dikirim saat customer kontak pertama kali
            </p>
            <p>
              <strong>Keywords:</strong> Dikirim saat customer mengirim kata kunci tertentu
            </p>
            <p>
              <strong>Order Status:</strong> Dikirim otomatis saat status order berubah
            </p>
            <p>
              <strong>Payment:</strong> Dikirim otomatis saat status pembayaran berubah
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
