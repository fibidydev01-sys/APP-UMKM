'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { OnboardingDropdown } from '@/components/onboarding';

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 hidden md:flex" />
        <Separator orientation="vertical" className="h-4 hidden md:block" />
        <span className="font-semibold text-sm">Dashboard</span>
      </div>

      <div className="flex items-center gap-1">
        <OnboardingDropdown />

        <AnimatedThemeToggler
          className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground transition-colors [&_svg]:h-5 [&_svg]:w-5"
        />
      </div>
    </header>
  );
}