# Hero Variants 12-16 - React Bits Edition

Complete hero components dengan React Bits background effects. Copy-paste ready.

---

## Hero12 - Split Screen + Galaxy Background

```tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import Galaxy from '@/components/ui/galaxy';

interface HeroProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

export function Hero12({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: HeroProps) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Galaxy Background */}
      <div className="absolute inset-0 z-0">
        <Galaxy
          mouseRepulsion
          mouseInteraction
          density={1.2}
          glowIntensity={0.4}
          saturation={0}
          hueShift={180}
          twinkleIntensity={0.5}
          rotationSpeed={0.15}
          repulsionStrength={2.5}
          starSpeed={0.3}
          speed={1}
        />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-screen py-12 lg:py-20">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-8 order-2 lg:order-1"
          >
            {logo && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex justify-center lg:justify-start"
              >
                <div className="relative h-20 w-20 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl backdrop-blur-sm">
                  <OptimizedImage src={logo} alt={storeName || title} fill className="object-cover" />
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex justify-center lg:justify-start"
            >
              <Badge variant="secondary" className="px-4 py-2 bg-white/10 backdrop-blur-md border-white/20">
                <Sparkles className="h-4 w-4 mr-2" />
                {storeName || 'Featured Collection'}
              </Badge>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="space-y-6 text-center lg:text-left"
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight tracking-tight">
                {title}
              </h1>

              {subtitle && (
                <p className="text-lg sm:text-xl lg:text-2xl text-white/80 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  {subtitle}
                </p>
              )}
            </motion.div>

            {showCta && ctaText && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex justify-center lg:justify-start pt-4"
              >
                <Link href={ctaLink} className="w-full sm:w-auto">
                  <InteractiveHoverButton className="w-full sm:w-auto min-w-[240px] text-lg px-8 py-6 bg-white text-black hover:bg-white/90">
                    {ctaText}
                  </InteractiveHoverButton>
                </Link>
              </motion.div>
            )}
          </motion.div>

          {/* Right: Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative h-[400px] sm:h-[500px] lg:h-[700px] rounded-3xl overflow-hidden shadow-2xl order-1 lg:order-2 border border-white/10"
          >
            {backgroundImage ? (
              <OptimizedImage
                src={backgroundImage}
                alt={storeName || title}
                fill
                priority
                className="object-cover hover:scale-110 transition-transform duration-1000"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-black flex items-center justify-center backdrop-blur-3xl">
                <span className="text-9xl opacity-20">✨</span>
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/40 to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

**Summary:** Split screen layout dengan Galaxy background, mouseInteraction enabled, dan purple-blue gradient fallback.

---

## Hero13 - Center Aligned + Aurora Background

```tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import Aurora from '@/components/ui/aurora';

interface HeroProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

export function Hero13({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: HeroProps) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white flex items-center justify-center">
      {/* Aurora Background */}
      <div className="absolute inset-0 z-0">
        <Aurora
          colorStops={['#7cff67', '#B19EEF', '#5227FF']}
          blend={0.6}
          amplitude={1.2}
          speed={0.8}
        />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center space-y-10 py-20">
          {/* Logo */}
          {logo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'backOut' }}
            >
              <div className="relative h-24 w-24 rounded-3xl overflow-hidden border-2 border-white/30 shadow-2xl backdrop-blur-md">
                <OptimizedImage src={logo} alt={storeName || title} fill className="object-cover" />
              </div>
            </motion.div>
          )}

          {/* Store Name Badge */}
          {storeName && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <span className="px-5 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-sm font-medium">
                {storeName}
              </span>
            </motion.div>
          )}

          {/* Hero Image (if provided) */}
          {backgroundImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative w-full max-w-2xl h-[300px] sm:h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-white/20"
            >
              <OptimizedImage
                src={backgroundImage}
                alt={storeName || title}
                fill
                priority
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          )}

          {/* Title & Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="space-y-6 max-w-4xl"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight tracking-tight">
              {title}
            </h1>

            {subtitle && (
              <p className="text-xl sm:text-2xl lg:text-3xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                {subtitle}
              </p>
            )}
          </motion.div>

          {/* CTA */}
          {showCta && ctaText && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="pt-6"
            >
              <Link href={ctaLink}>
                <InteractiveHoverButton className="min-w-[280px] text-lg px-10 py-7 bg-white text-black hover:bg-white/90 group">
                  {ctaText}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </InteractiveHoverButton>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
```

**Summary:** Centered layout dengan Aurora gradient background, logo di atas, dan semua konten ter-center dengan spacing optimal.

---

## Hero14 - Full Overlay + Spotlight Background

```tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import Spotlight from '@/components/ui/spotlight';

interface HeroProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

export function Hero14({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: HeroProps) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Spotlight Background */}
      <div className="absolute inset-0 z-0">
        <Spotlight
          color="#5227FF"
          size={800}
          blur={100}
          opacity={0.5}
          speed={0.5}
        />
      </div>

      {/* Background Image Overlay */}
      {backgroundImage && (
        <div className="absolute inset-0 z-[1]">
          <OptimizedImage
            src={backgroundImage}
            alt={storeName || title}
            fill
            priority
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        </div>
      )}

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center min-h-screen py-20 space-y-12">
          {/* Logo & Badge */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center space-y-6"
          >
            {logo && (
              <div className="relative h-28 w-28 rounded-3xl overflow-hidden border-2 border-white/30 shadow-2xl backdrop-blur-lg">
                <OptimizedImage src={logo} alt={storeName || title} fill className="object-cover" />
              </div>
            )}

            {storeName && (
              <Badge variant="secondary" className="px-6 py-3 bg-white/10 backdrop-blur-xl border-white/20 text-base">
                {storeName}
              </Badge>
            )}
          </motion.div>

          {/* Title & Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="space-y-8 max-w-5xl"
          >
            <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold leading-tight tracking-tight">
              {title}
            </h1>

            {subtitle && (
              <p className="text-2xl sm:text-3xl lg:text-4xl text-white/90 max-w-4xl mx-auto leading-relaxed font-light">
                {subtitle}
              </p>
            )}
          </motion.div>

          {/* CTA */}
          {showCta && ctaText && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="pt-8"
            >
              <Link href={ctaLink}>
                <InteractiveHoverButton className="min-w-[300px] text-xl px-12 py-8 bg-white text-black hover:bg-white/90 font-semibold">
                  {ctaText}
                </InteractiveHoverButton>
              </Link>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent z-[2]" />
    </section>
  );
}
```

**Summary:** Full overlay layout dengan Spotlight effect, background image opacity 30%, dan konten centered dengan size besar.

---

## Hero15 - Asymmetric Grid + Particles Background

```tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import Particles from '@/components/ui/particles';

interface HeroProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

export function Hero15({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: HeroProps) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Particles Background */}
      <div className="absolute inset-0 z-0">
        <Particles
          particleColors={['#5227FF', '#FF9FFC', '#B19EEF']}
          particleCount={150}
          particleSpread={15}
          speed={0.15}
          particleBaseSize={120}
          moveParticlesOnHover
          alphaParticles
          pixelRatio={1.5}
        />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-screen py-16">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-8 order-2 lg:order-1"
          >
            {logo && (
              <motion.div
                initial={{ opacity: 0, rotate: -10 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex justify-center lg:justify-start"
              >
                <div className="relative h-20 w-20 rounded-2xl overflow-hidden border-2 border-purple-500/40 shadow-2xl backdrop-blur-sm">
                  <OptimizedImage src={logo} alt={storeName || title} fill className="object-cover" />
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="space-y-6 text-center lg:text-left"
            >
              {storeName && (
                <div className="flex items-center justify-center lg:justify-start space-x-2">
                  <Star className="h-5 w-5 text-purple-400 fill-purple-400" />
                  <span className="text-lg font-medium text-purple-300">{storeName}</span>
                </div>
              )}

              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight tracking-tight">
                {title}
              </h1>

              {subtitle && (
                <p className="text-xl sm:text-2xl text-white/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  {subtitle}
                </p>
              )}
            </motion.div>

            {showCta && ctaText && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex justify-center lg:justify-start pt-4"
              >
                <Link href={ctaLink} className="w-full sm:w-auto">
                  <InteractiveHoverButton className="w-full sm:w-auto min-w-[260px] text-lg px-10 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    {ctaText}
                  </InteractiveHoverButton>
                </Link>
              </motion.div>
            )}
          </motion.div>

          {/* Right: Images Grid */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-5 space-y-6 order-1 lg:order-2"
          >
            {backgroundImage ? (
              <>
                <div className="relative h-[280px] sm:h-[350px] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                  <OptimizedImage
                    src={backgroundImage}
                    alt={storeName || title}
                    fill
                    priority
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="relative h-[180px] rounded-2xl overflow-hidden shadow-xl border border-white/10">
                    <OptimizedImage
                      src={backgroundImage}
                      alt={`${storeName || title} - 2`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="relative h-[180px] rounded-2xl overflow-hidden shadow-xl border border-white/10">
                    <OptimizedImage
                      src={backgroundImage}
                      alt={`${storeName || title} - 3`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="relative h-[450px] rounded-3xl overflow-hidden bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-black border border-white/10 flex items-center justify-center backdrop-blur-3xl">
                <span className="text-9xl opacity-10">🎨</span>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

**Summary:** Asymmetric grid 7:5 dengan Particles background, left content, right image grid (1 besar + 2 kecil).

---

## Hero16 - Bento Style + GridPattern Background

```tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Zap } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import GridPattern from '@/components/ui/grid-pattern';

interface HeroProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

export function Hero16({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: HeroProps) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* GridPattern Background */}
      <div className="absolute inset-0 z-0">
        <GridPattern
          width={60}
          height={60}
          strokeDasharray="4 4"
          className="text-white/5"
        />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 min-h-[calc(100vh-6rem)]">
          {/* Top Left: Logo + Store Name */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-3xl p-8 border border-white/10 flex flex-col justify-center items-center lg:items-start space-y-6"
          >
            {logo && (
              <div className="relative h-24 w-24 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl">
                <OptimizedImage src={logo} alt={storeName || title} fill className="object-cover" />
              </div>
            )}
            {storeName && (
              <Badge variant="secondary" className="px-5 py-2.5 bg-white/10 backdrop-blur-md border-white/20">
                <Zap className="h-4 w-4 mr-2" />
                {storeName}
              </Badge>
            )}
          </motion.div>

          {/* Top Right: Main Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-8 relative h-[300px] lg:h-auto rounded-3xl overflow-hidden shadow-2xl border border-white/10"
          >
            {backgroundImage ? (
              <OptimizedImage
                src={backgroundImage}
                alt={storeName || title}
                fill
                priority
                className="object-cover hover:scale-105 transition-transform duration-1000"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-black flex items-center justify-center backdrop-blur-3xl">
                <span className="text-9xl opacity-20">🚀</span>
              </div>
            )}
          </motion.div>

          {/* Bottom Left: Title + Subtitle */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-7 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-3xl p-10 lg:p-12 border border-white/10 flex flex-col justify-center space-y-6"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight">
              {title}
            </h1>

            {subtitle && (
              <p className="text-lg sm:text-xl lg:text-2xl text-white/80 leading-relaxed max-w-2xl">
                {subtitle}
              </p>
            )}
          </motion.div>

          {/* Bottom Right: CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-5 bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-3xl p-10 border border-white/10 flex flex-col justify-center items-center space-y-6"
          >
            {showCta && ctaText ? (
              <>
                <p className="text-center text-white/70 text-base">
                  Ready to explore?
                </p>
                <Link href={ctaLink} className="w-full">
                  <InteractiveHoverButton className="w-full text-lg px-8 py-6 bg-white text-black hover:bg-white/90 group">
                    {ctaText}
                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </InteractiveHoverButton>
                </Link>
              </>
            ) : (
              <div className="text-center text-white/50 text-lg">
                Explore our collection
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

**Summary:** Bento grid layout (4+8, 7+5 columns) dengan GridPattern background, modular card design dengan backdrop blur.

---

## Installation Dependencies

Install semua dependencies yang dibutuhkan:

```bash
# React Bits Backgrounds
pnpm dlx shadcn@latest add @react-bits/Galaxy-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Aurora-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Spotlight-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Particles-TS-CSS
pnpm dlx shadcn@latest add @react-bits/GridPattern-TS-CSS

# Framer Motion
pnpm add framer-motion

# Lucide Icons
pnpm add lucide-react
```

---

## Component Paths

Sesuaikan import paths sesuai struktur project:

- `@/components/ui/interactive-hover-button` → InteractiveHoverButton component
- `@/components/ui/optimized-image` → OptimizedImage component (Next.js Image wrapper)
- `@/components/ui/badge` → Badge component (shadcn/ui)
- `@/components/ui/galaxy` → Galaxy background component (React Bits)
- `@/components/ui/aurora` → Aurora background component (React Bits)
- `@/components/ui/spotlight` → Spotlight background component (React Bits)
- `@/components/ui/particles` → Particles background component (React Bits)
- `@/components/ui/grid-pattern` → GridPattern background component (React Bits)

---

## Layout Summary

| Hero    | Layout Type       | Background Effect | Key Features                                    |
|---------|-------------------|-------------------|-------------------------------------------------|
| Hero12  | Split Screen      | Galaxy            | 50:50 grid, mouseInteraction, star field        |
| Hero13  | Center Aligned    | Aurora            | Vertical centered, gradient waves               |
| Hero14  | Full Overlay      | Spotlight         | Image overlay 30%, spotlight tracking           |
| Hero15  | Asymmetric Grid   | Particles         | 7:5 columns, image grid (1+2), particle motion  |
| Hero16  | Bento Style       | GridPattern       | Modular cards, 4+8 / 7+5 grid, glass morphism   |

---

**Ready to copy-paste!** 🚀
