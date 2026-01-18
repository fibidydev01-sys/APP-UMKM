'use client';

import { extractSectionText, getAboutConfig, extractAboutImage } from '@/lib/landing';
import { LANDING_CONSTANTS, useAboutBlock } from '@/lib/landing';
import {
  About1,
  About2,
  About3,
  About4,
  About5,
  About6,
  About7,
} from './blocks';
import type { TenantLandingConfig } from '@/types';

interface TenantAboutProps {
  config?: TenantLandingConfig['about'];
  fallbacks?: {
    title?: string;
    subtitle?: string;
    content?: string;
    image?: string;
  };
}

/**
 * Tenant About Component
 *
 * Wrapper that selects and renders the appropriate block
 * based on the current template context
 *
 * 🚀 v3.0 NUMBERING SYSTEM:
 * - about1 → Grid (default)
 * - about2 → Side by Side
 * - about3 → Centered
 * - about4 → Timeline
 * - about5 → Cards
 * - about6 → Magazine
 * - about7 → Storytelling
 *
 * 🎯 BLOCK PRIORITY:
 * 1. config.block (user override)
 * 2. template variant (from TemplateProvider)
 */
export function TenantAbout({ config, fallbacks = {} }: TenantAboutProps) {
  const templateBlock = useAboutBlock();
  const block = config?.block || templateBlock;

  const { title, subtitle } = extractSectionText(config, {
    title: fallbacks.title || LANDING_CONSTANTS.SECTION_TITLES.ABOUT,
    subtitle: fallbacks.subtitle,
  });

  const aboutConfig = getAboutConfig(config);
  const content = aboutConfig?.content || fallbacks.content || '';
  const image = extractAboutImage(aboutConfig, fallbacks.image);
  const features = aboutConfig?.features || [];

  const commonProps = {
    title,
    subtitle,
    content,
    image,
    features,
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
