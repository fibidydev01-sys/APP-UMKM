'use client';

import { useStoreUrls } from '@/lib/store-url';
import { extractSectionText, getProductsConfig } from '@/lib/landing';
import { LANDING_CONSTANTS, useProductsVariant } from '@/lib/landing';
import {
  ProductsGrid,
  ProductsCarousel,
  ProductsGridHover,
  ProductsMasonry,
  ProductsCatalog,
  ProductsMinimalList,
} from './variants';
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
 * Wrapper that selects and renders the appropriate products variant
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
 * 🎯 VARIANT PRIORITY:
 * 1. config.variant (user override)
 * 2. template variant (from TemplateProvider)
 */
export function TenantProducts({ products, config, storeSlug, fallbacks = {} }: TenantProductsProps) {
  const templateVariant = useProductsVariant();
  const variant = config?.variant || templateVariant;

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

  // Render appropriate variant based on template
  switch (variant) {
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
