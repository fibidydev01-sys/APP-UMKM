# ABOUT COMPONENTS 36-40 WITH REACT BITS - SLATE THEME

5 About section variants dengan React Bits integration (Component & Text Animations ONLY), **SLATE THEME** (blue-gray modern) dari shadcn UI, experimental layouts, dan creative combinations.

---

## ABOUT-36: Magnet Lines with Bubble Menu

**Layout**: Magnetic line connections dengan bubble navigation  
**Background**: Slate gradient dengan depth  
**Animation**: MagnetLines, BubbleMenu, BlurText, GradualBlur

```tsx
// About36.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import MagnetLines from '@/components/ui/MagnetLines';
import BubbleMenu from '@/components/ui/BubbleMenu';
import BlurText from '@/components/ui/BlurText';
import GradualBlur from '@/components/ui/GradualBlur';

interface About36Props {
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

export function About36({ title, subtitle, content, image, features = [] }: About36Props) {
  const menuItems = features.slice(0, 5).map((feature, index) => ({
    label: feature.title,
    href: `#${feature.title.toLowerCase().replace(/\s+/g, '-')}`,
    ariaLabel: feature.title,
    rotation: index % 2 === 0 ? -8 : 8,
    hoverStyles: { 
      bgColor: '#3b82f6', 
      textColor: '#ffffff' 
    }
  }));

  return (
    <section id="about" className="relative py-20 overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50/30 to-slate-50">
      {/* Magnet Lines Background */}
      <div className="absolute inset-0 opacity-20">
        <MagnetLines
          lineColor="#3b82f6"
          lineWidth={2}
          magnetStrength={100}
          lineCount={15}
          connectionDistance={150}
        />
      </div>

      {/* Bubble Menu */}
      {menuItems.length > 0 && (
        <div className="fixed top-8 right-8 z-50">
          <BubbleMenu
            logo={<span className="font-bold text-slate-900">A</span>}
            items={menuItems}
            menuAriaLabel="Toggle navigation"
            menuBg="#ffffff"
            menuContentColor="#0f172a"
            useFixedPosition={true}
            animationEase="back.out(1.5)"
            animationDuration={0.5}
            staggerDelay={0.12}
          />
        </div>
      )}

      <div className="container mx-auto px-4 relative z-10">
        {/* Header with Blur Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-slate-900">
            {title}
          </h2>
          {subtitle && (
            <BlurText
              text={subtitle}
              delay={200}
              animateBy="words"
              direction="top"
              className="text-slate-600 text-lg max-w-2xl mx-auto"
            />
          )}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Main Image with Gradual Blur */}
          {image && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[500px] rounded-3xl overflow-hidden"
            >
              <OptimizedImage
                src={image}
                alt={title}
                fill
                className="object-cover"
              />
              <GradualBlur
                target="self"
                position="bottom"
                height="7rem"
                strength={2}
                divCount={5}
                curve="bezier"
                exponential
                opacity={1}
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
              <p className="text-slate-600 leading-relaxed text-lg mb-6">
                {content}
              </p>
            )}

            {/* Features */}
            {features.length > 0 && (
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-5 rounded-2xl bg-white border border-slate-200 hover:shadow-lg hover:border-blue-300 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      {feature.icon && (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-blue-50 border border-blue-100">
                          <OptimizedImage
                            src={feature.icon}
                            alt={feature.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold mb-1 text-slate-900">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {feature.description}
                        </p>
                      </div>
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

## ABOUT-37: Gooey Nav with Sticker Peel

**Layout**: Gooey navigation dengan sticker peel effects  
**Background**: Clean slate white  
**Animation**: GooeyNav, StickerPeel, ScrollFloat, DecryptedText

```tsx
// About37.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import GooeyNav from '@/components/ui/GooeyNav';
import StickerPeel from '@/components/ui/StickerPeel';
import ScrollFloat from '@/components/ui/ScrollFloat';
import DecryptedText from '@/components/ui/DecryptedText';

interface About37Props {
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

export function About37({ title, subtitle, content, image, features = [] }: About37Props) {
  const navItems = [
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <section id="about" className="relative py-20 overflow-hidden bg-white">
      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 via-transparent to-blue-50/20" />

      {/* Gooey Navigation */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <GooeyNav
          items={navItems}
          particleCount={15}
          particleDistances={[90, 10]}
          particleR={100}
          initialActiveIndex={0}
          animationTime={600}
          timeVariance={300}
          colors={[1, 2, 3, 1, 2, 3, 1, 4]}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header with Scroll Float */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <ScrollFloat
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="center bottom+=50%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.03}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-slate-900">
              {title}
            </h2>
          </ScrollFloat>
          {subtitle && (
            <DecryptedText
              text={subtitle}
              animateOn="view"
              speed={60}
              className="text-slate-600 text-lg max-w-2xl mx-auto"
            />
          )}
        </motion.div>

        {/* Sticker Peel Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="relative h-[400px] rounded-3xl bg-slate-50 border border-slate-200 p-8">
            {content && (
              <p className="text-slate-600 leading-relaxed text-lg max-w-2xl">
                {content}
              </p>
            )}
            
            {/* Sticker Peel Effect */}
            {image && (
              <div className="absolute bottom-8 right-8">
                <StickerPeel
                  imageSrc={image}
                  width={150}
                  rotate={-5}
                  peelBackHoverPct={30}
                  peelBackActivePct={40}
                  shadowIntensity={0.5}
                  lightingIntensity={0.1}
                  initialPosition={{ x: 0, y: 0 }}
                  peelDirection={45}
                />
              </div>
            )}
          </div>
        </motion.div>

        {/* Features Grid */}
        {features.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-white border border-slate-200 text-center hover:shadow-lg hover:border-blue-300 transition-all"
              >
                {feature.icon && (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden mx-auto mb-4 border-2 border-blue-100">
                    <OptimizedImage
                      src={feature.icon}
                      alt={feature.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <h3 className="font-bold mb-2 text-slate-900">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
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

## ABOUT-38: Flowing Menu with Model Viewer

**Layout**: Flowing menu navigation dengan 3D model viewer  
**Background**: Slate gradient  
**Animation**: FlowingMenu, ModelViewer, ShinyText, FuzzyText

```tsx
// About38.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import FlowingMenu from '@/components/ui/FlowingMenu';
import ModelViewer from '@/components/ui/ModelViewer';
import ShinyText from '@/components/ui/ShinyText';
import FuzzyText from '@/components/ui/FuzzyText';

interface About38Props {
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

export function About38({ title, subtitle, content, image, features = [] }: About38Props) {
  const menuItems = features.slice(0, 4).map(feature => ({
    link: '#',
    text: feature.title,
    image: feature.icon || 'https://picsum.photos/600/400?random=1'
  }));

  return (
    <section id="about" className="relative py-20 overflow-hidden bg-gradient-to-tr from-slate-100 via-slate-50 to-blue-50">
      {/* Flowing Menu */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <FlowingMenu
          items={menuItems}
          speed={15}
          textColor="#ffffff"
          bgColor="#0f172a"
          marqueeBgColor="#3b82f6"
          marqueeTextColor="#ffffff"
          borderColor="#3b82f6"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10 mt-24">
        {/* Header with Fuzzy & Shiny Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <FuzzyText
            baseIntensity={0.2}
            hoverIntensity={0.5}
            enableHover
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-slate-900">
              {title}
            </h2>
          </FuzzyText>
          {subtitle && (
            <ShinyText
              text={subtitle}
              speed={2}
              color="#64748b"
              shineColor="#3b82f6"
              spread={120}
              className="text-lg max-w-2xl mx-auto"
            />
          )}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* 3D Model Viewer */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl overflow-hidden bg-slate-900/5 border border-slate-200"
          >
            <ModelViewer
              url="https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/ToyCar/glTF-Binary/ToyCar.glb"
              width="100%"
              height={500}
              modelXOffset={0.5}
              modelYOffset={0}
              enableMouseParallax
              enableHoverRotation
              environmentPreset="sunset"
              fadeIn={true}
              autoRotate={true}
              autoRotateSpeed={0.35}
              showScreenshotButton={false}
            />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {content && (
              <p className="text-slate-600 leading-relaxed text-lg mb-6">
                {content}
              </p>
            )}

            {/* Features */}
            {features.length > 0 && (
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-5 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-lg transition-all"
                  >
                    <h3 className="font-bold mb-2 text-slate-900">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {feature.description}
                    </p>
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

## ABOUT-39: Infinite Menu with Glass Icons

**Layout**: Infinite scrolling menu dengan glass icon showcase  
**Background**: Clean slate  
**Animation**: InfiniteMenu, GlassIcons, GradientText, ClickSpark

```tsx
// About39.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import InfiniteMenu from '@/components/ui/InfiniteMenu';
import GlassIcons from '@/components/ui/GlassIcons';
import GradientText from '@/components/ui/GradientText';
import ClickSpark from '@/components/ui/ClickSpark';

interface About39Props {
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

export function About39({ title, subtitle, content, image, features = [] }: About39Props) {
  const menuItems = features.map(feature => ({
    image: feature.icon || 'https://picsum.photos/300/300?grayscale',
    link: '#',
    title: feature.title,
    description: feature.description
  }));

  const glassIconItems = features.slice(0, 6).map((feature, index) => ({
    icon: <span className="text-2xl">🎯</span>,
    color: ['blue', 'purple', 'indigo', 'cyan', 'sky', 'violet'][index] as any,
    label: feature.title
  }));

  return (
    <section id="about" className="relative py-20 overflow-hidden bg-slate-50">
      {/* Blue Gradient Accents */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-slate-400/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header with Gradient Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <GradientText
            colors={["#0f172a", "#3b82f6", "#60a5fa", "#0f172a"]}
            animationSpeed={7}
            showBorder={false}
            className="text-4xl md:text-5xl font-black mb-4"
          >
            {title}
          </GradientText>
          {subtitle && (
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Infinite Menu */}
        {menuItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="h-[400px] mb-12 rounded-3xl overflow-hidden"
          >
            <InfiniteMenu
              items={menuItems}
              scale={1}
            />
          </motion.div>
        )}

        {/* Content with Click Spark */}
        {content && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto mb-12"
          >
            <ClickSpark
              sparkColor="#3b82f6"
              sparkSize={10}
              sparkRadius={15}
              sparkCount={8}
              duration={400}
            >
              <p className="text-slate-600 leading-relaxed text-lg text-center p-8 rounded-2xl bg-white border border-slate-200">
                {content}
              </p>
            </ClickSpark>
          </motion.div>
        )}

        {/* Glass Icons */}
        {glassIconItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="h-[300px] max-w-4xl mx-auto"
          >
            <GlassIcons
              items={glassIconItems}
              className="custom-glass-icons"
              colorful={true}
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}
```

---

## ABOUT-40: Card Nav with Cubes Background

**Layout**: Card navigation dengan 3D cubes interactive background  
**Background**: Slate dark dengan cubes  
**Animation**: CardNav, Cubes, TrueFocus, Shuffle

```tsx
// About40.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import CardNav from '@/components/ui/CardNav';
import Cubes from '@/components/ui/Cubes';
import TrueFocus from '@/components/ui/TrueFocus';
import Shuffle from '@/components/ui/Shuffle';

interface About40Props {
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

export function About40({ title, subtitle, content, image, features = [] }: About40Props) {
  const navItems = features.slice(0, 3).map((feature, index) => ({
    label: feature.title,
    bgColor: ['#0D1B2A', '#1B263B', '#415A77'][index] || '#0D1B2A',
    textColor: '#fff',
    links: [
      { label: 'Learn More', ariaLabel: `Learn more about ${feature.title}` },
      { label: 'Get Started', ariaLabel: `Get started with ${feature.title}` }
    ]
  }));

  return (
    <section id="about" className="relative py-20 overflow-hidden bg-slate-900">
      {/* Cubes Background */}
      <div className="absolute inset-0 opacity-30">
        <Cubes
          gridSize={8}
          maxAngle={45}
          radius={3}
          borderStyle="1px solid #3b82f6"
          faceColor="#1e293b"
          rippleColor="#3b82f6"
          rippleSpeed={1.5}
          autoAnimate
          rippleOnClick
        />
      </div>

      {/* Card Navigation */}
      {navItems.length > 0 && (
        <div className="fixed top-8 left-8 z-50">
          <CardNav
            logo="/logo.svg"
            logoAlt="Company Logo"
            items={navItems}
            baseColor="#fff"
            menuColor="#000"
            buttonBgColor="#3b82f6"
            buttonTextColor="#fff"
            ease="power3.out"
            theme="dark"
          />
        </div>
      )}

      <div className="container mx-auto px-4 relative z-10">
        {/* Header with True Focus */}
        <div className="text-center mb-16">
          <TrueFocus
            sentence={title}
            blurAmount={5}
            borderColor="#3b82f6"
            animationDuration={0.5}
            pauseBetweenAnimations={1}
          />
          {subtitle && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-6"
            >
              <Shuffle
                text={subtitle}
                shuffleDirection="right"
                duration={0.35}
                ease="power3.out"
                stagger={0.03}
                triggerOnce={true}
                className="text-slate-300 text-lg max-w-2xl mx-auto"
              />
            </motion.div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Main Image */}
          {image && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border-2 border-blue-500/30">
                <OptimizedImage
                  src={image}
                  alt={title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
              </div>
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
              <p className="text-slate-300 leading-relaxed text-lg mb-6">
                {content}
              </p>
            )}

            {/* Features */}
            {features.length > 0 && (
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-5 rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:border-blue-500/50 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      {feature.icon && (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-blue-500/30">
                          <OptimizedImage
                            src={feature.icon}
                            alt={feature.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold mb-1 text-slate-100">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-slate-400">
                          {feature.description}
                        </p>
                      </div>
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

# Text Animation Components
pnpm dlx shadcn@latest add @react-bits/BlurText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ScrollFloat-TS-CSS
pnpm dlx shadcn@latest add @react-bits/DecryptedText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ShinyText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/FuzzyText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/GradientText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/TrueFocus-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Shuffle-TS-CSS

# Navigation Components
pnpm dlx shadcn@latest add @react-bits/BubbleMenu-TS-CSS
pnpm dlx shadcn@latest add @react-bits/GooeyNav-TS-CSS
pnpm dlx shadcn@latest add @react-bits/FlowingMenu-TS-CSS
pnpm dlx shadcn@latest add @react-bits/InfiniteMenu-TS-CSS
pnpm dlx shadcn@latest add @react-bits/CardNav-TS-CSS

# Visual Effects Components
pnpm dlx shadcn@latest add @react-bits/MagnetLines-TS-CSS
pnpm dlx shadcn@latest add @react-bits/GradualBlur-TS-CSS
pnpm dlx shadcn@latest add @react-bits/StickerPeel-TS-CSS
pnpm dlx shadcn@latest add @react-bits/GlassIcons-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Cubes-TS-CSS

# 3D Components
pnpm dlx shadcn@latest add @react-bits/ModelViewer-TS-CSS

# Interactive Components
pnpm dlx shadcn@latest add @react-bits/ClickSpark-TS-CSS
```

---

## ADVANCED NAVIGATION SHOWCASES

### ABOUT-36 - Bubble Menu:
```tsx
// Bubble-style navigation with rotation
<BubbleMenu
  items={menuItems}
  animationEase="back.out(1.5)"
  staggerDelay={0.12}
/>
```

### ABOUT-37 - Gooey Nav:
```tsx
// Liquid gooey navigation
<GooeyNav
  items={navItems}
  particleCount={15}
  animationTime={600}
/>
```

### ABOUT-38 - Flowing Menu:
```tsx
// Horizontal flowing menu with images
<FlowingMenu
  items={menuItems}
  speed={15}
  marqueeBgColor="#3b82f6"
/>
```

### ABOUT-39 - Infinite Menu:
```tsx
// Infinite scrolling menu
<InfiniteMenu
  items={menuItems}
  scale={1}
/>
```

### ABOUT-40 - Card Nav:
```tsx
// Card-based navigation
<CardNav
  items={navItems}
  theme="dark"
  ease="power3.out"
/>
```

---

## SPECIAL EFFECTS HIGHLIGHT

### Magnet Lines:
- ✅ Magnetic connection lines
- ✅ Mouse interaction
- ✅ Dynamic connections

### Sticker Peel:
- ✅ 3D peel effect
- ✅ Shadow & lighting
- ✅ Interactive drag

### Model Viewer:
- ✅ 3D model rendering
- ✅ Mouse parallax
- ✅ Auto-rotation
- ✅ Environment presets

### Glass Icons:
- ✅ Glass morphism icons
- ✅ Colorful variants
- ✅ Interactive hover

### Cubes Background:
- ✅ 3D cube grid
- ✅ Ripple on click
- ✅ Auto-animation

---

## SUMMARY

| Component | Layout | Navigation Type | Special Effect | Theme |
|-----------|--------|-----------------|----------------|-------|
| **ABOUT-36** | Magnet Lines | BubbleMenu | MagnetLines, GradualBlur | Interactive Lines |
| **ABOUT-37** | Gooey Bottom | GooeyNav | StickerPeel | Liquid Nav |
| **ABOUT-38** | Flowing Top | FlowingMenu | ModelViewer (3D) | 3D Showcase |
| **ABOUT-39** | Infinite Scroll | InfiniteMenu | GlassIcons | Glass Morphism |
| **ABOUT-40** | Card Nav | CardNav | Cubes (3D) | Dark + Cubes |

**Features:**
- ✅ 8+ Text animation components
- ✅ 5 Navigation systems
- ✅ Magnetic line connections
- ✅ Sticker peel effect
- ✅ 3D model viewer
- ✅ Glass icon showcase
- ✅ 3D cubes background
- ✅ Gradual blur effects
- ✅ Multiple menu styles
- ✅ Dark theme variant (ABOUT-40)

---

## 🎉 BATCH 36-40 COMPLETE!

**Total Components Created**: 5 About sections  
**Navigation Types**: 5 different menu systems  
**3D Components**: ModelViewer, Cubes  
**Special Effects**: Magnet lines, Sticker peel, Glass icons  

**Highlights:**
- ABOUT-36: Bubble menu + Magnet lines 🔗
- ABOUT-37: Gooey nav + Sticker peel 🏷️
- ABOUT-38: Flowing menu + 3D Model 🎮
- ABOUT-39: Infinite menu + Glass icons 💎
- ABOUT-40: Card nav + Cubes background 🎲

**READY FOR PRODUCTION!** 🚀✨
