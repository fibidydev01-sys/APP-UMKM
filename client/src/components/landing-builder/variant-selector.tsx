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
  { value: 'hero1', label: 'hero1', description: 'Centered - Classic centered hero' },
  { value: 'hero2', label: 'hero2', description: 'Split Screen - Content left, image right' },
  { value: 'hero3', label: 'hero3', description: 'Video Background - Click to play video' },
  { value: 'hero4', label: 'hero4', description: 'Parallax - Scrolling effect' },
  { value: 'hero5', label: 'hero5', description: 'Animated Gradient - Light rays effect' },
  { value: 'hero6', label: 'hero6', description: 'Glass Morphism - Blur effects' },
];

const ABOUT_VARIANTS: VariantOption[] = [
  { value: 'about1', label: 'about1', description: 'Grid - Features showcase' },
  { value: 'about2', label: 'about2', description: 'Side by Side - Image and content' },
  { value: 'about3', label: 'about3', description: 'Centered - Clean typography' },
  { value: 'about4', label: 'about4', description: 'Timeline - Story layout' },
  { value: 'about5', label: 'about5', description: 'Cards - Feature highlights' },
  { value: 'about6', label: 'about6', description: 'Magazine - Editorial layout' },
  { value: 'about7', label: 'about7', description: 'Storytelling - Narrative layout' },
];

const PRODUCTS_VARIANTS: VariantOption[] = [
  { value: 'products1', label: 'products1', description: 'Grid - Clean product grid' },
  { value: 'products2', label: 'products2', description: 'Grid Hover - Interactive effects' },
  { value: 'products3', label: 'products3', description: 'Masonry - Pinterest-style' },
  { value: 'products4', label: 'products4', description: 'Carousel - Sliding showcase' },
  { value: 'products5', label: 'products5', description: 'Catalog - List view' },
  { value: 'products6', label: 'products6', description: 'Minimal List - Minimalist' },
];

const TESTIMONIALS_VARIANTS: VariantOption[] = [
  { value: 'testimonials1', label: 'testimonials1', description: 'Grid Cards - Card grid' },
  { value: 'testimonials2', label: 'testimonials2', description: 'Card Slider - Sliding cards' },
  { value: 'testimonials3', label: 'testimonials3', description: 'Quote Highlight - Featured quote' },
  { value: 'testimonials4', label: 'testimonials4', description: 'Single Focus - One at a time' },
  { value: 'testimonials5', label: 'testimonials5', description: 'Video - Video testimonials' },
  { value: 'testimonials6', label: 'testimonials6', description: 'Social Proof - Social style' },
];

const CONTACT_VARIANTS: VariantOption[] = [
  { value: 'contact1', label: 'contact1', description: 'Default - Standard layout' },
  { value: 'contact2', label: 'contact2', description: 'Split Form - Form with info' },
  { value: 'contact3', label: 'contact3', description: 'Centered - Centered form' },
  { value: 'contact4', label: 'contact4', description: 'Map Focus - Map layout' },
  { value: 'contact5', label: 'contact5', description: 'Minimal - Minimalist' },
  { value: 'contact6', label: 'contact6', description: 'Social Focused - Social media' },
];

const CTA_VARIANTS: VariantOption[] = [
  { value: 'cta1', label: 'cta1', description: 'Default - Standard CTA' },
  { value: 'cta2', label: 'cta2', description: 'Bold Center - Bold centered' },
  { value: 'cta3', label: 'cta3', description: 'Gradient Banner - Gradient bg' },
  { value: 'cta4', label: 'cta4', description: 'Split Action - Multiple actions' },
  { value: 'cta5', label: 'cta5', description: 'Floating - Floating card' },
  { value: 'cta6', label: 'cta6', description: 'Minimal Line - Single line' },
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
