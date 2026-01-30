# ABOUT COMPONENTS 11-15 WITH REACT BITS

5 About section variants dengan React Bits integration, responsive layouts, dan
modern design.

---

## ABOUT-11: Liquid Ether Flow with Bounce Cards

**Layout**: Interactive bounce card grid  
**Background**: Liquid Ether physics  
**Animation**: BounceCards, TextPressure, ReflectiveCard

```tsx
// About11.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import LiquidEther from '@/components/ui/LiquidEther';
import BounceCards from '@/components/ui/BounceCards';
import TextPressure from '@/components/ui/TextPressure';
import ReflectiveCard from '@/components/ui/ReflectiveCard';

interface About11Props {
  title: string;
  subtitle?: string;
  content?: string;
  image?: string;
  features?: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
}

export function About11({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About11Props) {
  const bounceCards = features.map((f) => ({
    title: f.title,
    description: f.description,
    image: f.icon,
  }));

  return (
    <section id="about" className="relative py-20 overflow-hidden">
      {/* Liquid Ether Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <LiquidEther
          colors={['#5227FF', '#FF9FFC', '#B19EEF']}
          mouseForce={20}
          cursorSize={100}
          isViscous
          autoDemo
          autoSpeed={0.5}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="h-24 mb-4">
            <TextPressure
              text={title}
              flex
              alpha={false}
              stroke={false}
              width
              weight
              italic
              textColor="hsl(var(--foreground))"
              strokeColor="hsl(var(--primary))"
              minFontSize={32}
            />
          </div>
          {subtitle && (
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Main Image */}
          {image && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <ReflectiveCard borderRadius={30} reflectionOpacity={0.4}>
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
                  <OptimizedImage
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                  />
                </div>
              </ReflectiveCard>
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {content && (
              <p className="text-muted-foreground leading-relaxed text-lg">
                {content}
              </p>
            )}
          </motion.div>
        </div>

        {/* Bounce Cards */}
        {bounceCards.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <BounceCards
              cards={bounceCards}
              columns={3}
              gap={24}
              bounceIntensity={1.2}
              hoverScale={1.05}
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}
```

---

## ABOUT-12: Hyperspeed Tunnel with Stack Cards

**Layout**: 3D card stack with depth  
**Background**: Hyperspeed effect  
**Animation**: Stack, FallingText, Shuffle

```tsx
// About12.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import Hyperspeed from '@/components/ui/Hyperspeed';
import Stack from '@/components/ui/Stack';
import FallingText from '@/components/ui/FallingText';

interface About12Props {
  title: string;
  subtitle?: string;
  content?: string;
  image?: string;
  features?: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
}

export function About12({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About12Props) {
  return (
    <section id="about" className="relative py-20 overflow-hidden">
      {/* Hyperspeed Background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <Hyperspeed
          effectOptions={{
            distortion: 'turbulentDistortion',
            length: 400,
            roadWidth: 10,
            islandWidth: 2,
            lanesPerRoad: 3,
            fov: 90,
            speedUp: 2,
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <FallingText
            text={title}
            delay={100}
            className="text-4xl md:text-5xl font-black mb-4"
          />
          {subtitle && (
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Content */}
        {content && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto mb-12 text-center"
          >
            <p className="text-muted-foreground leading-relaxed text-lg">
              {content}
            </p>
          </motion.div>
        )}

        {/* Stack Cards */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Main Image */}
          {image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl"
            >
              <OptimizedImage
                src={image}
                alt={title}
                fill
                className="object-cover"
              />
            </motion.div>
          )}

          {/* Features as Stack */}
          {features.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Stack>
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-2xl bg-card border shadow-lg"
                  >
                    {feature.icon && (
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden mb-4">
                        <OptimizedImage
                          src={feature.icon}
                          alt={feature.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <h3 className="font-bold mb-2 text-xl">{feature.title}</h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </Stack>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
```

---

## ABOUT-13: Ballpit Physics with Profile Cards

**Layout**: Physics-based ball interaction  
**Background**: Ballpit effect  
**Animation**: Ballpit, ProfileCard, Magnet

```tsx
// About13.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import Ballpit from '@/components/ui/Ballpit';
import ProfileCard from '@/components/ui/ProfileCard';
import Magnet from '@/components/ui/Magnet';

interface About13Props {
  title: string;
  subtitle?: string;
  content?: string;
  image?: string;
  features?: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
}

export function About13({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About13Props) {
  return (
    <section id="about" className="relative py-20 overflow-hidden">
      {/* Ballpit Background */}
      <div className="absolute inset-0 z-0">
        <Ballpit
          count={50}
          gravity={0.5}
          friction={0.95}
          ballColors={['#5227FF', '#FF9FFC', '#B19EEF', '#00ffd1']}
          interactive={true}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Magnet padding={50} magnetStrength={50}>
            <h2 className="text-4xl md:text-5xl font-black mb-4">{title}</h2>
          </Magnet>
          {subtitle && (
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Content */}
        {content && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto mb-12 text-center"
          >
            <p className="text-muted-foreground leading-relaxed text-lg">
              {content}
            </p>
          </motion.div>
        )}

        {/* Grid Layout */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Main Image */}
          {image && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Magnet padding={30} magnetStrength={30}>
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                  <OptimizedImage
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                  />
                </div>
              </Magnet>
            </motion.div>
          )}

          {/* Features */}
          {features.length > 0 && (
            <div className="grid grid-cols-1 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="p-6 rounded-2xl bg-card/80 backdrop-blur-sm border">
                    <div className="flex items-start gap-4">
                      {feature.icon && (
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                          <OptimizedImage
                            src={feature.icon}
                            alt={feature.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold mb-1">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
```

---

## ABOUT-14: Pixel Snow Winter with Glass Surface

**Layout**: Winter theme with glass morphism  
**Background**: Pixel Snow  
**Animation**: PixelSnow, GlassSurface, FluidGlass

```tsx
// About14.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import PixelSnow from '@/components/ui/PixelSnow';
import GlassSurface from '@/components/ui/GlassSurface';
import FluidGlass from '@/components/ui/FluidGlass';

interface About14Props {
  title: string;
  subtitle?: string;
  content?: string;
  image?: string;
  features?: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
}

export function About14({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About14Props) {
  return (
    <section id="about" className="relative py-20 overflow-hidden">
      {/* Pixel Snow Background */}
      <div className="absolute inset-0 z-0">
        <PixelSnow
          color="#ffffff"
          flakeSize={0.01}
          minFlakeSize={1.25}
          pixelResolution={200}
          speed={1.25}
          density={0.3}
          direction={125}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4">{title}</h2>
          {subtitle && (
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Fluid Glass Effect */}
          {image && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="h-[500px]"
            >
              <FluidGlass
                mode="lens"
                scale={0.25}
                ior={1.15}
                thickness={2}
                transmission={1}
                roughness={0}
              />
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {content && (
              <p className="text-muted-foreground leading-relaxed text-lg">
                {content}
              </p>
            )}

            {/* Features with Glass Surface */}
            {features.length > 0 && (
              <div className="space-y-4 pt-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <GlassSurface
                      width="100%"
                      height={100}
                      borderRadius={16}
                      displace={0.3}
                      distortionScale={-180}
                      opacity={0.93}
                    >
                      <div className="p-4 flex items-center gap-4">
                        {feature.icon && (
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                            <OptimizedImage
                              src={feature.icon}
                              alt={feature.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold mb-1">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </GlassSurface>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

---

## ABOUT-15: Plasma Energy with Decay Cards

**Layout**: Plasma background with reveal cards  
**Background**: Plasma effect  
**Animation**: Plasma, DecayCard, Lightning

```tsx
// About15.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import Plasma from '@/components/ui/Plasma';
import DecayCard from '@/components/ui/DecayCard';
import Lightning from '@/components/ui/Lightning';

interface About15Props {
  title: string;
  subtitle?: string;
  content?: string;
  image?: string;
  features?: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
}

export function About15({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About15Props) {
  return (
    <section id="about" className="relative py-20 overflow-hidden">
      {/* Plasma Background */}
      <div className="absolute inset-0 z-0 opacity-50">
        <Plasma
          color="hsl(var(--primary))"
          speed={0.6}
          direction="forward"
          scale={1.1}
          opacity={0.8}
          mouseInteractive={true}
        />
      </div>

      {/* Lightning Overlay */}
      <div className="absolute inset-0 z-[1] opacity-20">
        <Lightning hue={260} xOffset={0} speed={1} intensity={1} size={1} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4">{title}</h2>
          {subtitle && (
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Content */}
        {content && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto mb-12 text-center"
          >
            <p className="text-muted-foreground leading-relaxed text-lg">
              {content}
            </p>
          </motion.div>
        )}

        {/* Main Image */}
        {image && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mb-12"
          >
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
              <OptimizedImage
                src={image}
                alt={title}
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        )}

        {/* Decay Cards Grid */}
        {features.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, rotateX: -90 }}
                whileInView={{ opacity: 1, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <DecayCard
                  image={feature.icon || ''}
                  title={feature.title}
                  description={feature.description}
                  decaySpeed={1.5}
                  revealOnHover
                />
              </motion.div>
            ))}
          </div>
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

# Text & Animation Components
pnpm dlx shadcn@latest add @react-bits/TextPressure-TS-CSS
pnpm dlx shadcn@latest add @react-bits/FallingText-TS-CSS

# Layout & Display Components
pnpm dlx shadcn@latest add @react-bits/BounceCards-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Stack-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ProfileCard-TS-CSS
pnpm dlx shadcn@latest add @react-bits/DecayCard-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ReflectiveCard-TS-CSS

# Interactive Components
pnpm dlx shadcn@latest add @react-bits/Magnet-TS-CSS

# Glass & Visual Effects
pnpm dlx shadcn@latest add @react-bits/GlassSurface-TS-CSS
pnpm dlx shadcn@latest add @react-bits/FluidGlass-TS-CSS

# Background Effects
pnpm dlx shadcn@latest add @react-bits/LiquidEther-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Hyperspeed-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Ballpit-TS-CSS
pnpm dlx shadcn@latest add @react-bits/PixelSnow-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Plasma-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Lightning-TS-CSS
```

---

## SUMMARY

| Component    | Layout         | Background   | Key Features              | Theme              |
| ------------ | -------------- | ------------ | ------------------------- | ------------------ |
| **ABOUT-11** | Bounce Cards   | Liquid Ether | BounceCards, TextPressure | Liquid Physics     |
| **ABOUT-12** | Stack Cards    | Hyperspeed   | Stack, FallingText        | Speed Tunnel       |
| **ABOUT-13** | Profile Cards  | Ballpit      | Ballpit, Magnet           | Physics Playground |
| **ABOUT-14** | Glass Morphism | Pixel Snow   | GlassSurface, FluidGlass  | Winter Glass       |
| **ABOUT-15** | Decay Reveal   | Plasma Storm | DecayCard, Lightning      | Energy Storm       |

**Features:**

- ✅ Advanced physics interactions
- ✅ 3D card stacking
- ✅ Glass morphism effects
- ✅ Liquid ether flow
- ✅ Plasma energy backgrounds
- ✅ Magnetic interactions
- ✅ Bounce animations
- ✅ Winter snow effects
- ✅ Fully responsive
- ✅ TypeScript ready

**15 ABOUT COMPONENTS COMPLETE!** 🎉✨

**READY FOR PRODUCTION!** 🚀
