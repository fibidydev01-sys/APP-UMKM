'use client';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SettingsSidebar } from './settings-sidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

// ==========================================
// SETTINGS LAYOUT COMPONENT
// Clone of DashboardLayout for Settings
// - Sidebar (Desktop & Mobile)
// - Simple Header with Trigger
// ==========================================

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <SidebarProvider>
      {/* Settings Sidebar */}
      <SettingsSidebar />

      <SidebarInset>
        {/* Simple Header with Sidebar Trigger */}
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">Pengaturan</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
