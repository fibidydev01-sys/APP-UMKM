# TESTIMONIALS COMPONENTS 13-17 WITH REACT BITS

5 Testimonials variants dengan advanced React Bits combinations - **NO BACKGROUND EFFECTS**, fokus pada creative text animations dan premium card interactions!

---

## TESTIMONIALS-13: Split Text with Reflective Cards

**Layout**: Card slider dengan reflective effect  
**Animation**: SplitText, ReflectiveCard, Magnet
**Style**: Premium reflective testimonials

```tsx
// Testimonials13.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { getImageSource } from '@/lib/cloudinary';
import { useState } from 'react';
import type { Testimonial } from '@/types';
import SplitText from '@/components/ui/SplitText';
import ReflectiveCard from '@/components/ui/ReflectiveCard';
import Magnet from '@/components/ui/Magnet';

/**
 * Testimonials13 Props - Mapped from Data Contract
 *
 * @prop title - testimonialsTitle: Section heading
 * @prop subtitle - testimonialsSubtitle: Section subheading
 * @prop items - testimonials: Array<{name, role, content, avatar?, rating?}>
 */
interface Testimonials13Props {
  items: Testimonial[];
  title: string;
  subtitle?: string;
}

/**
 * Testimonials Block: testimonials13
 * Design: Split Text with Reflective Cards
 */
export function Testimonials13({
  items,
  title,
  subtitle,
}: Testimonials13Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (items.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const visibleItems = [
    items[currentIndex],
    items[(currentIndex + 1) % items.length],
    items[(currentIndex + 2) % items.length],
  ];

  return (
    <section id="testimonials" className="py-20 my-8">
      <div className="container mx-auto px-4">
        {/* Header with Split Text */}
        <div className="text-center mb-16">
          <SplitText
            text={title}
            className="text-4xl md:text-5xl font-extrabold mb-4"
            delay={50}
            duration={1.25}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            textAlign="center"
          />
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
          )}
        </div>

        {/* Slider Container */}
        <div className="relative max-w-7xl mx-auto">
          {/* Navigation Buttons with Magnet */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-10 px-2">
            <Magnet padding={40} magnetStrength={50}>
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrev}
                className="pointer-events-auto rounded-full shadow-lg w-12 h-12"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Magnet>
            <Magnet padding={40} magnetStrength={50}>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                className="pointer-events-auto rounded-full shadow-lg w-12 h-12"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </Magnet>
          </div>

          {/* Reflective Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-16">
            {visibleItems.map((item, index) => {
              const key = item.id || `testimonial-${currentIndex + index}`;
              const { type: avatarType } = getImageSource(item.avatar);

              return (
                <ReflectiveCard
                  key={key}
                  intensity={0.15}
                  shimmer
                  className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                    index === 0 ? 'md:opacity-100' : 'hidden md:block md:opacity-70'
                  }`}
                >
                  <Card className="border-0 bg-card/80 backdrop-blur-sm">
                    <CardContent className="pt-8 pb-6 px-6">
                      <Quote className="h-10 w-10 text-primary/20 absolute top-6 right-6" />

                      {typeof item.rating === 'number' && item.rating > 0 && (
                        <div className="flex gap-1 mb-6">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={`${key}-star-${i}`}
                              className={`h-5 w-5 ${
                                i < item.rating!
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-muted'
                              }`}
                            />
                          ))}
                        </div>
                      )}

                      <p className="text-muted-foreground mb-6 italic leading-relaxed">
                        &quot;{item.content}&quot;
                      </p>

                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 overflow-hidden border-2 border-primary/20">
                          {avatarType !== 'none' ? (
                            <OptimizedImage
                              src={item.avatar}
                              alt={item.name}
                              width={48}
                              height={48}
                              crop="thumb"
                              gravity="face"
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                              {item.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-bold text-base">{item.name}</p>
                          {item.role && (
                            <p className="text-sm text-muted-foreground">{item.role}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </ReflectiveCard>
              );
            })}
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-10">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-10 bg-primary'
                    : 'w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

## TESTIMONIALS-14: Blur Text with Tilted Cards

**Layout**: 3D tilted card slider  
**Animation**: BlurText, TiltedCard, ClickSpark
**Style**: 3D perspective cards

```tsx
// Testimonials14.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { getImageSource } from '@/lib/cloudinary';
import { useState } from 'react';
import type { Testimonial } from '@/types';
import BlurText from '@/components/ui/BlurText';
import TiltedCard from '@/components/ui/TiltedCard';
import ClickSpark from '@/components/ui/ClickSpark';

/**
 * Testimonials14 Props
 */
interface Testimonials14Props {
  items: Testimonial[];
  title: string;
  subtitle?: string;
}

/**
 * Testimonials Block: testimonials14
 * Design: Blur Text with Tilted Cards
 */
export function Testimonials14({
  items,
  title,
  subtitle,
}: Testimonials14Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (items.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const visibleItems = [
    items[currentIndex],
    items[(currentIndex + 1) % items.length],
    items[(currentIndex + 2) % items.length],
  ];

  return (
    <section id="testimonials" className="py-20 my-8">
      <div className="container mx-auto px-4">
        {/* Header with Blur Text */}
        <div className="text-center mb-16">
          <BlurText
            text={title}
            delay={200}
            animateBy="words"
            direction="top"
            className="text-4xl md:text-5xl font-extrabold mb-4"
          />
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
          )}
        </div>

        {/* Slider Container */}
        <div className="relative max-w-7xl mx-auto">
          {/* Navigation Buttons with Click Spark */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-10 px-2">
            <ClickSpark
              sparkColor="hsl(var(--primary))"
              sparkSize={12}
              sparkRadius={20}
              sparkCount={8}
              duration={400}
            >
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrev}
                className="pointer-events-auto rounded-full shadow-lg w-12 h-12"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </ClickSpark>
            <ClickSpark
              sparkColor="hsl(var(--primary))"
              sparkSize={12}
              sparkRadius={20}
              sparkCount={8}
              duration={400}
            >
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                className="pointer-events-auto rounded-full shadow-lg w-12 h-12"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </ClickSpark>
          </div>

          {/* Tilted Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-16">
            {visibleItems.map((item, index) => {
              const key = item.id || `testimonial-${currentIndex + index}`;
              const { type: avatarType } = getImageSource(item.avatar);

              return (
                <TiltedCard
                  key={key}
                  maxTilt={8}
                  perspective={1200}
                  scale={1.02}
                  className={`rounded-2xl transition-all duration-300 ${
                    index === 0 ? 'md:opacity-100' : 'hidden md:block md:opacity-70'
                  }`}
                >
                  <Card className="border-2 border-border">
                    <CardContent className="pt-8 pb-6 px-6">
                      <Quote className="h-10 w-10 text-primary/20 absolute top-6 right-6" />

                      {typeof item.rating === 'number' && item.rating > 0 && (
                        <div className="flex gap-1 mb-6">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={`${key}-star-${i}`}
                              className={`h-5 w-5 ${
                                i < item.rating!
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-muted'
                              }`}
                            />
                          ))}
                        </div>
                      )}

                      <p className="text-muted-foreground mb-6 italic leading-relaxed">
                        &quot;{item.content}&quot;
                      </p>

                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 overflow-hidden">
                          {avatarType !== 'none' ? (
                            <OptimizedImage
                              src={item.avatar}
                              alt={item.name}
                              width={48}
                              height={48}
                              crop="thumb"
                              gravity="face"
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                              {item.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-bold text-base">{item.name}</p>
                          {item.role && (
                            <p className="text-sm text-muted-foreground">{item.role}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TiltedCard>
              );
            })}
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-10">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-10 bg-primary'
                    : 'w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

## TESTIMONIALS-15: Shiny Text with Spotlight Cards

**Layout**: Spotlight hover cards  
**Animation**: ShinyText, SpotlightCard, ScrollReveal
**Style**: Premium spotlight effect

```tsx
// Testimonials15.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { getImageSource } from '@/lib/cloudinary';
import { useState } from 'react';
import type { Testimonial } from '@/types';
import ShinyText from '@/components/ui/ShinyText';
import SpotlightCard from '@/components/ui/SpotlightCard';
import ScrollReveal from '@/components/ui/ScrollReveal';

/**
 * Testimonials15 Props
 */
interface Testimonials15Props {
  items: Testimonial[];
  title: string;
  subtitle?: string;
}

/**
 * Testimonials Block: testimonials15
 * Design: Shiny Text with Spotlight Cards
 */
export function Testimonials15({
  items,
  title,
  subtitle,
}: Testimonials15Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (items.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const visibleItems = [
    items[currentIndex],
    items[(currentIndex + 1) % items.length],
    items[(currentIndex + 2) % items.length],
  ];

  return (
    <section id="testimonials" className="py-20 my-8">
      <div className="container mx-auto px-4">
        {/* Header with Shiny Text */}
        <div className="text-center mb-16">
          <ShinyText
            text={title}
            speed={2.5}
            color="hsl(var(--foreground))"
            shineColor="hsl(var(--primary))"
            spread={150}
            direction="left"
            className="text-4xl md:text-5xl font-extrabold mb-4 block"
          />
          {subtitle && (
            <ScrollReveal
              baseOpacity={0.3}
              enableBlur
              baseRotation={2}
              blurStrength={3}
            >
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
            </ScrollReveal>
          )}
        </div>

        {/* Slider Container */}
        <div className="relative max-w-7xl mx-auto">
          {/* Navigation Buttons */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-10 px-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              className="pointer-events-auto rounded-full shadow-lg w-12 h-12"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="pointer-events-auto rounded-full shadow-lg w-12 h-12"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Spotlight Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-16">
            {visibleItems.map((item, index) => {
              const key = item.id || `testimonial-${currentIndex + index}`;
              const { type: avatarType } = getImageSource(item.avatar);

              return (
                <SpotlightCard
                  key={key}
                  spotlightColor="hsl(var(--primary) / 0.2)"
                  spotlightSize={200}
                  className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                    index === 0 ? 'md:opacity-100' : 'hidden md:block md:opacity-70'
                  }`}
                >
                  <Card className="border-2 border-border bg-card">
                    <CardContent className="pt-8 pb-6 px-6">
                      <Quote className="h-10 w-10 text-primary/20 absolute top-6 right-6" />

                      {typeof item.rating === 'number' && item.rating > 0 && (
                        <div className="flex gap-1 mb-6">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={`${key}-star-${i}`}
                              className={`h-5 w-5 ${
                                i < item.rating!
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-muted'
                              }`}
                            />
                          ))}
                        </div>
                      )}

                      <p className="text-muted-foreground mb-6 italic leading-relaxed">
                        &quot;{item.content}&quot;
                      </p>

                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 overflow-hidden">
                          {avatarType !== 'none' ? (
                            <OptimizedImage
                              src={item.avatar}
                              alt={item.name}
                              width={48}
                              height={48}
                              crop="thumb"
                              gravity="face"
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                              {item.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-bold text-base">{item.name}</p>
                          {item.role && (
                            <p className="text-sm text-muted-foreground">{item.role}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </SpotlightCard>
              );
            })}
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-10">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-10 bg-primary'
                    : 'w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

## TESTIMONIALS-16: Gradient Text with Pixel Cards

**Layout**: Pixelated card effects  
**Animation**: GradientText, PixelCard, DecryptedText
**Style**: Digital pixel aesthetic

```tsx
// Testimonials16.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { getImageSource } from '@/lib/cloudinary';
import { useState } from 'react';
import type { Testimonial } from '@/types';
import GradientText from '@/components/ui/GradientText';
import PixelCard from '@/components/ui/PixelCard';
import DecryptedText from '@/components/ui/DecryptedText';

/**
 * Testimonials16 Props
 */
interface Testimonials16Props {
  items: Testimonial[];
  title: string;
  subtitle?: string;
}

/**
 * Testimonials Block: testimonials16
 * Design: Gradient Text with Pixel Cards
 */
export function Testimonials16({
  items,
  title,
  subtitle,
}: Testimonials16Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (items.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const visibleItems = [
    items[currentIndex],
    items[(currentIndex + 1) % items.length],
    items[(currentIndex + 2) % items.length],
  ];

  return (
    <section id="testimonials" className="py-20 my-8">
      <div className="container mx-auto px-4">
        {/* Header with Gradient Text */}
        <div className="text-center mb-16">
          <GradientText
            colors={[
              "hsl(var(--primary))",
              "hsl(var(--primary) / 0.6)",
              "hsl(var(--primary))"
            ]}
            animationSpeed={8}
            showBorder={false}
            className="text-4xl md:text-5xl font-extrabold mb-4 block"
          >
            {title}
          </GradientText>
          {subtitle && (
            <DecryptedText
              text={subtitle}
              speed={60}
              maxIterations={8}
              animateOn="view"
              className="text-lg text-muted-foreground max-w-2xl mx-auto block"
            />
          )}
        </div>

        {/* Slider Container */}
        <div className="relative max-w-7xl mx-auto">
          {/* Navigation Buttons */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-10 px-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              className="pointer-events-auto rounded-full shadow-lg w-12 h-12"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="pointer-events-auto rounded-full shadow-lg w-12 h-12"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Pixel Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-16">
            {visibleItems.map((item, index) => {
              const key = item.id || `testimonial-${currentIndex + index}`;
              const { type: avatarType } = getImageSource(item.avatar);

              return (
                <PixelCard
                  key={key}
                  pixelSize={4}
                  hoverEffect="pixelate"
                  className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                    index === 0 ? 'md:opacity-100' : 'hidden md:block md:opacity-70'
                  }`}
                >
                  <Card className="border-2 border-border bg-card">
                    <CardContent className="pt-8 pb-6 px-6">
                      <Quote className="h-10 w-10 text-primary/20 absolute top-6 right-6" />

                      {typeof item.rating === 'number' && item.rating > 0 && (
                        <div className="flex gap-1 mb-6">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={`${key}-star-${i}`}
                              className={`h-5 w-5 ${
                                i < item.rating!
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-muted'
                              }`}
                            />
                          ))}
                        </div>
                      )}

                      <p className="text-muted-foreground mb-6 italic leading-relaxed">
                        &quot;{item.content}&quot;
                      </p>

                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 overflow-hidden">
                          {avatarType !== 'none' ? (
                            <OptimizedImage
                              src={item.avatar}
                              alt={item.name}
                              width={48}
                              height={48}
                              crop="thumb"
                              gravity="face"
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                              {item.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-bold text-base">{item.name}</p>
                          {item.role && (
                            <p className="text-sm text-muted-foreground">{item.role}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </PixelCard>
              );
            })}
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-10">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-10 bg-primary'
                    : 'w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

## TESTIMONIALS-17: True Focus with Decay Cards

**Layout**: Decay animation cards  
**Animation**: TrueFocus, DecayCard, Shuffle
**Style**: Digital decay aesthetic

```tsx
// Testimonials17.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { getImageSource } from '@/lib/cloudinary';
import { useState } from 'react';
import type { Testimonial } from '@/types';
import TrueFocus from '@/components/ui/TrueFocus';
import DecayCard from '@/components/ui/DecayCard';
import Shuffle from '@/components/ui/Shuffle';

/**
 * Testimonials17 Props
 */
interface Testimonials17Props {
  items: Testimonial[];
  title: string;
  subtitle?: string;
}

/**
 * Testimonials Block: testimonials17
 * Design: True Focus with Decay Cards
 */
export function Testimonials17({
  items,
  title,
  subtitle,
}: Testimonials17Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (items.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const visibleItems = [
    items[currentIndex],
    items[(currentIndex + 1) % items.length],
    items[(currentIndex + 2) % items.length],
  ];

  return (
    <section id="testimonials" className="py-20 my-8">
      <div className="container mx-auto px-4">
        {/* Header with True Focus */}
        <div className="text-center mb-16">
          <TrueFocus
            sentence={title}
            manualMode={false}
            blurAmount={5}
            borderColor="hsl(var(--primary))"
            animationDuration={0.5}
            pauseBetweenAnimations={1.5}
            className="text-4xl md:text-5xl font-extrabold mb-6"
          />
          {subtitle && (
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
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            />
          )}
        </div>

        {/* Slider Container */}
        <div className="relative max-w-7xl mx-auto">
          {/* Navigation Buttons */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-10 px-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              className="pointer-events-auto rounded-full shadow-lg w-12 h-12"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="pointer-events-auto rounded-full shadow-lg w-12 h-12"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Decay Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-16">
            {visibleItems.map((item, index) => {
              const key = item.id || `testimonial-${currentIndex + index}`;
              const { type: avatarType } = getImageSource(item.avatar);

              return (
                <DecayCard
                  key={key}
                  particleCount={30}
                  decaySpeed={0.5}
                  className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                    index === 0 ? 'md:opacity-100' : 'hidden md:block md:opacity-70'
                  }`}
                >
                  <Card className="border-2 border-border bg-card">
                    <CardContent className="pt-8 pb-6 px-6">
                      <Quote className="h-10 w-10 text-primary/20 absolute top-6 right-6" />

                      {typeof item.rating === 'number' && item.rating > 0 && (
                        <div className="flex gap-1 mb-6">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={`${key}-star-${i}`}
                              className={`h-5 w-5 ${
                                i < item.rating!
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-muted'
                              }`}
                            />
                          ))}
                        </div>
                      )}

                      <p className="text-muted-foreground mb-6 italic leading-relaxed">
                        &quot;{item.content}&quot;
                      </p>

                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 overflow-hidden">
                          {avatarType !== 'none' ? (
                            <OptimizedImage
                              src={item.avatar}
                              alt={item.name}
                              width={48}
                              height={48}
                              crop="thumb"
                              gravity="face"
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                              {item.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-bold text-base">{item.name}</p>
                          {item.role && (
                            <p className="text-sm text-muted-foreground">{item.role}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </DecayCard>
              );
            })}
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-10">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-10 bg-primary'
                    : 'w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

## DEPENDENCIES & INSTALLATION

```bash
# Text Animation
pnpm dlx shadcn@latest add @react-bits/SplitText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/BlurText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ShinyText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/GradientText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/DecryptedText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/TrueFocus-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Shuffle-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ScrollReveal-TS-CSS

# Card Components
pnpm dlx shadcn@latest add @react-bits/ReflectiveCard-TS-CSS
pnpm dlx shadcn@latest add @react-bits/TiltedCard-TS-CSS
pnpm dlx shadcn@latest add @react-bits/SpotlightCard-TS-CSS
pnpm dlx shadcn@latest add @react-bits/PixelCard-TS-CSS
pnpm dlx shadcn@latest add @react-bits/DecayCard-TS-CSS

# Interactive
pnpm dlx shadcn@latest add @react-bits/Magnet-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ClickSpark-TS-CSS
```

---

## SUMMARY TABLE

| Component | Primary Animation | Card Effect | Interactive | Best For |
|-----------|------------------|-------------|-------------|----------|
| **TESTIMONIALS-13** | SplitText | ReflectiveCard | Magnet | Premium Reflective |
| **TESTIMONIALS-14** | BlurText | TiltedCard | ClickSpark | 3D Perspective |
| **TESTIMONIALS-15** | ShinyText | SpotlightCard | ScrollReveal | Spotlight Hover |
| **TESTIMONIALS-16** | GradientText | PixelCard | DecryptedText | Digital Pixel |
| **TESTIMONIALS-17** | TrueFocus | DecayCard | Shuffle | Decay Effect |

**READY FOR PRODUCTION!** 🚀✨
