# ABOUT COMPONENTS 01-05 WITH REACT BITS

5 About section variants dengan React Bits integration, responsive layouts, dan
modern design.

---

## ABOUT-01: Split Layout with Aurora Background

**Layout**: Classic split image/content  
**Background**: Aurora gradient  
**Animation**: SplitText, FadeContent, AnimatedContent

```tsx
// About01.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import Aurora from '@/components/ui/aurora/Aurora';
import SplitText from '@/components/ui/split-text/SplitText';
import FadeContent from '@/components/ui/fade-content/FadeContent';

interface About01Props {
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

export function About01({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About01Props) {
  return (
    <section id="about" className="relative py-20 overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <Aurora
          colorStops={['#7cff67', '#B19EEF', '#5227FF']}
          blend={0.5}
          amplitude={1.0}
          speed={1}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <SplitText
            text={title}
            className="text-4xl md:text-5xl font-black mb-4"
            delay={50}
            duration={1}
          />
          {subtitle && (
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Split Layout */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          {image && (
            <FadeContent fadeDirection="left" duration={1}>
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <OptimizedImage
                  src={image}
                  alt={title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </FadeContent>
          )}

          {/* Content */}
          <FadeContent fadeDirection="right" duration={1} delay={0.2}>
            <div className="space-y-6">
              {content && (
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {content}
                </p>
              )}

              {/* Features */}
              {features.length > 0 && (
                <div className="space-y-4 pt-4">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-start gap-4"
                    >
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
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </FadeContent>
        </div>
      </div>
    </section>
  );
}
```

---

## ABOUT-02: Bento Grid Layout with Gradient Blinds

**Layout**: Bento grid showcase  
**Background**: Gradient Blinds  
**Animation**: MagicBento, BlurText, TiltedCard

```tsx
// About02.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import GradientBlinds from '@/components/ui/gradient-blinds/GradientBlinds';
import MagicBento from '@/components/ui/magic-bento/MagicBento';
import BlurText from '@/components/ui/blur-text/BlurText';
import TiltedCard from '@/components/ui/tilted-card/TiltedCard';

interface About02Props {
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

export function About02({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About02Props) {
  return (
    <section id="about" className="relative py-20 overflow-hidden">
      {/* Gradient Blinds Background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <GradientBlinds
          gradientColors={['#FF9FFC', '#5227FF']}
          angle={0}
          noise={0.3}
          blindCount={12}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <BlurText
            text={title}
            delay={100}
            animateBy="words"
            direction="top"
            className="text-4xl md:text-5xl font-black mb-4"
          />
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        {/* Bento Grid */}
        <MagicBento>
          {/* Large Image Card */}
          {image && (
            <div className="col-span-2 row-span-2">
              <TiltedCard maxTilt={10} scale={1.02}>
                <div className="relative h-full min-h-[400px] rounded-3xl overflow-hidden">
                  <OptimizedImage
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                  />
                </div>
              </TiltedCard>
            </div>
          )}

          {/* Content Card */}
          {content && (
            <div className="col-span-1 row-span-2">
              <div className="h-full p-8 rounded-3xl bg-card border flex flex-col justify-center">
                <p className="text-muted-foreground leading-relaxed">
                  {content}
                </p>
              </div>
            </div>
          )}

          {/* Feature Cards */}
          {features.slice(0, 3).map((feature, index) => (
            <div key={index} className="col-span-1 row-span-1">
              <TiltedCard maxTilt={15} scale={1.05}>
                <div className="h-full p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border">
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
                  <h3 className="font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {feature.description}
                  </p>
                </div>
              </TiltedCard>
            </div>
          ))}
        </MagicBento>
      </div>
    </section>
  );
}
```

---

## ABOUT-03: Spotlight Cards with Dot Grid

**Layout**: Spotlight reveal cards  
**Background**: Dot Grid interactive  
**Animation**: SpotlightCard, ScrollReveal, GlareHover

```tsx
// About03.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import DotGrid from '@/components/ui/dot-grid/DotGrid';
import SpotlightCard from '@/components/ui/spotlight-card/SpotlightCard';
import ScrollReveal from '@/components/ui/scroll-reveal/ScrollReveal';
import GlareHover from '@/components/ui/glare-hover/GlareHover';

interface About03Props {
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

export function About03({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About03Props) {
  return (
    <section id="about" className="relative py-20 overflow-hidden">
      {/* Dot Grid Background */}
      <div className="absolute inset-0 z-0">
        <DotGrid
          dotSize={3}
          gap={20}
          baseColor="hsl(var(--muted))"
          activeColor="hsl(var(--primary))"
          proximity={100}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <ScrollReveal baseOpacity={0.1} enableBlur blurStrength={4}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">{title}</h2>
            {subtitle && (
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        </ScrollReveal>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Image Card */}
          {image && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-2"
            >
              <SpotlightCard
                image={image}
                title={title}
                description={content || ''}
                spotlightColor="hsl(var(--primary))"
                spotlightSize={300}
              />
            </motion.div>
          )}

          {/* Content Column */}
          <div className="space-y-6">
            {content && !image && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-card border"
              >
                <p className="text-muted-foreground leading-relaxed">
                  {content}
                </p>
              </motion.div>
            )}

            {/* Feature Cards */}
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlareHover
                  glareColor="hsl(var(--primary))"
                  glareIntensity={0.5}
                  rotationIntensity={5}
                >
                  <div className="p-6 rounded-2xl bg-card border hover:shadow-lg transition-shadow">
                    {feature.icon && (
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden mb-3">
                        <OptimizedImage
                          src={feature.icon}
                          alt={feature.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <h3 className="font-bold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </GlareHover>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

## ABOUT-04: Masonry Gallery with Particles

**Layout**: Pinterest-style masonry  
**Background**: Particles effect  
**Animation**: Masonry, FadeContent, ClickSpark

```tsx
// About04.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import Particles from '@/components/ui/particles/Particles';
import Masonry from '@/components/ui/masonry/Masonry';
import ClickSpark from '@/components/ui/click-spark/ClickSpark';

interface About04Props {
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

export function About04({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About04Props) {
  const masonryItems = [
    ...(image ? [{ image, title, category: 'Main' }] : []),
    ...features.map((f) => ({
      image: f.icon || '',
      title: f.title,
      category: f.description,
    })),
  ].filter((item) => item.image);

  return (
    <section id="about" className="relative py-20 overflow-hidden">
      {/* Particles Background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <Particles
          particleColors={['hsl(var(--primary))']}
          particleCount={100}
          speed={0.1}
          particleBaseSize={80}
        />
      </div>

      <ClickSpark
        sparkColor="hsl(var(--primary))"
        sparkSize={10}
        sparkRadius={15}
        sparkCount={8}
      >
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

          {/* Masonry Gallery */}
          {masonryItems.length > 0 && (
            <Masonry items={masonryItems} columns={3} gap={20} />
          )}
        </div>
      </ClickSpark>
    </section>
  );
}
```

---

## ABOUT-05: Circular Gallery with Threads

**Layout**: Rotating circular showcase  
**Background**: Threads animation  
**Animation**: CircularGallery, ShinyText, ScrollFloat

```tsx
// About05.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import Threads from '@/components/ui/threads/Threads';
import CircularGallery from '@/components/ui/circular-gallery/CircularGallery';
import ShinyText from '@/components/ui/shiny-text/ShinyText';
import ScrollFloat from '@/components/ui/scroll-float/ScrollFloat';

interface About05Props {
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

export function About05({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About05Props) {
  const galleryImages = [
    image,
    ...features.map((f) => f.icon).filter(Boolean),
  ].filter(Boolean) as string[];

  return (
    <section id="about" className="relative py-20 overflow-hidden">
      {/* Threads Background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <Threads amplitude={1} distance={0} enableMouseInteraction />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <ShinyText
            text={title}
            speed={2}
            color="hsl(var(--foreground))"
            shineColor="hsl(var(--primary))"
            spread={120}
            direction="left"
            className="text-4xl md:text-5xl font-black"
          />
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-muted-foreground text-lg max-w-2xl mx-auto mt-4"
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Circular Gallery */}
          {galleryImages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="h-[600px]"
            >
              <CircularGallery
                items={galleryImages}
                itemWidth={200}
                itemHeight={280}
                radius={350}
                autoRotate
                rotationSpeed={0.2}
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
              <ScrollFloat
                animationDuration={1}
                ease="back.inOut(2)"
                stagger={0.03}
              >
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {content}
                </p>
              </ScrollFloat>
            )}

            {features.length > 0 && (
              <div className="space-y-4 pt-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-card border hover:border-primary/50 transition-colors"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
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

## DEPENDENCIES & INSTALLATION

### Required Packages

```bash
# Core
pnpm install framer-motion

# Text & Typography Components
pnpm dlx shadcn@latest add @react-bits/SplitText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/BlurText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ShinyText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ScrollFloat-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ScrollReveal-TS-CSS

# Layout & Display Components
pnpm dlx shadcn@latest add @react-bits/FadeContent-TS-CSS
pnpm dlx shadcn@latest add @react-bits/MagicBento-TS-CSS
pnpm dlx shadcn@latest add @react-bits/TiltedCard-TS-CSS
pnpm dlx shadcn@latest add @react-bits/SpotlightCard-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Masonry-TS-CSS
pnpm dlx shadcn@latest add @react-bits/CircularGallery-TS-CSS

# Interactive Components
pnpm dlx shadcn@latest add @react-bits/GlareHover-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ClickSpark-TS-CSS

# Background Effects
pnpm dlx shadcn@latest add @react-bits/Aurora-TS-CSS
pnpm dlx shadcn@latest add @react-bits/GradientBlinds-TS-CSS
pnpm dlx shadcn@latest add @react-bits/DotGrid-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Particles-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Threads-TS-CSS
```

---

## SUMMARY

| Component    | Layout              | Background      | Key Features               | Theme              |
| ------------ | ------------------- | --------------- | -------------------------- | ------------------ |
| **ABOUT-01** | Split Image/Content | Aurora          | SplitText, FadeContent     | Classic Split      |
| **ABOUT-02** | Bento Grid          | Gradient Blinds | MagicBento, TiltedCard     | Modern Grid        |
| **ABOUT-03** | Spotlight Cards     | Dot Grid        | SpotlightCard, GlareHover  | Interactive Reveal |
| **ABOUT-04** | Masonry Gallery     | Particles       | Masonry, ClickSpark        | Gallery Style      |
| **ABOUT-05** | Circular Gallery    | Threads         | CircularGallery, ShinyText | Rotating Showcase  |

**Features:**

- ✅ Fully responsive layouts
- ✅ Multiple animation variants
- ✅ Interactive backgrounds
- ✅ Optimized images with Next.js
- ✅ TypeScript interfaces
- ✅ Framer Motion animations
- ✅ React Bits integration
- ✅ Accessible & semantic HTML

**READY FOR PRODUCTION!** 🚀