'use client';

import { useStoreUrls } from '@/lib/store-url';
import { extractSectionText, getProductsConfig } from '@/lib/landing';
import { LANDING_CONSTANTS, useProductsBlock } from '@/lib/landing';
import {
  ProductsGrid,
  ProductsCarousel,
  ProductsGridHover,
  ProductsMasonry,
  ProductsCatalog,
  ProductsMinimalList,
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
 * 🚀 ALL 7 VARIANTS IMPLEMENTED:
 * - default -> ProductsGrid
 * - grid-hover -> ProductsGridHover
 * - masonry -> ProductsMasonry
 * - carousel -> ProductsCarousel
 * - featured-hero -> ProductsCarousel
 * - catalog -> ProductsCatalog
 * - minimal-list -> ProductsMinimalList
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
    case 'grid-hover':
      return <ProductsGridHover {...commonProps} />;

    case 'masonry':
      return <ProductsMasonry {...commonProps} />;

    case 'carousel':
    case 'featured-hero':
      return <ProductsCarousel {...commonProps} />;

    case 'catalog':
      return <ProductsCatalog {...commonProps} />;

    case 'minimal-list':
      return <ProductsMinimalList {...commonProps} />;

    // Default variant
    default:
      return <ProductsGrid {...commonProps} />;
  }
}
