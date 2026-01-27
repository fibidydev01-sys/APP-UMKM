import type { Metadata } from 'next';

// ==========================================
// METADATA
// ==========================================

export const metadata: Metadata = {
  title: 'Dashboard',
};

// ==========================================
// DASHBOARD PAGE
// ==========================================

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[50vh] px-4">
      <p className="text-muted-foreground text-sm">Halaman dalam pengembangan</p>
    </div>
  );
}