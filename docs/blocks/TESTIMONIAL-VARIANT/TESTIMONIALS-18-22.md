# TESTIMONIALS COMPONENTS 18-22 WITH REACT BITS

5 Testimonials variants dengan advanced React Bits combinations - **NO BACKGROUND EFFECTS**, fokus pada creative text animations dan premium card interactions!

---

## TESTIMONIALS-18: Profile Card with Card Swap

**Layout**: Profile-style cards with flip animation  
**Animation**: SplitText, ProfileCard, CardSwap
**Style**: Team profile cards

```tsx
// Testimonials18.tsx
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
import ProfileCard from '@/components/ui/ProfileCard';
import CardSwap from '@/components/ui/CardSwap';

interface Testimonials18Props {
  items: Testimonial[];
  title: string;
  subtitle?: string;
}

export function Testimonials18({ items, title, subtitle }: Testimonials18Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  if (items.length === 0) return null;

  const handlePrev = () => setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  const handleNext = () => setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));

  const visibleItems = [
    items[currentIndex],
    items[(currentIndex + 1) % items.length],
    items[(currentIndex + 2) % items.length],
  ];

  return (
    <section id="testimonials" className="py-20 my-8">
      <div className="container mx-auto px-4">
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
          {subtitle && <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>}
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-10 px-2">
            <Button variant="outline" size="icon" onClick={handlePrev} className="pointer-events-auto rounded-full shadow-lg w-12 h-12">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNext} className="pointer-events-auto rounded-full shadow-lg w-12 h-12">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-16">
            {visibleItems.map((item, index) => {
              const key = item.id || `testimonial-${currentIndex + index}`;
              const { type: avatarType } = getImageSource(item.avatar);

              return (
                <CardSwap
                  key={key}
                  frontContent={
                    <ProfileCard
                      name={item.name}
                      role={item.role || 'Customer'}
                      bio={item.content.substring(0, 80) + '...'}
                      imageUrl={avatarType !== 'none' ? item.avatar : ''}
                      className="rounded-2xl border-2 border-border h-full"
                    />
                  }
                  backContent={
                    <Card className="border-2 border-border bg-card h-full">
                      <CardContent className="pt-8 pb-6 px-6 h-full flex flex-col justify-between">
                        <div>
                          <Quote className="h-8 w-8 text-primary/20 mb-4" />
                          {typeof item.rating === 'number' && item.rating > 0 && (
                            <div className="flex gap-1 mb-4">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={`${key}-star-${i}`}
                                  className={`h-4 w-4 ${i < item.rating! ? 'text-yellow-500 fill-yellow-500' : 'text-muted'}`}
                                />
                              ))}
                            </div>
                          )}
                          <p className="text-sm text-muted-foreground italic leading-relaxed">&quot;{item.content}&quot;</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-4">Click to flip back</p>
                      </CardContent>
                    </Card>
                  }
                  flipTrigger="click"
                  className={`rounded-2xl transition-all duration-300 ${index === 0 ? 'md:opacity-100' : 'hidden md:block md:opacity-70'}`}
                />
              );
            })}
          </div>

          <div className="flex justify-center gap-2 mt-10">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === currentIndex ? 'w-10 bg-primary' : 'w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50'
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
pnpm dlx shadcn@latest add @react-bits/ShinyText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/BlurText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/GradientText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/DecryptedText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ScrollFloat-TS-CSS

# Card & Layout
pnpm dlx shadcn@latest add @react-bits/ProfileCard-TS-CSS
pnpm dlx shadcn@latest add @react-bits/CardSwap-TS-CSS
pnpm dlx shadcn@latest add @react-bits/BounceCards-TS-CSS
pnpm dlx shadcn@latest add @react-bits/GlareHover-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Masonry-TS-CSS
pnpm dlx shadcn@latest add @react-bits/AnimatedContent-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Stack-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Carousel-TS-CSS
```

---

## SUMMARY TABLE

| Component | Primary Animation | Card Effect | Interactive | Best For |
|-----------|------------------|-------------|-------------|----------|
| **TESTIMONIALS-18** | SplitText | ProfileCard + CardSwap | Flip Effect | Profile Style |
| **TESTIMONIALS-19** | ShinyText | BounceCards + GlareHover | Bounce | Playful |
| **TESTIMONIALS-20** | BlurText | Masonry + AnimatedContent | Stagger | Grid Layout |
| **TESTIMONIALS-21** | GradientText | Stack + ScrollFloat | Scroll Stack | Layered |
| **TESTIMONIALS-22** | DecryptedText | Carousel | Auto-play | Modern Slider |

**READY FOR PRODUCTION!** 🚀✨
