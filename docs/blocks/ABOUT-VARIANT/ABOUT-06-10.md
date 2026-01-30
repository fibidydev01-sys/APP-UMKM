# ABOUT COMPONENTS 06-10 WITH REACT BITS

5 About section variants dengan React Bits integration, responsive layouts, dan
modern design.

---

## ABOUT-06: Dome Gallery with Iridescence

**Layout**: 3D dome gallery showcase  
**Background**: Iridescence effect  
**Animation**: DomeGallery, TrueFocus, AnimatedContent

```tsx
// About06.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import Iridescence from '@/components/ui/Iridescence';
import DomeGallery from '@/components/ui/DomeGallery';
import TrueFocus from '@/components/ui/TrueFocus';
import AnimatedContent from '@/components/ui/AnimatedContent';

interface About06Props {
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

export function About06({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About06Props) {
  const galleryImages = [
    image,
    ...features.map((f) => f.icon).filter(Boolean),
  ].filter(Boolean) as string[];

  return (
    <section id="about" className="relative py-20 overflow-hidden">
      {/* Iridescence Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Iridescence
          color={[0.5, 0.6, 0.8]}
          mouseReact
          amplitude={0.1}
          speed={1}
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
          <TrueFocus
            sentence={title}
            manualMode={false}
            blurAmount={5}
            borderColor="hsl(var(--primary))"
            animationDuration={0.5}
            pauseBetweenAnimations={1}
          />
          {subtitle && (
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-4">
              {subtitle}
            </p>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Dome Gallery */}
          {galleryImages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="h-[600px]"
            >
              <DomeGallery
                items={galleryImages}
                radius={300}
                itemWidth={200}
                itemHeight={280}
                autoRotate
                rotationSpeed={0.2}
              />
            </motion.div>
          )}

          {/* Content */}
          <AnimatedContent animationType="slide" duration={1} delay={0.3}>
            <div className="space-y-6">
              {content && (
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {content}
                </p>
              )}

              {/* Features List */}
              {features.length > 0 && (
                <div className="space-y-4 pt-4">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-xl bg-card/50 backdrop-blur-sm border"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                          <span className="text-primary font-bold">
                            {index + 1}
                          </span>
                        </div>
                        <h3 className="font-bold">{feature.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground ml-11">
                        {feature.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </AnimatedContent>
        </div>
      </div>
    </section>
  );
}
```

---

## ABOUT-07: Chroma Grid with Light Rays

**Layout**: Grid gallery with light effects  
**Background**: Light Rays  
**Animation**: ChromaGrid, DecryptedText, GradualBlur

```tsx
// About07.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import LightRays from '@/components/ui/LightRays';
import ChromaGrid from '@/components/ui/ChromaGrid';
import DecryptedText from '@/components/ui/DecryptedText';
import GradualBlur from '@/components/ui/GradualBlur';

interface About07Props {
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

export function About07({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About07Props) {
  const chromaItems = [
    ...(image ? [{ image, title }] : []),
    ...features.map((f) => ({
      image: f.icon || '',
      title: f.title,
    })),
  ].filter((item) => item.image);

  return (
    <section id="about" className="relative py-20 overflow-hidden">
      {/* Light Rays Background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <LightRays
          raysOrigin="top-center"
          raysColor="hsl(var(--primary))"
          raysSpeed={1}
          lightSpread={0.5}
          rayLength={3}
          followMouse={true}
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
          <DecryptedText
            text={title}
            speed={50}
            maxIterations={10}
            sequential={false}
            useOriginalCharsOnly={false}
            characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
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
            className="max-w-3xl mx-auto mb-12 text-center relative"
          >
            <p className="text-muted-foreground leading-relaxed text-lg">
              {content}
            </p>
            <GradualBlur
              target="parent"
              position="bottom"
              height="4rem"
              strength={2}
            />
          </motion.div>
        )}

        {/* Chroma Grid */}
        {chromaItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <ChromaGrid
              items={chromaItems}
              columns={4}
              gap={24}
              hoverEffect="glow"
              chromaIntensity={0.8}
            />
          </motion.div>
        )}

        {/* Features as Text List */}
        {features.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-card border"
              >
                <h3 className="font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
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

## ABOUT-08: Flying Posters with Silk Background

**Layout**: 3D floating posters showcase  
**Background**: Silk waves  
**Animation**: FlyingPosters, TextType, MetallicPaint

```tsx
// About08.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import Silk from '@/components/ui/Silk';
import FlyingPosters from '@/components/ui/FlyingPosters';
import TextType from '@/components/ui/TextType';
import MetallicPaint from '@/components/ui/MetallicPaint';

interface About08Props {
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

export function About08({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About08Props) {
  const posterImages = [
    image,
    ...features.map((f) => f.icon).filter(Boolean),
  ].filter(Boolean) as string[];

  return (
    <section id="about" className="relative py-20 overflow-hidden">
      {/* Silk Background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <Silk
          speed={5}
          scale={1}
          color="#7B7481"
          noiseIntensity={1.5}
          rotation={0}
        />
      </div>

      {/* Flying Posters */}
      {posterImages.length > 0 && (
        <div className="absolute inset-0 z-[1] opacity-20 pointer-events-none">
          <FlyingPosters
            images={posterImages}
            count={6}
            speed={0.3}
            scale={0.6}
            rotation={10}
          />
        </div>
      )}

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <TextType
            text={title}
            typingSpeed={100}
            deletingSpeed={50}
            pauseTime={2000}
            className="text-4xl md:text-5xl font-black mb-4"
          />
          {subtitle && (
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Main Image with Metallic Paint */}
          {image && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-[4/3] rounded-3xl overflow-hidden"
            >
              <MetallicPaint
                imageSrc={image}
                seed={42}
                scale={4}
                speed={0.3}
                liquid={0.75}
                brightness={2}
                contrast={0.5}
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

            {/* Features */}
            {features.length > 0 && (
              <div className="grid grid-cols-1 gap-4 pt-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-card/50 backdrop-blur-sm border"
                  >
                    {feature.icon && (
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

---

## ABOUT-09: Grid Motion with Ribbons

**Layout**: Dynamic grid motion showcase  
**Background**: Ribbons flow  
**Animation**: GridMotion, ASCIIText, ElectricBorder

```tsx
// About09.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import Ribbons from '@/components/ui/Ribbons';
import GridMotion from '@/components/ui/GridMotion';
import ASCIIText from '@/components/ui/ASCIIText';
import ElectricBorder from '@/components/ui/ElectricBorder';

interface About09Props {
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

export function About09({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About09Props) {
  const gridItems = features.map((f) => (
    <div className="p-6 rounded-2xl bg-card border">
      {f.icon && (
        <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-4">
          <OptimizedImage
            src={f.icon}
            alt={f.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <h3 className="font-bold mb-2">{f.title}</h3>
      <p className="text-sm text-muted-foreground">{f.description}</p>
    </div>
  ));

  return (
    <section id="about" className="relative py-20 overflow-hidden">
      {/* Ribbons Background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <Ribbons
          baseThickness={30}
          colors={['hsl(var(--primary))']}
          speedMultiplier={0.5}
          maxAge={500}
          enableFade={true}
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
          <ASCIIText
            text={title}
            fontSize={80}
            color="hsl(var(--foreground))"
            fontWeight={900}
            animateOnScroll
            className="mb-4"
          />
          {subtitle && (
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Main Image */}
        {image && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mb-12"
          >
            <ElectricBorder
              borderWidth={3}
              borderColor="hsl(var(--primary))"
              glowIntensity={0.8}
              animationSpeed={2}
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden">
                <OptimizedImage
                  src={image}
                  alt={title}
                  fill
                  className="object-cover"
                />
              </div>
            </ElectricBorder>
          </motion.div>
        )}

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

        {/* Grid Motion */}
        {gridItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="h-[600px]"
          >
            <GridMotion
              items={gridItems}
              gradientColor="hsl(var(--background))"
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}
```

---

## ABOUT-10: Infinite Menu with Galaxy Background

**Layout**: Infinite scrolling menu showcase  
**Background**: Galaxy particles  
**Animation**: InfiniteMenu, GradientText, StarBorder

```tsx
// About10.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import Galaxy from '@/components/ui/Galaxy';
import InfiniteMenu from '@/components/ui/InfiniteMenu';
import GradientText from '@/components/ui/GradientText';
import StarBorder from '@/components/ui/StarBorder';

interface About10Props {
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

export function About10({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About10Props) {
  const menuItems = [
    ...(image
      ? [
          {
            image,
            link: '#',
            title,
            description: content || '',
          },
        ]
      : []),
    ...features.map((f) => ({
      image: f.icon || '',
      link: '#',
      title: f.title,
      description: f.description,
    })),
  ].filter((item) => item.image);

  return (
    <section id="about" className="relative py-20 overflow-hidden">
      {/* Galaxy Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Galaxy
          mouseRepulsion
          mouseInteraction
          density={1}
          glowIntensity={0.3}
          rotationSpeed={0.1}
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
          <GradientText
            colors={[
              'hsl(var(--primary))',
              'hsl(var(--secondary))',
              'hsl(var(--primary))',
            ]}
            animationSpeed={8}
            showBorder={false}
            className="text-4xl md:text-5xl font-black mb-4"
          >
            {title}
          </GradientText>
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
            <StarBorder
              as="div"
              color="primary"
              speed="5s"
              className="p-8 rounded-3xl"
            >
              <p className="text-muted-foreground leading-relaxed text-lg">
                {content}
              </p>
            </StarBorder>
          </motion.div>
        )}

        {/* Infinite Menu */}
        {menuItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="h-[600px]"
          >
            <InfiniteMenu items={menuItems} scale={1} />
          </motion.div>
        )}

        {/* Feature Cards Below */}
        {features.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border text-center"
              >
                {feature.icon && (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden mx-auto mb-4">
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

# Text & Typography Components
pnpm dlx shadcn@latest add @react-bits/TrueFocus-TS-CSS
pnpm dlx shadcn@latest add @react-bits/DecryptedText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/TextType-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ASCIIText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/GradientText-TS-CSS

# Layout & Display Components
pnpm dlx shadcn@latest add @react-bits/DomeGallery-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ChromaGrid-TS-CSS
pnpm dlx shadcn@latest add @react-bits/FlyingPosters-TS-CSS
pnpm dlx shadcn@latest add @react-bits/GridMotion-TS-CSS
pnpm dlx shadcn@latest add @react-bits/InfiniteMenu-TS-CSS
pnpm dlx shadcn@latest add @react-bits/AnimatedContent-TS-CSS

# Visual Effects
pnpm dlx shadcn@latest add @react-bits/MetallicPaint-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ElectricBorder-TS-CSS
pnpm dlx shadcn@latest add @react-bits/StarBorder-TS-CSS
pnpm dlx shadcn@latest add @react-bits/GradualBlur-TS-CSS

# Background Effects
pnpm dlx shadcn@latest add @react-bits/Iridescence-TS-CSS
pnpm dlx shadcn@latest add @react-bits/LightRays-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Silk-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Ribbons-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Galaxy-TS-CSS
```

---

## SUMMARY

| Component    | Layout         | Background  | Key Features                 | Theme        |
| ------------ | -------------- | ----------- | ---------------------------- | ------------ |
| **ABOUT-06** | Dome Gallery   | Iridescence | DomeGallery, TrueFocus       | 3D Shimmer   |
| **ABOUT-07** | Chroma Grid    | Light Rays  | ChromaGrid, DecryptedText    | Divine Light |
| **ABOUT-08** | Flying Posters | Silk        | FlyingPosters, MetallicPaint | 3D Floating  |
| **ABOUT-09** | Grid Motion    | Ribbons     | GridMotion, ASCIIText        | Dynamic Flow |
| **ABOUT-10** | Infinite Menu  | Galaxy      | InfiniteMenu, GradientText   | Cosmic Menu  |

**Features:**

- ✅ Advanced 3D layouts
- ✅ Cosmic & shimmer effects
- ✅ Dynamic grid systems
- ✅ Infinite scrolling menus
- ✅ Metallic paint effects
- ✅ Electric borders
- ✅ Typography animations
- ✅ Fully responsive
- ✅ TypeScript ready

**READY FOR PRODUCTION!** 🚀✨
