// ==========================================
// LANDING CONFIG VALIDATOR
// server/src/validators/landing-config.validator.ts
// ==========================================
// 🚀 UPDATED: Added template & block support for Landing Page Template System
// ==========================================

import Ajv, { ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface TestimonialItem {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
  content: string;
  rating?: number;
}

export interface FeatureItem {
  icon?: string;
  title: string;
  description: string;
}

// ==========================================
// 🚀 NEW: Template System Types
// ==========================================

export type TemplateId =
  | 'suspended-minimalist'
  | 'modern-starter'
  | 'bold-starter'
  | 'classic-starter'
  | 'brand-starter'
  | 'catalog-starter'
  | 'fresh-starter'
  | 'elegant-starter'
  | 'dynamic-starter'
  | 'professional-starter'
  | 'custom';

/**
 * v3.0 NUMBERING SYSTEM
 * See client/src/components/landing/blocks/MAPPING.md for design name references
 */

export type HeroBlock =
  | 'hero1'   // Centered (default)
  | 'hero2'   // Split Screen
  | 'hero3'   // Video Background
  | 'hero4'   // Parallax
  | 'hero5'   // Animated Gradient
  | 'hero6'   // Glass Morphism
  | 'hero7'   // Bento Grid
  | 'hero8' | 'hero9' | 'hero10' | 'hero11' | 'hero12' | 'hero13' | 'hero14' | 'hero15' | 'hero16' | 'hero17'
  | 'hero18' | 'hero19' | 'hero20' | 'hero21' | 'hero22' | 'hero23' | 'hero24' | 'hero25' | 'hero26' | 'hero27'
  | 'hero28' | 'hero29' | 'hero30' | 'hero31' | 'hero32' | 'hero33' | 'hero34' | 'hero35' | 'hero36' | 'hero37'
  | 'hero38' | 'hero39' | 'hero40' | 'hero41' | 'hero42' | 'hero43' | 'hero44' | 'hero45' | 'hero46' | 'hero47'
  | 'hero48' | 'hero49' | 'hero50' | 'hero51' | 'hero52' | 'hero53' | 'hero54' | 'hero55' | 'hero56' | 'hero57'
  | 'hero58' | 'hero59' | 'hero60' | 'hero61' | 'hero62' | 'hero63' | 'hero64' | 'hero65' | 'hero66' | 'hero67'
  | 'hero68' | 'hero69' | 'hero70' | 'hero71' | 'hero72' | 'hero73' | 'hero74' | 'hero75' | 'hero76' | 'hero77'
  | 'hero78' | 'hero79' | 'hero80' | 'hero81' | 'hero82' | 'hero83' | 'hero84' | 'hero85' | 'hero86' | 'hero87'
  | 'hero88' | 'hero89' | 'hero90' | 'hero91' | 'hero92' | 'hero93' | 'hero94' | 'hero95' | 'hero96' | 'hero97'
  | 'hero98' | 'hero99' | 'hero100';

export type AboutBlock =
  | 'about1'  // Grid (default)
  | 'about2'  // Side by Side
  | 'about3'  // Centered
  | 'about4'  // Timeline
  | 'about5'  // Cards
  | 'about6'  // Magazine
  | 'about7'  // Storytelling
  | 'about8' | 'about9' | 'about10' | 'about11' | 'about12' | 'about13' | 'about14' | 'about15' | 'about16' | 'about17'
  | 'about18' | 'about19' | 'about20' | 'about21' | 'about22' | 'about23' | 'about24' | 'about25' | 'about26' | 'about27'
  | 'about28' | 'about29' | 'about30' | 'about31' | 'about32' | 'about33' | 'about34' | 'about35' | 'about36' | 'about37'
  | 'about38' | 'about39' | 'about40' | 'about41' | 'about42' | 'about43' | 'about44' | 'about45' | 'about46' | 'about47'
  | 'about48' | 'about49' | 'about50' | 'about51' | 'about52' | 'about53' | 'about54' | 'about55' | 'about56' | 'about57'
  | 'about58' | 'about59' | 'about60' | 'about61' | 'about62' | 'about63' | 'about64' | 'about65' | 'about66' | 'about67'
  | 'about68' | 'about69' | 'about70' | 'about71' | 'about72' | 'about73' | 'about74' | 'about75' | 'about76' | 'about77'
  | 'about78' | 'about79' | 'about80' | 'about81' | 'about82' | 'about83' | 'about84' | 'about85' | 'about86' | 'about87'
  | 'about88' | 'about89' | 'about90' | 'about91' | 'about92' | 'about93' | 'about94' | 'about95' | 'about96' | 'about97'
  | 'about98' | 'about99' | 'about100';

export type ProductsBlock =
  | 'products1'  // Grid (default)
  | 'products2'  // Grid Hover
  | 'products3'  // Masonry
  | 'products4'  // Carousel
  | 'products5'  // Catalog
  | 'products6'  // Minimal List
  | 'products7'  // Featured Hero
  | 'products8' | 'products9' | 'products10' | 'products11' | 'products12' | 'products13' | 'products14' | 'products15' | 'products16' | 'products17'
  | 'products18' | 'products19' | 'products20' | 'products21' | 'products22' | 'products23' | 'products24' | 'products25' | 'products26' | 'products27'
  | 'products28' | 'products29' | 'products30' | 'products31' | 'products32' | 'products33' | 'products34' | 'products35' | 'products36' | 'products37'
  | 'products38' | 'products39' | 'products40' | 'products41' | 'products42' | 'products43' | 'products44' | 'products45' | 'products46' | 'products47'
  | 'products48' | 'products49' | 'products50' | 'products51' | 'products52' | 'products53' | 'products54' | 'products55' | 'products56' | 'products57'
  | 'products58' | 'products59' | 'products60' | 'products61' | 'products62' | 'products63' | 'products64' | 'products65' | 'products66' | 'products67'
  | 'products68' | 'products69' | 'products70' | 'products71' | 'products72' | 'products73' | 'products74' | 'products75' | 'products76' | 'products77'
  | 'products78' | 'products79' | 'products80' | 'products81' | 'products82' | 'products83' | 'products84' | 'products85' | 'products86' | 'products87'
  | 'products88' | 'products89' | 'products90' | 'products91' | 'products92' | 'products93' | 'products94' | 'products95' | 'products96' | 'products97'
  | 'products98' | 'products99' | 'products100';

export type TestimonialsBlock =
  | 'testimonials1'  // Grid Cards (default)
  | 'testimonials2'  // Card Slider
  | 'testimonials3'  // Quote Highlight
  | 'testimonials4'  // Single Focus
  | 'testimonials5'  // Video
  | 'testimonials6'  // Social Proof
  | 'testimonials7'  // Marquee
  | 'testimonials8' | 'testimonials9' | 'testimonials10' | 'testimonials11' | 'testimonials12' | 'testimonials13' | 'testimonials14' | 'testimonials15' | 'testimonials16' | 'testimonials17'
  | 'testimonials18' | 'testimonials19' | 'testimonials20' | 'testimonials21' | 'testimonials22' | 'testimonials23' | 'testimonials24' | 'testimonials25' | 'testimonials26' | 'testimonials27'
  | 'testimonials28' | 'testimonials29' | 'testimonials30' | 'testimonials31' | 'testimonials32' | 'testimonials33' | 'testimonials34' | 'testimonials35' | 'testimonials36' | 'testimonials37'
  | 'testimonials38' | 'testimonials39' | 'testimonials40' | 'testimonials41' | 'testimonials42' | 'testimonials43' | 'testimonials44' | 'testimonials45' | 'testimonials46' | 'testimonials47'
  | 'testimonials48' | 'testimonials49' | 'testimonials50' | 'testimonials51' | 'testimonials52' | 'testimonials53' | 'testimonials54' | 'testimonials55' | 'testimonials56' | 'testimonials57'
  | 'testimonials58' | 'testimonials59' | 'testimonials60' | 'testimonials61' | 'testimonials62' | 'testimonials63' | 'testimonials64' | 'testimonials65' | 'testimonials66' | 'testimonials67'
  | 'testimonials68' | 'testimonials69' | 'testimonials70' | 'testimonials71' | 'testimonials72' | 'testimonials73' | 'testimonials74' | 'testimonials75' | 'testimonials76' | 'testimonials77'
  | 'testimonials78' | 'testimonials79' | 'testimonials80' | 'testimonials81' | 'testimonials82' | 'testimonials83' | 'testimonials84' | 'testimonials85' | 'testimonials86' | 'testimonials87'
  | 'testimonials88' | 'testimonials89' | 'testimonials90' | 'testimonials91' | 'testimonials92' | 'testimonials93' | 'testimonials94' | 'testimonials95' | 'testimonials96' | 'testimonials97'
  | 'testimonials98' | 'testimonials99' | 'testimonials100';

export type ContactBlock =
  | 'contact1'  // Default
  | 'contact2'  // Split Form
  | 'contact3'  // Centered
  | 'contact4'  // Map Focus
  | 'contact5'  // Minimal
  | 'contact6'  // Social Focused
  | 'contact7'  // Card Grid
  | 'contact8' | 'contact9' | 'contact10' | 'contact11' | 'contact12' | 'contact13' | 'contact14' | 'contact15' | 'contact16' | 'contact17'
  | 'contact18' | 'contact19' | 'contact20' | 'contact21' | 'contact22' | 'contact23' | 'contact24' | 'contact25' | 'contact26' | 'contact27'
  | 'contact28' | 'contact29' | 'contact30' | 'contact31' | 'contact32' | 'contact33' | 'contact34' | 'contact35' | 'contact36' | 'contact37'
  | 'contact38' | 'contact39' | 'contact40' | 'contact41' | 'contact42' | 'contact43' | 'contact44' | 'contact45' | 'contact46' | 'contact47'
  | 'contact48' | 'contact49' | 'contact50' | 'contact51' | 'contact52' | 'contact53' | 'contact54' | 'contact55' | 'contact56' | 'contact57'
  | 'contact58' | 'contact59' | 'contact60' | 'contact61' | 'contact62' | 'contact63' | 'contact64' | 'contact65' | 'contact66' | 'contact67'
  | 'contact68' | 'contact69' | 'contact70' | 'contact71' | 'contact72' | 'contact73' | 'contact74' | 'contact75' | 'contact76' | 'contact77'
  | 'contact78' | 'contact79' | 'contact80' | 'contact81' | 'contact82' | 'contact83' | 'contact84' | 'contact85' | 'contact86' | 'contact87'
  | 'contact88' | 'contact89' | 'contact90' | 'contact91' | 'contact92' | 'contact93' | 'contact94' | 'contact95' | 'contact96' | 'contact97'
  | 'contact98' | 'contact99' | 'contact100';

export type CtaBlock =
  | 'cta1'  // Default
  | 'cta2'  // Bold Center
  | 'cta3'  // Gradient Banner
  | 'cta4'  // Split Action
  | 'cta5'  // Floating
  | 'cta6'  // Minimal Line
  | 'cta7'  // Countdown
  | 'cta8' | 'cta9' | 'cta10' | 'cta11' | 'cta12' | 'cta13' | 'cta14' | 'cta15' | 'cta16' | 'cta17'
  | 'cta18' | 'cta19' | 'cta20' | 'cta21' | 'cta22' | 'cta23' | 'cta24' | 'cta25' | 'cta26' | 'cta27'
  | 'cta28' | 'cta29' | 'cta30' | 'cta31' | 'cta32' | 'cta33' | 'cta34' | 'cta35' | 'cta36' | 'cta37'
  | 'cta38' | 'cta39' | 'cta40' | 'cta41' | 'cta42' | 'cta43' | 'cta44' | 'cta45' | 'cta46' | 'cta47'
  | 'cta48' | 'cta49' | 'cta50' | 'cta51' | 'cta52' | 'cta53' | 'cta54' | 'cta55' | 'cta56' | 'cta57'
  | 'cta58' | 'cta59' | 'cta60' | 'cta61' | 'cta62' | 'cta63' | 'cta64' | 'cta65' | 'cta66' | 'cta67'
  | 'cta68' | 'cta69' | 'cta70' | 'cta71' | 'cta72' | 'cta73' | 'cta74' | 'cta75' | 'cta76' | 'cta77'
  | 'cta78' | 'cta79' | 'cta80' | 'cta81' | 'cta82' | 'cta83' | 'cta84' | 'cta85' | 'cta86' | 'cta87'
  | 'cta88' | 'cta89' | 'cta90' | 'cta91' | 'cta92' | 'cta93' | 'cta94' | 'cta95' | 'cta96' | 'cta97'
  | 'cta98' | 'cta99' | 'cta100';

// ==========================================
// CONFIG INTERFACES (Updated with block)
// ==========================================

export interface HeroConfig {
  layout?: 'centered' | 'left' | 'right';
  showCta?: boolean;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
  overlayOpacity?: number;
}

export interface AboutConfig {
  content?: string;
  showImage?: boolean;
  image?: string;
  features?: FeatureItem[];
}

export interface ProductsConfig {
  displayMode?: 'featured' | 'latest' | 'all';
  limit?: number;
  showViewAll?: boolean;
}

export interface TestimonialsConfig {
  items?: TestimonialItem[];
}

export interface ContactConfig {
  showMap?: boolean;
  showForm?: boolean;
  showSocialMedia?: boolean;
}

export interface CtaConfig {
  buttonText?: string;
  buttonLink?: string;
  style?: 'primary' | 'secondary' | 'outline';
}

// ==========================================
// 🚀 UPDATED: Landing Section with Block
// ==========================================

export interface LandingSection<T = Record<string, unknown>, V = string> {
  enabled?: boolean;
  title?: string;
  subtitle?: string;
  block?: V; // 🚀 Block field (renamed from variant)
  config?: T;
}

// ==========================================
// 🚀 UPDATED: Landing Config with Template
// ==========================================

export interface LandingConfig {
  [key: string]: unknown;
  enabled?: boolean;
  template?: TemplateId; // 🚀 NEW: Template ID
  templateId?: string; // Legacy support
  hero?: LandingSection<HeroConfig, HeroBlock>;
  about?: LandingSection<AboutConfig, AboutBlock>;
  products?: LandingSection<ProductsConfig, ProductsBlock>;
  testimonials?: LandingSection<TestimonialsConfig, TestimonialsBlock>;
  contact?: LandingSection<ContactConfig, ContactBlock>;
  cta?: LandingSection<CtaConfig, CtaBlock>;
}

export interface ValidationResult {
  valid: boolean;
  data?: LandingConfig;
  errors?: string[];
  warnings?: string[];
}

// ==========================================
// JSON SCHEMA DEFINITIONS
// ==========================================

const testimonialItemSchema = {
  type: 'object' as const,
  required: ['id', 'name', 'content'],
  properties: {
    id: { type: 'string' as const, minLength: 1, maxLength: 100 },
    name: { type: 'string' as const, minLength: 1, maxLength: 100 },
    role: { type: 'string' as const, maxLength: 100 },
    avatar: { type: 'string' as const, maxLength: 500 },
    content: { type: 'string' as const, minLength: 1, maxLength: 1000 },
    rating: { type: 'integer' as const, minimum: 1, maximum: 5 },
  },
  additionalProperties: true,
};

const featureItemSchema = {
  type: 'object' as const,
  required: ['title', 'description'],
  properties: {
    icon: { type: 'string' as const, maxLength: 50 },
    title: { type: 'string' as const, minLength: 1, maxLength: 100 },
    description: { type: 'string' as const, minLength: 1, maxLength: 500 },
  },
  additionalProperties: true,
};

// ==========================================
// 🚀 UPDATED: Schema with template & blocks
// ==========================================

const landingConfigSchema = {
  type: 'object' as const,
  properties: {
    enabled: { type: 'boolean' as const },
    templateId: { type: 'string' as const, maxLength: 50 },

    // 🚀 NEW: Template field
    template: {
      type: 'string' as const,
      maxLength: 50,
      enum: [
        'suspended-minimalist',
        'modern-starter',
        'bold-starter',
        'classic-starter',
        'brand-starter',
        'catalog-starter',
        'fresh-starter',
        'elegant-starter',
        'dynamic-starter',
        'professional-starter',
        'custom',
      ],
    },

    // 🚀 UPDATED: Hero with block
    hero: {
      type: 'object' as const,
      properties: {
        enabled: { type: 'boolean' as const },
        title: { type: 'string' as const, maxLength: 200 },
        subtitle: { type: 'string' as const, maxLength: 500 },
        // 🚀 Block field (v3.0 numbering)
        block: {
          type: 'string' as const,
          maxLength: 50,
          enum: [
            'hero1', 'hero2', 'hero3', 'hero4', 'hero5', 'hero6', 'hero7',
            'hero8', 'hero9', 'hero10', 'hero11', 'hero12', 'hero13', 'hero14', 'hero15', 'hero16', 'hero17',
            'hero18', 'hero19', 'hero20', 'hero21', 'hero22', 'hero23', 'hero24', 'hero25', 'hero26', 'hero27',
            'hero28', 'hero29', 'hero30', 'hero31', 'hero32', 'hero33', 'hero34', 'hero35', 'hero36', 'hero37',
            'hero38', 'hero39', 'hero40', 'hero41', 'hero42', 'hero43', 'hero44', 'hero45', 'hero46', 'hero47',
            'hero48', 'hero49', 'hero50', 'hero51', 'hero52', 'hero53', 'hero54', 'hero55', 'hero56', 'hero57',
            'hero58', 'hero59', 'hero60', 'hero61', 'hero62', 'hero63', 'hero64', 'hero65', 'hero66', 'hero67',
            'hero68', 'hero69', 'hero70', 'hero71', 'hero72', 'hero73', 'hero74', 'hero75', 'hero76', 'hero77',
            'hero78', 'hero79', 'hero80', 'hero81', 'hero82', 'hero83', 'hero84', 'hero85', 'hero86', 'hero87',
            'hero88', 'hero89', 'hero90', 'hero91', 'hero92', 'hero93', 'hero94', 'hero95', 'hero96', 'hero97',
            'hero98', 'hero99', 'hero100'
          ],
        },
        config: {
          type: 'object' as const,
          properties: {
            layout: {
              type: 'string' as const,
              enum: ['centered', 'left', 'right'],
            },
            showCta: { type: 'boolean' as const },
            ctaText: { type: 'string' as const, maxLength: 50 },
            ctaLink: { type: 'string' as const, maxLength: 200 },
            backgroundImage: { type: 'string' as const, maxLength: 500 },
            overlayOpacity: { type: 'number' as const, minimum: 0, maximum: 1 },
          },
          additionalProperties: true,
        },
      },
      additionalProperties: true,
    },

    // 🚀 UPDATED: About with block
    about: {
      type: 'object' as const,
      properties: {
        enabled: { type: 'boolean' as const },
        title: { type: 'string' as const, maxLength: 200 },
        subtitle: { type: 'string' as const, maxLength: 500 },
        // 🚀 Block field (v3.0 numbering)
        block: {
          type: 'string' as const,
          maxLength: 50,
          enum: [
            'about1', 'about2', 'about3', 'about4', 'about5', 'about6', 'about7',
            'about8', 'about9', 'about10', 'about11', 'about12', 'about13', 'about14', 'about15', 'about16', 'about17',
            'about18', 'about19', 'about20', 'about21', 'about22', 'about23', 'about24', 'about25', 'about26', 'about27',
            'about28', 'about29', 'about30', 'about31', 'about32', 'about33', 'about34', 'about35', 'about36', 'about37',
            'about38', 'about39', 'about40', 'about41', 'about42', 'about43', 'about44', 'about45', 'about46', 'about47',
            'about48', 'about49', 'about50', 'about51', 'about52', 'about53', 'about54', 'about55', 'about56', 'about57',
            'about58', 'about59', 'about60', 'about61', 'about62', 'about63', 'about64', 'about65', 'about66', 'about67',
            'about68', 'about69', 'about70', 'about71', 'about72', 'about73', 'about74', 'about75', 'about76', 'about77',
            'about78', 'about79', 'about80', 'about81', 'about82', 'about83', 'about84', 'about85', 'about86', 'about87',
            'about88', 'about89', 'about90', 'about91', 'about92', 'about93', 'about94', 'about95', 'about96', 'about97',
            'about98', 'about99', 'about100'
          ],
        },
        config: {
          type: 'object' as const,
          properties: {
            content: { type: 'string' as const, maxLength: 2000 },
            showImage: { type: 'boolean' as const },
            image: { type: 'string' as const, maxLength: 500 },
            features: {
              type: 'array' as const,
              maxItems: 10,
              items: featureItemSchema,
            },
          },
          additionalProperties: true,
        },
      },
      additionalProperties: true,
    },

    // 🚀 UPDATED: Products with block
    products: {
      type: 'object' as const,
      properties: {
        enabled: { type: 'boolean' as const },
        title: { type: 'string' as const, maxLength: 200 },
        subtitle: { type: 'string' as const, maxLength: 500 },
        // 🚀 Block field (v3.0 numbering)
        block: {
          type: 'string' as const,
          maxLength: 50,
          enum: [
            'products1', 'products2', 'products3', 'products4', 'products5', 'products6', 'products7',
            'products8', 'products9', 'products10', 'products11', 'products12', 'products13', 'products14', 'products15', 'products16', 'products17',
            'products18', 'products19', 'products20', 'products21', 'products22', 'products23', 'products24', 'products25', 'products26', 'products27',
            'products28', 'products29', 'products30', 'products31', 'products32', 'products33', 'products34', 'products35', 'products36', 'products37',
            'products38', 'products39', 'products40', 'products41', 'products42', 'products43', 'products44', 'products45', 'products46', 'products47',
            'products48', 'products49', 'products50', 'products51', 'products52', 'products53', 'products54', 'products55', 'products56', 'products57',
            'products58', 'products59', 'products60', 'products61', 'products62', 'products63', 'products64', 'products65', 'products66', 'products67',
            'products68', 'products69', 'products70', 'products71', 'products72', 'products73', 'products74', 'products75', 'products76', 'products77',
            'products78', 'products79', 'products80', 'products81', 'products82', 'products83', 'products84', 'products85', 'products86', 'products87',
            'products88', 'products89', 'products90', 'products91', 'products92', 'products93', 'products94', 'products95', 'products96', 'products97',
            'products98', 'products99', 'products100'
          ],
        },
        config: {
          type: 'object' as const,
          properties: {
            displayMode: {
              type: 'string' as const,
              enum: ['featured', 'latest', 'all'],
            },
            limit: { type: 'integer' as const, minimum: 1, maximum: 50 },
            showViewAll: { type: 'boolean' as const },
          },
          additionalProperties: true,
        },
      },
      additionalProperties: true,
    },

    // 🚀 UPDATED: Testimonials with block
    testimonials: {
      type: 'object' as const,
      properties: {
        enabled: { type: 'boolean' as const },
        title: { type: 'string' as const, maxLength: 200 },
        subtitle: { type: 'string' as const, maxLength: 500 },
        // 🚀 Block field (v3.0 numbering)
        block: {
          type: 'string' as const,
          maxLength: 50,
          enum: [
            'testimonials1', 'testimonials2', 'testimonials3', 'testimonials4', 'testimonials5', 'testimonials6', 'testimonials7',
            'testimonials8', 'testimonials9', 'testimonials10', 'testimonials11', 'testimonials12', 'testimonials13', 'testimonials14', 'testimonials15', 'testimonials16', 'testimonials17',
            'testimonials18', 'testimonials19', 'testimonials20', 'testimonials21', 'testimonials22', 'testimonials23', 'testimonials24', 'testimonials25', 'testimonials26', 'testimonials27',
            'testimonials28', 'testimonials29', 'testimonials30', 'testimonials31', 'testimonials32', 'testimonials33', 'testimonials34', 'testimonials35', 'testimonials36', 'testimonials37',
            'testimonials38', 'testimonials39', 'testimonials40', 'testimonials41', 'testimonials42', 'testimonials43', 'testimonials44', 'testimonials45', 'testimonials46', 'testimonials47',
            'testimonials48', 'testimonials49', 'testimonials50', 'testimonials51', 'testimonials52', 'testimonials53', 'testimonials54', 'testimonials55', 'testimonials56', 'testimonials57',
            'testimonials58', 'testimonials59', 'testimonials60', 'testimonials61', 'testimonials62', 'testimonials63', 'testimonials64', 'testimonials65', 'testimonials66', 'testimonials67',
            'testimonials68', 'testimonials69', 'testimonials70', 'testimonials71', 'testimonials72', 'testimonials73', 'testimonials74', 'testimonials75', 'testimonials76', 'testimonials77',
            'testimonials78', 'testimonials79', 'testimonials80', 'testimonials81', 'testimonials82', 'testimonials83', 'testimonials84', 'testimonials85', 'testimonials86', 'testimonials87',
            'testimonials88', 'testimonials89', 'testimonials90', 'testimonials91', 'testimonials92', 'testimonials93', 'testimonials94', 'testimonials95', 'testimonials96', 'testimonials97',
            'testimonials98', 'testimonials99', 'testimonials100'
          ],
        },
        config: {
          type: 'object' as const,
          properties: {
            items: {
              type: 'array' as const,
              maxItems: 50,
              items: testimonialItemSchema,
            },
          },
          additionalProperties: true,
        },
      },
      additionalProperties: true,
    },

    // 🚀 UPDATED: Contact with block
    contact: {
      type: 'object' as const,
      properties: {
        enabled: { type: 'boolean' as const },
        title: { type: 'string' as const, maxLength: 200 },
        subtitle: { type: 'string' as const, maxLength: 500 },
        // 🚀 Block field (v3.0 numbering)
        block: {
          type: 'string' as const,
          maxLength: 50,
          enum: [
            'contact1', 'contact2', 'contact3', 'contact4', 'contact5', 'contact6', 'contact7',
            'contact8', 'contact9', 'contact10', 'contact11', 'contact12', 'contact13', 'contact14', 'contact15', 'contact16', 'contact17',
            'contact18', 'contact19', 'contact20', 'contact21', 'contact22', 'contact23', 'contact24', 'contact25', 'contact26', 'contact27',
            'contact28', 'contact29', 'contact30', 'contact31', 'contact32', 'contact33', 'contact34', 'contact35', 'contact36', 'contact37',
            'contact38', 'contact39', 'contact40', 'contact41', 'contact42', 'contact43', 'contact44', 'contact45', 'contact46', 'contact47',
            'contact48', 'contact49', 'contact50', 'contact51', 'contact52', 'contact53', 'contact54', 'contact55', 'contact56', 'contact57',
            'contact58', 'contact59', 'contact60', 'contact61', 'contact62', 'contact63', 'contact64', 'contact65', 'contact66', 'contact67',
            'contact68', 'contact69', 'contact70', 'contact71', 'contact72', 'contact73', 'contact74', 'contact75', 'contact76', 'contact77',
            'contact78', 'contact79', 'contact80', 'contact81', 'contact82', 'contact83', 'contact84', 'contact85', 'contact86', 'contact87',
            'contact88', 'contact89', 'contact90', 'contact91', 'contact92', 'contact93', 'contact94', 'contact95', 'contact96', 'contact97',
            'contact98', 'contact99', 'contact100'
          ],
        },
        config: {
          type: 'object' as const,
          properties: {
            showMap: { type: 'boolean' as const },
            showForm: { type: 'boolean' as const },
            showSocialMedia: { type: 'boolean' as const },
          },
          additionalProperties: true,
        },
      },
      additionalProperties: true,
    },

    // 🚀 UPDATED: CTA with block
    cta: {
      type: 'object' as const,
      properties: {
        enabled: { type: 'boolean' as const },
        title: { type: 'string' as const, maxLength: 200 },
        subtitle: { type: 'string' as const, maxLength: 500 },
        // 🚀 Block field (v3.0 numbering)
        block: {
          type: 'string' as const,
          maxLength: 50,
          enum: [
            'cta1', 'cta2', 'cta3', 'cta4', 'cta5', 'cta6', 'cta7',
            'cta8', 'cta9', 'cta10', 'cta11', 'cta12', 'cta13', 'cta14', 'cta15', 'cta16', 'cta17',
            'cta18', 'cta19', 'cta20', 'cta21', 'cta22', 'cta23', 'cta24', 'cta25', 'cta26', 'cta27',
            'cta28', 'cta29', 'cta30', 'cta31', 'cta32', 'cta33', 'cta34', 'cta35', 'cta36', 'cta37',
            'cta38', 'cta39', 'cta40', 'cta41', 'cta42', 'cta43', 'cta44', 'cta45', 'cta46', 'cta47',
            'cta48', 'cta49', 'cta50', 'cta51', 'cta52', 'cta53', 'cta54', 'cta55', 'cta56', 'cta57',
            'cta58', 'cta59', 'cta60', 'cta61', 'cta62', 'cta63', 'cta64', 'cta65', 'cta66', 'cta67',
            'cta68', 'cta69', 'cta70', 'cta71', 'cta72', 'cta73', 'cta74', 'cta75', 'cta76', 'cta77',
            'cta78', 'cta79', 'cta80', 'cta81', 'cta82', 'cta83', 'cta84', 'cta85', 'cta86', 'cta87',
            'cta88', 'cta89', 'cta90', 'cta91', 'cta92', 'cta93', 'cta94', 'cta95', 'cta96', 'cta97',
            'cta98', 'cta99', 'cta100'
          ],
        },
        config: {
          type: 'object' as const,
          properties: {
            buttonText: { type: 'string' as const, maxLength: 50 },
            buttonLink: { type: 'string' as const, maxLength: 200 },
            style: {
              type: 'string' as const,
              enum: ['primary', 'secondary', 'outline'],
            },
          },
          additionalProperties: true,
        },
      },
      additionalProperties: true,
    },
  },
  additionalProperties: true,
};

// ==========================================
// AJV INSTANCE
// ==========================================

const ajv = new Ajv({
  allErrors: true,
  removeAdditional: false, // 🔥 FIX: Don't strip additional fields (like block)!
  useDefaults: true,
  coerceTypes: false,
});

addFormats(ajv);

const validateSchema = ajv.compile(landingConfigSchema);

// ==========================================
// SANITIZATION FUNCTIONS
// ==========================================

function flattenNestedArrays<T>(arr: unknown): T[] {
  if (!arr) return [];

  let items = arr;

  while (Array.isArray(items) && items.length > 0 && Array.isArray(items[0])) {
    items = items.flat();
  }

  if (!Array.isArray(items)) return [];

  return items as T[];
}

function deduplicateById<T extends { id: string }>(
  items: T[],
  warningCallback?: (id: string) => void,
): T[] {
  const seen = new Set<string>();
  const unique: T[] = [];

  for (const item of items) {
    if (!item?.id) continue;

    if (seen.has(item.id)) {
      warningCallback?.(item.id);
      continue;
    }

    seen.add(item.id);
    unique.push(item);
  }

  return unique;
}

function ensureTestimonialIds(items: TestimonialItem[]): TestimonialItem[] {
  return items.map((item, index) => ({
    ...item,
    id:
      item.id ||
      `testi_${Date.now()}_${index}_${Math.random().toString(36).substring(2, 7)}`,
  }));
}

function sanitizeTestimonials(
  config: TestimonialsConfig | undefined,
  warningsList: string[],
): TestimonialsConfig {
  if (!config) return { items: [] };

  let items = config.items;

  items = flattenNestedArrays<TestimonialItem>(items);

  items = items.filter(
    (item): item is TestimonialItem =>
      item &&
      typeof item === 'object' &&
      typeof item.name === 'string' &&
      item.name.trim() !== '' &&
      typeof item.content === 'string' &&
      item.content.trim() !== '',
  );

  items = ensureTestimonialIds(items);

  items = deduplicateById(items, (id) => {
    warningsList.push(`Duplicate testimonial ID removed: ${id}`);
  });

  return { items };
}

function sanitizeFeatures(
  features: FeatureItem[] | undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _warningsList: string[],
): FeatureItem[] {
  if (!features) return [];

  let items = flattenNestedArrays<FeatureItem>(features);

  items = items.filter(
    (item): item is FeatureItem =>
      item &&
      typeof item === 'object' &&
      typeof item.title === 'string' &&
      item.title.trim() !== '' &&
      typeof item.description === 'string' &&
      item.description.trim() !== '',
  );

  return items;
}

// ==========================================
// MAIN VALIDATION FUNCTION
// ==========================================

export function validateAndSanitizeLandingConfig(
  data: unknown,
): ValidationResult {
  const warnings: string[] = [];

  if (data === null || data === undefined) {
    return {
      valid: true,
      data: undefined,
      warnings: [],
    };
  }

  if (typeof data !== 'object' || Array.isArray(data)) {
    return {
      valid: false,
      errors: ['landingConfig must be an object'],
    };
  }

  let config: LandingConfig;
  try {
    config = JSON.parse(JSON.stringify(data)) as LandingConfig;
  } catch {
    return {
      valid: false,
      errors: ['landingConfig contains invalid JSON'],
    };
  }

  if (config.testimonials?.config) {
    config.testimonials.config = sanitizeTestimonials(
      config.testimonials.config,
      warnings,
    );
  }

  if (config.about?.config?.features) {
    config.about.config.features = sanitizeFeatures(
      config.about.config.features,
      warnings,
    );
  }

  const valid = validateSchema(config);

  if (!valid) {
    const errors = (validateSchema.errors || []).map((err: ErrorObject) => {
      const path = err.instancePath || '/';
      const message = err.message || 'unknown error';
      return `${path}: ${message}`;
    });

    return {
      valid: false,
      errors,
      warnings,
    };
  }

  // Trim string fields
  if (config.hero?.title) config.hero.title = config.hero.title.trim();
  if (config.hero?.subtitle) config.hero.subtitle = config.hero.subtitle.trim();
  if (config.about?.title) config.about.title = config.about.title.trim();
  if (config.about?.subtitle)
    config.about.subtitle = config.about.subtitle.trim();
  if (config.about?.config?.content) {
    config.about.config.content = config.about.config.content.trim();
  }

  config.enabled = config.enabled ?? false;

  return {
    valid: true,
    data: config,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

// ==========================================
// UTILITY EXPORTS
// ==========================================

export function isValidLandingConfig(data: unknown): boolean {
  if (data === null || data === undefined) return true;
  if (typeof data !== 'object' || Array.isArray(data)) return false;

  try {
    const clone = JSON.parse(JSON.stringify(data));
    return validateSchema(clone);
  } catch {
    return false;
  }
}

export function getLandingConfigErrors(data: unknown): string[] {
  if (data === null || data === undefined) return [];
  if (typeof data !== 'object' || Array.isArray(data)) {
    return ['landingConfig must be an object'];
  }

  try {
    const clone = JSON.parse(JSON.stringify(data));
    validateSchema(clone);

    return (validateSchema.errors || []).map((err: ErrorObject) => {
      const path = err.instancePath || '/';
      const message = err.message || 'unknown error';
      return `${path}: ${message}`;
    });
  } catch {
    return ['landingConfig contains invalid JSON'];
  }
}

// ==========================================
// 🚀 NEW: Template Helper Functions
// ==========================================

export function isValidTemplate(template: string): template is TemplateId {
  const validTemplates: TemplateId[] = [
    'suspended-minimalist',
    'modern-starter',
    'bold-starter',
    'classic-starter',
    'brand-starter',
    'catalog-starter',
    'fresh-starter',
    'elegant-starter',
    'dynamic-starter',
    'professional-starter',
    'custom',
  ];
  return validTemplates.includes(template as TemplateId);
}

export function isValidHeroBlock(block: string): block is HeroBlock {
  const validBlocks: HeroBlock[] = [
    'hero1', 'hero2', 'hero3', 'hero4', 'hero5', 'hero6', 'hero7',
    'hero8', 'hero9', 'hero10', 'hero11', 'hero12', 'hero13', 'hero14', 'hero15', 'hero16', 'hero17',
    'hero18', 'hero19', 'hero20', 'hero21', 'hero22', 'hero23', 'hero24', 'hero25', 'hero26', 'hero27',
    'hero28', 'hero29', 'hero30', 'hero31', 'hero32', 'hero33', 'hero34', 'hero35', 'hero36', 'hero37',
    'hero38', 'hero39', 'hero40', 'hero41', 'hero42', 'hero43', 'hero44', 'hero45', 'hero46', 'hero47',
    'hero48', 'hero49', 'hero50', 'hero51', 'hero52', 'hero53', 'hero54', 'hero55', 'hero56', 'hero57',
    'hero58', 'hero59', 'hero60', 'hero61', 'hero62', 'hero63', 'hero64', 'hero65', 'hero66', 'hero67',
    'hero68', 'hero69', 'hero70', 'hero71', 'hero72', 'hero73', 'hero74', 'hero75', 'hero76', 'hero77',
    'hero78', 'hero79', 'hero80', 'hero81', 'hero82', 'hero83', 'hero84', 'hero85', 'hero86', 'hero87',
    'hero88', 'hero89', 'hero90', 'hero91', 'hero92', 'hero93', 'hero94', 'hero95', 'hero96', 'hero97',
    'hero98', 'hero99', 'hero100'
  ];
  return validBlocks.includes(block as HeroBlock);
}

// ==========================================
// 🚀 UPDATED: Default Config with Template
// ==========================================

export function getDefaultLandingConfig(): LandingConfig {
  return {
    enabled: false,
    template: 'suspended-minimalist', // 🚀 Default template
    hero: {
      enabled: false,
      title: '',
      subtitle: '',
      block: 'hero1', // 🚀 v3.0 Default block
      config: {
        layout: 'centered',
        showCta: false,
        ctaText: 'Lihat Produk',
        overlayOpacity: 0.5,
      },
    },
    about: {
      enabled: false,
      title: 'Tentang Kami',
      subtitle: '',
      block: 'about1', // 🚀 v3.0 Default block
      config: {
        showImage: false,
        features: [],
      },
    },
    products: {
      enabled: false,
      title: 'Produk Kami',
      subtitle: 'Pilihan produk terbaik untuk Anda',
      block: 'products1', // 🚀 v3.0 Default block
      config: {
        displayMode: 'featured',
        limit: 8,
        showViewAll: false,
      },
    },
    testimonials: {
      enabled: false,
      title: 'Testimoni',
      subtitle: 'Apa kata pelanggan kami',
      block: 'testimonials1', // 🚀 v3.0 Default block
      config: {
        items: [],
      },
    },
    contact: {
      enabled: false,
      title: 'Hubungi Kami',
      subtitle: '',
      block: 'contact1', // 🚀 v3.0 Default block
      config: {
        showMap: false,
        showForm: false,
        showSocialMedia: false,
      },
    },
    cta: {
      enabled: false,
      title: 'Siap Berbelanja?',
      subtitle: '',
      block: 'cta1', // 🚀 v3.0 Default block
      config: {
        buttonText: 'Mulai Belanja',
        style: 'primary',
      },
    },
  };
}

// ==========================================
// 🚀 Available Templates & Blocks Export
// For Frontend to consume
// ==========================================

export const AVAILABLE_TEMPLATES: TemplateId[] = [
  'suspended-minimalist',
  'modern-starter',
  'bold-starter',
  'classic-starter',
  'brand-starter',
  'catalog-starter',
  'fresh-starter',
  'elegant-starter',
  'dynamic-starter',
  'professional-starter',
  'custom',
];

export const AVAILABLE_BLOCKS = {
  hero: [
    'hero1', 'hero2', 'hero3', 'hero4', 'hero5', 'hero6', 'hero7',
    'hero8', 'hero9', 'hero10', 'hero11', 'hero12', 'hero13', 'hero14', 'hero15', 'hero16', 'hero17',
    'hero18', 'hero19', 'hero20', 'hero21', 'hero22', 'hero23', 'hero24', 'hero25', 'hero26', 'hero27',
    'hero28', 'hero29', 'hero30', 'hero31', 'hero32', 'hero33', 'hero34', 'hero35', 'hero36', 'hero37',
    'hero38', 'hero39', 'hero40', 'hero41', 'hero42', 'hero43', 'hero44', 'hero45', 'hero46', 'hero47',
    'hero48', 'hero49', 'hero50', 'hero51', 'hero52', 'hero53', 'hero54', 'hero55', 'hero56', 'hero57',
    'hero58', 'hero59', 'hero60', 'hero61', 'hero62', 'hero63', 'hero64', 'hero65', 'hero66', 'hero67',
    'hero68', 'hero69', 'hero70', 'hero71', 'hero72', 'hero73', 'hero74', 'hero75', 'hero76', 'hero77',
    'hero78', 'hero79', 'hero80', 'hero81', 'hero82', 'hero83', 'hero84', 'hero85', 'hero86', 'hero87',
    'hero88', 'hero89', 'hero90', 'hero91', 'hero92', 'hero93', 'hero94', 'hero95', 'hero96', 'hero97',
    'hero98', 'hero99', 'hero100'
  ] as HeroBlock[],
  about: [
    'about1', 'about2', 'about3', 'about4', 'about5', 'about6', 'about7',
    'about8', 'about9', 'about10', 'about11', 'about12', 'about13', 'about14', 'about15', 'about16', 'about17',
    'about18', 'about19', 'about20', 'about21', 'about22', 'about23', 'about24', 'about25', 'about26', 'about27',
    'about28', 'about29', 'about30', 'about31', 'about32', 'about33', 'about34', 'about35', 'about36', 'about37',
    'about38', 'about39', 'about40', 'about41', 'about42', 'about43', 'about44', 'about45', 'about46', 'about47',
    'about48', 'about49', 'about50', 'about51', 'about52', 'about53', 'about54', 'about55', 'about56', 'about57',
    'about58', 'about59', 'about60', 'about61', 'about62', 'about63', 'about64', 'about65', 'about66', 'about67',
    'about68', 'about69', 'about70', 'about71', 'about72', 'about73', 'about74', 'about75', 'about76', 'about77',
    'about78', 'about79', 'about80', 'about81', 'about82', 'about83', 'about84', 'about85', 'about86', 'about87',
    'about88', 'about89', 'about90', 'about91', 'about92', 'about93', 'about94', 'about95', 'about96', 'about97',
    'about98', 'about99', 'about100'
  ] as AboutBlock[],
  products: [
    'products1', 'products2', 'products3', 'products4', 'products5', 'products6', 'products7',
    'products8', 'products9', 'products10', 'products11', 'products12', 'products13', 'products14', 'products15', 'products16', 'products17',
    'products18', 'products19', 'products20', 'products21', 'products22', 'products23', 'products24', 'products25', 'products26', 'products27',
    'products28', 'products29', 'products30', 'products31', 'products32', 'products33', 'products34', 'products35', 'products36', 'products37',
    'products38', 'products39', 'products40', 'products41', 'products42', 'products43', 'products44', 'products45', 'products46', 'products47',
    'products48', 'products49', 'products50', 'products51', 'products52', 'products53', 'products54', 'products55', 'products56', 'products57',
    'products58', 'products59', 'products60', 'products61', 'products62', 'products63', 'products64', 'products65', 'products66', 'products67',
    'products68', 'products69', 'products70', 'products71', 'products72', 'products73', 'products74', 'products75', 'products76', 'products77',
    'products78', 'products79', 'products80', 'products81', 'products82', 'products83', 'products84', 'products85', 'products86', 'products87',
    'products88', 'products89', 'products90', 'products91', 'products92', 'products93', 'products94', 'products95', 'products96', 'products97',
    'products98', 'products99', 'products100'
  ] as ProductsBlock[],
  testimonials: [
    'testimonials1', 'testimonials2', 'testimonials3', 'testimonials4', 'testimonials5', 'testimonials6', 'testimonials7',
    'testimonials8', 'testimonials9', 'testimonials10', 'testimonials11', 'testimonials12', 'testimonials13', 'testimonials14', 'testimonials15', 'testimonials16', 'testimonials17',
    'testimonials18', 'testimonials19', 'testimonials20', 'testimonials21', 'testimonials22', 'testimonials23', 'testimonials24', 'testimonials25', 'testimonials26', 'testimonials27',
    'testimonials28', 'testimonials29', 'testimonials30', 'testimonials31', 'testimonials32', 'testimonials33', 'testimonials34', 'testimonials35', 'testimonials36', 'testimonials37',
    'testimonials38', 'testimonials39', 'testimonials40', 'testimonials41', 'testimonials42', 'testimonials43', 'testimonials44', 'testimonials45', 'testimonials46', 'testimonials47',
    'testimonials48', 'testimonials49', 'testimonials50', 'testimonials51', 'testimonials52', 'testimonials53', 'testimonials54', 'testimonials55', 'testimonials56', 'testimonials57',
    'testimonials58', 'testimonials59', 'testimonials60', 'testimonials61', 'testimonials62', 'testimonials63', 'testimonials64', 'testimonials65', 'testimonials66', 'testimonials67',
    'testimonials68', 'testimonials69', 'testimonials70', 'testimonials71', 'testimonials72', 'testimonials73', 'testimonials74', 'testimonials75', 'testimonials76', 'testimonials77',
    'testimonials78', 'testimonials79', 'testimonials80', 'testimonials81', 'testimonials82', 'testimonials83', 'testimonials84', 'testimonials85', 'testimonials86', 'testimonials87',
    'testimonials88', 'testimonials89', 'testimonials90', 'testimonials91', 'testimonials92', 'testimonials93', 'testimonials94', 'testimonials95', 'testimonials96', 'testimonials97',
    'testimonials98', 'testimonials99', 'testimonials100'
  ] as TestimonialsBlock[],
  contact: [
    'contact1', 'contact2', 'contact3', 'contact4', 'contact5', 'contact6', 'contact7',
    'contact8', 'contact9', 'contact10', 'contact11', 'contact12', 'contact13', 'contact14', 'contact15', 'contact16', 'contact17',
    'contact18', 'contact19', 'contact20', 'contact21', 'contact22', 'contact23', 'contact24', 'contact25', 'contact26', 'contact27',
    'contact28', 'contact29', 'contact30', 'contact31', 'contact32', 'contact33', 'contact34', 'contact35', 'contact36', 'contact37',
    'contact38', 'contact39', 'contact40', 'contact41', 'contact42', 'contact43', 'contact44', 'contact45', 'contact46', 'contact47',
    'contact48', 'contact49', 'contact50', 'contact51', 'contact52', 'contact53', 'contact54', 'contact55', 'contact56', 'contact57',
    'contact58', 'contact59', 'contact60', 'contact61', 'contact62', 'contact63', 'contact64', 'contact65', 'contact66', 'contact67',
    'contact68', 'contact69', 'contact70', 'contact71', 'contact72', 'contact73', 'contact74', 'contact75', 'contact76', 'contact77',
    'contact78', 'contact79', 'contact80', 'contact81', 'contact82', 'contact83', 'contact84', 'contact85', 'contact86', 'contact87',
    'contact88', 'contact89', 'contact90', 'contact91', 'contact92', 'contact93', 'contact94', 'contact95', 'contact96', 'contact97',
    'contact98', 'contact99', 'contact100'
  ] as ContactBlock[],
  cta: [
    'cta1', 'cta2', 'cta3', 'cta4', 'cta5', 'cta6', 'cta7',
    'cta8', 'cta9', 'cta10', 'cta11', 'cta12', 'cta13', 'cta14', 'cta15', 'cta16', 'cta17',
    'cta18', 'cta19', 'cta20', 'cta21', 'cta22', 'cta23', 'cta24', 'cta25', 'cta26', 'cta27',
    'cta28', 'cta29', 'cta30', 'cta31', 'cta32', 'cta33', 'cta34', 'cta35', 'cta36', 'cta37',
    'cta38', 'cta39', 'cta40', 'cta41', 'cta42', 'cta43', 'cta44', 'cta45', 'cta46', 'cta47',
    'cta48', 'cta49', 'cta50', 'cta51', 'cta52', 'cta53', 'cta54', 'cta55', 'cta56', 'cta57',
    'cta58', 'cta59', 'cta60', 'cta61', 'cta62', 'cta63', 'cta64', 'cta65', 'cta66', 'cta67',
    'cta68', 'cta69', 'cta70', 'cta71', 'cta72', 'cta73', 'cta74', 'cta75', 'cta76', 'cta77',
    'cta78', 'cta79', 'cta80', 'cta81', 'cta82', 'cta83', 'cta84', 'cta85', 'cta86', 'cta87',
    'cta88', 'cta89', 'cta90', 'cta91', 'cta92', 'cta93', 'cta94', 'cta95', 'cta96', 'cta97',
    'cta98', 'cta99', 'cta100'
  ] as CtaBlock[],
};
