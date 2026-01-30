# HERO COMPONENTS 137-141 WITH REACT BITS

5 Hero component variants dengan React Bits integration, dark mode, dan layout eksperimental.

---

## HERO-137: Split Diagonal with ColorBends Background

**Layout**: Diagonal split dengan asymmetric content  
**Background**: ColorBends effect  
**Animation**: ScrollFloat, MetallicPaint, Crosshair

```tsx
// Hero137.tsx
import { motion } from 'framer-motion';
import ScrollFloat from '@/components/ui/ScrollFloat';
import MetallicPaint from '@/components/ui/MetallicPaint';
import ColorBends from '@/components/ui/ColorBends';
import Crosshair from '@/components/ui/Crosshair';
import { useRef } from 'react';

interface Hero137Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

export function Hero137({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: Hero137Props) {
  const containerRef = useRef(null);

  return (
    <section ref={containerRef} className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* ColorBends Background */}
      <div className="absolute inset-0 z-0">
        <ColorBends
          colors={["#ff5c7a", "#8a5cff", "#00ffd1"]}
          rotation={0}
          speed={0.2}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1}
          transparent
        />
      </div>

      {/* Crosshair Cursor */}
      <Crosshair
        containerRef={containerRef}
        color="#ffffff"
        targeted
      />

      {/* Diagonal Split Container */}
      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 h-screen flex items-center">
          <div className="w-full grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="space-y-10 lg:transform lg:translate-y-[-80px]"
            >
              
              {/* Logo & Store Name */}
              {(logo || storeName) && (
                <div className="flex items-center gap-4">
                  {logo && (
                    <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-white/20 shadow-xl">
                      <MetallicPaint
                        imageSrc={logo}
                        brightness={2}
                        contrast={0.5}
                        speed={0.3}
                      />
                    </div>
                  )}
                  {storeName && (
                    <span className="text-xl font-black tracking-wide">
                      {storeName}
                    </span>
                  )}
                </div>
              )}

              {/* Badge */}
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500/20 to-cyan-500/20 border border-white/20 backdrop-blur-xl">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-bold tracking-wider">TRENDING NOW</span>
              </div>

              {/* Title with ScrollFloat */}
              <ScrollFloat
                animationDuration={1}
                ease="back.inOut(2)"
                scrollStart="center bottom+=50%"
                scrollEnd="bottom bottom-=40%"
              >
                <h1 className="text-6xl md:text-8xl font-black leading-tight">
                  {title}
                </h1>
              </ScrollFloat>

              {/* Subtitle */}
              {subtitle && (
                <p className="text-xl md:text-2xl text-white/70 max-w-xl leading-relaxed">
                  {subtitle}
                </p>
              )}

              {/* CTA Button */}
              {showCta && ctaText && (
                <a
                  href={ctaLink}
                  className="inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-pink-500 to-cyan-500 text-white rounded-full font-black text-xl hover:shadow-2xl hover:shadow-pink-500/50 transition-all hover:scale-105 group"
                >
                  {ctaText}
                  <svg className="w-7 h-7 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              )}

            </motion.div>

            {/* Right: Image */}
            <motion.div
              initial={{ opacity: 0, x: 100, rotate: 5 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative lg:transform lg:translate-y-[80px]"
            >
              {backgroundImage && (
                <div className="relative">
                  {/* Main Image */}
                  <div className="relative h-[600px] rounded-[3rem] overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-700">
                    <img
                      src={backgroundImage}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-transparent to-cyan-500/20 mix-blend-overlay" />
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br from-pink-500/30 to-transparent blur-3xl" />
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-gradient-to-tr from-cyan-500/30 to-transparent blur-3xl" />
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

---

## HERO-138: Isometric Layout with Prism Background

**Layout**: Isometric 3D perspective  
**Background**: Prism effect  
**Animation**: PixelTransition, Noise, ShapeBlur

```tsx
// Hero138.tsx
import { motion } from 'framer-motion';
import PixelTransition from '@/components/ui/PixelTransition';
import Noise from '@/components/ui/Noise';
import Prism from '@/components/ui/Prism';
import ShapeBlur from '@/components/ui/ShapeBlur';

interface Hero138Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

export function Hero138({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: Hero138Props) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Prism Background */}
      <div className="absolute inset-0 z-0">
        <Prism
          rotationSpeed={0.5}
          baseHue={260}
          size={1}
          intensity={1}
        />
      </div>

      {/* ShapeBlur Overlay */}
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-20">
        <ShapeBlur
          variation={0}
          shapeSize={1}
          roundness={0.5}
          borderSize={0.05}
        />
      </div>

      {/* Noise Texture */}
      <div className="absolute inset-0 z-[2] pointer-events-none opacity-10">
        <Noise
          patternSize={250}
          patternScaleX={2}
          patternScaleY={2}
          patternRefreshInterval={2}
          patternAlpha={15}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 min-h-screen flex items-center">
        <div className="w-full max-w-7xl mx-auto">
          
          {/* Top Bar */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
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

            {/* Menu Items */}
            <div className="hidden md:flex gap-8 text-sm font-semibold text-white/60">
              <span className="hover:text-white transition-colors cursor-pointer">Shop</span>
              <span className="hover:text-white transition-colors cursor-pointer">About</span>
              <span className="hover:text-white transition-colors cursor-pointer">Contact</span>
            </div>
          </motion.div>

          {/* Main Content - Isometric Grid */}
          <div className="relative perspective-1000">
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Card 1 - Title */}
              <motion.div
                initial={{ opacity: 0, y: 100, rotateX: 45 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="lg:col-span-2 p-10 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 transform-gpu hover:scale-105 transition-transform"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <PixelTransition
                  text={title}
                  duration={2}
                  pixelSize={4}
                  className="text-5xl md:text-7xl font-black leading-tight"
                />
              </motion.div>

              {/* Card 2 - Image */}
              {backgroundImage && (
                <motion.div
                  initial={{ opacity: 0, y: 100, rotateX: 45 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="h-[400px] rounded-3xl overflow-hidden transform-gpu hover:scale-105 transition-transform"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <img
                    src={backgroundImage}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </motion.div>
              )}

              {/* Card 3 - Subtitle */}
              {subtitle && (
                <motion.div
                  initial={{ opacity: 0, y: 100, rotateX: 45 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="p-10 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center transform-gpu hover:scale-105 transition-transform"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <p className="text-lg text-white/70 leading-relaxed">
                    {subtitle}
                  </p>
                </motion.div>
              )}

              {/* Card 4 - CTA */}
              {showCta && ctaText && (
                <motion.div
                  initial={{ opacity: 0, y: 100, rotateX: 45 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="lg:col-span-2 p-10 rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/20 flex items-center justify-center transform-gpu hover:scale-105 transition-transform"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <a
                    href={ctaLink}
                    className="inline-flex items-center gap-4 px-12 py-6 bg-white text-black rounded-full font-black text-xl hover:bg-white/90 transition-all group"
                  >
                    {ctaText}
                    <svg className="w-7 h-7 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
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

---

## HERO-139: Stacked Cards with Hyperspeed Background

**Layout**: Vertical stacked scrolling cards  
**Background**: Hyperspeed effect  
**Animation**: ImageTrail, SplashCursor, Cubes

```tsx
// Hero139.tsx
import { motion } from 'framer-motion';
import ImageTrail from '@/components/ui/ImageTrail';
import SplashCursor from '@/components/ui/SplashCursor';
import Hyperspeed from '@/components/ui/Hyperspeed';
import Cubes from '@/components/ui/Cubes';

interface Hero139Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

export function Hero139({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: Hero139Props) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Hyperspeed Background */}
      <div className="absolute inset-0 z-0 opacity-60">
        <Hyperspeed
          effectOptions={{
            distortion: "turbulentDistortion",
            length: 400,
            roadWidth: 10,
            speedUp: 2,
            fov: 90,
          }}
        />
      </div>

      {/* Cubes 3D Effect */}
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-20">
        <Cubes
          gridSize={8}
          maxAngle={45}
          radius={3}
          borderStyle="2px solid #ffffff"
          faceColor="#1a1a2e"
          autoAnimate
        />
      </div>

      {/* Splash Cursor */}
      <SplashCursor />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 min-h-screen">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-between mb-16"
        >
          {/* Logo & Store */}
          <div className="flex items-center gap-4">
            {logo && (
              <img 
                src={logo} 
                alt="Logo" 
                className="w-14 h-14 rounded-2xl ring-2 ring-white/30 shadow-2xl"
              />
            )}
            {storeName && (
              <span className="text-xl font-black">
                {storeName}
              </span>
            )}
          </div>

          {/* Badge */}
          <div className="px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20">
            <span className="text-sm font-bold tracking-wider">VELOCITY</span>
          </div>
        </motion.div>

        {/* Stacked Cards */}
        <div className="max-w-6xl mx-auto space-y-20">
          
          {/* Card 1 - Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="p-12 md:p-20 rounded-[3rem] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 shadow-2xl">
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-none text-center">
                {title}
              </h1>
            </div>
          </motion.div>

          {/* Card 2 - Image with Trail Effect */}
          {backgroundImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative h-[500px]"
            >
              <ImageTrail
                items={[
                  backgroundImage,
                  backgroundImage,
                  backgroundImage,
                  backgroundImage,
                  backgroundImage,
                ]}
                variant="1"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-full max-w-4xl rounded-[3rem] overflow-hidden border-2 border-white/20 shadow-2xl">
                  <img
                    src={backgroundImage}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Card 3 - Subtitle & CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="relative"
          >
            <div className="p-12 md:p-16 rounded-[3rem] bg-gradient-to-br from-white/5 to-transparent backdrop-blur-2xl border border-white/10 text-center space-y-8">
              
              {/* Subtitle */}
              {subtitle && (
                <p className="text-2xl md:text-3xl text-white/70 max-w-3xl mx-auto leading-relaxed">
                  {subtitle}
                </p>
              )}

              {/* CTA */}
              {showCta && ctaText && (
                <a
                  href={ctaLink}
                  className="inline-flex items-center gap-4 px-14 py-7 bg-white text-black rounded-full font-black text-2xl hover:bg-white/90 transition-all hover:scale-110 shadow-2xl shadow-white/30 group"
                >
                  {ctaText}
                  <svg className="w-8 h-8 group-hover:translate-x-3 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              )}

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
```

---

## HERO-140: Cinema Wide with DarkVeil Background

**Layout**: Ultra-wide cinematic 21:9 style  
**Background**: DarkVeil effect  
**Animation**: LetterGlitch, FaultyTerminal, Waves

```tsx
// Hero140.tsx
import { motion } from 'framer-motion';
import LetterGlitch from '@/components/ui/LetterGlitch';
import FaultyTerminal from '@/components/ui/FaultyTerminal';
import DarkVeil from '@/components/ui/DarkVeil';
import Waves from '@/components/ui/Waves';

interface Hero140Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

export function Hero140({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: Hero140Props) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* DarkVeil Background */}
      <div className="absolute inset-0 z-0">
        <DarkVeil
          hueShift={0}
          noiseIntensity={0}
          scanlineIntensity={0}
          speed={0.5}
        />
      </div>

      {/* FaultyTerminal Overlay */}
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-30">
        <FaultyTerminal
          scale={1.5}
          timeScale={0.5}
          scanlineIntensity={0.5}
          glitchAmount={1}
          tint="#A7EF9E"
          mouseReact
        />
      </div>

      {/* Waves Bottom Effect */}
      <div className="absolute bottom-0 left-0 right-0 z-[2] h-[200px] pointer-events-none">
        <Waves
          lineColor="#ffffff"
          backgroundColor="transparent"
          waveSpeedX={0.0125}
          waveSpeedY={0.01}
        />
      </div>

      {/* Letter Glitch Background */}
      <div className="absolute inset-0 z-[3] pointer-events-none opacity-20">
        <LetterGlitch
          glitchSpeed={50}
          centerVignette
          smooth
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 min-h-screen flex items-center">
        <div className="w-full">
          
          {/* Cinematic Frame */}
          <div className="relative max-w-[1600px] mx-auto">
            
            {/* Top Bar */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center justify-between mb-8 pb-4 border-b border-white/10"
            >
              {/* Logo & Store */}
              <div className="flex items-center gap-4">
                {logo && (
                  <img 
                    src={logo} 
                    alt="Logo" 
                    className="w-10 h-10 rounded-lg ring-1 ring-white/20"
                  />
                )}
                {storeName && (
                  <span className="text-sm font-bold tracking-widest">
                    {storeName}
                  </span>
                )}
              </div>

              {/* Timestamp */}
              <div className="text-xs font-mono text-white/60">
                00:00:00:00
              </div>
            </motion.div>

            {/* Main Cinema Frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="relative aspect-[21/9] rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl"
            >
              {/* Background Image */}
              {backgroundImage && (
                <img
                  src={backgroundImage}
                  alt={title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />

              {/* Content Overlay */}
              <div className="absolute inset-0 flex items-center">
                <div className="w-full max-w-3xl px-12 md:px-20 space-y-8">
                  
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/50">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-xs font-bold tracking-wider">LIVE</span>
                  </div>

                  {/* Title */}
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight">
                    {title}
                  </h1>

                  {/* Subtitle */}
                  {subtitle && (
                    <p className="text-xl md:text-2xl text-white/80 max-w-2xl leading-relaxed">
                      {subtitle}
                    </p>
                  )}

                  {/* CTA */}
                  {showCta && ctaText && (
                    <a
                      href={ctaLink}
                      className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black rounded-2xl font-bold text-lg hover:bg-white/90 transition-all hover:scale-105 group"
                    >
                      {ctaText}
                      <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  )}

                </div>
              </div>
            </motion.div>

            {/* Bottom Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex items-center gap-4 mt-8 pt-4 border-t border-white/10"
            >
              <div className="flex-1 h-1 rounded-full bg-white/10">
                <div className="w-1/3 h-full rounded-full bg-white"></div>
              </div>
              <span className="text-xs font-mono text-white/60">
                33% LOADED
              </span>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
```

---

## HERO-141: Portal Layout with Silk Background

**Layout**: Centered portal/window effect  
**Background**: Silk effect  
**Animation**: Threads, FloatingLines, GridScan

```tsx
// Hero141.tsx
import { motion } from 'framer-motion';
import Threads from '@/components/ui/Threads';
import FloatingLines from '@/components/ui/FloatingLines';
import Silk from '@/components/ui/Silk';
import GridScan from '@/components/ui/GridScan';

interface Hero141Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

export function Hero141({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: Hero141Props) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Silk Background */}
      <div className="absolute inset-0 z-0">
        <Silk
          speed={5}
          scale={1}
          color="#7B7481"
          noiseIntensity={1.5}
        />
      </div>

      {/* Threads Effect */}
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-40">
        <Threads
          amplitude={1}
          distance={0}
          enableMouseInteraction
        />
      </div>

      {/* Floating Lines */}
      <div className="absolute inset-0 z-[2] pointer-events-none opacity-30">
        <FloatingLines
          enabledWaves={["top", "middle", "bottom"]}
          lineCount={5}
          lineDistance={5}
          bendRadius={5}
          interactive
          parallax
        />
      </div>

      {/* GridScan Overlay */}
      <div className="absolute inset-0 z-[3] pointer-events-none opacity-20">
        <GridScan
          lineColor="#ffffff"
          gridGap={50}
          scanSpeed={2}
          lineWidth={2}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 min-h-screen flex flex-col items-center justify-center">
        
        {/* Top Logo Bar */}
        {(logo || storeName) && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute top-10 left-0 right-0 flex justify-center"
          >
            <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
              {logo && (
                <img 
                  src={logo} 
                  alt="Logo" 
                  className="w-8 h-8 rounded-lg"
                />
              )}
              {storeName && (
                <span className="text-sm font-bold tracking-wide">
                  {storeName}
                </span>
              )}
            </div>
          </motion.div>
        )}

        {/* Portal/Window Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="relative max-w-5xl w-full"
        >
          
          {/* Outer Glow */}
          <div className="absolute inset-0 rounded-[4rem] bg-gradient-to-br from-purple-500/30 via-pink-500/30 to-cyan-500/30 blur-3xl opacity-50"></div>

          {/* Main Portal */}
          <div className="relative rounded-[4rem] overflow-hidden border-4 border-white/20 shadow-2xl backdrop-blur-xl">
            
            {/* Background Image in Portal */}
            {backgroundImage && (
              <div className="absolute inset-0">
                <img
                  src={backgroundImage}
                  alt={title}
                  className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/90"></div>
              </div>
            )}

            {/* Content */}
            <div className="relative p-12 md:p-20 min-h-[600px] flex flex-col items-center justify-center text-center space-y-10">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                <span className="text-sm font-bold tracking-wider">PORTAL OPEN</span>
              </div>

              {/* Title */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight max-w-4xl">
                {title}
              </h1>

              {/* Subtitle */}
              {subtitle && (
                <p className="text-xl md:text-2xl text-white/70 max-w-2xl leading-relaxed">
                  {subtitle}
                </p>
              )}

              {/* CTA */}
              {showCta && ctaText && (
                <a
                  href={ctaLink}
                  className="inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white rounded-full font-black text-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-110 group"
                >
                  {ctaText}
                  <svg className="w-7 h-7 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              )}

              {/* Bottom Indicators */}
              <div className="flex gap-2 pt-8">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-white/50 animate-pulse delay-100"></div>
                <div className="w-2 h-2 rounded-full bg-white/30 animate-pulse delay-200"></div>
              </div>

            </div>

          </div>

          {/* Corner Decorations */}
          <div className="absolute -top-6 -left-6 w-12 h-12 border-t-4 border-l-4 border-white/30 rounded-tl-3xl"></div>
          <div className="absolute -top-6 -right-6 w-12 h-12 border-t-4 border-r-4 border-white/30 rounded-tr-3xl"></div>
          <div className="absolute -bottom-6 -left-6 w-12 h-12 border-b-4 border-l-4 border-white/30 rounded-bl-3xl"></div>
          <div className="absolute -bottom-6 -right-6 w-12 h-12 border-b-4 border-r-4 border-white/30 rounded-br-3xl"></div>

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

# Text & Animation
pnpm dlx shadcn@latest add @react-bits/ScrollFloat-TS-CSS
pnpm dlx shadcn@latest add @react-bits/PixelTransition-TS-CSS

# Background Effects
pnpm dlx shadcn@latest add @react-bits/ColorBends-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Prism-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Hyperspeed-TS-CSS
pnpm dlx shadcn@latest add @react-bits/DarkVeil-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Silk-TS-CSS

# 3D & Special Effects
pnpm dlx shadcn@latest add @react-bits/MetallicPaint-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Noise-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ShapeBlur-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Cubes-TS-CSS

# Interactive Effects
pnpm dlx shadcn@latest add @react-bits/Crosshair-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ImageTrail-TS-CSS
pnpm dlx shadcn@latest add @react-bits/SplashCursor-TS-CSS
pnpm dlx shadcn@latest add @react-bits/LetterGlitch-TS-CSS
pnpm dlx shadcn@latest add @react-bits/FaultyTerminal-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Waves-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Threads-TS-CSS
pnpm dlx shadcn@latest add @react-bits/FloatingLines-TS-CSS
pnpm dlx shadcn@latest add @react-bits/GridScan-TS-CSS
```

---

## SUMMARY

| Hero | Layout | Background | Key Theme | Unique Feature |
|------|--------|------------|-----------|----------------|
| **HERO-137** | Diagonal Split | ColorBends | Gradient Flow | Asymmetric rotation |
| **HERO-138** | Isometric 3D | Prism | Retro-Future | 3D perspective cards |
| **HERO-139** | Stacked Vertical | Hyperspeed | Speed Motion | Velocity aesthetic |
| **HERO-140** | Cinema 21:9 | DarkVeil | Film Noir | Cinematic letterbox |
| **HERO-141** | Portal Window | Silk | Dimensional | Window frame effect |

**Features:**
- ✅ Experimental layouts
- ✅ Advanced React Bits effects
- ✅ Dark mode enforced
- ✅ Strict props maintained
- ✅ Cinematic animations
- ✅ 3D transform effects

**READY FOR NEXT BATCH!** 🚀🎬
