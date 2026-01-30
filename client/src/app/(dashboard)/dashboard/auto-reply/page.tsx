'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MessageSquare, Key, ShoppingCart, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSampleOrder } from '@/hooks/use-orders';
import { WelcomeTab } from './components/tabs/welcome-tab';
import { KeywordsTab } from './components/tabs/keywords-tab';
import { OrderStatusTab } from './components/tabs/order-status-tab';
import { PaymentTab } from './components/tabs/payment-tab';

// ══════════════════════════════════════════════════════════════
// AUTO-REPLY PAGE - Sticky Tabs Pattern (like Dashboard)
// Tabs: Welcome, Keywords, Order Status, Payment
// Individual routes STILL accessible: /auto-reply/welcome, etc.
// ══════════════════════════════════════════════════════════════

type TabType = 'welcome' | 'keywords' | 'order-status' | 'payment';

const TABS = [
  { id: 'welcome' as const, label: 'Welcome', icon: MessageSquare },
  { id: 'keywords' as const, label: 'Keywords', icon: Key },
  { id: 'order-status' as const, label: 'Order Status', icon: ShoppingCart },
  { id: 'payment' as const, label: 'Payment', icon: DollarSign },
];

export default function AutoReplyPage() {
  const [activeTab, setActiveTab] = useState<TabType>('welcome');

  // ⚡ SINGLE FETCH - shared across ALL tabs!
  const { sampleData, isLoading: loadingSample } = useSampleOrder();

  return (
    <div>
      {/* ════════════════════════════════════════════════════════ */}
      {/* STICKY TABS - Welcome, Keywords, Order Status, Payment  */}
      {/* Sticks to top when scrolling, instant switching         */}
      {/* ════════════════════════════════════════════════════════ */}
      <div className="sticky top-0 z-20 bg-background border-b -mx-4 md:-mx-6 lg:-mx-8 -mt-4 md:-mt-6 lg:-mt-8">
        <div className="px-4 md:px-6 lg:px-8">
          <div className="flex overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center justify-center gap-2 flex-1 sm:flex-none px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
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
      {/* TAB CONTENT - Conditional Render (NO navigation!)       */}
      {/* All tabs share sampleData - fetched ONCE                */}
      {/* ════════════════════════════════════════════════════════ */}
      <div className="mt-6">
        {activeTab === 'welcome' && <WelcomeTab sampleData={sampleData} />}
        {activeTab === 'keywords' && <KeywordsTab sampleData={sampleData} />}
        {activeTab === 'order-status' && <OrderStatusTab sampleData={sampleData} />}
        {activeTab === 'payment' && <PaymentTab sampleData={sampleData} />}
      </div>

      {/* Info: Direct routes still accessible */}
      <div className="mt-8 p-4 bg-muted/20 rounded-lg border text-sm">
        <p className="font-medium mb-2 text-muted-foreground">
          💡 <strong>Pro Tip:</strong> Individual pages masih bisa diakses langsung:
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <Link href="/dashboard/auto-reply/welcome" className="hover:text-foreground hover:underline">
            → /auto-reply/welcome
          </Link>
          <Link href="/dashboard/auto-reply/keywords" className="hover:text-foreground hover:underline">
            → /auto-reply/keywords
          </Link>
          <Link href="/dashboard/auto-reply/order-status" className="hover:text-foreground hover:underline">
            → /auto-reply/order-status
          </Link>
          <Link href="/dashboard/auto-reply/payment" className="hover:text-foreground hover:underline">
            → /auto-reply/payment
          </Link>
        </div>
      </div>
    </div>
  );
}
