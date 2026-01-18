// ==========================================
// LANDING PAGE TYPE DEFINITIONS
// 🚀 SYNCED WITH BACKEND VALIDATOR
// ==========================================

// ==========================================
// BLOCK TYPES (from backend)
// ==========================================

/**
 * v3.0 NUMBERING SYSTEM
 * See MAPPING.md for design name references
 */

export type HeroBlock =
  | 'hero1'  // Centered (default)
  | 'hero2'  // Split Screen
  | 'hero3'  // Video Background
  | 'hero4'  // Parallax
  | 'hero5'  // Animated Gradient
  | 'hero6'; // Glass Morphism

export type AboutBlock =
  | 'about1'  // Grid (default)
  | 'about2'  // Side by Side
  | 'about3'  // Centered
  | 'about4'  // Timeline
  | 'about5'  // Cards
  | 'about6'  // Magazine
  | 'about7'; // Storytelling

export type ProductsBlock =
  | 'products1'  // Grid (default)
  | 'products2'  // Grid Hover
  | 'products3'  // Masonry
  | 'products4'  // Carousel
  | 'products5'  // Catalog
  | 'products6'; // Minimal List

export type TestimonialsBlock =
  | 'testimonials1'  // Grid Cards (default)
  | 'testimonials2'  // Card Slider
  | 'testimonials3'  // Quote Highlight
  | 'testimonials4'  // Single Focus
  | 'testimonials5'  // Video
  | 'testimonials6'; // Social Proof

export type ContactBlock =
  | 'contact1'  // Default
  | 'contact2'  // Split Form
  | 'contact3'  // Centered
  | 'contact4'  // Map Focus
  | 'contact5'  // Minimal
  | 'contact6'; // Social Focused

export type CtaBlock =
  | 'cta1'  // Default
  | 'cta2'  // Bold Center
  | 'cta3'  // Gradient Banner
  | 'cta4'  // Split Action
  | 'cta5'  // Floating
  | 'cta6'; // Minimal Line

// ==========================================
// TYPE ALIASES (for backward compatibility)
// ==========================================
export type HeroVariant = HeroBlock;
export type AboutVariant = AboutBlock;
export type ProductsVariant = ProductsBlock;
export type TestimonialsVariant = TestimonialsBlock;
export type ContactVariant = ContactBlock;
export type CtaVariant = CtaBlock;

// ==========================================
// SECTION BASE INTERFACE
// ==========================================

export interface LandingSection<V = string> {
  enabled?: boolean;
  title?: string;
  subtitle?: string;
  block?: V;
  config?: Record<string, unknown>;
}

// ==========================================
// SECTION CONFIG INTERFACES
// ==========================================

export interface HeroSectionConfig {
  layout?: 'centered' | 'left' | 'right';
  showCta?: boolean;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
  overlayOpacity?: number;
}

export interface AboutSectionConfig {
  content?: string;
  showImage?: boolean;
  image?: string;
  features?: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
}

export interface ProductsSectionConfig {
  displayMode?: 'featured' | 'latest' | 'all';
  limit?: number;
  showViewAll?: boolean;
}

// ==========================================
// TESTIMONIAL TYPE (EXPORTED FOR REUSE)
// ==========================================
export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
  content: string;
  rating?: number;
}

export interface TestimonialsSectionConfig {
  items?: Testimonial[];
}

export interface ContactSectionConfig {
  showMap?: boolean;
  showForm?: boolean;
  showSocialMedia?: boolean;
}

export interface CtaSectionConfig {
  buttonText?: string;
  buttonLink?: string;
  style?: 'primary' | 'secondary' | 'outline';
}

// ==========================================
// MAIN CONFIG INTERFACE
// ==========================================

export interface TenantLandingConfig {
  enabled: boolean;
  template?: string; // Template ID
  hero?: LandingSection<HeroBlock> & { config?: HeroSectionConfig };
  about?: LandingSection<AboutBlock> & { config?: AboutSectionConfig };
  products?: LandingSection<ProductsBlock> & { config?: ProductsSectionConfig };
  testimonials?: LandingSection<TestimonialsBlock> & { config?: TestimonialsSectionConfig };
  contact?: LandingSection<ContactBlock> & { config?: ContactSectionConfig };
  cta?: LandingSection<CtaBlock> & { config?: CtaSectionConfig };
}

// ==========================================
// DEFAULT CONFIG - Imported from @/lib/landing
// ==========================================
// DEFAULT_LANDING_CONFIG is now defined in @/lib/landing/defaults.ts
// Import it from there to avoid duplication!
//
// Example:
// import { DEFAULT_LANDING_CONFIG } from '@/lib/landing';
// ==========================================
