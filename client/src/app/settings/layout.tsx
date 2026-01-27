import type { Metadata } from 'next';
import { AuthGuard } from '@/components/auth';

// ==========================================
// SETTINGS LAYOUT
// Isolated settings pages with AuthGuard
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
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-6 px-4 md:px-6 lg:px-8">{children}</div>
      </div>
    </AuthGuard>
  );
}
