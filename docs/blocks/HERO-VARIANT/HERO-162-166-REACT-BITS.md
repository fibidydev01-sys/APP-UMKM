# HERO COMPONENTS 162-166 WITH REACT BITS

5 Hero component variants dengan React Bits integration, dark mode, dan layout avant-garde.

---

## HERO-162: Balatro Casino with Card Swap

**Layout**: Interactive card swap game-style layout  
**Background**: Balatro effect  
**Animation**: CardSwap, PixelTransition, GlareHover

```tsx
// Hero162.tsx
import { motion } from 'framer-motion';
import Balatro from '@/components/ui/Balatro';
import CardSwap from '@/components/ui/CardSwap';
import PixelTransition from '@/components/ui/PixelTransition';
import GlareHover from '@/components/ui/GlareHover';

interface Hero162Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  cards?: Array<{
    front: string;
    back: string;
    title: string;
  }>;
  logo?: string;
  storeName?: string;
}

export function Hero162({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  cards = [],
  logo,
  storeName,
}: Hero162Props) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Balatro Background */}
      <div className="absolute inset-0 z-0">
        <Balatro
          isRotate={false}
          mouseInteraction
          pixelFilter={745}
          color1="#DE443B"
          color2="#006BB4"
          color3="#162325"
        />
      </div>

      {/* Pixel Transition Overlay */}
      <PixelTransition
        pixelSize={8}
        duration={2}
        trigger="scroll"
        direction="diagonal"
      />

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
              <GlareHover
                glareColor="#DE443B"
                glareIntensity={0.8}
                rotationIntensity={10}
              >
                <img 
                  src={logo} 
                  alt="Logo" 
                  className="w-14 h-14 rounded-2xl ring-2 ring-red-500/50"
                />
              </GlareHover>
            )}
            {storeName && (
              <span className="text-xl font-black tracking-wide font-mono">
                {storeName}
              </span>
            )}
          </div>

          {/* Badge */}
          <div className="px-5 py-2.5 rounded-full bg-gradient-to-r from-red-500/20 to-blue-500/20 border border-white/20 backdrop-blur-xl font-mono">
            <span className="text-sm font-bold tracking-wider">♠ CASINO ♣</span>
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
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-tight bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-blue-500 to-red-500 font-mono">
              {title}
            </h1>
          </motion.div>

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-2xl md:text-3xl text-white/70 leading-relaxed max-w-3xl mx-auto font-mono"
            >
              {subtitle}
            </motion.p>
          )}

        </div>

        {/* Card Swap Grid */}
        {cards.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mb-20"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {cards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, rotateY: 90 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
                >
                  <CardSwap
                    frontContent={
                      <div className="w-full h-[400px] rounded-3xl bg-gradient-to-br from-red-900 to-blue-900 p-8 flex flex-col justify-between border-4 border-white/20">
                        <div className="text-6xl">♠</div>
                        <div className="text-center">
                          <h3 className="text-3xl font-black mb-2">{card.title}</h3>
                        </div>
                        <div className="text-6xl text-right">♣</div>
                      </div>
                    }
                    backContent={
                      <div className="w-full h-[400px] rounded-3xl overflow-hidden border-4 border-white/20">
                        <img
                          src={card.back}
                          alt={card.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    }
                    flipOnHover
                    flipDuration={0.6}
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
            <GlareHover
              glareColor="#DE443B"
              glareIntensity={1}
              rotationIntensity={5}
            >
              <a
                href={ctaLink}
                className="inline-flex items-center gap-4 px-14 py-7 bg-gradient-to-r from-red-600 via-blue-600 to-red-600 text-white rounded-2xl font-black text-2xl hover:shadow-2xl hover:shadow-red-500/50 transition-all hover:scale-105 group border-4 border-white/20 font-mono"
              >
                <span>♠</span>
                {ctaText}
                <span>♣</span>
                <svg className="w-8 h-8 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </GlareHover>
          </motion.div>
        )}

        {/* Chips Decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="flex items-center justify-center gap-4 mt-20"
        >
          {['♠', '♥', '♦', '♣'].map((suit, index) => (
            <motion.div
              key={index}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500/20 to-blue-500/20 border-2 border-white/30 flex items-center justify-center text-3xl backdrop-blur-xl"
            >
              {suit}
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
```

---

## HERO-163: Liquid Chrome Reflections with Profile Cards

**Layout**: Profile card showcase with liquid background  
**Background**: Liquid Chrome effect  
**Animation**: ProfileCard, ReflectiveCard, Crosshair

```tsx
// Hero163.tsx
import { motion } from 'framer-motion';
import { useRef } from 'react';
import LiquidChrome from '@/components/ui/LiquidChrome';
import ProfileCard from '@/components/ui/ProfileCard';
import ReflectiveCard from '@/components/ui/ReflectiveCard';
import Crosshair from '@/components/ui/Crosshair';

interface Hero163Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  profiles?: Array<{
    name: string;
    role: string;
    image: string;
    bio: string;
  }>;
  logo?: string;
  storeName?: string;
}

export function Hero163({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  profiles = [],
  logo,
  storeName,
}: Hero163Props) {
  const containerRef = useRef(null);

  return (
    <section ref={containerRef} className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Liquid Chrome Background */}
      <div className="absolute inset-0 z-0">
        <LiquidChrome
          baseColor={[0.1, 0.1, 0.1]}
          speed={1}
          amplitude={0.6}
          interactive={true}
        />
      </div>

      {/* Crosshair Cursor */}
      <Crosshair
        containerRef={containerRef}
        color="#ffffff"
        targeted
      />

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
                  className="w-14 h-14 rounded-full ring-2 ring-white/50 relative z-10"
                />
                <div className="absolute inset-0 rounded-full bg-white/20 blur-xl animate-pulse"></div>
              </div>
            )}
            {storeName && (
              <span className="text-xl font-black tracking-wide">
                {storeName}
              </span>
            )}
          </div>

          {/* Badge */}
          <div className="px-5 py-2.5 rounded-full bg-white/10 border border-white/30 backdrop-blur-xl">
            <span className="text-sm font-bold tracking-wider">CHROME</span>
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
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-tight text-white">
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

        {/* Profile Cards Grid */}
        {profiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mb-20"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {profiles.map((profile, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
                >
                  <ReflectiveCard
                    borderRadius={30}
                    reflectionOpacity={0.4}
                  >
                    <ProfileCard
                      name={profile.name}
                      role={profile.role}
                      image={profile.image}
                      bio={profile.bio}
                      socialLinks={[]}
                    />
                  </ReflectiveCard>
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
            <ReflectiveCard
              borderRadius={50}
              reflectionOpacity={0.3}
            >
              <a
                href={ctaLink}
                className="inline-flex items-center gap-4 px-14 py-7 bg-white text-black rounded-full font-black text-2xl hover:shadow-2xl hover:shadow-white/50 transition-all hover:scale-105 group"
              >
                {ctaText}
                <svg className="w-8 h-8 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </ReflectiveCard>
          </motion.div>
        )}

        {/* Chrome Shine Bar */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.5, delay: 2 }}
          className="mt-20 h-2 bg-gradient-to-r from-transparent via-white to-transparent rounded-full"
        />

      </div>
    </section>
  );
}
```

---

## HERO-164: Pixel Blast Retro with Stepper Journey

**Layout**: Step-by-step journey showcase  
**Background**: Pixel Blast effect  
**Animation**: Stepper, PixelTrail, ClickSpark

```tsx
// Hero164.tsx
import { motion } from 'framer-motion';
import { useState } from 'react';
import PixelBlast from '@/components/ui/PixelBlast';
import Stepper, { Step } from '@/components/ui/Stepper';
import PixelTrail from '@/components/ui/PixelTrail';
import ClickSpark from '@/components/ui/ClickSpark';

interface Hero164Props {
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

export function Hero164({
  title,
  subtitle,
  steps = [],
  logo,
  storeName,
}: Hero164Props) {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Pixel Blast Background */}
      <div className="absolute inset-0 z-0">
        <PixelBlast
          variant="square"
          pixelSize={4}
          color="#B19EEF"
          patternScale={2}
          patternDensity={1}
          pixelSizeJitter={0}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid={false}
          speed={0.5}
          edgeFade={0.25}
          transparent
        />
      </div>

      {/* Pixel Trail Effect */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <PixelTrail
          gridSize={50}
          trailSize={0.1}
          maxAge={250}
          interpolate={5}
          color="#5227FF"
          gooeyEnabled
          gooStrength={2}
        />
      </div>

      {/* Content */}
      <ClickSpark
        sparkColor="#B19EEF"
        sparkSize={10}
        sparkRadius={15}
        sparkCount={8}
        duration={400}
      >
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
                    className="w-14 h-14 rounded-lg ring-2 ring-purple-500/50 relative z-10 pixelated"
                    style={{ imageRendering: 'pixelated' }}
                  />
                  <div className="absolute inset-0 rounded-lg bg-purple-500/30 blur-xl animate-pulse"></div>
                </div>
              )}
              {storeName && (
                <span className="text-xl font-black tracking-wide font-mono">
                  {storeName}
                </span>
              )}
            </div>

            {/* Badge */}
            <div className="px-5 py-2.5 rounded-lg bg-purple-500/20 border-2 border-purple-500/50 backdrop-blur-xl font-mono">
              <span className="text-sm font-bold tracking-wider">8-BIT RETRO</span>
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
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 font-mono">
                {title}
              </h1>
            </motion.div>

            {/* Subtitle */}
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-2xl md:text-3xl text-white/70 leading-relaxed max-w-3xl mx-auto font-mono"
              >
                {subtitle}
              </motion.p>
            )}

            {/* Pixel Counter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-lg bg-purple-500/10 border-2 border-purple-500/30 backdrop-blur-xl font-mono"
            >
              <span className="text-sm font-bold">LEVEL</span>
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
              className="max-w-4xl mx-auto"
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
                    <div className="p-12 rounded-2xl bg-purple-500/10 border-2 border-purple-500/30 backdrop-blur-xl space-y-6">
                      <h2 className="text-4xl font-black font-mono">{step.title}</h2>
                      {step.image && (
                        <img
                          src={step.image}
                          alt={step.title}
                          className="w-full h-64 object-cover rounded-xl border-2 border-purple-500/30"
                          style={{ imageRendering: 'pixelated' }}
                        />
                      )}
                      <p className="text-xl text-white/70 leading-relaxed font-mono">
                        {step.content}
                      </p>
                    </div>
                  </Step>
                ))}
              </Stepper>
            </motion.div>
          )}

          {/* Pixel Hearts */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="flex items-center justify-center gap-4 mt-20"
          >
            {[...Array(5)].map((_, index) => (
              <motion.div
                key={index}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: index * 0.2 }}
                className="text-4xl"
                style={{ imageRendering: 'pixelated' }}
              >
                ♥
              </motion.div>
            ))}
          </motion.div>

        </div>
      </ClickSpark>
    </section>
  );
}
```

---

## HERO-165: Dark Veil Mystery with Decay Cards

**Layout**: Mystery reveal card layout  
**Background**: Dark Veil effect  
**Animation**: DecayCard, StickerPeel, Noise

```tsx
// Hero165.tsx
import { motion } from 'framer-motion';
import DarkVeil from '@/components/ui/DarkVeil';
import DecayCard from '@/components/ui/DecayCard';
import StickerPeel from '@/components/ui/StickerPeel';
import Noise from '@/components/ui/Noise';

interface Hero165Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  mysteryCards?: Array<{
    image: string;
    title: string;
    description: string;
  }>;
  stickerImage?: string;
  logo?: string;
  storeName?: string;
}

export function Hero165({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  mysteryCards = [],
  stickerImage,
  logo,
  storeName,
}: Hero165Props) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Dark Veil Background */}
      <div className="absolute inset-0 z-0">
        <DarkVeil
          hueShift={0}
          noiseIntensity={0}
          scanlineIntensity={0}
          speed={0.5}
          scanlineFrequency={0}
          warpAmount={0}
        />
      </div>

      {/* Noise Overlay */}
      <div className="absolute inset-0 z-[1] opacity-20">
        <Noise
          patternSize={250}
          patternScaleX={2}
          patternScaleY={2}
          patternRefreshInterval={2}
          patternAlpha={15}
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
                  className="w-14 h-14 rounded-2xl ring-2 ring-gray-500/50 relative z-10"
                />
                <div className="absolute inset-0 rounded-2xl bg-gray-500/20 blur-xl animate-pulse"></div>
              </div>
            )}
            {storeName && (
              <span className="text-xl font-black tracking-wide">
                {storeName}
              </span>
            )}
          </div>

          {/* Sticker Peel */}
          {stickerImage && (
            <StickerPeel
              imageSrc={stickerImage}
              width={100}
              rotate={-15}
              peelBackHoverPct={30}
              peelBackActivePct={40}
              shadowIntensity={0.5}
              lightingIntensity={0.1}
              initialPosition={{ x: 0, y: 0 }}
              peelDirection={0}
            />
          )}

          {/* Badge */}
          <div className="px-5 py-2.5 rounded-full bg-gray-800/50 border border-gray-500/30 backdrop-blur-xl">
            <span className="text-sm font-bold tracking-wider">MYSTERY</span>
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
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-tight text-white">
              {title}
            </h1>
          </motion.div>

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-2xl md:text-3xl text-white/50 leading-relaxed max-w-3xl mx-auto"
            >
              {subtitle}
            </motion.p>
          )}

        </div>

        {/* Decay Cards Grid */}
        {mysteryCards.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mb-20"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {mysteryCards.map((card, index) => (
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
              className="inline-flex items-center gap-4 px-14 py-7 bg-gray-800 border-2 border-gray-500/50 text-white rounded-full font-black text-2xl hover:bg-gray-700 hover:border-gray-400 transition-all hover:scale-105 group"
            >
              {ctaText}
              <svg className="w-8 h-8 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </motion.div>
        )}

        {/* Mystery Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="text-center mt-20"
        >
          <p className="text-lg text-white/30 italic font-serif">
            "In darkness, we find the light..."
          </p>
        </motion.div>

      </div>
    </section>
  );
}
```

---

## HERO-166: Color Bends Spectrum with Pixel Card Gallery

**Layout**: Vibrant pixel card gallery  
**Background**: Color Bends effect  
**Animation**: PixelCard, MetaBalls, BlobCursor

```tsx
// Hero166.tsx
import { motion } from 'framer-motion';
import ColorBends from '@/components/ui/ColorBends';
import PixelCard from '@/components/ui/PixelCard';
import MetaBalls from '@/components/ui/MetaBalls';
import BlobCursor from '@/components/ui/BlobCursor';

interface Hero166Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  pixelCards?: Array<{
    image: string;
    title: string;
    category: string;
  }>;
  logo?: string;
  storeName?: string;
}

export function Hero166({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  pixelCards = [],
  logo,
  storeName,
}: Hero166Props) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Color Bends Background */}
      <div className="absolute inset-0 z-0">
        <ColorBends
          colors={["#ff5c7a", "#8a5cff", "#00ffd1"]}
          rotation={0}
          speed={0.2}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1}
          parallax={0.5}
          noise={0.1}
          transparent
          autoRotate={0}
        />
      </div>

      {/* MetaBalls Overlay */}
      <div className="absolute inset-0 z-[1] opacity-30 pointer-events-none">
        <MetaBalls
          color="#ffffff"
          cursorBallColor="#ffffff"
          cursorBallSize={2}
          ballCount={15}
          animationSize={30}
          enableMouseInteraction
          enableTransparency={true}
          hoverSmoothness={0.15}
          clumpFactor={1}
          speed={0.3}
        />
      </div>

      {/* Blob Cursor */}
      <BlobCursor
        blobType="circle"
        fillColor="#5227FF"
        trailCount={3}
        sizes={[60, 125, 75]}
        innerSizes={[20, 35, 25]}
        innerColor="rgba(255,255,255,0.8)"
        opacities={[0.6, 0.6, 0.6]}
        shadowColor="rgba(0,0,0,0.75)"
        shadowBlur={5}
        shadowOffsetX={10}
        shadowOffsetY={10}
        useFilter={true}
        fastDuration={0.1}
        slowDuration={0.5}
        zIndex={100}
      />

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
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-500/50 to-cyan-500/50 blur-xl animate-pulse"></div>
              </div>
            )}
            {storeName && (
              <span className="text-xl font-black tracking-wide">
                {storeName}
              </span>
            )}
          </div>

          {/* Badge */}
          <div className="px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 border border-white/20 backdrop-blur-xl">
            <span className="text-sm font-bold tracking-wider">SPECTRUM</span>
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
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400">
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

        {/* Pixel Cards Gallery */}
        {pixelCards.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mb-20"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pixelCards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.15 }}
                >
                  <PixelCard
                    image={card.image}
                    title={card.title}
                    category={card.category}
                    pixelSize={8}
                    hoverEffect="zoom"
                    borderColor={
                      index % 3 === 0 ? '#ff5c7a' :
                      index % 3 === 1 ? '#8a5cff' : '#00ffd1'
                    }
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
              className="inline-flex items-center gap-4 px-14 py-7 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white rounded-full font-black text-2xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-110 group"
            >
              {ctaText}
              <svg className="w-8 h-8 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </motion.div>
        )}

        {/* Color Spectrum Bar */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.5, delay: 2 }}
          className="mt-20 h-4 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-full"
        />

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

# Card & Layout Components
pnpm dlx shadcn@latest add @react-bits/CardSwap-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ProfileCard-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ReflectiveCard-TS-CSS
pnpm dlx shadcn@latest add @react-bits/DecayCard-TS-CSS
pnpm dlx shadcn@latest add @react-bits/PixelCard-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Stepper-TS-CSS

# Visual & Effect Components
pnpm dlx shadcn@latest add @react-bits/PixelTransition-TS-CSS
pnpm dlx shadcn@latest add @react-bits/GlareHover-TS-CSS
pnpm dlx shadcn@latest add @react-bits/PixelTrail-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ClickSpark-TS-CSS
pnpm dlx shadcn@latest add @react-bits/StickerPeel-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Noise-TS-CSS
pnpm dlx shadcn@latest add @react-bits/MetaBalls-TS-CSS

# Cursor Components
pnpm dlx shadcn@latest add @react-bits/Crosshair-TS-CSS
pnpm dlx shadcn@latest add @react-bits/BlobCursor-TS-CSS

# Background Effects
pnpm dlx shadcn@latest add @react-bits/Balatro-TS-CSS
pnpm dlx shadcn@latest add @react-bits/LiquidChrome-TS-CSS
pnpm dlx shadcn@latest add @react-bits/PixelBlast-TS-CSS
pnpm dlx shadcn@latest add @react-bits/DarkVeil-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ColorBends-TS-CSS
```

---

## SUMMARY

| Hero | Layout | Background | Key Components | Theme |
|------|--------|------------|----------------|-------|
| **HERO-162** | Card Swap Grid | Balatro | CardSwap, PixelTransition, GlareHover | Casino Retro |
| **HERO-163** | Profile Showcase | Liquid Chrome | ProfileCard, ReflectiveCard, Crosshair | Chrome Reflection |
| **HERO-164** | Step Journey | Pixel Blast | Stepper, PixelTrail, ClickSpark | 8-Bit Adventure |
| **HERO-165** | Mystery Cards | Dark Veil | DecayCard, StickerPeel, Noise | Dark Mystery |
| **HERO-166** | Pixel Gallery | Color Bends | PixelCard, MetaBalls, BlobCursor | Color Spectrum |

**Features:**
- ✅ Casino & gaming aesthetics
- ✅ Chrome & reflective surfaces
- ✅ Retro 8-bit pixel effects
- ✅ Mystery & decay animations
- ✅ Vibrant color spectrum
- ✅ Interactive cursors
- ✅ Step-by-step journeys
- ✅ Dark mode enforced
- ✅ Props strict compliance

**READY FOR NEXT BATCH!** 🎮🎨✨
