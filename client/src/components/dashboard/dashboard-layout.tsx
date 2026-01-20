'use client';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from './dashboard-sidebar';
import { DashboardHeader } from './dashboard-header';
import { DashboardShell } from './dashboard-shell';
import { MobileNavbar } from './mobile-navbar';
import { OnboardingWizard } from '@/components/onboarding';

// ==========================================
// DASHBOARD LAYOUT COMPONENT
// - Sidebar (Desktop)
// - Sticky Header
// - Onboarding Wizard (Global, cross-page)
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
        {/* Sticky Header */}
        <DashboardHeader />

        {/* Onboarding Wizard - Global across all dashboard pages */}
        <div className="border-b bg-background">
          <div className="container px-4 py-4 md:px-6 lg:px-8">
            <OnboardingWizard />
          </div>
        </div>

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