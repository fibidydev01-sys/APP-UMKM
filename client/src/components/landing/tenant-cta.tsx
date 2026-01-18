'use client';

import { useStoreUrls } from '@/lib/store-url';
import { extractSectionText, getCtaConfig, extractCtaLink, extractCtaButtonText, useCtaBlock } from '@/lib/landing';
import { LANDING_CONSTANTS } from '@/lib/landing';
import {
  Cta1,
  Cta2,
  Cta3,
  Cta4,
  Cta5,
  Cta6,
} from './blocks';
import type { TenantLandingConfig } from '@/types';

interface TenantCtaProps {
  config?: TenantLandingConfig['cta'];
  storeSlug?: string;
  fallbacks?: {
    title?: string;
    subtitle?: string;
    buttonLink?: string;
  };
}

/**
 * Tenant CTA Component
 *
 * Wrapper that selects and renders the appropriate block
 * based on the current template context
 *
 * 🚀 v3.0 NUMBERING SYSTEM:
 * - cta1 → Default
 * - cta2 → Bold Center
 * - cta3 → Gradient Banner
 * - cta4 → Split Action
 * - cta5 → Floating
 * - cta6 → Minimal Line
 *
 * 🎯 BLOCK PRIORITY:
 * 1. config.block (user override)
 * 2. template variant (from TemplateProvider)
 */
export function TenantCta({ config, storeSlug, fallbacks = {} }: TenantCtaProps) {
  const templateBlock = useCtaBlock();
  const block = config?.block || templateBlock;

  const { title, subtitle } = extractSectionText(config, {
    title: fallbacks.title || LANDING_CONSTANTS.SECTION_TITLES.CTA,
    subtitle: fallbacks.subtitle,
  });

  const ctaConfig = getCtaConfig(config);
  const buttonText = extractCtaButtonText(ctaConfig, LANDING_CONSTANTS.CTA_BUTTON_DEFAULT);
  const style = ctaConfig?.style || 'primary';

  // Smart URL routing
  const urls = storeSlug ? useStoreUrls(storeSlug) : null;
  const defaultLink = urls?.products() || fallbacks.buttonLink || '/products';
  const buttonLink = extractCtaLink(ctaConfig, defaultLink);

  const buttonVariant =
    style === 'outline' ? 'outline' : style === 'secondary' ? 'secondary' : 'default';

  const commonProps = {
    title,
    subtitle,
    buttonText,
    buttonLink,
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

    // Default: cta1 (Default)
    case 'cta1':
    default:
      return <Cta1 {...commonProps} />;
  }
}
