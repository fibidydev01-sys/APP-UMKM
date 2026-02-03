import type { Metadata } from 'next';
import { AuthGuard } from '@/components/auth';
import { DashboardLayout } from '@/components/dashboard';

// ==========================================
// SETTINGS LAYOUT
// Uses DashboardLayout for consistency with dashboard pages
// Pattern: AuthGuard → DashboardLayout → children
// ==========================================

export const metadata: Metadata = {
  title: {
    template: '%s | Settings - Fibidy',
    default: 'Settings - Fibidy',
  },
};

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <AuthGuard requireAuth redirectTo="/login">
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}
