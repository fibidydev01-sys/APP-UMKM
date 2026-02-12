# Hero Variants 32-36 - React Bits Edition

Complete hero components dengan React Bits background effects. Copy-paste ready.

---

## Hero32 - Split Vertical + Gradient Blinds Background

```tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Aperture } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import GradientBlinds from '@/components/ui/gradient-blinds';

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

export function Hero32({
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
      {/* Gradient Blinds Background */}
      <div className="absolute inset-0 z-0">
        <GradientBlinds
          gradientColors={['#FF9FFC', '#5227FF']}
          angle={0}
          noise={0.4}
          blindCount={15}
          blindMinWidth={60}
          spotlightRadius={0.6}
          spotlightSoftness={1.2}
          spotlightOpacity={1}
          mouseDampening={0.12}
          distortAmount={0}
          shineDirection="left"
          mixBlendMode="lighten"
        />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="min-h-screen py-16 flex items-center">
          <div className="w-full">
            {/* Vertical Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-20 items-center">
              {/* Left Column */}
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="space-y-12 order-2 lg:order-1"
              >
                {/* Logo & Badge */}
                <div className="flex items-center justify-between lg:justify-start space-x-6">
                  {logo && (
                    <div className="relative h-20 w-20 rounded-2xl overflow-hidden border-2 border-purple-400/40 shadow-xl backdrop-blur-lg">
                      <OptimizedImage src={logo} alt={storeName || title} fill className="object-cover" />
                    </div>
                  )}

                  {storeName && (
                    <Badge variant="secondary" className="px-5 py-2.5 bg-purple-600/20 backdrop-blur-xl border-purple-400/30">
                      <Aperture className="h-4 w-4 mr-2" />
                      {storeName}
                    </Badge>
                  )}
                </div>

                {/* Title & Subtitle */}
                <div className="space-y-8">
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight tracking-tight">
                    {title}
                  </h1>

                  {subtitle && (
                    <p className="text-xl sm:text-2xl lg:text-3xl text-white/80 leading-relaxed max-w-2xl">
                      {subtitle}
                    </p>
                  )}
                </div>

                {/* CTA */}
                {showCta && ctaText && (
                  <Link href={ctaLink} className="inline-block">
                    <InteractiveHoverButton className="min-w-[280px] text-lg px-10 py-7 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      {ctaText}
                    </InteractiveHoverButton>
                  </Link>
                )}

                {/* Decorative Line */}
                <div className="flex items-center space-x-4 pt-8">
                  <div className="h-px flex-1 bg-gradient-to-r from-purple-500/50 to-transparent" />
                  <span className="text-sm text-white/40 uppercase tracking-wider">Featured</span>
                  <div className="h-px flex-1 bg-gradient-to-l from-pink-500/50 to-transparent" />
                </div>
              </motion.div>

              {/* Right Column */}
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="space-y-8 order-1 lg:order-2"
              >
                {/* Main Image */}
                {backgroundImage && (
                  <div className="relative h-[450px] lg:h-[700px] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                    <OptimizedImage
                      src={backgroundImage}
                      alt={storeName || title}
                      fill
                      priority
                      className="object-cover hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-pink-600/20" />
                  </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4">
                  {['1000+', '24/7', '100%'].map((stat, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + idx * 0.1, duration: 0.6 }}
                      className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center"
                    >
                      <div className="text-3xl font-bold text-purple-300">{stat}</div>
                      <div className="text-xs text-white/60 mt-2">
                        {idx === 0 ? 'Products' : idx === 1 ? 'Support' : 'Secure'}
                      </div>
                    </motion.div>
                  ))}
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

**Summary:** Vertical split dengan Gradient Blinds spotlight, stats grid, decorative lines, purple-pink theme.

---

## Hero33 - Card Game Style + Balatro Background

```tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Spade, Heart } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import Balatro from '@/components/ui/balatro';

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

export function Hero33({
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
      {/* Balatro Background */}
      <div className="absolute inset-0 z-0 opacity-70">
        <Balatro
          isRotate={false}
          mouseInteraction
          pixelFilter={800}
          color1="#DE443B"
          color2="#006BB4"
          color3="#162325"
        />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="min-h-screen py-16 flex items-center justify-center">
          <div className="w-full max-w-6xl">
            {/* Card Game Layout */}
            <div className="space-y-12">
              {/* Top: Logo Bar */}
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex items-center justify-center space-x-4"
              >
                {logo && (
                  <div className="relative h-16 w-16 rounded-xl overflow-hidden border-2 border-red-500/40 shadow-xl backdrop-blur-sm">
                    <OptimizedImage src={logo} alt={storeName || title} fill className="object-cover" />
                  </div>
                )}

                {storeName && (
                  <div className="flex items-center space-x-2 px-5 py-2 bg-red-600/20 backdrop-blur-xl rounded-full border border-red-500/30">
                    <Heart className="h-4 w-4 text-red-400 fill-red-400" />
                    <span className="font-bold">{storeName}</span>
                  </div>
                )}
              </motion.div>

              {/* Center: Playing Card Stack */}
              <div className="relative" style={{ perspective: '1200px' }}>
                {/* Card 3 - Back */}
                <motion.div
                  initial={{ opacity: 0, rotateY: -20, z: -200 }}
                  animate={{ opacity: 0.6, rotateY: -15, z: -100 }}
                  transition={{ delay: 0.2, duration: 1 }}
                  className="absolute inset-0 translate-x-12 translate-y-6 bg-gradient-to-br from-red-900/40 to-blue-900/40 backdrop-blur-2xl rounded-3xl border-2 border-white/10 shadow-2xl"
                />

                {/* Card 2 - Middle */}
                <motion.div
                  initial={{ opacity: 0, rotateY: -10, z: -100 }}
                  animate={{ opacity: 0.8, rotateY: -8, z: -50 }}
                  transition={{ delay: 0.3, duration: 1 }}
                  className="absolute inset-0 translate-x-6 translate-y-3 bg-gradient-to-br from-red-800/50 to-blue-800/50 backdrop-blur-xl rounded-3xl border-2 border-white/20 shadow-2xl"
                />

                {/* Card 1 - Front */}
                <motion.div
                  initial={{ opacity: 0, rotateY: 0 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  transition={{ delay: 0.4, duration: 1 }}
                  className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl border-2 border-white/30 shadow-2xl p-12 lg:p-16"
                >
                  {/* Card Corner Decorations */}
                  <div className="absolute top-6 left-6 flex items-center space-x-2">
                    <Spade className="h-6 w-6 text-white" />
                    <span className="text-2xl font-bold">A</span>
                  </div>
                  <div className="absolute bottom-6 right-6 flex items-center space-x-2 rotate-180">
                    <Spade className="h-6 w-6 text-white" />
                    <span className="text-2xl font-bold">A</span>
                  </div>

                  {/* Content */}
                  <div className="space-y-10">
                    {/* Title */}
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight tracking-tight text-center">
                      {title}
                    </h1>

                    {/* Image */}
                    {backgroundImage && (
                      <div className="relative h-[300px] sm:h-[400px] rounded-2xl overflow-hidden shadow-xl border border-white/20">
                        <OptimizedImage
                          src={backgroundImage}
                          alt={storeName || title}
                          fill
                          priority
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-red-900/30 to-blue-900/30" />
                      </div>
                    )}

                    {/* Subtitle */}
                    {subtitle && (
                      <p className="text-xl sm:text-2xl text-white/80 leading-relaxed text-center max-w-3xl mx-auto">
                        {subtitle}
                      </p>
                    )}

                    {/* CTA */}
                    {showCta && ctaText && (
                      <div className="flex justify-center pt-6">
                        <Link href={ctaLink}>
                          <InteractiveHoverButton className="min-w-[260px] text-lg px-10 py-7 bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700">
                            {ctaText}
                          </InteractiveHoverButton>
                        </Link>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Bottom: Chip Stack */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="flex items-center justify-center space-x-6"
              >
                {[1, 2, 3].map((chip) => (
                  <div
                    key={chip}
                    className="w-16 h-16 rounded-full border-4 border-white/20 bg-gradient-to-br from-red-600/60 to-blue-600/60 backdrop-blur-md flex items-center justify-center font-bold text-2xl shadow-xl"
                  >
                    {chip}
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

**Summary:** Card game/casino style dengan Balatro pixel background, stacked playing cards, poker chip decorations, red-blue theme.

---

## Hero34 - Crystalline + Prism Background

```tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Diamond } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import Prism from '@/components/ui/prism';

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

export function Hero34({
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
      {/* Prism Background */}
      <div className="absolute inset-0 z-0">
        <Prism
          animationType="rotate"
          timeScale={0.4}
          height={4}
          baseWidth={6}
          scale={4}
          hueShift={0}
          colorFrequency={1.2}
          noise={0}
          glow={1.5}
        />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="min-h-screen py-20 flex items-center">
          <div className="w-full max-w-7xl mx-auto">
            {/* Crystalline Grid Layout */}
            <div className="grid grid-cols-12 gap-6 auto-rows-[150px]">
              {/* Logo Diamond */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -45 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, type: 'spring' }}
                className="col-span-12 sm:col-span-4 lg:col-span-3 row-span-2"
              >
                <div className="h-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-8 flex flex-col items-center justify-center space-y-4 relative overflow-hidden">
                  {/* Crystal Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent animate-pulse" />
                  
                  {logo ? (
                    <div className="relative h-20 w-20 rounded-2xl overflow-hidden border-2 border-white/30 shadow-xl z-10">
                      <OptimizedImage src={logo} alt={storeName || title} fill className="object-cover" />
                    </div>
                  ) : (
                    <Diamond className="h-20 w-20 z-10" />
                  )}

                  {storeName && (
                    <Badge variant="secondary" className="px-4 py-2 bg-white/10 backdrop-blur-md border-white/20 z-10">
                      {storeName}
                    </Badge>
                  )}
                </div>
              </motion.div>

              {/* Title Crystal */}
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 1 }}
                className="col-span-12 lg:col-span-9 row-span-3"
              >
                <div className="h-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-10 lg:p-14 flex flex-col justify-center relative overflow-hidden">
                  {/* Prismatic Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10" />
                  
                  <div className="space-y-8 relative z-10">
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight tracking-tight">
                      {title}
                    </h1>

                    {subtitle && (
                      <p className="text-xl sm:text-2xl lg:text-3xl text-white/80 leading-relaxed max-w-4xl">
                        {subtitle}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Image Facet */}
              {backgroundImage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 1 }}
                  className="col-span-12 sm:col-span-8 lg:col-span-7 row-span-4"
                >
                  <div className="h-full relative rounded-3xl overflow-hidden shadow-2xl border border-white/20"
                    style={{
                      clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)'
                    }}
                  >
                    <OptimizedImage
                      src={backgroundImage}
                      alt={storeName || title}
                      fill
                      priority
                      className="object-cover hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-cyan-600/20" />
                  </div>
                </motion.div>
              )}

              {/* CTA Gem */}
              {showCta && ctaText && (
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 1 }}
                  className="col-span-12 sm:col-span-4 lg:col-span-5 row-span-2"
                >
                  <div className="h-full bg-gradient-to-br from-purple-600/20 to-cyan-600/20 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-8 flex flex-col items-center justify-center space-y-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent animate-pulse" />
                    
                    <Diamond className="h-12 w-12 text-purple-300 z-10" />
                    <Link href={ctaLink} className="w-full z-10">
                      <InteractiveHoverButton className="w-full text-lg px-8 py-6 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
                        {ctaText}
                      </InteractiveHoverButton>
                    </Link>
                  </div>
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

**Summary:** Crystalline/diamond grid dengan Prism glow background, octagon image clip, gem-shaped cards, purple-cyan prismatic theme.

---

## Hero35 - Neon Pillar + Light Pillar Background

```tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, Star } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import LightPillar from '@/components/ui/light-pillar';

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

export function Hero35({
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
      {/* Light Pillar Background */}
      <div className="absolute inset-0 z-0">
        <LightPillar
          topColor="#5227FF"
          bottomColor="#FF9FFC"
          intensity={1.2}
          rotationSpeed={0.25}
          glowAmount={0.003}
          pillarWidth={4}
          pillarHeight={0.5}
          noiseIntensity={0.6}
          pillarRotation={30}
          interactive={false}
          mixBlendMode="screen"
          quality="high"
        />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="min-h-screen py-16 flex items-center">
          <div className="w-full max-w-7xl mx-auto">
            {/* Neon Layout */}
            <div className="space-y-16">
              {/* Top Neon Bar */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="flex items-center justify-between"
              >
                <div className="h-1 flex-1 bg-gradient-to-r from-transparent via-purple-500 to-pink-500 rounded-full" />
                {logo && (
                  <div className="relative h-20 w-20 mx-8 rounded-full overflow-hidden border-4 border-purple-500/50 shadow-2xl shadow-purple-500/50">
                    <OptimizedImage src={logo} alt={storeName || title} fill className="object-cover" />
                  </div>
                )}
                <div className="h-1 flex-1 bg-gradient-to-l from-transparent via-pink-500 to-purple-500 rounded-full" />
              </motion.div>

              {/* Center Content */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
                {/* Left: Store Badge */}
                {storeName && (
                  <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="lg:col-span-1 hidden lg:block"
                  >
                    <div className="bg-purple-600/20 backdrop-blur-xl rounded-2xl p-6 border-2 border-purple-500/50 shadow-lg shadow-purple-500/30">
                      <div className="flex flex-col items-center space-y-4">
                        <Star className="h-8 w-8 text-purple-400 fill-purple-400" />
                        <span className="text-sm font-bold uppercase tracking-wider text-purple-300 rotate-90 whitespace-nowrap origin-center">
                          {storeName}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Center: Title & Image */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="lg:col-span-3 space-y-12"
                >
                  {/* Title with Neon Effect */}
                  <div className="relative">
                    <h1 
                      className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold leading-tight tracking-tight text-center"
                      style={{
                        textShadow: '0 0 20px rgba(82, 39, 255, 0.8), 0 0 40px rgba(255, 159, 252, 0.6)'
                      }}
                    >
                      {title}
                    </h1>
                  </div>

                  {/* Neon Frame Image */}
                  {backgroundImage && (
                    <div className="relative">
                      {/* Outer Glow */}
                      <div className="absolute -inset-4 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-3xl blur-xl" />
                      
                      {/* Frame */}
                      <div className="relative h-[400px] sm:h-[500px] rounded-3xl overflow-hidden border-4 border-purple-500/50 shadow-2xl shadow-purple-500/40">
                        <OptimizedImage
                          src={backgroundImage}
                          alt={storeName || title}
                          fill
                          priority
                          className="object-cover hover:scale-105 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent" />
                      </div>
                    </div>
                  )}

                  {/* Subtitle with Glow */}
                  {subtitle && (
                    <p 
                      className="text-xl sm:text-2xl text-white/90 leading-relaxed text-center max-w-3xl mx-auto"
                      style={{
                        textShadow: '0 0 10px rgba(255, 159, 252, 0.5)'
                      }}
                    >
                      {subtitle}
                    </p>
                  )}
                </motion.div>

                {/* Right: CTA */}
                {showCta && ctaText && (
                  <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="lg:col-span-1 hidden lg:block"
                  >
                    <div className="bg-pink-600/20 backdrop-blur-xl rounded-2xl p-6 border-2 border-pink-500/50 shadow-lg shadow-pink-500/30">
                      <div className="flex flex-col items-center space-y-6">
                        <Zap className="h-8 w-8 text-pink-400 fill-pink-400" />
                        <Link href={ctaLink} className="w-full">
                          <InteractiveHoverButton className="w-full text-sm px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rotate-90 origin-center whitespace-nowrap">
                            {ctaText}
                          </InteractiveHoverButton>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Mobile CTA */}
              {showCta && ctaText && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                  className="lg:hidden flex justify-center"
                >
                  <Link href={ctaLink}>
                    <InteractiveHoverButton className="min-w-[260px] text-lg px-10 py-7 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30">
                      <Zap className="mr-2 h-5 w-5" />
                      {ctaText}
                    </InteractiveHoverButton>
                  </Link>
                </motion.div>
              )}

              {/* Bottom Neon Bar */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 1, duration: 1.5, ease: 'easeOut' }}
                className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Summary:** Neon/cyberpunk style dengan Light Pillar rotating background, text-shadow glow effects, neon frame borders, 1-3-1 column layout.

---

## Hero36 - Grid Motion + Squares Background

```tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Grid3x3, ArrowRight } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import Squares from '@/components/ui/squares';

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

export function Hero36({
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
      {/* Squares Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Squares
          speed={0.3}
          squareSize={50}
          direction="diagonal"
          borderColor="#1a1a1a"
          hoverColor="#2a2a2a"
          size={50}
        />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="min-h-screen py-20 flex items-center">
          <div className="w-full max-w-7xl mx-auto">
            {/* Grid Motion Layout */}
            <div className="space-y-16">
              {/* Header Grid */}
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="grid grid-cols-3 gap-6"
              >
                {/* Logo Cell */}
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 flex items-center justify-center">
                  {logo ? (
                    <div className="relative h-20 w-20 rounded-xl overflow-hidden border border-white/20">
                      <OptimizedImage src={logo} alt={storeName || title} fill className="object-cover" />
                    </div>
                  ) : (
                    <Grid3x3 className="h-20 w-20 text-white/40" />
                  )}
                </div>

                {/* Title Cell - Spans 2 */}
                <div className="col-span-2 bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 flex items-center">
                  {storeName && (
                    <Badge variant="secondary" className="px-5 py-2.5 bg-white/10 backdrop-blur-md border-white/20">
                      <Grid3x3 className="h-4 w-4 mr-2" />
                      {storeName}
                    </Badge>
                  )}
                </div>
              </motion.div>

              {/* Main Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Content Grid */}
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="space-y-8"
                >
                  {/* Title Cell */}
                  <div className="bg-white/5 backdrop-blur-md rounded-2xl p-10 lg:p-12 border border-white/10 min-h-[300px] flex items-center">
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
                      {title}
                    </h1>
                  </div>

                  {/* Subtitle Cell */}
                  {subtitle && (
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                      <p className="text-xl sm:text-2xl text-white/80 leading-relaxed">
                        {subtitle}
                      </p>
                    </div>
                  )}

                  {/* CTA Cell */}
                  {showCta && ctaText && (
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 flex items-center justify-between group hover:bg-white/10 transition-colors">
                      <Link href={ctaLink} className="flex-1">
                        <InteractiveHoverButton className="w-full text-lg px-8 py-6 bg-white text-black hover:bg-white/90 group">
                          {ctaText}
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </InteractiveHoverButton>
                      </Link>
                    </div>
                  )}
                </motion.div>

                {/* Right: Image Grid */}
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="grid grid-cols-2 gap-8"
                >
                  {backgroundImage ? (
                    <>
                      {/* Large Cell - Spans 2 */}
                      <div className="col-span-2 relative h-[400px] bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                        <OptimizedImage
                          src={backgroundImage}
                          alt={storeName || title}
                          fill
                          priority
                          className="object-cover hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      </div>

                      {/* Small Cell 1 */}
                      <div className="relative h-[200px] bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10">
                        <OptimizedImage
                          src={backgroundImage}
                          alt={`${storeName || title} - 2`}
                          fill
                          className="object-cover opacity-80 hover:opacity-100 transition-opacity duration-500"
                        />
                      </div>

                      {/* Small Cell 2 - Decorative */}
                      <div className="h-[200px] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center">
                        <Grid3x3 className="h-16 w-16 text-white/20" />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Fallback Grid */}
                      <div className="col-span-2 h-[400px] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center">
                        <span className="text-9xl opacity-20">📐</span>
                      </div>
                      <div className="h-[200px] bg-white/5 backdrop-blur-md rounded-2xl border border-white/10" />
                      <div className="h-[200px] bg-white/5 backdrop-blur-md rounded-2xl border border-white/10" />
                    </>
                  )}
                </motion.div>
              </div>

              {/* Footer Grid */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="grid grid-cols-4 gap-6"
              >
                {['Quality', 'Speed', 'Support', 'Secure'].map((label, idx) => (
                  <div
                    key={idx}
                    className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center hover:bg-white/10 transition-colors"
                  >
                    <div className="text-sm text-white/60 uppercase tracking-wider">{label}</div>
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

**Summary:** Modular grid system dengan Squares animated background, cell-based layout, glass morphism panels, responsive 2-column grid.

---

## Installation Dependencies

```bash
# React Bits Backgrounds
pnpm dlx shadcn@latest add @react-bits/GradientBlinds-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Balatro-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Prism-TS-CSS
pnpm dlx shadcn@latest add @react-bits/LightPillar-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Squares-TS-CSS

# Framer Motion
pnpm add framer-motion

# Lucide Icons
pnpm add lucide-react
```

---

## Component Paths

- `@/components/ui/gradient-blinds` → GradientBlinds component
- `@/components/ui/balatro` → Balatro component
- `@/components/ui/prism` → Prism component
- `@/components/ui/light-pillar` → LightPillar component
- `@/components/ui/squares` → Squares component

---

## Layout Summary

| Hero    | Layout Type       | Background Effect  | Key Features                                     |
|---------|-------------------|--------------------|--------------------------------------------------|
| Hero32  | Split Vertical    | Gradient Blinds    | Stats grid, spotlight effect, decorative lines   |
| Hero33  | Card Game Style   | Balatro            | Stacked cards, poker chips, casino theme         |
| Hero34  | Crystalline       | Prism              | Diamond grid, octagon clip, prismatic glow       |
| Hero35  | Neon Pillar       | Light Pillar       | Rotating pillars, text-shadow glow, neon frames  |
| Hero36  | Grid Motion       | Squares            | Modular cells, glass morphism, 2-column layout   |

---

**Ready to copy-paste!** 🚀
