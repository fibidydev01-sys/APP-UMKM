'use client';

import { extractCtaData, useCtaBlock } from '@/lib/landing';
import {
  Cta1,
  Cta2,
  Cta3,
  Cta4,
  Cta5,
  Cta6,
  Cta7,
} from './blocks';
import type { TenantLandingConfig, Tenant, PublicTenant } from '@/types';

interface TenantCtaProps {
  config?: TenantLandingConfig['cta'];
  tenant: Tenant | PublicTenant;
}

/**
 * Tenant CTA Component
 *
 * 🎯 DATA SOURCE (from LANDING-DATA-CONTRACT.md):
 * - title → tenant.ctaTitle
 * - subtitle → tenant.ctaSubtitle
 * - buttonText → tenant.ctaButtonText
 * - buttonLink → tenant.ctaButtonLink
 * - buttonStyle → tenant.ctaButtonStyle
 *
 * 🚀 BLOCK VARIANTS:
 * - cta1 → Default
 * - cta2 → Bold Center
 * - cta3 → Gradient Banner
 * - cta4 → Split Action
 * - cta5 → Floating
 * - cta6 → Minimal Line
 * - cta7 → Countdown
 */
export function TenantCta({ config, tenant }: TenantCtaProps) {
  const templateBlock = useCtaBlock();
  const block = config?.block || templateBlock;

  // Extract CTA data directly from tenant (Data Contract fields)
  const ctaData = extractCtaData(tenant, config ? { cta: config } : undefined);

  const buttonVariant: 'default' | 'secondary' | 'outline' =
    ctaData.buttonStyle === 'outline' ? 'outline' :
    ctaData.buttonStyle === 'secondary' ? 'secondary' : 'default';

  const commonProps = {
    title: ctaData.title,
    subtitle: ctaData.subtitle,
    buttonText: ctaData.buttonText,
    buttonLink: ctaData.buttonLink,
    buttonVariant,
  };

  // Render appropriate block based on template
  switch (block) {
    case 'cta2':
      return <Cta2 {...commonProps} />;

    case 'cta3':
      return <Cta3 {...commonProps} />;

    case 'cta4':
      return <Cta4 {...commonProps} />;

    case 'cta5':
      return <Cta5 {...commonProps} />;

    case 'cta6':
      return <Cta6 {...commonProps} />;

    case 'cta7':
      return <Cta7 {...commonProps} />;

    // Default: cta1 (Default)
    case 'cta1':
    default:
      return <Cta1 {...commonProps} />;
  }
}
