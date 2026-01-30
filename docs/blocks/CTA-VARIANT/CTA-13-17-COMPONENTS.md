# CTA COMPONENTS 13-17

5 CTA (Call-to-Action) section variants dengan berbagai layout styles, mengikuti pattern dari CTA-12.

---

## CTA-13: Split Layout with Background

**Layout**: Split layout dengan background gradient  
**Style**: Modern dengan background accent

```tsx
// Cta13.tsx
'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Cta13 Props - Mapped from Data Contract (LANDING-DATA-CONTRACT.md)
 *
 * @prop title - ctaTitle: CTA heading
 * @prop subtitle - ctaSubtitle: CTA description
 * @prop buttonText - ctaButtonText: Button label
 * @prop buttonLink - ctaButtonLink: Button destination URL
 * @prop buttonVariant - ctaButtonStyle: 'default' | 'secondary' | 'outline'
 */
interface Cta13Props {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
  buttonVariant: 'default' | 'secondary' | 'outline';
}

/**
 * CTA Block: cta13
 * Design: Split Layout with Background
 */
export function Cta13({
  title,
  subtitle,
  buttonText,
  buttonLink,
  buttonVariant,
}: Cta13Props) {
  return (
    <section className="py-20 my-8">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-border">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,transparent,black)] opacity-10" />
          
          <div className="relative grid md:grid-cols-2 gap-8 items-center p-8 md:p-12 lg:p-16">
            {/* Left Content */}
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {title}
              </h2>
              {subtitle && (
                <p className="text-lg text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Right CTA */}
            <div className="flex justify-start md:justify-end">
              <Link href={buttonLink}>
                <Button 
                  size="lg" 
                  variant={buttonVariant} 
                  className="gap-2 h-14 px-8 text-lg shadow-lg"
                >
                  {buttonText}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

## CTA-14: Card Style with Border

**Layout**: Card-based design dengan border accent  
**Style**: Clean & minimal

```tsx
// Cta14.tsx
'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Cta14 Props - Mapped from Data Contract (LANDING-DATA-CONTRACT.md)
 *
 * @prop title - ctaTitle: CTA heading
 * @prop subtitle - ctaSubtitle: CTA description
 * @prop buttonText - ctaButtonText: Button label
 * @prop buttonLink - ctaButtonLink: Button destination URL
 * @prop buttonVariant - ctaButtonStyle: 'default' | 'secondary' | 'outline'
 */
interface Cta14Props {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
  buttonVariant: 'default' | 'secondary' | 'outline';
}

/**
 * CTA Block: cta14
 * Design: Card Style with Border
 */
export function Cta14({
  title,
  subtitle,
  buttonText,
  buttonLink,
  buttonVariant,
}: Cta14Props) {
  return (
    <section className="py-20 my-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-8 md:p-12 rounded-2xl border-2 border-primary/20 bg-card shadow-xl hover:shadow-2xl transition-shadow duration-300">
            {/* Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/60 to-primary rounded-t-2xl" />
            
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {title}
              </h2>
              {subtitle && (
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  {subtitle}
                </p>
              )}
              <Link href={buttonLink}>
                <Button 
                  size="lg" 
                  variant={buttonVariant} 
                  className="gap-2 h-14 px-8 text-lg"
                >
                  {buttonText}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

## CTA-15: Minimal Left-Aligned

**Layout**: Left-aligned minimal design  
**Style**: Simple & straightforward

```tsx
// Cta15.tsx
'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Cta15 Props - Mapped from Data Contract (LANDING-DATA-CONTRACT.md)
 *
 * @prop title - ctaTitle: CTA heading
 * @prop subtitle - ctaSubtitle: CTA description
 * @prop buttonText - ctaButtonText: Button label
 * @prop buttonLink - ctaButtonLink: Button destination URL
 * @prop buttonVariant - ctaButtonStyle: 'default' | 'secondary' | 'outline'
 */
interface Cta15Props {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
  buttonVariant: 'default' | 'secondary' | 'outline';
}

/**
 * CTA Block: cta15
 * Design: Minimal Left-Aligned
 */
export function Cta15({
  title,
  subtitle,
  buttonText,
  buttonLink,
  buttonVariant,
}: Cta15Props) {
  return (
    <section className="py-20 my-8 border-t border-b border-border">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-[2fr,1fr] gap-8 items-center">
            {/* Left Content */}
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {title}
              </h2>
              {subtitle && (
                <p className="text-lg text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Right CTA */}
            <div className="flex justify-start md:justify-end">
              <Link href={buttonLink}>
                <Button 
                  size="lg" 
                  variant={buttonVariant} 
                  className="gap-2 h-14 px-8 text-lg"
                >
                  {buttonText}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

## CTA-16: Full Width with Overlay

**Layout**: Full width dengan background overlay  
**Style**: Bold & immersive

```tsx
// Cta16.tsx
'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Cta16 Props - Mapped from Data Contract (LANDING-DATA-CONTRACT.md)
 *
 * @prop title - ctaTitle: CTA heading
 * @prop subtitle - ctaSubtitle: CTA description
 * @prop buttonText - ctaButtonText: Button label
 * @prop buttonLink - ctaButtonLink: Button destination URL
 * @prop buttonVariant - ctaButtonStyle: 'default' | 'secondary' | 'outline'
 */
interface Cta16Props {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
  buttonVariant: 'default' | 'secondary' | 'outline';
}

/**
 * CTA Block: cta16
 * Design: Full Width with Overlay
 */
export function Cta16({
  title,
  subtitle,
  buttonText,
  buttonLink,
  buttonVariant,
}: Cta16Props) {
  return (
    <section className="relative py-24 my-8 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background" />
      
      {/* Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
          <Link href={buttonLink}>
            <Button 
              size="lg" 
              variant={buttonVariant} 
              className="gap-2 h-16 px-10 text-lg shadow-2xl hover:shadow-primary/50 transition-shadow"
            >
              {buttonText}
              <ArrowRight className="h-6 w-6" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
```

---

## CTA-17: Compact Inline

**Layout**: Compact inline design  
**Style**: Space-efficient & subtle

```tsx
// Cta17.tsx
'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Cta17 Props - Mapped from Data Contract (LANDING-DATA-CONTRACT.md)
 *
 * @prop title - ctaTitle: CTA heading
 * @prop subtitle - ctaSubtitle: CTA description
 * @prop buttonText - ctaButtonText: Button label
 * @prop buttonLink - ctaButtonLink: Button destination URL
 * @prop buttonVariant - ctaButtonStyle: 'default' | 'secondary' | 'outline'
 */
interface Cta17Props {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
  buttonVariant: 'default' | 'secondary' | 'outline';
}

/**
 * CTA Block: cta17
 * Design: Compact Inline
 */
export function Cta17({
  title,
  subtitle,
  buttonText,
  buttonLink,
  buttonVariant,
}: Cta17Props) {
  return (
    <section className="py-12 my-6">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto bg-muted/30 rounded-2xl p-6 md:p-8 border border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left Content */}
            <div className="text-center md:text-left flex-1">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">
                {title}
              </h3>
              {subtitle && (
                <p className="text-base text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Right CTA */}
            <div className="flex-shrink-0">
              <Link href={buttonLink}>
                <Button 
                  size="lg" 
                  variant={buttonVariant} 
                  className="gap-2 h-12 px-6"
                >
                  {buttonText}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

## SUMMARY

| Component | Layout Style | Background | Alignment | Use Case |
|-----------|-------------|------------|-----------|----------|
| **CTA-13** | Split Grid | Gradient + Pattern | Left/Right | Featured sections |
| **CTA-14** | Card | Border accent | Center | Important CTAs |
| **CTA-15** | Minimal Grid | Border top/bottom | Left | Simple sections |
| **CTA-16** | Full Width | Gradient overlay | Center | Hero-style CTAs |
| **CTA-17** | Inline | Muted background | Horizontal | Compact areas |

**Features:**
- ✅ Consistent Props Interface
- ✅ Data Contract Compliant
- ✅ Responsive Designs
- ✅ Accessible (Link + Button)
- ✅ Icon Support (ArrowRight)
- ✅ Variant Support (default, secondary, outline)
- ✅ TypeScript Ready

---

## USAGE EXAMPLE

```tsx
import { Cta13 } from '@/components/blocks/cta/Cta13';

<Cta13
  title="Ready to Get Started?"
  subtitle="Join thousands of users already using our platform"
  buttonText="Start Free Trial"
  buttonLink="/signup"
  buttonVariant="default"
/>
```

---

**READY FOR PRODUCTION!** 🚀✨
