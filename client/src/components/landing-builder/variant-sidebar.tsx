/**
 * VariantSidebar Component
 *
 * Canva-style variant selector sidebar
 * Shows variant options when a section is selected
 */

'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Check, ChevronLeft } from 'lucide-react';
import type { SectionType } from './builder-sidebar';

interface VariantOption {
  value: string;
  label: string;
  description: string;
}

const HERO_VARIANTS: VariantOption[] = [
  { value: 'gradient-overlay', label: 'Gradient Overlay', description: 'Background with...' },
  { value: 'centered-minimal', label: 'Centered Minimal', description: 'Minimalist centered...' },
  { value: 'split-screen', label: 'Split Screen', description: 'Content on left, imag...' },
  { value: 'video-background', label: 'Video Background', description: 'Video or animated...' },
  { value: 'parallax', label: 'Parallax', description: 'Parallax scrolling...' },
  { value: 'animated-gradient', label: 'Animated Gradient', description: 'Animated gradient...' },
  { value: 'glass-morphism', label: 'Glass Morphism', description: 'Glassmorphism effect' },
];

const ABOUT_VARIANTS: VariantOption[] = [
  { value: 'side-by-side', label: 'Side by Side', description: 'Image alongside...' },
  { value: 'centered', label: 'Centered', description: 'Centered content...' },
  { value: 'timeline', label: 'Timeline', description: 'Timeline-style...' },
  { value: 'cards', label: 'Cards', description: 'Card-based layout' },
  { value: 'magazine', label: 'Magazine', description: 'Magazine-style...' },
  { value: 'storytelling', label: 'Storytelling', description: 'Story-focused...' },
];

const PRODUCTS_VARIANTS: VariantOption[] = [
  { value: 'grid-hover', label: 'Grid Hover', description: 'Grid with hover...' },
  { value: 'masonry', label: 'Masonry', description: 'Pinterest-style...' },
  { value: 'carousel', label: 'Carousel', description: 'Sliding carousel' },
  { value: 'featured-hero', label: 'Featured Hero', description: 'Hero product with...' },
  { value: 'catalog', label: 'Catalog', description: 'Catalog list view' },
  { value: 'minimal-list', label: 'Minimal List', description: 'Minimalist list...' },
];

const TESTIMONIALS_VARIANTS: VariantOption[] = [
  { value: 'card-slider', label: 'Card Slider', description: 'Sliding cards' },
  { value: 'quote-highlight', label: 'Quote Highlight', description: 'Highlighted quotes' },
  { value: 'grid-cards', label: 'Grid Cards', description: 'Grid of testimonial...' },
  { value: 'single-focus', label: 'Single Focus', description: 'One testimonial at...' },
  { value: 'video-testimonials', label: 'Video Testimonials', description: 'Video-based...' },
  { value: 'social-proof', label: 'Social Proof', description: 'Social proof style' },
];

const CONTACT_VARIANTS: VariantOption[] = [
  { value: 'split-form', label: 'Split Form', description: 'Form with info split' },
  { value: 'centered', label: 'Centered', description: 'Centered contact...' },
  { value: 'map-focus', label: 'Map Focus', description: 'Map-focused layout' },
  { value: 'minimal', label: 'Minimal', description: 'Minimalist contact' },
  { value: 'social-focused', label: 'Social Focused', description: 'Social media...' },
];

const CTA_VARIANTS: VariantOption[] = [
  { value: 'bold-center', label: 'Bold Center', description: 'Bold centered CTA' },
  { value: 'gradient-banner', label: 'Gradient Banner', description: 'Gradient background...' },
  { value: 'split-action', label: 'Split Action', description: 'Split with multiple...' },
  { value: 'floating', label: 'Floating', description: 'Floating CTA card' },
  { value: 'minimal-line', label: 'Minimal Line', description: 'Minimal single line' },
];

const VARIANT_OPTIONS_MAP = {
  hero: HERO_VARIANTS,
  about: ABOUT_VARIANTS,
  products: PRODUCTS_VARIANTS,
  testimonials: TESTIMONIALS_VARIANTS,
  contact: CONTACT_VARIANTS,
  cta: CTA_VARIANTS,
} as const;

const SECTION_LABELS = {
  hero: 'Hero',
  about: 'About',
  products: 'Products',
  testimonials: 'Testimonials',
  contact: 'Contact',
  cta: 'CTA',
} as const;

interface VariantSidebarProps {
  section: SectionType;
  currentVariant?: string;
  onVariantSelect: (variant: string) => void;
  onBack: () => void;
  className?: string;
}

export function VariantSidebar({
  section,
  currentVariant,
  onVariantSelect,
  onBack,
  className,
}: VariantSidebarProps) {
  const variants = VARIANT_OPTIONS_MAP[section];
  const sectionLabel = SECTION_LABELS[section];

  return (
    <div
      className={cn(
        'w-80 border-r bg-background flex flex-col',
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="gap-2 mb-3"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <h3 className="font-semibold text-lg">{sectionLabel} Section</h3>
        <p className="text-sm text-muted-foreground">Choose a variant style</p>
      </div>

      {/* Variants List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {variants.map((variant) => {
            const isSelected = currentVariant === variant.value;

            return (
              <button
                key={variant.value}
                onClick={() => onVariantSelect(variant.value)}
                className={cn(
                  'w-full text-left p-4 rounded-lg border-2 transition-all hover:shadow-md',
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{variant.label}</p>
                      {isSelected && (
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {variant.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
