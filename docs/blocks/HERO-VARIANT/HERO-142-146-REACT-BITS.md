# HERO COMPONENTS 142-146 WITH REACT BITS

5 Hero component variants dengan React Bits integration, dark mode, dan layout avant-garde.

---

## HERO-142: Split Horizonal with GradientBlinds Background

**Layout**: Horizontal split top-bottom dengan reversed order  
**Background**: GradientBlinds effect  
**Animation**: Balatro, RippleGrid, LightPillar

```tsx
// Hero142.tsx
import { motion } from 'framer-motion';
import Balatro from '@/components/ui/Balatro';
import RippleGrid from '@/components/ui/RippleGrid';
import GradientBlinds from '@/components/ui/GradientBlinds';
import LightPillar from '@/components/ui/LightPillar';

interface Hero142Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

export function Hero142({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: Hero142Props) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* GradientBlinds Background */}
      <div className="absolute inset-0 z-0">
        <GradientBlinds
          gradientColors={['#FF9FFC', '#5227FF']}
          angle={0}
          noise={0.3}
          blindCount={12}
          spotlightRadius={0.5}
        />
      </div>

      {/* Balatro Effect */}
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-40">
        <Balatro
          mouseInteraction
          pixelFilter={745}
          color1="#DE443B"
          color2="#006BB4"
          color3="#162325"
        />
      </div>

      {/* Light Pillar */}
      <div className="absolute inset-0 z-[2] pointer-events-none opacity-30">
        <LightPillar
          topColor="#5227FF"
          bottomColor="#FF9FFC"
          intensity={1}
          rotationSpeed={0.3}
          interactive
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* Top Section - Content */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex-1 flex items-end pb-16"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              
              {/* Header Bar */}
              <div className="flex items-center justify-between mb-12">
                {/* Logo & Store */}
                <div className="flex items-center gap-4">
                  {logo && (
                    <img 
                      src={logo} 
                      alt="Logo" 
                      className="w-14 h-14 rounded-2xl ring-2 ring-white/30 shadow-xl"
                    />
                  )}
                  {storeName && (
                    <span className="text-xl font-black tracking-wide">
                      {storeName}
                    </span>
                  )}
                </div>

                {/* Badge */}
                <div className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20">
                  <span className="text-sm font-bold tracking-wider">TOP TIER</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-none mb-8">
                {title}
              </h1>

              {/* Subtitle */}
              {subtitle && (
                <p className="text-2xl md:text-3xl text-white/70 max-w-3xl mb-12 leading-relaxed">
                  {subtitle}
                </p>
              )}

              {/* CTA */}
              {showCta && ctaText && (
                <a
                  href={ctaLink}
                  className="inline-flex items-center gap-4 px-12 py-6 bg-white text-black rounded-full font-black text-xl hover:bg-white/90 transition-all hover:scale-105 shadow-2xl shadow-white/30 group"
                >
                  {ctaText}
                  <svg className="w-7 h-7 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              )}

            </div>
          </div>
        </motion.div>

        {/* Bottom Section - Image with RippleGrid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="flex-1 relative"
        >
          <div className="absolute inset-0">
            <RippleGrid
              enableRainbow={false}
              gridColor="#ffffff"
              rippleIntensity={0.05}
              gridSize={10}
              mouseInteraction
              opacity={0.3}
            />
          </div>

          {backgroundImage && (
            <div className="container mx-auto px-4 h-full flex items-start pt-8">
              <div className="relative w-full max-w-6xl mx-auto h-[400px] rounded-[3rem] overflow-hidden">
                <img
                  src={backgroundImage}
                  alt={title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              </div>
            </div>
          )}
        </motion.div>

      </div>
    </section>
  );
}
```

---

## HERO-143: Modular Grid with LightRays Background

**Layout**: Modular grid blocks (masonry style)  
**Background**: LightRays effect  
**Animation**: PixelBlast, Dither, GridMotion

```tsx
// Hero143.tsx
import { motion } from 'framer-motion';
import PixelBlast from '@/components/ui/PixelBlast';
import Dither from '@/components/ui/Dither';
import LightRays from '@/components/ui/LightRays';
import GridMotion from '@/components/ui/GridMotion';

interface Hero143Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

export function Hero143({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: Hero143Props) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* LightRays Background */}
      <div className="absolute inset-0 z-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={1}
          followMouse
          mouseInfluence={0.1}
        />
      </div>

      {/* Dither Effect */}
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-20">
        <Dither
          waveColor={[0.5, 0.5, 0.5]}
          enableMouseInteraction
          mouseRadius={0.3}
          colorNum={4}
        />
      </div>

      {/* PixelBlast Overlay */}
      <div className="absolute inset-0 z-[2] pointer-events-none opacity-10">
        <PixelBlast
          variant="square"
          pixelSize={4}
          color="#B19EEF"
          enableRipples
          transparent
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 min-h-screen">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-between mb-20"
        >
          {/* Logo & Store */}
          <div className="flex items-center gap-4">
            {logo && (
              <img 
                src={logo} 
                alt="Logo" 
                className="w-12 h-12 rounded-xl ring-2 ring-white/20"
              />
            )}
            {storeName && (
              <span className="text-lg font-bold">
                {storeName}
              </span>
            )}
          </div>

          {/* Navigation */}
          <div className="hidden md:flex gap-6 text-sm font-semibold text-white/60">
            <span className="hover:text-white transition-colors cursor-pointer">Collection</span>
            <span className="hover:text-white transition-colors cursor-pointer">About</span>
            <span className="hover:text-white transition-colors cursor-pointer">Contact</span>
          </div>
        </motion.div>

        {/* Modular Grid Layout */}
        <div className="grid grid-cols-12 gap-6 max-w-7xl mx-auto">
          
          {/* Block 1 - Title (Large) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="col-span-12 lg:col-span-7 row-span-2 p-10 md:p-16 rounded-[2.5rem] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 flex items-center"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight">
              {title}
            </h1>
          </motion.div>

          {/* Block 2 - Image (Medium) */}
          {backgroundImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="col-span-12 lg:col-span-5 row-span-1 h-[300px] rounded-[2.5rem] overflow-hidden"
            >
              <img
                src={backgroundImage}
                alt={title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          )}

          {/* Block 3 - Subtitle (Medium) */}
          {subtitle && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="col-span-12 lg:col-span-5 row-span-1 p-10 rounded-[2.5rem] bg-white/5 backdrop-blur-2xl border border-white/10 flex items-center"
            >
              <p className="text-xl text-white/70 leading-relaxed">
                {subtitle}
              </p>
            </motion.div>
          )}

          {/* Block 4 - Stats (Small) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="col-span-6 lg:col-span-3 p-8 rounded-[2rem] bg-gradient-to-br from-purple-500/20 to-transparent backdrop-blur-xl border border-white/10 text-center"
          >
            <p className="text-4xl font-black mb-2">500+</p>
            <p className="text-sm text-white/60">Products</p>
          </motion.div>

          {/* Block 5 - Stats (Small) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="col-span-6 lg:col-span-3 p-8 rounded-[2rem] bg-gradient-to-br from-pink-500/20 to-transparent backdrop-blur-xl border border-white/10 text-center"
          >
            <p className="text-4xl font-black mb-2">99%</p>
            <p className="text-sm text-white/60">Satisfied</p>
          </motion.div>

          {/* Block 6 - CTA (Medium) */}
          {showCta && ctaText && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="col-span-12 lg:col-span-6 p-10 rounded-[2.5rem] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 flex items-center justify-center"
            >
              <a
                href={ctaLink}
                className="inline-flex items-center gap-4 px-10 py-5 bg-white text-black rounded-2xl font-bold text-lg hover:bg-white/90 transition-all hover:scale-105 group"
              >
                {ctaText}
                <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </motion.div>
          )}

        </div>

      </div>
    </section>
  );
}
```

---

## HERO-144: Asymmetric Overlay with PixelSnow Background

**Layout**: Floating overlapping panels  
**Background**: PixelSnow effect  
**Animation**: PrismaticBurst, Squares, Ballpit

```tsx
// Hero144.tsx
import { motion } from 'framer-motion';
import PrismaticBurst from '@/components/ui/PrismaticBurst';
import Squares from '@/components/ui/Squares';
import PixelSnow from '@/components/ui/PixelSnow';
import Ballpit from '@/components/ui/Ballpit';

interface Hero144Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

export function Hero144({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: Hero144Props) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* PixelSnow Background */}
      <div className="absolute inset-0 z-0">
        <PixelSnow
          color="#ffffff"
          flakeSize={0.01}
          speed={1.25}
          density={0.3}
          direction={125}
          variant="square"
        />
      </div>

      {/* Squares Effect */}
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-30">
        <Squares
          squareSize={40}
          speed={0.5}
          borderColor="#ffffff"
          hoverFillColor="#5227FF"
        />
      </div>

      {/* PrismaticBurst Overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[2] pointer-events-none opacity-20">
        <PrismaticBurst
          lightColor="#ffffff"
          raysCount={12}
          blendMode="screen"
          rayWidth={2}
        />
      </div>

      {/* Ballpit Bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-[3] h-[300px] pointer-events-none opacity-40">
        <Ballpit
          count={30}
          gravity={0.8}
          friction={0.98}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 min-h-screen flex items-center justify-center">
        
        {/* Floating Panels Container */}
        <div className="relative w-full max-w-7xl">
          
          {/* Panel 1 - Logo & Store (Top Left) */}
          {(logo || storeName) && (
            <motion.div
              initial={{ opacity: 0, x: -100, rotate: -5 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="absolute top-0 left-0 z-20"
            >
              <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl">
                <div className="flex items-center gap-4">
                  {logo && (
                    <img 
                      src={logo} 
                      alt="Logo" 
                      className="w-12 h-12 rounded-xl"
                    />
                  )}
                  {storeName && (
                    <span className="text-lg font-bold">
                      {storeName}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Panel 2 - Title (Center) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative z-10 text-center"
          >
            <div className="p-16 md:p-24 rounded-[3rem] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-3xl border-2 border-white/20 shadow-2xl">
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-none">
                {title}
              </h1>
            </div>
          </motion.div>

          {/* Panel 3 - Image (Right) */}
          {backgroundImage && (
            <motion.div
              initial={{ opacity: 0, x: 100, rotate: 5 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="absolute top-20 right-0 z-30 hidden lg:block"
            >
              <div className="w-[300px] h-[400px] rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl transform rotate-6 hover:rotate-0 transition-transform duration-500">
                <img
                  src={backgroundImage}
                  alt={title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            </motion.div>
          )}

          {/* Panel 4 - Subtitle (Bottom Left) */}
          {subtitle && (
            <motion.div
              initial={{ opacity: 0, y: 100, rotate: -3 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="absolute bottom-0 left-20 z-20 max-w-md hidden lg:block"
            >
              <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl">
                <p className="text-lg text-white/70 leading-relaxed">
                  {subtitle}
                </p>
              </div>
            </motion.div>
          )}

          {/* Panel 5 - CTA (Bottom Right) */}
          {showCta && ctaText && (
            <motion.div
              initial={{ opacity: 0, y: 100, rotate: 3 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="absolute bottom-0 right-20 z-30 hidden lg:block"
            >
              <a
                href={ctaLink}
                className="inline-flex items-center gap-4 px-10 py-5 bg-white text-black rounded-2xl font-black text-lg hover:bg-white/90 transition-all hover:scale-110 shadow-2xl shadow-white/30 group"
              >
                {ctaText}
                <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </motion.div>
          )}

          {/* Mobile Stack (visible on mobile) */}
          <div className="lg:hidden mt-20 space-y-8">
            {subtitle && (
              <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10">
                <p className="text-lg text-white/70 leading-relaxed">
                  {subtitle}
                </p>
              </div>
            )}
            {showCta && ctaText && (
              <a
                href={ctaLink}
                className="flex items-center justify-center gap-4 px-10 py-5 bg-white text-black rounded-2xl font-black text-lg hover:bg-white/90 transition-all"
              >
                {ctaText}
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
```

---

## HERO-145: Terminal Style with GridDistortion Background

**Layout**: Command-line interface aesthetic  
**Background**: GridDistortion effect  
**Animation**: AnimatedContent, FadeContent, GradualBlur

```tsx
// Hero145.tsx
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import AnimatedContent from '@/components/ui/AnimatedContent';
import FadeContent from '@/components/ui/FadeContent';
import GridDistortion from '@/components/ui/GridDistortion';
import GradualBlur from '@/components/ui/GradualBlur';

interface Hero145Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

export function Hero145({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: Hero145Props) {
  const [command, setCommand] = useState('');
  const fullCommand = `$ launch ${title.toLowerCase().replace(/\s+/g, '-')}`;

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullCommand.length) {
        setCommand(fullCommand.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [fullCommand]);

  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white font-mono">
      {/* GridDistortion Background */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0 opacity-30">
          <GridDistortion
            imageSrc={backgroundImage}
            grid={10}
            mouse={0.1}
            strength={0.15}
            relaxation={0.9}
          />
        </div>
      )}

      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-black to-black z-[1]" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 min-h-screen">
        
        {/* Terminal Window */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-6xl mx-auto"
        >
          
          {/* Terminal Header */}
          <div className="flex items-center gap-2 px-6 py-4 bg-white/5 backdrop-blur-xl border-b border-white/10 rounded-t-2xl">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex-1 text-center text-xs text-white/60">
              {storeName || 'terminal'} — bash — 80x24
            </div>
          </div>

          {/* Terminal Content */}
          <div className="p-8 md:p-12 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-b-2xl min-h-[600px] space-y-6">
            
            {/* System Info */}
            <div className="space-y-2 text-sm text-green-400/80">
              <p>Last login: {new Date().toLocaleString()} on ttys001</p>
              {logo && (
                <p>System: {storeName || 'Premium Store'} v2.0.1</p>
              )}
              <p>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</p>
            </div>

            {/* Command Animation */}
            <div className="text-white">
              <span className="text-green-400">user@system</span>
              <span className="text-blue-400">:</span>
              <span className="text-purple-400">~/store</span>
              <span className="text-white">$ </span>
              <span>{command}</span>
              <span className="animate-pulse">▊</span>
            </div>

            {/* Output Section */}
            <AnimatedContent
              animateOnView
              delay={1500}
            >
              <div className="space-y-4 mt-8 pt-8 border-t border-white/10">
                
                {/* Title Output */}
                <div className="space-y-2">
                  <p className="text-yellow-400 text-sm">
                    [INFO] Launching application...
                  </p>
                  <p className="text-green-400 text-sm">
                    [OK] System initialized
                  </p>
                </div>

                {/* Main Title */}
                <div className="py-8">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight">
                    {title}
                  </h1>
                </div>

                {/* Subtitle */}
                {subtitle && (
                  <FadeContent direction="up" delay={2000}>
                    <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-3xl">
                      {subtitle}
                    </p>
                  </FadeContent>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-6 py-8">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-2xl font-bold text-green-400">98%</p>
                    <p className="text-xs text-white/60 mt-1">Uptime</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-2xl font-bold text-blue-400">2.4ms</p>
                    <p className="text-xs text-white/60 mt-1">Response</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-2xl font-bold text-purple-400">4.9</p>
                    <p className="text-xs text-white/60 mt-1">Rating</p>
                  </div>
                </div>

                {/* CTA Command */}
                {showCta && ctaText && (
                  <div className="pt-6">
                    <p className="text-white/60 text-sm mb-3">
                      $ Execute next command:
                    </p>
                    <a
                      href={ctaLink}
                      className="inline-flex items-center gap-3 px-8 py-4 bg-green-500 text-black rounded-xl font-bold hover:bg-green-400 transition-all hover:scale-105 group"
                    >
                      <span>./</span>
                      {ctaText.toLowerCase().replace(/\s+/g, '-')}
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </a>
                  </div>
                )}

              </div>
            </AnimatedContent>

          </div>

          {/* Terminal Footer with Blur */}
          <div className="relative">
            <GradualBlur
              target="parent"
              position="bottom"
              height="3rem"
              strength={2}
            />
          </div>

        </motion.div>

      </div>
    </section>
  );
}
```

---

## HERO-146: Carousel Hero with LiquidChrome Background

**Layout**: Full-width carousel/slideshow style  
**Background**: LiquidChrome effect  
**Animation**: MagnetLines, ElasticSlider, Counter

```tsx
// Hero146.tsx
import { motion } from 'framer-motion';
import { useState } from 'react';
import MagnetLines from '@/components/ui/MagnetLines';
import ElasticSlider from '@/components/ui/ElasticSlider';
import LiquidChrome from '@/components/ui/LiquidChrome';
import Counter from '@/components/ui/Counter';

interface Hero146Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

export function Hero146({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: Hero146Props) {
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 3;

  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* LiquidChrome Background */}
      <div className="absolute inset-0 z-0">
        <LiquidChrome
          baseColor={[0.1, 0.1, 0.1]}
          speed={1}
          amplitude={0.6}
          interactive
        />
      </div>

      {/* MagnetLines Effect */}
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-30">
        <MagnetLines
          lineCount={15}
          lineColor="#ffffff"
          magnetStrength={100}
          lineWidth={2}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* Top Navigation Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 py-8"
        >
          <div className="flex items-center justify-between">
            
            {/* Logo & Store */}
            <div className="flex items-center gap-4">
              {logo && (
                <img 
                  src={logo} 
                  alt="Logo" 
                  className="w-12 h-12 rounded-xl ring-2 ring-white/20"
                />
              )}
              {storeName && (
                <span className="text-lg font-bold hidden md:block">
                  {storeName}
                </span>
              )}
            </div>

            {/* Slide Counter */}
            <div className="flex items-center gap-4">
              <Counter
                value={currentSlide}
                places={[1]}
                fontSize={24}
                padding={3}
                gap={5}
                textColor="white"
                fontWeight={900}
              />
              <span className="text-white/60 text-sm">/ {totalSlides}</span>
            </div>

          </div>
        </motion.div>

        {/* Main Carousel Content */}
        <div className="flex-1 flex items-center">
          <div className="container mx-auto px-4">
            
            {/* Slide Content */}
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.8 }}
              className="grid lg:grid-cols-2 gap-16 items-center"
            >
              
              {/* Left: Content */}
              <div className="space-y-8">
                
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20">
                  <span className="text-xs font-bold tracking-wider">
                    SLIDE {currentSlide}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-6xl md:text-8xl font-black leading-tight">
                  {title}
                </h1>

                {/* Subtitle */}
                {subtitle && (
                  <p className="text-xl md:text-2xl text-white/70 max-w-xl leading-relaxed">
                    {subtitle}
                  </p>
                )}

                {/* CTA */}
                {showCta && ctaText && (
                  <a
                    href={ctaLink}
                    className="inline-flex items-center gap-4 px-10 py-5 bg-white text-black rounded-full font-black text-lg hover:bg-white/90 transition-all hover:scale-105 shadow-2xl shadow-white/30 group"
                  >
                    {ctaText}
                    <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                )}

              </div>

              {/* Right: Image */}
              {backgroundImage && (
                <div className="relative h-[500px] lg:h-[700px] rounded-[3rem] overflow-hidden">
                  <img
                    src={backgroundImage}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Image Number Badge */}
                  <div className="absolute top-8 right-8 w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                    <span className="text-2xl font-black">{currentSlide}</span>
                  </div>
                </div>
              )}

            </motion.div>

          </div>
        </div>

        {/* Bottom Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="container mx-auto px-4 py-12"
        >
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Elastic Slider */}
            <ElasticSlider
              leftIcon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              }
              rightIcon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              }
              startingValue={0}
              defaultValue={currentSlide}
              maxValue={totalSlides}
              isStepped
              stepSize={1}
            />

            {/* Navigation Dots */}
            <div className="flex items-center justify-center gap-3">
              {[...Array(totalSlides)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index + 1)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentSlide === index + 1
                      ? 'w-12 bg-white'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
```

---

## DEPENDENCIES & INSTALLATION

### Required Packages

```bash
# Core
pnpm install framer-motion

# Background Effects
pnpm dlx shadcn@latest add @react-bits/GradientBlinds-TS-CSS
pnpm dlx shadcn@latest add @react-bits/LightRays-TS-CSS
pnpm dlx shadcn@latest add @react-bits/PixelSnow-TS-CSS
pnpm dlx shadcn@latest add @react-bits/GridDistortion-TS-CSS
pnpm dlx shadcn@latest add @react-bits/LiquidChrome-TS-CSS

# Special Effects
pnpm dlx shadcn@latest add @react-bits/Balatro-TS-CSS
pnpm dlx shadcn@latest add @react-bits/RippleGrid-TS-CSS
pnpm dlx shadcn@latest add @react-bits/LightPillar-TS-CSS
pnpm dlx shadcn@latest add @react-bits/PixelBlast-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Dither-TS-CSS
pnpm dlx shadcn@latest add @react-bits/GridMotion-TS-CSS
pnpm dlx shadcn@latest add @react-bits/PrismaticBurst-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Squares-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Ballpit-TS-CSS

# Content Animation
pnpm dlx shadcn@latest add @react-bits/AnimatedContent-TS-CSS
pnpm dlx shadcn@latest add @react-bits/FadeContent-TS-CSS
pnpm dlx shadcn@latest add @react-bits/GradualBlur-TS-CSS

# Interactive Components
pnpm dlx shadcn@latest add @react-bits/MagnetLines-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ElasticSlider-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Counter-TS-CSS
```

---

## SUMMARY

| Hero | Layout | Background | Key Theme | Special Feature |
|------|--------|------------|-----------|-----------------|
| **HERO-142** | Horizontal Split | GradientBlinds | Top-Bottom | Reversed order layout |
| **HERO-143** | Modular Grid | LightRays | Masonry | Bento-style blocks |
| **HERO-144** | Floating Panels | PixelSnow | Overlays | Asymmetric positioning |
| **HERO-145** | Terminal CLI | GridDistortion | Dev Theme | Command-line aesthetic |
| **HERO-146** | Carousel | LiquidChrome | Slideshow | Slider with counter |

**Features:**
- ✅ Unique layout architectures
- ✅ Advanced React Bits effects
- ✅ Dark mode enforced
- ✅ Strict props maintained
- ✅ Interactive components
- ✅ Production-ready responsive

**READY FOR NEXT BATCH!** 🚀🎨
