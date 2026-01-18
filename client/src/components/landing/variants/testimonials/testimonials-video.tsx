'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, Play } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { getImageSource } from '@/lib/cloudinary';
import type { Testimonial } from '@/types';

interface TestimonialsVideoProps {
  items: Testimonial[];
  title: string;
  subtitle?: string;
}

/**
 * Testimonials Variant: Video Testimonials
 *
 * Layout designed for video testimonials
 * Shows video placeholders with play buttons
 * Falls back to text testimonials with enhanced styling
 */
export function TestimonialsVideo({
  items,
  title,
  subtitle,
}: TestimonialsVideoProps) {
  if (items.length === 0) return null;

  return (
    <section id="testimonials" className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => {
          const key = item.id || `testimonial-${index}-${item.name.replace(/\s+/g, '-')}`;
          const { type: avatarType } = getImageSource(item.avatar);

          return (
            <Card key={key} className="relative overflow-hidden group">
              {/* Video Placeholder / Thumbnail */}
              <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                {avatarType !== 'none' ? (
                  <>
                    <OptimizedImage
                      src={item.avatar}
                      alt={item.name}
                      width={400}
                      height={225}
                      crop="fill"
                      className="object-cover w-full h-full opacity-40 group-hover:opacity-60 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer">
                        <Play className="h-8 w-8 text-white ml-1" />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer">
                    <Play className="h-8 w-8 text-white ml-1" />
                  </div>
                )}
              </div>

              {/* Content */}
              <CardContent className="pt-6">
                {typeof item.rating === 'number' && item.rating > 0 && (
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={`${key}-star-${i}`}
                        className={`h-4 w-4 ${
                          i < item.rating!
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-muted'
                        }`}
                      />
                    ))}
                  </div>
                )}

                <p className="text-sm text-muted-foreground mb-4 line-clamp-3 italic">
                  &quot;{item.content}&quot;
                </p>

                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 overflow-hidden">
                    {avatarType !== 'none' ? (
                      <OptimizedImage
                        src={item.avatar}
                        alt={item.name}
                        width={40}
                        height={40}
                        crop="thumb"
                        gravity="face"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <AvatarFallback>
                        {item.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    {item.role && (
                      <p className="text-sm text-muted-foreground">{item.role}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
