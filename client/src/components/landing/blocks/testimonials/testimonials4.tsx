'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { getImageSource } from '@/lib/cloudinary';
import { useState } from 'react';
import type { Testimonial } from '@/types';

interface Testimonials4Props {
  items: Testimonial[];
  title: string;
  subtitle?: string;
}

/**
 * Testimonials Block: testimonials4
 * Design: Single Focus
 *
 * One testimonial at a time, centered and prominent
 * Perfect for highlighting detailed customer stories
 */
export function Testimonials4({
  items,
  title,
  subtitle,
}: Testimonials4Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (items.length === 0) return null;

  const currentItem = items[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const { type: avatarType } = getImageSource(currentItem.avatar);

  return (
    <section id="testimonials" className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
      </div>

      {/* Single Testimonial Container */}
      <div className="max-w-3xl mx-auto">
        <div className="relative bg-card rounded-2xl p-8 md:p-12 border shadow-lg">
          <Quote className="h-16 w-16 text-primary/10 absolute top-4 left-4" />
          <Quote className="h-16 w-16 text-primary/10 absolute bottom-4 right-4 rotate-180" />

          {/* Rating */}
          {typeof currentItem.rating === 'number' && currentItem.rating > 0 && (
            <div className="flex gap-2 justify-center mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={`star-${i}`}
                  className={`h-6 w-6 ${
                    i < currentItem.rating!
                      ? 'text-yellow-500 fill-yellow-500'
                      : 'text-muted'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Testimonial Content */}
          <blockquote className="text-lg md:text-xl text-center mb-8 relative z-10 leading-relaxed">
            &quot;{currentItem.content}&quot;
          </blockquote>

          {/* Author */}
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-16 w-16 overflow-hidden">
              {avatarType !== 'none' ? (
                <OptimizedImage
                  src={currentItem.avatar}
                  alt={currentItem.name}
                  width={64}
                  height={64}
                  crop="thumb"
                  gravity="face"
                  className="object-cover w-full h-full"
                />
              ) : (
                <AvatarFallback className="text-xl">
                  {currentItem.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="text-center">
              <p className="font-semibold text-lg">{currentItem.name}</p>
              {currentItem.role && (
                <p className="text-muted-foreground">{currentItem.role}</p>
              )}
            </div>
          </div>

          {/* Navigation Arrows */}
          {items.length > 1 && (
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between px-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrev}
                className="rounded-full hover:bg-primary/10"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                className="rounded-full hover:bg-primary/10"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          )}
        </div>

        {/* Dots Indicator */}
        {items.length > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-8 bg-primary'
                    : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Counter */}
        {items.length > 1 && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            {currentIndex + 1} / {items.length}
          </p>
        )}
      </div>
    </section>
  );
}
