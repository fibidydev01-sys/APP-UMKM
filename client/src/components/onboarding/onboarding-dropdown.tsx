"use client";

import Link from 'next/link';
import { IconRocket, IconTrophy } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/hooks/use-onboarding';

// ============================================
// ONBOARDING LINK COMPONENT (Sidebar)
// Now navigates to /dashboard/onboarding page
// ============================================

export function OnboardingDropdown() {
  const { progress, isLoading } = useOnboarding();

  // Loading state
  if (isLoading || !progress) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        asChild
      >
        <Link href="/dashboard/onboarding">
          <IconRocket className="h-5 w-5 animate-pulse" />
        </Link>
      </Button>
    );
  }

  // 100% complete - show trophy
  if (progress.percentage >= 100) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        asChild
      >
        <Link href="/dashboard/onboarding">
          <IconTrophy className="h-5 w-5 text-primary" />
        </Link>
      </Button>
    );
  }

  const remainingSteps = progress.totalSteps - progress.completedSteps;

  // In progress - show rocket with badge
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('h-9 w-9 relative')}
      asChild
    >
      <Link href="/dashboard/onboarding">
        <IconRocket className="h-5 w-5" />
        {remainingSteps > 0 && (
          <div className="absolute -top-0.5 -right-0.5">
            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {remainingSteps}
            </div>
          </div>
        )}
      </Link>
    </Button>
  );
}
