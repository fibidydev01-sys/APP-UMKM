// ==========================================
// ONBOARDING TYPES
// Type definitions for tenant onboarding progress
// ==========================================

export type OnboardingCategory =
  | 'identity'
  | 'hero'
  | 'about'
  | 'testimonials'
  | 'contact'
  | 'cta'
  | 'products';

export type OnboardingCheckType = 'boolean' | 'string' | 'array_min';

export type OnboardingMilestone = 'bronze' | 'silver' | 'gold' | 'diamond' | null;

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  field: string;
  points: number;
  isCritical: boolean;
  actionLabel: string;
  actionHref: string;
  category: OnboardingCategory;
  checkType?: OnboardingCheckType;
  minCount?: number;
}

export interface OnboardingStepStatus extends OnboardingStep {
  completed: boolean;
}

export interface OnboardingProgress {
  totalScore: number;
  maxScore: number;
  percentage: number;
  completedSteps: number;
  totalSteps: number;
  canPublish: boolean;
  criticalItems: {
    logo: boolean;
    heroBackground: boolean;
  };
  steps: OnboardingStepStatus[];
  milestone: OnboardingMilestone;
}

export interface OnboardingState {
  progress: OnboardingProgress | null;
  isLoading: boolean;
  isDismissed: boolean;
  error: string | null;
}
