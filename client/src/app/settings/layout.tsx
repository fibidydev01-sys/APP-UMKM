import type { Metadata } from 'next';
import { AuthGuard } from '@/components/auth';

// ==========================================
// SETTINGS LAYOUT
// Isolated settings pages with AuthGuard
// Uses SidebarProvider for desktop sidebar + mobile sheet
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
      <div className="min-h-screen bg-background">{children}</div>
    </AuthGuard>
  );
}
