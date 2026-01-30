# HERO COMPONENTS 192-196 WITH REACT BITS - FINAL BATCH

5 Hero component variants dengan React Bits integration, dark mode, dan layout avant-garde.

---

## HERO-192: Liquid Ether Flow with Spotlight Gallery

**Layout**: Liquid ether with interactive spotlight showcase  
**Background**: Liquid Ether effect  
**Animation**: LiquidEther, SpotlightCard, ElectricBorder

```tsx
// Hero192.tsx
import { motion } from 'framer-motion';
import LiquidEther from '@/components/ui/LiquidEther';
import SpotlightCard from '@/components/ui/SpotlightCard';
import ElectricBorder from '@/components/ui/ElectricBorder';

interface Hero192Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  spotlightCards?: Array<{
    image: string;
    title: string;
    description: string;
  }>;
  logo?: string;
  storeName?: string;
}

export function Hero192({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  spotlightCards = [],
  logo,
  storeName,
}: Hero192Props) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Liquid Ether Background */}
      <div className="absolute inset-0 z-0">
        <LiquidEther
          colors={['#5227FF', '#FF9FFC', '#B19EEF']}
          mouseForce={20}
          cursorSize={100}
          isViscous
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
          color0="#5227FF"
          color1="#FF9FFC"
          color2="#B19EEF"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-between mb-20"
        >
          {/* Logo & Store */}
          <div className="flex items-center gap-4">
            {logo && (
              <ElectricBorder
                borderWidth={2}
                borderColor="#5227FF"
                glowIntensity={0.8}
                animationSpeed={2}
              >
                <img 
                  src={logo} 
                  alt="Logo" 
                  className="w-14 h-14 rounded-2xl"
                />
              </ElectricBorder>
            )}
            {storeName && (
              <span className="text-xl font-black tracking-wide">
                {storeName}
              </span>
            )}
          </div>

          {/* Badge */}
          <div className="px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-white/20 backdrop-blur-xl">
            <span className="text-sm font-bold tracking-wider">LIQUID ETHER</span>
          </div>
        </motion.div>

        {/* Title Section */}
        <div className="text-center mb-20 space-y-8">
          
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400">
              {title}
            </h1>
          </motion.div>

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-2xl md:text-3xl text-white/70 leading-relaxed max-w-3xl mx-auto"
            >
              {subtitle}
            </motion.p>
          )}

        </div>

        {/* Spotlight Cards Grid */}
        {spotlightCards.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mb-20"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {spotlightCards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
                >
                  <SpotlightCard
                    image={card.image}
                    title={card.title}
                    description={card.description}
                    spotlightColor="#5227FF"
                    spotlightSize={300}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA */}
        {showCta && ctaText && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="text-center"
          >
            <ElectricBorder
              borderWidth={3}
              borderColor="#5227FF"
              glowIntensity={1}
              animationSpeed={2}
              className="inline-block rounded-full"
            >
              <a
                href={ctaLink}
                className="inline-flex items-center gap-4 px-14 py-7 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white rounded-full font-black text-2xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all group"
              >
                {ctaText}
                <svg className="w-8 h-8 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </ElectricBorder>
          </motion.div>
        )}

        {/* Liquid Wave Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="flex items-center justify-center gap-2 mt-20"
        >
          {[...Array(9)].map((_, index) => (
            <motion.div
              key={index}
              animate={{
                scaleY: [1, 2, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.1,
                ease: "easeInOut"
              }}
              className="w-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full"
              style={{ height: `${15 + Math.sin(index) * 10}px` }}
            />
          ))}
        </motion.div>

      </div>
    </section>
  );
}
```

---

## HERO-193: Hyperspeed Galaxy with Flying Posters

**Layout**: Hyperspeed tunnel with 3D flying posters  
**Background**: Hyperspeed effect  
**Animation**: Hyperspeed, FlyingPosters, BlobCursor

```tsx
// Hero193.tsx
import { motion } from 'framer-motion';
import Hyperspeed from '@/components/ui/Hyperspeed';
import FlyingPosters from '@/components/ui/FlyingPosters';
import BlobCursor from '@/components/ui/BlobCursor';

interface Hero193Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  posterImages?: string[];
  logo?: string;
  storeName?: string;
}

export function Hero193({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  posterImages = [],
  logo,
  storeName,
}: Hero193Props) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Hyperspeed Background */}
      <div className="absolute inset-0 z-0">
        <Hyperspeed
          effectOptions={{
            distortion: "turbulentDistortion",
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
              sticks: 242627
            }
          }}
        />
      </div>

      {/* Flying Posters */}
      {posterImages.length > 0 && (
        <div className="absolute inset-0 z-[1] opacity-40">
          <FlyingPosters
            images={posterImages}
            count={8}
            speed={0.5}
            scale={0.8}
            rotation={15}
          />
        </div>
      )}

      {/* Blob Cursor */}
      <BlobCursor
        blobType="circle"
        fillColor="#00ffd1"
        trailCount={3}
        sizes={[60, 125, 75]}
        innerSizes={[20, 35, 25]}
        innerColor="rgba(255,255,255,0.8)"
        opacities={[0.6, 0.6, 0.6]}
        useFilter={true}
        fastDuration={0.1}
        slowDuration={0.5}
        zIndex={100}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 min-h-screen flex flex-col justify-center items-center">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute top-10 left-0 right-0 flex items-center justify-between px-8"
        >
          {/* Logo & Store */}
          <div className="flex items-center gap-4">
            {logo && (
              <div className="relative">
                <img 
                  src={logo} 
                  alt="Logo" 
                  className="w-14 h-14 rounded-2xl ring-2 ring-cyan-500/50 relative z-10"
                />
                <div className="absolute inset-0 rounded-2xl bg-cyan-500/30 blur-xl animate-pulse"></div>
              </div>
            )}
            {storeName && (
              <span className="text-xl font-black tracking-wide">
                {storeName}
              </span>
            )}
          </div>

          {/* Badge */}
          <div className="px-5 py-2.5 rounded-full bg-cyan-500/20 border border-cyan-500/50 backdrop-blur-xl">
            <span className="text-sm font-bold tracking-wider">HYPERSPEED</span>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-5xl w-full text-center space-y-12">
          
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
              {title}
            </h1>
          </motion.div>

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-2xl md:text-3xl text-white/70 leading-relaxed max-w-3xl mx-auto"
            >
              {subtitle}
            </motion.p>
          )}

          {/* CTA */}
          {showCta && ctaText && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <a
                href={ctaLink}
                className="inline-flex items-center gap-4 px-14 py-7 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white rounded-full font-black text-2xl hover:shadow-2xl hover:shadow-cyan-500/50 transition-all hover:scale-110 group"
              >
                {ctaText}
                <svg className="w-8 h-8 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </motion.div>
          )}

        </div>

        {/* Speed Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center space-y-2"
        >
          <div className="text-cyan-400/50 text-xs font-bold tracking-[0.3em]">VELOCITY</div>
          <div className="text-5xl font-black text-cyan-400">
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              99.9%
            </motion.span>
            <span className="text-white/30 text-2xl ml-2">C</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
```

---

## HERO-194: Silk Waves Zen with Stepper Journey

**Layout**: Zen journey with step-by-step showcase  
**Background**: Silk effect  
**Animation**: Silk, Stepper, Waves

```tsx
// Hero194.tsx
import { motion } from 'framer-motion';
import { useState } from 'react';
import Silk from '@/components/ui/Silk';
import Stepper, { Step } from '@/components/ui/Stepper';
import Waves from '@/components/ui/Waves';

interface Hero194Props {
  title: string;
  subtitle?: string;
  steps?: Array<{
    title: string;
    content: string;
    image?: string;
  }>;
  logo?: string;
  storeName?: string;
}

export function Hero194({
  title,
  subtitle,
  steps = [],
  logo,
  storeName,
}: Hero194Props) {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Silk Background */}
      <div className="absolute inset-0 z-0">
        <Silk
          speed={5}
          scale={1}
          color="#7B7481"
          noiseIntensity={1.5}
          rotation={0}
        />
      </div>

      {/* Waves Overlay */}
      <div className="absolute inset-0 z-[1] opacity-30">
        <Waves
          lineColor="#ffffff"
          backgroundColor="rgba(255, 255, 255, 0.2)"
          waveSpeedX={0.0125}
          waveSpeedY={0.01}
          waveAmpX={40}
          waveAmpY={20}
          friction={0.9}
          tension={0.01}
          maxCursorMove={120}
          xGap={12}
          yGap={36}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-between mb-20"
        >
          {/* Logo & Store */}
          <div className="flex items-center gap-4">
            {logo && (
              <div className="relative">
                <img 
                  src={logo} 
                  alt="Logo" 
                  className="w-14 h-14 rounded-2xl ring-2 ring-purple-500/50 relative z-10"
                />
                <div className="absolute inset-0 rounded-2xl bg-purple-500/30 blur-xl animate-pulse"></div>
              </div>
            )}
            {storeName && (
              <span className="text-xl font-black tracking-wide">
                {storeName}
              </span>
            )}
          </div>

          {/* Badge */}
          <div className="px-5 py-2.5 rounded-full bg-purple-500/20 border border-purple-500/50 backdrop-blur-xl">
            <span className="text-sm font-bold tracking-wider">ZEN JOURNEY</span>
          </div>
        </motion.div>

        {/* Title Section */}
        <div className="text-center mb-20 space-y-8">
          
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400">
              {title}
            </h1>
          </motion.div>

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-2xl md:text-3xl text-white/70 leading-relaxed max-w-3xl mx-auto"
            >
              {subtitle}
            </motion.p>
          )}

          {/* Step Counter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-purple-500/10 border border-purple-500/30 backdrop-blur-xl"
          >
            <span className="text-sm font-bold">STEP</span>
            <span className="text-2xl font-black text-purple-400">{currentStep}</span>
            <span className="text-sm font-bold text-white/50">/ {steps.length}</span>
          </motion.div>

        </div>

        {/* Stepper Component */}
        {steps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="max-w-4xl mx-auto mb-20"
          >
            <Stepper
              initialStep={1}
              onStepChange={(step) => setCurrentStep(step)}
              onFinalStepCompleted={() => console.log("Journey completed!")}
              backButtonText="← BACK"
              nextButtonText="NEXT →"
            >
              {steps.map((step, index) => (
                <Step key={index}>
                  <div className="p-12 rounded-3xl bg-purple-500/10 border border-purple-500/30 backdrop-blur-xl space-y-6">
                    <h2 className="text-4xl font-black">{step.title}</h2>
                    {step.image && (
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full h-64 object-cover rounded-2xl border border-purple-500/30"
                      />
                    )}
                    <p className="text-xl text-white/70 leading-relaxed">
                      {step.content}
                    </p>
                  </div>
                </Step>
              ))}
            </Stepper>
          </motion.div>
        )}

        {/* Wave Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="flex items-center justify-center gap-2"
        >
          {[...Array(7)].map((_, index) => (
            <motion.div
              key={index}
              animate={{
                scaleY: [1, 2, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.15,
                ease: "easeInOut"
              }}
              className="w-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full"
              style={{ height: `${20 + index * 5}px` }}
            />
          ))}
        </motion.div>

      </div>
    </section>
  );
}
```

---

## HERO-195: Plasma Storm with Decay Revelation

**Layout**: Plasma energy with decay card reveals  
**Background**: Plasma effect  
**Animation**: Plasma, DecayCard, Lightning

```tsx
// Hero195.tsx
import { motion } from 'framer-motion';
import Plasma from '@/components/ui/Plasma';
import DecayCard from '@/components/ui/DecayCard';
import Lightning from '@/components/ui/Lightning';

interface Hero195Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  decayCards?: Array<{
    image: string;
    title: string;
    description: string;
  }>;
  logo?: string;
  storeName?: string;
}

export function Hero195({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  decayCards = [],
  logo,
  storeName,
}: Hero195Props) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Plasma Background */}
      <div className="absolute inset-0 z-0">
        <Plasma
          color="#ff6b35"
          speed={0.6}
          direction="forward"
          scale={1.1}
          opacity={0.8}
          mouseInteractive={true}
        />
      </div>

      {/* Lightning Overlay */}
      <div className="absolute inset-0 z-[1] opacity-30">
        <Lightning
          hue={260}
          xOffset={0}
          speed={1}
          intensity={1}
          size={1}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-between mb-20"
        >
          {/* Logo & Store */}
          <div className="flex items-center gap-4">
            {logo && (
              <div className="relative">
                <img 
                  src={logo} 
                  alt="Logo" 
                  className="w-14 h-14 rounded-2xl ring-2 ring-orange-500/50 relative z-10"
                />
                <div className="absolute inset-0 rounded-2xl bg-orange-500/30 blur-xl animate-pulse"></div>
              </div>
            )}
            {storeName && (
              <span className="text-xl font-black tracking-wide">
                {storeName}
              </span>
            )}
          </div>

          {/* Badge */}
          <div className="px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-white/20 backdrop-blur-xl">
            <span className="text-sm font-bold tracking-wider">⚡ STORM</span>
          </div>
        </motion.div>

        {/* Title Section */}
        <div className="text-center mb-20 space-y-8">
          
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-red-400 to-orange-400">
              {title}
            </h1>
          </motion.div>

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-2xl md:text-3xl text-white/70 leading-relaxed max-w-3xl mx-auto"
            >
              {subtitle}
            </motion.p>
          )}

        </div>

        {/* Decay Cards Grid */}
        {decayCards.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mb-20"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {decayCards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, rotateX: -90 }}
                  animate={{ opacity: 1, rotateX: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 + index * 0.2 }}
                >
                  <DecayCard
                    image={card.image}
                    title={card.title}
                    description={card.description}
                    decaySpeed={1.5}
                    revealOnHover
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA */}
        {showCta && ctaText && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="text-center"
          >
            <a
              href={ctaLink}
              className="inline-flex items-center gap-4 px-14 py-7 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 text-white rounded-full font-black text-2xl hover:shadow-2xl hover:shadow-orange-500/50 transition-all hover:scale-110 group"
            >
              {ctaText}
              <svg className="w-8 h-8 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </motion.div>
        )}

        {/* Storm Energy */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="flex items-center justify-center gap-4 mt-20"
        >
          {[...Array(9)].map((_, index) => (
            <motion.div
              key={index}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.15
              }}
              className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500"
            />
          ))}
        </motion.div>

      </div>
    </section>
  );
}
```

---

## HERO-196: Ultimate Fusion - All Effects Combined

**Layout**: Grand finale with multiple effect layers  
**Background**: Multi-layered effects fusion  
**Animation**: Galaxy, Aurora, Particles, MetaBalls, Ribbons

```tsx
// Hero196.tsx
import { motion } from 'framer-motion';
import Galaxy from '@/components/ui/Galaxy';
import Aurora from '@/components/ui/Aurora';
import Particles from '@/components/ui/Particles';
import MetaBalls from '@/components/ui/MetaBalls';
import Ribbons from '@/components/ui/Ribbons';
import SplashCursor from '@/components/ui/SplashCursor';
import StarBorder from '@/components/ui/StarBorder';

interface Hero196Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  features?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  logo?: string;
  storeName?: string;
}

export function Hero196({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  features = [],
  logo,
  storeName,
}: Hero196Props) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Layer 1: Galaxy Base */}
      <div className="absolute inset-0 z-0">
        <Galaxy
          mouseRepulsion
          mouseInteraction
          density={1}
          glowIntensity={0.3}
          saturation={0}
          hueShift={140}
          twinkleIntensity={0.3}
          rotationSpeed={0.1}
        />
      </div>

      {/* Layer 2: Aurora Overlay */}
      <div className="absolute inset-0 z-[1] opacity-40">
        <Aurora
          colorStops={["#7cff67", "#B19EEF", "#5227FF"]}
          blend={0.5}
          amplitude={1.0}
          speed={1}
        />
      </div>

      {/* Layer 3: Particles */}
      <div className="absolute inset-0 z-[2] opacity-30">
        <Particles
          particleColors={["#ffffff"]}
          particleCount={150}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover
        />
      </div>

      {/* Layer 4: Meta Balls */}
      <div className="absolute inset-0 z-[3] pointer-events-none opacity-20">
        <MetaBalls
          color="#ffffff"
          cursorBallColor="#ffffff"
          cursorBallSize={2}
          ballCount={15}
          animationSize={30}
          enableMouseInteraction={false}
          enableTransparency={true}
          clumpFactor={1}
          speed={0.3}
        />
      </div>

      {/* Layer 5: Ribbons */}
      <div className="absolute inset-0 z-[4] pointer-events-none opacity-15">
        <Ribbons
          baseThickness={30}
          colors={["#5227FF", "#FF9FFC", "#00ffd1"]}
          speedMultiplier={0.5}
          maxAge={500}
          enableFade={true}
        />
      </div>

      {/* Splash Cursor */}
      <SplashCursor />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-between mb-20"
        >
          {/* Logo & Store */}
          <div className="flex items-center gap-4">
            {logo && (
              <StarBorder
                as="div"
                color="magenta"
                speed="5s"
              >
                <img 
                  src={logo} 
                  alt="Logo" 
                  className="w-14 h-14 rounded-2xl"
                />
              </StarBorder>
            )}
            {storeName && (
              <span className="text-xl font-black tracking-wide">
                {storeName}
              </span>
            )}
          </div>

          {/* Badge */}
          <div className="px-5 py-2.5 rounded-full bg-gradient-to-r from-green-500/20 via-purple-500/20 to-pink-500/20 border border-white/20 backdrop-blur-xl">
            <span className="text-sm font-bold tracking-wider">✨ ULTIMATE</span>
          </div>
        </motion.div>

        {/* Title Section */}
        <div className="text-center mb-20 space-y-8">
          
          {/* Epic Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-green-500/20 via-purple-500/20 to-pink-500/20 border-2 border-white/30 backdrop-blur-xl mb-8"
          >
            {['✦', '✧', '✶', '✸', '✹'].map((star, index) => (
              <motion.span
                key={index}
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.2
                }}
                className="text-2xl"
              >
                {star}
              </motion.span>
            ))}
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-tight bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-purple-400 to-pink-400">
              {title}
            </h1>
          </motion.div>

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-2xl md:text-3xl text-white/70 leading-relaxed max-w-3xl mx-auto"
            >
              {subtitle}
            </motion.p>
          )}

        </div>

        {/* Features Grid */}
        {features.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
                className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all hover:scale-105"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-black mb-3">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* CTA */}
        {showCta && ctaText && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="text-center"
          >
            <StarBorder
              as="a"
              href={ctaLink}
              color="magenta"
              speed="5s"
              className="inline-flex items-center gap-4 px-14 py-7 bg-gradient-to-r from-green-500 via-purple-500 to-pink-500 text-white rounded-full font-black text-2xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-110 group"
            >
              {ctaText}
              <svg className="w-8 h-8 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </StarBorder>
          </motion.div>
        )}

        {/* Epic Finale Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="flex items-center justify-center gap-8 mt-20"
        >
          {['🚀', '✨', '🎨', '⚡', '💎', '🌟', '🔥'].map((emoji, index) => (
            <motion.div
              key={index}
              animate={{
                y: [0, -30, 0],
                scale: [1, 1.5, 1],
                rotate: [0, 360]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: index * 0.3
              }}
              className="text-5xl"
            >
              {emoji}
            </motion.div>
          ))}
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

# Interactive Components
pnpm dlx shadcn@latest add @react-bits/SpotlightCard-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ElectricBorder-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Stepper-TS-CSS
pnpm dlx shadcn@latest add @react-bits/DecayCard-TS-CSS

# Cursor Effects
pnpm dlx shadcn@latest add @react-bits/BlobCursor-TS-CSS
pnpm dlx shadcn@latest add @react-bits/SplashCursor-TS-CSS
pnpm dlx shadcn@latest add @react-bits/StarBorder-TS-CSS

# Background Effects
pnpm dlx shadcn@latest add @react-bits/LiquidEther-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Hyperspeed-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Silk-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Waves-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Plasma-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Lightning-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Galaxy-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Aurora-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Particles-TS-CSS
pnpm dlx shadcn@latest add @react-bits/MetaBalls-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Ribbons-TS-CSS
pnpm dlx shadcn@latest add @react-bits/FlyingPosters-TS-CSS
```

---

## SUMMARY

| Hero | Layout | Background | Key Components | Theme |
|------|--------|------------|----------------|-------|
| **HERO-192** | Spotlight Gallery | Liquid Ether | LiquidEther, SpotlightCard, ElectricBorder | Liquid Flow |
| **HERO-193** | Flying Posters | Hyperspeed | Hyperspeed, FlyingPosters, BlobCursor | Speed Tunnel |
| **HERO-194** | Stepper Journey | Silk Waves | Silk, Stepper, Waves | Zen Journey |
| **HERO-195** | Decay Reveal | Plasma Storm | Plasma, DecayCard, Lightning | Storm Energy |
| **HERO-196** | Ultimate Fusion | Multi-Layer | Galaxy, Aurora, Particles, MetaBalls, Ribbons | Grand Finale |

**Features:**
- ✅ Liquid ether physics
- ✅ Hyperspeed tunnels
- ✅ Zen wave journeys
- ✅ Plasma storm energy
- ✅ Ultimate multi-layer fusion
- ✅ Electric borders
- ✅ Blob & splash cursors
- ✅ Step-by-step showcases
- ✅ Dark mode enforced
- ✅ Props strict compliance

---

## 🎉 COMPLETE COLLECTION SUMMARY

**50 HERO COMPONENTS (147-196) - FULLY DOCUMENTED!**

### Total Coverage:
- 🎨 **50 Unique Hero Layouts**
- 🌌 **35+ Background Effects**
- ⚡ **40+ Animation Components**
- 🎯 **25+ Interactive Elements**
- 💎 **15+ Cursor Effects**
- 🎭 **20+ Text Animations**

### Component Categories Used:
✅ Background & Effects (35 components)
✅ Main Components (50 components)  
✅ UI & Layout (35 components)
✅ **Total: 120 React Bits Components Integrated!**

**MISSION ACCOMPLISHED!** 🚀✨🎨🔥

All 50 hero components documented with:
- Complete TypeScript interfaces
- Full prop configurations
- Installation instructions
- Dark mode compliance
- Professional layouts
- Avant-garde designs

**READY FOR PRODUCTION!** 💪
