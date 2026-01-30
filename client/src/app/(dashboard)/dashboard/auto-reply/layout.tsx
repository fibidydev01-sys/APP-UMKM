'use client';

import { type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { MessageSquare, Key, ShoppingCart, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

// ══════════════════════════════════════════════════════════════
// AUTO-REPLY LAYOUT - Sticky Tabs (SAME as Dashboard)
// Wraps all auto-reply pages with consistent tabs navigation
// Tabs highlight based on current pathname
// ══════════════════════════════════════════════════════════════

type TabType = 'overview' | 'welcome' | 'keywords' | 'order-status' | 'payment';

const TABS: { id: TabType; label: string; icon: typeof MessageSquare; href: string }[] = [
  {
    id: 'welcome',
    label: 'Welcome',
    icon: MessageSquare,
    href: '/dashboard/auto-reply/welcome',
  },
  {
    id: 'keywords',
    label: 'Keywords',
    icon: Key,
    href: '/dashboard/auto-reply/keywords',
  },
  {
    id: 'order-status',
    label: 'Order Status',
    icon: ShoppingCart,
    href: '/dashboard/auto-reply/order-status',
  },
  {
    id: 'payment',
    label: 'Payment',
    icon: DollarSign,
    href: '/dashboard/auto-reply/payment',
  },
];

function getActiveTab(pathname: string): TabType {
  if (pathname.includes('/welcome')) return 'welcome';
  if (pathname.includes('/keywords')) return 'keywords';
  if (pathname.includes('/order-status')) return 'order-status';
  if (pathname.includes('/payment')) return 'payment';
  return 'overview';
}

export default function AutoReplyLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const activeTab = getActiveTab(pathname);

  return (
    <div>
      {/* ════════════════════════════════════════════════════════ */}
      {/* STICKY TABS - Same style as Dashboard                   */}
      {/* ════════════════════════════════════════════════════════ */}
      <div className="sticky top-0 z-20 bg-background border-b -mx-4 md:-mx-6 lg:-mx-8 -mt-4 md:-mt-6 lg:-mt-8 mb-6">
        <div className="px-4 md:px-6 lg:px-8">
          <div className="flex">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => router.push(tab.href)}
                className={cn(
                  'flex items-center justify-center gap-2 flex-1 sm:flex-none px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                  activeTab === tab.id
                    ? 'border-foreground text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
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
      {/* PAGE CONTENT                                            */}
      {/* ════════════════════════════════════════════════════════ */}
      {children}
    </div>
  );
}
