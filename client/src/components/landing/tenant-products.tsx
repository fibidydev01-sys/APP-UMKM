'use client';

import { useStoreUrls } from '@/lib/store-url';
import { extractSectionText, getProductsConfig } from '@/lib/landing';
import { LANDING_CONSTANTS, useProductsBlock } from '@/lib/landing';
import {
  Products1,
  Products2,
  Products3,
  Products4,
  Products5,
  Products6,
  Products7,
} from './blocks';
import type { Product, TenantLandingConfig } from '@/types';

// ==========================================
// TENANT PRODUCTS COMPONENT - Decoupled
// ==========================================

interface TenantProductsProps {
  products: Product[];
  config?: TenantLandingConfig['products'];
  storeSlug?: string;
  fallbacks?: {
    title?: string;
    subtitle?: string;
    productsLink?: string;
  };
}

/**
 * Tenant Products Component
 *
 * Wrapper that selects and renders the appropriate block
 * based on the current template context
 *
 * 🚀 v3.0 NUMBERING SYSTEM:
 * - products1 → Grid (default)
 * - products2 → Grid Hover
 * - products3 → Masonry
 * - products4 → Carousel
 * - products5 → Catalog
 * - products6 → Minimal List
 * - products7 → Featured Hero
 *
 * 🎯 BLOCK PRIORITY:
 * 1. config.block (user override)
 * 2. template variant (from TemplateProvider)
 */
export function TenantProducts({ products, config, storeSlug, fallbacks = {} }: TenantProductsProps) {
  const templateBlock = useProductsBlock();
  const block = config?.block || templateBlock;

  const { title, subtitle } = extractSectionText(config, {
    title: fallbacks.title || LANDING_CONSTANTS.SECTION_TITLES.PRODUCTS,
    subtitle: fallbacks.subtitle || LANDING_CONSTANTS.SECTION_SUBTITLES.PRODUCTS,
  });

  const productsConfig = getProductsConfig(config);
  const showViewAll = productsConfig?.showViewAll ?? true;
  const limit = productsConfig?.limit || LANDING_CONSTANTS.PRODUCT_LIMIT_DEFAULT;

  // Smart URL routing
  const urls = storeSlug ? useStoreUrls(storeSlug) : null;
  const productsLink = urls?.products() || fallbacks.productsLink || '/products';

  const commonProps = {
    products,
    title,
    subtitle,
    showViewAll,
    productsLink,
    storeSlug: storeSlug || '',
    limit,
  };

  // Render appropriate block based on template
  switch (block) {
    case 'products2':
      return <Products2 {...commonProps} />;

    case 'products3':
      return <Products3 {...commonProps} />;

    case 'products4':
      return <Products4 {...commonProps} />;

    case 'products5':
      return <Products5 {...commonProps} />;

    case 'products6':
      return <Products6 {...commonProps} />;

    case 'products7':
      return <Products7 {...commonProps} />;

    // Default: products1 (Grid)
    case 'products1':
    default:
      return <Products1 {...commonProps} />;
  }
}
