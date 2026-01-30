# Hero Variants 22-26 - React Bits Edition

Complete hero components dengan React Bits background effects. Copy-paste ready.

---

## Hero22 - Magazine Layout + Dot Grid Background

```tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { TrendingUp, Eye } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import DotGrid from '@/components/ui/dot-grid';

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

export function Hero22({
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
      {/* Dot Grid Background */}
      <div className="absolute inset-0 z-0">
        <DotGrid
          dotSize={4}
          gap={20}
          baseColor="#0a0a0a"
          activeColor="#5227FF"
          proximity={150}
          shockRadius={300}
          shockStrength={6}
          resistance={800}
          returnDuration={1.8}
        />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 py-16">
        <div className="min-h-screen flex items-center">
          {/* Magazine Grid Layout */}
          <div className="w-full grid grid-cols-12 gap-6 lg:gap-8">
            {/* Top Left: Logo */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="col-span-12 lg:col-span-2 flex lg:flex-col items-center lg:items-start space-y-4"
            >
              {logo && (
                <div className="relative h-20 w-20 rounded-2xl overflow-hidden border-2 border-purple-500/30 shadow-xl backdrop-blur-sm">
                  <OptimizedImage src={logo} alt={storeName || title} fill className="object-cover" />
                </div>
              )}

              {storeName && (
                <Badge variant="secondary" className="lg:rotate-90 lg:origin-left px-4 py-2 bg-purple-600/20 backdrop-blur-md border-purple-500/30 whitespace-nowrap">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  {storeName}
                </Badge>
              )}
            </motion.div>

            {/* Center: Main Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="col-span-12 lg:col-span-6 relative h-[400px] lg:h-[650px] rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            >
              {backgroundImage ? (
                <>
                  <OptimizedImage
                    src={backgroundImage}
                    alt={storeName || title}
                    fill
                    priority
                    className="object-cover hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                </>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-black flex items-center justify-center">
                  <span className="text-9xl opacity-20">📰</span>
                </div>
              )}

              {/* Image Overlay Badge */}
              <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between">
                <Badge variant="secondary" className="px-4 py-2 bg-black/60 backdrop-blur-xl border-white/20">
                  <Eye className="h-4 w-4 mr-2" />
                  Featured
                </Badge>
              </div>
            </motion.div>

            {/* Right: Title & CTA */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="col-span-12 lg:col-span-4 flex flex-col justify-center space-y-8"
            >
              <div className="space-y-6">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
                  {title}
                </h1>

                {subtitle && (
                  <p className="text-xl sm:text-2xl text-white/80 leading-relaxed">
                    {subtitle}
                  </p>
                )}
              </div>

              {showCta && ctaText && (
                <Link href={ctaLink} className="w-full lg:w-auto">
                  <InteractiveHoverButton className="w-full lg:w-auto min-w-[240px] text-lg px-8 py-6 bg-purple-600 hover:bg-purple-700">
                    {ctaText}
                  </InteractiveHoverButton>
                </Link>
              )}
            </motion.div>

            {/* Bottom: Subtitle Extended */}
            {subtitle && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="col-span-12 lg:col-start-3 lg:col-span-8 bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10"
              >
                <p className="text-center text-white/60 text-sm uppercase tracking-wider">
                  Scroll to explore more
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

**Summary:** Magazine grid layout 2-6-4 columns dengan Dot Grid interactive background, editorial style positioning.

---

## Hero23 - Split Diagonal + Ripple Grid Background

```tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Waves as WavesIcon } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import RippleGrid from '@/components/ui/ripple-grid';

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

export function Hero23({
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
      {/* Ripple Grid Background */}
      <div className="absolute inset-0 z-0">
        <RippleGrid
          enableRainbow={false}
          gridColor="#ffffff"
          rippleIntensity={0.08}
          gridSize={12}
          gridThickness={18}
          mouseInteraction={true}
          mouseInteractionRadius={1.5}
          opacity={0.15}
        />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="min-h-screen flex items-center py-20">
          <div className="w-full">
            {/* Top Bar */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-between mb-16"
            >
              {logo && (
                <div className="relative h-16 w-16 rounded-xl overflow-hidden border border-white/20 shadow-lg backdrop-blur-sm">
                  <OptimizedImage src={logo} alt={storeName || title} fill className="object-cover" />
                </div>
              )}

              {storeName && (
                <span className="text-sm uppercase tracking-widest text-white/60">{storeName}</span>
              )}
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left: Content */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="space-y-10 order-2 lg:order-1"
              >
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <WavesIcon className="h-6 w-6 text-cyan-400" />
                      <span className="text-cyan-400 font-medium">New Collection</span>
                    </div>
                  </motion.div>

                  <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight tracking-tight">
                    {title}
                  </h1>

                  {subtitle && (
                    <p className="text-xl sm:text-2xl text-white/80 leading-relaxed max-w-2xl">
                      {subtitle}
                    </p>
                  )}
                </div>

                {showCta && ctaText && (
                  <Link href={ctaLink} className="inline-block">
                    <InteractiveHoverButton className="min-w-[260px] text-lg px-10 py-7 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700">
                      {ctaText}
                    </InteractiveHoverButton>
                  </Link>
                )}
              </motion.div>

              {/* Right: Image with Clip Path */}
              <motion.div
                initial={{ opacity: 0, x: 40, rotateY: 10 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="relative order-1 lg:order-2"
                style={{ perspective: '1000px' }}
              >
                <div className="relative h-[450px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                  {backgroundImage ? (
                    <OptimizedImage
                      src={backgroundImage}
                      alt={storeName || title}
                      fill
                      priority
                      className="object-cover hover:scale-105 transition-transform duration-1000"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/40 via-blue-900/40 to-black flex items-center justify-center">
                      <span className="text-9xl opacity-20">🌊</span>
                    </div>
                  )}

                  {/* Diagonal Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 to-transparent" />
                </div>

                {/* Floating Element */}
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  className="absolute -top-6 -right-6 w-32 h-32 bg-cyan-500/10 backdrop-blur-xl rounded-3xl border border-cyan-400/30"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Summary:** Split diagonal dengan Ripple Grid interactive, floating elements, cyan theme, 3D perspective effect.

---

## Hero24 - Masonry Grid + Pixel Blast Background

```tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkle } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import PixelBlast from '@/components/ui/pixel-blast';

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

export function Hero24({
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
      {/* Pixel Blast Background */}
      <div className="absolute inset-0 z-0">
        <PixelBlast
          variant="square"
          pixelSize={5}
          color="#B19EEF"
          patternScale={2.5}
          patternDensity={1.2}
          pixelSizeJitter={0}
          enableRipples
          rippleSpeed={0.5}
          rippleThickness={0.15}
          rippleIntensityScale={2}
          liquid={false}
          speed={0.6}
          edgeFade={0.3}
          transparent
        />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 py-20">
        <div className="min-h-screen flex items-center">
          {/* Masonry Layout */}
          <div className="w-full grid grid-cols-12 gap-6 auto-rows-[200px]">
            {/* Logo Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="col-span-12 sm:col-span-6 lg:col-span-3 row-span-1 bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-3xl p-8 border border-white/10 flex flex-col items-center justify-center space-y-4"
            >
              {logo && (
                <div className="relative h-20 w-20 rounded-2xl overflow-hidden border-2 border-purple-400/40 shadow-xl">
                  <OptimizedImage src={logo} alt={storeName || title} fill className="object-cover" />
                </div>
              )}
              {storeName && (
                <Badge variant="secondary" className="px-4 py-2 bg-white/10 backdrop-blur-md border-white/20">
                  <Sparkle className="h-4 w-4 mr-2" />
                  {storeName}
                </Badge>
              )}
            </motion.div>

            {/* Title Card - Large */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="col-span-12 lg:col-span-6 row-span-2 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-3xl p-10 lg:p-14 border border-white/10 flex items-center"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight">
                {title}
              </h1>
            </motion.div>

            {/* Subtitle Card */}
            {subtitle && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="col-span-12 sm:col-span-6 lg:col-span-3 row-span-1 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-3xl p-8 border border-white/10 flex items-center"
              >
                <p className="text-lg text-white/80 leading-relaxed">
                  {subtitle}
                </p>
              </motion.div>
            )}

            {/* Image Card - Large */}
            {backgroundImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="col-span-12 sm:col-span-6 lg:col-span-6 row-span-2 relative rounded-3xl overflow-hidden shadow-2xl border border-white/10"
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

            {/* CTA Card */}
            {showCta && ctaText && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="col-span-12 sm:col-span-6 lg:col-span-3 row-span-1 bg-gradient-to-br from-purple-600/30 to-pink-600/30 backdrop-blur-xl rounded-3xl p-8 border border-purple-400/30 flex items-center justify-center"
              >
                <Link href={ctaLink} className="w-full">
                  <InteractiveHoverButton className="w-full text-lg px-8 py-6 bg-white text-black hover:bg-white/90">
                    {ctaText}
                  </InteractiveHoverButton>
                </Link>
              </motion.div>
            )}

            {/* Decorative Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="col-span-12 sm:col-span-6 lg:col-span-3 row-span-1 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/10 flex items-center justify-center"
            >
              <span className="text-6xl opacity-30">✨</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Summary:** Masonry grid layout dengan Pixel Blast retro background, modular cards dengan berbagai size, purple-pink theme.

---

## Hero25 - Overlap Stack + Dither Background

```tsx
'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Layers } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import Dither from '@/components/ui/dither';
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

export function Hero25({
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

  const scale1 = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const scale2 = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50]);

  return (
    <section ref={containerRef} className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Dither Background */}
      <div className="absolute inset-0 z-0">
        <Dither
          waveColor={[0.3, 0.3, 0.4]}
          disableAnimation={false}
          enableMouseInteraction
          mouseRadius={0.4}
          colorNum={5}
          waveAmplitude={0.4}
          waveFrequency={4}
          waveSpeed={0.06}
        />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="min-h-screen flex items-center justify-center py-20">
          <div className="w-full max-w-6xl">
            {/* Overlapping Cards Stack */}
            <div className="relative">
              {/* Card 3 - Background */}
              <motion.div
                style={{ scale: scale1, y: y1 }}
                className="absolute inset-0 translate-y-12 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-3xl rounded-[3rem] border border-white/10"
              />

              {/* Card 2 - Middle */}
              <motion.div
                style={{ scale: scale2, y: y2 }}
                className="absolute inset-0 translate-y-6 bg-gradient-to-br from-white/10 to-white/[0.05] backdrop-blur-2xl rounded-[3rem] border border-white/20"
              />

              {/* Card 1 - Front */}
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="relative bg-gradient-to-br from-white/10 to-white/[0.05] backdrop-blur-xl rounded-[3rem] p-12 lg:p-16 border border-white/20 shadow-2xl"
              >
                {/* Logo & Store */}
                <div className="flex items-center justify-between mb-12">
                  {logo && (
                    <div className="relative h-16 w-16 rounded-2xl overflow-hidden border-2 border-white/30 shadow-xl backdrop-blur-sm">
                      <OptimizedImage src={logo} alt={storeName || title} fill className="object-cover" />
                    </div>
                  )}

                  {storeName && (
                    <div className="flex items-center space-x-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/20">
                      <Layers className="h-4 w-4" />
                      <span className="text-sm font-medium">{storeName}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-10">
                  <div className="space-y-6">
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight tracking-tight">
                      {title}
                    </h1>

                    {subtitle && (
                      <p className="text-xl sm:text-2xl lg:text-3xl text-white/80 leading-relaxed max-w-4xl">
                        {subtitle}
                      </p>
                    )}
                  </div>

                  {/* Image */}
                  {backgroundImage && (
                    <div className="relative h-[350px] sm:h-[450px] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
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

                  {/* CTA */}
                  {showCta && ctaText && (
                    <div className="flex justify-center lg:justify-start pt-6">
                      <Link href={ctaLink}>
                        <InteractiveHoverButton className="min-w-[280px] text-lg px-10 py-7 bg-white text-black hover:bg-white/90 font-semibold">
                          {ctaText}
                        </InteractiveHoverButton>
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Summary:** Overlap stacking cards dengan Dither retro background, scroll-triggered scale/transform, layered depth effect.

---

## Hero26 - Terminal Style + Faulty Terminal Background

```tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Terminal, ChevronRight } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import FaultyTerminal from '@/components/ui/faulty-terminal';

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

export function Hero26({
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
      {/* Faulty Terminal Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <FaultyTerminal
          scale={1.8}
          gridMul={[2, 1]}
          digitSize={1.3}
          timeScale={0.6}
          pause={false}
          scanlineIntensity={0.6}
          glitchAmount={1.2}
          flickerAmount={0.8}
          noiseAmp={1.5}
          chromaticAberration={0}
          dither={0}
          curvature={0.15}
          tint="#00ff41"
          mouseReact
          mouseStrength={0.6}
          pageLoadAnimation
          brightness={0.5}
        />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="min-h-screen py-16 flex items-center">
          <div className="w-full max-w-7xl mx-auto">
            {/* Terminal Window */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="bg-black/60 backdrop-blur-xl rounded-2xl border-2 border-green-500/30 shadow-2xl overflow-hidden"
            >
              {/* Terminal Header */}
              <div className="bg-green-900/20 border-b border-green-500/30 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Terminal className="h-5 w-5 text-green-400" />
                  <span className="text-green-400 font-mono text-sm">
                    {storeName || 'system'}.terminal
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
              </div>

              {/* Terminal Content */}
              <div className="p-8 lg:p-12 space-y-8">
                {/* Logo & System Info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="flex items-center space-x-6"
                >
                  {logo && (
                    <div className="relative h-20 w-20 rounded-xl overflow-hidden border-2 border-green-500/30 shadow-xl">
                      <OptimizedImage src={logo} alt={storeName || title} fill className="object-cover" />
                    </div>
                  )}
                  <div className="font-mono text-green-400 text-sm">
                    <div>$ system_status: <span className="text-green-300">active</span></div>
                    <div>$ connection: <span className="text-green-300">secure</span></div>
                  </div>
                </motion.div>

                {/* Command Prompt Style Title */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="space-y-4"
                >
                  <div className="font-mono text-green-400 text-sm">$ initialize_hero.sh</div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight text-green-300">
                    {title}
                  </h1>
                </motion.div>

                {/* Subtitle as Terminal Output */}
                {subtitle && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                    className="font-mono space-y-2"
                  >
                    <div className="text-green-500 text-xs">{'>'} output:</div>
                    <p className="text-xl sm:text-2xl text-green-400/90 leading-relaxed pl-4 border-l-2 border-green-500/30">
                      {subtitle}
                    </p>
                  </motion.div>
                )}

                {/* Image Grid */}
                {backgroundImage && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="col-span-2 lg:col-span-1 relative h-[280px] rounded-xl overflow-hidden border-2 border-green-500/20 shadow-xl">
                      <OptimizedImage
                        src={backgroundImage}
                        alt={storeName || title}
                        fill
                        priority
                        className="object-cover hover:scale-105 transition-transform duration-700 opacity-80"
                      />
                      <div className="absolute inset-0 bg-green-500/10" />
                    </div>
                    <div className="hidden lg:block relative h-[280px] rounded-xl overflow-hidden border-2 border-green-500/20 bg-green-900/10 backdrop-blur-xl flex items-center justify-center">
                      <span className="text-8xl opacity-20">💻</span>
                    </div>
                  </motion.div>
                )}

                {/* CTA as Command */}
                {showCta && ctaText && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.8, duration: 0.8 }}
                    className="space-y-4 pt-4"
                  >
                    <div className="font-mono text-green-500 text-xs">$ execute_command:</div>
                    <Link href={ctaLink} className="inline-block">
                      <InteractiveHoverButton className="min-w-[260px] text-lg px-8 py-6 bg-green-600 hover:bg-green-700 font-mono group">
                        <Terminal className="mr-2 h-5 w-5" />
                        {ctaText}
                        <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </InteractiveHoverButton>
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Summary:** Terminal/hacker style dengan Faulty Terminal glitch background, monospace fonts, green matrix theme, command-line UI.

---

## Installation Dependencies

```bash
# React Bits Backgrounds
pnpm dlx shadcn@latest add @react-bits/DotGrid-TS-CSS
pnpm dlx shadcn@latest add @react-bits/RippleGrid-TS-CSS
pnpm dlx shadcn@latest add @react-bits/PixelBlast-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Dither-TS-CSS
pnpm dlx shadcn@latest add @react-bits/FaultyTerminal-TS-CSS

# Framer Motion
pnpm add framer-motion

# Lucide Icons
pnpm add lucide-react
```

---

## Component Paths

- `@/components/ui/dot-grid` → DotGrid component
- `@/components/ui/ripple-grid` → RippleGrid component
- `@/components/ui/pixel-blast` → PixelBlast component
- `@/components/ui/dither` → Dither component
- `@/components/ui/faulty-terminal` → FaultyTerminal component

---

## Layout Summary

| Hero    | Layout Type       | Background Effect | Key Features                                    |
|---------|-------------------|-------------------|-------------------------------------------------|
| Hero22  | Magazine Layout   | Dot Grid          | 2-6-4 grid, editorial style, purple theme       |
| Hero23  | Split Diagonal    | Ripple Grid       | 3D perspective, floating elements, cyan theme   |
| Hero24  | Masonry Grid      | Pixel Blast       | Modular cards, various sizes, retro purple      |
| Hero25  | Overlap Stack     | Dither            | Layered depth, scroll parallax, glass morphism  |
| Hero26  | Terminal Style    | Faulty Terminal   | Hacker/matrix theme, command-line UI, green     |

---

**Ready to copy-paste!** 🚀
