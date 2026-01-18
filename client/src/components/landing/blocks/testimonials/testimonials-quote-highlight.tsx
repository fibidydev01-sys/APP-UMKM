'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, Quote } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { getImageSource } from '@/lib/cloudinary';
import type { Testimonial } from '@/types';

interface TestimonialsQuoteHighlightProps {
  items: Testimonial[];
  title: string;
  subtitle?: string;
}

/**
 * Testimonials Variant: Quote Highlight
 *
 * Large featured quote style with emphasis on the testimonial text
 * Perfect for showcasing powerful customer feedback
 */
export function TestimonialsQuoteHighlight({
  items,
  title,
  subtitle,
}: TestimonialsQuoteHighlightProps) {
  if (items.length === 0) return null;

  // Feature first testimonial, show others in grid
  const [featured, ...rest] = items;

  return (
    <section id="testimonials" className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
      </div>

      {/* Featured Quote */}
      {featured && (
        <div className="mb-12 max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-8 md:p-12">
            <Quote className="h-16 w-16 text-primary/20 absolute top-6 left-6" />

            {typeof featured.rating === 'number' && featured.rating > 0 && (
              <div className="flex gap-1 justify-center mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={`featured-star-${i}`}
                    className={`h-6 w-6 ${
                      i < featured.rating!
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-muted'
                    }`}
                  />
                ))}
              </div>
            )}

            <blockquote className="text-xl md:text-2xl font-medium text-center mb-8 relative z-10">
              &quot;{featured.content}&quot;
            </blockquote>

            <div className="flex items-center justify-center gap-4">
              <Avatar className="h-12 w-12 overflow-hidden">
                {(() => {
                  const { type: avatarType } = getImageSource(featured.avatar);
                  return avatarType !== 'none' ? (
                    <OptimizedImage
                      src={featured.avatar}
                      alt={featured.name}
                      width={48}
                      height={48}
                      crop="thumb"
                      gravity="face"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <AvatarFallback className="text-lg">
                      {featured.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  );
                })()}
              </Avatar>
              <div className="text-center">
                <p className="font-semibold">{featured.name}</p>
                {featured.role && (
                  <p className="text-sm text-muted-foreground">{featured.role}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Additional Testimonials in Grid */}
      {rest.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((item) => {
            const key = item.id || `testimonial-${item.name.replace(/\s+/g, '-')}`;
            const { type: avatarType } = getImageSource(item.avatar);

            return (
              <div key={key} className="border rounded-lg p-6">
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

                <p className="text-muted-foreground mb-4 text-sm italic">
                  &quot;{item.content}&quot;
                </p>

                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 overflow-hidden">
                    {avatarType !== 'none' ? (
                      <OptimizedImage
                        src={item.avatar}
                        alt={item.name}
                        width={32}
                        height={32}
                        crop="thumb"
                        gravity="face"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <AvatarFallback className="text-xs">
                        {item.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    {item.role && (
                      <p className="text-xs text-muted-foreground">{item.role}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
