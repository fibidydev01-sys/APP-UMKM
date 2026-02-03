'use client';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from './dashboard-sidebar';
import { DashboardShell } from './dashboard-shell';
import { MobileNavbar } from './mobile-navbar';

// ==========================================
// DASHBOARD LAYOUT COMPONENT
// - Sidebar (Desktop)
// - Mobile Bottom Navbar
// ==========================================

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      {/* Desktop Sidebar - Hidden on mobile */}
      <DashboardSidebar />

      <SidebarInset className="pb-20 md:pb-0">
        {/* Main Content */}
        <DashboardShell>
          {children}
        </DashboardShell>
      </SidebarInset>

      {/* Mobile Bottom Navbar - Only on mobile */}
      <MobileNavbar />
    </SidebarProvider>
  );
}