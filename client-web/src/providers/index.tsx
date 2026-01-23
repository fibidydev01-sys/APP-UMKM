'use client';

import { ThemeProvider } from './theme-provider';
import { HydrationProvider } from './hydration-provider';

// ==========================================
// MAIN PROVIDERS WRAPPER
// Combines all providers in correct order
// ==========================================

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <HydrationProvider>{children}</HydrationProvider>
    </ThemeProvider>
  );
}

// Re-export individual providers
export { ThemeProvider } from './theme-provider';
export { HydrationProvider, HydrationBoundary } from './hydration-provider';
export { ToastProvider, toast } from './toast-provider';
