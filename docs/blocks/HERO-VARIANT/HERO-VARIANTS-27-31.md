# Hero Variants 27-31 - React Bits Edition

Complete hero components dengan React Bits background effects. Copy-paste ready.

---

## Hero27 - Minimal Zen + Silk Background

```tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Minimize2 } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import Silk from '@/components/ui/silk';

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

export function Hero27({
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
      {/* Silk Background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <Silk
          speed={3}
          scale={1.2}
          color="#7B7481"
          noiseIntensity={1.8}
          rotation={0}
        />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="min-h-screen flex items-center justify-center py-20">
          <div className="w-full max-w-6xl space-y-20">
            {/* Top: Logo & Store Name */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="flex flex-col items-center space-y-6"
            >
              {logo && (
                <div className="relative h-20 w-20 rounded-full overflow-hidden border border-white/20 shadow-xl backdrop-blur-sm">
                  <OptimizedImage src={logo} alt={storeName || title} fill className="object-cover" />
                </div>
              )}

              {storeName && (
                <div className="flex items-center space-x-3">
                  <div className="h-px w-12 bg-white/30" />
                  <span className="text-sm uppercase tracking-[0.3em] text-white/60">{storeName}</span>
                  <div className="h-px w-12 bg-white/30" />
                </div>
              )}
            </motion.div>

            {/* Center: Title & Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="text-center space-y-10"
            >
              <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-light leading-tight tracking-tight">
                {title}
              </h1>

              {subtitle && (
                <p className="text-2xl sm:text-3xl lg:text-4xl text-white/70 max-w-4xl mx-auto leading-relaxed font-light">
                  {subtitle}
                </p>
              )}
            </motion.div>

            {/* Bottom: Image & CTA */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="space-y-12"
            >
              {backgroundImage && (
                <div className="relative w-full max-w-5xl mx-auto h-[400px] sm:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                  <OptimizedImage
                    src={backgroundImage}
                    alt={storeName || title}
                    fill
                    priority
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>
              )}

              {showCta && ctaText && (
                <div className="flex flex-col items-center space-y-6">
                  <Link href={ctaLink}>
                    <InteractiveHoverButton className="min-w-[240px] text-base px-10 py-5 bg-transparent border-2 border-white/30 hover:bg-white hover:text-black transition-colors duration-300">
                      <Minimize2 className="mr-2 h-4 w-4" />
                      {ctaText}
                    </InteractiveHoverButton>
                  </Link>

                  <div className="flex items-center space-x-2">
                    <div className="w-1 h-1 rounded-full bg-white/40" />
                    <div className="w-1 h-1 rounded-full bg-white/60" />
                    <div className="w-1 h-1 rounded-full bg-white/40" />
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Summary:** Minimal zen layout dengan Silk smooth background, centered content, grayscale aesthetic, ultra-clean spacing.

---

## Hero28 - Floating Panels + Iridescence Background

```tsx
'use client';

import Link from 'next/link';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Gem } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import Iridescence from '@/components/ui/iridescence';
import { useEffect } from 'react';

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

export function Hero28({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: HeroProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const rotateX1 = useTransform(mouseY, [0, window.innerHeight], [5, -5]);
  const rotateY1 = useTransform(mouseX, [0, window.innerWidth], [-5, 5]);
  const rotateX2 = useTransform(mouseY, [0, window.innerHeight], [-3, 3]);
  const rotateY2 = useTransform(mouseX, [0, window.innerWidth], [3, -3]);

  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Iridescence Background */}
      <div className="absolute inset-0 z-0">
        <Iridescence
          color={[0.5, 0.6, 0.8]}
          mouseReact
          amplitude={0.15}
          speed={0.8}
        />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="min-h-screen flex items-center justify-center py-20">
          <div className="w-full max-w-7xl" style={{ perspective: '1500px' }}>
            {/* Floating Panels Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Panel 1: Logo & Badge */}
              <motion.div
                style={{ rotateX: rotateX1, rotateY: rotateY1 }}
                initial={{ opacity: 0, z: -100 }}
                animate={{ opacity: 1, z: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="lg:col-span-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-10 border border-white/20 shadow-2xl"
              >
                <div className="space-y-8">
                  {logo && (
                    <div className="relative h-24 w-24 mx-auto rounded-2xl overflow-hidden border-2 border-white/30 shadow-xl">
                      <OptimizedImage src={logo} alt={storeName || title} fill className="object-cover" />
                    </div>
                  )}

                  {storeName && (
                    <Badge variant="secondary" className="w-full justify-center px-6 py-3 bg-white/10 backdrop-blur-md border-white/20">
                      <Gem className="h-5 w-5 mr-2" />
                      {storeName}
                    </Badge>
                  )}
                </div>
              </motion.div>

              {/* Panel 2: Title */}
              <motion.div
                style={{ rotateX: rotateX2, rotateY: rotateY2 }}
                initial={{ opacity: 0, z: -100 }}
                animate={{ opacity: 1, z: 0 }}
                transition={{ delay: 0.2, duration: 1, ease: 'easeOut' }}
                className="lg:col-span-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-12 lg:p-16 border border-white/20 shadow-2xl flex items-center"
              >
                <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight tracking-tight">
                  {title}
                </h1>
              </motion.div>

              {/* Panel 3: Image */}
              {backgroundImage && (
                <motion.div
                  style={{ rotateX: rotateX1, rotateY: rotateY2 }}
                  initial={{ opacity: 0, z: -100 }}
                  animate={{ opacity: 1, z: 0 }}
                  transition={{ delay: 0.4, duration: 1, ease: 'easeOut' }}
                  className="lg:col-span-7 relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden border border-white/20 shadow-2xl"
                >
                  <OptimizedImage
                    src={backgroundImage}
                    alt={storeName || title}
                    fill
                    priority
                    className="object-cover hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20" />
                </motion.div>
              )}

              {/* Panel 4: Subtitle & CTA */}
              <motion.div
                style={{ rotateX: rotateX2, rotateY: rotateY1 }}
                initial={{ opacity: 0, z: -100 }}
                animate={{ opacity: 1, z: 0 }}
                transition={{ delay: 0.6, duration: 1, ease: 'easeOut' }}
                className="lg:col-span-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-10 border border-white/20 shadow-2xl flex flex-col justify-center space-y-8"
              >
                {subtitle && (
                  <p className="text-xl sm:text-2xl text-white/80 leading-relaxed">
                    {subtitle}
                  </p>
                )}

                {showCta && ctaText && (
                  <Link href={ctaLink} className="w-full">
                    <InteractiveHoverButton className="w-full text-lg px-8 py-6 bg-white text-black hover:bg-white/90">
                      {ctaText}
                    </InteractiveHoverButton>
                  </Link>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Summary:** Floating 3D panels dengan Iridescence background, mouse-reactive tilt effect, modular grid 4-8-7-5.

---

## Hero29 - Wave Split + Plasma Background

```tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import Plasma from '@/components/ui/plasma';

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

export function Hero29({
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
      {/* Plasma Background */}
      <div className="absolute inset-0 z-0">
        <Plasma
          color="#ff6b35"
          speed={0.5}
          direction="forward"
          scale={1.2}
          opacity={0.6}
          mouseInteractive={true}
        />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="min-h-screen py-16 flex items-center">
          <div className="w-full">
            {/* Wave Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-16 items-center">
              {/* Left: Content */}
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="space-y-12 order-2 lg:order-1"
              >
                {/* Logo & Store */}
                <div className="flex items-center space-x-6">
                  {logo && (
                    <div className="relative h-20 w-20 rounded-2xl overflow-hidden border-2 border-orange-500/40 shadow-xl backdrop-blur-sm">
                      <OptimizedImage src={logo} alt={storeName || title} fill className="object-cover" />
                    </div>
                  )}

                  {storeName && (
                    <div className="flex flex-col">
                      <span className="text-orange-400 text-sm uppercase tracking-wider">Exclusive</span>
                      <span className="text-2xl font-bold">{storeName}</span>
                    </div>
                  )}
                </div>

                {/* Title */}
                <div className="space-y-6">
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight tracking-tight">
                    {title}
                  </h1>

                  {subtitle && (
                    <p className="text-xl sm:text-2xl text-white/80 leading-relaxed max-w-xl">
                      {subtitle}
                    </p>
                  )}
                </div>

                {/* CTA */}
                {showCta && ctaText && (
                  <Link href={ctaLink} className="inline-block">
                    <InteractiveHoverButton className="min-w-[260px] text-lg px-10 py-7 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 group">
                      <Flame className="mr-2 h-5 w-5" />
                      {ctaText}
                    </InteractiveHoverButton>
                  </Link>
                )}
              </motion.div>

              {/* Right: Image with Wave Clip */}
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="relative order-1 lg:order-2 mb-12 lg:mb-0"
              >
                <div className="relative h-[450px] lg:h-[700px]">
                  {/* Wave Shape Container */}
                  <div 
                    className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
                    style={{
                      clipPath: 'polygon(0 0, 100% 0, 100% 85%, 75% 95%, 50% 85%, 25% 95%, 0 85%)'
                    }}
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
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-900/40 via-red-900/40 to-black flex items-center justify-center">
                        <span className="text-9xl opacity-20">🔥</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-600/20 to-transparent" />
                  </div>

                  {/* Decorative Elements */}
                  <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                    className="absolute -bottom-6 -right-6 w-40 h-40 bg-orange-500/10 backdrop-blur-xl rounded-full border border-orange-400/30"
                  />
                  <motion.div
                    animate={{ y: [0, 20, 0] }}
                    transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                    className="absolute -top-8 -left-8 w-32 h-32 bg-red-500/10 backdrop-blur-xl rounded-full border border-red-400/30"
                  />
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

**Summary:** Wave split dengan Plasma fire background, wave-shaped image clip, floating orbs, orange-red theme.

---

## Hero30 - Carousel Style + Color Bends Background

```tsx
'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Circle } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import ColorBends from '@/components/ui/color-bends';
import { useState } from 'react';

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

export function Hero30({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { title: title, subtitle: subtitle, image: backgroundImage },
    { title: `${title} - Collection`, subtitle: 'Explore more styles', image: backgroundImage },
    { title: 'Featured Items', subtitle: 'Best sellers', image: backgroundImage },
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Color Bends Background */}
      <div className="absolute inset-0 z-0">
        <ColorBends
          colors={['#ff5c7a', '#8a5cff', '#00ffd1']}
          rotation={0}
          speed={0.15}
          scale={1.2}
          frequency={1.2}
          warpStrength={1.5}
          mouseInfluence={1.2}
          parallax={0.6}
          noise={0.15}
          transparent
          autoRotate={0}
        />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="min-h-screen py-12 flex flex-col justify-center">
          {/* Top Bar: Logo & Store */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-between mb-12"
          >
            {logo && (
              <div className="relative h-16 w-16 rounded-xl overflow-hidden border border-white/20 shadow-lg backdrop-blur-sm">
                <OptimizedImage src={logo} alt={storeName || title} fill className="object-cover" />
              </div>
            )}

            {storeName && (
              <Badge variant="secondary" className="px-5 py-2 bg-white/10 backdrop-blur-md border-white/20">
                {storeName}
              </Badge>
            )}
          </motion.div>

          {/* Carousel Content */}
          <div className="flex-1 flex items-center">
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left: Carousel Info */}
              <div className="space-y-10 order-2 lg:order-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                  >
                    <div className="space-y-6">
                      <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight tracking-tight">
                        {slides[currentSlide].title}
                      </h1>

                      {slides[currentSlide].subtitle && (
                        <p className="text-xl sm:text-2xl text-white/80 leading-relaxed max-w-2xl">
                          {slides[currentSlide].subtitle}
                        </p>
                      )}
                    </div>

                    {showCta && ctaText && (
                      <Link href={ctaLink}>
                        <InteractiveHoverButton className="min-w-[240px] text-lg px-8 py-6 bg-white text-black hover:bg-white/90">
                          {ctaText}
                        </InteractiveHoverButton>
                      </Link>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Controls */}
                <div className="flex items-center space-x-8">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={prevSlide}
                      className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/20 transition-colors"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/20 transition-colors"
                      aria-label="Next slide"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Dots Indicator */}
                  <div className="flex items-center space-x-3">
                    {slides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className="transition-colors"
                        aria-label={`Go to slide ${idx + 1}`}
                      >
                        <Circle
                          className={`h-2 w-2 ${
                            idx === currentSlide ? 'fill-white text-white' : 'fill-white/30 text-white/30'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Carousel Image */}
              <div className="relative order-1 lg:order-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 0.95, rotateY: 10 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 0.95, rotateY: -10 }}
                    transition={{ duration: 0.6 }}
                    className="relative h-[450px] lg:h-[650px] rounded-3xl overflow-hidden shadow-2xl border border-white/10"
                  >
                    {slides[currentSlide].image ? (
                      <OptimizedImage
                        src={slides[currentSlide].image}
                        alt={slides[currentSlide].title}
                        fill
                        priority
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-900/40 via-purple-900/40 to-cyan-900/40 flex items-center justify-center">
                        <span className="text-9xl opacity-20">🎨</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Summary:** Carousel/slider style dengan Color Bends background, navigation controls, dots indicator, multi-slide support.

---

## Hero31 - Liquid Flow + Waves Background

```tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Droplet } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import Waves from '@/components/ui/waves';

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

export function Hero31({
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
      {/* Waves Background */}
      <div className="absolute inset-0 z-0">
        <Waves
          lineColor="#ffffff"
          backgroundColor="rgba(255, 255, 255, 0.05)"
          waveSpeedX={0.01}
          waveSpeedY={0.008}
          waveAmpX={50}
          waveAmpY={25}
          friction={0.92}
          tension={0.01}
          maxCursorMove={150}
          xGap={14}
          yGap={40}
        />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="min-h-screen py-16 flex items-center">
          <div className="w-full max-w-7xl mx-auto">
            {/* Liquid Flow Layout */}
            <div className="space-y-16">
              {/* Top Flow: Logo & Store */}
              <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="flex flex-col sm:flex-row items-center justify-between space-y-6 sm:space-y-0"
              >
                {logo && (
                  <div className="relative h-24 w-24 rounded-3xl overflow-hidden border-2 border-cyan-400/30 shadow-xl backdrop-blur-lg">
                    <OptimizedImage src={logo} alt={storeName || title} fill className="object-cover" />
                  </div>
                )}

                {storeName && (
                  <Badge variant="secondary" className="px-6 py-3 bg-cyan-600/20 backdrop-blur-xl border-cyan-400/30">
                    <Droplet className="h-5 w-5 mr-2 text-cyan-400" />
                    {storeName}
                  </Badge>
                )}
              </motion.div>

              {/* Center Flow: Title & Image Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                {/* Title - Spans 2 columns */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 1 }}
                  className="lg:col-span-2 space-y-8"
                >
                  <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold leading-tight tracking-tight">
                    {title}
                  </h1>

                  {subtitle && (
                    <p className="text-2xl sm:text-3xl text-white/80 leading-relaxed max-w-3xl">
                      {subtitle}
                    </p>
                  )}

                  {showCta && ctaText && (
                    <Link href={ctaLink} className="inline-block">
                      <InteractiveHoverButton className="min-w-[280px] text-lg px-10 py-7 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700">
                        {ctaText}
                      </InteractiveHoverButton>
                    </Link>
                  )}
                </motion.div>

                {/* Image Stack */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="space-y-6"
                >
                  {backgroundImage ? (
                    <>
                      <div className="relative h-[280px] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                        <OptimizedImage
                          src={backgroundImage}
                          alt={storeName || title}
                          fill
                          priority
                          className="object-cover hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-cyan-600/20 to-transparent" />
                      </div>
                      <div className="relative h-[200px] rounded-3xl overflow-hidden shadow-xl border border-white/10 opacity-80">
                        <OptimizedImage
                          src={backgroundImage}
                          alt={`${storeName || title} - 2`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent" />
                      </div>
                    </>
                  ) : (
                    <div className="relative h-[500px] rounded-3xl overflow-hidden bg-gradient-to-br from-cyan-900/30 via-blue-900/30 to-black border border-white/10 flex items-center justify-center backdrop-blur-3xl">
                      <span className="text-9xl opacity-20">💧</span>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Bottom Flow: Feature Pills */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="flex flex-wrap justify-center gap-4"
              >
                {['Premium Quality', 'Fast Shipping', 'Secure Payment'].map((feature, idx) => (
                  <div
                    key={idx}
                    className="px-6 py-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10 text-sm text-white/70"
                  >
                    {feature}
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Summary:** Liquid flow layout dengan Waves interactive background, 3-column grid (2+1), stacked images, feature pills.

---

## Installation Dependencies

```bash
# React Bits Backgrounds
pnpm dlx shadcn@latest add @react-bits/Silk-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Iridescence-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Plasma-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ColorBends-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Waves-TS-CSS

# Framer Motion
pnpm add framer-motion

# Lucide Icons
pnpm add lucide-react
```

---

## Component Paths

- `@/components/ui/silk` → Silk component
- `@/components/ui/iridescence` → Iridescence component
- `@/components/ui/plasma` → Plasma component
- `@/components/ui/color-bends` → ColorBends component
- `@/components/ui/waves` → Waves component

---

## Layout Summary

| Hero    | Layout Type       | Background Effect | Key Features                                       |
|---------|-------------------|-------------------|----------------------------------------------------|
| Hero27  | Minimal Zen       | Silk              | Centered, grayscale image, ultra-clean spacing     |
| Hero28  | Floating Panels   | Iridescence       | 3D tilt effect, mouse-reactive, modular 4-8-7-5    |
| Hero29  | Wave Split        | Plasma            | Wave-shaped clip, floating orbs, orange-red theme  |
| Hero30  | Carousel Style    | Color Bends       | Slider navigation, dots indicator, multi-slide     |
| Hero31  | Liquid Flow       | Waves             | 3-column grid, stacked images, feature pills       |

---

**Ready to copy-paste!** 🚀
