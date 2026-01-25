'use client';

import { lazy, Suspense, type ComponentType } from 'react';
import {
  extractTestimonialsData,
  normalizeTestimonials,
  useTestimonialsBlock,
} from '@/lib/landing-templates';
import type { TenantLandingConfig, Tenant, PublicTenant, Testimonial } from '@umkm/shared/types';

interface TenantTestimonialsProps {
  config?: TenantLandingConfig['testimonials'];
  tenant: Tenant | PublicTenant;
}

interface TestimonialsBlockProps {
  items: Testimonial[];
  title: string;
  subtitle: string;
}

/**
 * 🚀 SMART DYNAMIC LOADING - AUTO-DISCOVERY ENABLED!
 *
 * NO MANUAL IMPORTS! Just add testimonials201.tsx and it works!
 *
 * 🎯 DATA SOURCE (from LANDING-DATA-CONTRACT.md):
 * - title → tenant.testimonialsTitle
 * - subtitle → tenant.testimonialsSubtitle
 * - items → tenant.testimonials
 *
 * 🚀 SUPPORTS ALL BLOCKS: testimonials1, testimonials2, ..., testimonials200!
 */
export function TenantTestimonials({ config, tenant }: TenantTestimonialsProps) {
  const templateBlock = useTestimonialsBlock();
  const block = config?.block || templateBlock;

  // Extract testimonials data directly from tenant (Data Contract fields)
  const testimonialsData = extractTestimonialsData(
    tenant,
    config ? { testimonials: config } : undefined
  );
  const items = normalizeTestimonials(testimonialsData.items);

  if (items.length === 0) return null;

  const commonProps = {
    items,
    title: testimonialsData.title,
    subtitle: testimonialsData.subtitle,
  };

  // 🚀 SMART: Dynamic component loading
  const blockNumber = block.replace('testimonials', '');
  const TestimonialsComponent = lazy<ComponentType<TestimonialsBlockProps>>(() =>
    import(`./blocks/testimonials/testimonials${blockNumber}`)
      .then((mod) => ({
        default: mod[`Testimonials${blockNumber}`] as ComponentType<TestimonialsBlockProps>,
      }))
      .catch(() =>
        import('./blocks/testimonials/testimonials1').then((mod) => ({
          default: mod.Testimonials1 as ComponentType<TestimonialsBlockProps>,
        }))
      )
  );

  // Render with Suspense for lazy loading
  return (
    <Suspense fallback={<TestimonialsSkeleton />}>
      <TestimonialsComponent {...commonProps} />
    </Suspense>
  );
}

function TestimonialsSkeleton() {
  return (
    <div className="min-h-screen w-full animate-pulse bg-muted flex items-center justify-center">
      <div className="text-muted-foreground">Loading...</div>
    </div>
  );
}
