'use client';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SettingsSidebar } from './settings-sidebar';
import { SettingsMobileNavbar } from './settings-mobile-navbar';

// ==========================================
// SETTINGS LAYOUT COMPONENT
// Clone of DashboardLayout for Settings
// - Sidebar (Desktop)
// - Mobile Bottom Navbar
// - NO Header
// ==========================================

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <SidebarProvider>
      {/* Desktop Sidebar - Hidden on mobile */}
      <SettingsSidebar />

      <SidebarInset className="pb-20 md:pb-0">
        {/* Main Content */}
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          {children}
        </main>
      </SidebarInset>

      {/* Mobile Bottom Navbar - Only on mobile */}
      <SettingsMobileNavbar />
    </SidebarProvider>
  );
}
