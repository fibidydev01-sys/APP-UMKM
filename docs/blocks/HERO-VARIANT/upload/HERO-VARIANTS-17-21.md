# Hero Variants 17-21 - React Bits Edition

Complete hero components dengan React Bits background effects. Copy-paste ready.

---

## Hero17 - Diagonal Split + Liquid Ether Background

```tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import LiquidEther from '@/components/ui/liquid-ether';

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

export function Hero17({
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
      {/* Liquid Ether Background */}
      <div className="absolute inset-0 z-0">
        <LiquidEther
          colors={['#5227FF', '#FF9FFC', '#B19EEF']}
          mouseForce={25}
          cursorSize={120}
          isViscous
          viscous={35}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          autoDemo
          autoSpeed={0.4}
          autoIntensity={2.5}
          takeoverDuration={0.3}
          autoResumeDelay={3500}
          color0="#5227FF"
          color1="#FF9FFC"
          color2="#B19EEF"
        />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-16">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -50, rotate: -2 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="space-y-10 order-2 lg:order-1"
          >
            {logo && (
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8, type: 'spring' }}
                className="flex justify-center lg:justify-start"
              >
                <div className="relative h-24 w-24 rounded-3xl overflow-hidden border-2 border-purple-400/30 shadow-2xl backdrop-blur-lg">
                  <OptimizedImage src={logo} alt={storeName || title} fill className="object-cover" />
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex justify-center lg:justify-start"
            >
              <Badge variant="secondary" className="px-5 py-3 bg-white/10 backdrop-blur-xl border-purple-400/30">
                <Sparkles className="h-4 w-4 mr-2 text-purple-300" />
                {storeName || 'Premium Collection'}
              </Badge>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="space-y-6 text-center lg:text-left"
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight tracking-tight">
                {title}
              </h1>

              {subtitle && (
                <p className="text-xl sm:text-2xl text-white/90 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  {subtitle}
                </p>
              )}
            </motion.div>

            {showCta && ctaText && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="flex justify-center lg:justify-start pt-6"
              >
                <Link href={ctaLink} className="w-full sm:w-auto">
                  <InteractiveHoverButton className="w-full sm:w-auto min-w-[250px] text-lg px-10 py-7 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    {ctaText}
                  </InteractiveHoverButton>
                </Link>
              </motion.div>
            )}
          </motion.div>

          {/* Right: Image with Diagonal */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotate: 2 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative order-1 lg:order-2"
          >
            <div className="relative h-[450px] sm:h-[550px] lg:h-[650px]">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-[3rem] rotate-3 backdrop-blur-3xl" />
              <div className="relative h-full rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 -rotate-2 hover:rotate-0 transition-transform duration-700">
                {backgroundImage ? (
                  <OptimizedImage
                    src={backgroundImage}
                    alt={storeName || title}
                    fill
                    priority
                    className="object-cover hover:scale-110 transition-transform duration-1000"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-pink-900/40 to-black flex items-center justify-center">
                    <span className="text-9xl opacity-20">💎</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

**Summary:** Diagonal split dengan Liquid Ether interactive background, rotated image cards, purple-pink gradient theme.

---

## Hero18 - Vertical Stack + Liquid Chrome Background

```tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import LiquidChrome from '@/components/ui/liquid-chrome';

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

export function Hero18({
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
      {/* Liquid Chrome Background */}
      <div className="absolute inset-0 z-0">
        <LiquidChrome
          baseColor={[0.05, 0.05, 0.15]}
          speed={0.8}
          amplitude={0.7}
          interactive={true}
        />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-screen py-20 space-y-16">
          {/* Logo */}
          {logo && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, type: 'spring', bounce: 0.4 }}
            >
              <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl backdrop-blur-lg">
                <OptimizedImage src={logo} alt={storeName || title} fill className="object-cover" />
              </div>
            </motion.div>
          )}

          {/* Store Name */}
          {storeName && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <div className="px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/20 rounded-full">
                <span className="text-lg font-medium tracking-wide">{storeName}</span>
              </div>
            </motion.div>
          )}

          {/* Title & Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-center space-y-8 max-w-5xl"
          >
            <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold leading-tight tracking-tight">
              {title}
            </h1>

            {subtitle && (
              <p className="text-2xl sm:text-3xl lg:text-4xl text-white/80 leading-relaxed max-w-4xl mx-auto">
                {subtitle}
              </p>
            )}
          </motion.div>

          {/* Image */}
          {backgroundImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="relative w-full max-w-4xl h-[400px] sm:h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            >
              <OptimizedImage
                src={backgroundImage}
                alt={storeName || title}
                fill
                priority
                className="object-cover hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </motion.div>
          )}

          {/* CTA */}
          {showCta && ctaText && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="flex flex-col items-center space-y-6 pt-8"
            >
              <Link href={ctaLink}>
                <InteractiveHoverButton className="min-w-[280px] text-xl px-12 py-7 bg-white text-black hover:bg-white/90 font-semibold">
                  {ctaText}
                </InteractiveHoverButton>
              </Link>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              >
                <ArrowDown className="h-6 w-6 text-white/40" />
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
```

**Summary:** Vertical centered stack dengan Liquid Chrome background, circular logo, giant text, bounce animation.

---

## Hero19 - Spotlight Focus + Beams Background

```tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, Star } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import Beams from '@/components/ui/beams';

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

export function Hero19({
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
      {/* Beams Background */}
      <div className="absolute inset-0 z-0">
        <Beams
          beamWidth={4}
          beamHeight={35}
          beamNumber={18}
          lightColor="#ffffff"
          speed={1.5}
          noiseIntensity={2}
          scale={0.25}
          rotation={25}
        />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-screen py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 w-full max-w-7xl">
            {/* Left Sidebar: Logo & Badge */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-1 flex lg:flex-col items-center lg:items-start justify-center space-y-8"
            >
              {logo && (
                <div className="relative h-20 w-20 lg:h-24 lg:w-24 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl backdrop-blur-sm">
                  <OptimizedImage src={logo} alt={storeName || title} fill className="object-cover" />
                </div>
              )}

              {storeName && (
                <Badge variant="secondary" className="hidden lg:flex px-4 py-2 bg-white/5 backdrop-blur-md border-white/20">
                  <Star className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-400" />
                  {storeName}
                </Badge>
              )}
            </motion.div>

            {/* Center: Main Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="lg:col-span-3 space-y-10 text-center"
            >
              {/* Image */}
              {backgroundImage && (
                <div className="relative w-full h-[300px] sm:h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 mx-auto">
                  <OptimizedImage
                    src={backgroundImage}
                    alt={storeName || title}
                    fill
                    priority
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
              )}

              {/* Title & Subtitle */}
              <div className="space-y-6">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight tracking-tight">
                  {title}
                </h1>

                {subtitle && (
                  <p className="text-xl sm:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                    {subtitle}
                  </p>
                )}
              </div>

              {/* CTA */}
              {showCta && ctaText && (
                <div className="pt-4">
                  <Link href={ctaLink}>
                    <InteractiveHoverButton className="min-w-[260px] text-lg px-10 py-6 bg-white text-black hover:bg-white/90 group">
                      <Zap className="mr-2 h-5 w-5" />
                      {ctaText}
                    </InteractiveHoverButton>
                  </Link>
                </div>
              )}
            </motion.div>

            {/* Right Sidebar: Decoration */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="hidden lg:flex lg:col-span-1 flex-col items-end justify-center space-y-6"
            >
              <div className="w-2 h-32 bg-gradient-to-b from-white/0 via-white/40 to-white/0 rounded-full" />
              <div className="w-3 h-24 bg-gradient-to-b from-white/0 via-white/60 to-white/0 rounded-full" />
              <div className="w-2 h-40 bg-gradient-to-b from-white/0 via-white/30 to-white/0 rounded-full" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Summary:** Spotlight focus layout 1-3-1 columns dengan Beams background, center focus content, decorative sidebars.

---

## Hero20 - Floating Cards + Hyperspeed Background

```tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import Hyperspeed from '@/components/ui/hyperspeed';

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

export function Hero20({
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
      {/* Hyperspeed Background */}
      <div className="absolute inset-0 z-0 opacity-60">
        <Hyperspeed
          effectOptions={{
            distortion: 'turbulentDistortion',
            length: 400,
            roadWidth: 10,
            islandWidth: 2,
            lanesPerRoad: 3,
            fov: 90,
            fovSpeedUp: 150,
            speedUp: 2,
            carLightsFade: 0.4,
            totalSideLightSticks: 20,
            lightPairsPerRoadWay: 40,
            colors: {
              roadColor: 526344,
              islandColor: 657930,
              background: 0,
              shoulderLines: 1250072,
              brokenLines: 1250072,
              leftCars: [14177983, 6770850, 12732332],
              rightCars: [242627, 941733, 3294549],
              sticks: 242627,
            },
          }}
        />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="min-h-screen py-20 flex flex-col justify-center space-y-16">
          {/* Top: Logo & Store */}
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center space-y-4"
          >
            {logo && (
              <div className="relative h-24 w-24 rounded-3xl overflow-hidden border-2 border-cyan-400/30 shadow-2xl backdrop-blur-lg">
                <OptimizedImage src={logo} alt={storeName || title} fill className="object-cover" />
              </div>
            )}
            {storeName && (
              <span className="text-cyan-300 text-lg font-medium tracking-wider">{storeName}</span>
            )}
          </motion.div>

          {/* Center: Floating Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Card 1: Title */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="lg:col-span-2 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-3xl p-10 lg:p-14 border border-white/10 shadow-2xl hover:shadow-cyan-500/20 transition-shadow duration-500"
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight tracking-tight">
                {title}
              </h1>
            </motion.div>

            {/* Card 2: CTA */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 backdrop-blur-xl rounded-3xl p-8 border border-cyan-400/20 shadow-2xl flex flex-col justify-center items-center space-y-6 hover:border-cyan-400/40 transition-colors duration-500"
            >
              {showCta && ctaText && (
                <>
                  <Rocket className="h-12 w-12 text-cyan-400" />
                  <Link href={ctaLink} className="w-full">
                    <InteractiveHoverButton className="w-full text-lg px-8 py-6 bg-white text-black hover:bg-white/90">
                      {ctaText}
                    </InteractiveHoverButton>
                  </Link>
                </>
              )}
            </motion.div>

            {/* Card 3: Image */}
            {backgroundImage && (
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="relative h-[280px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 hover:border-cyan-400/30 transition-colors duration-500"
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

            {/* Card 4: Subtitle */}
            {subtitle && (
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="lg:col-span-2 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/10 shadow-2xl hover:shadow-cyan-500/20 transition-shadow duration-500"
              >
                <p className="text-xl sm:text-2xl lg:text-3xl text-white/80 leading-relaxed">
                  {subtitle}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Summary:** Floating cards grid dengan Hyperspeed background, modular layout 2-1-1-2 grid, cyan theme.

---

## Hero21 - Parallax Layers + Light Rays Background

```tsx
'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Crown } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import LightRays from '@/components/ui/light-rays';
import { useRef } from 'react';

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

export function Hero21({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Light Rays Background */}
      <motion.div style={{ opacity }} className="absolute inset-0 z-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={0.8}
          lightSpread={0.6}
          rayLength={4}
          followMouse={true}
          mouseInfluence={0.15}
          noiseAmount={0}
          distortion={0}
          pulsating={false}
          fadeDistance={1.2}
          saturation={1}
        />
      </motion.div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="min-h-screen py-20 flex items-center">
          <div className="w-full space-y-20">
            {/* Layer 1: Logo & Badge */}
            <motion.div
              style={{ y: y2, opacity }}
              className="flex flex-col items-center space-y-6"
            >
              {logo && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, type: 'spring' }}
                >
                  <div className="relative h-28 w-28 rounded-full overflow-hidden border-4 border-yellow-400/30 shadow-2xl backdrop-blur-lg">
                    <OptimizedImage src={logo} alt={storeName || title} fill className="object-cover" />
                  </div>
                </motion.div>
              )}

              {storeName && (
                <Badge variant="secondary" className="px-6 py-3 bg-yellow-400/10 backdrop-blur-xl border-yellow-400/30 text-yellow-200">
                  <Crown className="h-5 w-5 mr-2 fill-yellow-400 text-yellow-400" />
                  {storeName}
                </Badge>
              )}
            </motion.div>

            {/* Layer 2: Title */}
            <motion.div
              style={{ y: y1, opacity }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="text-center space-y-8"
            >
              <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold leading-tight tracking-tight">
                {title}
              </h1>

              {subtitle && (
                <p className="text-2xl sm:text-3xl lg:text-4xl text-white/80 max-w-4xl mx-auto leading-relaxed">
                  {subtitle}
                </p>
              )}
            </motion.div>

            {/* Layer 3: Image & CTA */}
            <motion.div
              style={{ opacity }}
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="flex flex-col items-center space-y-12"
            >
              {backgroundImage && (
                <div className="relative w-full max-w-5xl h-[400px] sm:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                  <OptimizedImage
                    src={backgroundImage}
                    alt={storeName || title}
                    fill
                    priority
                    className="object-cover hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
              )}

              {showCta && ctaText && (
                <Link href={ctaLink}>
                  <InteractiveHoverButton className="min-w-[300px] text-xl px-12 py-7 bg-yellow-400 text-black hover:bg-yellow-300 font-bold">
                    {ctaText}
                  </InteractiveHoverButton>
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Summary:** Parallax scrolling layers dengan Light Rays background, scroll-triggered animations, golden theme.

---

## Installation Dependencies

```bash
# React Bits Backgrounds
pnpm dlx shadcn@latest add @react-bits/LiquidEther-TS-CSS
pnpm dlx shadcn@latest add @react-bits/LiquidChrome-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Beams-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Hyperspeed-TS-CSS
pnpm dlx shadcn@latest add @react-bits/LightRays-TS-CSS

# Framer Motion
pnpm add framer-motion

# Lucide Icons
pnpm add lucide-react
```

---

## Component Paths

- `@/components/ui/liquid-ether` → LiquidEther component
- `@/components/ui/liquid-chrome` → LiquidChrome component
- `@/components/ui/beams` → Beams component
- `@/components/ui/hyperspeed` → Hyperspeed component
- `@/components/ui/light-rays` → LightRays component

---

## Layout Summary

| Hero    | Layout Type       | Background Effect | Key Features                                |
|---------|-------------------|-------------------|---------------------------------------------|
| Hero17  | Diagonal Split    | Liquid Ether      | Rotated cards, viscous liquid, interactive  |
| Hero18  | Vertical Stack    | Liquid Chrome     | Circular logo, bounce animation, centered   |
| Hero19  | Spotlight Focus   | Beams             | 1-3-1 columns, light beams, decorative bars |
| Hero20  | Floating Cards    | Hyperspeed        | Modular grid, speed effect, cyan theme      |
| Hero21  | Parallax Layers   | Light Rays        | Scroll parallax, layered depth, golden      |

---

**Ready to copy-paste!** 🚀
