'use client';

import { useState } from 'react';
import { MessageSquare, Key, ShoppingCart, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

// Import tab content from sub-pages
import WelcomePage from './welcome/page';
import KeywordsPage from './keywords/page';
import OrderStatusPage from './order-status/page';
import PaymentPage from './payment/page';

// ══════════════════════════════════════════════════════════════
// AUTO-REPLY CLIENT - INSTANT TABS (SAME as Dashboard)
// URL TIDAK BERUBAH - content switch dalam 1 halaman
// Default: Welcome tab
// ══════════════════════════════════════════════════════════════

type TabType = 'welcome' | 'keywords' | 'order-status' | 'payment';

const TABS = [
  { id: 'welcome' as const, label: 'Welcome', icon: MessageSquare },
  { id: 'keywords' as const, label: 'Keywords', icon: Key },
  { id: 'order-status' as const, label: 'Order Status', icon: ShoppingCart },
  { id: 'payment' as const, label: 'Payment', icon: DollarSign },
];

export function AutoReplyClient() {
  // Default ke 'welcome' - langsung tampil saat buka /auto-reply
  const [activeTab, setActiveTab] = useState<TabType>('welcome');

  return (
    <div>
      {/* ════════════════════════════════════════════════════════ */}
      {/* STICKY TABS - INSTANT switch (no navigation)            */}
      {/* ════════════════════════════════════════════════════════ */}
      <div className="sticky top-0 z-20 bg-background border-b -mx-4 md:-mx-6 lg:-mx-8 -mt-4 md:-mt-6 lg:-mt-8 mb-6">
        <div className="px-4 md:px-6 lg:px-8">
          <div className="flex">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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
      {/* TAB CONTENT - Render based on activeTab                 */}
      {/* ════════════════════════════════════════════════════════ */}
      <div className="mt-6">
        {activeTab === 'welcome' && <WelcomePage />}
        {activeTab === 'keywords' && <KeywordsPage />}
        {activeTab === 'order-status' && <OrderStatusPage />}
        {activeTab === 'payment' && <PaymentPage />}
      </div>
    </div>
  );
}
