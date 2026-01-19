# LANDING COMPONENTS - COMPLETE COLLECTION
> Generated on: Mon, Jan 19, 2026 11:42:00 AM
> Working Directory: /d/PRODUK-LPPM-FINAL/UMKM-MULTI-TENANT/app

## SCOPE:
- Landing Page Components (tenant-*.tsx)
- Block Variants (hero, about, products, testimonials, contact, cta)
- Index files & Mapping

---


---

# 📄 ROOT LANDING COMPONENTS


---

## FILE: `src/components/landing/index.ts`
> Lines: 13

```typescript
/**
 * ============================================================================
 * FILE: src/components/landing/index.ts
 * PURPOSE: Public store display components - READ & RENDER landing config
 * ============================================================================
 */

export { TenantHero } from './tenant-hero';
export { TenantAbout } from './tenant-about';
export { TenantProducts } from './tenant-products';
export { TenantTestimonials } from './tenant-testimonials';
export { TenantContact } from './tenant-contact';
export { TenantCta } from './tenant-cta';
```


---

## FILE: `src/components/landing/tenant-hero.tsx`
> Lines: 98

```typescript
'use client';

import { extractSectionText, getHeroConfig, extractBackgroundImage } from '@/lib/landing';
import { LANDING_CONSTANTS, useHeroBlock } from '@/lib/landing';
import {
  Hero1,
  Hero2,
  Hero3,
  Hero4,
  Hero5,
  Hero6,
  Hero7,
} from './blocks';
import type { TenantLandingConfig } from '@/types';

interface TenantHeroProps {
  config?: TenantLandingConfig['hero'];
  fallbacks?: {
    title?: string;
    subtitle?: string;
    backgroundImage?: string;
    logo?: string;
    storeName?: string;
  };
}

/**
 * Tenant Hero Component
 *
 * Wrapper that selects and renders the appropriate hero block
 * based on the current template context
 *
 * 🚀 v3.0 NUMBERING SYSTEM:
 * - hero1 → Centered (default)
 * - hero2 → Split Screen
 * - hero3 → Video Background
 * - hero4 → Parallax
 * - hero5 → Animated Gradient
 * - hero6 → Glass Morphism
 * - hero7 → Bento Grid
 *
 * 🎯 BLOCK PRIORITY:
 * 1. config.block (user override)
 * 2. template block (from TemplateProvider)
 */
export function TenantHero({ config, fallbacks = {} }: TenantHeroProps) {
  const templateBlock = useHeroBlock();
  const block = config?.block || templateBlock;

  const { title, subtitle } = extractSectionText(config, {
    title: fallbacks.title || fallbacks.storeName,
    subtitle: fallbacks.subtitle,
  });

  const heroConfig = getHeroConfig(config);
  const showCta = heroConfig?.showCta ?? true;
  const ctaText = heroConfig?.ctaText || LANDING_CONSTANTS.CTA_TEXT_DEFAULT;
  const ctaLink = heroConfig?.ctaLink || '/products';
  const backgroundImage = extractBackgroundImage(heroConfig, fallbacks.backgroundImage);
  const overlayOpacity = heroConfig?.overlayOpacity ?? LANDING_CONSTANTS.OVERLAY_OPACITY_DEFAULT;

  const commonProps = {
    title,
    subtitle,
    ctaText,
    ctaLink,
    showCta,
    backgroundImage,
    logo: fallbacks.logo,
    storeName: fallbacks.storeName,
  };

  // 🚀 Render appropriate block based on template
  switch (block) {
    case 'hero2':
      return <Hero2 {...commonProps} />;

    case 'hero3':
      return <Hero3 {...commonProps} />;

    case 'hero4':
      return <Hero4 {...commonProps} />;

    case 'hero5':
      return <Hero5 {...commonProps} />;

    case 'hero6':
      return <Hero6 {...commonProps} />;

    case 'hero7':
      return <Hero7 {...commonProps} />;

    // Default: hero1 (Centered)
    case 'hero1':
    default:
      return <Hero1 {...commonProps} overlayOpacity={overlayOpacity} />;
  }
}
```


---

## FILE: `src/components/landing/tenant-about.tsx`
> Lines: 92

```typescript
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
```


---

## FILE: `src/components/landing/tenant-products.tsx`
> Lines: 103

```typescript
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
```


---

## FILE: `src/components/landing/tenant-testimonials.tsx`
> Lines: 79

```typescript
'use client';

import { normalizeTestimonials, useTestimonialsBlock } from '@/lib/landing';
import {
  Testimonials1,
  Testimonials2,
  Testimonials3,
  Testimonials4,
  Testimonials5,
  Testimonials6,
  Testimonials7,
} from './blocks';
import type { TenantLandingConfig } from '@/types';

interface TenantTestimonialsProps {
  config?: TenantLandingConfig['testimonials'];
}

/**
 * Tenant Testimonials Component
 *
 * Wrapper that selects and renders the appropriate block
 * based on the current template context
 *
 * 🚀 v3.0 NUMBERING SYSTEM:
 * - testimonials1 → Grid Cards (default)
 * - testimonials2 → Card Slider
 * - testimonials3 → Quote Highlight
 * - testimonials4 → Single Focus
 * - testimonials5 → Video
 * - testimonials6 → Social Proof
 * - testimonials7 → Marquee
 *
 * 🎯 BLOCK PRIORITY:
 * 1. config.block (user override)
 * 2. template variant (from TemplateProvider)
 */
export function TenantTestimonials({ config }: TenantTestimonialsProps) {
  const templateBlock = useTestimonialsBlock();
  const block = config?.block || templateBlock;

  const title = config?.title || 'Testimoni';
  const subtitle = config?.subtitle || '';
  const items = normalizeTestimonials(config?.config?.items);

  if (items.length === 0) return null;

  const commonProps = {
    items,
    title,
    subtitle,
  };

  // Render appropriate block based on template
  switch (block) {
    case 'testimonials2':
      return <Testimonials2 {...commonProps} />;

    case 'testimonials3':
      return <Testimonials3 {...commonProps} />;

    case 'testimonials4':
      return <Testimonials4 {...commonProps} />;

    case 'testimonials5':
      return <Testimonials5 {...commonProps} />;

    case 'testimonials6':
      return <Testimonials6 {...commonProps} />;

    case 'testimonials7':
      return <Testimonials7 {...commonProps} />;

    // Default: testimonials1 (Grid Cards)
    case 'testimonials1':
    default:
      return <Testimonials1 {...commonProps} />;
  }
}
```


---

## FILE: `src/components/landing/tenant-contact.tsx`
> Lines: 90

```typescript
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
```


---

## FILE: `src/components/landing/tenant-cta.tsx`
> Lines: 100

```typescript
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
  Cta7,
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
 * - cta7 → Countdown
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

  const buttonVariant: 'default' | 'secondary' | 'outline' =
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

    case 'cta7':
      return <Cta7 {...commonProps} />;

    // Default: cta1 (Default)
    case 'cta1':
    default:
      return <Cta1 {...commonProps} />;
  }
}
```


---

# 📁 BLOCKS INDEX & MAPPING


---

## FILE: `src/components/landing/blocks/index.ts`
> Lines: 12

```typescript
/**
 * Landing Page Component Variants
 *
 * Different visual implementations for each section
 */

export * from './hero';
export * from './about';
export * from './products';
export * from './testimonials';
export * from './contact';
export * from './cta';
```


---

## FILE: `src/components/landing/blocks/MAPPING.md`
> Lines: 180

```markdown
# Block Mapping Reference

> v3.0 Numbering System - January 2026

This document maps the numbered block identifiers to their design names for reference.
Block numbers are used in the database and type system, design names are for human reference.

---

## Hero Blocks

| Block ID | Design Name | Description |
|----------|-------------|-------------|
| `hero1` | Centered | Classic centered hero with optional background image |
| `hero2` | Split Screen | Split layout with content on left, image on right |
| `hero3` | Video Background | Hero with video dialog - click to play video |
| `hero4` | Parallax | Parallax scrolling effect with layered content |
| `hero5` | Animated Gradient | Dynamic animated gradient with light rays |
| `hero6` | Glass Morphism | Modern glass-morphism design with blur effects |

**File:** `hero1.tsx` through `hero6.tsx`

---

## About Blocks

| Block ID | Design Name | Description |
|----------|-------------|-------------|
| `about1` | Grid | Classic grid layout with image and content |
| `about2` | Side by Side | Side-by-side layout with features list |
| `about3` | Centered | Centered layout with focus on content |
| `about4` | Timeline | Vertical timeline showing journey/milestones |
| `about5` | Cards | Modern card-based layout |
| `about6` | Magazine | Bold editorial magazine-style layout |
| `about7` | Storytelling | Narrative-focused with emotional connection |

**File:** `about1.tsx` through `about7.tsx`

---

## Products Blocks

| Block ID | Design Name | Description |
|----------|-------------|-------------|
| `products1` | Grid | Classic responsive grid layout |
| `products2` | Grid Hover | Grid with smooth hover animations |
| `products3` | Masonry | Pinterest-style masonry layout |
| `products4` | Carousel | Horizontal carousel/slider layout |
| `products5` | Catalog | Featured item + smaller grid |
| `products6` | Minimal List | Clean list view with minimal design |

**File:** `products1.tsx` through `products6.tsx`

---

## Testimonials Blocks

| Block ID | Design Name | Description |
|----------|-------------|-------------|
| `testimonials1` | Grid Cards | Grid layout with hover animations |
| `testimonials2` | Card Slider | Carousel-style slider with navigation |
| `testimonials3` | Quote Highlight | Large featured quote style |
| `testimonials4` | Single Focus | One testimonial at a time, centered |
| `testimonials5` | Video | Layout designed for video testimonials |
| `testimonials6` | Social Proof | Social media-inspired compact layout |

**File:** `testimonials1.tsx` through `testimonials6.tsx`

---

## Contact Blocks

| Block ID | Design Name | Description |
|----------|-------------|-------------|
| `contact1` | Default | Classic contact card layout |
| `contact2` | Split Form | Split layout with contact info + CTA |
| `contact3` | Centered | Centered minimal contact layout |
| `contact4` | Map Focus | Large map placeholder with overlay |
| `contact5` | Minimal | Ultra-minimal essential info only |
| `contact6` | Social Focused | Emphasizes social media platforms |

**File:** `contact1.tsx` through `contact6.tsx`

---

## CTA Blocks

| Block ID | Design Name | Description |
|----------|-------------|-------------|
| `cta1` | Default | Classic gradient banner CTA |
| `cta2` | Bold Center | Large, bold centered with gradient text |
| `cta3` | Gradient Banner | Full-width animated gradient banner |
| `cta4` | Split Action | Split layout with multiple action buttons |
| `cta5` | Floating | Floating card with shadow elevation |
| `cta6` | Minimal Line | Ultra-minimal single-line CTA |

**File:** `cta1.tsx` through `cta6.tsx`

---

## Migration from v2.0

### Old → New Mapping

#### Hero
- `default` → `hero1`
- `gradient-overlay` → `hero1`
- `centered-minimal` → `hero1`
- `split-screen` → `hero2`
- `video-background` → `hero3`
- `parallax` → `hero4`
- `animated-gradient` → `hero5`
- `glass-morphism` → `hero6`

#### About
- `default` → `about1`
- `side-by-side` → `about2`
- `centered` → `about3`
- `timeline` → `about4`
- `cards` → `about5`
- `magazine` → `about6`
- `storytelling` → `about7`

#### Products
- `default` → `products1`
- `grid-hover` → `products2`
- `masonry` → `products3`
- `carousel` → `products4`
- `featured-hero` → `products4`
- `catalog` → `products5`
- `minimal-list` → `products6`

#### Testimonials
- `default` → `testimonials1`
- `grid-cards` → `testimonials1`
- `card-slider` → `testimonials2`
- `quote-highlight` → `testimonials3`
- `single-focus` → `testimonials4`
- `video-testimonials` → `testimonials5`
- `social-proof` → `testimonials6`

#### Contact
- `default` → `contact1`
- `split-form` → `contact2`
- `centered` → `contact3`
- `map-focus` → `contact4`
- `minimal` → `contact5`
- `social-focused` → `contact6`

#### CTA
- `default` → `cta1`
- `bold-center` → `cta2`
- `gradient-banner` → `cta3`
- `split-action` → `cta4`
- `floating` → `cta5`
- `minimal-line` → `cta6`

---

## Why Numbering?

1. **No naming fatigue** - `hero1`, `hero2`, `hero3` (simple!)
2. **Scalable** - Add blocks = just increment number
3. **Visual-first** - Thumbnails > Icons in selector UI
4. **Professional UX** - Grid layout like Canva/shadcnblocks.com

---

## Usage

```typescript
// Type definitions
type HeroBlock = 'hero1' | 'hero2' | 'hero3' | 'hero4' | 'hero5' | 'hero6';

// In config
hero: {
  block: 'hero1',  // Simple numbering!
  title: 'Welcome'
}
```
```


---

# 🦸 HERO BLOCKS


---

## FILE: `src/components/landing/blocks/hero/index.ts`
> Lines: 14

```typescript
/**
 * Hero Section Blocks
 *
 * v3.0 Numbering System
 * See MAPPING.md for design name references
 */

export * from './hero1'; // Centered
export * from './hero2'; // Split Screen
export * from './hero3'; // Video Background
export * from './hero4'; // Parallax
export * from './hero5'; // Animated Gradient
export * from './hero6'; // Glass Morphism
export * from './hero7'; // Bento Grid
```


---

## FILE: `src/components/landing/blocks/hero/hero1.tsx`
> Lines: 200

```typescript
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Hero1Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  overlayOpacity?: number;
  logo?: string;
  storeName?: string;
}

/**
 * Hero Block: hero1
 * Design: Centered
 *
 * Classic centered hero - MOBILE FIRST!
 * Proper spacing dan tidak gepeng di mobile
 */
export function Hero1({
  title,
  subtitle,
  ctaText = 'Get Started',
  ctaLink = '#',
  showCta = true,
  backgroundImage,
  overlayOpacity = 0.5,
  logo,
  storeName,
}: Hero1Props) {
  return (
    <section className="relative min-h-[600px] md:min-h-[700px] lg:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      {backgroundImage && (
        <>
          <OptimizedImage
            src={backgroundImage}
            alt="Hero Background"
            fill
            priority
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-black transition-opacity"
            style={{ opacity: overlayOpacity }}
          />
        </>
      )}

      {/* Gradient Background (fallback) */}
      {!backgroundImage && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-blue-500/10" />
      )}

      {/* Content Container - MOBILE FIRST! */}
      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Logo */}
          {logo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center mb-6 md:mb-8"
            >
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
                <OptimizedImage
                  src={logo}
                  alt={storeName || 'Logo'}
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          )}

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-block mb-6"
          >
            <Badge variant="secondary" className="px-4 py-2 text-sm md:text-base shadow-lg">
              <Sparkles className="h-4 w-4 mr-2" />
              {storeName || 'Welcome'}
            </Badge>
          </motion.div>

          {/* Title - MOBILE OPTIMIZED dengan line breaks */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className={cn(
              "text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-8",
              "leading-tight",
              backgroundImage ? "text-white drop-shadow-lg" : "text-foreground"
            )}
          >
            {title}
          </motion.h1>

          {/* Subtitle - MOBILE OPTIMIZED dengan proper padding */}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className={cn(
                "text-base sm:text-lg md:text-xl lg:text-2xl mb-8 md:mb-12",
                "max-w-2xl mx-auto leading-relaxed",
                backgroundImage ? "text-white/90 drop-shadow" : "text-muted-foreground"
              )}
            >
              {subtitle}
            </motion.p>
          )}

          {/* CTA Button - MOBILE FRIENDLY width */}
          {showCta && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex justify-center"
            >
              <Link href={ctaLink} className="w-full sm:w-auto">
                <InteractiveHoverButton className="w-full sm:w-auto min-w-[200px] text-base md:text-lg px-6 md:px-8 py-4 md:py-6 shadow-xl">
                  {ctaText}
                </InteractiveHoverButton>
              </Link>
            </motion.div>
          )}

          {/* Trust Indicators - MOBILE STACKED */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-10 md:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-xs md:text-sm"
          >
            <div className={cn(
              "flex items-center justify-center gap-2 px-4 py-2 rounded-lg backdrop-blur-sm",
              backgroundImage ? "bg-white/10 text-white" : "bg-muted text-foreground"
            )}>
              <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              <span>1000+ Customers</span>
            </div>
            <div className={cn(
              "flex items-center justify-center gap-2 px-4 py-2 rounded-lg backdrop-blur-sm",
              backgroundImage ? "bg-white/10 text-white" : "bg-muted text-foreground"
            )}>
              <span className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
              <span>Fast Shipping</span>
            </div>
            <div className={cn(
              "flex items-center justify-center gap-2 px-4 py-2 rounded-lg backdrop-blur-sm",
              backgroundImage ? "bg-white/10 text-white" : "bg-muted text-foreground"
            )}>
              <span className="h-2 w-2 bg-purple-500 rounded-full animate-pulse" />
              <span>Secure Payment</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator - Hidden on Mobile */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block"
      >
        <div className={cn(
          "flex flex-col items-center gap-2",
          backgroundImage ? "text-white/70" : "text-muted-foreground"
        )}>
          <span className="text-xs uppercase tracking-wider">Scroll</span>
          <ArrowRight className="h-5 w-5 rotate-90" />
        </div>
      </motion.div>
    </section>
  );
}
```


---

## FILE: `src/components/landing/blocks/hero/hero2.tsx`
> Lines: 175

```typescript
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Hero2Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

/**
 * Hero Block: hero2
 * Design: Split Screen
 *
 * Split layout with content on left, image on right - MOBILE FIRST!
 * Stacks vertically on mobile → Side-by-side on desktop
 * Modern asymmetric design with smooth animations
 */
export function Hero2({
  title,
  subtitle,
  ctaText = 'Lihat Produk',
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: Hero2Props) {
  return (
    <section className="relative min-h-[600px] lg:min-h-screen overflow-hidden">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[600px] lg:min-h-screen py-12 md:py-16 lg:py-20">
          {/* Left: Content - MOBILE OPTIMIZED */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 md:space-y-8 order-2 lg:order-1"
          >
            {/* Logo */}
            {logo && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex justify-center lg:justify-start"
              >
                <div className="relative h-16 w-16 md:h-20 md:w-20 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-xl">
                  <OptimizedImage
                    src={logo}
                    alt={storeName || title}
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>
            )}

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex justify-center lg:justify-start"
            >
              <Badge variant="secondary" className="px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base">
                <Sparkles className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                {storeName || 'Featured'}
              </Badge>
            </motion.div>

            {/* Title - MOBILE OPTIMIZED */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-4 text-center lg:text-left"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight">
                {title}
              </h1>

              {subtitle && (
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  {subtitle}
                </p>
              )}
            </motion.div>

            {/* CTA - MOBILE FRIENDLY */}
            {showCta && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex justify-center lg:justify-start"
              >
                <Link href={ctaLink} className="w-full sm:w-auto">
                  <InteractiveHoverButton className="w-full sm:w-auto min-w-[200px] text-base md:text-lg px-6 md:px-8 py-4 md:py-6">
                    {ctaText}
                  </InteractiveHoverButton>
                </Link>
              </motion.div>
            )}

            {/* Trust Indicators - MOBILE STACKED */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                <span>Trusted Brand</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-2 w-2 bg-purple-500 rounded-full animate-pulse" />
                <span>Quality Products</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Image - MOBILE FIRST HEIGHT */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] rounded-3xl overflow-hidden shadow-2xl order-1 lg:order-2"
          >
            {backgroundImage ? (
              <OptimizedImage
                src={backgroundImage}
                alt={storeName || title}
                fill
                priority
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background flex items-center justify-center">
                <span className="text-9xl opacity-20">🎨</span>
              </div>
            )}

            {/* Decorative Elements */}
            <div className="absolute top-6 right-6">
              <Badge className="bg-white/90 text-primary backdrop-blur-sm">
                <Sparkles className="h-3 w-3 mr-1 fill-current" />
                New
              </Badge>
            </div>

            {/* Bottom Gradient Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```


---

## FILE: `src/components/landing/blocks/hero/hero3.tsx`
> Lines: 165

```typescript
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Play } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import { HeroVideoDialog } from '@/components/ui/hero-video-dialog';
import { cn } from '@/lib/utils';

interface Hero3Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
  videoUrl?: string;
}

/**
 * Hero Block: hero3
 * Design: Video Background
 *
 * Hero with video dialog - click to play promotional video - MOBILE FIRST!
 * Great for brands that want to showcase video content
 * Responsive overlay with proper mobile spacing
 */
export function Hero3({
  title,
  subtitle,
  ctaText = 'Lihat Produk',
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
  videoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ',
}: Hero3Props) {
  return (
    <section className="relative min-h-[600px] md:min-h-[700px] lg:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background Section */}
      <div className="absolute inset-0">
        {backgroundImage ? (
          <HeroVideoDialog
            animationStyle="from-center"
            videoSrc={videoUrl}
            thumbnailSrc={backgroundImage}
            thumbnailAlt={storeName || title}
            className="w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/10 via-background to-primary/5 flex items-center justify-center">
            <div className="text-center p-8 space-y-4">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                <Play className="h-8 w-8 md:h-10 md:w-10 text-primary" />
              </div>
              <p className="text-xs md:text-sm text-muted-foreground">
                Add a video to see video background
              </p>
            </div>
          </div>
        )}
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
      </div>

      {/* Content Overlay - MOBILE FIRST */}
      <div className="relative z-10 container px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8"
        >
          {/* Logo */}
          {logo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center mb-6 md:mb-8"
            >
              <div className="relative h-16 w-16 md:h-20 md:w-20 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                <OptimizedImage
                  src={logo}
                  alt={storeName || title}
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          )}

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-block mb-4 md:mb-6"
          >
            <Badge variant="secondary" className="px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base backdrop-blur-sm">
              <Play className="h-3 w-3 md:h-4 md:w-4 mr-2" />
              {storeName || 'Watch Our Story'}
            </Badge>
          </motion.div>

          {/* Title - MOBILE OPTIMIZED */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground drop-shadow-lg leading-tight"
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto drop-shadow-md leading-relaxed px-4"
            >
              {subtitle}
            </motion.p>
          )}

          {/* CTA Buttons - MOBILE STACKED */}
          {showCta && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            >
              <Link href={ctaLink} className="w-full sm:w-auto">
                <InteractiveHoverButton className="w-full sm:w-auto min-w-[200px] text-base md:text-lg px-6 md:px-8 py-4 md:py-6 shadow-xl">
                  {ctaText}
                </InteractiveHoverButton>
              </Link>
            </motion.div>
          )}

          {/* Video Play Hint - Only show if video exists */}
          {backgroundImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex items-center justify-center gap-2 text-xs md:text-sm text-muted-foreground pt-4"
            >
              <Play className="h-4 w-4 animate-pulse" />
              <span>Click the video above to watch</span>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
```


---

## FILE: `src/components/landing/blocks/hero/hero4.tsx`
> Lines: 202

```typescript
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Zap } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import { LightRays } from '@/components/ui/light-rays';
import { DotPattern } from '@/components/ui/dot-pattern';
import { cn } from '@/lib/utils';

interface Hero4Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

/**
 * Hero Block: hero4
 * Design: Parallax with Light Rays
 *
 * Modern depth effect using LightRays and DotPattern - MOBILE FIRST!
 * Creates magical atmosphere with animated light rays
 * No custom scroll listeners - pure CSS and framer-motion
 */
export function Hero4({
  title,
  subtitle,
  ctaText = 'Lihat Produk',
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: Hero4Props) {
  return (
    <section className="relative min-h-[600px] md:min-h-[700px] lg:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image or Gradient */}
      <div className="absolute inset-0">
        {backgroundImage ? (
          <OptimizedImage
            src={backgroundImage}
            alt={storeName || title}
            fill
            priority
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-purple-500/10 to-background" />
        )}
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      {/* Light Rays Effect - Creates depth and parallax feel */}
      <LightRays
        count={8}
        color="rgba(160, 210, 255, 0.15)"
        blur={40}
        speed={16}
        length="80vh"
        className="hidden md:block"
      />

      {/* Dot Pattern Overlay - Subtle texture */}
      <DotPattern
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
        className="opacity-30 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]"
      />

      {/* Content - MOBILE FIRST */}
      <div className="relative z-10 container px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto text-center space-y-6 md:space-y-8"
        >
          {/* Logo */}
          {logo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center mb-6 md:mb-8"
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative h-20 w-20 md:h-24 md:w-24 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl"
              >
                <OptimizedImage
                  src={logo}
                  alt={storeName || title}
                  fill
                  className="object-cover"
                />
              </motion.div>
            </motion.div>
          )}

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-block mb-4 md:mb-6"
          >
            <Badge variant="secondary" className="px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base backdrop-blur-sm">
              <Zap className="h-3 w-3 md:h-4 md:w-4 mr-2" />
              {storeName || 'Premium Collection'}
            </Badge>
          </motion.div>

          {/* Title - MOBILE OPTIMIZED */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className={cn(
              'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight',
              backgroundImage ? 'text-white drop-shadow-2xl' : 'text-foreground'
            )}
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className={cn(
                'text-base sm:text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed px-4',
                backgroundImage ? 'text-white/90 drop-shadow-lg' : 'text-muted-foreground'
              )}
            >
              {subtitle}
            </motion.p>
          )}

          {/* CTA - MOBILE FRIENDLY */}
          {showCta && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="pt-4 md:pt-8 flex justify-center"
            >
              <Link href={ctaLink} className="w-full sm:w-auto">
                <InteractiveHoverButton className="w-full sm:w-auto min-w-[200px] text-base md:text-lg px-6 md:px-8 py-4 md:py-6 shadow-xl">
                  {ctaText}
                </InteractiveHoverButton>
              </Link>
            </motion.div>
          )}

          {/* Floating Features - MOBILE STACKED */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-4 pt-8"
          >
            {['Premium Quality', 'Fast Shipping', 'Secure Payment'].map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm text-xs md:text-sm',
                  backgroundImage ? 'bg-white/10 text-white' : 'bg-muted text-foreground'
                )}
              >
                <Sparkles className="h-3 w-3" />
                <span>{feature}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
```


---

## FILE: `src/components/landing/blocks/hero/hero5.tsx`
> Lines: 170

```typescript
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Star } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import { LightRays } from '@/components/ui/light-rays';
import { WordRotate } from '@/components/ui/word-rotate';

interface Hero5Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

/**
 * Hero Block: hero5
 * Design: Animated Gradient with Word Rotate
 *
 * Dynamic animated gradient background with light rays - MOBILE FIRST!
 * Modern and eye-catching with rotating words effect
 * Uses WordRotate component for dynamic text
 */
export function Hero5({
  title,
  subtitle,
  ctaText = 'Lihat Produk',
  ctaLink = '/products',
  showCta = true,
  logo,
  storeName,
}: Hero5Props) {
  // Split title for word rotation - use last word or provide alternatives
  const titleWords = title.split(' ');
  const rotatingWords = titleWords.length > 1
    ? [titleWords[titleWords.length - 1], 'Premium', 'Berkualitas', 'Terbaik']
    : ['Premium', 'Berkualitas', 'Terbaik', 'Terpercaya'];
  const staticTitle = titleWords.length > 1 ? titleWords.slice(0, -1).join(' ') : '';

  return (
    <section className="relative min-h-[600px] md:min-h-[700px] lg:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8b5cf6,#d946ef,#ec4899)] bg-[length:200%_100%] animate-[gradient_15s_ease_infinite]" />
        <LightRays
          count={6}
          color="rgba(255, 255, 255, 0.1)"
          blur={50}
          speed={18}
          length="90vh"
          className="hidden md:block"
        />
        <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px]" />
      </div>

      {/* Content - MOBILE FIRST */}
      <div className="relative z-10 container px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto text-center space-y-6 md:space-y-8"
        >
          {/* Logo */}
          {logo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center mb-6 md:mb-8"
            >
              <div className="relative h-20 w-20 md:h-24 md:w-24 rounded-full overflow-hidden border-4 border-white/80 shadow-2xl bg-white/20 backdrop-blur-sm">
                <OptimizedImage
                  src={logo}
                  alt={storeName || title}
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          )}

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-block mb-4 md:mb-6"
          >
            <Badge variant="secondary" className="px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base bg-white/90 backdrop-blur-sm">
              <Star className="h-3 w-3 md:h-4 md:w-4 mr-2 fill-current text-primary" />
              {storeName || 'Premium Store'}
            </Badge>
          </motion.div>

          {/* Title with Word Rotation - MOBILE OPTIMIZED */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white drop-shadow-2xl leading-tight">
              {staticTitle && <span>{staticTitle} </span>}
              <WordRotate
                words={rotatingWords}
                duration={2500}
                className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/80"
              />
            </h1>

            {subtitle && (
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto drop-shadow-lg font-medium px-4">
                {subtitle}
              </p>
            )}
          </motion.div>

          {/* CTA - MOBILE FRIENDLY */}
          {showCta && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="pt-4 md:pt-6 flex justify-center"
            >
              <Link href={ctaLink} className="w-full sm:w-auto">
                <InteractiveHoverButton className="w-full sm:w-auto min-w-[200px] text-base md:text-lg px-6 md:px-8 py-4 md:py-6 bg-white text-primary hover:bg-white/90 shadow-2xl">
                  {ctaText}
                </InteractiveHoverButton>
              </Link>
            </motion.div>
          )}

          {/* Stats - MOBILE STACKED */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-6 md:gap-12 pt-8"
          >
            {[
              { value: '1000+', label: 'Produk' },
              { value: '5000+', label: 'Pelanggan' },
              { value: '4.9⭐', label: 'Rating' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                className="text-white/90 backdrop-blur-sm bg-white/10 rounded-2xl px-6 py-4 min-w-[100px]"
              >
                <p className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-xs md:text-sm opacity-80">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
```


---

## FILE: `src/components/landing/blocks/hero/hero6.tsx`
> Lines: 200

```typescript
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Gem } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import { DotPattern } from '@/components/ui/dot-pattern';
import { cn } from '@/lib/utils';

interface Hero6Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

/**
 * Hero Block: hero6
 * Design: Glass Morphism
 *
 * Modern glass-morphism design with blur effects - MOBILE FIRST!
 * Beautiful gradient background with floating glass cards
 * Uses backdrop-blur for iOS-style glass effect
 */
export function Hero6({
  title,
  subtitle,
  ctaText = 'Lihat Produk',
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: Hero6Props) {
  return (
    <section className="relative min-h-[600px] md:min-h-[700px] lg:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/10 to-pink-500/10">
        {backgroundImage ? (
          <>
            <OptimizedImage
              src={backgroundImage}
              alt={storeName || title}
              fill
              priority
              className="object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80 backdrop-blur-sm" />
          </>
        ) : (
          <DotPattern className="opacity-20" />
        )}
      </div>

      {/* Animated Blobs - Desktop only for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden lg:block">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Glass Morphism Card - MOBILE FIRST */}
      <div className="relative z-10 container px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative backdrop-blur-xl bg-background/40 border border-white/20 rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 overflow-hidden">
            {/* Floating gradient blobs inside card */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-tr from-pink-500/20 to-purple-500/20 rounded-full blur-2xl" />

            {/* Content */}
            <div className="relative z-10 text-center space-y-6 md:space-y-8">
              {/* Logo */}
              {logo && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="flex justify-center mb-6 md:mb-8"
                >
                  <div className="relative h-16 w-16 md:h-20 md:w-20 rounded-full overflow-hidden border-2 border-white/30 shadow-xl backdrop-blur-sm bg-white/10">
                    <OptimizedImage
                      src={logo}
                      alt={storeName || title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </motion.div>
              )}

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="inline-block mb-4 md:mb-6"
              >
                <Badge variant="secondary" className="px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base backdrop-blur-sm bg-white/80">
                  <Gem className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                  {storeName || 'Premium Glass'}
                </Badge>
              </motion.div>

              {/* Title - MOBILE OPTIMIZED with Gradient Text */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-600 to-pink-600 leading-tight"
              >
                {title}
              </motion.h1>

              {/* Subtitle */}
              {subtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4"
                >
                  {subtitle}
                </motion.p>
              )}

              {/* CTA - MOBILE FRIENDLY */}
              {showCta && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="pt-4 flex justify-center"
                >
                  <Link href={ctaLink} className="w-full sm:w-auto">
                    <InteractiveHoverButton className="w-full sm:w-auto min-w-[200px] text-base md:text-lg px-6 md:px-8 py-4 md:py-6 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-xl">
                      {ctaText}
                    </InteractiveHoverButton>
                  </Link>
                </motion.div>
              )}

              {/* Features - MOBILE STACKED */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="flex flex-wrap justify-center gap-4 pt-6"
              >
                {['Premium Quality', 'Modern Design', 'Fast & Secure'].map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm bg-white/10 border border-white/20 text-xs md:text-sm"
                  >
                    <Sparkles className="h-3 w-3 text-primary" />
                    <span>{feature}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```


---

## FILE: `src/components/landing/blocks/hero/hero7.tsx`
> Lines: 204

```typescript
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Zap, TrendingUp, Star, Package } from 'lucide-react';
import { BentoGrid, BentoCard } from '@/components/ui/bento-grid';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Hero7Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

/**
 * Hero Block: hero7
 * Design: Bento Grid
 *
 * Modern bento grid using BentoGrid component - MOBILE FIRST!
 * Responsive: 1 col mobile → 3 cols desktop
 */
export function Hero7({
  title,
  subtitle,
  ctaText = 'Explore Now',
  ctaLink = '#',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: Hero7Props) {
  // Background gradient component
  const GradientBg = ({ className }: { className: string }) => (
    <div className={cn("absolute inset-0 bg-gradient-to-br transition-opacity opacity-60 group-hover:opacity-80", className)} />
  );

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-background via-muted/30 to-background overflow-hidden py-12 md:py-20 lg:py-24">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        {/* Header - MOBILE OPTIMIZED */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12 lg:mb-16"
        >
          {/* Logo */}
          {logo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center mb-6 md:mb-8"
            >
              <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden shadow-xl">
                <OptimizedImage
                  src={logo}
                  alt={storeName || 'Logo'}
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          )}

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-block mb-4 md:mb-6"
          >
            <Badge variant="secondary" className="px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base shadow-lg">
              <Sparkles className="h-3 w-3 md:h-4 md:w-4 mr-2" />
              {storeName || 'Featured Collection'}
            </Badge>
          </motion.div>

          {/* Title - MOBILE OPTIMIZED */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent leading-tight">
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* BENTO GRID - MOBILE FIRST! */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <BentoGrid className="max-w-7xl mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[18rem] sm:auto-rows-[20rem] md:auto-rows-[22rem]">
            {/* CARD 1: Featured - LARGE on desktop */}
            <BentoCard
              name="Premium Quality"
              className="col-span-1 sm:col-span-2 lg:col-span-2 row-span-1 lg:row-span-2"
              description="Discover our most popular products with exclusive features and premium materials"
              Icon={TrendingUp}
              href={ctaLink}
              cta={ctaText}
              background={
                backgroundImage ? (
                  <div className="absolute inset-0">
                    <OptimizedImage
                      src={backgroundImage}
                      alt="Featured"
                      fill
                      className="object-cover opacity-20 group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                ) : (
                  <GradientBg className="from-primary/10 to-blue-500/10" />
                )
              }
            />

            {/* CARD 2: Stats */}
            <BentoCard
              name="10K+ Customers"
              className="col-span-1"
              description="Join thousands of happy customers worldwide"
              Icon={Zap}
              href={ctaLink}
              cta="Join Now"
              background={<GradientBg className="from-green-500/10 to-emerald-500/10" />}
            />

            {/* CARD 3: New Arrivals */}
            <BentoCard
              name="New Arrivals"
              className="col-span-1"
              description="Check out our latest products and collections"
              Icon={Sparkles}
              href={ctaLink}
              cta="View All"
              background={<GradientBg className="from-orange-500/10 to-red-500/10" />}
            />

            {/* CARD 4: Special Offers */}
            <BentoCard
              name="Special Offers"
              className="col-span-1"
              description="Exclusive deals and limited time discounts"
              Icon={Star}
              href={ctaLink}
              cta="Shop Now"
              background={<GradientBg className="from-purple-500/10 to-pink-500/10" />}
            />

            {/* CARD 5: Premium Service */}
            <BentoCard
              name="Premium Service"
              className="col-span-1"
              description="Fast shipping and 24/7 customer support"
              Icon={Package}
              href={ctaLink}
              cta="Learn More"
              background={<GradientBg className="from-blue-500/10 to-cyan-500/10" />}
            />
          </BentoGrid>
        </motion.div>

        {/* Bottom Trust Badges - MOBILE STACKED */}
        {showCta && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-center mt-12 md:mt-16"
          >
            <p className="text-sm text-muted-foreground mb-4">
              Join thousands of satisfied customers
            </p>
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              <Badge variant="outline" className="text-xs md:text-sm">✓ Free Shipping</Badge>
              <Badge variant="outline" className="text-xs md:text-sm">✓ Easy Returns</Badge>
              <Badge variant="outline" className="text-xs md:text-sm">✓ 24/7 Support</Badge>
              <Badge variant="outline" className="text-xs md:text-sm">✓ Secure Payment</Badge>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
```


---

# ℹ️ ABOUT BLOCKS


---

## FILE: `src/components/landing/blocks/about/index.ts`
> Lines: 14

```typescript
/**
 * About Section Blocks
 *
 * v3.0 Numbering System
 * See MAPPING.md for design name references
 */

export * from './about1'; // Grid
export * from './about2'; // Side by Side
export * from './about3'; // Centered
export * from './about4'; // Timeline
export * from './about5'; // Cards
export * from './about6'; // Magazine
export * from './about7'; // Storytelling
```


---

## FILE: `src/components/landing/blocks/about/about1.tsx`
> Lines: 72

```typescript
'use client';

import Image from 'next/image';
import { CheckCircle } from 'lucide-react';

interface About1Props {
  title: string;
  subtitle?: string;
  content?: string;
  image?: string;
  features?: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
}

/**
 * About Block: about1
 * Design: Grid
 *
 * Classic grid layout with image and content side by side
 * Features displayed as a list with checkmarks
 */
export function About1({ title, subtitle, content, image, features = [] }: About1Props) {
  return (
    <section id="about" className="py-12">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Image */}
        {image && (
          <div className="relative aspect-video rounded-xl overflow-hidden">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              unoptimized={image.startsWith('http')}
            />
          </div>
        )}

        {/* Content */}
        <div className="space-y-6">
          {content && <p className="text-muted-foreground leading-relaxed">{content}</p>}

          {/* Features */}
          {features.length > 0 && (
            <div className="grid gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{feature.title}</p>
                    {feature.description && (
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
```


---

## FILE: `src/components/landing/blocks/about/about2.tsx`
> Lines: 80

```typescript
'use client';

import Image from 'next/image';
import { CheckCircle } from 'lucide-react';

interface About2Props {
  title: string;
  subtitle?: string;
  content?: string;
  image?: string;
  features?: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
}

/**
 * About Block: about2
 * Design: Side by Side
 *
 * Classic side-by-side layout with image and content
 * Clean and professional presentation
 */
export function About2({ title, subtitle, content, image, features = [] }: About2Props) {
  return (
    <section id="about" className="py-12">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-2 text-lg">{subtitle}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Left: Image */}
        {image && (
          <div className="order-2 md:order-1">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
                unoptimized={image.startsWith('http')}
              />
            </div>
          </div>
        )}

        {/* Right: Content */}
        <div className="order-1 md:order-2 space-y-6">
          {content && (
            <p className="text-muted-foreground leading-relaxed text-lg">
              {content}
            </p>
          )}

          {/* Features List */}
          {features.length > 0 && (
            <div className="space-y-4 pt-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                    {feature.description && (
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
```


---

## FILE: `src/components/landing/blocks/about/about3.tsx`
> Lines: 81

```typescript
'use client';

import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface About3Props {
  title: string;
  subtitle?: string;
  content?: string;
  image?: string;
  features?: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
}

/**
 * About Block: about3
 * Design: Centered
 *
 * Centered layout with focus on content
 * Minimal and elegant design
 */
export function About3({ title, subtitle, content, image, features = [] }: About3Props) {
  return (
    <section id="about" className="py-12">
      <div className="max-w-4xl mx-auto">
        {/* Centered Header */}
        <div className="text-center space-y-4 mb-12">
          {subtitle && (
            <p className="text-primary font-medium uppercase tracking-wider text-sm">
              {subtitle}
            </p>
          )}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">{title}</h2>

          {content && (
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
              {content}
            </p>
          )}
        </div>

        {/* Centered Image */}
        {image && (
          <div className="relative aspect-video max-w-2xl mx-auto mb-12 rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              unoptimized={image.startsWith('http')}
            />
          </div>
        )}

        {/* Centered Features Grid */}
        {features.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                {feature.description && (
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
```


---

## FILE: `src/components/landing/blocks/about/about4.tsx`
> Lines: 91

```typescript
'use client';

import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

interface About4Props {
  title: string;
  subtitle?: string;
  content?: string;
  image?: string;
  features?: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
}

/**
 * About Block: about4
 * Design: Timeline
 *
 * Vertical timeline layout showing journey/milestones
 * Great for showing company history or process steps
 */
export function About4({ title, subtitle, content, image, features = [] }: About4Props) {
  return (
    <section id="about" className="py-12">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
        {content && (
          <p className="text-muted-foreground max-w-2xl mx-auto mt-4 leading-relaxed">
            {content}
          </p>
        )}
      </div>

      {/* Timeline Image */}
      {image && (
        <div className="relative aspect-[21/9] max-w-4xl mx-auto mb-12 rounded-xl overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            unoptimized={image.startsWith('http')}
          />
        </div>
      )}

      {/* Vertical Timeline */}
      {features.length > 0 && (
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-border" />

            {/* Timeline Items */}
            <div className="space-y-8">
              {features.map((feature, index) => (
                <div key={index} className="relative pl-14">
                  {/* Timeline Dot */}
                  <div className="absolute left-0 top-1 w-12 h-12 rounded-full bg-primary/10 border-4 border-background flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>

                  {/* Content Card */}
                  <div className="bg-card border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                        {feature.description && (
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        )}
                      </div>
                      {/* Timeline Index */}
                      <div className="text-4xl font-bold text-primary/20">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
```


---

## FILE: `src/components/landing/blocks/about/about5.tsx`
> Lines: 80

```typescript
'use client';

import Image from 'next/image';
import { CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface About5Props {
  title: string;
  subtitle?: string;
  content?: string;
  image?: string;
  features?: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
}

/**
 * About Block: about5
 * Design: Cards
 *
 * Modern card-based layout
 * Features displayed as individual cards in a grid
 */
export function About5({ title, subtitle, content, image, features = [] }: About5Props) {
  return (
    <section id="about" className="py-12">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
      </div>

      {/* Content & Image */}
      <div className="mb-12">
        {content && (
          <p className="text-muted-foreground leading-relaxed text-center max-w-3xl mx-auto mb-8">
            {content}
          </p>
        )}

        {image && (
          <div className="relative aspect-[21/9] max-w-4xl mx-auto rounded-xl overflow-hidden">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              unoptimized={image.startsWith('http')}
            />
          </div>
        )}
      </div>

      {/* Features as Cards */}
      {features.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    {feature.description && (
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
```


---

## FILE: `src/components/landing/blocks/about/about6.tsx`
> Lines: 112

```typescript
'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

interface About6Props {
  title: string;
  subtitle?: string;
  content?: string;
  image?: string;
  features?: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
}

/**
 * About Block: about6
 * Design: Magazine
 *
 * Bold editorial magazine-style layout
 * Large typography, visual hierarchy, editorial feel
 */
export function About6({ title, subtitle, content, image, features = [] }: About6Props) {
  return (
    <section id="about" className="py-12">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Left Column - Editorial Content */}
        <div className="space-y-8">
          {/* Magazine Header */}
          <div>
            {subtitle && (
              <Badge variant="outline" className="mb-4 uppercase tracking-wider">
                {subtitle}
              </Badge>
            )}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              {title}
            </h2>
            {content && (
              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-muted-foreground leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:text-primary first-letter:mr-1 first-letter:float-left">
                  {content}
                </p>
              </div>
            )}
          </div>

          {/* Features as editorial highlights */}
          {features.length > 0 && (
            <div className="space-y-6 pt-6 border-t">
              {features.slice(0, 3).map((feature, index) => (
                <div key={index} className="group">
                  <div className="flex items-baseline gap-4">
                    <span className="text-5xl font-bold text-primary/20 group-hover:text-primary/40 transition-colors">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{feature.title}</h3>
                      {feature.description && (
                        <p className="text-muted-foreground">{feature.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Visual */}
        <div className="space-y-6">
          {/* Main Image */}
          {image && (
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-2xl">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
                unoptimized={image.startsWith('http')}
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          )}

          {/* Additional features as sidebar */}
          {features.length > 3 && (
            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <h4 className="font-bold text-lg">More Highlights</h4>
              <div className="grid gap-3">
                {features.slice(3).map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-background rounded-md">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">{feature.title}</p>
                      {feature.description && (
                        <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
```


---

## FILE: `src/components/landing/blocks/about/about7.tsx`
> Lines: 113

```typescript
'use client';

import Image from 'next/image';
import { Quote } from 'lucide-react';

interface About7Props {
  title: string;
  subtitle?: string;
  content?: string;
  image?: string;
  features?: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
}

/**
 * About Block: about7
 * Design: Storytelling
 *
 * Narrative-focused layout with emotional connection
 * Story-driven content with emphasis on journey
 */
export function About7({ title, subtitle, content, image, features = [] }: About7Props) {
  return (
    <section id="about" className="py-12">
      <div className="max-w-4xl mx-auto">
        {/* Story Header */}
        <div className="text-center mb-12">
          {subtitle && (
            <p className="text-primary font-medium mb-2 uppercase tracking-wide text-sm">
              {subtitle}
            </p>
          )}
          <h2 className="text-3xl md:text-5xl font-bold mb-6">{title}</h2>
        </div>

        {/* Hero Image */}
        {image && (
          <div className="relative aspect-video rounded-2xl overflow-hidden mb-12 shadow-xl">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              unoptimized={image.startsWith('http')}
            />
          </div>
        )}

        {/* Story Content */}
        {content && (
          <div className="mb-12">
            <div className="relative">
              {/* Quote Icon */}
              <Quote className="absolute -top-4 -left-4 h-16 w-16 text-primary/10" />

              <div className="prose prose-lg max-w-none pl-8">
                <p className="text-lg md:text-xl leading-relaxed text-muted-foreground italic">
                  &ldquo;{content}&rdquo;
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Story Chapters/Milestones */}
        {features.length > 0 && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold">Our Journey</h3>
              <div className="w-20 h-1 bg-primary mx-auto mt-4" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="relative group p-6 rounded-xl border bg-card hover:shadow-lg transition-all"
                >
                  {/* Chapter number */}
                  <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-lg">
                    {index + 1}
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xl font-bold pt-2">{feature.title}</h4>
                    {feature.description && (
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    )}
                  </div>

                  {/* Decorative element */}
                  <div className="absolute bottom-0 right-0 w-20 h-20 bg-primary/5 rounded-tl-full -z-10 group-hover:bg-primary/10 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Closing line */}
        <div className="text-center mt-12 pt-8 border-t">
          <p className="text-muted-foreground italic">
            And the story continues...
          </p>
        </div>
      </div>
    </section>
  );
}
```


---

# 🛍️ PRODUCTS BLOCKS


---

## FILE: `src/components/landing/blocks/products/index.ts`
> Lines: 14

```typescript
/**
 * Products Section Blocks
 *
 * v3.0 Numbering System
 * See MAPPING.md for design name references
 */

export * from './products1'; // Grid
export * from './products2'; // Grid Hover
export * from './products3'; // Masonry
export * from './products4'; // Carousel
export * from './products5'; // Catalog
export * from './products6'; // Minimal List
export * from './products7'; // Featured Hero
```


---

## FILE: `src/components/landing/blocks/products/products1.tsx`
> Lines: 64

```typescript
'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/store/product-card';
import type { Product } from '@/types';

interface Products1Props {
  products: Product[];
  title: string;
  subtitle?: string;
  showViewAll?: boolean;
  productsLink?: string;
  storeSlug?: string;
  limit?: number;
}

/**
 * Products Block: products1
 * Design: Grid
 *
 * Classic grid layout for products
 * Responsive columns: 2 (mobile) → 3 (tablet) → 4 (desktop)
 */
export function Products1({
  products,
  title,
  subtitle,
  showViewAll = true,
  productsLink = '/products',
  storeSlug = '',
  limit = 8,
}: Products1Props) {
  const displayProducts = products.slice(0, limit);

  if (displayProducts.length === 0) return null;

  return (
    <section id="products" className="py-12">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
          {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {showViewAll && (
          <Link href={productsLink}>
            <Button variant="outline" className="gap-2">
              Lihat Semua <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} storeSlug={storeSlug} />
        ))}
      </div>
    </section>
  );
}
```


---

## FILE: `src/components/landing/blocks/products/products2.tsx`
> Lines: 69

```typescript
'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/store/product-card';
import type { Product } from '@/types';

interface Products2Props {
  products: Product[];
  title: string;
  subtitle?: string;
  showViewAll?: boolean;
  productsLink?: string;
  storeSlug?: string;
  limit?: number;
}

/**
 * Products Block: products2
 * Design: Grid Hover
 *
 * Enhanced grid with smooth hover animations and transitions
 * Features: Scale effect, shadow elevation, smooth transitions
 */
export function Products2({
  products,
  title,
  subtitle,
  showViewAll = true,
  productsLink = '/products',
  storeSlug = '',
  limit = 8,
}: Products2Props) {
  const displayProducts = products.slice(0, limit);

  if (displayProducts.length === 0) return null;

  return (
    <section id="products" className="py-12">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
          {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {showViewAll && (
          <Link href={productsLink}>
            <Button variant="outline" className="gap-2">
              Lihat Semua <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>

      {/* Products Grid with Enhanced Hover Effects */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {displayProducts.map((product) => (
          <div
            key={product.id}
            className="group transition-all duration-300 hover:scale-105 hover:z-10"
          >
            <ProductCard product={product} storeSlug={storeSlug} />
          </div>
        ))}
      </div>
    </section>
  );
}
```


---

## FILE: `src/components/landing/blocks/products/products3.tsx`
> Lines: 73

```typescript
'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/store/product-card';
import type { Product } from '@/types';

interface Products3Props {
  products: Product[];
  title: string;
  subtitle?: string;
  showViewAll?: boolean;
  productsLink?: string;
  storeSlug?: string;
  limit?: number;
}

/**
 * Products Block: products3
 * Design: Masonry
 *
 * Pinterest-style masonry layout with staggered heights
 * Creates a dynamic, visually interesting grid
 */
export function Products3({
  products,
  title,
  subtitle,
  showViewAll = true,
  productsLink = '/products',
  storeSlug = '',
  limit = 8,
}: Products3Props) {
  const displayProducts = products.slice(0, limit);

  if (displayProducts.length === 0) return null;

  return (
    <section id="products" className="py-12">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
          {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {showViewAll && (
          <Link href={productsLink}>
            <Button variant="outline" className="gap-2">
              Lihat Semua <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>

      {/* Masonry Grid - Uses CSS columns for masonry effect */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-6 space-y-4 md:space-y-6">
        {displayProducts.map((product, index) => (
          <div
            key={product.id}
            className="break-inside-avoid mb-4 md:mb-6"
            style={{
              // Alternate heights for masonry effect
              minHeight: index % 3 === 0 ? '320px' : index % 2 === 0 ? '280px' : '300px',
            }}
          >
            <ProductCard product={product} storeSlug={storeSlug} />
          </div>
        ))}
      </div>
    </section>
  );
}
```


---

## FILE: `src/components/landing/blocks/products/products4.tsx`
> Lines: 85

```typescript
'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/store/product-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import type { Product } from '@/types';

interface Products4Props {
  products: Product[];
  title: string;
  subtitle?: string;
  showViewAll?: boolean;
  productsLink?: string;
  storeSlug?: string;
  limit?: number;
}

/**
 * Products Block: products4
 * Design: Carousel
 *
 * Carousel/slider layout for products
 * Allows horizontal scrolling through products
 */
export function Products4({
  products,
  title,
  subtitle,
  showViewAll = true,
  productsLink = '/products',
  storeSlug = '',
  limit = 8,
}: Products4Props) {
  const displayProducts = products.slice(0, limit);

  if (displayProducts.length === 0) return null;

  return (
    <section id="products" className="py-12">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
          {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {showViewAll && (
          <Link href={productsLink}>
            <Button variant="outline" className="gap-2">
              Lihat Semua <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>

      {/* Products Carousel */}
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {displayProducts.map((product) => (
            <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
              <ProductCard product={product} storeSlug={storeSlug} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious className="-left-4" />
          <CarouselNext className="-right-4" />
        </div>
      </Carousel>
    </section>
  );
}
```


---

## FILE: `src/components/landing/blocks/products/products5.tsx`
> Lines: 78

```typescript
'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/store/product-card';
import type { Product } from '@/types';

interface Products5Props {
  products: Product[];
  title: string;
  subtitle?: string;
  showViewAll?: boolean;
  productsLink?: string;
  storeSlug?: string;
  limit?: number;
}

/**
 * Products Block: products5
 * Design: Catalog
 *
 * Magazine/lookbook style layout with larger featured items
 * First item is featured, rest in smaller grid
 */
export function Products5({
  products,
  title,
  subtitle,
  showViewAll = true,
  productsLink = '/products',
  storeSlug = '',
  limit = 9,
}: Products5Props) {
  const displayProducts = products.slice(0, limit);

  if (displayProducts.length === 0) return null;

  const [featuredProduct, ...restProducts] = displayProducts;

  return (
    <section id="products" className="py-12">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
          {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {showViewAll && (
          <Link href={productsLink}>
            <Button variant="outline" className="gap-2">
              Lihat Semua <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>

      {/* Catalog Layout */}
      <div className="space-y-6">
        {/* Featured Product - Large */}
        {featuredProduct && (
          <div className="w-full">
            <ProductCard product={featuredProduct} storeSlug={storeSlug} />
          </div>
        )}

        {/* Rest Products - Smaller Grid */}
        {restProducts.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {restProducts.map((product) => (
              <ProductCard key={product.id} product={product} storeSlug={storeSlug} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
```


---

## FILE: `src/components/landing/blocks/products/products6.tsx`
> Lines: 118

```typescript
'use client';

import Link from 'next/link';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStoreUrls } from '@/lib/store-url';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { getImageSource } from '@/lib/cloudinary';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

interface Products6Props {
  products: Product[];
  title: string;
  subtitle?: string;
  showViewAll?: boolean;
  productsLink?: string;
  storeSlug?: string;
  limit?: number;
}

/**
 * Products Block: products6
 * Design: Minimal List
 *
 * Clean list view with minimal design
 * Great for showcasing product names and prices
 */
export function Products6({
  products,
  title,
  subtitle,
  showViewAll = true,
  productsLink = '/products',
  storeSlug = '',
  limit = 8,
}: Products6Props) {
  const displayProducts = products.slice(0, limit);
  const urls = storeSlug ? useStoreUrls(storeSlug) : null;

  if (displayProducts.length === 0) return null;

  return (
    <section id="products" className="py-12">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
          {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {showViewAll && (
          <Link href={productsLink}>
            <Button variant="outline" className="gap-2">
              Lihat Semua <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>

      {/* Minimal List */}
      <div className="space-y-4">
        {displayProducts.map((product) => {
          const { type, src: url } = getImageSource(product.images?.[0]);
          const productUrl = urls?.product(product.id) || `/store/${storeSlug}/products/${product.id}`;

          return (
            <Link
              key={product.id}
              href={productUrl}
              className="flex items-center gap-4 p-4 rounded-lg border hover:border-primary transition-colors group"
            >
              {/* Product Image - Small */}
              <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden bg-muted">
                {type !== 'none' ? (
                  <OptimizedImage
                    src={url}
                    alt={product.name}
                    width={64}
                    height={64}
                    crop="fill"
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-grow min-w-0">
                <h3 className="font-medium truncate group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                {product.description && (
                  <p className="text-sm text-muted-foreground truncate">{product.description}</p>
                )}
              </div>

              {/* Price */}
              <div className="flex-shrink-0 text-right">
                <p className="font-bold text-lg">{formatPrice(product.price)}</p>
                {product.stock !== undefined && product.stock !== null && (
                  <p className="text-xs text-muted-foreground">
                    {product.stock > 0 ? `${product.stock} tersedia` : 'Habis'}
                  </p>
                )}
              </div>

              {/* Arrow Icon */}
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
```


---

## FILE: `src/components/landing/blocks/products/products7.tsx`
> Lines: 245

```typescript
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Star, TrendingUp, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { formatPrice } from '@/lib/utils';
import { useStoreUrls } from '@/lib/store-url';
import { getImageSource } from '@/lib/cloudinary';
import type { Product } from '@/types';

interface Products7Props {
  products: Product[];
  title: string;
  subtitle?: string;
  showViewAll?: boolean;
  productsLink?: string;
  storeSlug?: string;
  limit?: number;
}

/**
 * Products Block: products7
 * Design: Featured Hero
 *
 * Hero-style product showcase with one large featured product
 * and smaller secondary products in a grid
 * Perfect for highlighting bestsellers or new arrivals
 */
export function Products7({
  products,
  title,
  subtitle,
  showViewAll = true,
  productsLink = '/products',
  storeSlug,
  limit = 5,
}: Products7Props) {
  const urls = storeSlug ? useStoreUrls(storeSlug) : null;

  const displayProducts = products.slice(0, limit);
  const featuredProduct = displayProducts[0];
  const secondaryProducts = displayProducts.slice(1, 5);

  if (!featuredProduct) {
    return (
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
            {subtitle && (
              <p className="text-muted-foreground mb-8">{subtitle}</p>
            )}
            <p className="text-muted-foreground">No products available yet.</p>
          </div>
        </div>
      </section>
    );
  }

  const { type: featuredType, src: featuredUrl } = getImageSource(featuredProduct.images?.[0]);
  const featuredProductUrl = urls?.product(featuredProduct.id) || `/store/${storeSlug}/products/${featuredProduct.id}`;

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="secondary" className="mb-4">
            <TrendingUp className="h-3 w-3 mr-1" />
            Featured Collection
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">{title}</h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
          {/* Featured Product - Large */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <Link
              href={featuredProductUrl}
              className="group block h-full"
            >
              <div className="relative h-[500px] lg:h-[600px] rounded-3xl overflow-hidden bg-muted border border-border">
                {/* Image */}
                {featuredType !== 'none' ? (
                  <OptimizedImage
                    src={featuredUrl}
                    alt={featuredProduct.name}
                    fill
                    crop="fill"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <span className="text-8xl">📦</span>
                  </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Badges */}
                <div className="absolute top-6 left-6 flex gap-2">
                  <Badge className="bg-primary/90 backdrop-blur-sm">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Featured
                  </Badge>
                  {featuredProduct.stock && featuredProduct.stock < 10 && (
                    <Badge variant="destructive" className="backdrop-blur-sm">
                      Low Stock
                    </Badge>
                  )}
                </div>

                {/* Wishlist Button */}
                <button className="absolute top-6 right-6 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors">
                  <Heart className="h-5 w-5" />
                </button>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-2xl md:text-4xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                    {featuredProduct.name}
                  </h3>
                  {featuredProduct.description && (
                    <p className="text-white/80 mb-4 line-clamp-2 max-w-xl">
                      {featuredProduct.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-white">
                      {formatPrice(featuredProduct.price)}
                    </div>
                    <Button size="lg" className="group/btn">
                      View Product
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Secondary Products - Grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-5"
          >
            <div className="grid grid-cols-2 gap-4 h-full">
              {secondaryProducts.map((product, index) => {
                const { type, src: url } = getImageSource(product.images?.[0]);
                const productUrl = urls?.product(product.id) || `/store/${storeSlug}/products/${product.id}`;

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                  >
                    <Link
                      href={productUrl}
                      className="group block h-full"
                    >
                      <div className="h-[145px] lg:h-[290px] rounded-2xl overflow-hidden bg-muted border border-border hover:border-primary transition-colors">
                        {/* Image */}
                        <div className="relative h-2/3">
                          {type !== 'none' ? (
                            <OptimizedImage
                              src={url}
                              alt={product.name}
                              fill
                              crop="fill"
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                              <span className="text-4xl">📦</span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-3 lg:p-4 h-1/3 flex flex-col justify-center">
                          <h4 className="font-semibold text-sm lg:text-base line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                            {product.name}
                          </h4>
                          <p className="font-bold text-base lg:text-lg">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* View All Button */}
        {showViewAll && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"
          >
            <Button size="lg" variant="outline" asChild className="group">
              <Link href={productsLink}>
                View All Products
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
```


---

# 💬 TESTIMONIALS BLOCKS


---

## FILE: `src/components/landing/blocks/testimonials/index.ts`
> Lines: 14

```typescript
/**
 * Testimonials Section Blocks
 *
 * v3.0 Numbering System
 * See MAPPING.md for design name references
 */

export * from './testimonials1'; // Grid Cards
export * from './testimonials2'; // Card Slider
export * from './testimonials3'; // Quote Highlight
export * from './testimonials4'; // Single Focus
export * from './testimonials5'; // Video
export * from './testimonials6'; // Social Proof
export * from './testimonials7'; // Marquee
```


---

## FILE: `src/components/landing/blocks/testimonials/testimonials1.tsx`
> Lines: 101

```typescript
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, Quote } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { getImageSource } from '@/lib/cloudinary';
import type { Testimonial } from '@/types';

interface Testimonials1Props {
  items: Testimonial[];
  title: string;
  subtitle?: string;
}

/**
 * Testimonials Block: testimonials1
 * Design: Grid Cards
 *
 * Enhanced grid layout with hover animations and shadows
 * Modern card design with smooth transitions
 */
export function Testimonials1({
  items,
  title,
  subtitle,
}: Testimonials1Props) {
  if (items.length === 0) return null;

  return (
    <section id="testimonials" className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => {
          const key = item.id || `testimonial-${index}-${item.name.replace(/\s+/g, '-')}`;
          const { type: avatarType } = getImageSource(item.avatar);

          return (
            <Card
              key={key}
              className="relative group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="pt-6">
                <Quote className="h-8 w-8 text-primary/20 absolute top-4 right-4 group-hover:text-primary/40 transition-colors" />

                {typeof item.rating === 'number' && item.rating > 0 && (
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={`${key}-star-${i}`}
                        className={`h-4 w-4 transition-all ${
                          i < item.rating!
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-muted'
                        }`}
                      />
                    ))}
                  </div>
                )}

                <p className="text-muted-foreground mb-4 italic">
                  &quot;{item.content}&quot;
                </p>

                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 overflow-hidden group-hover:ring-2 group-hover:ring-primary/50 transition-all">
                    {avatarType !== 'none' ? (
                      <OptimizedImage
                        src={item.avatar}
                        alt={item.name}
                        width={40}
                        height={40}
                        crop="thumb"
                        gravity="face"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <AvatarFallback>
                        {item.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    {item.role && (
                      <p className="text-sm text-muted-foreground">{item.role}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
```


---

## FILE: `src/components/landing/blocks/testimonials/testimonials2.tsx`
> Lines: 162

```typescript
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { getImageSource } from '@/lib/cloudinary';
import { useState } from 'react';
import type { Testimonial } from '@/types';

interface Testimonials2Props {
  items: Testimonial[];
  title: string;
  subtitle?: string;
}

/**
 * Testimonials Block: testimonials2
 * Design: Card Slider
 *
 * Carousel-style slider with navigation controls
 * Shows 1-3 testimonials at a time based on screen size
 */
export function Testimonials2({
  items,
  title,
  subtitle,
}: Testimonials2Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (items.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  // Get 3 items starting from currentIndex (with wrap around)
  const visibleItems = [
    items[currentIndex],
    items[(currentIndex + 1) % items.length],
    items[(currentIndex + 2) % items.length],
  ];

  return (
    <section id="testimonials" className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
      </div>

      {/* Slider Container */}
      <div className="relative">
        {/* Navigation Buttons */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-10 px-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrev}
            className="pointer-events-auto rounded-full shadow-lg"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            className="pointer-events-auto rounded-full shadow-lg"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-12">
          {visibleItems.map((item, index) => {
            const key = item.id || `testimonial-${currentIndex + index}`;
            const { type: avatarType } = getImageSource(item.avatar);

            return (
              <Card
                key={key}
                className={`relative transition-all duration-300 ${
                  index === 0 ? 'md:opacity-100' : 'hidden md:block md:opacity-70'
                }`}
              >
                <CardContent className="pt-6">
                  <Quote className="h-8 w-8 text-primary/20 absolute top-4 right-4" />

                  {typeof item.rating === 'number' && item.rating > 0 && (
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={`${key}-star-${i}`}
                          className={`h-4 w-4 ${
                            i < item.rating!
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-muted'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  <p className="text-muted-foreground mb-4 italic">
                    &quot;{item.content}&quot;
                  </p>

                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 overflow-hidden">
                      {avatarType !== 'none' ? (
                        <OptimizedImage
                          src={item.avatar}
                          alt={item.name}
                          width={40}
                          height={40}
                          crop="thumb"
                          gravity="face"
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <AvatarFallback>
                          {item.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      {item.role && (
                        <p className="text-sm text-muted-foreground">{item.role}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-primary'
                  : 'w-2 bg-muted-foreground/30'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
```


---

## FILE: `src/components/landing/blocks/testimonials/testimonials3.tsx`
> Lines: 156

```typescript
'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, Quote } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { getImageSource } from '@/lib/cloudinary';
import type { Testimonial } from '@/types';

interface Testimonials3Props {
  items: Testimonial[];
  title: string;
  subtitle?: string;
}

/**
 * Testimonials Block: testimonials3
 * Design: Quote Highlight
 *
 * Large featured quote style with emphasis on the testimonial text
 * Perfect for showcasing powerful customer feedback
 */
export function Testimonials3({
  items,
  title,
  subtitle,
}: Testimonials3Props) {
  if (items.length === 0) return null;

  // Feature first testimonial, show others in grid
  const [featured, ...rest] = items;

  return (
    <section id="testimonials" className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
      </div>

      {/* Featured Quote */}
      {featured && (
        <div className="mb-12 max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-8 md:p-12">
            <Quote className="h-16 w-16 text-primary/20 absolute top-6 left-6" />

            {typeof featured.rating === 'number' && featured.rating > 0 && (
              <div className="flex gap-1 justify-center mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={`featured-star-${i}`}
                    className={`h-6 w-6 ${
                      i < featured.rating!
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-muted'
                    }`}
                  />
                ))}
              </div>
            )}

            <blockquote className="text-xl md:text-2xl font-medium text-center mb-8 relative z-10">
              &quot;{featured.content}&quot;
            </blockquote>

            <div className="flex items-center justify-center gap-4">
              <Avatar className="h-12 w-12 overflow-hidden">
                {(() => {
                  const { type: avatarType } = getImageSource(featured.avatar);
                  return avatarType !== 'none' ? (
                    <OptimizedImage
                      src={featured.avatar}
                      alt={featured.name}
                      width={48}
                      height={48}
                      crop="thumb"
                      gravity="face"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <AvatarFallback className="text-lg">
                      {featured.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  );
                })()}
              </Avatar>
              <div className="text-center">
                <p className="font-semibold">{featured.name}</p>
                {featured.role && (
                  <p className="text-sm text-muted-foreground">{featured.role}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Additional Testimonials in Grid */}
      {rest.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((item) => {
            const key = item.id || `testimonial-${item.name.replace(/\s+/g, '-')}`;
            const { type: avatarType } = getImageSource(item.avatar);

            return (
              <div key={key} className="border rounded-lg p-6">
                {typeof item.rating === 'number' && item.rating > 0 && (
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={`${key}-star-${i}`}
                        className={`h-4 w-4 ${
                          i < item.rating!
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-muted'
                        }`}
                      />
                    ))}
                  </div>
                )}

                <p className="text-muted-foreground mb-4 text-sm italic">
                  &quot;{item.content}&quot;
                </p>

                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 overflow-hidden">
                    {avatarType !== 'none' ? (
                      <OptimizedImage
                        src={item.avatar}
                        alt={item.name}
                        width={32}
                        height={32}
                        crop="thumb"
                        gravity="face"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <AvatarFallback className="text-xs">
                        {item.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    {item.role && (
                      <p className="text-xs text-muted-foreground">{item.role}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
```


---

## FILE: `src/components/landing/blocks/testimonials/testimonials4.tsx`
> Lines: 156

```typescript
'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { getImageSource } from '@/lib/cloudinary';
import { useState } from 'react';
import type { Testimonial } from '@/types';

interface Testimonials4Props {
  items: Testimonial[];
  title: string;
  subtitle?: string;
}

/**
 * Testimonials Block: testimonials4
 * Design: Single Focus
 *
 * One testimonial at a time, centered and prominent
 * Perfect for highlighting detailed customer stories
 */
export function Testimonials4({
  items,
  title,
  subtitle,
}: Testimonials4Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (items.length === 0) return null;

  const currentItem = items[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const { type: avatarType } = getImageSource(currentItem.avatar);

  return (
    <section id="testimonials" className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
      </div>

      {/* Single Testimonial Container */}
      <div className="max-w-3xl mx-auto">
        <div className="relative bg-card rounded-2xl p-8 md:p-12 border shadow-lg">
          <Quote className="h-16 w-16 text-primary/10 absolute top-4 left-4" />
          <Quote className="h-16 w-16 text-primary/10 absolute bottom-4 right-4 rotate-180" />

          {/* Rating */}
          {typeof currentItem.rating === 'number' && currentItem.rating > 0 && (
            <div className="flex gap-2 justify-center mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={`star-${i}`}
                  className={`h-6 w-6 ${
                    i < currentItem.rating!
                      ? 'text-yellow-500 fill-yellow-500'
                      : 'text-muted'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Testimonial Content */}
          <blockquote className="text-lg md:text-xl text-center mb-8 relative z-10 leading-relaxed">
            &quot;{currentItem.content}&quot;
          </blockquote>

          {/* Author */}
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-16 w-16 overflow-hidden">
              {avatarType !== 'none' ? (
                <OptimizedImage
                  src={currentItem.avatar}
                  alt={currentItem.name}
                  width={64}
                  height={64}
                  crop="thumb"
                  gravity="face"
                  className="object-cover w-full h-full"
                />
              ) : (
                <AvatarFallback className="text-xl">
                  {currentItem.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="text-center">
              <p className="font-semibold text-lg">{currentItem.name}</p>
              {currentItem.role && (
                <p className="text-muted-foreground">{currentItem.role}</p>
              )}
            </div>
          </div>

          {/* Navigation Arrows */}
          {items.length > 1 && (
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between px-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrev}
                className="rounded-full hover:bg-primary/10"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                className="rounded-full hover:bg-primary/10"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          )}
        </div>

        {/* Dots Indicator */}
        {items.length > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-8 bg-primary'
                    : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Counter */}
        {items.length > 1 && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            {currentIndex + 1} / {items.length}
          </p>
        )}
      </div>
    </section>
  );
}
```


---

## FILE: `src/components/landing/blocks/testimonials/testimonials5.tsx`
> Lines: 123

```typescript
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, Play } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { getImageSource } from '@/lib/cloudinary';
import type { Testimonial } from '@/types';

interface Testimonials5Props {
  items: Testimonial[];
  title: string;
  subtitle?: string;
}

/**
 * Testimonials Block: testimonials5
 * Design: Video Testimonials
 *
 * Layout designed for video testimonials
 * Shows video placeholders with play buttons
 * Falls back to text testimonials with enhanced styling
 */
export function Testimonials5({
  items,
  title,
  subtitle,
}: Testimonials5Props) {
  if (items.length === 0) return null;

  return (
    <section id="testimonials" className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => {
          const key = item.id || `testimonial-${index}-${item.name.replace(/\s+/g, '-')}`;
          const { type: avatarType } = getImageSource(item.avatar);

          return (
            <Card key={key} className="relative overflow-hidden group">
              {/* Video Placeholder / Thumbnail */}
              <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                {avatarType !== 'none' ? (
                  <>
                    <OptimizedImage
                      src={item.avatar}
                      alt={item.name}
                      width={400}
                      height={225}
                      crop="fill"
                      className="object-cover w-full h-full opacity-40 group-hover:opacity-60 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer">
                        <Play className="h-8 w-8 text-white ml-1" />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer">
                    <Play className="h-8 w-8 text-white ml-1" />
                  </div>
                )}
              </div>

              {/* Content */}
              <CardContent className="pt-6">
                {typeof item.rating === 'number' && item.rating > 0 && (
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={`${key}-star-${i}`}
                        className={`h-4 w-4 ${
                          i < item.rating!
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-muted'
                        }`}
                      />
                    ))}
                  </div>
                )}

                <p className="text-sm text-muted-foreground mb-4 line-clamp-3 italic">
                  &quot;{item.content}&quot;
                </p>

                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 overflow-hidden">
                    {avatarType !== 'none' ? (
                      <OptimizedImage
                        src={item.avatar}
                        alt={item.name}
                        width={40}
                        height={40}
                        crop="thumb"
                        gravity="face"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <AvatarFallback>
                        {item.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    {item.role && (
                      <p className="text-sm text-muted-foreground">{item.role}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
```


---

## FILE: `src/components/landing/blocks/testimonials/testimonials6.tsx`
> Lines: 110

```typescript
'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, Heart, MessageCircle } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { getImageSource } from '@/lib/cloudinary';
import type { Testimonial } from '@/types';

interface Testimonials6Props {
  items: Testimonial[];
  title: string;
  subtitle?: string;
}

/**
 * Testimonials Block: testimonials6
 * Design: Social Proof
 *
 * Social media-inspired layout
 * Compact cards with social engagement indicators
 */
export function Testimonials6({
  items,
  title,
  subtitle,
}: Testimonials6Props) {
  if (items.length === 0) return null;

  return (
    <section id="testimonials" className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {items.map((item, index) => {
          const key = item.id || `testimonial-${index}-${item.name.replace(/\s+/g, '-')}`;
          const { type: avatarType } = getImageSource(item.avatar);

          return (
            <div
              key={key}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-card"
            >
              {/* Header - Author Info */}
              <div className="flex items-start gap-3 mb-3">
                <Avatar className="h-10 w-10 overflow-hidden flex-shrink-0">
                  {avatarType !== 'none' ? (
                    <OptimizedImage
                      src={item.avatar}
                      alt={item.name}
                      width={40}
                      height={40}
                      crop="thumb"
                      gravity="face"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <AvatarFallback>
                      {item.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-grow min-w-0">
                  <p className="font-semibold text-sm">{item.name}</p>
                  {item.role && (
                    <p className="text-xs text-muted-foreground truncate">{item.role}</p>
                  )}
                  {typeof item.rating === 'number' && item.rating > 0 && (
                    <div className="flex gap-0.5 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={`${key}-star-${i}`}
                          className={`h-3 w-3 ${
                            i < item.rating!
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-muted'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <p className="text-sm mb-3 leading-relaxed">{item.content}</p>

              {/* Social Engagement Indicators */}
              <div className="flex items-center gap-4 text-muted-foreground">
                <button className="flex items-center gap-1 text-xs hover:text-red-500 transition-colors">
                  <Heart className="h-3.5 w-3.5" />
                  <span>{Math.floor(Math.random() * 50) + 10}</span>
                </button>
                <button className="flex items-center gap-1 text-xs hover:text-primary transition-colors">
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>{Math.floor(Math.random() * 20) + 1}</span>
                </button>
                <span className="text-xs ml-auto">
                  {Math.floor(Math.random() * 30) + 1}h yang lalu
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
```


---

## FILE: `src/components/landing/blocks/testimonials/testimonials7.tsx`
> Lines: 212

```typescript
'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import { getImageSource } from '@/lib/cloudinary';
import type { Testimonial } from '@/types';

interface Testimonials7Props {
  items: Testimonial[];
  title: string;
  subtitle?: string;
}

/**
 * Testimonials Block: testimonials7
 * Design: Marquee
 *
 * Infinite scrolling testimonials with smooth marquee animation
 * Modern and dynamic presentation
 * Inspired by Stripe and Linear design
 */
export function Testimonials7({
  items,
  title,
  subtitle,
}: Testimonials7Props) {
  // Duplicate items for seamless infinite scroll
  const duplicatedItems = [...items, ...items, ...items];

  if (!items || items.length === 0) {
    return (
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
            {subtitle && (
              <p className="text-muted-foreground mb-8">{subtitle}</p>
            )}
            <p className="text-muted-foreground">No testimonials yet.</p>
          </div>
        </div>
      </section>
    );
  }

  const renderTestimonialCard = (item: Testimonial, index: number) => {
    const { type: avatarType, src: avatarUrl } = getImageSource(item.avatar);

    return (
      <div
        key={`${item.id}-${index}`}
        className="flex-shrink-0 w-[350px] md:w-[400px] mx-4"
      >
        <div className="h-full bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all hover:shadow-lg">
          {/* Stars */}
          {item.rating && (
            <div className="flex gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < item.rating!
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-muted text-muted'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Content */}
          <div className="relative mb-6">
            <Quote className="absolute -top-2 -left-2 h-8 w-8 text-primary/10" />
            <p className="text-muted-foreground leading-relaxed pl-6">
              {item.content}
            </p>
          </div>

          {/* Author */}
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              {avatarType !== 'none' ? (
                <OptimizedImage
                  src={avatarUrl}
                  alt={item.name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-semibold">
                  {item.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold">{item.name}</p>
              {item.role && (
                <p className="text-sm text-muted-foreground">{item.role}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30 overflow-hidden">
      <div className="container px-4 mb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <Badge variant="secondary" className="mb-4">
            <Star className="h-3 w-3 mr-1 fill-current" />
            Customer Reviews
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">{title}</h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground">{subtitle}</p>
          )}
        </motion.div>
      </div>

      {/* Marquee Container */}
      <div className="relative">
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        {/* First Row - Left to Right */}
        <motion.div
          animate={{
            x: ['0%', '-33.333%'],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="flex mb-6"
        >
          {duplicatedItems.map((item, index) =>
            renderTestimonialCard(item, index)
          )}
        </motion.div>

        {/* Second Row - Right to Left (if enough items) */}
        {items.length > 3 && (
          <motion.div
            animate={{
              x: ['-33.333%', '0%'],
            }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="flex"
          >
            {duplicatedItems.map((item, index) =>
              renderTestimonialCard(item, index + duplicatedItems.length)
            )}
          </motion.div>
        )}
      </div>

      {/* Bottom Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="container px-4 mt-16"
      >
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-bold mb-2">4.9</p>
            <div className="flex gap-1 mb-2 justify-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">Average Rating</p>
          </div>

          <div className="text-center">
            <p className="text-4xl md:text-5xl font-bold mb-2">
              {items.length}+
            </p>
            <p className="text-sm text-muted-foreground">Happy Customers</p>
          </div>

          <div className="text-center">
            <p className="text-4xl md:text-5xl font-bold mb-2">100%</p>
            <p className="text-sm text-muted-foreground">Satisfaction</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
```


---

# 📞 CONTACT BLOCKS


---

## FILE: `src/components/landing/blocks/contact/index.ts`
> Lines: 14

```typescript
/**
 * Contact Section Blocks
 *
 * v3.0 Numbering System
 * See MAPPING.md for design name references
 */

export * from './contact1'; // Default
export * from './contact2'; // Split Form
export * from './contact3'; // Centered
export * from './contact4'; // Map Focus
export * from './contact5'; // Minimal
export * from './contact6'; // Social Focused
export * from './contact7'; // Card Grid
```


---

## FILE: `src/components/landing/blocks/contact/contact1.tsx`
> Lines: 105

```typescript
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, MapPin, MessageCircle } from 'lucide-react';

interface Contact1Props {
  title: string;
  subtitle?: string;
  whatsapp?: string | null;
  phone?: string | null;
  address?: string | null;
  storeName?: string;
}

/**
 * Contact Block: contact1
 * Design: Default
 *
 * Classic contact card layout (original design)
 */
export function Contact1({
  title,
  subtitle,
  whatsapp,
  phone,
  address,
  storeName,
}: Contact1Props) {
  const whatsappLink = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Halo ${storeName || ''}, saya tertarik dengan produk Anda.`)}`
    : null;

  return (
    <section id="contact" className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4">
              {whatsapp && (
                <a
                  href={whatsappLink!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors dark:bg-green-950/30 dark:hover:bg-green-950/50"
                >
                  <div className="flex-shrink-0 p-3 bg-green-500 rounded-full">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <p className="text-sm text-muted-foreground">+{whatsapp}</p>
                  </div>
                </a>
              )}

              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Telepon</p>
                    <p className="text-sm text-muted-foreground">{phone}</p>
                  </div>
                </a>
              )}

              {address && (
                <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                  <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Alamat</p>
                    <p className="text-sm text-muted-foreground">{address}</p>
                  </div>
                </div>
              )}
            </div>

            {whatsappLink && (
              <div className="mt-6 text-center">
                <Button asChild size="lg" className="gap-2">
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-5 w-5" />
                    Chat via WhatsApp
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
```


---

## FILE: `src/components/landing/blocks/contact/contact2.tsx`
> Lines: 101

```typescript
'use client';

import { Button } from '@/components/ui/button';
import { Phone, MapPin, MessageCircle } from 'lucide-react';
import type { TenantLandingConfig } from '@/types';

interface Contact2Props {
  title: string;
  subtitle?: string;
  whatsapp?: string | null;
  phone?: string | null;
  address?: string | null;
  storeName?: string;
}

/**
 * Contact Block: contact2
 * Design: Split Form
 *
 * Split layout with contact info on left, form/CTA on right
 */
export function Contact2({
  title,
  subtitle,
  whatsapp,
  phone,
  address,
  storeName,
}: Contact2Props) {
  const whatsappLink = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Halo ${storeName || ''}, saya tertarik dengan produk Anda.`)}`
    : null;

  return (
    <section id="contact" className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: Contact Info */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold mb-4">Informasi Kontak</h3>

          {whatsapp && (
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-3 bg-green-500/10 rounded-full">
                <MessageCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="font-medium">WhatsApp</p>
                <p className="text-sm text-muted-foreground">+{whatsapp}</p>
              </div>
            </div>
          )}

          {phone && (
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">Telepon</p>
                <p className="text-sm text-muted-foreground">{phone}</p>
              </div>
            </div>
          )}

          {address && (
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">Alamat</p>
                <p className="text-sm text-muted-foreground">{address}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right: CTA Card */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-8">
          <h3 className="text-xl font-semibold mb-4">Hubungi Kami</h3>
          <p className="text-muted-foreground mb-6">
            Punya pertanyaan? Tim kami siap membantu Anda. Hubungi kami melalui WhatsApp untuk respons cepat!
          </p>
          {whatsappLink && (
            <Button asChild size="lg" className="w-full gap-2">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" />
                Chat via WhatsApp
              </a>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
```


---

## FILE: `src/components/landing/blocks/contact/contact3.tsx`
> Lines: 75

```typescript
'use client';

import { Button } from '@/components/ui/button';
import { Phone, MapPin, MessageCircle } from 'lucide-react';

interface Contact3Props {
  title: string;
  subtitle?: string;
  whatsapp?: string | null;
  phone?: string | null;
  address?: string | null;
  storeName?: string;
}

/**
 * Contact Block: contact3
 * Design: Centered
 *
 * Centered minimal contact layout
 */
export function Contact3({
  title,
  subtitle,
  whatsapp,
  phone,
  address,
  storeName,
}: Contact3Props) {
  const whatsappLink = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Halo ${storeName || ''}, saya tertarik dengan produk Anda.`)}`
    : null;

  return (
    <section id="contact" className="py-12">
      <div className="text-center mb-8 max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
      </div>

      <div className="max-w-xl mx-auto space-y-4">
        {whatsapp && (
          <div className="flex items-center justify-center gap-3 p-4">
            <MessageCircle className="h-5 w-5 text-green-500" />
            <span className="font-medium">+{whatsapp}</span>
          </div>
        )}

        {phone && (
          <div className="flex items-center justify-center gap-3 p-4">
            <Phone className="h-5 w-5 text-primary" />
            <span className="font-medium">{phone}</span>
          </div>
        )}

        {address && (
          <div className="flex items-center justify-center gap-3 p-4 text-center">
            <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
            <span className="text-muted-foreground">{address}</span>
          </div>
        )}

        {whatsappLink && (
          <div className="text-center pt-4">
            <Button asChild size="lg" className="gap-2">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" />
                Chat via WhatsApp
              </a>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
```


---

## FILE: `src/components/landing/blocks/contact/contact4.tsx`
> Lines: 85

```typescript
'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, MapPin, MessageCircle } from 'lucide-react';

interface Contact4Props {
  title: string;
  subtitle?: string;
  whatsapp?: string | null;
  phone?: string | null;
  address?: string | null;
  storeName?: string;
}

/**
 * Contact Block: contact4
 * Design: Map Focus
 *
 * Large map placeholder with contact overlay
 */
export function Contact4({
  title,
  subtitle,
  whatsapp,
  phone,
  address,
  storeName,
}: Contact4Props) {
  const whatsappLink = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Halo ${storeName || ''}, saya tertarik dengan produk Anda.`)}`
    : null;

  return (
    <section id="contact" className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
      </div>

      <div className="relative">
        {/* Map Placeholder */}
        <div className="w-full h-96 bg-muted rounded-xl flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <MapPin className="h-12 w-12 mx-auto mb-2" />
            <p>Map Integration Placeholder</p>
          </div>
        </div>

        {/* Contact Overlay Card */}
        <Card className="absolute bottom-4 left-4 right-4 md:right-auto md:w-96 p-6 shadow-lg">
          <h3 className="font-semibold mb-4">Lokasi & Kontak</h3>
          <div className="space-y-3">
            {address && (
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                <p className="text-sm">{address}</p>
              </div>
            )}
            {phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <p className="text-sm">{phone}</p>
              </div>
            )}
            {whatsapp && (
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-green-500" />
                <p className="text-sm">+{whatsapp}</p>
              </div>
            )}
          </div>
          {whatsappLink && (
            <Button asChild size="sm" className="w-full mt-4 gap-2">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" />
                Chat Sekarang
              </a>
            </Button>
          )}
        </Card>
      </div>
    </section>
  );
}
```


---

## FILE: `src/components/landing/blocks/contact/contact5.tsx`
> Lines: 55

```typescript
'use client';

import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

interface Contact5Props {
  title: string;
  subtitle?: string;
  whatsapp?: string | null;
  phone?: string | null;
  address?: string | null;
  storeName?: string;
}

/**
 * Contact Block: contact5
 * Design: Minimal
 *
 * Ultra-minimal contact section with just essential info
 */
export function Contact5({
  title,
  subtitle,
  whatsapp,
  phone,
  address,
  storeName,
}: Contact5Props) {
  const whatsappLink = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Halo ${storeName || ''}, saya tertarik dengan produk Anda.`)}`
    : null;

  return (
    <section id="contact" className="py-12">
      <div className="text-center max-w-xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">{title}</h2>
        {subtitle && <p className="text-muted-foreground mb-6">{subtitle}</p>}

        <div className="space-y-2 mb-6 text-sm text-muted-foreground">
          {phone && <p>{phone}</p>}
          {address && <p>{address}</p>}
        </div>

        {whatsappLink && (
          <Button asChild size="lg" className="gap-2">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5" />
              Hubungi Kami
            </a>
          </Button>
        )}
      </div>
    </section>
  );
}
```


---

## FILE: `src/components/landing/blocks/contact/contact6.tsx`
> Lines: 83

```typescript
'use client';

import { Button } from '@/components/ui/button';
import { Phone, MapPin, MessageCircle, Instagram, Facebook } from 'lucide-react';

interface Contact6Props {
  title: string;
  subtitle?: string;
  whatsapp?: string | null;
  phone?: string | null;
  address?: string | null;
  storeName?: string;
}

/**
 * Contact Block: contact6
 * Design: Social Focused
 *
 * Emphasizes social media and messaging platforms
 */
export function Contact6({
  title,
  subtitle,
  whatsapp,
  phone,
  address,
  storeName,
}: Contact6Props) {
  const whatsappLink = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Halo ${storeName || ''}, saya tertarik dengan produk Anda.`)}`
    : null;

  return (
    <section id="contact" className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Primary CTA - WhatsApp */}
        {whatsappLink && (
          <div className="mb-8">
            <Button asChild size="lg" className="w-full gap-2 h-14">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-6 w-6" />
                <div className="text-left">
                  <p className="font-semibold">Chat via WhatsApp</p>
                  <p className="text-xs opacity-90">Respons cepat & langsung</p>
                </div>
              </a>
            </Button>
          </div>
        )}

        {/* Other Contact Methods */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:border-primary transition-colors"
            >
              <Phone className="h-6 w-6 text-primary" />
              <p className="text-sm font-medium">Telepon</p>
            </a>
          )}
          <button className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:border-primary transition-colors">
            <Instagram className="h-6 w-6 text-primary" />
            <p className="text-sm font-medium">Instagram</p>
          </button>
        </div>

        {/* Address */}
        {address && (
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <MapPin className="h-5 w-5 mx-auto mb-2 text-primary" />
            <p className="text-sm text-muted-foreground">{address}</p>
          </div>
        )}
      </div>
    </section>
  );
}
```


---

## FILE: `src/components/landing/blocks/contact/contact7.tsx`
> Lines: 251

```typescript
'use client';

import { motion } from 'framer-motion';
import {
  Phone,
  MapPin,
  MessageCircle,
  Mail,
  Clock,
  Navigation,
  Facebook,
  Instagram,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Contact7Props {
  title: string;
  subtitle?: string;
  whatsapp?: string | null;
  phone?: string | null;
  address?: string | null;
  storeName?: string;
  email?: string | null;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
  };
}

/**
 * Contact Block: contact7
 * Design: Card Grid
 *
 * Modern card-based contact grid with multiple contact methods
 * Each card is interactive and visually distinct
 * Perfect for showcasing all contact channels
 */
export function Contact7({
  title,
  subtitle,
  whatsapp,
  phone,
  address,
  storeName,
  email,
  socialMedia,
}: Contact7Props) {
  const whatsappLink = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Halo ${storeName || ''}, saya tertarik dengan produk Anda.`)}`
    : null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      
    },
  };

  const contactCards = [
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      description: 'Chat with us instantly',
      value: whatsapp ? `+${whatsapp}` : null,
      action: whatsappLink ? () => window.open(whatsappLink, '_blank') : null,
      gradient: 'from-green-500/10 to-emerald-500/10',
      iconColor: 'text-green-600',
      show: !!whatsapp,
    },
    {
      icon: Phone,
      title: 'Phone',
      description: 'Call us directly',
      value: phone,
      action: phone ? () => window.open(`tel:${phone}`, '_blank') : null,
      gradient: 'from-blue-500/10 to-cyan-500/10',
      iconColor: 'text-blue-600',
      show: !!phone,
    },
    {
      icon: Mail,
      title: 'Email',
      description: 'Send us a message',
      value: email,
      action: email ? () => window.open(`mailto:${email}`, '_blank') : null,
      gradient: 'from-purple-500/10 to-pink-500/10',
      iconColor: 'text-purple-600',
      show: !!email,
    },
    {
      icon: MapPin,
      title: 'Address',
      description: 'Visit our location',
      value: address,
      action: address
        ? () =>
            window.open(
              `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
              '_blank'
            )
        : null,
      gradient: 'from-orange-500/10 to-red-500/10',
      iconColor: 'text-orange-600',
      show: !!address,
    },
  ];

  const visibleCards = contactCards.filter((card) => card.show);

  return (
    <section id="contact" className="py-16 md:py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="container px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="secondary" className="mb-4">
            <MessageCircle className="h-3 w-3 mr-1" />
            Get In Touch
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">{title}</h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Contact Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {visibleCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <div
                  className={`h-full bg-gradient-to-br ${card.gradient} border border-border rounded-2xl p-6 hover:border-primary/50 transition-all cursor-pointer group`}
                  onClick={card.action || undefined}
                >
                  {/* Icon */}
                  <div className={`h-12 w-12 rounded-xl bg-background/50 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${card.iconColor}`}>
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* Content */}
                  <h3 className="font-semibold text-lg mb-1">{card.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {card.description}
                  </p>
                  {card.value && (
                    <p className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                      {card.value}
                    </p>
                  )}

                  {/* Action Arrow */}
                  {card.action && (
                    <div className="mt-4 flex items-center gap-2 text-sm font-medium group-hover:text-primary transition-colors">
                      <span>Connect</span>
                      <Navigation className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Social Media Section */}
        {(socialMedia?.facebook || socialMedia?.instagram) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <p className="text-muted-foreground mb-4">Follow us on social media</p>
            <div className="flex justify-center gap-4">
              {socialMedia.facebook && (
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2"
                  onClick={() => window.open(socialMedia.facebook, '_blank')}
                >
                  <Facebook className="h-5 w-5" />
                  Facebook
                </Button>
              )}
              {socialMedia.instagram && (
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2"
                  onClick={() => window.open(socialMedia.instagram, '_blank')}
                >
                  <Instagram className="h-5 w-5" />
                  Instagram
                </Button>
              )}
            </div>
          </motion.div>
        )}

        {/* Business Hours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-muted/50 rounded-full px-6 py-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Available Monday - Saturday, 9:00 AM - 6:00 PM
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```


---

# 🚀 CTA BLOCKS


---

## FILE: `src/components/landing/blocks/cta/index.ts`
> Lines: 14

```typescript
/**
 * CTA Section Blocks
 *
 * v3.0 Numbering System
 * See MAPPING.md for design name references
 */

export * from './cta1'; // Default
export * from './cta2'; // Bold Center
export * from './cta3'; // Gradient Banner
export * from './cta4'; // Split Action
export * from './cta5'; // Floating
export * from './cta6'; // Minimal Line
export * from './cta7'; // Countdown
```


---

## FILE: `src/components/landing/blocks/cta/cta1.tsx`
> Lines: 42

```typescript
'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Cta1Props {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
  buttonVariant: 'default' | 'secondary' | 'outline';
}

/**
 * CTA Block: cta1
 * Design: Default
 *
 * Classic gradient banner CTA
 */
export function Cta1({
  title,
  subtitle,
  buttonText,
  buttonLink,
  buttonVariant,
}: Cta1Props) {
  return (
    <section className="py-16 my-8 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
      <div className="text-center max-w-2xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-2 mb-6">{subtitle}</p>}
        <Link href={buttonLink}>
          <Button size="lg" variant={buttonVariant} className="gap-2 mt-4">
            {buttonText}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
```


---

## FILE: `src/components/landing/blocks/cta/cta2.tsx`
> Lines: 48

```typescript
'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Cta2Props {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
  buttonVariant: 'default' | 'secondary' | 'outline';
}

/**
 * CTA Block: cta2
 * Design: Bold Center
 *
 * Large, bold centered CTA with prominent typography
 */
export function Cta2({
  title,
  subtitle,
  buttonText,
  buttonLink,
  buttonVariant,
}: Cta2Props) {
  return (
    <section className="py-20 my-8">
      <div className="text-center max-w-4xl mx-auto px-4">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          {title}
        </h2>
        {subtitle && (
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        <Link href={buttonLink}>
          <Button size="lg" variant={buttonVariant} className="gap-2 h-14 px-8 text-lg">
            {buttonText}
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
```


---

## FILE: `src/components/landing/blocks/cta/cta3.tsx`
> Lines: 53

```typescript
'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Cta3Props {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
  buttonVariant: 'default' | 'secondary' | 'outline';
}

/**
 * CTA Block: cta3
 * Design: Gradient Banner
 *
 * Full-width animated gradient banner
 */
export function Cta3({
  title,
  subtitle,
  buttonText,
  buttonLink,
  buttonVariant,
}: Cta3Props) {
  return (
    <section className="py-16 my-8 rounded-2xl bg-gradient-to-r from-primary via-primary/80 to-primary animate-gradient-x relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
      </div>

      <div className="text-center max-w-2xl mx-auto px-4 relative z-10">
        <h2 className="text-2xl md:text-4xl font-bold text-primary-foreground mb-4">{title}</h2>
        {subtitle && (
          <p className="text-primary-foreground/90 mb-6 text-lg">{subtitle}</p>
        )}
        <Link href={buttonLink}>
          <Button
            size="lg"
            variant="secondary"
            className="gap-2 shadow-lg hover:shadow-xl transition-shadow"
          >
            {buttonText}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
```


---

## FILE: `src/components/landing/blocks/cta/cta4.tsx`
> Lines: 55

```typescript
'use client';

import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Cta4Props {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
  buttonVariant: 'default' | 'secondary' | 'outline';
}

/**
 * CTA Block: cta4
 * Design: Split Action
 *
 * Split layout with multiple action buttons
 */
export function Cta4({
  title,
  subtitle,
  buttonText,
  buttonLink,
  buttonVariant,
}: Cta4Props) {
  return (
    <section className="py-16 my-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left: Text */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
            {subtitle && <p className="text-muted-foreground text-lg">{subtitle}</p>}
          </div>

          {/* Right: Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={buttonLink} className="flex-1">
              <Button size="lg" variant={buttonVariant} className="w-full gap-2">
                {buttonText}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="flex-1 gap-2">
              <MessageCircle className="h-4 w-4" />
              Hubungi Kami
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
```


---

## FILE: `src/components/landing/blocks/cta/cta5.tsx`
> Lines: 52

```typescript
'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Cta5Props {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
  buttonVariant: 'default' | 'secondary' | 'outline';
}

/**
 * CTA Block: cta5
 * Design: Floating
 *
 * Floating card with shadow elevation
 */
export function Cta5({
  title,
  subtitle,
  buttonText,
  buttonLink,
  buttonVariant,
}: Cta5Props) {
  return (
    <section className="py-16 my-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-card rounded-2xl shadow-2xl p-8 md:p-12 border">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
            {subtitle && (
              <p className="text-muted-foreground mb-8 text-lg max-w-xl mx-auto">{subtitle}</p>
            )}
            <Link href={buttonLink}>
              <Button
                size="lg"
                variant={buttonVariant}
                className="gap-2 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              >
                {buttonText}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
```


---

## FILE: `src/components/landing/blocks/cta/cta6.tsx`
> Lines: 44

```typescript
'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Cta6Props {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
  buttonVariant: 'default' | 'secondary' | 'outline';
}

/**
 * CTA Block: cta6
 * Design: Minimal Line
 *
 * Ultra-minimal single-line CTA
 */
export function Cta6({
  title,
  subtitle,
  buttonText,
  buttonLink,
  buttonVariant,
}: Cta6Props) {
  return (
    <section className="py-12 my-8 border-t border-b">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-5xl mx-auto px-4">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <Link href={buttonLink}>
          <Button variant={buttonVariant} className="gap-2">
            {buttonText}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
```


---

## FILE: `src/components/landing/blocks/cta/cta7.tsx`
> Lines: 254

```typescript
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Zap, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Cta7Props {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
  buttonVariant?: 'default' | 'secondary' | 'outline';
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * CTA Block: cta7
 * Design: Countdown
 *
 * High-urgency CTA with countdown timer
 * Creates FOMO (Fear of Missing Out) with limited time offers
 * Includes animated countdown and pulsing effects
 */
export function Cta7({
  title,
  subtitle,
  buttonText,
  buttonLink,
  buttonVariant = 'default',
}: Cta7Props) {
  // Set target date to 7 days from now (or customize as needed)
  const [targetDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    date.setHours(23, 59, 59, 999);
    return date;
  });

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  if (!isClient) {
    return (
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-blue-500/10">
        <div className="container px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{title}</h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-blue-500/10 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="inline-block mb-6"
          >
            <Badge className="px-4 py-2 text-base gap-2 bg-primary/90">
              <Zap className="h-4 w-4 fill-current" />
              Limited Time Offer
              <Sparkles className="h-4 w-4 fill-current" />
            </Badge>
          </motion.div>

          {/* Title */}
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {title}
          </h2>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              {subtitle}
            </p>
          )}

          {/* Countdown Timer */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Clock className="h-5 w-5 text-primary" />
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Offer Ends In
              </p>
            </div>

            <div className="grid grid-cols-4 gap-3 md:gap-6 max-w-2xl mx-auto">
              {timeUnits.map((unit, index) => (
                <motion.div
                  key={unit.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="relative"
                >
                  <div className="bg-card/80 backdrop-blur-sm border-2 border-primary/20 rounded-2xl p-4 md:p-6 shadow-lg">
                    {/* Animated Number */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={unit.value}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 20, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-3xl md:text-5xl font-bold text-primary mb-2"
                      >
                        {String(unit.value).padStart(2, '0')}
                      </motion.div>
                    </AnimatePresence>

                    {/* Label */}
                    <p className="text-xs md:text-sm text-muted-foreground uppercase tracking-wide">
                      {unit.label}
                    </p>
                  </div>

                  {/* Pulse Effect */}
                  {unit.label === 'Seconds' && (
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="absolute inset-0 bg-primary/20 rounded-2xl -z-10 blur-xl"
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Button
              size="lg"
              variant={buttonVariant}
              asChild
              className="text-lg px-8 py-6 group shadow-xl hover:shadow-2xl transition-all"
            >
              <Link href={buttonLink}>
                {buttonText}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </Button>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <Badge variant="secondary" className="gap-1">
                ✓ Free Shipping
              </Badge>
              <Badge variant="secondary" className="gap-1">
                ✓ Money-Back Guarantee
              </Badge>
              <Badge variant="secondary" className="gap-1">
                ✓ Secure Checkout
              </Badge>
            </div>
          </motion.div>

          {/* Urgency Text */}
          <motion.p
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="text-sm text-muted-foreground mt-8"
          >
            ⚡ Don&apos;t miss out! Limited stock available
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
```


---

# 📊 COLLECTION SUMMARY

## 📦 Landing Components Module:

| Section | Files |
|---------|-------|
| 📄 Root Components | 7 files |
| 📁 Blocks Index/Mapping | 2 files |
| 🦸 Hero Blocks | 8 files |
| ℹ️ About Blocks | 8 files |
| 🛍️ Products Blocks | 8 files |
| 💬 Testimonials Blocks | 8 files |
| 📞 Contact Blocks | 8 files |
| 🚀 CTA Blocks | 8 files |
| **Total** | **57 files** |

## 📝 Stats:
- ✅ Found: 57 files
- ❌ Missing: 0 files
- 📝 Total lines: 5851

## 📍 Output:
`/d/PRODUK-LPPM-FINAL/UMKM-MULTI-TENANT/app/collections/landing-components-20260119-114200.md`

---

> END OF COLLECTION
