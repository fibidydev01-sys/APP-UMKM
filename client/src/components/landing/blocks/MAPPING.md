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
