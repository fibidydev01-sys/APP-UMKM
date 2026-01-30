'use client';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SettingsNav } from './settings-nav';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

// ==========================================
// SETTINGS LAYOUT COMPONENT
// Wraps all /settings routes with sidebar
// Pattern: Same as DashboardLayout
// ==========================================

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export interface SettingsMenuItem {
  key: string;
  label: string;
}

export const SETTINGS_MENU: SettingsMenuItem[] = [
  { key: 'store', label: 'Toko' },
  { key: 'seo', label: 'SEO' },
  { key: 'payment', label: 'Pembayaran' },
  { key: 'shipping', label: 'Pengiriman' },
];

// ==========================================
// MOBILE TRIGGER COMPONENT
// ==========================================

function SettingsMobileTrigger() {
  const { setOpenMobile, openMobile } = useSidebar();

  return (
    <div className="md:hidden mb-4">
      <Button
        variant="outline"
        className="w-full justify-between"
        onClick={() => setOpenMobile(!openMobile)}
      >
        <span>Menu Pengaturan</span>
        <span>&#9776;</span>
      </Button>
    </div>
  );
}

// ==========================================
// SETTINGS SIDEBAR COMPONENT
// ==========================================

function SettingsSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const handleTabClick = (key: string) => {
    // All tabs now navigate to separate routes (like dashboard pattern)
    const routeMap: Record<string, string> = {
      store: '/settings/toko',
      seo: '/settings/seo',
      payment: '/settings/pembayaran',
      shipping: '/settings/pengiriman',
    };

    const route = routeMap[key] || '/settings/pembayaran'; // Default to pembayaran
    router.push(route);
    setOpenMobile(false);
  };

  // Determine active tab based on pathname
  const getActiveTab = () => {
    if (pathname.startsWith('/settings/toko')) return 'store';
    if (pathname.startsWith('/settings/seo')) return 'seo';
    if (pathname.startsWith('/settings/pembayaran')) return 'payment';
    if (pathname.startsWith('/settings/pengiriman')) return 'shipping';
    // Default fallback
    return 'payment';
  };

  const activeTab = getActiveTab();

  return (
    <Sidebar className="border-r min-h-screen">
      <SidebarHeader className="border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard')}
            className="h-8 w-8 p-0"
          >
            &larr;
          </Button>
          <div>
            <h2 className="font-semibold text-lg">Pengaturan</h2>
            <p className="text-sm text-muted-foreground">Kelola preferensi toko</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SETTINGS_MENU.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    isActive={activeTab === item.key}
                    onClick={() => handleTabClick(item.key)}
                    className={cn(
                      'w-full justify-start',
                      activeTab === item.key && 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
                    )}
                  >
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

// ==========================================
// MAIN LAYOUT COMPONENT
// ==========================================

export function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      {/* Desktop Sidebar - Always visible for all /settings routes */}
      <SettingsSidebar />

      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <div className="flex-1 p-4 md:p-6 lg:p-8">
            {/* Mobile Trigger */}
            <SettingsMobileTrigger />

            {/* Content */}
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
