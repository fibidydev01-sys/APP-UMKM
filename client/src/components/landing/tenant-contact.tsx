'use client';

import { extractSectionText, useContactBlock } from '@/lib/landing';
import { LANDING_CONSTANTS } from '@/lib/landing';
import {
  Contact1,
  Contact2,
  Contact3,
  Contact4,
  Contact5,
  Contact6,
  Contact7,
} from './blocks';
import type { TenantLandingConfig } from '@/types';

interface TenantContactProps {
  config?: TenantLandingConfig['contact'];
  fallbacks?: {
    title?: string;
    subtitle?: string;
    whatsapp?: string | null;
    phone?: string | null;
    address?: string | null;
    storeName?: string;
  };
}

/**
 * Tenant Contact Component
 *
 * Wrapper that selects and renders the appropriate block
 * based on the current template context
 *
 * 🚀 v3.0 NUMBERING SYSTEM:
 * - contact1 → Default
 * - contact2 → Split Form
 * - contact3 → Centered
 * - contact4 → Map Focus
 * - contact5 → Minimal
 * - contact6 → Social Focused
 * - contact7 → Card Grid
 *
 * 🎯 BLOCK PRIORITY:
 * 1. config.block (user override)
 * 2. template variant (from TemplateProvider)
 */
export function TenantContact({ config, fallbacks = {} }: TenantContactProps) {
  const templateBlock = useContactBlock();
  const block = config?.block || templateBlock;

  const { title, subtitle } = extractSectionText(config, {
    title: fallbacks.title || LANDING_CONSTANTS.SECTION_TITLES.CONTACT,
    subtitle: fallbacks.subtitle,
  });

  const commonProps = {
    title,
    subtitle,
    whatsapp: fallbacks.whatsapp,
    phone: fallbacks.phone,
    address: fallbacks.address,
    storeName: fallbacks.storeName,
  };

  // Render appropriate block based on template
  switch (block) {
    case 'contact2':
      return <Contact2 {...commonProps} />;

    case 'contact3':
      return <Contact3 {...commonProps} />;

    case 'contact4':
      return <Contact4 {...commonProps} />;

    case 'contact5':
      return <Contact5 {...commonProps} />;

    case 'contact6':
      return <Contact6 {...commonProps} />;

    case 'contact7':
      return <Contact7 {...commonProps} />;

    // Default: contact1 (Default)
    case 'contact1':
    default:
      return <Contact1 {...commonProps} />;
  }
}
