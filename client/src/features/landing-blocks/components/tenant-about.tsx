'use client';

import { lazy, Suspense, type ComponentType } from 'react';
import { extractAboutData, useAboutBlock } from '@/lib/landing-templates';
import type { TenantLandingConfig, Tenant, PublicTenant, FeatureItem } from '@umkm/shared/types';

interface TenantAboutProps {
  config?: TenantLandingConfig['about'];
  tenant: Tenant | PublicTenant;
}

interface AboutBlockProps {
  title: string;
  subtitle: string;
  content: string;
  image?: string;
  features: FeatureItem[];
}

/**
 * 🚀 SMART DYNAMIC LOADING - AUTO-DISCOVERY ENABLED!
 *
 * NO MANUAL IMPORTS! Just add about201.tsx and it works!
 *
 * 🎯 DATA SOURCE (from LANDING-DATA-CONTRACT.md):
 * - title → tenant.aboutTitle
 * - subtitle → tenant.aboutSubtitle
 * - content → tenant.aboutContent
 * - image → tenant.aboutImage
 * - features → tenant.aboutFeatures
 *
 * 🚀 SUPPORTS ALL BLOCKS: about1, about2, about3, ..., about200, about9999!
 */
export function TenantAbout({ config, tenant }: TenantAboutProps) {
  const templateBlock = useAboutBlock();
  const block = config?.block || templateBlock;

  // Extract about data directly from tenant (Data Contract fields)
  const aboutData = extractAboutData(tenant, config ? { about: config } : undefined);

  const commonProps = {
    title: aboutData.title,
    subtitle: aboutData.subtitle,
    content: aboutData.content,
    image: aboutData.image,
    features: aboutData.features,
  };

  // 🚀 SMART: Dynamic component loading
  const blockNumber = block.replace('about', '');
  const AboutComponent = lazy<ComponentType<AboutBlockProps>>(() =>
    import(`./blocks/about/about${blockNumber}`)
      .then((mod) => ({ default: mod[`About${blockNumber}`] as ComponentType<AboutBlockProps> }))
      .catch(() =>
        import('./blocks/about/about1').then((mod) => ({
          default: mod.About1 as ComponentType<AboutBlockProps>,
        }))
      )
  );

  // Render with Suspense for lazy loading
  return (
    <Suspense fallback={<AboutSkeleton />}>
      <AboutComponent {...commonProps} />
    </Suspense>
  );
}

function AboutSkeleton() {
  return (
    <div className="min-h-screen w-full animate-pulse bg-muted flex items-center justify-center">
      <div className="text-muted-foreground">Loading...</div>
    </div>
  );
}
