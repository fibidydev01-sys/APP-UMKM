// ==========================================
// TEMPLATE SYSTEM TYPE DEFINITIONS
// Uses shared types as single source of truth
// ==========================================

import type {
  HeroBlock,
  AboutBlock,
  ProductsBlock,
  TestimonialsBlock,
  ContactBlock,
  CtaBlock,
  TemplateId,
  TemplateCategory,
} from '@umkm/shared/types';

/**
 * A template is a combination of section blocks
 * This defines the visual appearance of the entire landing page
 */
export interface LandingTemplate {
  id: TemplateId;
  name: string;
  description: string;
  preview?: string; // Preview image URL (optional)
  category: TemplateCategory;
  blocks: {
    hero: HeroBlock;
    about: AboutBlock;
    products: ProductsBlock;
    testimonials?: TestimonialsBlock;
    contact?: ContactBlock;
    cta?: CtaBlock;
  };
}

/**
 * Template context value
 */
export interface TemplateContextValue {
  currentTemplate: LandingTemplate;
  setTemplate: (templateId: string) => void;
  getHeroBlock: () => HeroBlock;
  getAboutBlock: () => AboutBlock;
  getProductsBlock: () => ProductsBlock;
  getTestimonialsBlock: () => TestimonialsBlock;
  getContactBlock: () => ContactBlock;
  getCtaBlock: () => CtaBlock;
}

// Re-export shared types for convenience
export type {
  HeroBlock,
  AboutBlock,
  ProductsBlock,
  TestimonialsBlock,
  ContactBlock,
  CtaBlock,
  TemplateId,
  TemplateCategory,
};
