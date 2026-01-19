'use client';

import { extractAboutData, useAboutBlock } from '@/lib/landing';
import {
  About1,
  About2,
  About3,
  About4,
  About5,
  About6,
  About7,
} from './blocks';
import type { TenantLandingConfig, Tenant, PublicTenant } from '@/types';

interface TenantAboutProps {
  config?: TenantLandingConfig['about'];
  tenant: Tenant | PublicTenant;
}

/**
 * Tenant About Component
 *
 * 🎯 DATA SOURCE (from LANDING-DATA-CONTRACT.md):
 * - title → tenant.aboutTitle
 * - subtitle → tenant.aboutSubtitle
 * - content → tenant.aboutContent
 * - image → tenant.aboutImage
 * - features → tenant.aboutFeatures
 *
 * 🚀 BLOCK VARIANTS:
 * - about1 → Grid (default)
 * - about2 → Side by Side
 * - about3 → Centered
 * - about4 → Timeline
 * - about5 → Cards
 * - about6 → Magazine
 * - about7 → Storytelling
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

  // 🚀 Render appropriate block based on template
  switch (block) {
    case 'about2':
      return <About2 {...commonProps} />;

    case 'about3':
      return <About3 {...commonProps} />;

    case 'about4':
      return <About4 {...commonProps} />;

    case 'about5':
      return <About5 {...commonProps} />;

    case 'about6':
      return <About6 {...commonProps} />;

    case 'about7':
      return <About7 {...commonProps} />;

    // Default: about1 (Grid)
    case 'about1':
    default:
      return <About1 {...commonProps} />;
  }
}
