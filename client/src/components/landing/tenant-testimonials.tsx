'use client';

import { normalizeTestimonials, useTestimonialsBlock } from '@/lib/landing';
import {
  TestimonialsCardSlider,
  TestimonialsQuoteHighlight,
  TestimonialsGridCards,
  TestimonialsSingleFocus,
  TestimonialsVideo,
  TestimonialsSocialProof,
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
 * 🚀 ALL 7 VARIANTS IMPLEMENTED:
 * - default -> TestimonialsGridCards
 * - card-slider -> TestimonialsCardSlider
 * - quote-highlight -> TestimonialsQuoteHighlight
 * - grid-cards -> TestimonialsGridCards
 * - single-focus -> TestimonialsSingleFocus
 * - video-testimonials -> TestimonialsVideo
 * - social-proof -> TestimonialsSocialProof
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
    case 'card-slider':
      return <TestimonialsCardSlider {...commonProps} />;

    case 'quote-highlight':
      return <TestimonialsQuoteHighlight {...commonProps} />;

    case 'single-focus':
      return <TestimonialsSingleFocus {...commonProps} />;

    case 'video-testimonials':
      return <TestimonialsVideo {...commonProps} />;

    case 'social-proof':
      return <TestimonialsSocialProof {...commonProps} />;

    // Default blocks: default, grid-cards
    default:
      return <TestimonialsGridCards {...commonProps} />;
  }
}