'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  MessageSquare,
  Key,
  Package,
  CreditCard
} from 'lucide-react';

// ==========================================
// AUTO-REPLY LAYOUT WITH TABS
// ==========================================

interface TabItem {
  label: string;
  href: string;
  icon: React.ElementType;
  description: string;
}

const tabs: TabItem[] = [
  {
    label: 'Welcome',
    href: '/dashboard/auto-reply/welcome',
    icon: MessageSquare,
    description: 'First contact message',
  },
  {
    label: 'Keywords',
    href: '/dashboard/auto-reply/keywords',
    icon: Key,
    description: 'Keyword-based replies',
  },
  {
    label: 'Order Status',
    href: '/dashboard/auto-reply/order-status',
    icon: Package,
    description: 'Order status notifications',
  },
  {
    label: 'Payment',
    href: '/dashboard/auto-reply/payment',
    icon: CreditCard,
    description: 'Payment status notifications',
  },
];

export default function AutoReplyLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          Auto-Reply Rules
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Kelola balasan otomatis untuk berbagai trigger events
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 mb-8">
        <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'group inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap',
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-300'
                )}
                aria-current={isActive ? 'page' : undefined}
                title={tab.description}
              >
                <Icon
                  className={cn(
                    'mr-2 h-5 w-5',
                    isActive
                      ? 'text-primary'
                      : 'text-zinc-400 group-hover:text-zinc-500 dark:text-zinc-500 dark:group-hover:text-zinc-400'
                  )}
                  aria-hidden="true"
                />
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Page Content */}
      {children}
    </div>
  );
}
