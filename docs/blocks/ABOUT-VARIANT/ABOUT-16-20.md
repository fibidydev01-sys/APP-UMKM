# ABOUT COMPONENTS 16-20 WITH REACT BITS

5 About section variants dengan React Bits integration (Component & Text
Animations ONLY), clean backgrounds dari global.css, responsive layouts, dan
modern design.

---

## ABOUT-16: Split Text Elegance with Animated List

**Layout**: Split text header dengan animated scrolling list  
**Background**: Gradient pink-white dari global.css  
**Animation**: SplitText, BlurText, AnimatedList, Magnet

```tsx
// About16.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import SplitText from '@/components/ui/SplitText';
import BlurText from '@/components/ui/BlurText';
import AnimatedList from '@/components/ui/AnimatedList';
import Magnet from '@/components/ui/Magnet';

interface About16Props {
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

export function About16({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About16Props) {
  const listItems = features.map((f) => `${f.title}: ${f.description}`);

  return (
    <section
      id="about"
      className="relative py-20 overflow-hidden bg-gradient-to-br from-pink-50 via-white to-pink-100/50"
    >
      <div className="container mx-auto px-4 relative z-10">
        {/* Header with Split Text */}
        <div className="text-center mb-16">
          <SplitText
            text={title}
            className="text-4xl md:text-5xl font-black mb-4"
            delay={50}
            duration={1.25}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
          />
          {subtitle && (
            <BlurText
              text={subtitle}
              delay={200}
              animateBy="words"
              direction="top"
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
            />
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Main Image with Magnet Effect */}
          {image && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Magnet padding={50} magnetStrength={50}>
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <OptimizedImage
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
                </div>
              </Magnet>
            </motion.div>
          )}

          {/* Animated List */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {content && (
              <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                {content}
              </p>
            )}

            {listItems.length > 0 && (
              <div className="h-[400px] rounded-2xl bg-white/80 backdrop-blur-sm border border-pink-200 p-4">
                <AnimatedList
                  items={listItems}
                  onItemSelect={(item, index) => console.log(item, index)}
                  showGradients
                  enableArrowNavigation
                  displayScrollbar
                />
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

## ABOUT-17: Carousel Showcase with Shiny Text

**Layout**: Image carousel dengan shiny text effects  
**Background**: Subtle pink gradient  
**Animation**: ShinyText, Carousel, DecryptedText, GradientText

```tsx
// About17.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import ShinyText from '@/components/ui/ShinyText';
import Carousel from '@/components/ui/Carousel';
import DecryptedText from '@/components/ui/DecryptedText';
import GradientText from '@/components/ui/GradientText';

interface About17Props {
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

export function About17({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About17Props) {
  return (
    <section
      id="about"
      className="relative py-20 overflow-hidden bg-gradient-to-b from-white via-pink-50/30 to-white"
    >
      <div className="container mx-auto px-4 relative z-10">
        {/* Header with Shiny Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <ShinyText
            text={title}
            speed={2}
            color="#1a1a1a"
            shineColor="#ec4899"
            spread={120}
            direction="left"
            className="text-4xl md:text-5xl font-black mb-4"
          />
          {subtitle && (
            <DecryptedText
              text={subtitle}
              animateOn="view"
              speed={60}
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
            />
          )}
        </motion.div>

        {/* Content with Gradient Text */}
        {content && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto mb-12 text-center"
          >
            <GradientText
              colors={['#ec4899', '#f472b6', '#ec4899']}
              animationSpeed={8}
              showBorder={false}
              className="text-xl font-semibold mb-4"
            >
              {content}
            </GradientText>
          </motion.div>
        )}

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="h-[500px] mb-12"
        >
          <Carousel
            baseWidth={300}
            autoplay={true}
            autoplayDelay={3000}
            pauseOnHover={true}
            loop={true}
            round={false}
          />
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
                className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-pink-200 text-center hover:shadow-xl hover:border-primary/50 transition-all"
              >
                {feature.icon && (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden mx-auto mb-4 border-2 border-pink-100">
                    <OptimizedImage
                      src={feature.icon}
                      alt={feature.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <h3 className="font-bold mb-2 text-lg">{feature.title}</h3>
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

## ABOUT-18: Masonry Gallery with Scroll Reveal

**Layout**: Masonry grid layout dengan scroll reveal effects  
**Background**: Clean white dengan pink accents  
**Animation**: ScrollReveal, Masonry, TrueFocus, Shuffle

```tsx
// About18.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import ScrollReveal from '@/components/ui/ScrollReveal';
import Masonry from '@/components/ui/Masonry';
import TrueFocus from '@/components/ui/TrueFocus';
import Shuffle from '@/components/ui/Shuffle';

interface About18Props {
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

export function About18({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About18Props) {
  return (
    <section
      id="about"
      className="relative py-20 overflow-hidden bg-background"
    >
      {/* Subtle Pink Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header with True Focus */}
        <div className="text-center mb-16">
          <TrueFocus
            sentence={title}
            blurAmount={5}
            borderColor="#ec4899"
            animationDuration={0.5}
            pauseBetweenAnimations={1}
          />
          {subtitle && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-4"
            >
              <Shuffle
                text={subtitle}
                shuffleDirection="right"
                duration={0.35}
                animationMode="evenodd"
                shuffleTimes={1}
                ease="power3.out"
                stagger={0.03}
                threshold={0.1}
                triggerOnce={true}
                className="text-muted-foreground text-lg max-w-2xl mx-auto"
              />
            </motion.div>
          )}
        </div>

        {/* Content with Scroll Reveal */}
        {content && (
          <div className="max-w-3xl mx-auto mb-12">
            <ScrollReveal
              baseOpacity={0.1}
              enableBlur
              baseRotation={3}
              blurStrength={4}
            >
              <p className="text-muted-foreground leading-relaxed text-lg text-center">
                {content}
              </p>
            </ScrollReveal>
          </div>
        )}

        {/* Masonry Grid */}
        {features.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <Masonry
              items={features.map((feature, index) => ({
                id: index,
                content: (
                  <div className="p-6 rounded-2xl bg-white border border-pink-100 hover:shadow-lg hover:border-primary/50 transition-all h-full">
                    {feature.icon && (
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden mb-4">
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
                ),
              }))}
              columns={3}
              gap={16}
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}
```

---

## ABOUT-19: Circular Gallery with Text Type

**Layout**: Circular gallery showcase dengan typing text  
**Background**: Pink gradient overlay  
**Animation**: TextType, CircularGallery, FuzzyText, CircularText

```tsx
// About19.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import TextType from '@/components/ui/TextType';
import CircularGallery from '@/components/ui/CircularGallery';
import FuzzyText from '@/components/ui/FuzzyText';
import CircularText from '@/components/ui/CircularText';

interface About19Props {
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

export function About19({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About19Props) {
  return (
    <section
      id="about"
      className="relative py-20 overflow-hidden bg-gradient-to-tr from-pink-50/50 via-white to-pink-100/30"
    >
      <div className="container mx-auto px-4 relative z-10">
        {/* Header with Fuzzy Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 relative"
        >
          {/* Circular Text Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 opacity-20 pointer-events-none">
            <CircularText
              text="✦ ABOUT US ✦ OUR STORY ✦ "
              onHover="speedUp"
              spinDuration={20}
            />
          </div>

          <FuzzyText baseIntensity={0.2} hoverIntensity={0.5} enableHover>
            <h2 className="text-4xl md:text-5xl font-black mb-4 relative z-10">
              {title}
            </h2>
          </FuzzyText>

          {subtitle && (
            <div className="mt-6">
              <TextType
                texts={[subtitle]}
                typingSpeed={75}
                pauseDuration={1500}
                showCursor
                cursorCharacter="_"
                deletingSpeed={50}
                className="text-muted-foreground text-lg max-w-2xl mx-auto"
              />
            </div>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Circular Gallery */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="h-[500px]"
          >
            <CircularGallery
              images={[
                image || 'https://picsum.photos/600/600?random=1',
                'https://picsum.photos/600/600?random=2',
                'https://picsum.photos/600/600?random=3',
                'https://picsum.photos/600/600?random=4',
              ]}
              radius={200}
              itemSize={120}
              autoRotate
              rotationSpeed={0.5}
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
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-pink-100 hover:shadow-md transition-all"
                  >
                    {feature.icon && (
                      <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-pink-200">
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

## ABOUT-20: Magic Bento Layout with Scroll Float

**Layout**: Bento grid layout dengan scroll float effects  
**Background**: Clean white dengan subtle pink accents  
**Animation**: ScrollFloat, MagicBento, GradientText, ClickSpark

```tsx
// About20.tsx
'use client';

import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import ScrollFloat from '@/components/ui/ScrollFloat';
import MagicBento from '@/components/ui/MagicBento';
import GradientText from '@/components/ui/GradientText';
import ClickSpark from '@/components/ui/ClickSpark';

interface About20Props {
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

export function About20({
  title,
  subtitle,
  content,
  image,
  features = [],
}: About20Props) {
  return (
    <section
      id="about"
      className="relative py-20 overflow-hidden bg-background"
    >
      {/* Subtle Pink Radial Gradients */}
      <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-accent/20 rounded-full blur-3xl opacity-50" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header with Scroll Float */}
        <div className="text-center mb-16">
          <ScrollFloat
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="center bottom+=50%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.03}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">{title}</h2>
          </ScrollFloat>

          {subtitle && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <GradientText
                colors={['#ec4899', '#f472b6', '#fbcfe8', '#ec4899']}
                animationSpeed={6}
                showBorder={false}
                className="text-lg max-w-2xl mx-auto"
              >
                {subtitle}
              </GradientText>
            </motion.div>
          )}
        </div>

        {/* Content */}
        {content && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto mb-12 text-center"
          >
            <ClickSpark
              sparkColor="#ec4899"
              sparkSize={10}
              sparkRadius={15}
              sparkCount={8}
              duration={400}
            >
              <p className="text-muted-foreground leading-relaxed text-lg p-8 rounded-2xl bg-white/60 backdrop-blur-sm border border-pink-100">
                {content}
              </p>
            </ClickSpark>
          </motion.div>
        )}

        {/* Main Image */}
        {image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mb-12"
          >
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <OptimizedImage
                src={image}
                alt={title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
            </div>
          </motion.div>
        )}

        {/* Magic Bento Grid */}
        {features.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <MagicBento
              items={features.map((feature, index) => ({
                id: index,
                size:
                  index === 0 ? 'large' : index % 3 === 0 ? 'medium' : 'small',
                content: (
                  <div className="p-6 h-full flex flex-col justify-between bg-gradient-to-br from-white to-pink-50/50 rounded-2xl border border-pink-100 hover:shadow-xl hover:border-primary/50 transition-all">
                    {feature.icon && (
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden mb-4 border-2 border-pink-100">
                        <OptimizedImage
                          src={feature.icon}
                          alt={feature.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold mb-2 text-xl">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ),
              }))}
              gap={16}
              columns={3}
            />
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

# Text Animation Components
pnpm dlx shadcn@latest add @react-bits/SplitText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/BlurText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ShinyText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/DecryptedText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/GradientText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ScrollReveal-TS-CSS
pnpm dlx shadcn@latest add @react-bits/TrueFocus-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Shuffle-TS-CSS
pnpm dlx shadcn@latest add @react-bits/TextType-TS-CSS
pnpm dlx shadcn@latest add @react-bits/FuzzyText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/CircularText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ScrollFloat-TS-CSS

# Layout & Display Components
pnpm dlx shadcn@latest add @react-bits/AnimatedList-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Carousel-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Masonry-TS-CSS
pnpm dlx shadcn@latest add @react-bits/CircularGallery-TS-CSS
pnpm dlx shadcn@latest add @react-bits/MagicBento-TS-CSS

# Interactive Components
pnpm dlx shadcn@latest add @react-bits/Magnet-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ClickSpark-TS-CSS
```

---

## BACKGROUND STYLES FROM GLOBAL.CSS

Semua komponen menggunakan warna dan gradient dari `global.css`:

### Light Mode Colors:

```css
--background: oklch(1 0 0); /* Pure White */
--primary: oklch(0.656 0.241 354.308); /* Pink 500 */
--muted: oklch(0.971 0.014 343.198); /* Pink 50 */
--accent: oklch(0.948 0.028 342.258); /* Pink 100 */
```

### Gradient Patterns Used:

- `bg-gradient-to-br from-pink-50 via-white to-pink-100/50`
- `bg-gradient-to-b from-white via-pink-50/30 to-white`
- `bg-gradient-to-tr from-pink-50/50 via-white to-pink-100/30`
- `bg-background` with radial pink glows

### Subtle Glow Effects:

```tsx
<div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
<div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
```

---

## SUMMARY

| Component    | Layout           | Text Animation            | UI Component         | Theme          |
| ------------ | ---------------- | ------------------------- | -------------------- | -------------- |
| **ABOUT-16** | Split + List     | SplitText, BlurText       | AnimatedList, Magnet | Elegant Pink   |
| **ABOUT-17** | Carousel         | ShinyText, DecryptedText  | Carousel             | Shiny Showcase |
| **ABOUT-18** | Masonry Grid     | ScrollReveal, TrueFocus   | Masonry              | Clean White    |
| **ABOUT-19** | Circular Gallery | TextType, FuzzyText       | CircularGallery      | Dynamic Type   |
| **ABOUT-20** | Bento Grid       | ScrollFloat, GradientText | MagicBento           | Modern Bento   |

**Features:**

- ✅ 12+ Text animation components
- ✅ 5+ Layout & UI components
- ✅ NO background effects (Galaxy, Aurora, Particles, etc.)
- ✅ Clean backgrounds from global.css
- ✅ Pink gradient themes
- ✅ Interactive elements (Magnet, ClickSpark)
- ✅ Responsive layouts
- ✅ TypeScript ready
- ✅ Production optimized

---

## 🎉 BATCH 16-20 COMPLETE!

**Total Components Created**: 5 About sections  
**Text Animations Used**: 12 components  
**Layout Components Used**: 5 components  
**Background Strategy**: Clean gradients from global.css (NO React Bits
backgrounds)

**Next Steps:**

- Ready untuk batch berikutnya (21-25)
- Atau siap untuk implementasi
- Atau butuh modifikasi/customize

**SIAP DIGUNAKAN!** 🚀✨
