'use client';

import { useState } from 'react';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from './dashboard-sidebar';
import { DashboardShell } from './dashboard-shell';
import { MobileNavbar } from './mobile-navbar';

// ==========================================
// DASHBOARD LAYOUT COMPONENT
// - Sidebar (Desktop) — always starts expanded
// - Mobile Bottom Navbar
// ==========================================

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="flex h-screen w-full overflow-hidden">
        {/* Desktop Sidebar - Hidden on mobile */}
        <DashboardSidebar />

        <SidebarInset className="flex-1 overflow-hidden pb-20 md:pb-0">
          {/* Main Content */}
          <DashboardShell>
            {children}
          </DashboardShell>
        </SidebarInset>
      </div>

      {/* Mobile Bottom Navbar - Only on mobile */}
      <MobileNavbar />
    </SidebarProvider>
  );
}