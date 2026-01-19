'use client';

import { extractTestimonialsData, normalizeTestimonials, useTestimonialsBlock } from '@/lib/landing';
import {
  Testimonials1,
  Testimonials2,
  Testimonials3,
  Testimonials4,
  Testimonials5,
  Testimonials6,
  Testimonials7,
} from './blocks';
import type { TenantLandingConfig, Tenant, PublicTenant } from '@/types';

interface TenantTestimonialsProps {
  config?: TenantLandingConfig['testimonials'];
  tenant: Tenant | PublicTenant;
}

/**
 * Tenant Testimonials Component
 *
 * 🎯 DATA SOURCE (from LANDING-DATA-CONTRACT.md):
 * - title → tenant.testimonialsTitle
 * - subtitle → tenant.testimonialsSubtitle
 * - items → tenant.testimonials
 *
 * 🚀 BLOCK VARIANTS:
 * - testimonials1 → Grid Cards (default)
 * - testimonials2 → Card Slider
 * - testimonials3 → Quote Highlight
 * - testimonials4 → Single Focus
 * - testimonials5 → Video
 * - testimonials6 → Social Proof
 * - testimonials7 → Marquee
 */
export function TenantTestimonials({ config, tenant }: TenantTestimonialsProps) {
  const templateBlock = useTestimonialsBlock();
  const block = config?.block || templateBlock;

  // Extract testimonials data directly from tenant (Data Contract fields)
  const testimonialsData = extractTestimonialsData(tenant, config ? { testimonials: config } : undefined);
  const items = normalizeTestimonials(testimonialsData.items);

  if (items.length === 0) return null;

  const commonProps = {
    items,
    title: testimonialsData.title,
    subtitle: testimonialsData.subtitle,
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
