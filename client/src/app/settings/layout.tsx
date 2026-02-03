import type { Metadata } from 'next';
import { AuthGuard } from '@/components/auth';

// ==========================================
// SETTINGS LAYOUT
// Wraps all /settings routes WITHOUT sidebar
// Pattern: AuthGuard → children (no sidebar)
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
      {children}
    </AuthGuard>
  );
}
