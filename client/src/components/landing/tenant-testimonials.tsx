'use client';

import { normalizeTestimonials, useTestimonialsBlock } from '@/lib/landing';
import {
  Testimonials1,
  Testimonials2,
  Testimonials3,
  Testimonials4,
  Testimonials5,
  Testimonials6,
  Testimonials7,
} from './blocks';
import type { TenantLandingConfig } from '@/types';

interface TenantTestimonialsProps {
  config?: TenantLandingConfig['testimonials'];
}

/**
 * Tenant Testimonials Component
 *
 * Wrapper that selects and renders the appropriate block
 * based on the current template context
 *
 * 🚀 v3.0 NUMBERING SYSTEM:
 * - testimonials1 → Grid Cards (default)
 * - testimonials2 → Card Slider
 * - testimonials3 → Quote Highlight
 * - testimonials4 → Single Focus
 * - testimonials5 → Video
 * - testimonials6 → Social Proof
 * - testimonials7 → Marquee
 *
 * 🎯 BLOCK PRIORITY:
 * 1. config.block (user override)
 * 2. template variant (from TemplateProvider)
 */
export function TenantTestimonials({ config }: TenantTestimonialsProps) {
  const templateBlock = useTestimonialsBlock();
  const block = config?.block || templateBlock;

  const title = config?.title || 'Testimoni';
  const subtitle = config?.subtitle || '';
  const items = normalizeTestimonials(config?.config?.items);

  if (items.length === 0) return null;

  const commonProps = {
    items,
    title,
    subtitle,
  };

  // Render appropriate block based on template
  switch (block) {
    case 'testimonials2':
      return <Testimonials2 {...commonProps} />;

    case 'testimonials3':
      return <Testimonials3 {...commonProps} />;

    case 'testimonials4':
      return <Testimonials4 {...commonProps} />;

    case 'testimonials5':
      return <Testimonials5 {...commonProps} />;

    case 'testimonials6':
      return <Testimonials6 {...commonProps} />;

    case 'testimonials7':
      return <Testimonials7 {...commonProps} />;

    // Default: testimonials1 (Grid Cards)
    case 'testimonials1':
    default:
      return <Testimonials1 {...commonProps} />;
  }
}
