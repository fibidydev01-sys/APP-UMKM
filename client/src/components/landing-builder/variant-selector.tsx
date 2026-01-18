'use client';

// ==========================================
// VARIANT SELECTOR COMPONENT
// Visual selector for section variants
// ==========================================

import { Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type {
  HeroVariant,
  AboutVariant,
  ProductsVariant,
  TestimonialsVariant,
  ContactVariant,
  CtaVariant,
} from '@/types/landing';

// ==========================================
// VARIANT METADATA (v3.0 NUMBERING SYSTEM)
// See MAPPING.md for design name references
// ==========================================

interface VariantOption {
  value: string;
  label: string;
  description: string;
}

const HERO_VARIANTS: VariantOption[] = [
  { value: 'hero1', label: 'Centered', description: 'Classic centered hero with optional background image' },
  { value: 'hero2', label: 'Split Screen', description: 'Split layout with content on left, image on right' },
  { value: 'hero3', label: 'Video Background', description: 'Hero with video dialog - click to play video' },
  { value: 'hero4', label: 'Parallax', description: 'Parallax scrolling effect with layered content' },
  { value: 'hero5', label: 'Animated Gradient', description: 'Dynamic animated gradient with light rays' },
  { value: 'hero6', label: 'Glass Morphism', description: 'Modern glass-morphism design with blur effects' },
];

const ABOUT_VARIANTS: VariantOption[] = [
  { value: 'about1', label: 'Grid', description: 'Grid layout with features showcase' },
  { value: 'about2', label: 'Side by Side', description: 'Classic side-by-side layout with image and content' },
  { value: 'about3', label: 'Centered', description: 'Centered content with clean typography' },
  { value: 'about4', label: 'Timeline', description: 'Timeline-style story layout' },
  { value: 'about5', label: 'Cards', description: 'Card-based feature highlights' },
  { value: 'about6', label: 'Magazine', description: 'Magazine-style editorial layout' },
  { value: 'about7', label: 'Storytelling', description: 'Story-focused narrative layout' },
];

const PRODUCTS_VARIANTS: VariantOption[] = [
  { value: 'products1', label: 'Grid', description: 'Clean product grid layout' },
  { value: 'products2', label: 'Grid Hover', description: 'Grid with interactive hover effects' },
  { value: 'products3', label: 'Masonry', description: 'Pinterest-style masonry grid' },
  { value: 'products4', label: 'Carousel', description: 'Sliding carousel showcase' },
  { value: 'products5', label: 'Catalog', description: 'Catalog list view' },
  { value: 'products6', label: 'Minimal List', description: 'Minimalist list layout' },
];

const TESTIMONIALS_VARIANTS: VariantOption[] = [
  { value: 'testimonials1', label: 'Grid Cards', description: 'Grid of testimonial cards' },
  { value: 'testimonials2', label: 'Card Slider', description: 'Sliding testimonial cards' },
  { value: 'testimonials3', label: 'Quote Highlight', description: 'Highlighted quote focus' },
  { value: 'testimonials4', label: 'Single Focus', description: 'One testimonial at a time' },
  { value: 'testimonials5', label: 'Video', description: 'Video-based testimonials' },
  { value: 'testimonials6', label: 'Social Proof', description: 'Social proof style layout' },
];

const CONTACT_VARIANTS: VariantOption[] = [
  { value: 'contact1', label: 'Default', description: 'Standard contact layout' },
  { value: 'contact2', label: 'Split Form', description: 'Form with info split layout' },
  { value: 'contact3', label: 'Centered', description: 'Centered contact form' },
  { value: 'contact4', label: 'Map Focus', description: 'Map-focused contact layout' },
  { value: 'contact5', label: 'Minimal', description: 'Minimalist contact design' },
  { value: 'contact6', label: 'Social Focused', description: 'Social media focused layout' },
];

const CTA_VARIANTS: VariantOption[] = [
  { value: 'cta1', label: 'Default', description: 'Standard call-to-action' },
  { value: 'cta2', label: 'Bold Center', description: 'Bold centered CTA' },
  { value: 'cta3', label: 'Gradient Banner', description: 'Gradient background banner' },
  { value: 'cta4', label: 'Split Action', description: 'Split with multiple actions' },
  { value: 'cta5', label: 'Floating', description: 'Floating CTA card' },
  { value: 'cta6', label: 'Minimal Line', description: 'Minimal single line CTA' },
];

const VARIANT_OPTIONS_MAP = {
  hero: HERO_VARIANTS,
  about: ABOUT_VARIANTS,
  products: PRODUCTS_VARIANTS,
  testimonials: TESTIMONIALS_VARIANTS,
  contact: CONTACT_VARIANTS,
  cta: CTA_VARIANTS,
} as const;

// ==========================================
// TYPES
// ==========================================

type SectionType = keyof typeof VARIANT_OPTIONS_MAP;
type VariantType = HeroVariant | AboutVariant | ProductsVariant | TestimonialsVariant | ContactVariant | CtaVariant;

interface VariantSelectorProps {
  section: SectionType;
  selectedVariant?: string;
  onSelect: (variant: string) => void;
  disabled?: boolean;
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export function VariantSelector({
  section,
  selectedVariant,
  onSelect,
  disabled = false,
}: VariantSelectorProps) {
  const variants = VARIANT_OPTIONS_MAP[section];

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Variant Style</Label>
      <div className="grid grid-cols-2 gap-2">
        {variants.map((variant) => {
          const isSelected = selectedVariant === variant.value;

          return (
            <Card
              key={variant.value}
              className={cn(
                'cursor-pointer transition-all hover:shadow-md',
                isSelected && 'border-2 border-primary bg-primary/5',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
              onClick={() => !disabled && onSelect(variant.value)}
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm truncate">{variant.label}</p>
                      {isSelected && (
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {variant.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected indicator */}
      {selectedVariant && (
        <p className="text-xs text-muted-foreground">
          Selected: <span className="font-medium">{variants.find((v) => v.value === selectedVariant)?.label}</span>
        </p>
      )}
    </div>
  );
}

// ==========================================
// EXPORT VARIANT OPTIONS for external use
// ==========================================

export { HERO_VARIANTS, ABOUT_VARIANTS, PRODUCTS_VARIANTS, TESTIMONIALS_VARIANTS, CONTACT_VARIANTS, CTA_VARIANTS };
