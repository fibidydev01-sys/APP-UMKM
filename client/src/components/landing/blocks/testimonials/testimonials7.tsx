'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import { getImageSource } from '@/lib/cloudinary';
import type { Testimonial } from '@/types';

interface Testimonials7Props {
  items: Testimonial[];
  title: string;
  subtitle?: string;
}

/**
 * Testimonials Block: testimonials7
 * Design: Marquee
 *
 * Infinite scrolling testimonials with smooth marquee animation
 * Modern and dynamic presentation
 * Inspired by Stripe and Linear design
 */
export function Testimonials7({
  items,
  title,
  subtitle,
}: Testimonials7Props) {
  // Duplicate items for seamless infinite scroll
  const duplicatedItems = [...items, ...items, ...items];

  if (!items || items.length === 0) {
    return (
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
            {subtitle && (
              <p className="text-muted-foreground mb-8">{subtitle}</p>
            )}
            <p className="text-muted-foreground">No testimonials yet.</p>
          </div>
        </div>
      </section>
    );
  }

  const renderTestimonialCard = (item: Testimonial, index: number) => {
    const { type: avatarType, src: avatarUrl } = getImageSource(item.avatar);

    return (
      <div
        key={`${item.id}-${index}`}
        className="flex-shrink-0 w-[350px] md:w-[400px] mx-4"
      >
        <div className="h-full bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all hover:shadow-lg">
          {/* Stars */}
          {item.rating && (
            <div className="flex gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < item.rating!
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-muted text-muted'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Content */}
          <div className="relative mb-6">
            <Quote className="absolute -top-2 -left-2 h-8 w-8 text-primary/10" />
            <p className="text-muted-foreground leading-relaxed pl-6">
              {item.content}
            </p>
          </div>

          {/* Author */}
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              {avatarType !== 'none' ? (
                <OptimizedImage
                  src={avatarUrl}
                  alt={item.name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-semibold">
                  {item.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold">{item.name}</p>
              {item.role && (
                <p className="text-sm text-muted-foreground">{item.role}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30 overflow-hidden">
      <div className="container px-4 mb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <Badge variant="secondary" className="mb-4">
            <Star className="h-3 w-3 mr-1 fill-current" />
            Customer Reviews
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">{title}</h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground">{subtitle}</p>
          )}
        </motion.div>
      </div>

      {/* Marquee Container */}
      <div className="relative">
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        {/* First Row - Left to Right */}
        <motion.div
          animate={{
            x: ['0%', '-33.333%'],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="flex mb-6"
        >
          {duplicatedItems.map((item, index) =>
            renderTestimonialCard(item, index)
          )}
        </motion.div>

        {/* Second Row - Right to Left (if enough items) */}
        {items.length > 3 && (
          <motion.div
            animate={{
              x: ['-33.333%', '0%'],
            }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="flex"
          >
            {duplicatedItems.map((item, index) =>
              renderTestimonialCard(item, index + duplicatedItems.length)
            )}
          </motion.div>
        )}
      </div>

      {/* Bottom Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="container px-4 mt-16"
      >
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-bold mb-2">4.9</p>
            <div className="flex gap-1 mb-2 justify-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">Average Rating</p>
          </div>

          <div className="text-center">
            <p className="text-4xl md:text-5xl font-bold mb-2">
              {items.length}+
            </p>
            <p className="text-sm text-muted-foreground">Happy Customers</p>
          </div>

          <div className="text-center">
            <p className="text-4xl md:text-5xl font-bold mb-2">100%</p>
            <p className="text-sm text-muted-foreground">Satisfaction</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
