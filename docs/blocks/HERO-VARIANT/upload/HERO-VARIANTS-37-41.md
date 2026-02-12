# Hero Variants 37-41 - React Bits Edition

Complete hero components dengan React Bits background effects. Copy-paste ready.

---

## Hero37 - Burst Radial + Prismatic Burst Background

```tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Radar } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import PrismaticBurst from '@/components/ui/prismatic-burst';

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

export function Hero37({
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
      {/* Prismatic Burst Background */}
      <div className="absolute inset-0 z-0">
        <PrismaticBurst
          animationType="rotate3d"
          intensity={2.5}
          speed={0.4}
          distort={0}
          paused={false}
          offset={{ x: 0, y: 0 }}
          hoverDampness={0.2}
          rayCount={0}
          mixBlendMode="lighten"
          colors={['#ff007a', '#4d3dff', '#ffffff']}
        />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="min-h-screen py-16 flex items-center justify-center">
          <div className="w-full max-w-7xl">
            {/* Radial Layout */}
            <div className="relative">
              {/* Center Circle - Logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, type: 'spring', bounce: 0.5 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
              >
                <div className="relative">
                  {/* Pulsing Rings */}
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'easeOut' }}
                    className="absolute inset-0 rounded-full border-4 border-pink-500/50 -z-10"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ repeat: Infinity, duration: 3, delay: 0.5, ease: 'easeOut' }}
                    className="absolute inset-0 rounded-full border-4 border-purple-500/30 -z-10"
                  />

                  {/* Logo Circle */}
                  <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl backdrop-blur-xl bg-black/40">
                    {logo ? (
                      <OptimizedImage src={logo} alt={storeName || title} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Radar className="h-16 w-16 text-pink-400" />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Orbiting Elements */}
              <div className="relative h-[600px] lg:h-[800px]">
                {/* Title Orbit - Top */}
                <motion.div
                  initial={{ opacity: 0, y: -80 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 1 }}
                  className="absolute left-1/2 top-0 -translate-x-1/2 w-full max-w-4xl"
                >
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-10 lg:p-16 border border-white/20 shadow-2xl text-center">
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight tracking-tight">
                      {title}
                    </h1>
                  </div>
                </motion.div>

                {/* Image Orbit - Right */}
                {backgroundImage && (
                  <motion.div
                    initial={{ opacity: 0, x: 80 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 1 }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-full max-w-md"
                  >
                    <div className="relative h-[300px] rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl">
                      <OptimizedImage
                        src={backgroundImage}
                        alt={storeName || title}
                        fill
                        priority
                        className="object-cover hover:scale-110 transition-transform duration-1000"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20" />
                    </div>
                  </motion.div>
                )}

                {/* Subtitle Orbit - Left */}
                {subtitle && (
                  <motion.div
                    initial={{ opacity: 0, x: -80 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-full max-w-md"
                  >
                    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-8 lg:p-10 border border-white/20 shadow-2xl">
                      <p className="text-xl sm:text-2xl text-white/80 leading-relaxed">
                        {subtitle}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* CTA + Store Name Orbit - Bottom */}
                <motion.div
                  initial={{ opacity: 0, y: 80 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 1 }}
                  className="absolute left-1/2 bottom-0 -translate-x-1/2 w-full max-w-2xl"
                >
                  <div className="bg-gradient-to-br from-pink-600/20 to-purple-600/20 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                    <div className="flex flex-col items-center space-y-6">
                      {storeName && (
                        <Badge variant="secondary" className="px-6 py-3 bg-white/10 backdrop-blur-md border-white/20">
                          <Sparkles className="h-5 w-5 mr-2" />
                          {storeName}
                        </Badge>
                      )}

                      {showCta && ctaText && (
                        <Link href={ctaLink} className="w-full max-w-sm">
                          <InteractiveHoverButton className="w-full text-lg px-10 py-7 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
                            {ctaText}
                          </InteractiveHoverButton>
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Summary:** Radial/orbit layout dengan Prismatic Burst 3D background, pulsing center logo, orbiting content cards, pink-purple-white theme.

---

## Hero38 - Playful Balls + Ballpit Background

```tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Smile, ArrowRight } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import Ballpit from '@/components/ui/ballpit';

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

export function Hero38({
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
      {/* Ballpit Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Ballpit
          count={80}
          gravity={0.015}
          friction={0.997}
          wallBounce={0.92}
          followCursor={true}
        />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="min-h-screen py-16 flex items-center">
          <div className="w-full max-w-7xl mx-auto">
            {/* Playful Layout */}
            <div className="space-y-16">
              {/* Top Bar - Bouncy */}
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, type: 'spring', bounce: 0.6 }}
                className="flex items-center justify-between"
              >
                {logo && (
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="relative h-20 w-20 rounded-full overflow-hidden border-4 border-yellow-400/50 shadow-xl backdrop-blur-sm"
                  >
                    <OptimizedImage src={logo} alt={storeName || title} fill className="object-cover" />
                  </motion.div>
                )}

                {storeName && (
                  <Badge variant="secondary" className="px-6 py-3 bg-yellow-400/20 backdrop-blur-xl border-yellow-400/40 text-yellow-200">
                    <Smile className="h-5 w-5 mr-2" />
                    {storeName}
                  </Badge>
                )}
              </motion.div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left: Title & Subtitle - Bouncy Cards */}
                <div className="space-y-8">
                  <motion.div
                    initial={{ opacity: 0, x: -60, rotate: -5 }}
                    animate={{ opacity: 1, x: 0, rotate: 0 }}
                    transition={{ delay: 0.3, duration: 1, type: 'spring' }}
                    whileHover={{ scale: 1.02, rotate: 2 }}
                    className="bg-gradient-to-br from-pink-500/20 to-yellow-500/20 backdrop-blur-2xl rounded-[3rem] p-10 lg:p-14 border-2 border-white/20 shadow-2xl"
                  >
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight tracking-tight">
                      {title}
                    </h1>
                  </motion.div>

                  {subtitle && (
                    <motion.div
                      initial={{ opacity: 0, x: -60, rotate: 5 }}
                      animate={{ opacity: 1, x: 0, rotate: 0 }}
                      transition={{ delay: 0.5, duration: 1, type: 'spring' }}
                      whileHover={{ scale: 1.02, rotate: -2 }}
                      className="bg-gradient-to-br from-blue-500/20 to-green-500/20 backdrop-blur-2xl rounded-[3rem] p-8 lg:p-10 border-2 border-white/20 shadow-2xl"
                    >
                      <p className="text-xl sm:text-2xl text-white/90 leading-relaxed">
                        {subtitle}
                      </p>
                    </motion.div>
                  )}

                  {showCta && ctaText && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7, duration: 0.8, type: 'spring', bounce: 0.5 }}
                    >
                      <Link href={ctaLink}>
                        <InteractiveHoverButton className="min-w-[280px] text-lg px-10 py-7 bg-gradient-to-r from-yellow-500 to-pink-500 hover:from-yellow-600 hover:to-pink-600 group">
                          {ctaText}
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </InteractiveHoverButton>
                      </Link>
                    </motion.div>
                  )}
                </div>

                {/* Right: Image - Floating */}
                {backgroundImage && (
                  <motion.div
                    initial={{ opacity: 0, x: 60, rotate: 10 }}
                    animate={{ opacity: 1, x: 0, rotate: 0 }}
                    transition={{ delay: 0.6, duration: 1, type: 'spring' }}
                    whileHover={{ scale: 1.05, rotate: 3 }}
                    className="relative"
                  >
                    <motion.div
                      animate={{ y: [0, -20, 0] }}
                      transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                      className="relative h-[450px] lg:h-[600px] rounded-[3rem] overflow-hidden border-4 border-white/20 shadow-2xl"
                    >
                      <OptimizedImage
                        src={backgroundImage}
                        alt={storeName || title}
                        fill
                        priority
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-pink-500/10" />
                    </motion.div>

                    {/* Floating Balls Decoration */}
                    <motion.div
                      animate={{ y: [0, 30, 0], rotate: [0, 180, 360] }}
                      transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                      className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 border-4 border-white/30 shadow-xl"
                    />
                    <motion.div
                      animate={{ y: [0, -40, 0], rotate: [0, -180, -360] }}
                      transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 0.5 }}
                      className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 border-4 border-white/30 shadow-xl"
                    />
                  </motion.div>
                )}
              </div>

              {/* Bottom Fun Facts */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="flex flex-wrap justify-center gap-6"
              >
                {['✨ Premium', '🎉 Fun', '🚀 Fast'].map((tag, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="px-8 py-4 bg-white/10 backdrop-blur-xl rounded-full border-2 border-white/20 text-lg font-medium shadow-lg"
                  >
                    {tag}
                  </motion.div>
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

**Summary:** Playful/fun style dengan Ballpit physics background, bouncy animations, floating elements, colorful yellow-pink-blue theme.

---

## Hero39 - Thread Weave + Threads Background

```tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Network } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import Threads from '@/components/ui/threads';

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

export function Hero39({
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
      {/* Threads Background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <Threads
          amplitude={1.5}
          distance={0}
          enableMouseInteraction
        />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="min-h-screen py-20 flex items-center">
          <div className="w-full max-w-7xl mx-auto">
            {/* Woven Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              {/* Top Left - Logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-3 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-xl flex items-center justify-center"
              >
                {logo ? (
                  <div className="relative h-24 w-24 rounded-2xl overflow-hidden border-2 border-cyan-400/40 shadow-xl">
                    <OptimizedImage src={logo} alt={storeName || title} fill className="object-cover" />
                  </div>
                ) : (
                  <Network className="h-24 w-24 text-cyan-400/60" />
                )}
              </motion.div>

              {/* Top Center - Title */}
              <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="lg:col-span-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-10 lg:p-14 border border-white/20 shadow-xl flex items-center"
              >
                <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight tracking-tight">
                  {title}
                </h1>
              </motion.div>

              {/* Top Right - Store Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="lg:col-span-3 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 backdrop-blur-2xl rounded-3xl p-8 border border-cyan-400/30 shadow-xl flex items-center justify-center"
              >
                {storeName && (
                  <Badge variant="secondary" className="px-5 py-3 bg-white/10 backdrop-blur-md border-white/20 text-base">
                    {storeName}
                  </Badge>
                )}
              </motion.div>

              {/* Middle - Image Grid */}
              {backgroundImage && (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="lg:col-span-7 relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden border border-white/20 shadow-2xl"
                  >
                    <OptimizedImage
                      src={backgroundImage}
                      alt={storeName || title}
                      fill
                      priority
                      className="object-cover hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10" />

                    {/* Thread Overlay Pattern */}
                    <div className="absolute inset-0" style={{
                      backgroundImage: `repeating-linear-gradient(
                        45deg,
                        transparent,
                        transparent 20px,
                        rgba(6, 182, 212, 0.03) 20px,
                        rgba(6, 182, 212, 0.03) 40px
                      )`
                    }} />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="lg:col-span-5 relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden border border-white/20 shadow-xl"
                  >
                    <OptimizedImage
                      src={backgroundImage}
                      alt={`${storeName || title} - 2`}
                      fill
                      className="object-cover opacity-70 hover:opacity-100 transition-opacity duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tl from-blue-500/10 to-cyan-500/10" />
                  </motion.div>
                </>
              )}

              {/* Bottom Left - Subtitle */}
              {subtitle && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="lg:col-span-7 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-8 lg:p-10 border border-white/20 shadow-xl flex items-center"
                >
                  <p className="text-xl sm:text-2xl lg:text-3xl text-white/80 leading-relaxed">
                    {subtitle}
                  </p>
                </motion.div>
              )}

              {/* Bottom Right - CTA */}
              {showCta && ctaText && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="lg:col-span-5 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 backdrop-blur-2xl rounded-3xl p-8 border border-cyan-400/30 shadow-xl flex items-center justify-center"
                >
                  <Link href={ctaLink} className="w-full">
                    <InteractiveHoverButton className="w-full text-lg px-8 py-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700">
                      {ctaText}
                    </InteractiveHoverButton>
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Summary:** Thread weave/network grid dengan Threads wave background, woven pattern overlay, modular 3-6-3 / 7-5 / 7-5 grid, cyan-blue theme.

---

## Hero40 - Electric Storm + Lightning Background

```tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, CloudLightning } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import Lightning from '@/components/ui/lightning';

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

export function Hero40({
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
      {/* Lightning Background */}
      <div className="absolute inset-0 z-0">
        <Lightning
          hue={280}
          xOffset={0}
          speed={1.2}
          intensity={1.5}
          size={1.2}
        />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="min-h-screen py-16 flex items-center">
          <div className="w-full max-w-7xl mx-auto">
            {/* Storm Layout */}
            <div className="space-y-12">
              {/* Lightning Strike Effect */}
              <motion.div
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: [0, 1, 0], scaleY: [0, 1, 0] }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute left-1/2 top-0 -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-400 via-white to-transparent"
              />

              {/* Top Bar - Storm Header */}
              <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex items-center justify-between"
              >
                {logo && (
                  <motion.div
                    animate={{ 
                      boxShadow: [
                        '0 0 20px rgba(168, 85, 247, 0.5)',
                        '0 0 40px rgba(168, 85, 247, 0.8)',
                        '0 0 20px rgba(168, 85, 247, 0.5)'
                      ]
                    }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="relative h-20 w-20 rounded-xl overflow-hidden border-2 border-purple-400/60 backdrop-blur-sm"
                  >
                    <OptimizedImage src={logo} alt={storeName || title} fill className="object-cover" />
                  </motion.div>
                )}

                {storeName && (
                  <div className="flex items-center space-x-3 px-6 py-3 bg-purple-600/20 backdrop-blur-xl rounded-full border border-purple-400/40">
                    <CloudLightning className="h-5 w-5 text-purple-300" />
                    <span className="font-bold">{storeName}</span>
                  </div>
                )}
              </motion.div>

              {/* Center Storm Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left: Title & Subtitle */}
                <motion.div
                  initial={{ opacity: 0, x: -60 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 1 }}
                  className="space-y-10"
                >
                  {/* Electric Title */}
                  <div className="relative">
                    <motion.div
                      animate={{ 
                        opacity: [0.5, 1, 0.5],
                        textShadow: [
                          '0 0 10px rgba(168, 85, 247, 0.8)',
                          '0 0 30px rgba(168, 85, 247, 1)',
                          '0 0 10px rgba(168, 85, 247, 0.8)'
                        ]
                      }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold leading-tight tracking-tight"
                        style={{
                          textShadow: '0 0 20px rgba(168, 85, 247, 0.8), 0 0 40px rgba(139, 92, 246, 0.6)'
                        }}
                      >
                        {title}
                      </h1>
                    </motion.div>
                  </div>

                  {/* Subtitle with Electric Effect */}
                  {subtitle && (
                    <div className="bg-purple-600/10 backdrop-blur-xl rounded-3xl p-8 border border-purple-400/30 shadow-2xl">
                      <p className="text-xl sm:text-2xl text-white/90 leading-relaxed">
                        {subtitle}
                      </p>
                    </div>
                  )}

                  {/* Electric CTA */}
                  {showCta && ctaText && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link href={ctaLink}>
                        <InteractiveHoverButton 
                          className="min-w-[280px] text-lg px-10 py-7 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 group relative overflow-hidden"
                          style={{
                            boxShadow: '0 0 30px rgba(168, 85, 247, 0.5)'
                          }}
                        >
                          <Zap className="mr-2 h-5 w-5" />
                          {ctaText}
                          <motion.div
                            animate={{ x: [-100, 500] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                          />
                        </InteractiveHoverButton>
                      </Link>
                    </motion.div>
                  )}
                </motion.div>

                {/* Right: Storm Image */}
                {backgroundImage && (
                  <motion.div
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="relative"
                  >
                    <motion.div
                      animate={{
                        boxShadow: [
                          '0 0 40px rgba(168, 85, 247, 0.4)',
                          '0 0 80px rgba(168, 85, 247, 0.8)',
                          '0 0 40px rgba(168, 85, 247, 0.4)'
                        ]
                      }}
                      transition={{ repeat: Infinity, duration: 3 }}
                      className="relative h-[500px] lg:h-[700px] rounded-3xl overflow-hidden border-2 border-purple-400/50"
                    >
                      <OptimizedImage
                        src={backgroundImage}
                        alt={storeName || title}
                        fill
                        priority
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 via-transparent to-transparent" />

                      {/* Electric Grid Overlay */}
                      <div className="absolute inset-0 opacity-20" style={{
                        backgroundImage: `
                          linear-gradient(rgba(168, 85, 247, 0.3) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(168, 85, 247, 0.3) 1px, transparent 1px)
                        `,
                        backgroundSize: '30px 30px'
                      }} />
                    </motion.div>
                  </motion.div>
                )}
              </div>

              {/* Bottom Power Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="flex justify-center space-x-8"
              >
                {[1, 2, 3, 4, 5].map((bar) => (
                  <motion.div
                    key={bar}
                    animate={{ 
                      height: ['20px', `${bar * 20}px`, '20px'],
                      backgroundColor: [
                        'rgba(168, 85, 247, 0.3)',
                        'rgba(168, 85, 247, 1)',
                        'rgba(168, 85, 247, 0.3)'
                      ]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 1.5,
                      delay: bar * 0.1,
                      ease: 'easeInOut'
                    }}
                    className="w-4 bg-purple-500 rounded-full"
                  />
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

**Summary:** Electric storm theme dengan Lightning strike background, pulsing glow effects, electric grid overlay, power bar indicators, purple-violet theme.

---

## Hero41 - Floating Waves + Floating Lines Background

```tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Wind } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import FloatingLines from '@/components/ui/floating-lines';

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

export function Hero41({
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
      {/* Floating Lines Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <FloatingLines
          enabledWaves={['top', 'middle', 'bottom']}
          lineCount={6}
          lineDistance={6}
          bendRadius={6}
          bendStrength={-0.6}
          interactive={true}
          parallax={true}
        />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="min-h-screen py-20 flex items-center">
          <div className="w-full max-w-7xl mx-auto">
            {/* Wave Flow Layout */}
            <div className="space-y-20">
              {/* Top Wave - Logo & Store */}
              <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="flex items-center justify-center space-x-12"
              >
                {logo && (
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                    className="relative h-24 w-24 rounded-3xl overflow-hidden border-2 border-teal-400/40 shadow-xl backdrop-blur-lg"
                  >
                    <OptimizedImage src={logo} alt={storeName || title} fill className="object-cover" />
                  </motion.div>
                )}

                {storeName && (
                  <Badge variant="secondary" className="px-6 py-3 bg-teal-600/20 backdrop-blur-xl border-teal-400/30">
                    <Wind className="h-5 w-5 mr-2 text-teal-300" />
                    {storeName}
                  </Badge>
                )}
              </motion.div>

              {/* Middle Wave - Title & Images */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                {/* Left Image */}
                {backgroundImage && (
                  <motion.div
                    initial={{ opacity: 0, x: -60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 1 }}
                    className="hidden lg:block"
                  >
                    <motion.div
                      animate={{ y: [0, 20, 0] }}
                      transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                      className="relative h-[350px] rounded-3xl overflow-hidden border border-white/20 shadow-xl"
                    >
                      <OptimizedImage
                        src={backgroundImage}
                        alt={`${storeName || title} - Left`}
                        fill
                        className="object-cover opacity-60 hover:opacity-100 transition-opacity duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-transparent" />
                    </motion.div>
                  </motion.div>
                )}

                {/* Center Title */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 1 }}
                  className="lg:col-span-1"
                >
                  <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                  >
                    <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-tight tracking-tight text-center">
                      {title}
                    </h1>
                  </motion.div>
                </motion.div>

                {/* Right Image */}
                {backgroundImage && (
                  <motion.div
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="hidden lg:block"
                  >
                    <motion.div
                      animate={{ y: [0, -20, 0] }}
                      transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
                      className="relative h-[350px] rounded-3xl overflow-hidden border border-white/20 shadow-xl"
                    >
                      <OptimizedImage
                        src={backgroundImage}
                        alt={`${storeName || title} - Right`}
                        fill
                        className="object-cover opacity-60 hover:opacity-100 transition-opacity duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-bl from-blue-500/20 to-transparent" />
                    </motion.div>
                  </motion.div>
                )}
              </div>

              {/* Bottom Wave - Subtitle & CTA */}
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 1 }}
                className="max-w-4xl mx-auto space-y-12"
              >
                {/* Main Image (Mobile) */}
                {backgroundImage && (
                  <div className="lg:hidden relative h-[400px] rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
                    <OptimizedImage
                      src={backgroundImage}
                      alt={storeName || title}
                      fill
                      priority
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                )}

                {/* Subtitle Wave */}
                {subtitle && (
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                    className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-10 border border-white/20 shadow-xl"
                  >
                    <p className="text-2xl sm:text-3xl text-white/80 leading-relaxed text-center">
                      {subtitle}
                    </p>
                  </motion.div>
                )}

                {/* CTA Wave */}
                {showCta && ctaText && (
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                    className="flex justify-center"
                  >
                    <Link href={ctaLink}>
                      <InteractiveHoverButton className="min-w-[300px] text-xl px-12 py-7 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 shadow-lg shadow-teal-500/30">
                        {ctaText}
                      </InteractiveHoverButton>
                    </Link>
                  </motion.div>
                )}
              </motion.div>

              {/* Bottom Wave Indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="flex justify-center"
              >
                <motion.div
                  animate={{ 
                    scaleX: [1, 1.5, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  className="h-1 w-64 bg-gradient-to-r from-transparent via-teal-500 to-transparent rounded-full"
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

**Summary:** Floating wave flow dengan Floating Lines parallax background, vertical wave rhythm, floating y-axis animations, teal-blue ocean theme.

---

## Installation Dependencies

```bash
# React Bits Backgrounds
pnpm dlx shadcn@latest add @react-bits/PrismaticBurst-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Ballpit-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Threads-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Lightning-TS-CSS
pnpm dlx shadcn@latest add @react-bits/FloatingLines-TS-CSS

# Framer Motion
pnpm add framer-motion

# Lucide Icons
pnpm add lucide-react
```

---

## Component Paths

- `@/components/ui/prismatic-burst` → PrismaticBurst component
- `@/components/ui/ballpit` → Ballpit component
- `@/components/ui/threads` → Threads component
- `@/components/ui/lightning` → Lightning component
- `@/components/ui/floating-lines` → FloatingLines component

---

## Layout Summary

| Hero    | Layout Type       | Background Effect  | Key Features                                    |
|---------|-------------------|--------------------|-------------------------------------------------|
| Hero37  | Burst Radial      | Prismatic Burst    | Orbit layout, pulsing rings, radial positioning |
| Hero38  | Playful Balls     | Ballpit            | Bouncy animations, floating orbs, fun colorful  |
| Hero39  | Thread Weave      | Threads            | Woven grid, pattern overlay, network theme      |
| Hero40  | Electric Storm    | Lightning          | Electric glow, power bars, storm effects        |
| Hero41  | Floating Waves    | Floating Lines     | Wave flow, y-axis float, parallax rhythm        |

---

**Ready to copy-paste!** 🚀
