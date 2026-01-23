/**
 * ============================================================================
 * FILE: components/landing-builder/builder-loading-steps.tsx
 * ============================================================================
 * Multi-step loading screen for Landing Builder
 * Shows progressive steps to make loading feel intentional, not broken
 * ============================================================================
 */
'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Check, Loader2 } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface LoadingStep {
  id: string;
  label: string;
  duration: number; // ms to show this step
}

interface BuilderLoadingStepsProps {
  onComplete?: () => void;
  className?: string;
}

// ============================================================================
// LOADING STEPS CONFIG
// ============================================================================

const LOADING_STEPS: LoadingStep[] = [
  { id: 'prepare', label: 'Menyiapkan Editor...', duration: 800 },
  { id: 'blocks', label: 'Memuat Design Blocks...', duration: 1000 },
  { id: 'config', label: 'Mengambil Konfigurasi...', duration: 700 },
  { id: 'preview', label: 'Menyiapkan Preview...', duration: 600 },
  { id: 'final', label: 'Hampir Selesai...', duration: 500 },
];

// ============================================================================
// COMPONENT
// ============================================================================

export function BuilderLoadingSteps({ onComplete, className }: BuilderLoadingStepsProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  useEffect(() => {
    if (currentStep >= LOADING_STEPS.length) {
      onComplete?.();
      return;
    }

    const step = LOADING_STEPS[currentStep];
    const timer = setTimeout(() => {
      setCompletedSteps(prev => [...prev, step.id]);
      setCurrentStep(prev => prev + 1);
    }, step.duration);

    return () => clearTimeout(timer);
  }, [currentStep, onComplete]);

  const progress = Math.min((currentStep / LOADING_STEPS.length) * 100, 100);

  return (
    <div className={cn(
      'h-screen flex flex-col items-center justify-center bg-background',
      className
    )}>
      <div className="w-full max-w-md px-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Landing Page Builder</h1>
          <p className="text-muted-foreground text-sm">
            Mempersiapkan workspace Anda
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-right">
            {Math.round(progress)}%
          </p>
        </div>

        {/* Steps List */}
        <div className="space-y-3">
          {LOADING_STEPS.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const isActive = index === currentStep;
            const isPending = index > currentStep;

            return (
              <div
                key={step.id}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg transition-all duration-300',
                  isActive && 'bg-primary/5 border border-primary/20',
                  isCompleted && 'opacity-60',
                  isPending && 'opacity-30'
                )}
              >
                {/* Icon */}
                <div className={cn(
                  'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all',
                  isCompleted && 'bg-primary text-primary-foreground',
                  isActive && 'bg-primary/20',
                  isPending && 'bg-muted'
                )}>
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : isActive ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                  )}
                </div>

                {/* Label */}
                <span className={cn(
                  'text-sm font-medium transition-colors',
                  isActive && 'text-primary',
                  isCompleted && 'text-muted-foreground',
                  isPending && 'text-muted-foreground/50'
                )}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer Hint */}
        <p className="text-center text-xs text-muted-foreground">
          Tip: Gunakan drag & drop untuk mengatur urutan section
        </p>
      </div>
    </div>
  );
}
