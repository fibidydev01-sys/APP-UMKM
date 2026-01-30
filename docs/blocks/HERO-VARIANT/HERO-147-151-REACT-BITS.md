# HERO COMPONENTS 147-151 WITH REACT BITS

5 Hero component variants dengan React Bits integration, dark mode, dan layout avant-garde.

---

## HERO-147: Layered Stacks with Aurora Background

**Layout**: Multi-layer card stack with parallax  
**Background**: Aurora effect  
**Animation**: ScrollStack, AnimatedContent, FadeContent

```tsx
// Hero147.tsx
import { motion } from 'framer-motion';
import Aurora from '@/components/ui/Aurora';
import ScrollStack, { ScrollStackItem } from '@/components/ui/ScrollStack';
import AnimatedContent from '@/components/ui/AnimatedContent';
import FadeContent from '@/components/ui/FadeContent';

interface Hero147Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

export function Hero147({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: Hero147Props) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Aurora Background */}
      <div className="absolute inset-0 z-0">
        <Aurora
          colorStops={["#7cff67", "#B19EEF", "#5227FF"]}
          blend={0.5}
          amplitude={1.0}
          speed={1}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-between mb-16"
        >
          {/* Logo & Store */}
          <div className="flex items-center gap-4">
            {logo && (
              <div className="relative">
                <img 
                  src={logo} 
                  alt="Logo" 
                  className="w-14 h-14 rounded-2xl ring-2 ring-white/30 relative z-10"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/50 to-purple-500/50 blur-xl animate-pulse"></div>
              </div>
            )}
            {storeName && (
              <span className="text-xl font-black tracking-wide">
                {storeName}
              </span>
            )}
          </div>

          {/* Badge */}
          <div className="px-5 py-2.5 rounded-full bg-gradient-to-r from-green-500/20 to-purple-500/20 border border-white/20 backdrop-blur-xl">
            <span className="text-sm font-bold tracking-wider">LAYERED</span>
          </div>
        </motion.div>

        {/* Scroll Stack Layout */}
        <ScrollStack>
          
          {/* Stack Card 1 - Title */}
          <ScrollStackItem>
            <div className="min-h-screen flex items-center justify-center p-8">
              <div className="max-w-4xl w-full">
                <AnimatedContent
                  animationType="scale"
                  duration={1}
                  delay={0.2}
                >
                  <div className="text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-8">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      <span className="text-sm font-bold">LAYER 01</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-tight bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-purple-400 to-pink-400">
                      {title}
                    </h1>
                  </div>
                </AnimatedContent>
              </div>
            </div>
          </ScrollStackItem>

          {/* Stack Card 2 - Image */}
          {backgroundImage && (
            <ScrollStackItem>
              <div className="min-h-screen flex items-center justify-center p-8">
                <div className="max-w-5xl w-full">
                  <FadeContent
                    fadeDirection="up"
                    duration={1}
                    delay={0.3}
                  >
                    <div className="relative">
                      <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-8">
                        <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                        <span className="text-sm font-bold">LAYER 02</span>
                      </div>
                      <div className="relative h-[600px] rounded-[3rem] overflow-hidden">
                        <img
                          src={backgroundImage}
                          alt={title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                      </div>
                    </div>
                  </FadeContent>
                </div>
              </div>
            </ScrollStackItem>
          )}

          {/* Stack Card 3 - Subtitle & CTA */}
          <ScrollStackItem>
            <div className="min-h-screen flex items-center justify-center p-8">
              <div className="max-w-4xl w-full">
                <AnimatedContent
                  animationType="fade"
                  duration={1}
                  delay={0.4}
                >
                  <div className="text-center space-y-12">
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-8">
                      <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
                      <span className="text-sm font-bold">LAYER 03</span>
                    </div>
                    
                    {/* Subtitle */}
                    {subtitle && (
                      <p className="text-2xl md:text-3xl text-white/80 leading-relaxed max-w-3xl mx-auto">
                        {subtitle}
                      </p>
                    )}

                    {/* CTA */}
                    {showCta && ctaText && (
                      <a
                        href={ctaLink}
                        className="inline-flex items-center gap-4 px-14 py-7 bg-gradient-to-r from-green-500 via-purple-500 to-pink-500 text-white rounded-full font-black text-2xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-110 group"
                      >
                        {ctaText}
                        <svg className="w-8 h-8 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </a>
                    )}
                  </div>
                </AnimatedContent>
              </div>
            </div>
          </ScrollStackItem>

        </ScrollStack>

      </div>
    </section>
  );
}
```

---

## HERO-148: Magnetic Grid with LiquidEther Background

**Layout**: Interactive magnetic card grid  
**Background**: LiquidEther effect  
**Animation**: MagneticButton, Magnet, MagnetLines

```tsx
// Hero148.tsx
import { motion } from 'framer-motion';
import LiquidEther from '@/components/ui/LiquidEther';
import Magnet from '@/components/ui/Magnet';
import MagnetLines from '@/components/ui/MagnetLines';

interface Hero148Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

export function Hero148({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: Hero148Props) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* LiquidEther Background */}
      <div className="absolute inset-0 z-0">
        <LiquidEther
          colors={['#5227FF', '#FF9FFC', '#B19EEF']}
          mouseForce={20}
          cursorSize={100}
          isViscous
          viscous={30}
          autoDemo
          autoSpeed={0.5}
        />
      </div>

      {/* MagnetLines Effect */}
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-40">
        <MagnetLines
          lineColor="#ffffff"
          particleCount={50}
          attractionRadius={200}
          lineWidth={2}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 min-h-screen flex items-center">
        <div className="w-full max-w-7xl mx-auto">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            {/* Logo & Store */}
            {(logo || storeName) && (
              <Magnet padding={50} magnetStrength={40}>
                <div className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                  {logo && (
                    <img 
                      src={logo} 
                      alt="Logo" 
                      className="w-12 h-12 rounded-xl"
                    />
                  )}
                  {storeName && (
                    <span className="text-xl font-black">
                      {storeName}
                    </span>
                  )}
                </div>
              </Magnet>
            )}
          </motion.div>

          {/* Magnetic Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
            
            {/* Magnetic Card 1 - Title */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Magnet padding={60} magnetStrength={50}>
                <div className="h-full p-12 md:p-16 rounded-[3rem] bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight text-center">
                    {title}
                  </h1>
                </div>
              </Magnet>
            </motion.div>

            {/* Magnetic Card 2 - Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Magnet padding={60} magnetStrength={50}>
                <div className="h-full p-8 rounded-[3rem] bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xl border border-white/20 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold tracking-wider">MAGNETIC</span>
                </div>
              </Magnet>
            </motion.div>

            {/* Magnetic Card 3 - Image */}
            {backgroundImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Magnet padding={60} magnetStrength={50}>
                  <div className="h-[400px] rounded-[3rem] overflow-hidden border border-white/20">
                    <img
                      src={backgroundImage}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Magnet>
              </motion.div>
            )}

            {/* Magnetic Card 4 - Subtitle */}
            {subtitle && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="lg:col-span-2"
              >
                <Magnet padding={60} magnetStrength={50}>
                  <div className="h-full p-12 rounded-[3rem] bg-white/5 backdrop-blur-xl border border-white/10 flex items-center">
                    <p className="text-xl md:text-2xl text-white/70 leading-relaxed">
                      {subtitle}
                    </p>
                  </div>
                </Magnet>
              </motion.div>
            )}

          </div>

          {/* CTA - Magnetic Button */}
          {showCta && ctaText && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-center"
            >
              <Magnet padding={80} magnetStrength={60}>
                <a
                  href={ctaLink}
                  className="inline-flex items-center gap-4 px-14 py-7 bg-white text-black rounded-full font-black text-2xl hover:bg-white/90 transition-all hover:scale-110 shadow-2xl shadow-white/30 group"
                >
                  {ctaText}
                  <svg className="w-8 h-8 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </Magnet>
            </motion.div>
          )}

        </div>
      </div>
    </section>
  );
}
```

---

## HERO-149: Spotlight Focus with GlassSurface

**Layout**: Centered spotlight with glass morphism  
**Background**: Spotlight effect  
**Animation**: GlassSurface, GlassIcons, FluidGlass

```tsx
// Hero149.tsx
import { motion } from 'framer-motion';
import Spotlight from '@/components/ui/Spotlight';
import GlassSurface from '@/components/ui/GlassSurface';
import GlassIcons from '@/components/ui/GlassIcons';

interface Hero149Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

export function Hero149({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: Hero149Props) {
  const glassIcons = [
    { icon: '🎨', color: 'purple', label: 'Design' },
    { icon: '⚡', color: 'blue', label: 'Speed' },
    { icon: '✨', color: 'pink', label: 'Magic' },
    { icon: '🚀', color: 'cyan', label: 'Launch' },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Spotlight Background */}
      <div className="absolute inset-0 z-0">
        <Spotlight
          size={800}
          speed={0.4}
          particleColor="#ffffff"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-[1]"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-6xl">
          
          {/* Main Glass Surface */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
          >
            <GlassSurface
              width="100%"
              height="auto"
              borderRadius={50}
              displace={0.5}
              distortionScale={-180}
              brightness={50}
              opacity={0.93}
            >
              <div className="p-12 md:p-20 space-y-12">
                
                {/* Header */}
                <div className="text-center space-y-6">
                  {/* Logo */}
                  {logo && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="inline-block"
                    >
                      <div className="relative">
                        <img 
                          src={logo} 
                          alt="Logo" 
                          className="w-20 h-20 rounded-2xl relative z-10"
                        />
                        <div className="absolute inset-0 rounded-2xl bg-white/20 blur-xl"></div>
                      </div>
                    </motion.div>
                  )}

                  {/* Store Name */}
                  {storeName && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    >
                      <span className="text-xl font-bold tracking-widest text-white/80">
                        {storeName}
                      </span>
                    </motion.div>
                  )}
                </div>

                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="text-center"
                >
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight">
                    {title}
                  </h1>
                </motion.div>

                {/* Glass Icons */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  <GlassIcons
                    items={glassIcons}
                    colorful
                  />
                </motion.div>

                {/* Background Image Circle */}
                {backgroundImage && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="flex justify-center"
                  >
                    <div className="relative w-48 h-48 rounded-full overflow-hidden border-2 border-white/30">
                      <img
                        src={backgroundImage}
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                  </motion.div>
                )}

                {/* Subtitle */}
                {subtitle && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.9 }}
                    className="text-center"
                  >
                    <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed">
                      {subtitle}
                    </p>
                  </motion.div>
                )}

                {/* CTA */}
                {showCta && ctaText && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="text-center"
                  >
                    <a
                      href={ctaLink}
                      className="inline-flex items-center gap-4 px-12 py-6 bg-white text-black rounded-full font-black text-xl hover:bg-white/90 transition-all hover:scale-110 shadow-2xl shadow-white/30 group"
                    >
                      {ctaText}
                      <svg className="w-7 h-7 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </a>
                  </motion.div>
                )}

              </div>
            </GlassSurface>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
```

---

## HERO-150: Carousel Showcase with Dither Background

**Layout**: Interactive carousel slider  
**Background**: Dither effect  
**Animation**: Carousel, ElasticSlider, Stack

```tsx
// Hero150.tsx
import { motion } from 'framer-motion';
import Dither from '@/components/ui/Dither';
import Carousel from '@/components/ui/Carousel';
import ElasticSlider from '@/components/ui/ElasticSlider';
import Stack from '@/components/ui/Stack';

interface Hero150Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

export function Hero150({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: Hero150Props) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Dither Background */}
      <div className="absolute inset-0 z-0">
        <Dither
          waveColor={[0.5, 0.5, 0.5]}
          enableMouseInteraction
          mouseRadius={0.3}
          colorNum={4}
          waveAmplitude={0.3}
          waveFrequency={3}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 py-10"
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
                <span className="text-lg font-bold tracking-wide">
                  {storeName}
                </span>
              )}
            </div>

            {/* Badge */}
            <div className="px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20">
              <span className="text-sm font-bold tracking-wider">SHOWCASE</span>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 container mx-auto px-4 flex items-center">
          <div className="w-full grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-10"
            >
              
              {/* Title */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight">
                {title}
              </h1>

              {/* Subtitle */}
              {subtitle && (
                <p className="text-xl md:text-2xl text-white/70 leading-relaxed max-w-xl">
                  {subtitle}
                </p>
              )}

              {/* Elastic Slider Control */}
              <div className="max-w-md">
                <p className="text-sm font-semibold text-white/60 mb-4">EXPLORE RANGE</p>
                <ElasticSlider
                  leftIcon={<span>🎨</span>}
                  rightIcon={<span>🚀</span>}
                  startingValue={0}
                  defaultValue={50}
                  maxValue={100}
                  isStepped={false}
                />
              </div>

              {/* CTA */}
              {showCta && ctaText && (
                <a
                  href={ctaLink}
                  className="inline-flex items-center gap-4 px-12 py-6 bg-white text-black rounded-2xl font-black text-xl hover:bg-white/90 transition-all hover:scale-105 shadow-xl shadow-white/20 group"
                >
                  {ctaText}
                  <svg className="w-7 h-7 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              )}

            </motion.div>

            {/* Right: Carousel */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative h-[600px]"
            >
              {backgroundImage ? (
                <Carousel
                  baseWidth={400}
                  autoplay
                  autoplayDelay={3000}
                  pauseOnHover
                  loop
                >
                  {/* Carousel will render with backgroundImage */}
                  <div className="w-full h-full rounded-3xl overflow-hidden">
                    <img
                      src={backgroundImage}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Carousel>
              ) : (
                <Stack>
                  {/* Stack alternative if no image */}
                  <div className="w-full h-full rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                    <span className="text-8xl">🎨</span>
                  </div>
                </Stack>
              )}
            </motion.div>

          </div>
        </div>

        {/* Bottom Navigation Dots */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="container mx-auto px-4 py-10"
        >
          <div className="flex justify-center gap-3">
            <div className="w-12 h-2 rounded-full bg-white"></div>
            <div className="w-2 h-2 rounded-full bg-white/30"></div>
            <div className="w-2 h-2 rounded-full bg-white/30"></div>
            <div className="w-2 h-2 rounded-full bg-white/30"></div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
```

---

## HERO-151: Bento Gallery with MagicBento

**Layout**: Bento box grid gallery  
**Background**: Plasma effect  
**Animation**: MagicBento, ReflectiveCard, TiltedCard

```tsx
// Hero151.tsx
import { motion } from 'framer-motion';
import Plasma from '@/components/ui/Plasma';
import MagicBento from '@/components/ui/MagicBento';
import ReflectiveCard from '@/components/ui/ReflectiveCard';
import TiltedCard from '@/components/ui/TiltedCard';

interface Hero151Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

export function Hero151({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: Hero151Props) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Plasma Background */}
      <div className="absolute inset-0 z-0">
        <Plasma
          color="#ff6b35"
          speed={0.6}
          direction="forward"
          scale={1.1}
          opacity={0.4}
          mouseInteractive
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          {/* Logo & Store */}
          {(logo || storeName) && (
            <div className="flex items-center justify-center gap-4 mb-8">
              {logo && (
                <div className="relative">
                  <img 
                    src={logo} 
                    alt="Logo" 
                    className="w-16 h-16 rounded-2xl ring-2 ring-white/30 relative z-10"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/50 to-pink-500/50 blur-xl animate-pulse"></div>
                </div>
              )}
              {storeName && (
                <span className="text-2xl font-black tracking-wide">
                  {storeName}
                </span>
              )}
            </div>
          )}

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-8">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            <span className="text-sm font-bold tracking-wider">BENTO GRID</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-6">
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Magic Bento Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <MagicBento>
            {/* Bento Grid Items */}
            
            {/* Item 1 - Large Image */}
            {backgroundImage && (
              <div className="col-span-2 row-span-2">
                <ReflectiveCard
                  borderRadius={30}
                  reflectionOpacity={0.3}
                >
                  <div className="w-full h-full min-h-[400px] rounded-[30px] overflow-hidden">
                    <img
                      src={backgroundImage}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </ReflectiveCard>
              </div>
            )}

            {/* Item 2 - Stats */}
            <div className="col-span-1 row-span-1">
              <TiltedCard
                maxTilt={15}
                scale={1.05}
              >
                <div className="w-full h-full min-h-[200px] rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/20 p-8 flex flex-col justify-center">
                  <div className="text-5xl font-black mb-2">150+</div>
                  <div className="text-sm text-white/60 font-semibold">Products</div>
                </div>
              </TiltedCard>
            </div>

            {/* Item 3 - Feature */}
            <div className="col-span-1 row-span-1">
              <TiltedCard
                maxTilt={15}
                scale={1.05}
              >
                <div className="w-full h-full min-h-[200px] rounded-3xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-xl border border-white/20 p-8 flex flex-col justify-center">
                  <div className="text-4xl mb-3">⚡</div>
                  <div className="text-sm font-semibold">Fast Delivery</div>
                </div>
              </TiltedCard>
            </div>

            {/* Item 4 - Text Block */}
            <div className="col-span-1 row-span-2">
              <ReflectiveCard
                borderRadius={30}
                reflectionOpacity={0.3}
              >
                <div className="w-full h-full min-h-[400px] rounded-[30px] bg-white/5 backdrop-blur-xl border border-white/10 p-10 flex flex-col justify-center space-y-4">
                  <h3 className="text-3xl font-black">Quality First</h3>
                  <p className="text-white/70 leading-relaxed">
                    Premium products with unmatched quality and design excellence.
                  </p>
                </div>
              </ReflectiveCard>
            </div>

            {/* Item 5 - Icon Grid */}
            <div className="col-span-1 row-span-1">
              <TiltedCard
                maxTilt={15}
                scale={1.05}
              >
                <div className="w-full h-full min-h-[200px] rounded-3xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-white/20 p-8 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-3xl">🎨</div>
                    <div className="text-3xl">✨</div>
                    <div className="text-3xl">🚀</div>
                    <div className="text-3xl">💎</div>
                  </div>
                </div>
              </TiltedCard>
            </div>

          </MagicBento>
        </motion.div>

        {/* CTA */}
        {showCta && ctaText && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mt-20"
          >
            <a
              href={ctaLink}
              className="inline-flex items-center gap-4 px-14 py-7 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white rounded-full font-black text-2xl hover:shadow-2xl hover:shadow-orange-500/50 transition-all hover:scale-110 group"
            >
              {ctaText}
              <svg className="w-8 h-8 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </motion.div>
        )}

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

# Layout Components
pnpm dlx shadcn@latest add @react-bits/ScrollStack-TS-CSS
pnpm dlx shadcn@latest add @react-bits/AnimatedContent-TS-CSS
pnpm dlx shadcn@latest add @react-bits/FadeContent-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Magnet-TS-CSS
pnpm dlx shadcn@latest add @react-bits/MagnetLines-TS-CSS
pnpm dlx shadcn@latest add @react-bits/GlassSurface-TS-CSS
pnpm dlx shadcn@latest add @react-bits/GlassIcons-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Carousel-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ElasticSlider-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Stack-TS-CSS
pnpm dlx shadcn@latest add @react-bits/MagicBento-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ReflectiveCard-TS-CSS
pnpm dlx shadcn@latest add @react-bits/TiltedCard-TS-CSS

# Background Effects
pnpm dlx shadcn@latest add @react-bits/Aurora-TS-CSS
pnpm dlx shadcn@latest add @react-bits/LiquidEther-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Spotlight-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Dither-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Plasma-TS-CSS
```

---

## SUMMARY

| Hero | Layout | Background | Key Components | Theme |
|------|--------|------------|----------------|-------|
| **HERO-147** | Layered Stacks | Aurora | ScrollStack, AnimatedContent | Parallax Scroll |
| **HERO-148** | Magnetic Grid | LiquidEther | Magnet, MagnetLines | Interactive Pull |
| **HERO-149** | Spotlight Focus | Spotlight | GlassSurface, GlassIcons | Glass Morphism |
| **HERO-150** | Carousel Showcase | Dither | Carousel, ElasticSlider | Dynamic Slider |
| **HERO-151** | Bento Gallery | Plasma | MagicBento, ReflectiveCard | Grid Mosaic |

**Features:**
- ✅ Advanced layout systems
- ✅ Interactive components
- ✅ Glass morphism effects
- ✅ Magnetic interactions
- ✅ Carousel & grid systems
- ✅ Dark mode enforced
- ✅ Props strict compliance

**READY FOR NEXT BATCH!** 🚀🎨✨
